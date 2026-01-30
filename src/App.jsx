import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { authService } from './api/supabase.service';
import LoginPage from './pages/Login.page';
import DashboardPage from './pages/Dashboard.page';
import ChatPage from './pages/Chat.page';
import './App.css';

export default function App() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Check initial session
    authService.getSession().then(({ data: { session } }) => {
      setSession(session);
      setInitialized(true);
    });

    // Listen to changes
    const { data: { subscription } } = authService.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    const { error } = await authService.signIn(email, password);
    if (error) alert('Erro: ' + error.message);
    setAuthLoading(false);
  };

  const handleLogout = async () => {
    await authService.signOut();
    setSession(null);
  };

  if (!initialized) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Carregando...</div>;

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            !session ? (
              <LoginPage
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                authLoading={authLoading}
                onLogin={handleLogin}
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/"
          element={
            session ? (
              <DashboardPage onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/chat"
          element={
            session ? (
              <ChatPage onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}