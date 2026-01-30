import React, { useState, useEffect, useRef } from 'react';
import { dbService } from '../api/supabase.service';
import { CONFIG } from '../config';
import {
  Search,
  Send,
  User,
  Bot,
  UserCheck,
  Unlock,
  Lock,
  ArrowLeft,
  MessageCircle,
  MoreVertical,
  Phone
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ChatPage = ({ onLogout }) => {
  const [contacts, setContacts] = useState([]);
  const [selectedPhone, setSelectedPhone] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [toasts, setToasts] = useState([]);
  const [botAtivo, setBotAtivo] = useState(true);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const addToast = (text, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  // Fetch unique contacts
  const fetchContacts = async () => {
    try {
      const { data, error } = await dbService.chat.fetchLogs();
      if (error) throw error;

      const uniqueContacts = [];
      const seenPhones = new Set();

      data.forEach(msg => {
        // Extract phone from "whatsapp::558597932167_vProducao"
        const phoneMatch = msg.session_id.match(/::(\d+)/);
        const phone = phoneMatch ? phoneMatch[1] : msg.session_id;

        if (!seenPhones.has(phone)) {
          seenPhones.add(phone);
          uniqueContacts.push({
            telefone: phone,
            lastMessage: typeof msg.message === 'object' ? msg.message.content : msg.message,
            timestamp: new Date().toISOString() // Fallback since created_at is missing
          });
        }
      });

      setContacts(uniqueContacts);
    } catch (err) {
      console.error('Error fetching contacts:', err);
    }
  };

  // Fetch messages for selected contact
  const fetchMessages = async (phone) => {
    if (!phone) return;
    try {
      const { data, error } = await dbService.chat.fetchLogs(phone);
      if (error) throw error;
      setMessages(data);

      // Fetch customer bot status
      const { data: customerData } = await dbService.customers.fetchByPhone(phone);
      if (customerData) {
        setBotAtivo(customerData.bot_ativo !== false); // Default to true if not specified
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    if (selectedPhone) {
      fetchMessages(selectedPhone);

      // Realtime subscription using dbService
      const channel = dbService.chat.subscribe(selectedPhone, (payload) => {
        // Payload data cleanup for UI
        const newMsgRaw = payload.new;
        setMessages(prev => [...prev, newMsgRaw]);

        // Also update contact list last message
        setContacts(prev => {
          const phoneMatch = newMsgRaw.session_id.match(/::(\d+)/);
          const phone = phoneMatch ? phoneMatch[1] : newMsgRaw.session_id;

          const others = prev.filter(c => c.telefone !== phone);
          const msgContent = typeof newMsgRaw.message === 'object' ? newMsgRaw.message.content : newMsgRaw.message;

          return [{
            telefone: phone,
            lastMessage: msgContent,
            timestamp: new Date().toISOString()
          }, ...others];
        });
      });

      return () => {
        dbService.removeChannel(channel);
      };
    }
  }, [selectedPhone]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMsg.trim() || !selectedPhone) return;

    const messageContent = newMsg.trim();
    setNewMsg('');

    try {
      // 1. Insert into Supabase
      const { error: insertError } = await dbService.chat.insertMessage({
        telefone: selectedPhone,
        mensagem: messageContent,
        remetente: 'humano'
      });

      if (insertError) throw insertError;

      // 2. n8n webhooks using CONFIG
      const webhookUrl = CONFIG.N8N_BASE_URL;

      // Using URLSearchParams (x-www-form-urlencoded) is a "simple request"
      // that often bypasses CORS preflight blocks.
      const params = new URLSearchParams();
      params.append('telefone', selectedPhone);
      params.append('mensagem', messageContent);

      await fetch(`${webhookUrl}/webhook/enviar-mensagem`, {
        method: 'POST',
        body: params
      }).catch(err => console.error('Erro ao chamar webhook de envio:', err));

      const controlParams = new URLSearchParams();
      controlParams.append('telefone', selectedPhone);

      await fetch(`${webhookUrl}/webhook/bloquear-bot`, {
        method: 'POST',
        body: controlParams
      }).catch(err => console.error('Erro ao renovar bloqueio:', err));

      // Update DB to block bot
      await dbService.customers.updateBotStatus(selectedPhone, false);
      setBotAtivo(false);

    } catch (err) {
      console.error('Error sending message:', err);
      addToast('Erro ao enviar mensagem', 'error');
    }
  };

  const handleAssumirMesa = async () => {
    try {
      const params = new URLSearchParams();
      params.append('telefone', selectedPhone);

      await fetch(`${CONFIG.N8N_BASE_URL}/webhook/bloquear-bot`, {
        method: 'POST',
        body: params
      });

      // Update DB to block bot persistently
      await dbService.customers.updateBotStatus(selectedPhone, false);
      setBotAtivo(false);

      addToast('Você assumiu este atendimento');
    } catch (err) {
      console.error('Error assuming table:', err);
    }
  };

  const handleFinalizar = async () => {
    try {
      const params = new URLSearchParams();
      params.append('telefone', selectedPhone);

      await fetch(`${CONFIG.N8N_BASE_URL}/webhook/liberar-bot`, {
        method: 'POST',
        body: params
      });

      // Update DB to reactivate bot
      await dbService.customers.updateBotStatus(selectedPhone, true);
      setBotAtivo(true);

      addToast('IA reativa para este cliente');
    } catch (err) {
      console.error('Error finishing table:', err);
    }
  };

  const filteredContacts = contacts.filter(c =>
    c.telefone.includes(searchTerm) ||
    (c.lastMessage && c.lastMessage.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden">
      {/* Toast Notification Layer */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`px-4 py-2 rounded-lg shadow-lg text-sm font-medium animate-in slide-in-from-right fade-in ${toast.type === 'error' ? 'bg-red-600' :
              toast.type === 'warning' ? 'bg-yellow-500 text-slate-900' :
                'bg-emerald-600'
              }`}
          >
            {toast.text}
          </div>
        ))}
      </div>

      {/* Sidebar */}
      <div className={`w-full md:w-80 border-r border-slate-800 flex flex-col bg-slate-900 transition-all ${selectedPhone ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-slate-800 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white flex items-center gap-2"
            >
              <ArrowLeft size={18} />
              <span className="text-sm font-medium">Voltar</span>
            </button>
            <h1 className="font-bold text-lg">Atendimento</h1>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input
              type="text"
              placeholder="Buscar telefone..."
              className="w-full bg-slate-800 border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-orange-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {filteredContacts.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <MessageCircle className="mx-auto mb-2 opacity-20" size={48} />
              <p className="text-sm">Nenhuma conversa encontrada</p>
            </div>
          ) : (
            filteredContacts.map(contact => (
              <div
                key={contact.telefone}
                onClick={() => setSelectedPhone(contact.telefone)}
                className={`p-4 border-b border-slate-800/50 cursor-pointer transition-colors flex gap-3 items-start ${selectedPhone === contact.telefone ? 'bg-slate-800' : 'hover:bg-slate-800/40'}`}
              >
                <div className="bg-slate-700 p-2 rounded-full">
                  <User size={20} className="text-slate-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <p className="font-semibold text-slate-200 truncate">{contact.telefone}</p>
                    <span className="text-xs text-slate-500">
                      {new Date(contact.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 truncate">{contact.lastMessage}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col bg-slate-950 transition-all ${!selectedPhone ? 'hidden md:flex' : 'flex'}`}>
        {!selectedPhone ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 px-6 text-center">
            <div className="bg-slate-900/50 p-6 rounded-full mb-4">
              <MessageCircle size={64} className="text-slate-700" />
            </div>
            <h2 className="text-xl font-semibold text-slate-300 mb-2">Bem-vindo ao Atendimento Live</h2>
            <p className="max-w-xs text-sm">Selecione uma conversa na lateral para começar a interagir em tempo real com seus clientes.</p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedPhone(null)}
                  className="md:hidden p-2 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <ArrowLeft size={18} />
                </button>
                <div className="bg-orange-600/20 p-2 rounded-full">
                  <Phone size={20} className="text-orange-500" />
                </div>
                <div>
                  <h2 className="font-bold text-white">{selectedPhone}</h2>
                  <div className="flex items-center gap-3">
                    <p className="text-[10px] text-emerald-500 flex items-center gap-1 uppercase tracking-wider font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Em tempo real
                    </p>
                    <p className={`text-[10px] flex items-center gap-1 uppercase tracking-wider font-bold ${botAtivo ? 'text-blue-400' : 'text-yellow-500'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${botAtivo ? 'bg-blue-400' : 'bg-yellow-500'}`}></span>
                      Agent {botAtivo ? 'ON' : 'OFF'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleAssumirMesa}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${!botAtivo
                    ? 'bg-yellow-500 text-slate-950 border-yellow-500 shadow-lg shadow-yellow-500/20'
                    : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30 hover:bg-yellow-500 hover:text-slate-950'}`}
                >
                  <Lock size={14} />
                  <span className="hidden sm:inline">{!botAtivo ? 'Você no comando' : 'Assumir Chat'}</span>
                </button>
                <button
                  onClick={handleFinalizar}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${botAtivo
                    ? 'bg-emerald-500 text-slate-950 border-emerald-500 shadow-lg shadow-emerald-500/20'
                    : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30 hover:bg-emerald-500 hover:text-slate-950'}`}
                >
                  <Unlock size={14} />
                  <span className="hidden sm:inline">Ativar IA</span>
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-fixed opacity-95">
              {messages.map((msg, idx) => {
                const n8nMsg = typeof msg.message === 'object' ? msg.message : { type: 'ai', content: msg.message };

                // Now we check if 'sender' is hidden inside the message object or in the row
                const isHumano = (n8nMsg && n8nMsg.sender === 'dashboard') || msg.remetente === 'dashboard' || msg.remetente === 'humano';
                const isBot = n8nMsg.type === 'ai';
                const isCliente = n8nMsg.type === 'human' && !isHumano;

                // Real mapping for your specific case:
                // From n8n Memory: 'human' = Customer, 'ai' = Bot
                // From Dashboard Send: We mark as 'human' but we want to show as 'You' (orange)

                return (
                  <div
                    key={msg.id || idx}
                    className={`flex ${isCliente ? 'justify-start' : 'justify-end'}`}
                  >
                    <div className={`max-w-[80%] md:max-w-[60%] rounded-2xl p-3 shadow-md relative ${isCliente ? 'bg-slate-800 text-slate-100 rounded-tl-none' :
                      isHumano ? 'bg-orange-600 text-white rounded-tr-none' :
                        'bg-slate-700 text-slate-200 rounded-tr-none'
                      }`}>
                      <div className="flex items-center gap-1.5 mb-1 opacity-70">
                        {isCliente && <User size={10} />}
                        {isBot && <Bot size={10} />}
                        {isHumano && <UserCheck size={10} />}
                        <span className="text-[10px] font-bold uppercase tracking-tighter">
                          {isCliente ? 'Cliente' : isBot ? 'IA Assistente' : 'Você'}
                        </span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">
                        {(() => {
                          let text = n8nMsg.content || n8nMsg.text || '...';

                          // Check if text is raw JSON string from n8n Orchestrator
                          if (typeof text === 'string' && text.trim().startsWith('{')) {
                            try {
                              const parsed = JSON.parse(text);
                              if (parsed.output) {
                                if (typeof parsed.output === 'string') text = parsed.output;
                                else if (typeof parsed.output === 'object') {
                                  // Formatting the summary if it's the structured output
                                  const out = parsed.output;
                                  if (out.products) {
                                    const total = out.final_total || out.total || (out.products.reduce((acc, p) => acc + (p.price || 0), 0));
                                    text = `📝 *Resumo do Pedido*\n👤 Cliente: ${out.customer_name}\n📍 Endereço: ${out.address || 'Retirada'}\n💰 Total: R$ ${Number(total).toFixed(2)}\n💳 Pagamento: ${out.payment_method}`;
                                  } else {
                                    text = JSON.stringify(out, null, 2);
                                  }
                                }
                              }
                            } catch (e) { /* Not valid JSON, keep original */ }
                          }

                          // Clean up n8n system prompt remnants
                          if (typeof text === 'string') {
                            text = text.replace(/Esta é a mensagem do cliente:/gi, '');
                            text = text.replace(/Hoje é\s*:.*/gi, '');
                            text = text.replace(/Esta é a mensagem do dono do restaurante:/gi, '');
                          }
                          return text.trim();
                        })()}
                      </p>
                      <div className="text-[9px] mt-1 opacity-50 text-right">
                        {(() => {
                          const date = new Date(msg.created_at || msg.timestamp);
                          return isNaN(date.getTime())
                            ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                        })()}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-slate-900 border-t border-slate-800">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={newMsg}
                  onChange={(e) => setNewMsg(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 bg-slate-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-orange-500 transition-all text-slate-100"
                />
                <button
                  type="submit"
                  disabled={!newMsg.trim()}
                  className="bg-orange-600 hover:bg-orange-500 disabled:opacity-50 disabled:hover:bg-orange-600 text-white p-3 rounded-xl transition-all shadow-lg shadow-orange-900/20"
                >
                  <Send size={20} />
                </button>
              </form>
            </div>
          </>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
      `}</style>
    </div>
  );
};

export default ChatPage;
