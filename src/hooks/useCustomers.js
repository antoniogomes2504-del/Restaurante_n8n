import { useState, useEffect } from 'react';
import { dbService } from '../api/supabase.service';
import telemetry from '../api/telemetry';

export const useCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await dbService.customers.fetch();
      if (error) {
        throw error;
      }
      
      const mappedCustomers = (data || []).map(c => ({
        ...c,
        name: c.nome,
        id: c.telefone // Use phone as ID if numeric ID is missing
      }));

      setCustomers(mappedCustomers);
    } catch (err) {
      console.error('Error fetching customers:', err);
      telemetry.logDatabaseError('clientes', 'fetch', err);
    } finally {
      setIsLoading(false);
    }
  };

  const saveCustomer = async (customer) => {
    try {
      const { error } = await dbService.customers.save(customer);
      if (error) throw error;
      await fetchCustomers();
    } catch (err) {
      console.error('Error saving customer:', err);
      telemetry.logDatabaseError('clientes', 'save', err);
    }
  };

  const deleteCustomer = async (id) => {
    try {
      const { error } = await dbService.customers.delete(id);
      if (error) throw error;
      await fetchCustomers();
    } catch (err) {
      console.error('Error deleting customer:', err);
      telemetry.logDatabaseError('clientes', 'delete', err);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return {
    customers,
    isLoading,
    saveCustomer,
    deleteCustomer,
    refreshCustomers: fetchCustomers
  };
};
