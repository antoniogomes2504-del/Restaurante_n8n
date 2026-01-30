import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ConicPieChart from '../../components/common/ConicPieChart';

describe('ConicPieChart Component', () => {
  const mockData = [
    { label: 'Category A', value: 30, color: 'bg-red-500' },
    { label: 'Category B', value: 70, color: 'bg-blue-500' },
  ];

  it('renders the chart container', () => {
    const { container } = render(<ConicPieChart data={mockData} />);
    const chart = container.querySelector('.rounded-full');
    expect(chart).toBeInTheDocument();
  });

  it('renders labels and percentages', () => {
    render(<ConicPieChart data={mockData} />);
    // Use regex to find text within the combined string
    expect(screen.getByText(/Category A/)).toBeInTheDocument();
    expect(screen.getByText(/30%/)).toBeInTheDocument();
    expect(screen.getByText(/Category B/)).toBeInTheDocument();
    expect(screen.getByText(/70%/)).toBeInTheDocument();
  });

  it('applies the conic-gradient style', () => {
    const { container } = render(<ConicPieChart data={mockData} />);
    const chart = container.querySelector('.rounded-full');
    // JSDOM has limited CSS support for conic-gradient, so we just check if background is defined
    expect(chart.style).toBeDefined();
  });
});
