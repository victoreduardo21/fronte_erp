'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import { 
  Search, 
  PlusCircle,
  Loader2,
  Boxes,
  AlertCircle,
  CheckCircle,
  Edit2,
  Trash2,
  Package,
  DollarSign
} from 'lucide-react';

export default function CatalogoProdutosPage() {
  const router = useRouter();
  const [carregando, setCarregando] = useState<boolean>(true);
  const [busca, setBusca] = useState<string>('');
  const [filtroEstoque, setFiltroEstoque] = useState<string>('todos'); // todos, normal, baixo

  // Estado dinâmico de produtos simulando o estoque real do ERP
  const [produtos, setProdutos] = useState([
    { id: '1', sku: 'PROD-001', nome: 'Caixa de Ferramentas Master', categoria: 'Ferragens', preco: 189.90, estoque: 45, estoqueMinimo: 10 },
    { id: '2', sku: 'PROD-002', nome: 'Óleo Lubrificante Industrial 1L', categoria: 'Químicos', preco: 34.50, estoque: 8, estoqueMinimo: 15 }, // Baixo estoque
    { id: '3', sku: 'PROD-003', nome: 'Fita Isolante Alta Fusão 10m', categoria: 'Elétrica', preco: 15.20, estoque: 120, estoqueMinimo: 20 },
    { id: '4', sku: 'PROD-004', nome: 'Luva de Proteção Nitrílica (Par)', categoria: 'EPI', preco: 18.00, estoque: 5, estoqueMinimo: 30 }, // Baixo estoque
    { id: '5', sku: 'PROD-005', nome: 'Disjuntor Monofásico 32A', categoria: 'Elétrica', preco: 24.90, estoque: 62, estoqueMinimo: 12 },
  ]);

  useEffect(() => {
    const token = localStorage.getItem('@erp:token');
    if (!token) {
      router.replace('/');
    } else {
      setCarregando(false);
    }
  }, [router]);

  // Função simulada para deletar produto do catálogo
  function handleDeletarProduto(id: string) {
    if (confirm('Tem certeza que deseja excluir este produto do catálogo?')) {
      setProdutos(produtosAnteriores => produtosAnteriores.filter(p => p.id !== id));
    }
  }

  // Filtro por Nome, SKU ou Categoria
  const produtosFiltrados = produtos.filter(p => {
    const bateBusca = 
      p.nome.toLowerCase().includes(busca.toLowerCase()) || 
      p.sku.toLowerCase().includes(busca.toLowerCase()) ||
      p.categoria.toLowerCase().includes(busca.toLowerCase());
    
    const isBaixoEstoque = p.estoque < p.estoqueMinimo;
    const bateEstoque = 
      filtroEstoque === 'todos' || 
      (filtroEstoque === 'baixo' && isBaixoEstoque) || 
      (filtroEstoque === 'normal' && !isBaixoEstoque);

    return bateBusca && bateEstoque;
  });

  // Métricas dinâmicas do topo baseadas no estado
  const totalProdutos = produtos.length;
  const totalItensEstoque = produtos.reduce((acc, curr) => acc + curr.estoque, 0);
  const totalCriticos = produtos.filter(p => p.estoque < p.estoqueMinimo).length;

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
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Catálogo de Produtos</h1>
            <p className="text-xs text-slate-500 mt-0.5">Cadastro de itens comerciais, precificação, SKUs e controle mínimo de segurança.</p>
          </div>
          <button 
            onClick={() => router.push('/produtos/novo')}
            className="flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold text-white shadow-md shadow-indigo-600/10 transition-colors cursor-pointer self-start sm:self-center"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Cadastrar Produto
          </button>
        </div>

        {/* Indicadores do Topo */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Itens no Catálogo</p>
              <h3 className="text-base font-bold text-slate-800 mt-1">{totalProdutos} SKU's ativos</h3>
            </div>
            <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600">
              <Boxes className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Volume Total em Estoque</p>
              <h3 className="text-base font-bold text-emerald-600 mt-1">{totalItensEstoque} unidades</h3>
            </div>
            <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Alerta de Reposição</p>
              <h3 className="text-base font-bold text-rose-600 mt-1">{totalCriticos} itens críticos</h3>
            </div>
            <div className="p-2.5 rounded-lg bg-rose-50 text-rose-600">
              <AlertCircle className="w-4 h-4" />
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
              placeholder="Buscar por nome, SKU ou categoria..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 p-1 border border-slate-200 rounded-xl w-full md:w-auto">
            <button 
              onClick={() => setFiltroEstoque('todos')}
              className={`flex-1 md:flex-initial px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${filtroEstoque === 'todos' ? 'bg-white text-slate-800 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Todos
            </button>
            <button 
              onClick={() => setFiltroEstoque('normal')}
              className={`flex-1 md:flex-initial px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${filtroEstoque === 'normal' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Estoque OK
            </button>
            <button 
              onClick={() => setFiltroEstoque('baixo')}
              className={`flex-1 md:flex-initial px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${filtroEstoque === 'baixo' ? 'bg-rose-50 text-rose-700 border border-rose-200/60' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Estoque Baixo
            </button>
          </div>
        </div>

        {/* 📊 TABELA DO CATÁLOGO DE PRODUTOS */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-5">Código (SKU)</th>
                  <th className="py-4 px-5">Nome do Produto</th>
                  <th className="py-4 px-5">Categoria</th>
                  <th className="py-4 px-5 text-right">Preço de Venda</th>
                  <th className="py-4 px-5 text-center">Qtd. Estoque</th>
                  <th className="py-4 px-5 text-center">Status</th>
                  <th className="py-4 px-5 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
                {produtosFiltrados.length > 0 ? (
                  produtosFiltrados.map((produto) => {
                    const isCritico = produto.estoque < produto.estoqueMinimo;
                    return (
                      <tr key={produto.id} className="hover:bg-slate-50 transition-colors group">
                        
                        {/* SKU */}
                        <td className="py-3.5 px-5 font-mono text-xs font-bold text-indigo-600">
                          {produto.sku}
                        </td>

                        {/* Nome do Produto */}
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-slate-100 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                              <Package className="w-4 h-4" />
                            </div>
                            <span className="font-bold text-slate-700 group-hover:text-slate-900 transition-colors">
                              {produto.nome}
                            </span>
                          </div>
                        </td>

                        {/* Categoria */}
                        <td className="py-3.5 px-5 text-slate-500 font-medium">
                          <span className="bg-slate-100 border border-slate-200/60 px-2 py-0.5 rounded-md text-[10px] font-bold text-slate-600">
                            {produto.categoria}
                          </span>
                        </td>

                        {/* Preço de Venda */}
                        <td className="py-3.5 px-5 text-right font-bold tracking-tight text-slate-800">
                          {produto.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </td>

                        {/* Estoque Atual */}
                        <td className={`py-3.5 px-5 text-center font-bold text-sm ${isCritico ? 'text-rose-600' : 'text-slate-700'}`}>
                          {produto.estoque}
                          <span className="text-[10px] text-slate-400 font-normal block">mín: {produto.estoqueMinimo}</span>
                        </td>

                        {/* Status do Estoque */}
                        <td className="py-3.5 px-5 text-center">
                          <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider
                            ${isCritico ? 'bg-rose-50 text-rose-700 border border-rose-100' : 'bg-emerald-50 text-emerald-700'}
                          `}>
                            {isCritico ? 'Repor Estoque' : 'Disponível'}
                          </span>
                        </td>

                        {/* 🛠️ AÇÕES DO PRODUTO */}
                        <td className="py-3.5 px-5 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            
                            {/* Editar */}
                            <button 
                              onClick={() => router.push(`/produtos/editar?id=${produto.id}`)}
                              title="Editar Produto"
                              className="p-1.5 bg-slate-50 text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            {/* Excluir */}
                            <button 
                              onClick={() => handleDeletarProduto(produto.id)}
                              title="Remover Produto"
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
                    <td colSpan={7} className="py-12 text-center text-slate-400 text-xs font-semibold">
                      Nenhum produto encontrado para este filtro.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Rodapé */}
          <div className="bg-slate-50/60 border-t border-slate-200 px-5 py-3 flex items-center justify-between text-[11px] text-slate-400 font-semibold">
            <span>Mostrando {produtosFiltrados.length} SKUs no catálogo comercial</span>
            <span className="text-slate-400 uppercase tracking-widest text-[9px]">GTS Inventory Control</span>
          </div>
        </div>

      </main>
    </div>
  );
}