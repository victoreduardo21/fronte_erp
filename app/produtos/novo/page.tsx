"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import { 
  Loader2, 
  ArrowLeft, 
  Save, 
  Package, 
  Barcode, 
  DollarSign, 
  Boxes 
} from "lucide-react";

export default function NovoProdutoPage() {
  const router = useRouter();
  const [carregando, setCarregando] = useState<boolean>(true);

  // Estados dos campos do formulário de produto
  const [nome, setNome] = useState<string>("");
  const [sku, setSku] = useState<string>("");
  const [barcode, setBarcode] = useState<string>(""); // Código de Barras (EAN) para automação
  const [categoria, setCategoria] = useState<string>("");
  const [precoCusto, setPrecoCusto] = useState<string>("");
  const [precoVenda, setPrecoVenda] = useState<string>("");
  const [estoqueInicial, setEstoqueInicial] = useState<string>("");
  const [estoqueMinimo, setEstoqueMinimo] = useState<string>("");
  const [observacao, setObservacao] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("@erp:token");
    if (!token) {
      router.replace("/");
    } else {
      // Sugere um padrão de SKU baseado no timestamp para ajudar o usuário
      const skuSugerido = `PROD-${Math.floor(1000 + Math.random() * 9000)}`;
      setSku(skuSugerido);
      setCarregando(false);
    }
  }, [router]);

  function handleSalvarProduto(e: React.FormEvent) {
    e.preventDefault();

    // Validação de campos obrigatórios do ERP comercial
    if (!nome || !sku || !categoria || !precoVenda || !estoqueInicial) {
      alert("Por favor, preencha todos os campos obrigatórios (*).");
      return;
    }

    // Payload estruturado pronto para a sua API Node.js/Express persistir no banco
    const novoProduto = {
      sku,
      nome,
      barcode,
      categoria,
      precoCusto: precoCusto ? parseFloat(precoCusto) : 0,
      precoVenda: parseFloat(precoVenda),
      estoque: parseInt(estoqueInicial),
      estoqueMinimo: estoqueMinimo ? parseInt(estoqueMinimo) : 0,
      observacao
    };

    console.log("Enviando novo produto para o backend:", novoProduto);
    alert("Produto cadastrado com sucesso no catálogo!");
    
    // Retorna para a listagem principal do catálogo
    router.push("/produtos");
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
      <Navbar onMenuClick={() => console.log("Menu")} />

      <main className="flex-1 p-4 md:p-6 max-w-3xl w-full mx-auto space-y-6">
        
        {/* Voltar e Título */}
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={() => router.back()}
            className="p-2 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all cursor-pointer shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Adicionar Novo Produto</h1>
            <p className="text-xs text-slate-500 mt-0.5">Cadastre as especificações de mercado, margens e estoque mínimo de segurança.</p>
          </div>
        </div>

        {/* Formulário Principal */}
        <form onSubmit={handleSalvarProduto} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          
          {/* Seção 1: Dados Básicos */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
              <Package className="w-4 h-4 text-slate-400" />
              Informações do Produto
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Nome do Produto */}
              <div className="flex flex-col gap-1.5 sm:col-span-3">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Nome Comercial / Descrição *</label>
                <input 
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Refletor LED 100W IP66, Parafuso Sextavado ZB..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              {/* Código SKU */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Código Identificador (SKU) *</label>
                <input 
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="Ex: PROD-1024"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-mono font-bold text-indigo-600 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              {/* Código de Barras (EAN) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Código de Barras (EAN/GTIN)</label>
                <div className="relative flex items-center">
                  <Barcode className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input 
                    type="text"
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    placeholder="7891234567890"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              {/* Categoria Comercial */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Categoria *</label>
                <select 
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
                >
                  <option value="">Selecione...</option>
                  <option value="Ferragens">Ferragens / Ferramentas</option>
                  <option value="Químicos">Químicos / Lubrificantes</option>
                  <option value="Elétrica">Elétrica / Iluminação</option>
                  <option value="EPI">Equipamentos de Proteção (EPI)</option>
                  <option value="Hidráulica">Hidráulica / Conexões</option>
                  <option value="Outros">Outros / Diversos</option>
                </select>
              </div>

            </div>
          </div>

          {/* Seção 2: Precificação */}
          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
              <DollarSign className="w-4 h-4 text-slate-400" />
              Precificação e Custos
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Preço de Custo */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Preço de Custo (R$)</label>
                <div className="relative flex items-center">
                  <span className="text-xs font-bold text-slate-400 absolute left-4 pointer-events-none">R$</span>
                  <input 
                    type="number"
                    step="0.01"
                    value={precoCusto}
                    onChange={(e) => setPrecoCusto(e.target.value)}
                    placeholder="0,00"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              {/* Preço de Venda */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Preço de Venda / Balcão *</label>
                <div className="relative flex items-center">
                  <span className="text-xs font-bold text-slate-400 absolute left-4 pointer-events-none">R$</span>
                  <input 
                    type="number"
                    step="0.01"
                    value={precoVenda}
                    onChange={(e) => setPrecoVenda(e.target.value)}
                    placeholder="0,00"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Seção 3: Controle Volumétrico */}
          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
              <Boxes className="w-4 h-4 text-slate-400" />
              Estoque Inicial de Segurança
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Quantidade Inicial */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Quantidade em Estoque Inicial *</label>
                <input 
                  type="number"
                  value={estoqueInicial}
                  onChange={(e) => setEstoqueInicial(e.target.value)}
                  placeholder="Ex: 50"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              {/* Estoque Mínimo */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Estoque Mínimo (Alerta de Giro)</label>
                <input 
                  type="number"
                  value={estoqueMinimo}
                  onChange={(e) => setEstoqueMinimo(e.target.value)}
                  placeholder="Ex: 10"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              {/* Notas Extras / Aplicação */}
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Observações Técnicas / Aplicação</label>
                <textarea 
                  value={observacao}
                  onChange={(e) => setObservacao(e.target.value)}
                  rows={3}
                  placeholder="Insira detalhes adicionais do produto, peso, localização na prateleira física ou especificações de fábrica..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                />
              </div>

            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Botões Finais de Envio */}
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
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold text-white shadow-md shadow-indigo-600/10 transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              Salvar Produto
            </button>
          </div>

        </form>

      </main>
    </div>
  );
}