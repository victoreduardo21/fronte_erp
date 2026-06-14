/**
 * ==============================================================================
 * GTS ERP - CONTRATO DE INTERFACE DO DASHBOARD (PRODUÇÃO REAL)
 * ==============================================================================
 */

// 1. Contrato individual de cada barra do gráfico (Entradas vs Saídas)
export interface IDadoGraficoDashboard {
  idx: number;       // De 0 (Jan) a 11 (Dez)
  mes: string;       // Ex: "Jan", "Fev", "Jun"
  hIn: string;       // Altura em % para o CSS inline do Front (Ex: "75%")
  hOut: string;      // Altura em % para o CSS inline do Front (Ex: "40%")
  valorIn: string;   // Texto com o valor real das Entradas (Ex: "34k" ou "34.000")
  valorOut: string;  // Texto com o valor real das Saídas (Ex: "30k" ou "30.000")
}

// 2. Contrato dos cards superiores de métricas (KPIs)
export interface IKpiDashboard {
  titulo: string;    // Ex: "Faturamento Mensal"
  valor: string;     // Ex: "R$ 45.200,00"
  status: string;    // Porcentagem de oscilação (Ex: "+12%" ou "-2%")
  sub: string;       // Texto auxiliar descritivo (Ex: "vs mês passado")
  icone: string;     // Identificador do ícone (Ex: "DollarSign", "Wallet")
  cor: string;       // Classe de cor do Tailwind para o texto (Ex: "text-emerald-600")
  bg: string;        // Classe de cor do Tailwind para o fundo (Ex: "bg-emerald-50")
}

// 3. Contrato do feed de auditoria de eventos recentes do sistema
export interface IAtividadeLogDashboard {
  id: string;        // UUID ou ID autoincremento do banco
  titulo: string;    // Ex: "Novo cliente cadastrado"
  modulo: string;    // Ex: "Módulo de Entidades"
  tipo: 'entrada' | 'saida'; // Determina a cor do ícone no feed
  tempo: string;     // String amigável de tempo (Ex: "5m atrás", "1h atrás")
}

// 🚀 O CONTRATO MESTRE DA RESPOSTA (O formato exato do JSON que a API Express vai cuspir)
export interface IDashboardResponse {
  kpis: IKpiDashboard[];
  dadosGrafico: IDadoGraficoDashboard[];
  atividades: IAtividadeLogDashboard[];
}


/**
 * ==============================================================================
 * GTS ERP - CONTRATO DE INTERFACE DO FLUXO DE CAIXA / EXTRATO (PRODUÇÃO REAL)
 * ==============================================================================
 */

// 1. Definições estritas de tipos do Plano de Contas
export type TransacaoTipo = 'entrada' | 'saida';
export type TransacaoStatus = 'pago' | 'recebido' | 'pendente';

// 2. Contrato de cada linha individual da tabela de extrato
export interface ITransacaoExtrato {
  id: string;          // UUID ou ID auto-incremento do banco
  descricao: string;   // Ex: "Mensalidade SaaS - Cliente Alfa"
  tipo: TransacaoTipo;
  categoria: string;   // Ex: "Serviços", "Infraestrutura", "Custos Fixos"
  valor: number;       // Float real (Ex: 1500.00)
  data: string;        // String formatada do dia do vencimento/pagamento (Ex: "31/05/2026")
  status: TransacaoStatus;
}

// 3. Contrato do bloco superior de totalizadores do período filtrado
export interface IPainelSaldosFluxo {
  entradas: string;    // String monetária formatada pelo back (Ex: "R$ 18.200,00")
  saidas: string;     // String monetária formatada pelo back (Ex: "R$ 1.310,50")
  liquido: string;    // String monetária formatada pelo back (Ex: "R$ 16.889,50")
}

// 🚀 O CONTRATO MESTRE DA RESPOSTA (O JSON que a sua API Node.js/Express vai cuspir)
export interface IFluxoCaixaResponse {
  saldos: IPainelSaldosFluxo;
  transacoes: ITransacaoExtrato[];
}


/**
 * ==============================================================================
 * GTS ERP - CONTRATO DE INTERFACE DE CONTAS A PAGAR (PRODUÇÃO REAL)
 * ==============================================================================
 */

export type StatusContaPagar = 'pago' | 'pendente' | 'vencido';

// Contrato de cada despesa individual que preenche as linhas da tabela
export interface IContaPagarItem {
  id: string;          // UUID do banco
  fornecedor: string;  // Nome do Fornecedor vinculado (PF ou PJ)
  categoria: string;   // Categoria do plano de contas (Ex: "Infraestrutura")
  vencimento: string;  // Data formatada para exibição (Ex: "10/06/2026")
  valor: number;       // Valor float numérico puro (Ex: 450.00)
  status: StatusContaPagar;
}

// 🚀 O CONTRATO MESTRE DA RESPOSTA (O formato exato do JSON que a API Express vai retornar)
export interface IContasAPagarResponse {
  contas: IContaPagarItem[];
}

/**
 * ==============================================================================
 * GTS ERP - CONTRATO DE INTERFACE DE CONTAS A RECEBER (PRODUÇÃO REAL)
 * ==============================================================================
 */

export type StatusFaturaReceber = 'recebido' | 'pendente' | 'vencido';

