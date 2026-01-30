import React from 'react';
import { ShoppingBag, Bike, Package, Clock } from 'lucide-react';
import Badge from '../common/Badge';

const OrderQueue = ({ orders, onUpdateStatus }) => {
  const getStatusColor = (status) => {
    const s = status?.toLowerCase();
    switch (s) {
      case 'preparing': return 'bg-amber-900/30 text-amber-400 border-amber-800';
      case 'ready': return 'bg-purple-900/30 text-purple-400 border-purple-800';
      case 'delivering': return 'bg-blue-900/30 text-blue-400 border-blue-800';
      case 'concluido':
      case 'concluído':
      case 'completed': return 'bg-emerald-900/30 text-emerald-400 border-emerald-800';
      default: return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  const getStatusText = (status) => {
    const s = status?.toLowerCase();
    switch (s) {
      case 'preparing': return 'Na Cozinha';
      case 'ready': return 'Pronto/Aguard.';
      case 'delivering': return 'Em Rota';
      case 'pendente': return 'Pendente';
      case 'imprimindo': return 'Imprimindo';
      case 'concluido':
      case 'concluído':
      case 'completed': return 'Concluído';
      default: return status?.charAt(0).toUpperCase() + status?.slice(1);
    }
  };

  const renderActionButtons = (order) => {
    const s = order.status?.toLowerCase();

    if (s === 'preparing') {
      return (
        <button
          onClick={() => onUpdateStatus(order.id, 'READY')}
          className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded text-[10px] font-bold transition-colors"
        >
          Pronto
        </button>
      );
    }

    if (s === 'ready') {
      return (
        <button
          onClick={() => onUpdateStatus(order.id, 'DELIVERING')}
          className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-[10px] font-bold transition-colors"
        >
          Despachar
        </button>
      );
    }

    if (s === 'delivering') {
      return (
        <button
          onClick={() => onUpdateStatus(order.id, 'CONCLUÍDO')}
          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[10px] font-bold transition-colors"
        >
          Concluir
        </button>
      );
    }

    return null;
  };

  return (
    <div className="bg-slate-900 rounded-xl shadow-lg shadow-black/20 border border-slate-800 flex flex-col h-[600px]">
      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/50 rounded-t-xl">
        <h2 className="font-bold text-lg text-white flex items-center gap-2">
          <ShoppingBag size={20} className="text-orange-500" /> Fila de Pedidos
        </h2>
        <span className="text-xs bg-slate-800 border border-slate-700 px-2 py-1 rounded text-slate-300 animate-pulse">
          ● Recebendo
        </span>
      </div>
      <div className="overflow-auto p-3 space-y-2 flex-1 custom-scrollbar">
        {orders.map((order) => (
          <div key={order.id} className="p-4 bg-slate-800/40 border border-slate-800 rounded-xl hover:bg-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row gap-4">
            {/* Left Section: Icon and Customer Info */}
            <div className="flex gap-4 items-start min-w-0 flex-1">
              <div className={`h-12 w-12 rounded-xl flex items-center justify-center font-bold text-slate-900 border-2 shrink-0 ${order.type === 'delivery' ? 'bg-blue-400 border-blue-500/50' : 'bg-emerald-400 border-emerald-500/50'}`}>
                {order.type === 'delivery' ? <Bike size={24} /> : <Package size={24} />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h4 className="font-bold text-base text-white break-words">{order.customer_name || 'Cliente'}</h4>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${order.type === 'delivery' ? 'border-blue-700 bg-blue-900/40 text-blue-400' : 'border-emerald-700 bg-emerald-900/40 text-emerald-400'}`}>
                    {order.type === 'delivery' ? 'ENTREGA' : 'RETIRADA'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 opacity-80 mb-2 sm:mb-0">
                  {Array.isArray(order.items) && order.items.length > 0
                    ? order.items.map(i => i.item || i.nome || i).join(', ')
                    : 'Itens no pedido...'}
                </p>
                {/* Mobile only: Time under items */}
                <div className="sm:hidden text-[10px] text-slate-500 flex items-center gap-1">
                  <Clock size={12} /> {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>

            {/* Right Section: Price and Status/Actions */}
            <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-6 border-t sm:border-t-0 border-slate-700/50 pt-3 sm:pt-0">
              <div className="text-left sm:text-right">
                <p className="font-bold text-xl text-emerald-400 leading-none">R$ {Number(order.total || 0).toFixed(2)}</p>
                <div className="hidden sm:flex text-[10px] text-slate-500 items-center gap-1 justify-end mt-1">
                  <Clock size={12} /> {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>

              <div className="flex flex-col gap-2 min-w-[110px] sm:min-w-[120px] items-end">
                <Badge colorClass={getStatusColor(order.status)} className="w-full text-[10px] py-1.5 font-bold">
                  {getStatusText(order.status)}
                </Badge>
                {renderActionButtons(order)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderQueue;
