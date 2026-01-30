import React from 'react';
import { UtensilsCrossed, X, Search, Plus, Edit2, Trash2, Save } from 'lucide-react';

const MenuModal = ({
  isMenuOpen,
  setIsMenuOpen,
  isAddingItem,
  setIsAddingItem,
  editingItem,
  setEditingItem,
  filteredMenu,
  categories,
  handleSaveItem,
  handleDeleteItem,
  searchTerm,
  setSearchTerm,
  activeCategory,
  setActiveCategory
}) => {
  return (
    <>
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      <div className={`fixed top-0 right-0 h-full w-full md:w-[540px] bg-slate-900 z-50 shadow-2xl transform transition-transform duration-300 ease-in-out border-l border-slate-800 flex flex-col ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <UtensilsCrossed className="text-orange-500" size={20} />
              Gerir Cardápio
            </h2>
            <p className="text-sm text-slate-400">Adicione, edite ou remova pratos</p>
          </div>
          <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {(editingItem || isAddingItem) && (
          <div className="p-6 bg-slate-800 border-b border-slate-700 animate-in slide-in-from-top duration-300">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-white">{isAddingItem ? 'Novo Item' : 'Editar Item'}</h3>
              <button onClick={() => { setEditingItem(null); setIsAddingItem(false); }} className="text-xs text-slate-400 hover:text-white">Cancelar</button>
            </div>
            <form onSubmit={handleSaveItem} className="space-y-3">
              <input name="nome" defaultValue={editingItem?.nome} placeholder="Nome do Prato" required className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white text-sm" />
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Único</label>
                  <input name="preco_unico" type="number" step="0.01" defaultValue={editingItem?.preco_unico} placeholder="0.00" className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white text-sm" />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Pequeno (P)</label>
                  <input name="preco_p" type="number" step="0.01" defaultValue={editingItem?.preco_p} placeholder="0.00" className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white text-sm" />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Grande (G)</label>
                  <input name="preco_g" type="number" step="0.01" defaultValue={editingItem?.preco_g} placeholder="0.00" className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white text-sm" />
                </div>
              </div>
              <select name="categoria" defaultValue={editingItem?.categoria || 'Pratos Principais'} className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white text-sm">
                {categories.filter(c => c !== 'Todos').map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <textarea name="descricao" defaultValue={editingItem?.descricao} placeholder="Descrição curta..." className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white text-sm h-20" />
              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded flex items-center justify-center gap-2">
                <Save size={18} /> Salvar Item
              </button>
            </form>
          </div>
        )}

        <div className="p-6 pb-2 space-y-4 bg-slate-900">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text"
              placeholder="Buscar prato..."
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:border-orange-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeCategory === cat ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/20' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white border border-slate-700'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 pr-4 pt-2 space-y-3 custom-scrollbar bg-slate-900">
          {filteredMenu.length === 0 ? (
            <div className="text-center py-10 text-slate-500"><p>Nenhum item encontrado.</p></div>
          ) : (
            filteredMenu.map(item => (
              <div key={item.id} className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-800 hover:border-slate-600 transition-all group relative">
                <div className="h-16 w-16 bg-slate-700 rounded-lg flex items-center justify-center text-3xl shadow-inner shrink-0">🍽️</div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-white group-hover:text-orange-400 transition-colors">{item.nome}</h3>
                    <div className="text-right">
                      {item.preco_unico ? (
                        <span className="font-bold text-emerald-400 block text-lg">R$ {Number(item.preco_unico).toFixed(2)}</span>
                      ) : (
                        <div className="flex flex-col items-end gap-1">
                          {item.preco_p && <span className="text-xs md:text-sm text-slate-400 font-bold uppercase"><span className="text-blue-400">P:</span> R$ {Number(item.preco_p).toFixed(2)}</span>}
                          {item.preco_g && <span className="text-xs md:text-sm text-slate-400 font-bold uppercase"><span className="text-orange-400">G:</span> R$ {Number(item.preco_g).toFixed(2)}</span>}
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{item.descricao}</p>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">{item.categoria}</span>
                    <div className="flex gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setEditingItem(item); setIsAddingItem(false); }} className="p-1.5 bg-slate-700 hover:bg-blue-600 text-white rounded shadow-sm"><Edit2 size={14} /></button>
                      <button onClick={() => handleDeleteItem(item.id)} className="p-1.5 bg-slate-700 hover:bg-red-600 text-white rounded shadow-sm"><Trash2 size={14} /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {!editingItem && !isAddingItem && (
          <div className="p-4 border-t border-slate-800 bg-slate-900">
            <button onClick={() => { setIsAddingItem(true); setEditingItem(null); }} className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-orange-900/20 flex items-center justify-center gap-2">
              <Plus size={20} /> Adicionar Novo Item
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default MenuModal;
