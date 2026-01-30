import { useState, useEffect } from 'react';
import { dbService } from '../api/supabase.service';
import telemetry from '../api/telemetry';

export const useDrivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDrivers = async () => {
    try {
      const { data, error } = await dbService.drivers.fetch();
      if (error) throw error;
      setDrivers(data || []);
    } catch (err) {
      console.error('Error fetching drivers:', err);
      telemetry.logDatabaseError('drivers', 'fetch', err);
    } finally {
      setIsLoading(false);
    }
  };

  const addDriver = async (name) => {
    try {
      const { error } = await dbService.drivers.add({ name, status: 'available' });
      if (error) throw error;
      telemetry.trace('Add Driver', { driverName: name }).event({ name: 'Driver Added' });
      await fetchDrivers();
    } catch (err) {
      console.error('Error adding driver:', err);
      telemetry.logDatabaseError('drivers', 'add', err);
    }
  };

  const updateDriver = async (driver) => {
    try {
      const { error } = await dbService.drivers.add(driver); // Reuse add for update logic
      if (error) throw error;
      await fetchDrivers();
    } catch (err) {
      console.error('Error updating driver:', err);
      telemetry.logDatabaseError('drivers', 'update', err);
    }
  };

  const deleteDriver = async (id) => {
    try {
      const { error } = await dbService.drivers.delete(id);
      if (error) throw error;
      await fetchDrivers();
    } catch (err) {
      console.error('Error deleting driver:', err);
      telemetry.logDatabaseError('drivers', 'delete', err);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const stats = {
    totalCount: drivers.length,
    availableCount: drivers.filter(d => d.status === 'available').length,
    busyCount: drivers.filter(d => d.status === 'busy').length,
  };

  return { drivers, stats, isLoading, addDriver, deleteDriver, updateDriver };
};
