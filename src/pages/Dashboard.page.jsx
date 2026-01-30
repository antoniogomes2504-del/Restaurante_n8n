import React, { useState, useEffect } from 'react';
import { useOrders } from '../hooks/useOrders';
import { useMenu } from '../hooks/useMenu';
import { useDrivers } from '../hooks/useDrivers';
import { useReports } from '../hooks/useReports';

import Header from '../components/dashboard/Header';
import InfoBar from '../components/dashboard/InfoBar';
import KpiContainer from '../components/dashboard/KpiContainer';
import OrderQueue from '../components/dashboard/OrderQueue';
import DriverList from '../components/dashboard/DriverList';
import TopItems from '../components/dashboard/TopItems';
import ReportsModal from '../components/dashboard/ReportsModal';
import MenuModal from '../components/dashboard/MenuModal';

const DashboardPage = ({ onLogout }) => {
  // --- UI STATES ---
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportPeriod, setReportPeriod] = useState('today');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Lock body scroll when any modal is open
  useEffect(() => {
    if (isMenuOpen || isReportOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
  }, [isMenuOpen, isReportOpen]);

  // Dashboard management states
  const [editingItem, setEditingItem] = useState(null);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [isManagingDrivers, setIsManagingDrivers] = useState(false);
  const [editingDriverId, setEditingDriverId] = useState(null);
  const [editDriverName, setEditDriverName] = useState('');
  const [newDriverName, setNewDriverName] = useState('');

  const categories = ['Todos', 'Pratos Principais', 'Saladas', 'Bebidas', 'Outros'];

  // --- HOOKS ---
  const { todayOrders, orders, stats: orderStats, updateOrderStatus } = useOrders();
  const { filteredMenu, saveItem, deleteItem } = useMenu(activeCategory, searchTerm);
  const { drivers, stats: driverStats, addDriver, deleteDriver, updateDriver } = useDrivers();
  const { currentReport } = useReports(orders, reportPeriod);

  // Mocked top items as in the user requirement
  const topItemsData = [
    { name: 'Bife Acebolado (G)', count: 45, revenue: 855 },
    { name: 'Lasanha Frango', count: 32, revenue: 576 },
    { name: 'Carne do Sol', count: 28, revenue: 476 },
    { name: 'Suco 500ml', count: 25, revenue: 225 },
  ];

  // --- ACTIONS ---
  const handleSaveMenuItem = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const itemData = {
      nome: formData.get('nome'),
      preco_unico: formData.get('preco_unico') ? parseFloat(formData.get('preco_unico')) : null,
      preco_p: formData.get('preco_p') ? parseFloat(formData.get('preco_p')) : null,
      preco_g: formData.get('preco_g') ? parseFloat(formData.get('preco_g')) : null,
      categoria: formData.get('categoria'),
      descricao: formData.get('descricao')
    };

    if (editingItem && !isAddingItem) {
      itemData.id = editingItem.id;
    }

    try {
      await saveItem(itemData);
      setEditingItem(null);
      setIsAddingItem(false);
    } catch (err) {
      alert(`Erro ao salvar item no cardápio: ${err.message}`);
    }
  };

  const handleSaveDriver = async () => {
    if (!editDriverName.trim()) return;
    try {
      await updateDriver({ id: editingDriverId, name: editDriverName });
      setEditingDriverId(null);
    } catch (err) {
      alert(`Erro ao atualizar motoqueiro: ${err.message}`);
    }
  };

  const handleAddNewDriver = async () => {
    if (!newDriverName.trim()) return;
    await addDriver(newDriverName);
    setNewDriverName('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans overflow-x-hidden">
      <style>{`
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: #0f172a; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #475569; }
        
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #475569; border-radius: 10px; border: 1px solid #0f172a; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #64748b; }
        
        body.modal-open { overflow: hidden !important; }
      `}</style>

      <Header
        onOpenReports={() => setIsReportOpen(true)}
        onOpenMenu={() => setIsMenuOpen(true)}
        onLogout={onLogout}
      />

      <main className="p-6 mx-auto space-y-6">
        <InfoBar />

        <KpiContainer
          totalRevenue={orderStats.totalRevenue}
          activeOrders={orderStats.activeOrdersCount}
          deliveryCount={orderStats.deliveryCount}
          availableDrivers={driverStats.availableCount}
          totalDrivers={driverStats.totalCount}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <OrderQueue orders={orders} onUpdateStatus={updateOrderStatus} />
          </div>

          <div className="space-y-6">
            <DriverList
              drivers={drivers}
              isManagingDrivers={isManagingDrivers}
              setIsManagingDrivers={setIsManagingDrivers}
              newDriverName={newDriverName}
              setNewDriverName={setNewDriverName}
              handleAddDriver={handleAddNewDriver}
              handleDeleteDriver={deleteDriver}
              editingDriverId={editingDriverId}
              setEditingDriverId={setEditingDriverId}
              editDriverName={editDriverName}
              setEditDriverName={setEditDriverName}
              saveEditDriver={handleSaveDriver}
            />

            <TopItems items={topItemsData} />
          </div>
        </div>
      </main>

      <ReportsModal
        isReportOpen={isReportOpen}
        setIsReportOpen={setIsReportOpen}
        reportPeriod={reportPeriod}
        setReportPeriod={setReportPeriod}
        currentReport={currentReport}
      />

      <MenuModal
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        isAddingItem={isAddingItem}
        setIsAddingItem={setIsAddingItem}
        editingItem={editingItem}
        setEditingItem={setEditingItem}
        filteredMenu={filteredMenu}
        categories={categories}
        handleSaveItem={handleSaveMenuItem}
        handleDeleteItem={deleteItem}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />
    </div>
  );
};

export default DashboardPage;
