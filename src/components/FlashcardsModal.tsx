import React, { useState, useEffect } from 'react';
import {
  X,
  RotateCcw,
  Sparkles,
  Check,
  Flame,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  RefreshCw,
  Brain,
} from 'lucide-react';
import { DisciplinaPlano, FlashcardItem } from '../types';

interface FlashcardsModalProps {
  disciplina: DisciplinaPlano;
  banca: string;
  onClose: () => void;
}

export const FlashcardsModal: React.FC<FlashcardsModalProps> = ({
  disciplina,
  banca,
  onClose,
}) => {
  const [cards, setCards] = useState<FlashcardItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [mastered, setMastered] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFlashcards = async () => {
    setLoading(true);
    setError(null);
    setIsFlipped(false);
    setCurrentIndex(0);

    try {
      const res = await fetch('/api/concurso/gerar-flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          disciplina: disciplina.nome,
          topicos: disciplina.topicos || ['Conceitos Chave'],
          banca: banca || 'Oficial',
        }),
      });

      const json = await res.json();
      if (json.success && json.data?.flashcards?.length > 0) {
        setCards(json.data.flashcards);
      } else {
        throw new Error(json.error || 'Não foi possível gerar os flashcards no momento.');
      }
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'Erro ao comunicar com o gerador de flashcards.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlashcards();
  }, [disciplina.nome, banca]);

  const handleNext = () => {
    setIsFlipped(false);
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const toggleMastered = (index: number) => {
    setMastered((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const currentCard = cards[currentIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#12213B]/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#FBFAF7] border border-slate-300 rounded-2xl shadow-2xl overflow-hidden my-6 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#12213B] border-b border-[#1E355B] text-white flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#B8862E] text-white flex items-center justify-center shadow-xs border border-[#F6E3B8]/20">
              <Brain className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm sm:text-base text-white">
                Flashcards Mnemônicos
              </h3>
              <p className="text-xs text-slate-300 font-mono">
                {disciplina.nome} • {cards.length > 0 ? `Cartão ${currentIndex + 1} de ${cards.length}` : 'Baralho'}
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

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* STATE 1: LOADING */}
          {loading && (
            <div className="py-16 text-center space-y-3">
              <div className="w-10 h-10 border-3 border-[#B8862E] border-t-transparent rounded-full animate-spin mx-auto" />
              <h4 className="font-serif text-base font-bold text-[#12213B]">
                Gerando flashcards mnemônicos...
              </h4>
              <p className="text-xs text-[#4B5563] max-w-xs mx-auto">
                Sintetizando conceitos de alto peso e macetes para {disciplina.nome}.
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
                Não foi possível carregar os flashcards
              </h4>
              <p className="text-xs text-[#4B5563] max-w-xs mx-auto">{error}</p>
              <button
                onClick={fetchFlashcards}
                className="px-4 py-2 bg-[#12213B] hover:bg-[#1E355B] text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Tentar Novamente</span>
              </button>
            </div>
          )}

          {/* STATE 3: CONTENT */}
          {!loading && !error && currentCard && (
            <div className="space-y-4">
              {/* Card Container with Flip */}
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className={`min-h-[220px] p-6 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col justify-between select-none shadow-sm ${
                  isFlipped
                    ? 'bg-white border-[#1F6F4F] ring-1 ring-[#1F6F4F]/30'
                    : 'bg-white border-slate-300 hover:border-slate-400'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#B8862E]/10 text-[#B8862E] font-mono font-bold text-[10px] uppercase border border-[#B8862E]/30">
                      {currentCard.grau_cobranca || 'Cai Muito'}
                    </span>
                    <span className="text-[#4B5563] font-mono text-[11px] flex items-center gap-1">
                      <RotateCcw className="w-3 h-3" />
                      {isFlipped ? 'Verso (Resposta)' : 'Frente (Pergunta) • Toque para virar'}
                    </span>
                  </div>

                  <h4 className="font-serif text-base sm:text-lg font-bold text-[#12213B] leading-relaxed">
                    {isFlipped ? currentCard.verso : currentCard.frente}
                  </h4>
                </div>

                {isFlipped && currentCard.dica_mnemonica && (
                  <div className="mt-4 p-3 bg-[#B8862E]/10 rounded-xl border border-[#B8862E]/30 text-xs text-[#12213B]">
                    <strong className="font-mono font-bold text-[#B8862E] block mb-0.5">💡 Mnemônico:</strong>
                    <p className="font-sans text-[#4B5563]">{currentCard.dica_mnemonica}</p>
                  </div>
                )}
              </div>

              {/* Status Actions */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => toggleMastered(currentIndex)}
                  className={`px-3.5 py-2 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    mastered[currentIndex]
                      ? 'bg-[#1F6F4F] border-[#1F6F4F] text-white shadow-xs'
                      : 'bg-white border-slate-300 text-[#12213B] hover:border-slate-400'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{mastered[currentIndex] ? 'Dominado!' : 'Marcar como Dominado'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    disabled={currentIndex === 0}
                    onClick={handlePrev}
                    className="p-2 rounded-xl bg-white border border-slate-300 text-[#12213B] hover:bg-slate-50 disabled:opacity-40 transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    disabled={currentIndex === cards.length - 1}
                    onClick={handleNext}
                    className="p-2 rounded-xl bg-[#12213B] text-white hover:bg-[#1E355B] disabled:opacity-40 transition-colors cursor-pointer shadow-xs"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
