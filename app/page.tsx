'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../services/api';
import { Lock, Mail, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface ErroResposta {
  response?: {
    data?: {
      erro?: string;
    };
  };
}

export default function Login() {
  const router = useRouter();
  
  const [email, setEmail] = useState<string>('');
  const [senha, setSenha] = useState<string>('');
  const [carregando, setCarregando] = useState<boolean>(false);
  const [estaAutenticado, setEstaAutenticado] = useState<boolean | null>(null);
  const [erro, setErro] = useState<string>('');

  useEffect(() => {
    const token = localStorage.getItem('@erp:token');
    
    if (token) {
      router.replace('/dashboard');
    } else {
      setEstaAutenticado(false);
    }
  }, [router]);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    // 🔑 USUÁRIO MESTRE CHUMBADO NO CÓDIGO PARA TESTE RÁPIDO
    if (email === 'gtsglobaltech01@gmail.com' && senha === 'Ve010203@') {
      // Cria um token fictício para o front achar que está logado
      localStorage.setItem('@erp:token', 'token-ficticio-de-teste-mestre');
      router.push('/dashboard');
      return;
    }

    // Se não for o usuário mestre, tenta logar na API/Banco normalmente
    try {
      const response = await api.post('/api/auth/login', { email, senha });
      const { token } = response.data;

      localStorage.setItem('@erp:token', token);
      router.push('/dashboard');
    } catch (err: unknown) {
      console.error(err);
      const erroTratado = err as ErroResposta;
      setErro(erroTratado.response?.data?.erro || 'Falha ao fazer login. Verifique suas credenciais.');
      setCarregando(false);
    }
  }

  if (estaAutenticado === null) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      
      {/* Card Compacto Estilo Vidro Fumê Transparente */}
      <div className="w-full max-w-sm bg-slate-800/40 backdrop-blur-md border border-slate-700/60 rounded-2xl p-6 shadow-2xl">
        
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-white tracking-tight">Painel ERP</h1>
          <p className="text-slate-400 text-xs mt-1">Insira seus dados de acesso</p>
        </div>

        {erro && (
          <div className="mb-4 bg-red-950/40 border border-red-900/60 text-red-400 text-xs p-2.5 rounded-lg text-center font-medium">
            {erro}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-slate-300 text-xs font-semibold mb-1 ml-0.5">E-mail Corporativo</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full bg-slate-950/60 border border-slate-700/50 rounded-xl py-2 pl-9 pr-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 text-xs font-semibold mb-1 ml-0.5">Sua Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
              <input
                type="password"
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950/60 border border-slate-700/50 rounded-xl py-2 pl-9 pr-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={carregando}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white text-sm font-semibold rounded-xl py-2.5 flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer disabled:cursor-not-allowed active:scale-[0.99]"
          >
            {carregando ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Entrar no Sistema'}
          </button>
        </form>

        <div className="text-center mt-6 pt-4 border-t border-slate-800">
          <p className="text-slate-400 text-xs">
            Não tem uma conta?{' '}
            <Link href="/cadastro" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
              Cadastre sua empresa
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}