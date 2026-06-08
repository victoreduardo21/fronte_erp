"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import { 
  Loader2, 
  UserPlus, 
  Shield, 
  Mail, 
  Lock, 
  UserCheck, 
  Trash2, 
  Users,
  ShieldAlert,
  ShieldCheck
} from "lucide-react";

interface Colaborador {
  id: string;
  nome: string;
  email: string;
  regra: string; // master, financeiro, estoque
  status: "ativo" | "inativo";
}

export default function ControleUsuariosPage() {
  const router = useRouter();
  const [carregando, setCarregando] = useState<boolean>(true);

  // Estados do Formulário de Cadastro
  const [nome, setNome] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [senha, setSenha] = useState<string>("");
  const [regra, setRegra] = useState<string>("financeiro"); // master, financeiro, estoque

  // Base de dados simulada de usuários do ERP
  const [usuarios, setUsuarios] = useState<Colaborador[]>([
    { id: "1", nome: "Victor Developer", email: "victor.dev@gts.com.br", regra: "master", status: "ativo" },
    { id: "2", nome: "Aline Souza - Financeiro", email: "aline.financeiro@gts.com.br", regra: "financeiro", status: "ativo" },
    { id: "3", nome: "Carlos Lima - Logística", email: "carlos.estoque@gts.com.br", regra: "estoque", status: "ativo" },
    { id: "4", nome: "Mariana Costa", email: "mariana.operacoes@gts.com.br", regra: "financeiro", status: "inativo" },
  ]);

  useEffect(() => {
    const token = localStorage.getItem("@erp:token");
    if (!token) {
      router.replace("/");
    } else {
      setCarregando(false);
    }
  }, [router]);

  // Função para salvar novo usuário na API Node.js
  function handleCadastrarUsuario(e: React.FormEvent) {
    e.preventDefault();

    if (!nome || !email || !senha || !regra) {
      alert("Por favor, preencha todos os campos para o cadastro.");
      return;
    }

    const novoUsuarioPayload = {
      nome,
      email,
      senha,
      regra // Envia o nível de acesso para o controle do backend
    };

    console.log("Enviando novo colaborador para a API Node.js:", novoUsuarioPayload);
    
    // Atualiza o estado local para demonstração visual imediata
    const novoColaborador: Colaborador = {
      id: String(usuarios.length + 1),
      nome,
      email,
      regra,
      status: "ativo"
    };

    setUsuarios([...usuarios, novoColaborador]);
    alert("Novo usuário cadastrado e permissões configuradas!");
    
    // Limpa o formulário
    setNome("");
    setEmail("");
    setSenha("");
    setRegra("financeiro");
  }

  // Altera status de atividade rápido (Bloqueio de acesso instantâneo)
  function handleAlternarStatus(id: string) {
    setUsuarios(usuariosAnteriores =>
      usuariosAnteriores.map(u =>
        u.id === id ? { ...u, status: u.status === "ativo" ? "inativo" : "ativo" } : u
      )
    );
  }

  function handleDeletarUsuario(id: string) {
    if (confirm("Tem certeza que deseja revogar definitivamente o acesso deste usuário?")) {
      setUsuarios(usuariosAnteriores => usuariosAnteriores.filter(u => u.id !== id));
    }
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

      <main className="flex-1 p-4 md:p-6 max-w-7xl w-full mx-auto space-y-6">
        
        {/* Cabeçalho */}
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Controle de Usuários e Permissões</h1>
          <p className="text-xs text-slate-500 mt-0.5">Gerencie as credenciais da sua equipe e determine quais módulos cada funcionário pode acessar.</p>
        </div>

        {/* Layout em Duas Colunas: Cadastro Lateral + Listagem de Equipe */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* COLUNA 1: FORMULÁRIO DE NOVO USUÁRIO */}
          <form onSubmit={handleCadastrarUsuario} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
              <UserPlus className="w-4 h-4 text-indigo-600" />
              Convidar Novo Usuário
            </h4>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Nome do Funcionário *</label>
              <input 
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Aline Souza"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">E-mail Corporativo *</label>
              <div className="relative flex items-center">
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nome@empresa.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Senha Provisória *</label>
              <div className="relative flex items-center">
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input 
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            {/* 🔑 SELEÇÃO DO NÍVEL DE ACESSO (RBAC) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Nível de Acesso / Regra *</label>
              <select 
                value={regra}
                onChange={(e) => setRegra(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
              >
                <option value="financeiro">Financeiro (Acesso a fluxo, caixa, pagar/receber)</option>
                <option value="estoque">Estoque (Acesso apenas a produtos e controle)</option>
                <option value="master">Administrador Master (Acesso total + relatórios avançados)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold text-white shadow-md transition-colors cursor-pointer pt-2.5"
            >
              Criar Acesso Equipe
            </button>
          </form>

          {/* COLUNA 2: TABELA DE USUÁRIOS ATIVOS E PERMISSÕES */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm lg:col-span-2">
            <div className="p-4 bg-slate-50/50 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-slate-400" />
                Colaboradores com Acesso Ativo
              </span>
              <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md font-bold">
                {usuarios.length} Registrados
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/50 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-3.5 px-5">Funcionário</th>
                    <th className="py-3.5 px-5">E-mail de Login</th>
                    <th className="py-3.5 px-5">Regra / Permissão</th>
                    <th className="py-3.5 px-5">Status</th>
                    <th className="py-3.5 px-5 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
                  {usuarios.map((user) => {
                    const isMaster = user.regra === "master";
                    const isEstoque = user.regra === "estoque";

                    return (
                      <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                        
                        {/* Nome */}
                        <td className="py-3.5 px-5 font-bold text-slate-700">
                          {user.nome}
                        </td>

                        {/* Email */}
                        <td className="py-3.5 px-5 text-slate-500 font-medium">
                          {user.email}
                        </td>

                        {/* Badge de Nível de Acesso */}
                        <td className="py-3.5 px-5">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                            isMaster 
                              ? "bg-indigo-50 text-indigo-700 border-indigo-100" 
                              : isEstoque 
                                ? "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-100" 
                                : "bg-emerald-50 text-emerald-700 border-emerald-100"
                          }`}>
                            {isMaster ? <ShieldCheck className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                            {user.regra.toUpperCase()}
                          </span>
                        </td>

                        {/* Status de Login */}
                        <td className="py-3.5 px-5">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                            user.status === "ativo" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-600"
                          }`}>
                            {user.status}
                          </span>
                        </td>

                        {/* Ações */}
                        <td className="py-3.5 px-5 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            
                            {/* Bloquear / Desbloquear Rápido */}
                            <button
                              type="button"
                              onClick={() => handleAlternarStatus(user.id)}
                              title={user.status === "ativo" ? "Bloquear Usuário" : "Ativar Usuário"}
                              className={`p-1.5 border rounded-lg transition-colors cursor-pointer ${
                                user.status === "ativo"
                                  ? "bg-slate-50 text-slate-400 border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100"
                                  : "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-600 hover:text-white"
                              }`}
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                            </button>

                            {/* Revogar definitivamente */}
                            <button
                              type="button"
                              onClick={() => handleDeletarUsuario(user.id)}
                              title="Excluir Acesso"
                              className="p-1.5 bg-rose-50 text-rose-600 border border-rose-100 rounded-lg hover:bg-rose-600 hover:text-white transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>

                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}