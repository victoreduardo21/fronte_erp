'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import { 
  Search, 
  PlusCircle,
  Loader2,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Check,
  Edit2
} from 'lucide-react';

// Interfaces internas exclusivas do comportamento do Front-End
interface ContaPagar {
  id: string;
  fornecedor: string;
  categoria: string;
  vencimento: string;
  valor: number;
  status: 'pago' | 'pendente' | 'vencido';
}

export default function ContasAPagarPage() {
  const router = useRouter();
  const [carregando, setCarregando] = useState<boolean>(true);
  const [busca, setBusca] = useState<string>('');
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');

  // 🗄️ ESTADO ZERADO PRONTO PARA PRODUÇÃO (CONEXÃO COM BACKEND)
  const [contas, setContas] = useState<ContaPagar[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('@erp:token');
    if (!token) {
      router.replace('/');
      return;
    }

    async function carregarContasAPagar() {
      try {
        // 📡 CHAMADA REAL À SUA API DE CONTAS A PAGAR NODE.JS
        // const res = await fetch('http://localhost:4000/api/v1/financeiro/pagar', { headers: { Authorization: `Bearer ${token}` } });
        // const data = await res.json();
        // setContas(data.contas);

        // Inicializador limpo de produção
        setContas([]);
        setCarregando(false);
      } catch (error) {
        console.error('Erro ao buscar contas a pagar do banco:', error);
        setCarregando(false);
      }
    }

    carregarContasAPagar();
  }, [router]);

  // 🔑 FUNÇÃO DE DAR BAIXA OPERACIONAL COM ATUALIZAÇÃO NO BANCO (FETCH COMENTADO)
  async function handleDarBaixa(id: string) {
    // const token = localStorage.getItem('@erp:token');
    // await fetch(`http://localhost:4000/api/v1/financeiro/pagar/${id}/baixa`, { method: 'PATCH', headers: { Authorization: `Bearer ${token}` } });
    
    setContas(contasAnteriores => 
      contasAnteriores.map(conta => 
        conta.id === id ? { ...conta, status: 'pago' } : conta
      )
    );
  }

  // Lógica de Filtro e Busca
  const contasFiltradas = contas.filter(c => {
    const bateBusca = c.fornecedor.toLowerCase().includes(busca.toLowerCase()) || c.categoria.toLowerCase().includes(busca.toLowerCase());
    const bateStatus = filtroStatus === 'todos' || c.status === filtroStatus;
    return bateBusca && bateStatus;
  });

  // Cálculos dinâmicos dos blocos superiores de indicadores
  const totalEmAberto = contas.filter(c => c.status === 'pendente').reduce((acc, curr) => acc + curr.valor, 0);
  const totalPago = contas.filter(c => c.status === 'pago').reduce((acc, curr) => acc + curr.valor, 0);
  const totalVencido = contas.filter(c => c.status === 'vencido').reduce((acc, curr) => acc + curr.valor, 0);

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
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Contas a Pagar</h1>
            <p className="text-xs text-slate-500 mt-0.5">Controle de saídas, despesas operacionais e fluxo de fornecedores.</p>
          </div>
          <button 
            onClick={() => router.push('/lancamento')}
            className="flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold text-white shadow-md shadow-indigo-600/10 transition-colors cursor-pointer self-start sm:self-center"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Lançar Despesa
          </button>
        </div>

        {/* Painel de Indicadores Atualizando em Tempo Real */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total em Aberto</p>
              <h3 className="text-base font-bold text-slate-800 mt-1">
                {totalEmAberto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </h3>
            </div>
            <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Pago (Mês)</p>
              <h3 className="text-base font-bold text-emerald-600 mt-1">
                {totalPago.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </h3>
            </div>
            <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Vencido</p>
              <h3 className="text-base font-bold text-rose-600 mt-1">
                {totalVencido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
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
              placeholder="Buscar por fornecedor ou categoria..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 p-1 border border-slate-200 rounded-xl w-full md:w-auto">
            {['todos', 'pago', 'pendente', 'vencido'].map((status) => (
              <button 
                key={status}
                onClick={() => setFiltroStatus(status)}
                className={`flex-1 md:flex-initial px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer capitalize
                  ${filtroStatus === status 
                    ? 'bg-white text-slate-800 shadow-sm border border-slate-200' 
                    : 'text-slate-500 hover:text-slate-800'}`}
              >
                {status === 'todos' ? 'Todos' : status === 'pendente' ? 'Em Aberto' : status + 'os'}
              </button>
            ))}
          </div>
        </div>

        {/* Tabela de Contas a Pagar com Ações */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-5">Fornecedor</th>
                  <th className="py-4 px-5">Categoria</th>
                  <th className="py-4 px-5">Vencimento</th>
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-5 text-right">Valor</th>
                  <th className="py-4 px-5 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
                {contasFiltradas.length > 0 ? (
                  contasFiltradas.map((conta) => {
                    return (
                      <tr key={conta.id} className="hover:bg-slate-50 transition-colors group">
                        
                        <td className="py-3.5 px-5 font-bold text-slate-700 group-hover:text-slate-900 transition-colors">
                          {conta.fornecedor}
                        </td>

                        <td className="py-3.5 px-5 text-slate-500 font-medium">
                          <span className="bg-slate-100 border border-slate-200/60 px-2 py-0.5 rounded-md text-[10px]">
                            {conta.categoria}
                          </span>
                        </td>

                        <td className="py-3.5 px-5 text-slate-400 font-semibold">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            {conta.vencimento}
                          </div>
                        </td>

                        <td className="py-3.5 px-5">
                          <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider
                            ${conta.status === 'pago' && 'bg-emerald-50 text-emerald-700 border border-emerald-100'}
                            ${conta.status === 'pendente' && 'bg-indigo-50 text-indigo-700 border border-indigo-100'}
                            ${conta.status === 'vencido' && 'bg-rose-50 text-rose-700 border border-rose-100'}
                          `}>
                            {conta.status === 'pendente' ? 'Em Aberto' : conta.status}
                          </span>
                        </td>

                        <td className="py-3.5 px-5 text-right font-bold tracking-tight text-sm text-slate-800">
                          {conta.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </td>

                        <td className="py-3.5 px-5 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            
                            {/* Botão de Dar Baixa (Só aparece se não estiver pago) */}
                            {conta.status !== 'pago' ? (
                              <button 
                                type="button"
                                onClick={() => handleDarBaixa(conta.id)}
                                title="Liquidar Despesa (Dar Baixa)"
                                className="p-1.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg hover:bg-emerald-600 hover:text-white transition-colors cursor-pointer"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100/50">
                                Liquidado
                              </span>
                            )}

                            {/* Botão de Editar */}
                            <button 
                              type="button"
                              onClick={() => router.push(`/lancamento?edit=${conta.id}`)}
                              title="Editar Lançamento"
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
                      Nenhuma conta a pagar identificada no banco de dados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="bg-slate-50/60 border-t border-slate-200 px-5 py-3 flex items-center justify-between text-[11px] text-slate-400 font-semibold">
            <span>Listando {contasFiltradas.length} obrigações financeiras</span>
            <span className="text-slate-400 uppercase tracking-widest text-[9px]">GTS Accounts Payable</span>
          </div>
        </div>

      </main>
    </div>
  );
}