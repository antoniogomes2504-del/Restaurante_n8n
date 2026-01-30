import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DriverList from '../../components/dashboard/DriverList';

describe('DriverList Component', () => {
  const mockDrivers = [
    { id: 1, name: 'John', status: 'available', location: 'Base' },
    { id: 2, name: 'Jane', status: 'busy', location: 'Street' },
  ];

  it('renders driver names and status indicators', () => {
    render(<DriverList drivers={mockDrivers} />);
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('Jane')).toBeInTheDocument();
  });

  it('toggles management mode', () => {
    const setIsManagingDrivers = vi.fn();
    render(
      <DriverList
        drivers={mockDrivers}
        isManagingDrivers={false}
        setIsManagingDrivers={setIsManagingDrivers}
      />
    );

    const editButton = screen.getByTitle('Gerenciar Motoqueiros');
    fireEvent.click(editButton);
    expect(setIsManagingDrivers).toHaveBeenCalledWith(true);
  });
});
