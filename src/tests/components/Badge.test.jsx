import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Badge from '../../components/common/Badge';

describe('Badge Component', () => {
  it('renders children correctly', () => {
    render(<Badge>Test Status</Badge>);
    expect(screen.getByText('Test Status')).toBeInTheDocument();
  });

  it('applies custom color classes', () => {
    const { container } = render(<Badge colorClass="bg-red-500">Alert</Badge>);
    expect(container.firstChild).toHaveClass('bg-red-500');
  });

  it('applies default styles', () => {
    const { container } = render(<Badge>Default</Badge>);
    expect(container.firstChild).toHaveClass('px-3');
    expect(container.firstChild).toHaveClass('py-1');
  });
});
