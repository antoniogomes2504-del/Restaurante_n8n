import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Header from '../components/dashboard/Header';
import { BrowserRouter } from 'react-router-dom';

describe('Header Component', () => {
  const renderHeader = (props = {}) => {
    return render(
      <BrowserRouter>
        <Header
          onOpenReports={() => { }}
          onOpenMenu={() => { }}
          onLogout={() => { }}
          {...props}
        />
      </BrowserRouter>
    );
  };

  it('renders the application title', () => {
    renderHeader();
    expect(screen.getByText('Hildebrando')).toBeInTheDocument();
  });

  it('calls onLogout when clicking the Sair button', () => {
    const logoutMock = vi.fn();
    renderHeader({ onLogout: logoutMock });

    // The text 'Sair' is inside a span
    const logoutButton = screen.getByText('Sair');
    fireEvent.click(logoutButton);

    expect(logoutMock).toHaveBeenCalledTimes(1);
  });

  it('navigates to chat when clicking Chat button', () => {
    renderHeader();
    const chatButton = screen.getByText('Chat Ativo');
    expect(chatButton).toBeInTheDocument();
  });
});
