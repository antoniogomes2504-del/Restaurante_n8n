import React, { useState, useEffect } from 'react';
import { Package, BarChart3, UtensilsCrossed, Clock, LogOut, MessagesSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = ({ onOpenReports, onOpenMenu, onLogout }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex justify-between items-center shadow-md sticky top-0 z-10 transition-all">
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
        <div className="bg-orange-600 p-2 rounded-lg shadow-lg shadow-orange-900/20">
          <Package className="text-white" size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Hildebrando</h1>
          <p className="text-xs text-slate-400 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Delivery & Retirada
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1 md:gap-4">
        <button
          onClick={() => navigate('/chat')}
          className="flex items-center gap-2 bg-emerald-600/10 hover:bg-emerald-600 text-emerald-500 hover:text-white p-2 md:px-3 md:py-2 rounded-lg transition-all border border-emerald-500/20"
        >
          <MessagesSquare size={18} />
          <span className="hidden lg:inline text-sm font-medium">Chat Ativo</span>
        </button>

        <button
          onClick={onOpenReports}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 p-2 md:px-3 md:py-2 rounded-lg transition-colors border border-slate-700"
        >
          <BarChart3 size={18} className="text-purple-400" />
          <span className="hidden lg:inline text-sm font-medium">Relatórios</span>
        </button>

        <button
          onClick={onOpenMenu}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 p-2 md:px-3 md:py-2 rounded-lg transition-colors border border-slate-700"
        >
          <UtensilsCrossed size={18} />
          <span className="hidden lg:inline text-sm font-medium">Gerir Cardápio</span>
        </button>

        <div className="text-right hidden xl:block border-l border-slate-700 pl-4 ml-2">
          <p className="text-sm font-medium text-white">{currentTime.toLocaleDateString()}</p>
          <p className="text-xs text-slate-400 font-mono flex items-center justify-end gap-1">
            <Clock size={10} /> {currentTime.toLocaleTimeString()}
          </p>
        </div>

        <button
          onClick={onLogout}
          className="flex items-center gap-2 bg-red-900/20 hover:bg-red-900/30 text-red-400 p-2 md:px-3 md:py-2 rounded-lg transition-colors border border-red-800/50"
          title="Sair"
        >
          <LogOut size={18} />
          <span className="hidden lg:inline text-sm font-medium">Sair</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
