import React, { useState } from 'react';
import {
  FileText,
  CheckCircle2,
  Building,
  Award,
  Calendar,
  DollarSign,
  GraduationCap,
  ExternalLink,
  Edit3,
  ArrowRight,
  RotateCcw,
  Sparkles,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import { ConcursoIdentificado, UserProfile } from '../types';

interface Step3EditalConfirmationProps {
  identificado: ConcursoIdentificado;
  fontes?: Array<{ title: string; uri: string }>;
  user: UserProfile;
  onConfirm: (customParams?: { cargo?: string; banca?: string; ano?: string }) => void;
  onBack: () => void;
  isLoadingPlano: boolean;
}

export const Step3EditalConfirmation: React.FC<Step3EditalConfirmationProps> = ({
  identificado,
  fontes = [],
  user,
  onConfirm,
  onBack,
  isLoadingPlano,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [customCargo, setCustomCargo] = useState(identificado.cargo || '');
  const [customBanca, setCustomBanca] = useState(identificado.banca || '');
  const [customAno, setCustomAno] = useState(identificado.ano_edital || '');

  const handleConfirmClick = () => {
    if (isEditing) {
      onConfirm({
        cargo: customCargo,
        banca: customBanca,
        ano: customAno,
      });
    } else {
      onConfirm();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#12213B]/5 border border-slate-300 text-[#12213B] text-xs font-mono font-bold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#B8862E]" />
          <span>Etapa 3 de 4 • Certidão de Localização do Edital</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#12213B] tracking-tight">
          Edital Localizado via Grounding Oficial
        </h1>
        <p className="text-xs sm:text-sm text-[#4B5563] mt-2 max-w-xl mx-auto leading-relaxed">
          Confirmamos os dados oficiais da banca e do órgão antes de processar a ordenação por peso de matérias e curadoria do YouTube.
        </p>
      </div>

      {/* Confirmation Card */}
      <div className="bg-[#FBFAF7] border border-slate-300 rounded-2xl shadow-sm p-6 sm:p-8 mb-6 relative overflow-hidden">
        {/* Confirmation Message from Prompt Specification */}
        <div className="p-4 sm:p-5 bg-[#1F6F4F]/10 border border-[#1F6F4F]/30 rounded-xl mb-6 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-[#1F6F4F] flex-shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-[#12213B]">
            <p className="font-serif font-bold text-[#12213B] text-base mb-1">
              {identificado.mensagem_confirmacao ||
                `Encontrei o edital de ${identificado.concurso_identificado}, organizado pela banca ${identificado.banca}, publicado em ${identificado.ano_edital}. Posso montar seu plano de estudos com base nele?`}
            </p>
            {identificado.resumo_rapido && (
              <p className="text-xs text-[#4B5563] mt-1 leading-relaxed">{identificado.resumo_rapido}</p>
            )}
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {/* Concurso / Órgão */}
          <div className="p-4 bg-white border border-slate-200 rounded-xl">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#4B5563] uppercase tracking-wider mb-1">
              <Building className="w-3.5 h-3.5 text-[#12213B]" />
              <span>Concurso / Órgão</span>
            </div>
            <p className="font-serif text-sm font-bold text-[#12213B] line-clamp-2">
              {identificado.concurso_identificado || identificado.orgao}
            </p>
          </div>

          {/* Banca Organizadora */}
          <div className="p-4 bg-white border border-slate-200 rounded-xl">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#4B5563] uppercase tracking-wider mb-1">
              <Award className="w-3.5 h-3.5 text-[#B8862E]" />
              <span>Banca Organizadora</span>
            </div>
            {isEditing ? (
              <input
                type="text"
                value={customBanca}
                onChange={(e) => setCustomBanca(e.target.value)}
                className="w-full mt-1 px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-[#12213B] font-semibold focus:outline-none focus:ring-2 focus:ring-[#12213B]"
              />
            ) : (
              <p className="text-sm font-mono font-bold text-[#B8412C]">{identificado.banca || 'A definir / Tradicional'}</p>
            )}
          </div>

          {/* Cargo */}
          <div className="p-4 bg-white border border-slate-200 rounded-xl">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#4B5563] uppercase tracking-wider mb-1">
              <FileText className="w-3.5 h-3.5 text-[#B8862E]" />
              <span>Cargo em Foco</span>
            </div>
            {isEditing ? (
              <input
                type="text"
                value={customCargo}
                onChange={(e) => setCustomCargo(e.target.value)}
                className="w-full mt-1 px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-[#12213B] font-semibold focus:outline-none focus:ring-2 focus:ring-[#12213B]"
              />
            ) : (
              <p className="font-serif text-sm font-bold text-[#12213B] line-clamp-1">{identificado.cargo || 'Geral'}</p>
            )}
          </div>

          {/* Ano do Edital */}
          <div className="p-4 bg-white border border-slate-200 rounded-xl">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#4B5563] uppercase tracking-wider mb-1">
              <Calendar className="w-3.5 h-3.5 text-[#1F6F4F]" />
              <span>Ano / Vigência</span>
            </div>
            {isEditing ? (
              <input
                type="text"
                value={customAno}
                onChange={(e) => setCustomAno(e.target.value)}
                className="w-full mt-1 px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-[#12213B] font-semibold focus:outline-none focus:ring-2 focus:ring-[#12213B]"
              />
            ) : (
              <p className="text-sm font-mono font-bold text-[#12213B]">{identificado.ano_edital || 'Mais recente'}</p>
            )}
          </div>

          {/* Escolaridade */}
          {identificado.escolaridade && (
            <div className="p-4 bg-white border border-slate-200 rounded-xl">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#4B5563] uppercase tracking-wider mb-1">
                <GraduationCap className="w-3.5 h-3.5 text-[#12213B]" />
                <span>Escolaridade</span>
              </div>
              <p className="text-sm font-bold text-[#12213B]">{identificado.escolaridade}</p>
            </div>
          )}

          {/* Remuneração */}
          {identificado.remuneracao && (
            <div className="p-4 bg-white border border-slate-200 rounded-xl">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#4B5563] uppercase tracking-wider mb-1">
                <DollarSign className="w-3.5 h-3.5 text-[#1F6F4F]" />
                <span>Remuneração Inicial</span>
              </div>
              <p className="text-sm font-bold text-[#1F6F4F] font-mono">{identificado.remuneracao}</p>
            </div>
          )}
        </div>

        {/* Toggle Edit Details */}
        <div className="flex items-center justify-between pt-2 pb-4 border-b border-slate-200">
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="text-xs text-[#4B5563] hover:text-[#12213B] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Concluir Ajustes Manuais' : 'Ajustar Cargo ou Banca Manualmente'}</span>
          </button>

          <span className="text-[11px] text-[#4B5563] font-mono">
            Confiabilidade dos dados: <strong className="text-[#1F6F4F] uppercase font-bold">{identificado.confiabilidade}</strong>
          </span>
        </div>

        {/* Grounding Sources */}
        {fontes && fontes.length > 0 && (
          <div className="mt-4">
            <h4 className="text-xs font-mono font-bold text-[#4B5563] uppercase tracking-wider mb-2">
              Fontes Oficiais e Portais Consultados (Grounding)
            </h4>
            <div className="flex flex-wrap gap-2">
              {fontes.map((f, idx) => (
                <a
                  key={idx}
                  href={f.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-[11px] text-[#12213B] font-mono transition-all"
                >
                  <span className="max-w-[200px] truncate">{f.title || f.uri}</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4">
          <button
            type="button"
            onClick={onBack}
            disabled={isLoadingPlano}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-[#12213B] text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Escolher Outro Concurso</span>
          </button>

          <button
            id="btn-confirmar-gerar-plano"
            type="button"
            onClick={handleConfirmClick}
            disabled={isLoadingPlano}
            className="w-full sm:w-auto px-6 py-3.5 bg-[#B8412C] hover:bg-[#9E3624] disabled:bg-slate-300 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer disabled:cursor-not-allowed"
          >
            {isLoadingPlano ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Montando Estudo Planejado por Peso + YouTube...</span>
              </>
            ) : (
              <>
                <span>Sim! Homologar Plano de Estudos com Base no Edital</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

