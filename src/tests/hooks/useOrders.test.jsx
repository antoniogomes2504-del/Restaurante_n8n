import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useOrders } from '../../hooks/useOrders';
import { dbService } from '../../api/supabase.service';

// Mock dbService
vi.mock('../../api/supabase.service', () => ({
  dbService: {
    orders: {
      fetch: vi.fn(),
      subscribe: vi.fn(() => ({})), // returns a dummy channel
      removeChannel: vi.fn(),
      updateStatus: vi.fn(),
    },
  },
}));

describe('useOrders Hook', () => {
  const mockDbOrders = [
    {
      id: 1,
      cliente_nome: 'Alice',
      status: 'PENDENTE',
      data_criacao: new Date().toISOString(),
      pedido_json: {
        products: [{ name: 'Pizza', price: 50 }],
        order_type: 'delivery'
      }
    },
    {
      id: 2,
      cliente_nome: 'Bob',
      status: 'READY',
      data_criacao: new Date().toISOString(),
      pedido_json: {
        products: [{ name: 'Burger', price: 30 }],
        order_type: 'takeout'
      }
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches orders and calculates stats', async () => {
    dbService.orders.fetch.mockResolvedValue({ data: mockDbOrders, error: null });

    const { result } = renderHook(() => useOrders());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.orders).toHaveLength(2);
    expect(result.current.orders[0].customer_name).toBe('Alice');
    expect(result.current.orders[0].total).toBe(50);
    expect(result.current.orders[0].status).toBe('preparing');

    expect(result.current.stats.totalRevenue).toBe(80);
    expect(result.current.stats.activeOrdersCount).toBe(2);
    expect(result.current.stats.deliveryCount).toBe(1);
  });

  it('calls updateOrderStatus and refreshes the list', async () => {
    dbService.orders.fetch.mockResolvedValue({ data: mockDbOrders, error: null });
    dbService.orders.updateStatus.mockResolvedValue({ error: null });

    const { result } = renderHook(() => useOrders());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await result.current.updateOrderStatus(1, 'CONCLUÍDO');

    expect(dbService.orders.updateStatus).toHaveBeenCalledWith(1, 'CONCLUÍDO');
    expect(dbService.orders.fetch).toHaveBeenCalledTimes(2);
  });

  it('subscribes to real-time updates on mount', async () => {
    dbService.orders.fetch.mockResolvedValue({ data: mockDbOrders, error: null });

    renderHook(() => useOrders());

    expect(dbService.orders.subscribe).toHaveBeenCalled();
  });

  it('unsubscribes on unmount', async () => {
    dbService.orders.fetch.mockResolvedValue({ data: mockDbOrders, error: null });
    const mockChannel = { id: 'test-channel' };
    dbService.orders.subscribe.mockReturnValue(mockChannel);

    const { unmount, result } = renderHook(() => useOrders());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    unmount();

    expect(dbService.orders.removeChannel).toHaveBeenCalledWith(mockChannel);
  });
});
