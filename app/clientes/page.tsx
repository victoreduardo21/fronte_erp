'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import { 
  Search, 
  PlusCircle,
  Loader2,
  Users,
  CheckCircle,
  UserPlus,
  Edit2,
  Trash2,
  Building2,
  UserCheck
} from 'lucide-react';

export default function CadastroClientesPage() {
  const router = useRouter();
  const [carregando, setCarregando] = useState<boolean>(true);
  const [busca, setBusca] = useState<string>('');
  const [filtroStatus, setFiltroStatus] = useState<string>('todos'); // todos, ativo, inativo

  // Estado dinâmico de clientes simulando a base de dados do ERP
  const [clientes, setClientes] = useState([
    { id: '1', nome: 'Distribuidora de Alimentos Alfa Ltda', documento: '12.345.678/0001-90', email: 'financeiro@alfa.com.br', telefone: '(11) 98765-4321', tipo: 'PJ', status: 'ativo' },
    { id: '2', nome: 'Carlos Henrique Silva', documento: '456.789.123-00', email: 'carlos.silva@gmail.com', telefone: '(21) 99888-7766', tipo: 'PF', status: 'ativo' },
    { id: '3', nome: 'Indústria e Comércio Beta S/A', documento: '98.765.432/0001-10', email: 'compras@beta.ind.br', telefone: '(41) 3322-1100', tipo: 'PJ', status: 'ativo' },
    { id: '4', nome: 'Mariana Costa Oliveira', documento: '789.123.456-11', email: 'mari.costa@outlook.com', telefone: '(31) 98555-4433', tipo: 'PF', status: 'inativo' },
    { id: '5', nome: 'Tech Soluções e Sistemas Eireli', documento: '55.666.777/0001-22', email: 'contato@techsolucoes.com', telefone: '(81) 3444-5555', tipo: 'PJ', status: 'ativo' },
  ]);

  useEffect(() => {
    const token = localStorage.getItem('@erp:token');
    if (!token) {
      router.replace('/');
    } else {
      setCarregando(false);
    }
  }, [router]);

  // Alternar Status do Cliente (Ativar / Desativar rápido)
  function handleAlternarStatus(id: string) {
    setClientes(clientesAnteriores =>
      clientesAnteriores.map(cliente =>
        cliente.id === id 
          ? { ...cliente, status: cliente.status === 'ativo' ? 'inativo' : 'ativo' } 
          : cliente
      )
    );
  }

  // Função para deletar (simulada)
  function handleDeletarCliente(id: string) {
    if (confirm('Tem certeza que deseja remover este cliente?')) {
      setClientes(clientesAnteriores => clientesAnteriores.filter(c => c.id !== id));
    }
  }

  // Lógica de Filtro e Busca por Nome, Documento ou E-mail
  const clientesFiltrados = clientes.filter(c => {
    const bateBusca = 
      c.nome.toLowerCase().includes(busca.toLowerCase()) || 
      c.documento.includes(busca) || 
      c.email.toLowerCase().includes(busca.toLowerCase());
    const bateStatus = filtroStatus === 'todos' || c.status === filtroStatus;
    return bateBusca && bateStatus;
  });

  // Métricas dinâmicas do topo
  const totalClientes = clientes.length;
  const totalAtivos = clientes.filter(c => c.status === 'ativo').length;
  const novosDoMes = clientes.filter(c => c.tipo === 'PJ').length; // Simulação comercial para preencher o KPI

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
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Cadastro de Clientes</h1>
            <p className="text-xs text-slate-500 mt-0.5">Gerencie a base de clientes, contatos corporativos e dados de faturamento.</p>
          </div>
          <button 
            onClick={() => router.push('/clientes/novo')}
            className="flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold text-white shadow-md shadow-indigo-600/10 transition-colors cursor-pointer self-start sm:self-center"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Adicionar Cliente
          </button>
        </div>

        {/* Painel de Indicadores Cadastrais */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total de Clientes</p>
              <h3 className="text-base font-bold text-slate-800 mt-1">{totalClientes} cadastrados</h3>
            </div>
            <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600">
              <Users className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Clientes Ativos</p>
              <h3 className="text-base font-bold text-emerald-600 mt-1">{totalAtivos} operando</h3>
            </div>
            <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Contas Corporativas (PJ)</p>
              <h3 className="text-base font-bold text-amber-600 mt-1">{novosDoMes} empresas</h3>
            </div>
            <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600">
              <UserPlus className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Barra de Filtros e Pesquisa */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="relative w-full md:w-80 flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input 
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por nome, CNPJ, CPF ou e-mail..."
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

        {/* 📊 TABELA DE CLIENTES */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-5">Cliente / Razão Social</th>
                  <th className="py-4 px-5">CPF / CNPJ</th>
                  <th className="py-4 px-5">Contato</th>
                  <th className="py-4 px-5">Tipo</th>
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-5 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
                {clientesFiltrados.length > 0 ? (
                  clientesFiltrados.map((cliente) => {
                    return (
                      <tr key={cliente.id} className="hover:bg-slate-50 transition-colors group">
                        
                        {/* Nome e Ícone do Tipo */}
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${cliente.tipo === 'PJ' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-600'}`}>
                              {cliente.tipo === 'PJ' ? <Building2 className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                            </div>
                            <div>
                              <p className="font-bold text-slate-700 group-hover:text-slate-900 transition-colors">{cliente.nome}</p>
                              <p className="text-[10px] text-slate-400 font-medium">{cliente.email}</p>
                            </div>
                          </div>
                        </td>

                        {/* Documento */}
                        <td className="py-3.5 px-5 font-semibold text-slate-500">
                          {cliente.documento}
                        </td>

                        {/* Telefone */}
                        <td className="py-3.5 px-5 text-slate-500 font-medium">
                          {cliente.telefone}
                        </td>

                        {/* Badge de Tipo */}
                        <td className="py-3.5 px-5">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${cliente.tipo === 'PJ' ? 'bg-amber-50 text-amber-700 border border-amber-200/50' : 'bg-slate-100 text-slate-600'}`}>
                            {cliente.tipo}
                          </span>
                        </td>

                        {/* Status Badges */}
                        <td className="py-3.5 px-5">
                          <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider
                            ${cliente.status === 'ativo' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'}
                          `}>
                            {cliente.status}
                          </span>
                        </td>

                        {/* 🛠️ AÇÕES DO CADASTRO */}
                        <td className="py-3.5 px-5 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            
                            {/* Alternar Status rápido */}
                            <button 
                              onClick={() => handleAlternarStatus(cliente.id)}
                              title={cliente.status === 'ativo' ? 'Inativar Cliente' : 'Ativar Cliente'}
                              className={`p-1.5 border rounded-lg transition-colors cursor-pointer ${
                                cliente.status === 'ativo' 
                                  ? 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100' 
                                  : 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-600 hover:text-white'
                              }`}
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                            </button>

                            {/* Editar */}
                            <button 
                              onClick={() => router.push(`/clientes/editar?id=${cliente.id}`)}
                              title="Editar Dados"
                              className="p-1.5 bg-slate-50 text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            {/* Deletar */}
                            <button 
                              onClick={() => handleDeletarCliente(cliente.id)}
                              title="Excluir Registro"
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
                      Nenhum cliente encontrado para esta pesquisa.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Rodapé */}
          <div className="bg-slate-50/60 border-t border-slate-200 px-5 py-3 flex items-center justify-between text-[11px] text-slate-400 font-semibold">
            <span>Mostrando {clientesFiltrados.length} entidades comerciais cadastradas</span>
            <span className="text-slate-400 uppercase tracking-widest text-[9px]">GTS CRM Core</span>
          </div>
        </div>

      </main>
    </div>
  );
}