import { useState, useEffect } from 'react';
import { dbService } from '../api/supabase.service';
import telemetry from '../api/telemetry';

export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const { data, error } = await dbService.orders.fetch();
      if (error) {
        console.error('[DB] Error fetching orders:', error);
        throw error;
      }
      
      // Map production DB fields to UI fields
      const mappedOrders = (data || []).map(order => {
        const pJson = order.pedido_json || {};
        const products = pJson.products || [];
        const shipping = pJson.shipping_cost || 0;
        
        // Calculate total based strictly on products
        const total = products.reduce((acc, p) => acc + (Number(p.price) || 0), 0);

        return {
          ...order,
          customer_name: order.cliente_nome,
          total: total,
          type: pJson.order_type?.toLowerCase() === 'delivery' ? 'delivery' : 'takeout',
          items: products.map(p => ({
            ...p,
            item: p.name // Alias for UI
          })),
          created_at: order.data_criacao,
          status: (() => {
            const s = (order.status || 'PENDENTE').toUpperCase();
            if (s === 'PENDENTE' || s === 'IMPRIMINDO') return 'preparing';
            if (s === 'READY') return 'ready';
            if (s === 'DELIVERING') return 'delivering';
            if (s === 'CONCLUÍDO' || s === 'CONCLUIDO' || s === 'COMPLETED') return 'completed';
            if (s === 'CANCELADO') return 'cancelled';
            return s.toLowerCase();
          })()
        };
      });

      setOrders(mappedOrders);
    } catch (err) {
      console.error('Error fetching orders:', err);
      telemetry.logDatabaseError('fila_impressao', 'fetch', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    const subscription = dbService.orders.subscribe((payload) => {
      console.log('Real-time order change:', payload);
      fetchOrders();
      if (payload.eventType === 'INSERT') {
          telemetry.logOrder(payload.new.id, payload.new.total);
      }
    });

    return () => {
      dbService.orders.removeChannel(subscription);
    };
  }, []);

  const stats = {
    totalRevenue: orders.reduce((acc, order) => acc + (Number(order.total) || 0), 0),
    activeOrdersCount: orders.filter(o => o.status !== 'concluído' && o.status !== 'cancelado' && o.status !== 'completed' && o.status !== 'cancelled').length,
    deliveryCount: orders.filter(o => o.type === 'delivery').length,
    takeoutCount: orders.filter(o => o.type === 'takeout').length
  };

  const todayOrders = orders.filter(order => {
    const today = new Date().toISOString().split('T')[0];
    return order.data_criacao?.startsWith(today);
  });

  const updateOrderStatus = async (id, status) => {
    try {
      const { error } = await dbService.orders.updateStatus(id, status);
      if (error) throw error;
      await fetchOrders();
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Erro ao atualizar status do pedido');
    }
  };

  return { orders, todayOrders, stats, isLoading, refreshOrders: fetchOrders, updateOrderStatus };
};
