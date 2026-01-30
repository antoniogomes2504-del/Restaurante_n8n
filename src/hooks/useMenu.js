import { useState, useEffect } from 'react';
import { dbService } from '../api/supabase.service';
import telemetry from '../api/telemetry';

export const useMenu = (activeCategory = 'Todos', searchTerm = '') => {
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMenu = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await dbService.menu.fetch();
      if (error) throw error;
      setMenuItems(data || []);
    } catch (err) {
      console.error('Error fetching menu:', err);
      telemetry.logDatabaseError('cardapio', 'fetch', err);
    } finally {
      setIsLoading(false);
    }
  };

  const saveItem = async (item) => {
    const trace = telemetry.trace('Save Menu Item', { itemName: item.nome });
    try {
      const { error } = await dbService.menu.save(item);
      if (error) throw error;
      trace.event({ name: 'Menu Item Saved Successfully' });
      await fetchMenu();
    } catch (err) {
      console.error('Error saving item:', err);
      telemetry.logDatabaseError('cardapio', 'save', err);
      throw err; // Re-throw to show alert in UI
    }
  };

  const deleteItem = async (id) => {
    try {
      const { error } = await dbService.menu.delete(id);
      if (error) throw error;
      await fetchMenu();
    } catch (err) {
      console.error('Error deleting item:', err);
      telemetry.logDatabaseError('cardapio', 'delete', err);
      throw err; // Re-throw to show alert in UI
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const filteredMenu = menuItems.filter(item => {
    const itemCat = (item.categoria || '').toLowerCase().trim();
    const activeCat = activeCategory.toLowerCase().trim();
    
    const matchesCategory = activeCat === 'todos' || itemCat === activeCat;
    const matchesSearch = (item.nome || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (item.descricao && item.descricao.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  return { menuItems, filteredMenu, isLoading, saveItem, deleteItem, refreshMenu: fetchMenu };
};
