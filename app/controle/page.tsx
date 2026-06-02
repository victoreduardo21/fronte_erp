'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import { 
  Loader2, 
  Save, 
  PackagePlus, 
  PackageMinus, 
  Search,
  Package,
  ArrowLeftRight
} from 'lucide-react';

interface Produto {
  id: string;
  sku: string;
  nome: string;
  estoqueAtual: number;
}

export default function ControleEstoquePage() {
  const router = useRouter();
  const [carregando, setCarregando] = useState<boolean>(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Estados do Formulário de Estoque
  const [tipoMovimentacao, setTipoMovimentacao] = useState<string>('entrada'); // entrada ou saida
  const [quantidade, setQuantidade] = useState<string>('');
  const [motivo, setMotivo] = useState<string>('');
  const [observacao, setObservacao] = useState<string>('');

  // Estados do Autocomplete de Produtos
  const [termoBusca, setTermoBusca] = useState<string>('');
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);
  const [mostrarSugestoes, setMostrarSugestoes] = useState<boolean>(false);

  // Mock de produtos cadastrados (simulando a tabela que criamos anteriormente)
  const produtosMock: Produto[] = [
    { id: '1', sku: 'PROD-001', nome: 'Caixa de Ferramentas Master', estoqueAtual: 45 },
    { id: '2', sku: 'PROD-002', nome: 'Óleo Lubrificante Industrial 1L', estoqueAtual: 8 },
    { id: '3', sku: 'PROD-003', nome: 'Fita Isolante Alta Fusão 10m', estoqueAtual: 120 },
  ];

  useEffect(() => {
    const token = localStorage.getItem('@erp:token');
    if (!token) {
      router.replace('/');
    } else {
      setCarregando(false);
    }
  }, [router]);

  // Fecha o dropdown se clicar fora
  useEffect(() => {
    function handleClickFora(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMostrarSugestoes(false);
      }
    }
    document.addEventListener('mousedown', handleClickFora);
    return () => document.removeEventListener('mousedown', handleClickFora);
  }, []);

  // Filtra os produtos conforme o usuário digita o nome ou SKU
  const sugestoesFiltradas = produtosMock.filter(p =>
    p.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
    p.sku.toLowerCase().includes(termoBusca.toLowerCase())
  );

  function handleSalvarMovimentacao(e: React.FormEvent) {
    e.preventDefault();

    if (!produtoSelecionado || !quantidade || !motivo) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const qtdNum = parseInt(quantidade);
    if (qtdNum <= 0) {
      alert('A quantidade deve ser maior que zero.');
      return;
    }

    // Trava para evitar estoque negativo real
    if (tipoMovimentacao === 'saida' && qtdNum > produtoSelecionado.estoqueAtual) {
      alert(`Saldo insuficiente! O produto possui apenas ${produtoSelecionado.estoqueAtual} unidades em estoque.`);
      return;
    }

    // Payload pronto para sua rota Node.js de estoque
    const payloadEstoque = {
      produtoId: produtoSelecionado.id,
      tipo: tipoMovimentacao, // entrada ou saida
      quantidade: qtdNum,
      motivo,
      observacao
    };

    console.log('Enviando para API de Estoque:', payloadEstoque);
    alert('Movimentação de estoque registrada com sucesso!');
    
    // Redireciona para o catálogo de produtos para auditar o novo saldo
    router.push('/produtos');
  }

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

      <main className="flex-1 p-4 md:p-6 max-w-2xl w-full mx-auto space-y-6">
        
        {/* Título */}
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Movimentar / Lançar Estoque</h1>
          <p className="text-xs text-slate-500 mt-0.5">Dê entradas de compras ou saídas por inventário e perdas na base de dados.</p>
        </div>

        {/* Card do Formulário */}
        <form onSubmit={handleSalvarMovimentacao} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          
          {/* Seletor de Tipo (Entrada / Saída) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div 
              onClick={() => setTipoMovimentacao('entrada')}
              className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                tipoMovimentacao === 'entrada' 
                  ? 'bg-emerald-50 border-emerald-400 shadow-sm' 
                  : 'bg-slate-50 border-slate-200 opacity-60 hover:opacity-90'
              }`}
            >
              <div className={`p-2 rounded-lg ${tipoMovimentacao === 'entrada' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                <PackagePlus className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-800">Entrada de Estoque</p>
                <p className="text-[10px] text-slate-400 font-semibold">Compras, devoluções, saldo inicial.</p>
              </div>
            </div>

            <div 
              onClick={() => setTipoMovimentacao('saida')}
              className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                tipoMovimentacao === 'saida' 
                  ? 'bg-rose-50 border-rose-400 shadow-sm' 
                  : 'bg-slate-50 border-slate-200 opacity-60 hover:opacity-90'
              }`}
            >
              <div className={`p-2 rounded-lg ${tipoMovimentacao === 'saida' ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                <PackageMinus className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-800">Saída de Estoque</p>
                <p className="text-[10px] text-slate-400 font-semibold">Ajustes, quebras, perdas, inventário.</p>
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Grid de Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* 🔍 AUTOCOMPLETE: BUSCAR PRODUTO EXISTENTE NO CATÁLOGO */}
            <div ref={dropdownRef} className="flex flex-col gap-1.5 relative sm:col-span-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Selecionar Produto *</label>
              <div className="relative flex items-center">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input 
                  type="text"
                  value={produtoSelecionado ? `${produtoSelecionado.sku} - ${produtoSelecionado.nome}` : termoBusca}
                  disabled={!!produtoSelecionado}
                  onFocus={() => setMostrarSugestoes(true)}
                  onChange={(e) => { setTermoBusca(e.target.value); setMostrarSugestoes(true); }}
                  placeholder="Digite o nome ou o código SKU do produto..."
                  className={`w-full border rounded-xl pl-9 pr-4 py-2 text-xs font-medium focus:outline-none focus:border-indigo-500 transition-all
                    ${produtoSelecionado 
                      ? 'bg-indigo-50/50 border-indigo-200 text-indigo-900 font-bold' 
                      : 'bg-slate-50 border-slate-200 text-slate-700'}`}
                />
                
                {produtoSelecionado && (
                  <button
                    type="button"
                    onClick={() => { setProdutoSelecionado(null); setTermoBusca(''); }}
                    className="absolute right-3 text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
                  >
                    ✕ Mudar Item
                  </button>
                )}
              </div>

              {/* Informação do Estoque Atual Dinâmico */}
              {produtoSelecionado && (
                <p className="text-[11px] text-indigo-600 font-semibold mt-1 flex items-center gap-1">
                  <Package className="w-3.5 h-3.5" />
                  Saldo atual disponível em estoque: <strong className="text-slate-800 font-bold">{produtoSelecionado.estoqueAtual} unidades</strong>
                </p>
              )}

              {/* Dropdown de Itens */}
              {mostrarSugestoes && !produtoSelecionado && (
                <div className="absolute top-[60px] w-full bg-white border border-slate-200 rounded-xl shadow-xl max-h-44 overflow-y-auto z-40 divide-y divide-slate-100">
                  {sugestoesFiltradas.length > 0 ? (
                    sugestoesFiltradas.map((prod) => (
                      <div
                        key={prod.id}
                        onClick={() => {
                          setProdutoSelecionado(prod);
                          setMostrarSugestoes(false);
                        }}
                        className="p-3 text-xs hover:bg-slate-50 cursor-pointer flex items-center justify-between group"
                      >
                        <span className="font-semibold text-slate-700 group-hover:text-indigo-600">{prod.nome}</span>
                        <span className="text-[10px] text-slate-400 font-mono">SKU: {prod.sku}</span>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-xs text-slate-400 text-center">Nenhum produto encontrado.</div>
                  )}
                </div>
              )}
            </div>

            {/* Quantidade da Movimentação */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Quantidade do Ajuste *</label>
              <input 
                type="number"
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
                placeholder="Ex: 10"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            {/* Motivo do Ajuste */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Motivo / Justificativa *</label>
              <select
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
              >
                <option value="">Selecione o motivo...</option>
                {tipoMovimentacao === 'entrada' ? (
                  <>
                    <option value="Ordem de Compra / Fornecedor">Ordem de Compra / Recebimento</option>
                    <option value="Devolução de Cliente">Devolução de Cliente</option>
                    <option value="Ajuste de Inventário (Sobras)">Ajuste de Inventário (Sobras)</option>
                  </>
                ) : (
                  <>
                    <option value="Ajuste de Inventário (Perda/Falta)">Ajuste de Inventário (Falta)</option>
                    <option value="Produto Danificado / Quebrado">Produto Danificado / Vencido</option>
                    <option value="Consumo Interno da Empresa">Consumo Interno da Empresa</option>
                  </>
                )}
              </select>
            </div>

            {/* Observações Extras */}
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Notas Internas Complementares</label>
              <textarea 
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                rows={3}
                placeholder="Insira dados complementares, como número do pedido de compra ou ID do conferente..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
              />
            </div>

          </div>

          <hr className="border-slate-100" />

          {/* Botões */}
          <div className="flex items-center justify-end gap-3">
            <button 
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-600 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold text-white shadow-md transition-colors cursor-pointer"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              Confirmar Movimentação
            </button>
          </div>

        </form>

      </main>
    </div>
  );
}