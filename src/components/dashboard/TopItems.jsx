import React from 'react';
import { BarChart3 } from 'lucide-react';

const TopItems = ({ items }) => {
  return (
    <div className="bg-slate-900 rounded-xl shadow-lg shadow-black/20 border border-slate-800 overflow-hidden">
      <div className="p-4 border-b border-slate-800 bg-slate-800/50">
        <h2 className="font-bold text-white flex items-center gap-2">
          <BarChart3 size={20} className="text-purple-500" /> Mais Vendidos
        </h2>
      </div>
      <div className="p-4 space-y-4">
        {items.map((item, index) => (
          <div key={index} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-slate-300">{index + 1}. {item.name}</span>
              <span className="font-bold text-white">{item.count} un.</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div className="bg-purple-600 h-2 rounded-full shadow-lg shadow-purple-500/20" style={{ width: `${(item.count / 50) * 100}%` }}></div>
            </div>
            <p className="text-xs text-slate-500 text-right">R$ {item.revenue}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopItems;
