import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LoginPage from '../../pages/Login.page';
import { authService } from '../../api/supabase.service';

// Mock authService
vi.mock('../../api/supabase.service', () => ({
  authService: {
    signIn: vi.fn(),
    signUp: vi.fn(),
  },
}));

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form by default', () => {
    render(<LoginPage />);
    expect(screen.getByText('Entrar no Painel')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('seu@email.com')).toBeInTheDocument();
  });

  it('toggles to sign up form', () => {
    render(<LoginPage />);
    const toggleButton = screen.getByText('Não tem conta? Cadastre-se agora');
    fireEvent.click(toggleButton);

    expect(screen.getByText('Criar Conta')).toBeInTheDocument();
    expect(screen.getByText('Já tem uma conta? Entre aqui')).toBeInTheDocument();
  });

  it('calls authService.signIn on login submit', async () => {
    authService.signIn.mockResolvedValue({ error: null });
    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText('seu@email.com'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByText('Entrar no Painel'));

    expect(authService.signIn).toHaveBeenCalledWith('test@example.com', 'password123');
  });

  it('shows success message after sign up', async () => {
    authService.signUp.mockResolvedValue({ error: null });
    render(<LoginPage />);

    // Switch to sign up
    fireEvent.click(screen.getByText('Não tem conta? Cadastre-se agora'));

    fireEvent.change(screen.getByPlaceholderText('seu@email.com'), { target: { value: 'new@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByText('Criar Conta'));

    await waitFor(() => {
      expect(screen.getByText('Cadastro Realizado!')).toBeInTheDocument();
      expect(screen.getByText(/new@example.com/)).toBeInTheDocument();
    });
  });

  it('displays error message on failure', async () => {
    authService.signIn.mockRejectedValue(new Error('Invalid credentials'));
    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText('seu@email.com'), { target: { value: 'wrong@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'wrongpass' } });
    fireEvent.click(screen.getByText('Entrar no Painel'));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });
});
