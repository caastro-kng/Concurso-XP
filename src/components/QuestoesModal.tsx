import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  RefreshCw,
  Award,
  ChevronLeft,
  ChevronRight,
  Play,
  RotateCcw,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DisciplinaPlano, QuestaoBanca } from '../types';

interface QuestoesModalProps {
  disciplina: DisciplinaPlano;
  banca: string;
  concurso: string;
  onClose: () => void;
}

export const QuestoesModal: React.FC<QuestoesModalProps> = ({
  disciplina,
  banca,
  concurso,
  onClose,
}) => {
  const [questoes, setQuestoes] = useState<QuestaoBanca[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestoes = async () => {
    setLoading(true);
    setError(null);
    setSelectedAnswers({});
    setRevealed({});
    setCurrentIndex(0);

    try {
      const res = await fetch('/api/concurso/gerar-questoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          disciplina: disciplina.nome,
          topico: disciplina.topicos?.[0] || 'Geral do Edital',
          banca: banca || 'Oficial',
          concurso: concurso || 'Concurso Público',
          quantidade: 4,
        }),
      });

      const json = await res.json();
      if (json.success && json.data?.questoes?.length > 0) {
        setQuestoes(json.data.questoes);
      } else {
        throw new Error(json.error || 'Não foi possível gerar questões da banca no momento.');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao conectar com a base de questões da banca.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestoes();
  }, [disciplina.nome, banca]);

  const handleSelectOption = (optionId: string) => {
    if (revealed[currentIndex]) return;
    setSelectedAnswers((prev) => ({ ...prev, [currentIndex]: optionId }));
    setRevealed((prev) => ({ ...prev, [currentIndex]: true }));

    const currentQ = questoes[currentIndex];
    const isCorrect = currentQ && currentQ.gabarito.trim().toUpperCase() === optionId.trim().toUpperCase();

    if (isCorrect) {
      try {
        confetti({
          particleCount: 35,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch (e) {
        // ignore
      }
    }
  };

  const currentQ = questoes[currentIndex];
  const isAnswered = revealed[currentIndex];
  const selected = selectedAnswers[currentIndex];
  const isCorrect = isAnswered && currentQ && selected?.toUpperCase() === currentQ.gabarito?.trim().toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#12213B]/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#FBFAF7] border border-slate-300 rounded-2xl shadow-2xl overflow-hidden my-6 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#12213B] border-b border-[#1E355B] text-white flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#B8412C] text-white flex items-center justify-center font-serif font-bold text-sm shadow-2xs border border-[#F5C7BE]/20">
              {disciplina.nome.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-sm sm:text-base text-white">
                  Bateria da Banca {banca || 'Oficial'}
                </h3>
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-[#B8862E]/20 text-[#F6E3B8] border border-[#B8862E]/40">
                  {concurso}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-mono">
                {disciplina.nome} • {questoes.length > 0 ? `Questão ${currentIndex + 1} de ${questoes.length}` : 'Simulado'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* STATE 1: LOADING */}
          {loading && (
            <div className="py-16 text-center space-y-3">
              <div className="w-10 h-10 border-3 border-[#B8412C] border-t-transparent rounded-full animate-spin mx-auto" />
              <h4 className="font-serif text-base font-bold text-[#12213B]">
                Buscando questões reais no padrão da banca {banca}...
              </h4>
              <p className="text-xs text-[#4B5563] max-w-sm mx-auto">
                Consultando pegadinhas e fundamentação para {disciplina.nome}.
              </p>
            </div>
          )}

          {/* STATE 2: ERROR */}
          {!loading && error && (
            <div className="py-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#B8412C]/10 text-[#B8412C] flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-base font-bold text-[#12213B]">
                Não foi possível carregar as questões
              </h4>
              <p className="text-xs text-[#4B5563] max-w-md mx-auto">{error}</p>
              <button
                onClick={fetchQuestoes}
                className="px-4 py-2 bg-[#12213B] hover:bg-[#1E355B] text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Tentar Novamente</span>
              </button>
            </div>
          )}

          {/* STATE 3: CONTENT */}
          {!loading && !error && currentQ && (
            <div className="space-y-4">
              {/* Question Statement */}
              <div className="p-4 sm:p-5 bg-white border border-slate-200 rounded-xl shadow-2xs">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-mono">
                  <span className="bg-[#12213B]/10 border border-slate-300 px-2 py-0.5 rounded-md text-[#12213B] font-bold text-[10px] uppercase">
                    {currentQ.tipo === 'certo_errado' ? 'Item Certo / Errado' : 'Múltipla Escolha'}
                  </span>
                  {currentQ.fonte && <span>{currentQ.fonte}</span>}
                </div>
                <p className="font-serif text-sm sm:text-base text-[#12213B] leading-relaxed whitespace-pre-line">
                  {currentQ.enunciado}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-2">
                {(currentQ.alternativas || []).map((alt) => {
                  const isPicked = selected === alt.id;
                  const isRightOption = currentQ.gabarito.trim().toUpperCase() === alt.id.trim().toUpperCase();

                  let btnStyle = 'bg-white border-slate-200 text-[#12213B] hover:border-slate-400';
                  if (isAnswered) {
                    if (isRightOption) {
                      btnStyle = 'bg-[#1F6F4F]/10 border-[#1F6F4F] text-[#1F6F4F] font-bold ring-1 ring-[#1F6F4F]';
                    } else if (isPicked && !isRightOption) {
                      btnStyle = 'bg-[#B8412C]/10 border-[#B8412C] text-[#B8412C] line-through';
                    } else {
                      btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={alt.id}
                      onClick={() => handleSelectOption(alt.id)}
                      disabled={isAnswered}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${btnStyle} ${
                        isAnswered ? 'cursor-default' : ''
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-mono font-bold flex-shrink-0 ${
                          isAnswered && isRightOption
                            ? 'bg-[#1F6F4F] text-white'
                            : isAnswered && isPicked && !isRightOption
                            ? 'bg-[#B8412C] text-white'
                            : 'bg-slate-100 text-[#12213B]'
                        }`}
                      >
                        {alt.id}
                      </span>
                      <span className="text-xs sm:text-sm font-sans pt-0.5 leading-snug flex-1">
                        {alt.texto}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Feedback and Explanation */}
              {isAnswered && (
                <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2.5 shadow-2xs">
                  <div className="flex items-center gap-2">
                    {isCorrect ? (
                      <span className="text-xs font-mono font-bold text-[#1F6F4F] uppercase flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        Resposta Correta! (+20 XP)
                      </span>
                    ) : (
                      <span className="text-xs font-mono font-bold text-[#B8412C] uppercase flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4" />
                        Gabarito: Letra {currentQ.gabarito}
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-[#12213B] leading-relaxed pt-2 border-t border-slate-100">
                    <strong className="block font-serif text-xs text-[#12213B] mb-0.5">Fundamentação:</strong>
                    <p className="text-[#4B5563]">{currentQ.explicacao_detalhada}</p>
                  </div>

                  {currentQ.pegadinha_da_banca && (
                    <div className="p-2.5 bg-[#B8862E]/10 border border-[#B8862E]/30 rounded-lg text-xs text-[#12213B]">
                      <span className="font-mono font-bold text-[#B8862E] block mb-0.5">⚠️ Pegadinha da Banca:</span>
                      <p className="text-[#4B5563]">{currentQ.pegadinha_da_banca}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-4 bg-slate-100/80 border-t border-slate-200 flex items-center justify-between flex-shrink-0">
          <button
            disabled={currentIndex === 0 || loading}
            onClick={() => setCurrentIndex((p) => p - 1)}
            className="px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 disabled:opacity-40 text-[#12213B] rounded-xl text-xs font-mono font-bold flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Anterior</span>
          </button>

          <span className="text-xs font-mono text-[#4B5563] font-bold">
            {questoes.length > 0 ? `${currentIndex + 1} / ${questoes.length}` : ''}
          </span>

          <button
            disabled={currentIndex === questoes.length - 1 || loading}
            onClick={() => setCurrentIndex((p) => p + 1)}
            className="px-4 py-1.5 bg-[#12213B] hover:bg-[#1E355B] disabled:opacity-40 text-white rounded-xl text-xs font-mono font-bold flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed shadow-xs"
          >
            <span>Próxima</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
