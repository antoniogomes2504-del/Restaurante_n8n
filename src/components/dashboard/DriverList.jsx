import React from 'react';
import { Bike, Edit2, Plus, UserPlus, MapPin, CheckCircle2, Save, Trash2 } from 'lucide-react';

const DriverList = ({
  drivers,
  isManagingDrivers,
  setIsManagingDrivers,
  newDriverName,
  setNewDriverName,
  handleAddDriver,
  handleDeleteDriver,
  editingDriverId,
  setEditingDriverId,
  editDriverName,
  setEditDriverName,
  saveEditDriver
}) => {
  return (
    <div className="bg-slate-900 rounded-xl shadow-lg shadow-black/20 border border-slate-800 overflow-hidden">
      <div className="p-4 border-b border-slate-800 bg-slate-800/50 flex justify-between items-center">
        <h2 className="font-bold text-white flex items-center gap-2">
          <Bike size={20} className="text-blue-500" /> Entregadores
        </h2>
        <button
          onClick={() => setIsManagingDrivers(!isManagingDrivers)}
          className={`p-1.5 rounded transition-colors ${isManagingDrivers ? 'bg-blue-600 text-white' : 'hover:bg-slate-700 text-slate-400'}`}
          title="Gerenciar Motoqueiros"
        >
          <Edit2 size={16} />
        </button>
      </div>

      <div className="p-2">
        {isManagingDrivers && (
          <div className="p-2 mb-2 bg-slate-800/50 rounded-lg flex gap-2 border border-slate-700">
            <input
              type="text"
              placeholder="Nome do novo motoqueiro..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-blue-500"
              value={newDriverName}
              onChange={(e) => setNewDriverName(e.target.value)}
            />
            <button onClick={handleAddDriver} className="bg-blue-600 hover:bg-blue-500 text-white p-1.5 rounded">
              <UserPlus size={16} />
            </button>
          </div>
        )}

        {drivers.map(driver => (
          <div key={driver.id} className="flex items-center justify-between p-3 hover:bg-slate-800 rounded-lg transition-colors border-b last:border-0 border-slate-800/50 group">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative">
                <div className="h-10 w-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                  <span className="font-bold text-xs text-slate-400">{driver.name[0]}</span>
                </div>
                <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-slate-900 ${driver.status === 'available' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
              </div>

              <div className="flex-1">
                {editingDriverId === driver.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editDriverName}
                      onChange={(e) => setEditDriverName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-600 rounded px-1 py-0.5 text-sm text-white"
                    />
                    <button onClick={saveEditDriver} className="text-emerald-400 hover:text-emerald-300"><Save size={14} /></button>
                  </div>
                ) : (
                  <>
                    <p className="font-semibold text-sm text-slate-200">{driver.name}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      {driver.status === 'busy' ? <MapPin size={10} /> : <CheckCircle2 size={10} />}
                      {driver.status === 'busy' ? (driver.location || 'Em rota') : 'Na base'}
                    </p>
                  </>
                )}
              </div>
            </div>

            {isManagingDrivers && (
              <div className="flex gap-1 ml-2">
                {editingDriverId !== driver.id && (
                  <button onClick={() => { setEditingDriverId(driver.id); setEditDriverName(driver.name); }} className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-700 rounded"><Edit2 size={14} /></button>
                )}
                <button onClick={() => handleDeleteDriver(driver.id)} className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded"><Trash2 size={14} /></button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DriverList;
