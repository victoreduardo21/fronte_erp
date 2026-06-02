"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import { 
  Loader2, 
  User, 
  Mail, 
  Shield, 
  Lock, 
  Save, 
  KeyRound 
} from "lucide-react";

export default function MeuPerfilPage() {
  const router = useRouter();
  const [carregando, setCarregando] = useState<boolean>(true);

  // Estados dos dados do perfil
  const [nome, setNome] = useState<string>("Victor Developer");
  const [email, setEmail] = useState<string>("victor.dev@gts.com.br");
  const [cargo, setCargo] = useState<string>("Administrador Master");

  // Estados para alteração de senha
  const [senhaAtual, setSenhaAtual] = useState<string>("");
  const [novaSenha, setNovaSenha] = useState<string>("");
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("@erp:token");
    if (!token) {
      router.replace("/");
    } else {
      setCarregando(false);
    }
  }, [router]);

  // Função para salvar dados cadastrais básicos
  function handleSalvarDados(e: React.FormEvent) {
    e.preventDefault();
    if (!nome || !email) {
      alert("Nome e E-mail são obrigatórios.");
      return;
    }
    
    console.log("Atualizando dados cadastrais:", { nome, email });
    alert("Dados do perfil atualizados com sucesso!");
  }

  // Função para alterar a senha com segurança
  function handleAlterarSenha(e: React.FormEvent) {
    e.preventDefault();
    if (!senhaAtual || !novaSenha || !confirmarNovaSenha) {
      alert("Por favor, preencha todos os campos de senha.");
      return;
    }

    if (novaSenha !== confirmarNovaSenha) {
      alert("A nova senha e a confirmação não conferem.");
      return;
    }

    console.log("Enviando requisição de nova senha para a API Node.js...");
    alert("Senha alterada com sucesso!");
    setSenhaAtual("");
    setNovaSenha("");
    setConfirmarNovaSenha("");
  }

  if (carregando) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-700 flex flex-col antialiased">
      <Navbar onMenuClick={() => console.log("Menu")} />

      <main className="flex-1 p-4 md:p-6 max-w-4xl w-full mx-auto space-y-6">
        
        {/* Cabeçalho */}
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Meu Perfil</h1>
          <p className="text-xs text-slate-500 mt-0.5">Gerencie suas informações cadastrais, nível de acesso e credenciais de segurança.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          
          {/* CARD ESQUERDO: RESUMO DO USUÁRIO */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-3xl shadow-sm mb-4">
              V
            </div>
            <h3 className="text-sm font-bold text-slate-800">{nome}</h3>
            <p className="text-[11px] text-slate-400 font-semibold mt-0.5">{cargo}</p>
            
            <div className="w-full h-[1px] bg-slate-100 my-4" />
            
            <div className="w-full flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-[11px] text-slate-500 font-bold">
              <Shield className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              Nível: Acesso Total do Sistema
            </div>
          </div>

          {/* COLUNA DIREITA: FORMULÁRIOS OPERACIONAIS */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Bloco 1: Informações Cadastrais */}
            <form onSubmit={handleSalvarDados} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <User className="w-4 h-4 text-slate-400" />
                Dados Cadastrais
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Nome Completo *</label>
                  <input 
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">E-mail de Login *</label>
                  <div className="relative flex items-center">
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 pointer-events-none" />
                    <input 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Função / Cargo</label>
                  <input 
                    type="text"
                    value={cargo}
                    disabled
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-400 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button 
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold text-white shadow-md transition-colors cursor-pointer"
                >
                  <img src="" alt="" />
                  <Save className="w-3.5 h-3.5" />
                  Salvar Alterações
                </button>
              </div>
            </form>

            {/* Bloco 2: Alteração de Senha */}
            <form onSubmit={handleAlterarSenha} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Lock className="w-4 h-4 text-slate-400" />
                Segurança do Sistema
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Senha Atual *</label>
                  <input 
                    type="password"
                    value={senhaAtual}
                    onChange={(e) => setSenhaAtual(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Nova Senha *</label>
                  <input 
                    type="password"
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Confirmar Nova Senha *</label>
                  <input 
                    type="password"
                    value={confirmarNovaSenha}
                    onChange={(e) => setConfirmarNovaSenha(e.target.value)}
                    placeholder="Repita a nova senha"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button 
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 rounded-xl text-xs font-bold text-white shadow-md transition-colors cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  Atualizar Senha
                </button>
              </div>
            </form>

          </div>
        </div>

      </main>
    </div>
  );
}