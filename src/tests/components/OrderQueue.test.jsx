import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import OrderQueue from '../../components/dashboard/OrderQueue';

describe('OrderQueue Component', () => {
  const mockOrders = [
    { id: 1, customer_name: 'Alice', total: 50.00, status: 'preparing', type: 'delivery', items: ['Pizza'] },
    { id: 2, customer_name: 'Bob', total: 30.00, status: 'ready', type: 'takeout', items: ['Burger'] },
  ];

  it('renders a list of orders', () => {
    render(<OrderQueue orders={mockOrders} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('displays correct status badges', () => {
    render(<OrderQueue orders={mockOrders} />);
    expect(screen.getByText('Na Cozinha')).toBeInTheDocument();
    expect(screen.getByText('Pronto/Aguard.')).toBeInTheDocument();
  });
});
