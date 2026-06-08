'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Bell, 
  ChevronDown, 
  User, 
  LogOut, 
  LayoutDashboard, 
  TrendingUp, 
  TrendingDown,
  Users, 
  Boxes, 
  Building,
  PlusCircle,
  FileText,
  BarChart3,
  UserCog // 🛠️ Ícone para gerenciamento de equipe/usuários
} from 'lucide-react';

interface NavbarProps {
  onMenuClick?: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const router = useRouter();
  const [menuPerfilAberto, setMenuPerfilAberto] = useState(false);

  // 🔐 Nível de Acesso (Simulado para controle de renderização do menu)
  // Altere para 'financeiro' ou 'estoque' para testar como os funcionários enxergarão o sistema!
  const [nivelAcesso, setNivelAcesso] = useState<string>('master'); 

  function handleLogout() {
    localStorage.removeItem('@erp:token');
    router.replace('/');
  }

  // Regras de visualização por nível
  const temAcessoFinanceiro = nivelAcesso === 'master' || nivelAcesso === 'financeiro';
  const temAcessoEstoque = nivelAcesso === 'master' || nivelAcesso === 'estoque';
  const ehMaster = nivelAcesso === 'master';

  return (
    <header className="w-full h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 flex items-center justify-between lg:px-6 shrink-0 relative z-30">
      
      {/* LADO ESQUERDO: Título fixo do ERP */}
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <h2 className="text-sm font-bold text-slate-800 tracking-tight">GTS ERP</h2>
          <p className="text-[10px] text-slate-400 font-semibold hidden sm:block">Enterprise Management</p>
        </div>
      </div>

      {/* LADO DIREITO: Notificações e o Menu Mestre de Cliques */}
      <div className="flex items-center gap-4">
        
        {/* Notificações */}
        <button className="p-2 text-slate-500 hover:text-slate-800 relative rounded-xl hover:bg-slate-100 transition-colors cursor-pointer">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-600 rounded-full ring-2 ring-white"></span>
        </button>
        
        <div className="h-6 w-[1px] bg-slate-200" />

        {/* 🔑 O BOTÃO DO SEU NOME QUE ABRE TODAS AS TELAS */}
        <div className="relative">
          <button 
            onClick={() => setMenuPerfilAberto(!menuPerfilAberto)}
            className="flex items-center gap-3 group cursor-pointer focus:outline-none"
          >
            {/* Avatar com Inicial */}
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm shadow-sm transition-colors group-hover:bg-indigo-600 group-hover:text-white">
              V
            </div>
            
            <div className="text-left">
              <p className="text-xs font-bold text-slate-700 group-hover:text-slate-900 transition-colors">Victor Developer</p>
              <p className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-wide">
                {nivelAcesso === 'master' ? 'Admin Master' : nivelAcesso === 'financeiro' ? 'Financeiro' : 'Estoque'}
              </p>
            </div>

            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform duration-200 ${menuPerfilAberto ? 'rotate-180' : ''}`} />
          </button>

          {/* 🚨 DROPDOWN COMPLETO TEMA CLARO COM FILTRO RBAC */}
          {menuPerfilAberto && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuPerfilAberto(false)} />
              
              <div className="absolute right-0 mt-3 w-80 sm:w-[480px] bg-white border border-slate-200 rounded-2xl shadow-xl p-4 z-20 animate-in fade-in slide-in-from-top-2 duration-150 grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* COLUNA 1: OPERACIONAL E FINANCEIRO */}
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2.5 mb-1">Módulos do ERP</p>
                  
                  <button onClick={() => { setMenuPerfilAberto(false); router.push('/dashboard'); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer">
                    <LayoutDashboard className="w-4 h-4 text-indigo-500" />
                    Dashboard Principal
                  </button>

                  {temAcessoFinanceiro && (
                    <>
                      <button onClick={() => { setMenuPerfilAberto(false); router.push('/fluxo'); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer">
                        <FileText className="w-4 h-4 text-emerald-500" />
                        Fluxo de Caixa / Extrato
                      </button>

                      <button onClick={() => { setMenuPerfilAberto(false); router.push('/pagar'); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer">
                        <TrendingDown className="w-4 h-4 text-rose-500" />
                        Contas a Pagar
                      </button>

                      <button onClick={() => { setMenuPerfilAberto(false); router.push('/receber'); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer">
                        <TrendingUp className="w-4 h-4 text-emerald-500" />
                        Contas a Receber
                      </button>

                      <button onClick={() => { setMenuPerfilAberto(false); router.push('/lancamento'); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer">
                        <PlusCircle className="w-4 h-4 text-sky-500" />
                        Lançamento Manual
                      </button>
                    </>
                  )}
                </div>

                {/* COLUNA 2: CADASTROS, ESTOQUE E AUDITORIA */}
                <div className="space-y-1 flex flex-col justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2.5 mb-1">Cadastros & Análise</p>
                    
                    {temAcessoFinanceiro && (
                      <>
                        <button onClick={() => { setMenuPerfilAberto(false); router.push('/clientes'); }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer">
                          <Users className="w-4 h-4 text-amber-500" />
                          Cadastro de Clientes
                        </button>

                        <button onClick={() => { setMenuPerfilAberto(false); router.push('/fornecedores'); }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer">
                          <Users className="w-4 h-4 text-orange-500" />
                          Cadastro de Fornecedores
                        </button>
                      </>
                    )}

                    {temAcessoEstoque && (
                      <>
                        <button onClick={() => { setMenuPerfilAberto(false); router.push('/produtos'); }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer">
                          <Boxes className="w-4 h-4 text-purple-500" />
                          Catálogo de Produtos
                        </button>

                        <button onClick={() => { setMenuPerfilAberto(false); router.push('/controle'); }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer">
                          <Boxes className="w-4 h-4 text-fuchsia-500" />
                          Controle de Estoque
                        </button>
                      </>
                    )}

                    {/* 📊 ROTAS EXCLUSIVAS DO ADMINISTRADOR MASTER */}
                    {ehMaster && (
                      <div className="pt-1 mt-1 border-t border-slate-100 space-y-1">
                        <button onClick={() => { setMenuPerfilAberto(false); router.push('/relatorios'); }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer">
                          <BarChart3 className="w-4 h-4 text-indigo-600" />
                          Relatórios Avançados
                        </button>

                        <button onClick={() => { setMenuPerfilAberto(false); router.push('/usuarios'); }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 bg-indigo-50/50 rounded-xl text-xs font-bold text-indigo-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors cursor-pointer border border-indigo-100/40">
                          <UserCog className="w-4 h-4 text-indigo-600" />
                          Controle de Usuários
                        </button>
                      </div>
                    )}
                  </div>

                  {/* RODAPÉ DO MENU: PERFIL, EMPRESA E LOGOUT */}
                  <div className="pt-2 border-t border-slate-100 mt-2 space-y-1 sm:col-span-2">
                    <div className="grid grid-cols-2 gap-1">
                      <button onClick={() => { setMenuPerfilAberto(false); router.push('/perfil'); }}
                        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        Meu Perfil
                      </button>
                      
                      <button onClick={() => { setMenuPerfilAberto(false); router.push('/empresa'); }}
                        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        Minha Empresa
                      </button>
                    </div>

                    <button onClick={() => { setMenuPerfilAberto(false); handleLogout(); }}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100/70 border border-rose-200 transition-all cursor-pointer mt-1">
                      <LogOut className="w-4 h-4" />
                      Sair do Sistema ERP
                    </button>
                  </div>
                </div>

              </div>
            </>
          )}
        </div>

      </div>
    </header>
  );
}