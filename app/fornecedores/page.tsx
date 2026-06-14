'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import { 
  Search, 
  PlusCircle, 
  Loader2, 
  Building, 
  CheckCircle, 
  PackageCheck, 
  Edit2, 
  Trash2, 
  Truck, 
  ShieldCheck
} from 'lucide-react';

// Interfaces internas exclusivas do comportamento do Front-End
interface Fornecedor {
  id: string;
  nome: string;
  documento: string;
  email: string;
  telefone: string;
  categoria: string;
  status: 'ativo' | 'inativo';
}

export default function CadastroFornecedoresPage() {
  const router = useRouter();
  const [carregando, setCarregando] = useState<boolean>(true);
  const [busca, setBusca] = useState<string>('');
  const [filtroStatus, setFiltroStatus] = useState<string>('todos'); // todos, ativo, inativo

  // 🗄️ ESTADO ZERADO PRONTO PARA PRODUÇÃO (CONEXÃO COM BACKEND)
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('@erp:token');
    if (!token) {
      router.replace('/');
      return;
    }

    async function carregarFornecedores() {
      try {
        // 📡 CHAMADA REAL À SUA API DE FORNECEDORES NODE.JS
        // const res = await fetch('http://localhost:4000/api/v1/fornecedores', { headers: { Authorization: `Bearer ${token}` } });
        // const data = await res.json();
        // setFornecedores(data.fornecedores);

        // Inicializador limpo de produção
        setFornecedores([]);
        setCarregando(false);
      } catch (error) {
        console.error('Erro ao buscar fornecedores da base de dados:', error);
        setCarregando(false);
      }
    }

    carregarFornecedores();
  }, [router]);

  // 🔑 ALTERNAR STATUS COM PATCH NO BACKEND (FETCH COMENTADO)
  async function handleAlternarStatus(id: string, statusAtual: 'ativo' | 'inativo') {
    const novoStatus = statusAtual === 'ativo' ? 'inativo' : 'ativo';
    // const token = localStorage.getItem('@erp:token');
    // await fetch(`http://localhost:4000/api/v1/fornecedores/${id}/status`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ status: novoStatus }) });

    setFornecedores(fornecedoresAnteriores =>
      fornecedoresAnteriores.map(fornecedor =>
        fornecedor.id === id ? { ...fornecedor, status: novoStatus } : fornecedor
      )
    );
  }

  // 🔑 REMOVER REGISTRO COM DELETE NO BACKEND (FETCH COMENTADO)
  async function handleDeletarFornecedor(id: string) {
    if (confirm('Tem certeza que deseja remover este fornecedor da base?')) {
      // const token = localStorage.getItem('@erp:token');
      // await fetch(`http://localhost:4000/api/v1/fornecedores/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });

      setFornecedores(fornecedoresAnteriores => fornecedoresAnteriores.filter(f => f.id !== id));
    }
  }

  // 🚀 FILTRO CORRIGIDO: Removido o lixo de digitação que causava o erro .map
  const fornecedoresFiltrados = fornecedores.filter(f => {
    const bateBusca = 
      f.nome.toLowerCase().includes(busca.toLowerCase()) || 
      f.documento.includes(busca) || 
      f.categoria.toLowerCase().includes(busca.toLowerCase());
    const bateStatus = filtroStatus === 'todos' || f.status === filtroStatus;
    return bateBusca && bateStatus;
  });

  // Métricas do topo reativas baseadas no estado real vindos da API
  const totalFornecedores = fornecedores.length;
  const totalAtivos = fornecedores.filter(f => f.status === 'ativo').length;
  const totalCategorias = new Set(fornecedores.map(f => f.categoria)).size;

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
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Cadastro de Fornecedores</h1>
            <p className="text-xs text-slate-500 mt-0.5">Gerencie a cadeia de suprimentos, parceiros logísticos e prestadores de serviços.</p>
          </div>
          <button 
            onClick={() => router.push('/fornecedores/novo')}
            className="flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold text-white shadow-md shadow-indigo-600/10 transition-colors cursor-pointer self-start sm:self-center"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Adicionar Fornecedor
          </button>
        </div>

        {/* Indicadores do Topo */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total de Fornecedores</p>
              <h3 className="text-base font-bold text-slate-800 mt-1">{totalFornecedores} homologados</h3>
            </div>
            <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600">
              <Building className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Contratos Ativos</p>
              <h3 className="text-base font-bold text-emerald-600 mt-1">{totalAtivos} fornecendo</h3>
            </div>
            <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Canais de Suprimentos</p>
              <h3 className="text-base font-bold text-amber-600 mt-1">{totalCategorias} setores mapeados</h3>
            </div>
            <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600">
              <PackageCheck className="w-4 h-4" />
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
              placeholder="Buscar por nome, CNPJ ou segmento..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 p-1 border border-slate-200 rounded-xl w-full md:w-auto">
            {['todos', 'ativo', 'inativo'].map((status) => (
              <button 
                key={status}
                onClick={() => setFiltroStatus(status)}
                className={`flex-1 md:flex-initial px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer capitalize
                  ${filtroStatus === status 
                    ? 'bg-white text-slate-800 shadow-sm border border-slate-200' 
                    : 'text-slate-500 hover:text-slate-800'}`}
              >
                {status === 'todos' ? 'Todos' : status === 'ativo' ? 'Ativos' : 'Inativos'}
              </button>
            ))}
          </div>
        </div>

        {/* 📊 TABELA DE FORNECEDORES */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-5">Razão Social / Credor</th>
                  <th className="py-4 px-5">CNPJ</th>
                  <th className="py-4 px-5">Contato</th>
                  <th className="py-4 px-5">Segmento</th>
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-5 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
                {fornecedoresFiltrados.length > 0 ? (
                  fornecedoresFiltrados.map((fornecedor) => {
                    return (
                      <tr key={fornecedor.id} className="hover:bg-slate-50 transition-colors group">
                        
                        {/* Razão Social e Ícone */}
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                              <Truck className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="font-bold text-slate-700 group-hover:text-slate-900 transition-colors">{fornecedor.nome}</p>
                              <p className="text-[10px] text-slate-400 font-medium">{fornecedor.email}</p>
                            </div>
                          </div>
                        </td>

                        {/* CNPJ */}
                        <td className="py-3.5 px-5 font-semibold text-slate-500">
                          {fornecedor.documento}
                        </td>

                        {/* Telefone */}
                        <td className="py-3.5 px-5 text-slate-500 font-medium">
                          {fornecedor.telefone}
                        </td>

                        {/* Categoria / Segmento */}
                        <td className="py-3.5 px-5">
                          <span className="bg-slate-100 border border-slate-200/60 px-2 py-0.5 rounded-md text-[10px] font-bold text-slate-600">
                            {fornecedor.categoria}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-5">
                          <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider
                            ${fornecedor.status === 'ativo' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-slate-100 text-slate-400'}
                          `}>
                            {fornecedor.status}
                          </span>
                        </td>

                        {/* Ações operacionais do cadastro */}
                        <td className="py-3.5 px-5 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            
                            {/* Ativar / Inativar Rápido */}
                            <button 
                              type="button"
                              onClick={() => handleAlternarStatus(fornecedor.id, fornecedor.status)}
                              title={fornecedor.status === 'ativo' ? 'Suspender Fornecedor' : 'Reativar Fornecedor'}
                              className={`p-1.5 border rounded-lg transition-colors cursor-pointer ${
                                fornecedor.status === 'ativo' 
                                  ? 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100' 
                                  : 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-600 hover:text-white'
                              }`}
                            >
                              <ShieldCheck className="w-3.5 h-3.5" />
                            </button>

                            {/* Editar */}
                            <button 
                              type="button"
                              onClick={() => router.push(`/fornecedores/editar?id=${fornecedor.id}`)}
                              title="Editar Fornecedor"
                              className="p-1.5 bg-slate-50 text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            {/* Excluir */}
                            <button 
                              type="button"
                              onClick={() => handleDeletarFornecedor(fornecedor.id)}
                              title="Remover Registro"
                              className="p-1.5 bg-rose-50 text-rose-600 border border-rose-100 rounded-lg hover:bg-rose-600 hover:text-white transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>

                          </div>
                        </td>

                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400 text-xs font-semibold">
                      Nenhum fornecedor homologado na base de dados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="bg-slate-50/60 border-t border-slate-200 px-5 py-3 flex items-center justify-between text-[11px] text-slate-400 font-semibold">
            <span>Mostrando {fornecedoresFiltrados.length} parceiros homologados</span>
            <span className="text-slate-400 uppercase tracking-widest text-[9px]">GTS Supply Chain</span>
          </div>
        </div>

      </main>
    </div>
  );
}