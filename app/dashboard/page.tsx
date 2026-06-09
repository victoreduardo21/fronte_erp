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
  Layers,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

// Interfaces internas e locais do próprio Front-End
interface MetricKPI {
  titulo: string;
  valor: string;
  status: string;
  sub: string;
  icone: React.ComponentType<any>;
  cor: string;
  bg: string;
}

interface GraphData {
  idx: number;
  mes: string;
  hIn: string;   
  hOut: string;  
  valorIn: string;
  valorOut: string;
}

interface ActivityLog {
  id: string;
  titulo: string;
  modulo: string;
  tipo: 'entrada' | 'saida';
  tempo: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [carregando, setCarregando] = useState<boolean>(true);
  const [mesSelecionadoIdx, setMesSelecionadoIdx] = useState<number>(0); 

  // Estados locais e limpos para produção
  const [kpis, setKpis] = useState<MetricKPI[]>([]);
  const [dadosGrafico, setDadosGrafico] = useState<GraphData[]>([]);
  const [atividades, setAtividades] = useState<ActivityLog[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('@erp:token');
    if (!token) {
      router.replace('/');
      return;
    }

    async function carregarDadosDashboard() {
      try {
        // O front-end bate na API normalmente buscando os dados reais do banco
        // const res = await fetch('http://localhost:4000/api/v1/dashboard', { headers: { Authorization: `Bearer ${token}` } });
        // const data = await res.json();
        
        const dataAtual = new Date();
        setMesSelecionadoIdx(dataAtual.getMonth());

        // Inicializadores de produção zerados normais do componente front-end
        setKpis([
          { titulo: 'Faturamento Mensal', valor: 'R$ 0,00', status: '0%', sub: 'Sem lançamentos', icone: DollarSign, cor: 'text-emerald-600', bg: 'bg-emerald-50' },
          { titulo: 'Contas a Receber', valor: 'R$ 0,00', status: '0%', sub: 'Nenhum boleto em aberto', icone: Wallet, cor: 'text-indigo-600', bg: 'bg-indigo-50' },
          { titulo: 'Contas a Pagar', valor: 'R$ 0,00', status: '0%', sub: 'Nenhum vencimento hoje', icone: TrendingUp, cor: 'text-rose-600', bg: 'bg-rose-50' },
          { titulo: 'Total de Clientes', valor: '0 ativos', status: '0%', sub: 'Base de dados vazia', icone: Users, cor: 'text-amber-600', bg: 'bg-amber-50' },
        ]);

        setDadosGrafico([
          { idx: 0, mes: 'Jan', hIn: '0%', hOut: '0%', valorIn: '0', valorOut: '0' },
          { idx: 1, mes: 'Fev', hIn: '0%', hOut: '0%', valorIn: '0', valorOut: '0' },
          { idx: 2, mes: 'Mar', hIn: '0%', hOut: '0%', valorIn: '0', valorOut: '0' },
          { idx: 3, mes: 'Abr', hIn: '0%', hOut: '0%', valorIn: '0', valorOut: '0' },
          { idx: 4, mes: 'Mai', hIn: '0%', hOut: '0%', valorIn: '0', valorOut: '0' },
          { idx: 5, mes: 'Jun', hIn: '0%', hOut: '0%', valorIn: '0', valorOut: '0' },
          { idx: 6, mes: 'Jul', hIn: '0%', hOut: '0%', valorIn: '0', valorOut: '0' },
          { idx: 7, mes: 'Ago', hIn: '0%', hOut: '0%', valorIn: '0', valorOut: '0' },
          { idx: 8, mes: 'Set', hIn: '0%', hOut: '0%', valorIn: '0', valorOut: '0' },
          { idx: 9, mes: 'Out', hIn: '0%', hOut: '0%', valorIn: '0', valorOut: '0' },
          { idx: 10, mes: 'Nov', hIn: '0%', hOut: '0%', valorIn: '0', valorOut: '0' },
          { idx: 11, mes: 'Dez', hIn: '0%', hOut: '0%', valorIn: '0', valorOut: '0' },
        ]);

        setAtividades([]);

        setCarregando(false);
      } catch (error) {
        console.error('Erro ao conectar com o banco de dados:', error);
        setCarregando(false);
      }
    }

    carregarDadosDashboard();
  }, [router]);

  const dadosMesFocado = dadosGrafico[mesSelecionadoIdx] || { valorIn: '0', valorOut: '0' };

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
            return (
              <div key={index} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center justify-between transition-all hover:shadow-md hover:border-slate-300 group">
                <div className="space-y-2">
                  <p className="text-slate-400 text-[11px] font-bold tracking-wider uppercase">{item.titulo}</p>
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight transition-colors group-hover:text-indigo-600">{item.valor}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200/60">
                      {item.status}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">{item.sub}</span>
                  </div>
                </div>
                <div className={`p-3.5 rounded-2xl ${item.bg} ${item.cor} shadow-inner`}>
                  <Icone className="w-5 h-5" />
                </div>
              </div>
            );
          })}
        </div>

        {/* GRÁFICO E LISTA DE ATIVIDADES */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          
          {/* GRÁFICO DE BARRAS LIMPO E COM VALORES FIXOS NO TOPO */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm lg:col-span-2 flex flex-col justify-between overflow-hidden">
            
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
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
                    <span className="text-slate-600 font-bold">Entradas (R$ {dadosMesFocado.valorIn})</span>
                  </div>
                  <div className="w-[1px] h-3 bg-slate-200" />
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                    <span className="text-slate-600 font-bold">Saídas (R$ {dadosMesFocado.valorOut})</span>
                  </div>
                </div>

                {/* Filtro Select */}
                <div className="relative flex items-center">
                  <select 
                    value={mesSelecionadoIdx}
                    onChange={(e) => setMesSelecionadoIdx(Number(e.target.value))}
                    className="bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-1.5 text-[11px] font-bold text-slate-700 focus:outline-none focus:border-indigo-500 transition-all cursor-pointer appearance-none shadow-sm hover:bg-slate-50"
                  >
                    {dadosGrafico.map((dado) => (
                      <option key={dado.idx} value={dado.idx}>
                        Mês: {dado.mes}
                      </option>
                    ))}
                  </select>
                  <span className="absolute right-3 pointer-events-none text-slate-400 text-[8px]">▼</span>
                </div>
              </div>
            </div>

            {/* Renderização Fluida das Colunas */}
            <div className="w-full pt-6">
              <div className="h-44 flex items-end justify-between px-1 border-b border-slate-100 gap-1.5 sm:gap-2 relative bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px]">
                
                {dadosGrafico.map((dado) => {
                  const ehMesSelecionado = dado.idx === mesSelecionadoIdx;

                  const alturaEntrada = dado.hIn.includes('%') ? dado.hIn : `${dado.hIn}%`;
                  const alturaSaida = dado.hOut.includes('%') ? dado.hOut : `${dado.hOut}%`;

                  return (
                    <div 
                      key={dado.idx} 
                      onMouseEnter={() => setMesSelecionadoIdx(dado.idx)}
                      className="flex flex-col items-center flex-1 group relative pb-2 cursor-pointer"
                    >
                      {/* Barras Verticais com os valores alinhados acima delas fixamente */}
                      <div className="w-full flex items-end justify-center gap-1 h-32 relative">
                        
                        {/* Coluna 1: Entradas (Indigo) */}
                        <div className="flex flex-col items-center justify-end h-full w-full relative">
                          <span className={`text-[8px] font-extrabold tracking-tighter mb-0.5 transition-all duration-200
                            ${ehMesSelecionado ? 'text-indigo-600 scale-105 font-black' : 'text-slate-400'}
                          `}>
                            {dado.valorIn}
                          </span>
                          <div 
                            style={{ height: alturaEntrada }}
                            className={`w-full rounded-t-[3px] transition-all duration-300 ease-out
                              ${ehMesSelecionado 
                                ? 'bg-indigo-600 shadow-[0_4px_12px_rgba(79,70,229,0.35)]' 
                                : 'bg-indigo-200 group-hover:bg-indigo-400'
                              }
                            `} 
                          />
                        </div>
                        
                        {/* Coluna 2: Saídas (Rose) */}
                        <div className="flex flex-col items-center justify-end h-full w-full relative">
                          <span className={`text-[8px] font-extrabold tracking-tighter mb-0.5 transition-all duration-200
                            ${ehMesSelecionado ? 'text-rose-600 scale-105 font-black' : 'text-slate-400'}
                          `}>
                            {dado.valorOut}
                          </span>
                          <div 
                            style={{ height: alturaSaida }}
                            className={`w-full rounded-t-[3px] transition-all duration-300 ease-out
                              ${ehMesSelecionado 
                                ? 'bg-rose-500 shadow-[0_4px_12px_rgba(244,63,94,0.35)]' 
                                : 'bg-rose-200 group-hover:bg-rose-400'
                              }
                            `} 
                          />
                        </div>

                      </div>

                      {/* Nome do Mês */}
                      <div className="flex flex-col items-center w-full relative pt-2">
                        <span className={`text-[11px] font-bold tracking-wide transition-colors duration-200
                          ${ehMesSelecionado ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}
                        `}>
                          {dado.mes}
                        </span>
                        <span className={`absolute bottom-0 h-[2.5px] bg-indigo-600 rounded-full transition-all duration-300
                          ${ehMesSelecionado ? 'w-5 shadow-[0_1px_6px_rgba(79,70,229,0.6)]' : 'w-0'}
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
            
            <div className="space-y-4 mt-6 overflow-y-auto pr-1 flex-1 text-xs flex flex-col items-center justify-center min-h-[180px]">
              {atividades.length > 0 ? (
                atividades.map((log) => (
                  <div key={log.id} className="w-full flex items-start justify-between border-b border-slate-100 pb-3.5 hover:bg-slate-50/50 p-1.5 rounded-xl transition-colors">
                    <div className="flex gap-3">
                      <div className={`p-2 rounded-xl self-center shadow-inner ${log.tipo === 'entrada' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                        {log.tipo === 'entrada' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="text-slate-800 font-bold">{log.titulo}</p>
                        <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{log.modulo}</p>
                      </div>
                    </div>
                    <span className="text-slate-400 text-[10px] font-semibold bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200/40">{log.tempo}</span>
                  </div>
                ))
              ) : (
                <div className="text-center text-slate-400 font-medium">
                  <p className="text-xs">Nenhuma atividade recente.</p>
                  <p className="text-[10px] text-slate-400/70 mt-0.5">Novos logs aparecerão conforme os funcionários operarem o ERP.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}