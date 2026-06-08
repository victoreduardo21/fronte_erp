'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar'; 
import { 
  DollarSign, 
  Wallet, 
  TrendingUp, 
  Users, 
  Loader2,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [carregando, setCarregando] = useState<boolean>(true);
  const [mesSelecionadoIdx, setMesSelecionadoIdx] = useState<number>(5); 

  useEffect(() => {
    const token = localStorage.getItem('@erp:token');
    if (!token) {
      router.replace('/');
    } else {
      const data = new Date();
      setMesSelecionadoIdx(data.getMonth());
      setCarregando(false);
    }
  }, [router]);

  const kpis = [
    { titulo: 'Faturamento Mensal', valor: 'R$ 45.200,00', status: '+12%', sub: 'vs mês passado', icone: DollarSign, cor: 'text-emerald-600', bg: 'bg-emerald-50' },
    { titulo: 'Contas a Receber', valor: 'R$ 12.850,00', status: '+4%', sub: '7 faturas abertas', icone: Wallet, cor: 'text-indigo-600', bg: 'bg-indigo-50' },
    { titulo: 'Contas a Pagar', valor: 'R$ 8.430,00', status: '-2%', sub: 'vence hoje: 2', icone: TrendingUp, cor: 'text-rose-600', bg: 'bg-rose-50' },
    { titulo: 'Total de Clientes', valor: '148 empresas', status: '+18%', sub: 'em crescimento', icone: Users, cor: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  const dadosGrafico = [
    { idx: 0, mes: 'Jan', hIn: 'h-[65%]', hOut: 'h-[40%]', valorIn: '32k', valorOut: '18k' },
    { idx: 1, mes: 'Fev', hIn: 'h-[80%]', hOut: 'h-[55%]', valorIn: '38k', valorOut: '22k' },
    { idx: 2, mes: 'Mar', hIn: 'h-[45%]', hOut: 'h-[50%]', valorIn: '21k', valorOut: '24k' },
    { idx: 3, mes: 'Abr', hIn: 'h-[90%]', hOut: 'h-[60%]', valorIn: '42k', valorOut: '28k' },
    { idx: 4, mes: 'Mai', hIn: 'h-[100%]', hOut: 'h-[48%]', valorIn: '45k', valorOut: '20k' },
    { idx: 5, mes: 'Jun', hIn: 'h-[75%]', hOut: 'h-[65%]', valorIn: '34k', valorOut: '30k' },
    { idx: 6, mes: 'Jul', hIn: 'h-[85%]', hOut: 'h-[50%]', valorIn: '40k', valorOut: '23k' },
    { idx: 7, mes: 'Ago', hIn: 'h-[60%]', hOut: 'h-[70%]', valorIn: '28k', valorOut: '32k' },
    { idx: 8, mes: 'Set', hIn: 'h-[95%]', hOut: 'h-[40%]', valorIn: '43k', valorOut: '19k' },
    { idx: 9, mes: 'Out', hIn: 'h-[70%]', hOut: 'h-[55%]', valorIn: '33k', valorOut: '25k' },
    { idx: 10, mes: 'Nov', hIn: 'h-[80%]', hOut: 'h-[60%]', valorIn: '37k', valorOut: '27k' },
    { idx: 11, mes: 'Dez', hIn: 'h-[90%]', hOut: 'h-[35%]', valorIn: '48k', valorOut: '16k' },
  ];

  // Identifica os dados do mês em foco para exibição no cabeçalho do gráfico
  const dadosMesFocado = dadosGrafico[mesSelecionadoIdx] || dadosGrafico[5];

  if (carregando) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-700 flex flex-col antialiased">
      
      <Navbar onMenuClick={() => console.log('Menu')} />

      <main className="flex-1 p-4 md:p-6 max-w-7xl w-full mx-auto space-y-6">
        
        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Visão Geral</h1>
            <p className="text-xs text-slate-500 mt-0.5">Métricas consolidadas de saúde financeira e movimentações de estoque.</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-600 font-semibold bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm self-start sm:self-center">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Sincronizado em tempo real
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((item, index) => {
            const Icone = item.icone;
            const isPositivo = item.status.startsWith('+');
            return (
              <div key={index} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center justify-between transition-all hover:shadow-md hover:border-slate-300 group">
                <div className="space-y-2">
                  <p className="text-slate-400 text-[11px] font-bold tracking-wider uppercase">{item.titulo}</p>
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight transition-colors group-hover:text-indigo-600">{item.valor}</h3>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${isPositivo ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
                      {item.status}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">{item.sub}</span>
                  </div>
                </div>
                <div className={`p-3.5 rounded-2xl ${item.bg} ${item.cor} transition-transform group-hover:scale-110 duration-200 shadow-inner`}>
                  <Icone className="w-5 h-5" />
                </div>
              </div>
            );
          })}
        </div>

        {/* GRÁFICO E LISTA DE ATIVIDADES */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          
          {/* SEÇÃO DO GRÁFICO ANUAL */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm lg:col-span-2 flex flex-col justify-between overflow-hidden group/graph">
            
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
              <div>
                <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-slate-400" />
                  Fluxo de Caixa Operacional
                </h4>
                <p className="text-slate-400 text-xs mt-0.5">Demonstrativo de faturamento (entradas) contra custos de competência (saídas)</p>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-[11px] font-bold self-start sm:self-center">
                <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/60 px-3 py-1.5 rounded-xl">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                    <span className="text-slate-600 font-bold">Entradas (R$ {dadosMesFocado.valorIn})</span>
                  </div>
                  <div className="w-[1px] h-3 bg-slate-200" />
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                    <span className="text-slate-600 font-bold">Saídas (R$ {dadosMesFocado.valorOut})</span>
                  </div>
                </div>

                {/* Filtro Select */}
                <div className="relative flex items-center">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
                  <select 
                    value={mesSelecionadoIdx}
                    onChange={(e) => setMesSelecionadoIdx(Number(e.target.value))}
                    className="bg-white border border-slate-200 rounded-xl pl-8 pr-8 py-1.5 text-[11px] font-bold text-slate-700 focus:outline-none focus:border-indigo-500 transition-all cursor-pointer appearance-none shadow-sm hover:bg-slate-50"
                  >
                    {dadosGrafico.map((dado) => (
                      <option key={dado.idx} value={dado.idx}>
                        Foco: {dado.mes}
                      </option>
                    ))}
                  </select>
                  <span className="absolute right-3 pointer-events-none text-slate-400 text-[8px]">▼</span>
                </div>
              </div>
            </div>

            {/* Container das Colunas */}
            <div className="w-full overflow-x-auto scrollbar-none pt-4">
              <div className="h-56 flex items-end justify-between px-2 border-b border-slate-100 min-w-[620px] lg:min-w-0 gap-3 relative bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px]">
                
                {dadosGrafico.map((dado) => {
                  const ehMesSelecionado = dado.idx === mesSelecionadoIdx;

                  return (
                    <div 
                      key={dado.idx} 
                      onMouseEnter={() => setMesSelecionadoIdx(dado.idx)}
                      className="flex flex-col items-center flex-1 group relative pb-3 cursor-pointer"
                    >
                      
                      {/* Tooltip Avançado */}
                      <div className={`absolute -top-14 bg-slate-900 text-white text-[10px] p-2 rounded-xl shadow-xl transition-all duration-200 z-10 pointer-events-none flex flex-col gap-0.5 text-left min-w-[95px]
                        ${ehMesSelecionado ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-1'}
                      `}>
                        <p className="text-[9px] text-slate-400 font-bold border-b border-slate-800 pb-1 mb-1 uppercase tracking-wider">Mês de {dado.mes}</p>
                        <span className="text-indigo-300 font-bold flex items-center justify-between">Rec: <span>R$ {dado.valorIn}</span></span>
                        <span className="text-rose-300 font-bold flex items-center justify-between">Pag: <span>R$ {dado.valorOut}</span></span>
                      </div>

                      {/* Área das Velas/Barras */}
                      <div className="w-full flex items-end justify-center gap-2 h-40 relative">
                        
                        {/* Coluna 1: Entradas (Indigo) */}
                        <div className="flex flex-col items-center justify-end h-full w-3 relative">
                          <span className={`text-[9px] font-extrabold mb-1 absolute transition-all duration-200
                            ${ehMesSelecionado ? 'text-indigo-600 scale-110 -translate-y-1' : 'text-slate-400/70 opacity-0 group-hover:opacity-100'}
                          `} style={{ bottom: `calc(${dado.hIn.match(/\d+/)?.[0]}% + 2px)` }}>
                            {dado.valorIn}
                          </span>
                          <div className={`
                            ${dado.hIn} w-full rounded-t-md transition-all duration-300 ease-out
                            ${ehMesSelecionado 
                              ? 'bg-indigo-600 shadow-[0_4px_14px_rgba(79,70,229,0.35)]' 
                              : 'bg-indigo-200 group-hover:bg-indigo-400'}
                          `} />
                        </div>
                        
                        {/* Coluna 2: Saídas (Rose) */}
                        <div className="flex flex-col items-center justify-end h-full w-3 relative">
                          <span className={`text-[9px] font-extrabold mb-1 absolute transition-all duration-200
                            ${ehMesSelecionado ? 'text-rose-600 scale-110 -translate-y-1' : 'text-slate-400/70 opacity-0 group-hover:opacity-100'}
                          `} style={{ bottom: `calc(${dado.hOut.match(/\d+/)?.[0]}% + 2px)` }}>
                            {dado.valorOut}
                          </span>
                          <div className={`
                            ${dado.hOut} w-full rounded-t-md transition-all duration-300 ease-out
                            ${ehMesSelecionado 
                              ? 'bg-rose-500 shadow-[0_4px_14px_rgba(244,63,94,0.35)]' 
                              : 'bg-rose-200 group-hover:bg-rose-400'}
                          `} />
                        </div>

                      </div>

                      {/* Nome do Mês */}
                      <div className="flex flex-col items-center w-full relative pt-2">
                        <span className={`text-xs font-bold tracking-wide transition-colors duration-200
                          ${ehMesSelecionado ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}
                        `}>
                          {dado.mes}
                        </span>
                        
                        {/* Linha indicadora animada */}
                        <span className={`absolute bottom-0 h-[3px] bg-indigo-600 rounded-full transition-all duration-300
                          ${ehMesSelecionado ? 'w-6 shadow-[0_1px_6px_rgba(79,70,229,0.6)]' : 'w-0'}
                        `} />
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Atividades do Sistema */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between">
                <h4 className="text-base font-bold text-slate-900">Atividades do Sistema</h4>
                <button 
                  onClick={() => router.push('/fluxo')}
                  className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  Ver Tudo
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <p className="text-slate-400 text-xs mt-0.5">Últimas movimentações auditadas</p>
            </div>
            
            <div className="space-y-4 mt-6 overflow-y-auto pr-1 flex-1 text-xs">
              <div className="flex items-start justify-between border-b border-slate-100 pb-3.5 hover:bg-slate-50/50 p-1.5 rounded-xl transition-colors">
                <div className="flex gap-3">
                  <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 self-center shadow-inner">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-slate-800 font-bold">Novo cliente cadastrado</p>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Módulo de Entidades</p>
                  </div>
                </div>
                <span className="text-slate-400 text-[10px] font-semibold bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200/40">5m atrás</span>
              </div>

              <div className="flex items-start justify-between border-b border-slate-100 pb-3.5 hover:bg-slate-50/50 p-1.5 rounded-xl transition-colors">
                <div className="flex gap-3">
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 self-center shadow-inner">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-slate-800 font-bold">Fatura recebida (R$ 1.200)</p>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Contas a Receber</p>
                  </div>
                </div>
                <span className="text-slate-400 text-[10px] font-semibold bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200/40">1h atrás</span>
              </div>

              <div className="flex items-start justify-between hover:bg-slate-50/50 p-1.5 rounded-xl transition-colors">
                <div className="flex gap-3">
                  <div className="p-2 rounded-xl bg-rose-50 text-rose-600 self-center shadow-inner">
                    <ArrowDownRight className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-slate-800 font-bold">Conta de luz lançada</p>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Contas a Pagar</p>
                  </div>
                </div>
                <span className="text-slate-400 text-[10px] font-semibold bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200/40">3h atrás</span>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}