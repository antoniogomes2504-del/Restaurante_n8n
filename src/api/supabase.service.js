import { createClient } from '@supabase/supabase-js';
import { CONFIG, logger } from '../config';

export const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);

// Define table names explicitly for both environments
const PROD_TABLES = {
  MENU: 'cardapio',
  ORDERS: 'fila_impressao',
  DRIVERS: 'drivers',
  CUSTOMERS: 'clientes',
  CHAT: 'n8n_chat_histories',
};

const TEST_TABLES = {
  MENU: 'cardapio_teste',
  ORDERS: 'fila_impressao_teste',
  DRIVERS: 'drivers', // No drivers_teste in image, assuming shared or using prod
  CUSTOMERS: 'clientes_teste',
  CHAT: 'n8n_chat_histories_teste', // Adjusted based on user screenshot showing n8n_chat_histories_teste
};

// Select table set based on config
const TABLES = CONFIG.USE_TEST_DB ? TEST_TABLES : PROD_TABLES;

console.log(`[AUTH] Initialized in ${CONFIG.USE_TEST_DB ? 'TEST' : 'PRODUCTION'} mode`);

// Auth Services
export const authService = {
  signIn: (email, password) => supabase.auth.signInWithPassword({ email, password }),
  signUp: (email, password) => supabase.auth.signUp({ email, password }),
  signOut: () => supabase.auth.signOut(),
  getSession: () => supabase.auth.getSession(),
  onAuthStateChange: (callback) => supabase.auth.onAuthStateChange(callback),
};

// Data Services
export const dbService = {
  menu: {
    fetch: () => {
      logger.db(TABLES.MENU, 'SELECT');
      return supabase.from(TABLES.MENU).select('*').order('nome');
    },
    save: (item) => {
      const { id, ...data } = item;
      if (id) {
        logger.db(TABLES.MENU, 'UPDATE', `ID: ${id}`);
        return supabase.from(TABLES.MENU).update(data).eq('id', id);
      }
      logger.db(TABLES.MENU, 'INSERT');
      return supabase.from(TABLES.MENU).insert([data]);
    },
    delete: (id) => {
      logger.db(TABLES.MENU, 'DELETE', `ID: ${id}`);
      return supabase.from(TABLES.MENU).delete().eq('id', id);
    },
  },
  orders: {
    fetch: () => {
      logger.db(TABLES.ORDERS, 'SELECT');
      return supabase.from(TABLES.ORDERS).select('*').order('data_criacao', { ascending: false });
    },
    subscribe: (callback) => {
      logger.db(TABLES.ORDERS, 'SUBSCRIBE');
      return supabase
        .channel(`public:${TABLES.ORDERS}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: TABLES.ORDERS }, callback)
        .subscribe();
    },
    updateStatus: (id, status) => {
      logger.db(TABLES.ORDERS, 'UPDATE_STATUS', `ID: ${id}, Status: ${status}`);
      return supabase.from(TABLES.ORDERS).update({ status }).eq('id', id);
    },
    removeChannel: (channel) => supabase.removeChannel(channel),
  },
  drivers: {
    fetch: () => {
      logger.db(TABLES.DRIVERS, 'SELECT');
      return supabase.from(TABLES.DRIVERS).select('*').order('id');
    },
    add: (driver) => {
      const { id, ...data } = driver;
      if (id) {
        logger.db(TABLES.DRIVERS, 'UPDATE', `ID: ${id}`);
        return supabase.from(TABLES.DRIVERS).update(data).eq('id', id);
      }
      logger.db(TABLES.DRIVERS, 'INSERT');
      return supabase.from(TABLES.DRIVERS).insert([data]);
    },
    delete: (id) => {
      logger.db(TABLES.DRIVERS, 'DELETE', `ID: ${id}`);
      return supabase.from(TABLES.DRIVERS).delete().eq('id', id);
    },
  },
  customers: {
    fetch: () => {
      logger.db(TABLES.CUSTOMERS, 'SELECT');
      return supabase.from(TABLES.CUSTOMERS).select('*').order('nome');
    },
    save: (customer) => {
        const { id, ...data } = customer;
        if (id) {
            logger.db(TABLES.CUSTOMERS, 'UPDATE', `Phone: ${id}`);
            return supabase.from(TABLES.CUSTOMERS).update(data).eq('telefone', id);
        }
        logger.db(TABLES.CUSTOMERS, 'INSERT');
        return supabase.from(TABLES.CUSTOMERS).insert([data]);
    },
    delete: (telefone) => {
      logger.db(TABLES.CUSTOMERS, 'DELETE', `Phone: ${telefone}`);
      return supabase.from(TABLES.CUSTOMERS).delete().eq('telefone', telefone);
    },
    fetchByPhone: async (telefone) => {
      logger.db(TABLES.CUSTOMERS, 'SELECT_ONE', `Phone: ${telefone}`);
      const { data, error } = await supabase.from(TABLES.CUSTOMERS).select('*').eq('telefone', telefone).single();
      if (error && error.code !== 'PGRST116') throw error; // Re-throw if not "not found"
      return { data, error };
    },
    updateBotStatus: async (telefone, active) => {
      logger.db(TABLES.CUSTOMERS, 'UPSERT_BOT', `Phone: ${telefone}, Active: ${active}`);
      const { error } = await supabase.from(TABLES.CUSTOMERS).upsert(
        { telefone, bot_ativo: active },
        { onConflict: 'telefone' }
      );
      if (error) throw error;
      return { success: true };
    },
  },
  chat: {
    fetchLogs: (phone = null) => {
      logger.db(TABLES.CHAT, 'SELECT', phone ? `Phone: ${phone}` : 'All');
      // Using 'id' for order since n8n default table might not have created_at
      let query = supabase.from(TABLES.CHAT).select('*').order('id', { ascending: phone ? true : false });
      if (phone) {
        // n8n uses session_id in format "whatsapp::[PHONE]_vProducao"
        query = query.like('session_id', `%${phone}%`);
      }
      return query;
    },
    insertMessage: (messageData) => {
      logger.db(TABLES.CHAT, 'INSERT');
      // Solution: Put the sender info INSIDE the message JSON object
      // so we don't need to add a real column to the table.
      const n8nData = {
        session_id: `whatsapp::${messageData.telefone}_vProducao`,
        message: {
          type: 'human',
          content: messageData.mensagem,
          sender: 'dashboard', // We hide it here!
          additional_kwargs: {},
          response_metadata: {}
        }
      };
      return supabase.from(TABLES.CHAT).insert(n8nData);
    },
    subscribe: (phone, callback) => {
      logger.db(TABLES.CHAT, 'SUBSCRIBE', `Phone: ${phone}`);
      return supabase
        .channel(`chat_${phone}`)
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: TABLES.CHAT },
          (payload) => {
            // Only notify if it's the current session
            if (payload.new.session_id.includes(phone)) {
              callback(payload);
            }
          }
        )
        .subscribe();
    }
  },
  removeChannel: (channel) => supabase.removeChannel(channel),
};
