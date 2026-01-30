import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useCustomers } from '../../hooks/useCustomers';
import { dbService } from '../../api/supabase.service';

vi.mock('../../api/supabase.service', () => ({
  dbService: {
    customers: {
      fetch: vi.fn(),
      save: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

describe('useCustomers Hook', () => {
  const mockCustomers = [
    { telefone: '11999999999', nome: 'Customer A' },
    { telefone: '11888888888', nome: 'Customer B' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches customers on mount', async () => {
    dbService.customers.fetch.mockResolvedValue({ data: mockCustomers, error: null });
    const { result } = renderHook(() => useCustomers());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.customers).toHaveLength(2);
    expect(result.current.customers[0].name).toBe('Customer A');
    expect(result.current.customers[0].id).toBe('11999999999');
  });

  it('saves a customer and refreshes the list', async () => {
    dbService.customers.fetch.mockResolvedValue({ data: mockCustomers, error: null });
    dbService.customers.save.mockResolvedValue({ error: null });

    const { result } = renderHook(() => useCustomers());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const newCustomer = { telefone: '11777777777', nome: 'Customer C' };
    await act(async () => {
      await result.current.saveCustomer(newCustomer);
    });

    expect(dbService.customers.save).toHaveBeenCalledWith(newCustomer);
    expect(dbService.customers.fetch).toHaveBeenCalledTimes(2);
  });

  it('deletes a customer and refreshes the list', async () => {
    dbService.customers.fetch.mockResolvedValue({ data: mockCustomers, error: null });
    dbService.customers.delete.mockResolvedValue({ error: null });

    const { result } = renderHook(() => useCustomers());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.deleteCustomer('11999999999');
    });

    expect(dbService.customers.delete).toHaveBeenCalledWith('11999999999');
    expect(dbService.customers.fetch).toHaveBeenCalledTimes(2);
  });

  it('handles fetch error gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
    dbService.customers.fetch.mockResolvedValue({ data: null, error: new Error('Fetch failed') });

    const { result } = renderHook(() => useCustomers());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(consoleSpy).toHaveBeenCalled();
    expect(result.current.customers).toEqual([]);
    consoleSpy.mockRestore();
  });
});
