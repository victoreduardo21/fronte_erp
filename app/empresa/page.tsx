"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import { 
  Loader2, 
  Building2, 
  FileText, 
  MapPin, 
  Save, 
  Globe, 
  Phone 
} from "lucide-react";

export default function DadosEmpresaPage() {
  const router = useRouter();
  const [carregando, setCarregando] = useState<boolean>(true);

  // Estados dos Dados Gerais da Empresa
  const [razaoSocial, setRazaoSocial] = useState<string>("GTS Tecnologia e Sistemas Ltda");
  const [nomeFantasia, setNomeFantasia] = useState<string>("GTS Erp");
  const [cnpj, setCnpj] = useState<string>("22.333.444/0001-55");
  const [inscricaoEstadual, setInscricaoEstadual] = useState<string>("111.222.333.444");
  const [telefone, setTelefone] = useState<string>("(11) 4003-0000");
  const [website, setWebsite] = useState<string>("https://gts.com.br");

  // Estados do Endereço Corretista
  const [cep, setCep] = useState<string>("01001-000");
  const [logradouro, setLogradouro] = useState<string>("Praça da Sé");
  const [numero, setNumero] = useState<string>("100");
  const [bairro, setBairro] = useState<string>("Sé");
  const [cidade, setCidade] = useState<string>("São Paulo");
  const [estado, setEstado] = useState<string>("SP");

  useEffect(() => {
    const token = localStorage.getItem("@erp:token");
    if (!token) {
      router.replace("/");
    } else {
      setCarregando(false);
    }
  }, [router]);

  function handleSalvarEmpresa(e: React.FormEvent) {
    e.preventDefault();

    if (!razaoSocial || !cnpj || !cidade || !estado) {
      alert("Por favor, preencha os campos obrigatórios (Razão Social, CNPJ, Cidade e Estado).");
      return;
    }

    // Payload estruturado pronto para a sua API Node.js salvar no banco
    const payloadEmpresa = {
      razaoSocial,
      nomeFantasia,
      cnpj,
      inscricaoEstadual,
      telefone,
      website,
      endereco: {
        cep,
        logradouro,
        numero,
        bairro,
        cidade,
        estado
      }
    };

    console.log("Enviando dados da empresa para o backend:", payloadEmpresa);
    alert("Configurações da empresa salvas com sucesso!");
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

      <main className="flex-1 p-4 md:p-6 max-w-4xl w-full mx-auto space-y-6">
        
        {/* Título da Página */}
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Minha Empresa / Emitente</h1>
          <p className="text-xs text-slate-500 mt-0.5">Gerencie os dados fiscais e de localização da sua empresa para emissão de notas e relatórios.</p>
        </div>

        <form onSubmit={handleSalvarEmpresa} className="space-y-6">
          
          {/* BLOCO 1: DADOS FISCAIS */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4 text-slate-400" />
              Identificação da Empresa (Dados Fiscais)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Razão Social *</label>
                <input 
                  type="text"
                  value={razaoSocial}
                  onChange={(e) => setRazaoSocial(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Nome Fantasia</label>
                <input 
                  type="text"
                  value={nomeFantasia}
                  onChange={(e) => setNomeFantasia(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">CNPJ *</label>
                <input 
                  type="text"
                  value={cnpj}
                  onChange={(e) => setCnpj(e.target.value)}
                  placeholder="00.000.000/0001-00"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Inscrição Estadual (I.E.)</label>
                <input 
                  type="text"
                  value={inscricaoEstadual}
                  onChange={(e) => setInscricaoEstadual(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Telefone Comercial</label>
                <div className="relative flex items-center">
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input 
                    type="text"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Website / URL</label>
                <div className="relative flex items-center">
                  <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input 
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* BLOCO 2: ENDEREÇO SEDE */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400" />
              Endereço Comercial / Sede
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
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Logradouro (Rua/Av.)</label>
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-500 transition-colors uppercase text-center"
                />
              </div>
            </div>
          </div>

          {/* BOTÃO DE SALVAR INFERIOR */}
          <div className="flex items-center justify-end">
            <button 
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold text-white shadow-md shadow-indigo-600/10 transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Salvar Configurações da Empresa
            </button>
          </div>

        </form>
      </main>
    </div>
  );
}