'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../services/api';
import { Lock, Mail, Loader2, Building2, User, FileText } from 'lucide-react';
import Link from 'next/link';

interface ErroResposta {
  response?: { data?: { erro?: string } };
}

export default function Cadastro() {
  const router = useRouter();
  const [nomeFantasia, setNomeFantasia] = useState<string>('');
  const [cnpj, setCnpj] = useState<string>('');
  const [nomeUsuario, setNomeUsuario] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [senha, setSenha] = useState<string>('');
  const [carregando, setCarregando] = useState<boolean>(false);
  const [erro, setErro] = useState<string>('');
  const [sucesso, setSucesso] = useState<boolean>(false);

  // Máscara dinâmica para o CNPJ (00.000.000/0000-00)
  const gerenciarCnpj = (valor: string) => {
    const apenasNumeros = valor.replace(/\D/g, '');
    const cnpjFormatado = apenasNumeros
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2');
    setCnpj(cnpjFormatado);
  };

  async function handleCadastro(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro('');
    setCarregando(true);
    try {
      // Ajustado: enviando a propriedade como "nome" para casar com o seu authService!
      await api.post('/api/auth/registrar', { 
        nomeFantasia, 
        cnpj, 
        nome: nomeUsuario, 
        email, 
        senha 
      });
      
      setSucesso(true);
      setTimeout(() => { router.push('/'); }, 2500);
    } catch (err: unknown) {
      console.error(err);
      const erroTratado = err as ErroResposta;
      setErro(erroTratado.response?.data?.erro || 'Erro ao realizar cadastro.');
    } finally { setCarregando(false); }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <div className="w-full max-w-sm bg-slate-800/40 backdrop-blur-md border border-slate-700/60 rounded-2xl p-6 shadow-2xl">
        
        <div className="text-center mb-5">
          <h1 className="text-xl font-bold text-white tracking-tight">Nova Conta</h1>
          <p className="text-slate-400 text-xs mt-1 font-medium">Cadastre sua empresa no ERP</p>
        </div>

        {erro && (
          <div className="mb-4 bg-red-950/40 border border-red-900/60 text-red-400 text-xs p-2.5 rounded-lg text-center font-medium">
            {erro}
          </div>
        )}

        {sucesso && (
          <div className="mb-4 bg-emerald-950/40 border border-emerald-800 text-emerald-400 text-xs p-2.5 rounded-lg text-center font-medium">
            Empresa registrada com sucesso!
          </div>
        )}

        <form onSubmit={handleCadastro} className="space-y-4">
          <div>
            <label className="block text-slate-300 text-xs font-semibold mb-1 ml-0.5">Nome Fantasia</label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
              <input
                type="text" required value={nomeFantasia}
                onChange={(e) => setNomeFantasia(e.target.value)}
                placeholder="Nome da Empresa"
                className="w-full bg-slate-950/60 border border-slate-700/50 rounded-xl py-2 pl-9 pr-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 text-xs font-semibold mb-1 ml-0.5">CNPJ</label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
              <input
                type="text" 
                required 
                value={cnpj}
                onChange={(e) => gerenciarCnpj(e.target.value)}
                className="w-full bg-slate-950/60 border border-slate-700/50 rounded-xl py-2 pl-9 pr-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="00.000.000/0000-00"
                maxLength={18}
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 text-xs font-semibold mb-1 ml-0.5">Seu Nome</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
              <input
                type="text" required value={nomeUsuario}
                onChange={(e) => setNomeUsuario(e.target.value)}
                placeholder="João Silva"
                className="w-full bg-slate-950/60 border border-slate-700/50 rounded-xl py-2 pl-9 pr-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 text-xs font-semibold mb-1 ml-0.5">E-mail Gestor</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="email" required value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@empresa.com"
                className="w-full bg-slate-950/60 border border-slate-700/50 rounded-xl py-2 pl-9 pr-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 text-xs font-semibold mb-1 ml-0.5">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
              <input
                type="password" required value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950/60 border border-slate-700/50 rounded-xl py-2 pl-9 pr-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit" disabled={carregando || sucesso}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl py-2.5 mt-2 flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
          >
            {carregando ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Criar Empresa'}
          </button>
        </form>

        <div className="text-center mt-6 pt-4 border-t border-slate-800">
          <p className="text-slate-400 text-xs">
            Já possui conta?{' '}
            <Link href="/" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-all">
              Fazer Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}