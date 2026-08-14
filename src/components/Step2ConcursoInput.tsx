import React, { useState } from 'react';
import { Search, Sparkles, Compass, Shield, Building2, Landmark, CheckCircle, HelpCircle, ArrowRight, BookOpen } from 'lucide-react';
import { UserProfile } from '../types';

interface Step2ConcursoInputProps {
  user: UserProfile;
  onSearchConcurso: (concursoQuery: string, cargoExtra?: string) => void;
  isLoading: boolean;
}

const CONCURSOS_POPULARES = [
  { name: 'PCDF Agente de Polícia', tag: 'Policial', icon: '🚓', banca: 'Cebraspe' },
  { name: 'Banco do Brasil Escriturário', tag: 'Bancário', icon: '🏦', banca: 'Cesgranrio' },
  { name: 'INSS Técnico do Seguro Social', tag: 'Administrativo', icon: '📋', banca: 'Cebraspe' },
  { name: 'TJ-SP Escrevente Técnico Judiciário', tag: 'Tribunais', icon: '⚖️', banca: 'Vunesp' },
  { name: 'Receita Federal Auditor Fiscal', tag: 'Fiscal', icon: '💼', banca: 'FGV' },
  { name: 'CNU Concurso Nacional Unificado', tag: 'Federal', icon: '🇧🇷', banca: 'Cesgranrio' },
  { name: 'Polícia Federal (PF) Agente', tag: 'Policial', icon: '🚔', banca: 'Cebraspe' },
  { name: 'Caixa Econômica Técnico Bancário', tag: 'Bancário', icon: '🏛️', banca: 'Cesgranrio' },
  { name: 'PRF Policial Rodoviário Federal', tag: 'Policial', icon: '🚨', banca: 'Cebraspe' },
  { name: 'TRT Técnico e Analista Judiciário', tag: 'Tribunais', icon: '🏛️', banca: 'FCC' },
];

export const Step2ConcursoInput: React.FC<Step2ConcursoInputProps> = ({
  user,
  onSearchConcurso,
  isLoading,
}) => {
  const [concursoInput, setConcursoInput] = useState('');
  const [cargoExtra, setCargoExtra] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!concursoInput.trim()) {
      setErrorMessage('Por favor, informe o nome do concurso ou cargo.');
      return;
    }
    setErrorMessage('');
    onSearchConcurso(concursoInput.trim(), cargoExtra.trim());
  };

  const handleSelectPopular = (name: string) => {
    setConcursoInput(name);
    setErrorMessage('');
    onSearchConcurso(name);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header Banner */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#12213B]/5 border border-slate-300 text-[#12213B] text-xs font-mono font-bold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#B8862E]" />
          <span>Etapa 2 de 4 • Seleção do Concurso / Órgão</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#12213B] tracking-tight">
          Qual concurso você deseja conquistar, <span className="text-[#B8412C]">{(user?.name || 'Candidato').split(' ')[0]}</span>?
        </h1>
        <p className="text-xs sm:text-sm text-[#4B5563] mt-2 max-w-2xl mx-auto leading-relaxed">
          Informe o órgão, cargo ou área. Nosso motor fará a busca oficial via Google Grounding para identificar banca organizadora, edital e matriz de disciplinas.
        </p>
      </div>

      {/* Main Search Card */}
      <div className="bg-[#FBFAF7] border border-slate-300 rounded-2xl shadow-sm p-6 sm:p-8 mb-8 relative overflow-hidden">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-bold text-[#12213B] uppercase tracking-wider mb-2">
              Nome do Concurso / Órgão / Cargo Alvo
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                id="input-concurso-search"
                type="text"
                value={concursoInput}
                onChange={(e) => {
                  setConcursoInput(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                disabled={isLoading}
                placeholder="Ex: PCDF Agente, Banco do Brasil Escriturário, INSS Técnico, TJ-SP..."
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-300 rounded-xl text-[#12213B] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#12213B] focus:border-transparent text-base font-semibold transition-all shadow-2xs"
              />
            </div>
            {errorMessage && (
              <p className="text-xs text-[#B8412C] mt-1.5 font-bold flex items-center gap-1 font-mono">
                <HelpCircle className="w-3.5 h-3.5" />
                {errorMessage}
              </p>
            )}
          </div>

          {/* Optional Cargo Detail */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-mono font-medium text-[#4B5563] mb-1">
                Especialidade ou Área Específica (Opcional)
              </label>
              <input
                type="text"
                value={cargoExtra}
                onChange={(e) => setCargoExtra(e.target.value)}
                disabled={isLoading}
                placeholder="Ex: Agente, Escrivão, TI, Área Administrativa..."
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-[#12213B] placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-[#12213B]"
              />
            </div>
            <div className="flex items-end">
              <button
                id="btn-buscar-edital"
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-[#B8412C] hover:bg-[#9E3624] disabled:bg-slate-300 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Localizando Edital no Grounding...</span>
                  </>
                ) : (
                  <>
                    <span>Localizar Edital com Grounding</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Popular Contests Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-mono font-bold text-[#12213B] uppercase tracking-wider flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#B8862E]" />
            Concursos em Destaque no Brasil
          </h2>
          <span className="text-xs text-[#4B5563] hidden sm:inline font-mono">Busca instantânea</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {CONCURSOS_POPULARES.map((item) => (
            <button
              key={item.name}
              onClick={() => handleSelectPopular(item.name)}
              disabled={isLoading}
              className="p-3.5 bg-[#FBFAF7] hover:bg-white border border-slate-300 hover:border-[#12213B] rounded-xl text-left transition-all group flex items-start justify-between shadow-2xs cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <h3 className="font-serif font-bold text-xs sm:text-sm text-[#12213B] group-hover:text-[#B8412C] transition-colors">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white text-[#4B5563] font-semibold border border-slate-300">
                      {item.tag}
                    </span>
                    <span className="text-[10px] text-[#1F6F4F] font-bold font-mono">
                      Banca: {item.banca}
                    </span>
                  </div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#B8412C] transform group-hover:translate-x-0.5 transition-all mt-1" />
            </button>
          ))}
        </div>
      </div>

      {/* Method explanation banner */}
      <div className="mt-8 p-4 bg-[#FBFAF7] border border-slate-300 rounded-xl flex items-start gap-3 text-xs text-[#4B5563]">
        <div className="w-6 h-6 rounded-full bg-[#12213B] text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
          <Shield className="w-3.5 h-3.5 text-[#B8862E]" />
        </div>
        <div>
          <span className="font-bold text-[#12213B] font-mono">Diretriz Oficial:</span> A IA pesquisa em tempo real os portais oficiais dos órgãos, bancas examinadoras (Cebraspe, FGV, FCC, etc.) e fontes de referência com Google Grounding para garantir a fidedignidade da matriz programática.
        </div>
      </div>
    </div>
  );
};

