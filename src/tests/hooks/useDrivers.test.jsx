import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useDrivers } from '../../hooks/useDrivers';
import { dbService } from '../../api/supabase.service';

vi.mock('../../api/supabase.service', () => ({
  dbService: {
    drivers: {
      fetch: vi.fn(),
      add: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

describe('useDrivers Hook', () => {
  const mockDrivers = [
    { id: 1, name: 'John', status: 'available' },
    { id: 2, name: 'Jane', status: 'busy' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches drivers on mount', async () => {
    dbService.drivers.fetch.mockResolvedValue({ data: mockDrivers, error: null });
    const { result } = renderHook(() => useDrivers());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.drivers).toEqual(mockDrivers);
    expect(result.current.stats.totalCount).toBe(2);
    expect(result.current.stats.availableCount).toBe(1);
    expect(result.current.stats.busyCount).toBe(1);
  });

  it('adds a driver and refreshes the list', async () => {
    dbService.drivers.fetch.mockResolvedValue({ data: mockDrivers, error: null });
    dbService.drivers.add.mockResolvedValue({ error: null });

    const { result } = renderHook(() => useDrivers());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.addDriver('Bob');
    });

    expect(dbService.drivers.add).toHaveBeenCalledWith({ name: 'Bob', status: 'available' });
    expect(dbService.drivers.fetch).toHaveBeenCalledTimes(2);
  });

  it('updates a driver and refreshes the list', async () => {
    dbService.drivers.fetch.mockResolvedValue({ data: mockDrivers, error: null });
    dbService.drivers.add.mockResolvedValue({ error: null });

    const { result } = renderHook(() => useDrivers());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.updateDriver({ id: 1, name: 'John Updated', status: 'busy' });
    });

    expect(dbService.drivers.add).toHaveBeenCalledWith({ id: 1, name: 'John Updated', status: 'busy' });
    expect(dbService.drivers.fetch).toHaveBeenCalledTimes(2);
  });

  it('deletes a driver and refreshes the list', async () => {
    dbService.drivers.fetch.mockResolvedValue({ data: mockDrivers, error: null });
    dbService.drivers.delete.mockResolvedValue({ error: null });

    const { result } = renderHook(() => useDrivers());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.deleteDriver(1);
    });

    expect(dbService.drivers.delete).toHaveBeenCalledWith(1);
    expect(dbService.drivers.fetch).toHaveBeenCalledTimes(2);
  });

  it('handles fetch error gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
    dbService.drivers.fetch.mockResolvedValue({ data: null, error: new Error('Fetch failed') });

    const { result } = renderHook(() => useDrivers());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(consoleSpy).toHaveBeenCalled();
    expect(result.current.drivers).toEqual([]);
    consoleSpy.mockRestore();
  });
});