// Contrato de cada direito de crédito individual que preenche as linhas da tabela
export interface IFaturaReceberItem {
  id: string;          // UUID do banco
  cliente: string;     // Nome do Cliente vinculado (PF ou PJ)
  categoria: string;   // Categoria do plano de contas (Ex: "Serviços", "Contratos")
  vencimento: string;  // Data formatada para exibição (Ex: "15/06/2026")
  valor: number;       // Valor float numérico puro (Ex: 4200.00)
  status: StatusFaturaReceber;
}

// 🚀 O CONTRATO MESTRE DA RESPOSTA (O formato exato do JSON que a API Express vai retornar)
export interface IContasAReceberResponse {
  faturas: IFaturaReceberItem[];
}

/**
 * ==============================================================================
 * GTS ERP - CONTRATO DE INTERFACE DE CADASTRO DE CLIENTES (PRODUÇÃO REAL)
 * ==============================================================================
 */

export type ClienteTipo = 'PF' | 'PJ';
export type ClienteStatus = 'ativo' | 'inativo';

// Contrato individual do objeto de cada cliente retornado pelo banco
export interface IClienteItem {
  id: string;          // UUID do banco de dados
  nome: string;        // Nome completo ou Razão Social
  documento: string;   // CPF ou CNPJ formatado
  email: string;       // E-mail principal de contato
  telefone: string;    // Telefone comercial/pessoal formatado
  tipo: ClienteTipo;   // 'PF' ou 'PJ'
  status: ClienteStatus;
}

// 🚀 O CONTRATO MESTRE DA RESPOSTA (O formato exato do JSON que a API Express vai cuspir)
export interface IClientesResponse {
  clientes: IClienteItem[];
}

/**
 * ==============================================================================
 * GTS ERP - CONTRATO DE INTERFACE DE CRIAÇÃO E CONSULTA DE CLIENTE (PRODUÇÃO)
 * ==============================================================================
 */

export type PessoaTipo = 'PF' | 'PJ';

// 1. Contrato da estrutura interna do endereço
export interface IEnderecoCliente {
  cep: string;
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string; // UF com 2 caracteres
}

// 2. 🔥 CONTRATO DO PAYLOAD DE CRIAÇÃO (Body que o POST /api/v1/clientes deve receber)
export interface INovoClientePayload {
  tipo: PessoaTipo;
  nome: string;              // Razão Social (PJ) ou Nome Completo (PF)
  documento: string;         // Apenas números limpos (CPF ou CNPJ)
  inscricaoEstadual: string | null; // Nulo se for PF
  email: string;
  telefone: string;
  endereco: IEnderecoCliente;
  observacao?: string;
}

// 3. 🔥 CONTRATO DE RESPOSTA DA CONSULTA AUTOMÁTICA (Retorno do GET /api/v1/clientes/consultar/:tipo/:documento)
export interface IConsultaDocumentoResponse {
  documento: string;
  nome: string;              // Nome retornado da Receita Federal ou Bureau
  endereco?: Partial<IEnderecoCliente>; // Dados de localização quando disponíveis
}

/**
 * ==============================================================================
 * GTS ERP - CONTRATO DE INTERFACE DE FORNECEDORES (PRODUÇÃO REAL)
 * ==============================================================================
 */

export type FornecedorStatus = 'ativo' | 'inativo';

// Contrato individual de cada credor/fornecedor que preenche a listagem
export interface IFornecedorItem {
  id: string;          // UUID gerado pelo banco
  nome: string;        // Razão Social corporativa
  documento: string;   // CNPJ formatado
  email: string;       // E-mail comercial
  telefone: string;    // Telefone fixo ou celular
  categoria: string;   // Segmento (Ex: "Mercadoria", "Insumos", "Serviços")
  status: FornecedorStatus;
}

// 🚀 O CONTRATO MESTRE DA RESPOSTA (O formato exato do JSON que o seu Express precisa cuspir)
export interface IFornecedoresResponse {
  fornecedores: IFornecedorItem[];
}


/**
 * ==============================================================================
 * GTS ERP - CONTRATO DE INTERFACE DE NOVO LANÇAMENTO (PRODUÇÃO REAL)
 * ==============================================================================
 */

export type MovimentacaoTipo = 'entrada' | 'saida';
export type MovimentacaoStatus = 'pago' | 'recebido' | 'pendente';
export type EntidadeTipo = 'PF' | 'PJ';

// 1. Contrato de resposta para o drop-down do Autocomplete (GET)
export interface IAutocompleteEntidade {
  id: string;          // ID da tabela de Clientes ou Fornecedores
  nome: string;        // Razão Social ou Nome Completo
  documento: string;   // CPF ou CNPJ formatado
  tipo: EntidadeTipo;
}

// 2. 🔥 CONTRATO DO PAYLOAD DE CRIAÇÃO (Body que o POST /api/v1/financeiro/lancamentos deve aceitar)
export interface INovoLancamentoPayload {
  tipo: MovimentacaoTipo;
  descricao: string;   // Detalhes da transação
  entidadeId: string;  // ID da entidade vinculada para chave estrangeira (Foreign Key)
  categoria: string;   // Item selecionado do Plano de Contas
  data: string;        // Data de vencimento em formato ISO (YYYY-MM-DD)
  valor: number;       // Float numérico puro para manipulação matemática
  status: MovimentacaoStatus;
  observacao?: string; // Texto complementar opcional
}