'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar'; 
import { 
  Loader2, 
  ArrowLeft, 
  Save, 
  TrendingUp, 
  TrendingDown,
  FileText,
  Search,
  Building2,
  User
} from 'lucide-react';

// Interfaces para tipagem explícita
interface Entidade {
  id: string;
  nome: string;
  documento: string;
  tipo: string; // PJ ou PF
}

export default function LancamentoManualPage() {
  const router = useRouter();
  const [carregando, setCarregando] = useState<boolean>(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Estados dos campos do formulário
  const [tipo, setTipo] = useState<string>('entrada'); // entrada ou saida
  const [descricao, setDescricao] = useState<string>('');
  const [categoria, setCategoria] = useState<string>('');
  const [dataLancamento, setDataLancamento] = useState<string>('');
  const [valor, setValor] = useState<string>('');
  const [status, setStatus] = useState<string>('pendente'); 
  const [observacao, setObservacao] = useState<string>('');

  // 🗄️ Estados de Autocomplete para Clientes e Fornecedores
  const [termoBusca, setTermoBusca] = useState<string>('');
  const [entidadeSelecionada, setEntidadeSelecionada] = useState<Entidade | null>(null);
  const [mostrarSugestoes, setMostrarSugestoes] = useState<boolean>(false);

  // Mocks locais emulando as tabelas do banco de dados do seu ERP
  const clientesMock: Entidade[] = [
    { id: 'c1', nome: 'Distribuidora de Alimentos Alfa Ltda', documento: '12.345.678/0001-90', tipo: 'PJ' },
    { id: 'c2', nome: 'Carlos Henrique Silva', documento: '456.789.123-00', tipo: 'PF' },
    { id: 'c3', nome: 'Indústria e Comércio Beta S/A', documento: '98.765.432/0001-10', tipo: 'PJ' },
  ];

  const fornecedoresMock: Entidade[] = [
    { id: 'f1', nome: 'Atacadista de Alimentos Central S/A', documento: '45.123.890/0001-12', tipo: 'PJ' },
    { id: 'f2', nome: 'Distribuidora de Embalagens Plastix', documento: '02.456.789/0001-55', tipo: 'PJ' },
    { id: 'f3', nome: 'GTS Consultoria Contábil', documento: '33.444.555/0001-44', tipo: 'PJ' },
  ];

  useEffect(() => {
    const token = localStorage.getItem('@erp:token');
    if (!token) {
      router.replace('/');
    } else {
      const hoje = new Date().toISOString().split('T')[0];
      setDataLancamento(hoje);
      setCarregando(false);
    }
  }, [router]);

  // Fecha o dropdown de sugestões se o usuário clicar fora do componente
  useEffect(() => {
    function handleClickFora(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMostrarSugestoes(false);
      }
    }
    document.addEventListener('mousedown', handleClickFora);
    return () => document.removeEventListener('mousedown', handleClickFora);
  }, []);

  // Reseta a entidade selecionada caso o usuário mude de Entrada para Saída
  function handleTrocaTipo(novoTipo: string) {
    setTipo(novoTipo);
    setTermoBusca('');
    setEntidadeSelecionada(null);
    setStatus('pendente');
  }

  // Filtra as sugestões da tabela correta baseado no tipo de lançamento
  const baseParaFiltrar = tipo === 'entrada' ? clientesMock : fornecedoresMock;
  const sugestoesFiltradas = baseParaFiltrar.filter(entidade =>
    entidade.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
    entidade.documento.includes(termoBusca)
  );

  function handleSalvar(e: React.FormEvent) {
    e.preventDefault();

    if (!descricao || !valor || !dataLancamento || !categoria) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // 🔥 TRAVA DE SEGURANÇA: Obriga a usar um registro existente na base do banco
    if (!entidadeSelecionada) {
      alert(`Por favor, selecione um ${tipo === 'entrada' ? 'Cliente' : 'Fornecedor'} válido listado no sistema.`);
      return;
    }

    const novoLancamento = {
      tipo,
      descricao,
      entidadeId: entidadeSelecionada.id, // Envia o ID para manter o relacionamento no banco Node.js
      entidadeNome: entidadeSelecionada.nome,
      categoria,
      data: dataLancamento,
      valor: parseFloat(valor),
      status,
      observacao,
    };

    console.log('Payload enviado para a API Node.js:', novoLancamento);
    alert('Lançamento registrado com sucesso!');
    router.push('/fluxo');
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

      <main className="flex-1 p-4 md:p-6 max-w-3xl w-full mx-auto space-y-6">
        
        {/* Voltar e Título */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.back()}
            className="p-2 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all cursor-pointer shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Novo Lançamento Financeiro</h1>
            <p className="text-xs text-slate-500 mt-0.5">Insira transações vinculadas diretamente aos cadastros homologados da empresa.</p>
          </div>
        </div>

        {/* Formulário Principal */}
        <form onSubmit={handleSalvar} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          
          {/* Seletor Tipo (Entrada/Saída) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div 
              onClick={() => handleTrocaTipo('entrada')}
              className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                tipo === 'entrada' 
                  ? 'bg-emerald-50 border-emerald-400 shadow-sm' 
                  : 'bg-slate-50 border-slate-200 opacity-60 hover:opacity-90'
              }`}
            >
              <div className={`p-2 rounded-lg ${tipo === 'entrada' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                <TrendingUp className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-800">Receita (Entrada)</p>
                <p className="text-[10px] text-slate-400 font-semibold">Faturamento, contratos, aportes.</p>
              </div>
            </div>

            <div 
              onClick={() => handleTrocaTipo('saida')}
              className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                tipo === 'saida' 
                  ? 'bg-rose-50 border-rose-400 shadow-sm' 
                  : 'bg-slate-50 border-slate-200 opacity-60 hover:opacity-90'
              }`}
            >
              <div className={`p-2 rounded-lg ${tipo === 'saida' ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                <TrendingDown className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-800">Despesa (Saída)</p>
                <p className="text-[10px] text-slate-400 font-semibold">Custos fixos, ferramentas, suprimentos.</p>
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Dados Gerais */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Descrição */}
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Descrição do Lançamento *</label>
              <input 
                type="text"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Ex: Liquidação de Duplicata, Pagamento de Boleto de Insumos..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            {/* 🔍 CAMPO AUTOCOMPLETE INTELIGENTE: CLIENTE OU FORNECEDOR */}
            <div ref={dropdownRef} className="flex flex-col gap-1.5 relative">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                {tipo === 'entrada' ? 'Buscar Cliente *' : 'Buscar Fornecedor *'}
              </label>
              <div className="relative flex items-center">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input 
                  type="text"
                  value={entidadeSelecionada ? entidadeSelecionada.nome : termoBusca}
                  disabled={!!entidadeSelecionada}
                  onFocus={() => setMostrarSugestoes(true)}
                  onChange={(e) => { setTermoBusca(e.target.value); setMostrarSugestoes(true); }}
                  placeholder={tipo === 'entrada' ? "Digite o nome ou CNPJ do cliente..." : "Digite o nome ou CNPJ do fornecedor..."}
                  className={`w-full border rounded-xl pl-9 pr-4 py-2 text-xs font-medium focus:outline-none focus:border-indigo-500 transition-all
                    ${entidadeSelecionada 
                      ? 'bg-indigo-50/50 border-indigo-200 text-indigo-900 font-bold' 
                      : 'bg-slate-50 border-slate-200 text-slate-700'}`}
                />
                
                {/* Botão X para limpar a seleção anterior */}
                {entidadeSelecionada && (
                  <button
                    type="button"
                    onClick={() => { setEntidadeSelecionada(null); setTermoBusca(''); }}
                    className="absolute right-3 text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
                  >
                    ✕ Limpar
                  </button>
                )}
              </div>

              {/* Menu de Sugestões Dropdown */}
              {mostrarSugestoes && !entidadeSelecionada && (
                <div className="absolute top-[60px] w-full bg-white border border-slate-200 rounded-xl shadow-xl max-h-52 overflow-y-auto z-40 divide-y divide-slate-100 animate-in fade-in slide-in-from-top-1 duration-100">
                  {sugestoesFiltradas.length > 0 ? (
                    sugestoesFiltradas.map((entidade) => (
                      <div
                        key={entidade.id}
                        onClick={() => {
                          setEntidadeSelecionada(entidade);
                          setMostrarSugestoes(false);
                        }}
                        className="p-3 text-xs hover:bg-slate-50 cursor-pointer flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-2">
                          {entidade.tipo === 'PJ' ? <Building2 className="w-3.5 h-3.5 text-slate-400" /> : <User className="w-3.5 h-3.5 text-slate-400" />}
                          <span className="font-semibold text-slate-700 group-hover:text-slate-900">{entidade.nome}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">{entidade.documento}</span>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-xs text-slate-400 font-medium text-center">
                      Nenhum registro cadastrado com esse nome.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Categoria / Plano de Contas */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Categoria / Plano de Contas *</label>
              <select 
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
              >
                <option value="">Selecione uma categoria...</option>
                
                <optgroup label="🟢 RECEITAS OPERACIONAIS (ENTRADAS)">
                  <option value="Venda de Mercadorias / Produtos">Venda de Mercadorias / Produtos (Faturamento NF-e)</option>
                  <option value="Prestação de Serviços">Prestação de Serviços (Faturamento NFS-e)</option>
                  <option value="Receitas de Contratos / Recorrência">Receitas de Contratos / Recorrência</option>
                  <option value="Venda de Ativos / Imobilizado">Venda de Ativos / Equipamentos</option>
                </optgroup>

                <optgroup label="🔴 CUSTOS DAS MERCADORIAS & SERVIÇOS (CMV/CSV)">
                  <option value="Compra de Mercadoria para Revenda">Compra de Mercadoria para Revenda</option>
                  <option value="Matéria-prima e Insumos de Production">Matéria-prima e Insumos de Produção</option>
                  <option value="Fretes e Logística de Entrega">Fretes e Logística de Entrega (Fretamento)</option>
                  <option value="Comissões sobre Vendas">Comissões sobre Vendas</option>
                </optgroup>

                <optgroup label="🔴 DESPESAS COM PESSOAL / RECURSOS HUMANOS">
                  <option value="Salários e Folha de Pagamento">Salários e Folha de Pagamento (CLT)</option>
                  <option value="Retirada de Pró-labore">Retirada de Pró-labore (Sócios)</option>
                  <option value="Encargos Sociais e Trabalhistas">Encargos Trabalhistas (FGTS, INSS, Rescisões)</option>
                  <option value="Benefícios Coletivos">Benefícios (VR, VA, VT, Seguro de Vida)</option>
                </optgroup>

                <optgroup label="🔴 DESPESAS ADMINISTRATIVAS & OPERACIONAIS">
                  <option value="Aluguel, Condomínio e IPTU">Aluguel, Condomínio e IPTU</option>
                  <option value="Água, Energia, Gás e Internet">Água, Energia, Gás e Internet</option>
                  <option value="Manutenção de Ativos e Maquinário">Manutenção, Limpeza e Reparos de Maquinário</option>
                  <option value="Marketing, Eventos e Publicidade">Marketing, Eventos e Publicidade</option>
                  <option value="Sistemas, Assinaturas e Licenças">Sistemas, Assinaturas e Licenças de Software</option>
                </optgroup>

                <optgroup label="🟤 IMPOSTOS, TAXAS & DESPESAS FINANCEIRAS">
                  <option value="Impostos sobre Faturamento">Impostos sobre Faturamento (Simples Nacional, ICMS, ISS)</option>
                  <option value="Tarifas Bancárias e Taxas de Cartão">Tarifas Bancárias e Taxas de Cartão/Adquirente</option>
                  <option value="Juros, Multas e Empréstimos">Juros, Multas e Amortização de Empréstimos</option>
                  <option value="Despesas Diversas / Imprevistos">Despesas Diversas / Imprevistos</option>
                </optgroup>
              </select>
            </div>

            {/* Data do Vencimento */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Data de Vencimento *</label>
              <input 
                type="date"
                value={dataLancamento}
                onChange={(e) => setDataLancamento(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
              />
            </div>

            {/* Valor Financeiro */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Valor do Lançamento (R$) *</label>
              <div className="relative flex items-center">
                <span className="text-xs font-bold text-slate-400 absolute left-4 pointer-events-none">R$</span>
                <input 
                  type="number"
                  step="0.01"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  placeholder="0,00"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            {/* Situação Atual */}
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Situação Atual do Registro</label>
              <div className="flex gap-4 p-1 bg-slate-50 border border-slate-200 rounded-xl w-full sm:w-80">
                <button 
                  type="button"
                  onClick={() => setStatus('pendente')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${status === 'pendente' ? 'bg-white text-slate-800 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Em Aberto
                </button>
                <button 
                  type="button"
                  onClick={() => setStatus(tipo === 'entrada' ? 'recebido' : 'pago')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${status !== 'pendente' ? 'bg-white text-slate-800 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  {tipo === 'entrada' ? 'Já Recebido' : 'Já Pago'}
                </button>
              </div>
            </div>

            {/* Observações */}
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <div className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Observações do Lançamento</label>
              </div>
              <textarea 
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                rows={3}
                placeholder="Insira notas internas, chaves Pix, número do boleto ou dados complementares..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
              />
            </div>

          </div>

          <hr className="border-slate-100" />

          {/* Botões Inferiores */}
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
              Salvar Lançamento
            </button>
          </div>

        </form>

      </main>
    </div>
  );
}