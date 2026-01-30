import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import KpiContainer from '../../components/dashboard/KpiContainer';

describe('KpiContainer Component', () => {
  it('renders all KPI cards with correct values', () => {
    render(
      <KpiContainer
        totalRevenue={1500.50}
        activeOrders={10}
        deliveryCount={7}
        availableDrivers={3}
        totalDrivers={5}
      />
    );

    // Use regex for partial or formatted matches
    expect(screen.getByText(/1500\.50|1\.500,50/)).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText(/7/)).toBeInTheDocument();
    expect(screen.getByText('3/5')).toBeInTheDocument();
  });
});
