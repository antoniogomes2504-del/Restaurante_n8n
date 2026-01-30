import React from 'react';
import { PieChart, X, ArrowUpRight, ArrowDownRight, UtensilsCrossed, Bike, AlertCircle } from 'lucide-react';
import ConicPieChart from '../common/ConicPieChart';

const ReportsModal = ({ isReportOpen, setIsReportOpen, reportPeriod, setReportPeriod, currentReport }) => {
  if (!isReportOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsReportOpen(false)}></div>
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar relative z-10">
        {/* Header Modal */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900 sticky top-0 z-20">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <PieChart className="text-purple-500" size={24} /> Relatórios de Observabilidade
            </h2>
            <p className="text-sm text-slate-400">Análise de desempenho e vendas</p>
          </div>
          <button onClick={() => setIsReportOpen(false)} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Filtro de Período */}
          <div className="flex gap-2 bg-slate-800 p-1 rounded-lg w-fit border border-slate-700">
            {[
              { id: 'today', label: 'Hoje' },
              { id: '7days', label: 'Últimos 7 Dias' },
              { id: '30days', label: 'Este Mês' }
            ].map((period) => (
              <button
                key={period.id}
                onClick={() => setReportPeriod(period.id)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${reportPeriod === period.id
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
              >
                {period.label}
              </button>
            ))}
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
              <p className="text-slate-400 text-sm font-medium mb-1">Faturamento Total</p>
              <h3 className="text-3xl font-bold text-white">R$ {currentReport.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
              <div className="flex items-center gap-1 text-emerald-400 text-xs mt-2 bg-emerald-900/20 w-fit px-2 py-1 rounded">
                <ArrowUpRight size={14} /> +15% vs período anterior
              </div>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
              <p className="text-slate-400 text-sm font-medium mb-1">Total de Pedidos</p>
              <h3 className="text-3xl font-bold text-white">{currentReport.totalOrders}</h3>
              <p className="text-xs text-slate-500 mt-2">Média de {(currentReport.totalOrders / (reportPeriod === 'today' ? 1 : reportPeriod === '7days' ? 7 : 30)).toFixed(1)} pedidos/dia</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
              <p className="text-slate-400 text-sm font-medium mb-1">Ticket Médio</p>
              <h3 className="text-3xl font-bold text-white">R$ {currentReport.avgTicket.toFixed(2)}</h3>
              <div className="flex items-center gap-1 text-red-400 text-xs mt-2 bg-red-900/20 w-fit px-2 py-1 rounded">
                <ArrowDownRight size={14} /> -2% vs período anterior
              </div>
            </div>
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-5">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <UtensilsCrossed size={18} className="text-orange-500" /> Vendas por Categoria
              </h3>
              <div className="flex justify-center">
                <ConicPieChart data={currentReport.categoryData} />
              </div>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-5">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Bike size={18} className="text-blue-500" /> Tipo de Pedido
              </h3>
              <div className="flex justify-center">
                <ConicPieChart data={currentReport.typeData} />
              </div>
            </div>
          </div>

          <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-4 flex gap-3 items-start">
            <AlertCircle className="text-blue-400 shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="font-bold text-blue-400 text-sm">Observação do Período</h4>
              <p className="text-sm text-slate-400 mt-1">
                O volume de entregas supera as retiradas em 72%. Considere alocar mais motoqueiros nos horários de pico (11h-13h) para manter o tempo médio abaixo de 45min.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ReportsModal;
