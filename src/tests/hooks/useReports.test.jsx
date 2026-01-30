import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useReports } from '../../hooks/useReports';

describe('useReports Hook', () => {
  const mockOrders = [
    {
      id: 1,
      total: 100,
      status: 'completed',
      type: 'delivery',
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      total: 50,
      status: 'preparing',
      type: 'takeout',
      created_at: new Date().toISOString(),
    },
    {
      id: 3,
      total: 0,
      status: 'cancelled',
      type: 'delivery',
      created_at: new Date().toISOString(),
    }
  ];

  it('calculates metrics for today by default', () => {
    const { result } = renderHook(() => useReports(mockOrders, 'today'));

    expect(result.current.currentReport.totalRevenue).toBe(150);
    expect(result.current.currentReport.totalOrders).toBe(3);
    expect(result.current.currentReport.avgTicket).toBe(50);
    expect(result.current.currentReport.canceledOrders).toBe(1);

    // Type data (Delivery 2/3 = 67%, Takeout 1/3 = 33%)
    const typeData = result.current.currentReport.typeData;
    expect(typeData.find(d => d.label === 'Delivery').value).toBe(67);
    expect(typeData.find(d => d.label === 'Retirada').value).toBe(33);
  });

  it('filters by 7 days', () => {
    const oldOrder = {
      id: 4,
      total: 100,
      status: 'completed',
      type: 'delivery',
      created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    };

    const { result } = renderHook(() => useReports([...mockOrders, oldOrder], '7days'));
    expect(result.current.currentReport.totalOrders).toBe(3);
  });

  it('filters by 30 days', () => {
    const oldOrder = {
      id: 4,
      total: 100,
      status: 'completed',
      type: 'delivery',
      created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    };

    const { result } = renderHook(() => useReports([...mockOrders, oldOrder], '30days'));
    expect(result.current.currentReport.totalOrders).toBe(4);
  });

  it('returns empty report when no orders', () => {
    const { result } = renderHook(() => useReports([], 'today'));
    expect(result.current.currentReport.totalOrders).toBe(0);
    expect(result.current.currentReport.totalRevenue).toBe(0);
  });
});
