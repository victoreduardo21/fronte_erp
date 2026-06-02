'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import { 
  Search, 
  PlusCircle,
  Loader2,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Check,
  Edit2
} from 'lucide-react';

export default function ContasAReceberPage() {
  const router = useRouter();
  const [carregando, setCarregando] = useState<boolean>(true);
  const [busca, setBusca] = useState<string>('');
  const [filtroStatus, setFiltroStatus] = useState<string>('todos'); // todos, recebido, pendente, vencido

  // Estado dinâmico com faturas simulando o banco de dados do ERP
  const [faturas, setFaturas] = useState([
    { id: '1', cliente: 'SaaS Enterprise - Cliente Alfa', categoria: 'Contratos', vencimento: '05/06/2026', valor: 2500.00, status: 'pendente' },
    { id: '2', cliente: 'Desenvolvimento Web - StartHub', categoria: 'Serviços', vencimento: '15/06/2026', valor: 4200.00, status: 'pendente' },
    { id: '3', cliente: 'Licença Mensal - Beta Ltda', categoria: 'Produtos', vencimento: '28/05/2026', valor: 1500.00, status: 'recebido' },
    { id: '4', cliente: 'Consultoria Backend - TechSolutions', categoria: 'Serviços', vencimento: '20/05/2026', valor: 1800.00, status: 'vencido' },
    { id: '5', cliente: 'Suporte Técnico Premium - Omega', categoria: 'Contratos', vencimento: '01/06/2026', valor: 350.00, status: 'pendente' },
    { id: '6', cliente: 'Setup de Infraestrutura - Inova Corp', categoria: 'Serviços', vencimento: '25/05/2026', valor: 2500.00, status: 'recebido' },
  ]);

  useEffect(() => {
    const token = localStorage.getItem('@erp:token');
    if (!token) {
      router.replace('/');
    } else {
      setCarregando(false);
    }
  }, [router]);

  // 🔑 FUNÇÃO DE DAR BAIXA EM FATURAS (Muda status para Recebido)
  function handleDarBaixa(id: string) {
    setFaturas(faturasAnteriores => 
      faturasAnteriores.map(fatura => 
        fatura.id === id ? { ...fatura, status: 'recebido' } : fatura
      )
    );
  }

  // Lógica de Filtro e Busca
  const faturasFiltradas = faturas.filter(f => {
    const bateBusca = f.cliente.toLowerCase().includes(busca.toLowerCase()) || f.categoria.toLowerCase().includes(busca.toLowerCase());
    const bateStatus = filtroStatus === 'todos' || f.status === filtroStatus;
    return bateBusca && bateStatus;
  });

  // Cálculos dinâmicos dos blocos com base no estado atualizado
  const totalAguardando = faturas.filter(f => f.status === 'pendente').reduce((acc, curr) => acc + curr.valor, 0);
  const totalRecebido = faturas.filter(f => f.status === 'recebido').reduce((acc, curr) => acc + curr.valor, 0);
  const totalAtrasado = faturas.filter(f => f.status === 'vencido').reduce((acc, curr) => acc + curr.valor, 0);

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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Contas a Receber</h1>
            <p className="text-xs text-slate-500 mt-0.5">Gerencie o faturamento, faturas emitidas e a previsão de entrada de caixa.</p>
          </div>
          <button 
            onClick={() => router.push('/lancamento')}
            className="flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold text-white shadow-md shadow-indigo-600/10 transition-colors cursor-pointer self-start sm:self-center"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Nova Fatura
          </button>
        </div>

        {/* Painel de Indicadores Financeiros Dinâmicos */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">A Receber (Aberto)</p>
              <h3 className="text-base font-bold text-slate-800 mt-1">
                {totalAguardando.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </h3>
            </div>
            <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Recebido</p>
              <h3 className="text-base font-bold text-emerald-600 mt-1">
                {totalRecebido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </h3>
            </div>
            <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Inadimplência</p>
              <h3 className="text-base font-bold text-rose-600 mt-1">
                {totalAtrasado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </h3>
            </div>
            <div className="p-2.5 rounded-lg bg-rose-50 text-rose-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Filtros e Pesquisa */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="relative w-full md:w-80 flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input 
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por cliente ou categoria..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 p-1 border border-slate-200 rounded-xl w-full md:w-auto">
            {['todos', 'recebido', 'pendente', 'vencido'].map((status) => (
              <button 
                key={status}
                onClick={() => setFiltroStatus(status)}
                className={`flex-1 md:flex-initial px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer capitalize
                  ${filtroStatus === status 
                    ? 'bg-white text-slate-800 shadow-sm border border-slate-200' 
                    : 'text-slate-500 hover:text-slate-800'}`}
              >
                {status === 'todos' ? 'Todos' : status === 'recebido' ? 'Recebidos' : status + 's'}
              </button>
            ))}
          </div>
        </div>

        {/* 📊 TABELA DE CONTAS A RECEBER */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-5">Cliente</th>
                  <th className="py-4 px-5">Categoria</th>
                  <th className="py-4 px-5">Vencimento</th>
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-5 text-right">Valor</th>
                  <th className="py-4 px-5 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
                {faturasFiltradas.length > 0 ? (
                  faturasFiltradas.map((fatura) => {
                    return (
                      <tr key={fatura.id} className="hover:bg-slate-50 transition-colors group">
                        
                        {/* Cliente */}
                        <td className="py-3.5 px-5 font-bold text-slate-700 group-hover:text-slate-900 transition-colors">
                          {fatura.cliente}
                        </td>

                        {/* Categoria */}
                        <td className="py-3.5 px-5 text-slate-500 font-medium">
                          <span className="bg-slate-100 border border-slate-200/60 px-2 py-0.5 rounded-md text-[10px]">
                            {fatura.categoria}
                          </span>
                        </td>

                        {/* Vencimento */}
                        <td className="py-3.5 px-5 text-slate-400 font-semibold">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            {fatura.vencimento}
                          </div>
                        </td>

                        {/* Status Customizados */}
                        <td className="py-3.5 px-5">
                          <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider
                            ${fatura.status === 'recebido' && 'bg-emerald-50 text-emerald-700'}
                            ${fatura.status === 'pendente' && 'bg-indigo-50 text-indigo-700'}
                            ${fatura.status === 'vencido' && 'bg-rose-50 text-rose-700'}
                          `}>
                            {fatura.status}
                          </span>
                        </td>

                        {/* Valor */}
                        <td className="py-3.5 px-5 text-right font-bold tracking-tight text-sm text-slate-800">
                          {fatura.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </td>

                        {/* 🛠️ AÇÕES INTERATIVAS */}
                        <td className="py-3.5 px-5 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            
                            {/* Botão de Confirmar Recebimento (Dar Baixa) */}
                            {fatura.status !== 'recebido' ? (
                              <button 
                                onClick={() => handleDarBaixa(fatura.id)}
                                title="Confirmar Recebimento"
                                className="p-1.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg hover:bg-emerald-600 hover:text-white transition-colors cursor-pointer"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100/50">
                                Recebido
                              </span>
                            )}

                            {/* Botão de Editar */}
                            <button 
                              onClick={() => router.push(`/lancamento?edit=${fatura.id}`)}
                              title="Editar Fatura"
                              className="p-1.5 bg-slate-50 text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                          </div>
                        </td>

                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400 text-xs font-semibold">
                      Nenhuma fatura a receber encontrada para este filtro.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Rodapé da Tabela */}
          <div className="bg-slate-50/60 border-t border-slate-200 px-5 py-3 flex items-center justify-between text-[11px] text-slate-400 font-semibold">
            <span>Listando {faturasFiltradas.length} faturas registradas</span>
            <span className="text-slate-400 uppercase tracking-widest text-[9px]">GTS Audit Mode</span>
          </div>
        </div>

      </main>
    </div>
  );
}