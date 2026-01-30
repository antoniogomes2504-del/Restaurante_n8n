import React, { useState } from 'react';
import { authService } from '../api/supabase.service';
import { LogIn, Lock, Mail, UserPlus, ArrowLeft, CheckCircle2 } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [signedUpSuccess, setSignedUpSuccess] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { error: signUpError } = await authService.signUp(email, password);
        if (signUpError) throw signUpError;
        setSignedUpSuccess(true);
      } else {
        const { error: signInError } = await authService.signIn(email, password);
        if (signInError) throw signInError;
      }
    } catch (err) {
      setError(err.message === 'Email not confirmed' ? 'Por favor, confirme seu e-mail para entrar.' : err.message);
    } finally {
      setLoading(false);
    }
  };

  if (signedUpSuccess) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-md text-center space-y-6">
          <div className="h-20 w-20 bg-emerald-900/30 border border-emerald-500/50 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="text-emerald-500" size={40} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Cadastro Realizado!</h2>
            <p className="text-slate-400">
              Enviamos um e-mail de confirmação para <span className="text-blue-400 font-medium">{email}</span>.
              Por favor, valide sua conta antes de tentar entrar.
            </p>
          </div>
          <button
            onClick={() => { setSignedUpSuccess(false); setIsSignUp(false); }}
            className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft size={18} /> Voltar para o Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-600/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]"></div>

      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-md relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="h-16 w-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-900/20 mb-4 transform rotate-3">
            <span className="text-3xl">🍲</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Marmita <span className="text-orange-500">Express</span></h1>
          <p className="text-slate-400 text-sm mt-1">{isSignUp ? 'Crie sua conta administrativa' : 'Painel de Gestão e Logística'}</p>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-500/50 text-red-100 p-3 rounded-lg text-sm mb-6 flex items-start gap-2">
            <div className="h-5 w-5 bg-red-500 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">!</div>
            {error}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="email"
                required
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-orange-500 transition-colors"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="password"
                required
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-orange-500 transition-colors"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-orange-900/40 flex items-center justify-center gap-2 mt-4"
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : isSignUp ? (
              <><UserPlus size={18} /> Criar Conta</>
            ) : (
              <><LogIn size={18} /> Entrar no Painel</>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <button
            onClick={() => { setIsSignUp(!isSignUp); setError(null); }}
            className="text-sm text-slate-400 hover:text-orange-500 transition-colors"
          >
            {isSignUp ? 'Já tem uma conta? Entre aqui' : 'Não tem conta? Cadastre-se agora'}
          </button>
        </div>

        <div className="mt-6 flex justify-center gap-4">
          <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
