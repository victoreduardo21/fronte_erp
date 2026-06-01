'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Search, 
  Download, 
  PlusCircle,
  Loader2,
  TrendingUp,
  TrendingDown,
  CircleDollarSign
} from 'lucide-react';

export default function FluxoCaixaPage() {
  const router = useRouter();
  const [carregando, setCarregando] = useState<boolean>(true);
  const [busca, setBusca] = useState<string>('');
  const [filtroTipo, setFiltroTipo] = useState<string>('todos'); // todos, entrada, saida

  useEffect(() => {
    const token = localStorage.getItem('@erp:token');
    if (!token) {
      router.replace('/');
    } else {
      setCarregando(false);
    }
  }, [router]);

  // Mock de transações simulando o banco de dados do ERP
  const transacoesMock = [
    { id: '1', descricao: 'Mensalidade SaaS - Cliente Alfa', tipo: 'entrada', categoria: 'Serviços', valor: 1500.00, data: '31/05/2026', status: 'pago' },
    { id: '2', descricao: 'Licença Cloud Server AWS', tipo: 'saida', categoria: 'Infraestrutura', valor: 850.00, data: '28/05/2026', status: 'pago' },
    { id: '3', descricao: 'Consultoria Backend Módulo ERP', tipo: 'entrada', categoria: 'Desenvolvimento', valor: 4200.00, data: '25/05/2026', status: 'pago' },
    { id: '4', descricao: 'Conta de Energia Elétrica', tipo: 'saida', categoria: 'Custos Fixos', valor: 340.50, data: '22/05/2026', status: 'pago' },
    { id: '5', descricao: 'Licença de Software de Design', tipo: 'saida', categoria: 'Ferramentas', valor: 120.00, data: '20/05/2026', status: 'pendente' },
    { id: '6', descricao: 'Venda de Licença Enterprise - Beta Ltda', tipo: 'entrada', categoria: 'Produtos', valor: 12500.00, data: '18/05/2026', status: 'pago' },
  ];

  const transacoesFiltradas = transacoesMock.filter(t => {
    const bateBusca = t.descricao.toLowerCase().includes(busca.toLowerCase()) || t.categoria.toLowerCase().includes(busca.toLowerCase());
    const bateTipo = filtroTipo === 'todos' || t.tipo === filtroTipo;
    return bateBusca && bateTipo;
  });

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
        
        {/* Cabeçalho de Ações */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Fluxo de Caixa</h1>
            <p className="text-xs text-slate-500 mt-0.5">Gerencie e audite o histórico completo financeiro da empresa.</p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-center">
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer shadow-sm">
              <Download className="w-3.5 h-3.5" />
              Exportar
            </button>
            <button 
              onClick={() => router.push('/lancamento')}
              className="flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold text-white shadow-md shadow-indigo-600/10 transition-colors cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Novo Lançamento
            </button>
          </div>
        </div>

        {/* Mini Painel de Saldos */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Entradas do Período</p>
              <h3 className="text-base font-bold text-emerald-600 mt-1">R$ 18.200,00</h3>
            </div>
            <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Saídas do Período</p>
              <h3 className="text-base font-bold text-rose-600 mt-1">R$ 1.310,50</h3>
            </div>
            <div className="p-2.5 rounded-lg bg-rose-50 text-rose-600">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Saldo Líquido</p>
              <h3 className="text-base font-bold text-slate-800 mt-1">R$ 16.889,50</h3>
            </div>
            <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600">
              <CircleDollarSign className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Filtros e Busca */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="relative w-full md:w-80 flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input 
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por descrição ou categoria..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 p-1 border border-slate-200 rounded-xl w-full md:w-auto">
            <button 
              onClick={() => setFiltroTipo('todos')}
              className={`flex-1 md:flex-initial px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${filtroTipo === 'todos' ? 'bg-white text-slate-800 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Todos
            </button>
            <button 
              onClick={() => setFiltroTipo('entrada')}
              className={`flex-1 md:flex-initial px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${filtroTipo === 'entrada' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Entradas
            </button>
            <button 
              onClick={() => setFiltroTipo('saida')}
              className={`flex-1 md:flex-initial px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${filtroTipo === 'saida' ? 'bg-rose-50 text-rose-700 border border-rose-200/60' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Saídas
            </button>
          </div>
        </div>

        {/* Tabela de Extrato */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-5">Tipo</th>
                  <th className="py-4 px-5">Descrição</th>
                  <th className="py-4 px-5">Categoria</th>
                  <th className="py-4 px-5">Data Lançamento</th>
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-5 text-right">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
                {transacoesFiltradas.length > 0 ? (
                  transacoesFiltradas.map((transacao) => {
                    const isEntrada = transacao.tipo === 'entrada';
                    return (
                      <tr key={transacao.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="py-3.5 px-5">
                          <div className={`p-1.5 rounded-lg inline-flex ${isEntrada ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                            {isEntrada ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                          </div>
                        </td>
                        <td className="py-3.5 px-5 font-bold text-slate-700 group-hover:text-slate-900 transition-colors">
                          {transacao.descricao}
                        </td>
                        <td className="py-3.5 px-5 text-slate-500 font-medium">
                          <span className="bg-slate-100 border border-slate-200/60 px-2 py-0.5 rounded-md text-[10px]">
                            {transacao.categoria}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-slate-400 font-semibold">
                          {transacao.data}
                        </td>
                        <td className="py-3.5 px-5">
                          <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider
                            ${transacao.status === 'pago' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}
                          `}>
                            {transacao.status}
                          </span>
                        </td>
                        <td className={`py-3.5 px-5 text-right font-bold tracking-tight text-sm
                          ${isEntrada ? 'text-emerald-600' : 'text-rose-600'}
                        `}>
                          {isEntrada ? '+ ' : '- '}
                          {transacao.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400 text-xs font-semibold">
                      Nenhum lançamento encontrado para os filtros aplicados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="bg-slate-50/60 border-t border-slate-200 px-5 py-3 flex items-center justify-between text-[11px] text-slate-400 font-semibold">
            <span>Exibindo {transacoesFiltradas.length} de {transacoesMock.length} registros</span>
            <span className="text-slate-400 uppercase tracking-widest text-[9px]">GTS Secure Line</span>
          </div>
        </div>

      </main>
    </div>
  );
}