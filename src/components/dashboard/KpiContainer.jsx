import React from 'react';
import { DollarSign, ShoppingBag, Bike, Clock } from 'lucide-react';

const KpiCard = ({ title, value, subtitle, icon: Icon, colorClass, subtitleColor = 'text-slate-500' }) => (
  <div className="bg-slate-900 p-4 rounded-xl shadow-lg shadow-black/20 border border-slate-800 flex items-center justify-between">
    <div>
      <p className="text-sm text-slate-400 font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-white">{value}</h3>
      {subtitle && <p className={`text-xs mt-1 ${subtitleColor}`}>{subtitle}</p>}
    </div>
    <div className={`${colorClass} p-3 rounded-full`}>
      <Icon size={24} />
    </div>
  </div>
);

const KpiContainer = ({ totalRevenue, activeOrders, deliveryCount, availableDrivers, totalDrivers }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <KpiCard
        title="Faturamento"
        value={`R$ ${totalRevenue.toFixed(2)}`}
        subtitle="Hoje (Tempo Real)"
        subtitleColor="text-emerald-400"
        icon={DollarSign}
        colorClass="bg-emerald-900/20 text-emerald-400"
      />

      <KpiCard
        title="Pedidos Ativos"
        value={activeOrders}
        subtitle={`(${deliveryCount} entregas)`}
        icon={ShoppingBag}
        colorClass="bg-orange-900/20 text-orange-400"
      />

      <KpiCard
        title="Motoqueiros"
        value={`${availableDrivers}/${totalDrivers}`}
        subtitle="Livres na base"
        icon={Bike}
        colorClass={availableDrivers === 0 ? 'bg-red-900/20 text-red-400' : 'bg-blue-900/20 text-blue-400'}
      />

      <KpiCard
        title="Tempo Médio"
        value="45 min"
        subtitle="Entrega"
        subtitleColor="text-emerald-400"
        icon={Clock}
        colorClass="bg-purple-900/20 text-purple-400"
      />
    </div>
  );
};

export default KpiContainer;
