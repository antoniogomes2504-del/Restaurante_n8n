import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useMenu } from '../../hooks/useMenu';
import { dbService } from '../../api/supabase.service';

// Mock dbService
vi.mock('../../api/supabase.service', () => ({
  dbService: {
    menu: {
      fetch: vi.fn(),
      save: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

describe('useMenu Hook', () => {
  const mockItems = [
    { id: 1, nome: 'Burger', categoria: 'Pratos Principais', preco_unico: 20 },
    { id: 2, nome: 'Coke', categoria: 'Bebidas', preco_unico: 5 },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches and sets menu items on mount', async () => {
    dbService.menu.fetch.mockResolvedValue({ data: mockItems, error: null });

    const { result } = renderHook(() => useMenu());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.menuItems).toEqual(mockItems);
  });

  it('filters menu items by category', async () => {
    dbService.menu.fetch.mockResolvedValue({ data: mockItems, error: null });

    const { result } = renderHook(() => useMenu('Bebidas'));

    await waitFor(() => {
      expect(result.current.filteredMenu).toHaveLength(1);
      expect(result.current.filteredMenu[0].nome).toBe('Coke');
    });
  });

  it('filters menu items by search term', async () => {
    dbService.menu.fetch.mockResolvedValue({ data: mockItems, error: null });

    const { result } = renderHook(() => useMenu('Todos', 'Burg'));

    await waitFor(() => {
      expect(result.current.filteredMenu).toHaveLength(1);
      expect(result.current.filteredMenu[0].nome).toBe('Burger');
    });
  });

  it('calls saveItem and refreshes the menu', async () => {
    dbService.menu.fetch.mockResolvedValue({ data: mockItems, error: null });
    dbService.menu.save.mockResolvedValue({ error: null });

    const { result } = renderHook(() => useMenu());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const newItem = { nome: 'Fries', categoria: 'Porções', preco_unico: 10 };
    await result.current.saveItem(newItem);

    expect(dbService.menu.save).toHaveBeenCalledWith(newItem);
    expect(dbService.menu.fetch).toHaveBeenCalledTimes(2); // Initial + after save
  });
});
