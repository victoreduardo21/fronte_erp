"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import { 
  Loader2, 
  BarChart3, 
  PieChart, 
  FileSpreadsheet,
  Printer,
  Layers,
  RefreshCw
} from "lucide-react";

// Interfaces para tipagem dos dados da API
interface DadoBarra {
  periodo: string;
  hIn: string; // Ex: "h-[70%]" ou string dinâmica de percentagem
  hOut: string; // Ex: "h-[40%]"
  valorIn: string;
  valorOut: string;
}

interface DadoPizza {
  nome: string;
  valor: string;
  porcentagem: number;
  cor: string;
}

export default function RelatoriosAvancadosPage() {
  const router = useRouter();
  const [carregando, setCarregando] = useState<boolean>(true);
  const [buscandoDados, setBuscandoDados] = useState<boolean>(false);
  
  // Estados de Filtros Operacionais
  const [periodo, setPeriodo] = useState<string>("mes"); // mes, trimestre, ano
  const [tipoRelatorio, setTipoRelatorio] = useState<string>("dfc"); // dfc, dre, estoque

  // Estados dos Gráficos e Tabelas alimentados pelo Banco de Dados
  const [dadosBarras, setDadosBarras] = useState<DadoBarra[]>([]);
  const [dadosPizza, setDadosPizza] = useState<DadoPizza[]>([]);

  // 1. Verificação de Autenticação de Sessão
  useEffect(() => {
    const token = localStorage.getItem("@erp:token");
    if (!token) {
      router.replace("/");
    } else {
      setCarregando(false);
    }
  }, [router]);

  // 2. 🔥 Conexão Dinâmica e Procura de Datas no Banco de Dados via API
  useEffect(() => {
    const token = localStorage.getItem("@erp:token");
    if (!token) return;

    async function carregarDadosBI() {
      try {
        setBuscandoDados(true);
        
        // Chamada à API Node.js passando o período selecionado na rota
        const resposta = await fetch(`http://localhost:4000/api/v1/relatorios?periodo=${periodo}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (resposta.ok) {
          const dadosDoBanco = await resposta.json();
          
          // Quando a API estiver pronta, o estado é atualizado dinamicamente aqui
          setDadosBarras(dadosDoBanco.graficoBarras);
          setDadosPizza(dadosDoBanco.graficoPizza);
        } else {
          // Fallback seguro: Alimenta dados modelo caso a API ainda não esteja online
          injetarDadosMock();
        }
      } catch (erro) {
        console.warn("API Offline. Injetando dados modelo para desenvolvimento.");
        injetarDadosMock();
      } finally {
        setBuscandoDados(false);
      }
    }

    carregarDadosBI();
  }, [periodo]);

  // Função auxiliar para não quebrar o visual no Front enquanto desenvolves o Back
  function injetarDadosMock() {
    setDadosBarras([
      { periodo: "Sem 1", hIn: "h-[70%]", hOut: "h-[40%]", valorIn: "15k", valorOut: "8k" },
      { periodo: "Sem 2", hIn: "h-[90%]", hOut: "h-[60%]", valorIn: "20k", valorOut: "12k" },
      { periodo: "Sem 3", hIn: "h-[60%]", hOut: "h-[75%]", valorIn: "13k", valorOut: "16k" },
      { periodo: "Sem 4", hIn: "h-[100%]", hOut: "h-[50%]", valorIn: "22k", valorOut: "11k" },
    ]);

    setDadosPizza([
      { nome: "Venda de Mercadorias", valor: "R$ 32.000,00", porcentagem: 58, cor: "bg-indigo-600" },
      { nome: "Prestação de Serviços", valor: "R$ 13.200,00", porcentagem: 27, cor: "bg-emerald-500" },
      { nome: "Contratos / SaaS", valor: "R$ 5.500,00", porcentagem: 15, cor: "bg-amber-500" },
    ]);
  }

  function handleExportar(formato: "pdf" | "excel") {
    alert(`A exportar dados filtrados por [${periodo.toUpperCase()}] no formato ${formato.toUpperCase()}...`);
  }

  if (carregando) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  // Gera o estilo do gradiente cónico dinamicamente com base nos valores da Pizza
  const slice1 = dadosPizza[0]?.porcentagem || 0;
  const slice2 = slice1 + (dadosPizza[1]?.porcentagem || 0);
  const estiloConicGradient = {
    background: `conic-gradient(#4f46e5 0% ${slice1}%, #10b981 ${slice1}% ${slice2}%, #f59e0b ${slice2}% 100%)`
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-700 flex flex-col antialiased">
      <Navbar onMenuClick={() => console.log("Menu")} />

      <main className="flex-1 p-4 md:p-6 max-w-7xl w-full mx-auto space-y-6">
        
        {/* Cabeçalho de Controle Analítico */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-4">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Relatórios Avançados</h1>
              <p className="text-xs text-slate-500 mt-0.5">Métricas estatísticas ligadas ao banco de dados com sincronização em tempo real.</p>
            </div>
            {buscandoDados && <RefreshCw className="w-4 h-4 text-indigo-600 animate-spin mt-1" />}
          </div>

          {/* Filtro Dinâmico Temporal - Dispara o useEffect da API */}
          <div className="flex items-center gap-2 bg-white p-1 border border-slate-200 rounded-xl shadow-sm self-start sm:self-center">
            {[
              { id: "mes", label: "Mês Atual" },
              { id: "trimestre", label: "Últimos 90 dias" },
              { id: "ano", label: "Ano Corrente" }
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPeriodo(p.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer
                  ${periodo === p.id 
                    ? "bg-indigo-600 text-white shadow-sm" 
                    : "text-slate-500 hover:text-slate-800"}`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* 📊 PAINEL DE GRÁFICOS DINÂMICOS */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          
          {/* 1. GRÁFICO DE BARRAS COMPARATIVAS (ENTRADAS VS SAÍDAS) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm lg:col-span-3 flex flex-col justify-between group/graph">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
              <div>
                <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-slate-400" />
                  Fluxo de Caixa Periódico
                </h4>
                <p className="text-slate-400 text-xs mt-0.5">Análise de recebimentos contra liquidações de faturas.</p>
              </div>
              
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/60 px-3 py-1.5 rounded-xl text-[11px] font-bold">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                    <span className="text-slate-600">Entradas</span>
                  </div>
                  <div className="w-[1px] h-3 bg-slate-200" />
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                    <span className="text-slate-600">Saídas</span>
                  </div>
              </div>
            </div>

            <div className="w-full pt-4">
              <div className="h-48 flex items-end justify-between px-2 border-b border-slate-100 gap-4 relative bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px]">
                
                {dadosBarras.map((dado, idx) => (
                  <div key={idx} className="flex flex-col items-center flex-1 group relative pb-3 cursor-default">
                    
                    {/* Tooltip Dinâmico */}
                    <div className="absolute -top-12 bg-slate-900 text-white text-[10px] p-2 rounded-xl shadow-xl transition-all duration-200 z-10 pointer-events-none flex flex-col gap-0.5 text-left min-w-[95px] opacity-0 scale-95 translate-y-1 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0">
                      <span className="text-indigo-300 font-bold flex items-center justify-between">Entradas: <span>{dado.valorIn}</span></span>
                      <span className="text-rose-300 font-bold flex items-center justify-between">Saídas: <span>{dado.valorOut}</span></span>
                    </div>

                    <div className="w-full flex items-end justify-center gap-2 h-36 relative">
                      {/* Entradas */}
                      <div className="flex flex-col items-center justify-end h-full w-3.5 relative">
                        <div className={`${dado.hIn} w-full rounded-t-md transition-all duration-300 ease-out bg-indigo-600/40 group-hover:bg-indigo-600 group-hover:shadow-[0_4px_14px_rgba(79,70,229,0.2)]`} />
                      </div>
                      
                      {/* Saídas */}
                      <div className="flex flex-col items-center justify-end h-full w-3.5 relative">
                        <div className={`${dado.hOut} w-full rounded-t-md transition-all duration-300 ease-out bg-rose-600/40 group-hover:bg-rose-500 group-hover:shadow-[0_4px_14px_rgba(244,63,94,0.2)]`} />
                      </div>
                    </div>

                    <div className="pt-2">
                      <span className="text-xs font-bold text-slate-400 group-hover:text-indigo-600 transition-colors">
                        {dado.periodo}
                      </span>
                    </div>
                  </div>
                ))}

              </div>
            </div>
          </div>

          {/* 2. GRÁFICO DE PIZZA (MIX DE FATURAMENTO) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm lg:col-span-2 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <PieChart className="w-4 h-4 text-emerald-500" />
                Mix de Faturamento
              </h4>
              <p className="text-slate-900 font-bold text-sm mt-1">Percentagem de Canais de Receita</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-around gap-6 mt-4 py-2">
              {/* Gráfico Donut/Pizza Computado por CSS Conic-Gradient */}
              <div 
                className="w-32 h-32 rounded-full shadow-md border-4 border-white transition-transform hover:scale-105 duration-300 relative shrink-0"
                style={estiloConicGradient}
              >
                <div className="absolute inset-7 bg-white rounded-full flex items-center justify-center shadow-inner">
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">GTS BI</span>
                </div>
              </div>

              {/* Legenda de Categorias mapeadas */}
              <div className="space-y-2.5 flex-1 w-full max-w-[200px]">
                {dadosPizza.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs font-semibold group cursor-default">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${item.cor} shrink-0`} />
                      <span className="text-slate-600 group-hover:text-slate-900 transition-colors">{item.nome}</span>
                    </div>
                    <div className="text-right pl-2">
                      <span className="text-slate-800 font-bold block">{item.valor}</span>
                      <span className="text-[10px] text-slate-400 font-bold block">{item.porcentagem}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-[10px] font-bold text-slate-400 border-t border-slate-50 pt-3 mt-4">
              Métricas recalculadas automaticamente com base nos filtros temporais.
            </div>
          </div>

        </div>

        {/* COMPONENTES DE FILTRO DE DEMONSTRATIVOS E PREVIEW TABULAR */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-1.5">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-2">Selecione o Demonstrativo</p>
            {[
              { id: "dfc", label: "Fluxo de Caixa Estruturado (DFC)", desc: "Entradas e saídas agrupadas por categoria real de mercado." },
              { id: "dre", label: "Demonstrativo de Resultado (DRE)", desc: "Apuração de lucro real líquido descontando impostos e CMV." },
              { id: "estoque", label: "Inventário & Curva ABC", desc: "Listagem de SKUs com maior giro e valuation de estoque físico." }
            ].map((rel) => (
              <div
                key={rel.id}
                onClick={() => setTipoRelatorio(rel.id)}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                  tipoRelatorio === rel.id
                    ? "bg-indigo-50/70 border-indigo-300 shadow-inner"
                    : "bg-white border-transparent hover:bg-slate-50"
                }`}
              >
                <p className={`text-xs font-bold ${tipoRelatorio === rel.id ? "text-indigo-900" : "text-slate-700"}`}>{rel.label}</p>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5 leading-relaxed">{rel.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm lg:col-span-2 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                  Pré-visualização dos Dados Digitais
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Visão tabular estruturada para auditoria interna.</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleExportar("excel")}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  Excel
                </button>
                <button
                  type="button"
                  onClick={() => handleExportar("pdf")}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white hover:bg-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5" />
                  PDF
                </button>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 font-mono text-[11px] leading-relaxed text-slate-500 overflow-x-auto min-h-36">
              {tipoRelatorio === "dfc" && (
                <div className="space-y-1">
                  <p className="text-indigo-600 font-bold">📂 [+] RECEITAS OPERACIONAIS ATIVAS</p>
                  {dadosPizza.map((pz, i) => (
                    <p key={i} className="pl-4">├── {pz.nome}: {pz.valor} ({pz.porcentagem}%)</p>
                  ))}
                  <div className="border-t border-slate-200 my-2 pt-2 text-slate-800 font-bold">
                    💰 DADOS DE CORRELAÇÃO ADAPTADOS AO PERÍODO [{periodo.toUpperCase()}]
                  </div>
                </div>
              )}
              {tipoRelatorio === "dre" && (
                <div className="space-y-1">
                  <p>Faturamento Bruto Auditado: R$ 50.700,00</p>
                  <p className="text-rose-500">(-) Retenções e Impostos Fiscais: R$ 3.042,00</p>
                  <div className="border-t border-slate-200 my-2 pt-2 text-slate-800 font-bold">
                    📈 RESULTADO LÍQUIDO EXIBIDO NO GRÁFICO DE BARRAS COMPARATIVAS
                  </div>
                </div>
              )}
              {tipoRelatorio === "estoque" && (
                <div className="space-y-1">
                  <p>Inventário Ativo Monitorado via Core API</p>
                  <p className="text-amber-600 font-bold mt-2">⚠️ ALERTAS DE RUPTURA:</p>
                  <p className="pl-4 text-rose-600">- SKU-002 (Lubrificante Avançado) ── Stock: 8 unidades.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}