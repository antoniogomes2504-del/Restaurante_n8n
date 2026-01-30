import React from 'react';
import { AlertCircle, Clock, DollarSign } from 'lucide-react';

const InfoBar = () => {
  return (
    <div className="flex flex-wrap gap-4 text-[10px] md:text-xs text-slate-400 bg-slate-900/50 p-3 rounded-lg border border-slate-800">
      <span className="flex items-center gap-1"><Clock size={14} className="text-orange-500" /> Funcionamento: 07:30h às 14:00h</span>
      <span className="flex items-center gap-1"><AlertCircle size={14} className="text-orange-500" /> Cancelamento até 10:00h</span>
      <span className="flex items-center gap-1"><DollarSign size={14} className="text-orange-500" /> Motoqueiro não leva troco</span>
    </div>
  );
};

export default InfoBar;
