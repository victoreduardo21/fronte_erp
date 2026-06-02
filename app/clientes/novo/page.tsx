"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import { 
  Loader2, 
  ArrowLeft, 
  Save, 
  User, 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  FileText,
  RefreshCw
} from "lucide-react";

export default function NovoClientePage() {
  const router = useRouter();
  const [carregando, setCarregando] = useState<boolean>(true);
  const [consultandoDocumento, setConsultandoDocumento] = useState<boolean>(false); // 🔄 Loading unificado para CPF/CNPJ

  // Estados do tipo de pessoa
  const [tipoPessoa, setTipoPessoa] = useState<string>("PJ"); // PJ ou PF

  // Estados dos campos de identificação
  const [nome, setNome] = useState<string>("Victor Backend Developer");
  const [documento, setDocumento] = useState<string>(""); // CPF ou CNPJ
  const [inscricaoEstadual, setInscricaoEstadual] = useState<string>(""); 
  const [email, setEmail] = useState<string>("");
  const [telefone, setTelefone] = useState<string>("");

  // Estados do endereço do cliente
  const [cep, setCep] = useState<string>("");
  const [logradouro, setLogradouro] = useState<string>("");
  const [numero, setNumero] = useState<string>("");
  const [bairro, setBairro] = useState<string>("");
  const [cidade, setCidade] = useState<string>("");
  const [estado, setEstado] = useState<string>("");
  const [observacao, setObservacao] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("@erp:token");
    if (!token) {
      router.replace("/");
    } else {
      setCarregando(false);
    }
  }, [router]);

  function handleTrocaTipoPessoa(tipo: string) {
    setTipoPessoa(tipo);
    setDocumento("");
    setInscricaoEstadual("");
    setNome("");
  }

  // 🔌 FUNÇÃO DE INTEGRAÇÃO UNIFICADA (Para você plugar sua API Node.js depois)
  async function handleConsultarDocumento() {
    if (!documento) {
      alert(`Por favor, digite um ${tipoPessoa === "PJ" ? "CNPJ" : "CPF"} primeiro para consultar.`);
      return;
    }

    const docLimpo = documento.replace(/[^\d]/g, "");
    setConsultandoDocumento(true);
    
    try {
      alert(`Consultando ${tipoPessoa === "PJ" ? "CNPJ" : "CPF"}: ${documento} na sua API do Backend...`);
      
      // Aqui você fará uma chamada dinâmica baseada no tipo, ex:
      // const response = await api.get(`/consultar/${tipoPessoa.toLowerCase()}/${docLimpo}`);
      
      // Simulando o retorno de sucesso do seu Banco/Serviço externo:
      setTimeout(() => {
        if (tipoPessoa === "PJ") {
          setNome("EMPRESA EXEMPLO CONSULTADA NA RECEITA LTDA");
          setCep("01001-000");
          setLogradouro("Praça da Sé");
          setNumero("100");
          setBairro("Sé");
          setCidade("São Paulo");
          setEstado("SP");
        } else {
          // Retorno simulado de consulta de CPF (Bureau de Crédito/KYC)
          setNome("CARLOS HENRIQUE DA SILVA SAUDADO");
          setObservacao("Dados do CPF validados via API cadastral de mercado.");
          // Limpa ou preenche endereço se a API de CPF de mercado também fornecer dados de residência
        }
        setConsultandoDocumento(false);
        alert(`Dados do ${tipoPessoa === "PJ" ? "CNPJ" : "CPF"} importados com sucesso!`);
      }, 1500);

    } catch (error) {
      console.error(`Erro ao consultar ${tipoPessoa}:`, error);
      alert(`Erro ao buscar ${tipoPessoa}. Verifique o número ou insira os dados manualmente.`);
      setConsultandoDocumento(false);
    }
  }

  function handleSalvarCliente(e: React.FormEvent) {
    e.preventDefault();

    if (!nome || !documento || !email || !cidade || !estado) {
      alert("Por favor, preencha todos os campos obrigatórios (*).");
      return;
    }

    const novoCliente = {
      tipo: tipoPessoa, 
      nome,
      documento,
      inscricaoEstadual: tipoPessoa === "PJ" ? inscricaoEstadual : null,
      email,
      telefone,
      endereco: { cep, logradouro, numero, bairro, city: cidade, estado },
      observacao
    };

    console.log("Enviando payload completo de cliente:", novoCliente);
    alert("Cliente cadastrado com sucesso!");
    router.push("/clientes");
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
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Novo Cliente</h1>
            <p className="text-xs text-slate-500 mt-0.5">Insira os dados cadastrais com consulta automatizada para CPF e CNPJ.</p>
          </div>
        </div>

        {/* Formulário Principal */}
        <form onSubmit={handleSalvarCliente} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          
          {/* Seletor Tipo de Pessoa */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div 
              onClick={() => handleTrocaTipoPessoa("PJ")}
              className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                tipoPessoa === "PJ" ? "bg-indigo-50 border-indigo-400 shadow-sm" : "bg-slate-50 border-slate-200 opacity-60 hover:opacity-90"
              }`}
            >
              <div className={`p-2 rounded-lg ${tipoPessoa === "PJ" ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-600"}`}>
                <Building2 className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-800">Pessoa Jurídica (Empresa)</p>
                <p className="text-[10px] text-slate-400 font-semibold">Usa CNPJ e possui Razão Social corporativa.</p>
              </div>
            </div>

            <div 
              onClick={() => handleTrocaTipoPessoa("PF")}
              className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                tipoPessoa === "PF" ? "bg-indigo-50 border-indigo-400 shadow-sm" : "bg-slate-50 border-slate-200 opacity-60 hover:opacity-90"
              }`}
            >
              <div className={`p-2 rounded-lg ${tipoPessoa === "PF" ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-600"}`}>
                <User className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-800">Pessoa Física (Individual)</p>
                <p className="text-[10px] text-slate-400 font-semibold">Usa CPF, para clientes individuais e autônomos.</p>
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Dados de Identificação */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
              <User className="w-4 h-4 text-slate-400" />
              Dados de Identificação
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* 🔍 CPF / CNPJ DINÂMICO COM O BOTÃO ADAPTATIVO DE CONSULTA AUTOMÁTICA */}
              <div className="flex flex-col gap-1.5 sm:col-span-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                  {tipoPessoa === "PJ" ? "CNPJ *" : "CPF *"}
                </label>
                <div className="flex gap-2">
                  <input 
                    type="text"
                    value={documento}
                    onChange={(e) => setDocumento(e.target.value)}
                    placeholder={tipoPessoa === "PJ" ? "00.000.000/0001-00" : "000.000.000-00"}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={handleConsultarDocumento}
                    disabled={consultandoDocumento}
                    className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 rounded-xl text-xs font-bold text-white transition-all cursor-pointer shadow-sm shrink-0"
                  >
                    {consultandoDocumento ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <RefreshCw className="w-3.5 h-3.5" />
                    )}
                    Puxar {tipoPessoa}
                  </button>
                </div>
              </div>

              {/* Inscrição Estadual (Apenas para PJ) */}
              {tipoPessoa === "PJ" && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Inscrição Estadual (I.E.)</label>
                  <input 
                    type="text"
                    value={inscricaoEstadual}
                    onChange={(e) => setInscricaoEstadual(e.target.value)}
                    placeholder="Isento ou Número da I.E."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              )}

              {/* Nome ou Razão Social */}
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                  {tipoPessoa === "PJ" ? "Razão Social / Nome da Empresa *" : "Nome Completo *"}
                </label>
                <input 
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder={tipoPessoa === "PJ" ? "Razão Social retornada da API..." : "Nome completo retornado da API..."}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              {/* E-mail */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">E-mail para Faturamento *</label>
                <div className="relative flex items-center">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="financeiro@cliente.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              {/* Telefone */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Telefone / WhatsApp</label>
                <div className="relative flex items-center">
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input 
                    type="text"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    placeholder="(00) 00000-0000"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Endereço */}
          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
              <MapPin className="w-4 h-4 text-slate-400" />
              Endereço de Entrega / Cobrança
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1.5 sm:col-span-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">CEP</label>
                <input 
                  type="text"
                  value={cep}
                  onChange={(e) => setCep(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Logradouro</label>
                <input 
                  type="text"
                  value={logradouro}
                  onChange={(e) => setLogradouro(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Número</label>
                <input 
                  type="text"
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Bairro</label>
                <input 
                  type="text"
                  value={bairro}
                  onChange={(e) => setBairro(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Cidade *</label>
                <input 
                  type="text"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-0.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">UF *</label>
                <input 
                  type="text"
                  maxLength={2}
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-500 transition-colors text-center uppercase"
                />
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-4">
                <div className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Notas Comerciais Internas</label>
                </div>
                <textarea 
                  value={observacao}
                  onChange={(e) => setObservacao(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                />
              </div>

            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Botões de Envio */}
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
              Salvar Cliente
            </button>
          </div>

        </form>

      </main>
    </div>
  );
}