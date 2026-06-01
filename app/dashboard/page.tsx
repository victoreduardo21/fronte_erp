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
  Calendar
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Visão Geral</h1>
            <p className="text-xs text-slate-500 mt-0.5">Métricas de saúde financeira e cadastros consolidados.</p>
          </div>
          <div className="text-xs text-slate-600 font-semibold bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm self-start sm:self-center">
            Atualizado agora mesmo
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((item, index) => {
            const Icone = item.icone;
            const isPositivo = item.status.startsWith('+');
            return (
              <div key={index} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center justify-between transition-all hover:border-slate-300">
                <div className="space-y-1.5">
                  <p className="text-slate-400 text-[11px] font-bold tracking-wide uppercase">{item.titulo}</p>
                  <h3 className="text-lg font-bold text-slate-800 tracking-tight">{item.valor}</h3>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isPositivo ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                      {item.status}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">{item.sub}</span>
                  </div>
                </div>
                <div className={`p-3 rounded-xl ${item.bg} ${item.cor}`}>
                  <Icone className="w-5 h-5" />
                </div>
              </div>
            );
          })}
        </div>

        {/* GRÁFICO E LISTA DE ATIVIDADES */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          
          {/* SEÇÃO DO GRÁFICO ANUAL */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm lg:col-span-2 flex flex-col justify-between overflow-hidden">
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <h4 className="text-sm font-bold text-slate-800">Fluxo de Caixa</h4>
                <p className="text-slate-400 text-[11px] mt-0.5">Comparativo anual de faturamento (entradas) vs custos (saídas)</p>
              </div>
              
              <div className="flex items-center gap-4 text-[11px] font-bold self-start sm:self-center">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                    <span className="text-slate-500 font-semibold">Entradas</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                    <span className="text-slate-500 font-semibold">Saídas</span>
                  </div>
                </div>

                {/* Filtro Select */}
                <div className="relative flex items-center">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
                  <select 
                    value={mesSelecionadoIdx}
                    onChange={(e) => setMesSelecionadoIdx(Number(e.target.value))}
                    className="bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-7 py-1.5 text-[11px] font-bold text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer appearance-none shadow-sm"
                  >
                    {dadosGrafico.map((dado) => (
                      <option key={dado.idx} value={dado.idx} className="bg-white">
                        Mês: {dado.mes}
                      </option>
                    ))}
                  </select>
                  <span className="absolute right-2.5 pointer-events-none text-slate-400 text-[8px]">▼</span>
                </div>
              </div>
            </div>

            {/* Container das Colunas com Valores Fixos */}
            <div className="w-full overflow-x-auto scrollbar-none">
              <div className="h-52 flex items-end justify-between px-2 pt-6 border-b border-slate-100 min-w-[600px] lg:min-w-0 gap-1">
                {dadosGrafico.map((dado) => {
                  const ehMesSelecionado = dado.idx === mesSelecionadoIdx;

                  return (
                    <div 
                      key={dado.idx} 
                      className="flex flex-col items-center flex-1 group relative pb-2"
                    >
                      
                      {/* Tooltip Dinâmico */}
                      <div className="absolute -top-12 bg-slate-900 text-white text-[10px] p-2 rounded-xl shadow-md opacity-0 group-hover:opacity-100 transition-all duration-150 z-10 pointer-events-none flex flex-col gap-0.5 text-center min-w-[85px]">
                        <span className="text-indigo-300 font-bold">Rec: R$ {dado.valorIn}</span>
                        <span className="text-rose-300 font-bold">Pag: R$ {dado.valorOut}</span>
                      </div>

                      {/* Área das Velas/Barras Delgadas com Valores Fixos no Topo */}
                      <div className="w-full flex items-end justify-center gap-1.5 h-36 mb-2 relative">
                        
                        {/* Coluna 1: Entradas (Indigo) */}
                        <div className="flex flex-col items-center justify-end h-full w-2.5 relative">
                          <span className={`text-[9px] font-bold mb-1 absolute transition-all duration-300
                            ${ehMesSelecionado ? 'text-indigo-600 font-extrabold scale-105' : 'text-slate-400'}
                          `} style={{ bottom: `calc(${dado.hIn.match(/\d+/)?.[0]}% + 2px)` }}>
                            {dado.valorIn}
                          </span>
                          <div className={`
                            ${dado.hIn} w-full rounded-t-full transition-all duration-500 ease-out
                            ${ehMesSelecionado 
                              ? 'bg-indigo-600 shadow-[0_4px_12px_rgba(79,70,229,0.3)] scale-x-[1.15]' 
                              : 'bg-indigo-600/20 group-hover:bg-indigo-600/50'}
                          `} />
                        </div>
                        
                        {/* Coluna 2: Saídas (Rose) */}
                        <div className="flex flex-col items-center justify-end h-full w-2.5 relative">
                          <span className={`text-[9px] font-bold mb-1 absolute transition-all duration-300
                            ${ehMesSelecionado ? 'text-rose-600 font-extrabold scale-105' : 'text-slate-400'}
                          `} style={{ bottom: `calc(${dado.hOut.match(/\d+/)?.[0]}% + 2px)` }}>
                            {dado.valorOut}
                          </span>
                          <div className={`
                            ${dado.hOut} w-full rounded-t-full transition-all duration-500 ease-out
                            ${ehMesSelecionado 
                              ? 'bg-rose-500 shadow-[0_4px_12px_rgba(244,63,94,0.3)] scale-x-[1.15]' 
                              : 'bg-rose-500/20 group-hover:bg-rose-500/50'}
                        `} />
                        </div>

                      </div>

                      {/* Nome do Mês */}
                      <div className="flex flex-col items-center w-full relative pt-1.5">
                        <span className={`text-[11px] font-bold tracking-wide transition-colors duration-300
                          ${ehMesSelecionado ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}
                        `}>
                          {dado.mes}
                        </span>
                        
                        {/* Linha indicadora abaixo do mês selecionado */}
                        {ehMesSelecionado && (
                          <span className="absolute bottom-[-9px] w-6 h-[2px] bg-indigo-600 rounded-full shadow-[0_1px_4px_rgba(79,70,229,0.5)]" />
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Atividades do Sistema */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-800">Atividades do Sistema</h4>
              <p className="text-slate-400 text-[11px] mt-0.5">Últimas movimentações</p>
            </div>
            
            <div className="space-y-4 mt-6 overflow-y-auto pr-1 flex-1 text-xs">
              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <div className="flex gap-2.5">
                  <div className="p-1 rounded-lg bg-indigo-50 text-indigo-600 mt-0.5">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-slate-700 font-bold">Novo cliente cadastrado</p>
                    <p className="text-[10px] text-slate-400 font-semibold">Módulo de Entidades</p>
                  </div>
                </div>
                <span className="text-slate-400 text-[10px] font-semibold">5m atrás</span>
              </div>

              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <div className="flex gap-2.5">
                  <div className="p-1 rounded-lg bg-emerald-50 text-emerald-600 mt-0.5">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-slate-700 font-bold">Fatura recebida (R$ 1.200)</p>
                    <p className="text-[10px] text-slate-400 font-semibold">Contas a Receber</p>
                  </div>
                </div>
                <span className="text-slate-400 text-[10px] font-semibold">1h atrás</span>
              </div>

              <div className="flex items-start justify-between">
                <div className="flex gap-2.5">
                  <div className="p-1 rounded-lg bg-rose-50 text-rose-600 mt-0.5">
                    <ArrowDownRight className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-slate-700 font-bold">Conta de luz lançada</p>
                    <p className="text-[10px] text-slate-400 font-semibold">Contas a Pagar</p>
                  </div>
                </div>
                <span className="text-slate-400 text-[10px] font-semibold">3h atrás</span>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}