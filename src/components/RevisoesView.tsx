import React, { useState, useEffect } from 'react';
import {
  PlanoEstudoCompleto,
  DisciplinaPlano,
  QuestaoBanca,
  FlashcardItem,
} from '../types';
import {
  Brain,
  CheckCircle2,
  Clock,
  HelpCircle,
  Layers,
  Play,
  RotateCcw,
  Sparkles,
  Target,
  Zap,
  Award,
  AlertTriangle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Check,
  Flame,
  BookOpen,
  Filter,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CicloEstudosView } from './CicloEstudosView';

interface RevisoesViewProps {
  plan: PlanoEstudoCompleto;
  onOpenQuestoesModal?: (disc: DisciplinaPlano) => void;
  onOpenFlashcardsModal?: (disc: DisciplinaPlano) => void;
  onOpenQuestoes?: (disc: DisciplinaPlano) => void;
  onOpenFlashcards?: (disc: DisciplinaPlano) => void;
  onOpenPomodoro?: () => void;
  onOpenMentorChat?: () => void;
  onTriggerStamp?: (title: string, subtitle?: string, xpGained?: number) => void;
}

export const RevisoesView: React.FC<RevisoesViewProps> = ({
  plan,
  onOpenQuestoesModal,
  onOpenFlashcardsModal,
  onOpenQuestoes,
  onOpenFlashcards,
  onOpenPomodoro,
  onOpenMentorChat,
  onTriggerStamp,
}) => {
  const [selectedSubTab, setSelectedSubTab] = useState<'ciclo' | 'questoes' | 'flashcards'>('ciclo');

  // Handle opening modals safely supporting both prop naming patterns
  const handleOpenQuestoesModal = (disc: DisciplinaPlano) => {
    if (onOpenQuestoesModal) {
      onOpenQuestoesModal(disc);
    } else if (onOpenQuestoes) {
      onOpenQuestoes(disc);
    }
  };

  const handleOpenFlashcardsModal = (disc: DisciplinaPlano) => {
    if (onOpenFlashcardsModal) {
      onOpenFlashcardsModal(disc);
    } else if (onOpenFlashcards) {
      onOpenFlashcards(disc);
    }
  };

  // --- QUESTÕES STATE (Interactive in-view training) ---
  const [selectedDiscForQuestoes, setSelectedDiscForQuestoes] = useState<string>(
    plan?.disciplinas?.[0]?.id || 'geral'
  );
  const [questoesList, setQuestoesList] = useState<QuestaoBanca[]>([]);
  const [currentQuestaoIdx, setCurrentQuestaoIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [revealedAnswers, setRevealedAnswers] = useState<Record<number, boolean>>({});
  const [loadingQuestoes, setLoadingQuestoes] = useState(false);
  const [errorQuestoes, setErrorQuestoes] = useState<string | null>(null);
  const [questoesStats, setQuestoesStats] = useState({ acertos: 0, respondidas: 0 });

  // --- FLASHCARDS STATE (Interactive in-view deck) ---
  const [selectedDiscForCards, setSelectedDiscForCards] = useState<string>(
    plan?.disciplinas?.[0]?.id || 'geral'
  );
  const [flashcardsList, setFlashcardsList] = useState<FlashcardItem[]>([]);
  const [currentCardIdx, setCurrentCardIdx] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [masteredCards, setMasteredCards] = useState<Record<number, boolean>>({});
  const [loadingCards, setLoadingCards] = useState(false);
  const [errorCards, setErrorCards] = useState<string | null>(null);

  // Active discipline helpers
  const currentQuestoesDisc =
    plan?.disciplinas?.find((d) => d.id === selectedDiscForQuestoes) ||
    plan?.disciplinas?.[0] || {
      id: 'geral',
      nome: 'Conhecimentos Gerais do Edital',
      topicos: ['Legislação e Princípios'],
      peso: 'alto',
      ordem_importancia: 1,
      horas_por_dia: '1h30',
      horas_semanais_sugeridas: 6,
      video_youtube_busca: '',
    };

  const currentCardsDisc =
    plan?.disciplinas?.find((d) => d.id === selectedDiscForCards) ||
    plan?.disciplinas?.[0] || {
      id: 'geral',
      nome: 'Conhecimentos Gerais do Edital',
      topicos: ['Legislação e Princípios'],
      peso: 'alto',
      ordem_importancia: 1,
      horas_por_dia: '1h30',
      horas_semanais_sugeridas: 6,
      video_youtube_busca: '',
    };

  // Fetch Questoes
  const fetchQuestoes = async (disc?: DisciplinaPlano) => {
    const targetDisc = disc || currentQuestoesDisc;
    setLoadingQuestoes(true);
    setErrorQuestoes(null);
    setSelectedAnswers({});
    setRevealedAnswers({});
    setCurrentQuestaoIdx(0);

    try {
      const res = await fetch('/api/concurso/gerar-questoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          disciplina: targetDisc.nome,
          topico: targetDisc.topicos?.[0] || 'Tópicos Principais do Edital',
          banca: plan.banca || 'Oficial',
          concurso: plan.concurso || 'Concurso Público',
          quantidade: 4,
        }),
      });

      const json = await res.json();
      if (json.success && json.data?.questoes?.length > 0) {
        setQuestoesList(json.data.questoes);
      } else {
        throw new Error(json.error || 'Não foi possível carregar as questões no momento.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorQuestoes(err.message || 'Erro de conexão ao buscar questões da banca.');
    } finally {
      setLoadingQuestoes(false);
    }
  };

  // Fetch Flashcards
  const fetchFlashcards = async (disc?: DisciplinaPlano) => {
    const targetDisc = disc || currentCardsDisc;
    setLoadingCards(true);
    setErrorCards(null);
    setIsCardFlipped(false);
    setCurrentCardIdx(0);

    try {
      const res = await fetch('/api/concurso/gerar-flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          disciplina: targetDisc.nome,
          topicos: targetDisc.topicos || ['Conceitos Chave'],
          banca: plan.banca || 'Oficial',
        }),
      });

      const json = await res.json();
      if (json.success && json.data?.flashcards?.length > 0) {
        setFlashcardsList(json.data.flashcards);
      } else {
        throw new Error(json.error || 'Não foi possível gerar os flashcards no momento.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorCards(err.message || 'Erro de conexão ao gerar flashcards.');
    } finally {
      setLoadingCards(false);
    }
  };

  // Load initially when switching tabs
  useEffect(() => {
    if (selectedSubTab === 'questoes' && questoesList.length === 0 && !loadingQuestoes) {
      fetchQuestoes();
    } else if (selectedSubTab === 'flashcards' && flashcardsList.length === 0 && !loadingCards) {
      fetchFlashcards();
    }
  }, [selectedSubTab]);

  // Answer a question
  const handleSelectAnswer = (optionId: string) => {
    if (revealedAnswers[currentQuestaoIdx]) return;

    setSelectedAnswers((prev) => ({ ...prev, [currentQuestaoIdx]: optionId }));
    setRevealedAnswers((prev) => ({ ...prev, [currentQuestaoIdx]: true }));

    const currentQ = questoesList[currentQuestaoIdx];
    const isCorrect = currentQ && currentQ.gabarito.trim().toUpperCase() === optionId.trim().toUpperCase();

    setQuestoesStats((prev) => ({
      respondidas: prev.respondidas + 1,
      acertos: isCorrect ? prev.acertos + 1 : prev.acertos,
    }));

    if (isCorrect) {
      try {
        confetti({
          particleCount: 35,
          spread: 55,
          origin: { y: 0.65 },
        });
      } catch (e) {
        // ignore
      }
      if (onTriggerStamp && (questoesStats.acertos + 1) % 3 === 0) {
        onTriggerStamp('BATERIA CONCLUÍDA', `Excelente desempenho em ${currentQuestoesDisc.nome}`, 50);
      }
    }
  };

  const currentQ = questoesList[currentQuestaoIdx];
  const isAnswered = revealedAnswers[currentQuestaoIdx];
  const selectedAnswer = selectedAnswers[currentQuestaoIdx];
  const isAnswerCorrect = isAnswered && currentQ && selectedAnswer?.toUpperCase() === currentQ.gabarito?.trim().toUpperCase();

  const currentCard = flashcardsList[currentCardIdx];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-[#FBFAF7] border border-slate-300 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#12213B]/10 text-[#12213B] border border-slate-300">
                Módulo Oficial de Revisão
              </span>
              <span className="text-xs font-mono text-[#B8412C] font-bold">
                Banca: {plan.banca}
              </span>
              <span className="text-xs font-mono text-[#4B5563]">
                Edital: {plan.concurso}
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#12213B]">
              Centro Estratégico de Revisões e Ciclos
            </h1>
            <p className="text-xs sm:text-sm text-[#4B5563] mt-1 max-w-2xl">
              Fixação ativa com simulados calibrados no padrão da banca examinadora, baralhos de flashcards mnemônicos e alternância programada de matérias.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {onOpenPomodoro && (
              <button
                onClick={onOpenPomodoro}
                className="px-4 py-2.5 bg-[#1F6F4F] hover:bg-[#18593F] text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <Clock className="w-4 h-4" />
                <span>Sessão Pomodoro</span>
              </button>
            )}
          </div>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-5 border-t border-slate-200 overflow-x-auto pb-1">
          <button
            id="subtab-ciclo"
            onClick={() => setSelectedSubTab('ciclo')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              selectedSubTab === 'ciclo'
                ? 'bg-[#12213B] text-white shadow-sm ring-1 ring-white/20'
                : 'bg-white border border-slate-300 text-[#4B5563] hover:text-[#12213B]'
            }`}
          >
            <Layers className="w-4 h-4 text-[#B8862E]" />
            <span>Ciclo Semanal de Estudos</span>
          </button>

          <button
            id="subtab-questoes"
            onClick={() => {
              setSelectedSubTab('questoes');
              if (questoesList.length === 0 && !loadingQuestoes) {
                fetchQuestoes();
              }
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              selectedSubTab === 'questoes'
                ? 'bg-[#12213B] text-white shadow-sm ring-1 ring-white/20'
                : 'bg-white border border-slate-300 text-[#4B5563] hover:text-[#12213B]'
            }`}
          >
            <Target className="w-4 h-4 text-[#B8412C]" />
            <span>Simulados e Questões de Banca</span>
          </button>

          <button
            id="subtab-flashcards"
            onClick={() => {
              setSelectedSubTab('flashcards');
              if (flashcardsList.length === 0 && !loadingCards) {
                fetchFlashcards();
              }
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              selectedSubTab === 'flashcards'
                ? 'bg-[#12213B] text-white shadow-sm ring-1 ring-white/20'
                : 'bg-white border border-slate-300 text-[#4B5563] hover:text-[#12213B]'
            }`}
          >
            <Brain className="w-4 h-4 text-[#1F6F4F]" />
            <span>Flashcards Mnemônicos</span>
          </button>
        </div>
      </div>

      {/* SUBTAB 1: CICLO SEMANAL */}
      {selectedSubTab === 'ciclo' && (
        <CicloEstudosView
          plan={plan}
          onOpenQuestoes={handleOpenQuestoesModal}
          onOpenFlashcards={handleOpenFlashcardsModal}
        />
      )}

      {/* SUBTAB 2: SIMULADOS E QUESTÕES DE BANCA */}
      {selectedSubTab === 'questoes' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="p-4 sm:p-5 bg-[#FBFAF7] border border-slate-300 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <span className="text-xs font-mono font-bold text-[#12213B] flex items-center gap-1.5">
                <Target className="w-4 h-4 text-[#B8412C]" />
                Matéria do Simulado:
              </span>
              <select
                id="select-disciplina-questoes"
                value={selectedDiscForQuestoes}
                onChange={(e) => {
                  const newDiscId = e.target.value;
                  setSelectedDiscForQuestoes(newDiscId);
                  const d = plan.disciplinas.find((x) => x.id === newDiscId);
                  if (d) fetchQuestoes(d);
                }}
                disabled={loadingQuestoes}
                className="px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold text-[#12213B] focus:outline-none focus:ring-2 focus:ring-[#12213B] cursor-pointer"
              >
                {(plan?.disciplinas || []).map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.nome} ({d.peso.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3">
              {questoesStats.respondidas > 0 && (
                <div className="text-xs font-mono text-[#4B5563] hidden sm:block">
                  Aproveitamento: <strong className="text-[#1F6F4F]">{questoesStats.acertos}/{questoesStats.respondidas}</strong> ({Math.round((questoesStats.acertos / questoesStats.respondidas) * 100)}%)
                </div>
              )}

              <button
                id="btn-nova-bateria-questoes"
                onClick={() => fetchQuestoes()}
                disabled={loadingQuestoes}
                className="px-4 py-2 bg-[#B8412C] hover:bg-[#9E3624] disabled:bg-slate-300 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingQuestoes ? 'animate-spin' : ''}`} />
                <span>{loadingQuestoes ? 'Buscando...' : 'Nova Bateria de Questões'}</span>
              </button>
            </div>
          </div>

          {/* STATE 1: LOADING */}
          {loadingQuestoes && (
            <div className="p-12 sm:p-16 bg-[#FBFAF7] border border-slate-300 rounded-2xl text-center space-y-4 shadow-sm">
              <div className="w-10 h-10 border-3 border-[#B8412C] border-t-transparent rounded-full animate-spin mx-auto" />
              <div>
                <h3 className="font-serif text-lg font-bold text-[#12213B]">
                  Buscando questões reais no padrão da banca {plan.banca}...
                </h3>
                <p className="text-xs text-[#4B5563] mt-1 max-w-md mx-auto">
                  Consultando editais anteriores, jurisprudência e fontes oficiais para {currentQuestoesDisc.nome}.
                </p>
              </div>
            </div>
          )}

          {/* STATE 2: ERROR */}
          {!loadingQuestoes && errorQuestoes && (
            <div className="p-8 sm:p-10 bg-[#FBFAF7] border border-[#B8412C]/40 rounded-2xl text-center space-y-4 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-[#B8412C]/10 text-[#B8412C] flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-base font-bold text-[#12213B]">
                  Não foi possível carregar as questões da banca
                </h3>
                <p className="text-xs text-[#4B5563] mt-1 max-w-md mx-auto">
                  {errorQuestoes}
                </p>
              </div>
              <button
                onClick={() => fetchQuestoes()}
                className="px-5 py-2.5 bg-[#12213B] hover:bg-[#1E355B] text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Tentar Novamente</span>
              </button>
            </div>
          )}

          {/* STATE 3: CONTENT */}
          {!loadingQuestoes && !errorQuestoes && currentQ && (
            <div className="bg-[#FBFAF7] border border-slate-300 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
              {/* Question Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-[#12213B] text-white">
                    Questão {currentQuestaoIdx + 1} de {questoesList.length}
                  </span>
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-white text-[#B8412C] border border-slate-300">
                    Banca {plan.banca}
                  </span>
                  {currentQ.fonte && (
                    <span className="text-[11px] font-mono text-[#4B5563]">
                      Fonte: {currentQ.fonte}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-[#12213B] font-bold">
                    {currentQuestoesDisc.nome}
                  </span>
                </div>
              </div>

              {/* Enunciado */}
              <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-2xs">
                <p className="font-serif text-sm sm:text-base text-[#12213B] leading-relaxed whitespace-pre-line">
                  {currentQ.enunciado}
                </p>
              </div>

              {/* Alternatives */}
              <div className="space-y-2.5">
                {(currentQ.alternativas || []).map((alt) => {
                  const isPicked = selectedAnswer === alt.id;
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
                      onClick={() => handleSelectAnswer(alt.id)}
                      disabled={isAnswered}
                      className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${btnStyle} ${
                        isAnswered ? 'cursor-default' : ''
                      }`}
                    >
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-bold flex-shrink-0 ${
                        isAnswered && isRightOption
                          ? 'bg-[#1F6F4F] text-white'
                          : isAnswered && isPicked && !isRightOption
                          ? 'bg-[#B8412C] text-white'
                          : 'bg-slate-100 text-[#12213B]'
                      }`}>
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
                <div className="p-5 bg-white border border-slate-200 rounded-xl space-y-3 shadow-2xs">
                  <div className="flex items-center gap-2">
                    {isAnswerCorrect ? (
                      <span className="text-xs font-mono font-bold text-[#1F6F4F] uppercase flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        Resposta Correta! (+20 XP)
                      </span>
                    ) : (
                      <span className="text-xs font-mono font-bold text-[#B8412C] uppercase flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4" />
                        Gabarito Oficial: Letra {currentQ.gabarito}
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-[#12213B] leading-relaxed pt-2 border-t border-slate-100">
                    <strong className="block font-serif text-sm text-[#12213B] mb-1">Fundamentação do Gabarito:</strong>
                    <p className="text-[#4B5563]">{currentQ.explicacao_detalhada}</p>
                  </div>

                  {currentQ.pegadinha_da_banca && (
                    <div className="p-3 bg-[#B8862E]/10 border border-[#B8862E]/30 rounded-lg text-xs text-[#12213B]">
                      <span className="font-mono font-bold text-[#B8862E] block mb-0.5">⚠️ Pegadinha Típica da Banca:</span>
                      <p className="text-[#4B5563]">{currentQ.pegadinha_da_banca}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Question Navigation Bar */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <button
                  disabled={currentQuestaoIdx === 0}
                  onClick={() => setCurrentQuestaoIdx((p) => p - 1)}
                  className="px-4 py-2 bg-white hover:bg-slate-50 disabled:opacity-40 border border-slate-300 text-[#12213B] rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Anterior</span>
                </button>

                <div className="flex items-center gap-1">
                  {questoesList.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentQuestaoIdx(idx)}
                      className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                        currentQuestaoIdx === idx
                          ? 'bg-[#12213B] text-white'
                          : revealedAnswers[idx]
                          ? selectedAnswers[idx]?.toUpperCase() === questoesList[idx]?.gabarito?.trim().toUpperCase()
                            ? 'bg-[#1F6F4F]/20 text-[#1F6F4F] border border-[#1F6F4F]'
                            : 'bg-[#B8412C]/20 text-[#B8412C] border border-[#B8412C]'
                          : 'bg-white border border-slate-200 text-slate-600'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>

                <button
                  disabled={currentQuestaoIdx === questoesList.length - 1}
                  onClick={() => setCurrentQuestaoIdx((p) => p + 1)}
                  className="px-4 py-2 bg-[#12213B] hover:bg-[#1E355B] disabled:opacity-40 text-white rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed shadow-xs"
                >
                  <span>Próxima</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Grid of Disciplines to launch specific questions */}
          <div className="space-y-3">
            <h3 className="font-serif text-sm font-bold text-[#12213B]">
              Ou Escolha uma Disciplina Específica:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {(plan?.disciplinas || []).map((d) => (
                <div
                  key={d.id}
                  className="p-3.5 bg-white border border-slate-200 rounded-xl hover:border-slate-300 shadow-2xs flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <span className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded ${
                      d.peso === 'alto'
                        ? 'bg-[#B8412C]/10 text-[#B8412C]'
                        : d.peso === 'medio'
                        ? 'bg-[#B8862E]/10 text-[#B8862E]'
                        : 'bg-[#1F6F4F]/10 text-[#1F6F4F]'
                    }`}>
                      {d.peso}
                    </span>
                    <h4 className="font-serif text-xs font-bold text-[#12213B] truncate mt-1">
                      {d.nome}
                    </h4>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedDiscForQuestoes(d.id);
                      fetchQuestoes(d);
                    }}
                    className="px-3 py-1.5 bg-[#12213B] hover:bg-[#1E355B] text-white rounded-lg text-xs font-mono font-bold flex items-center gap-1 flex-shrink-0 cursor-pointer"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Iniciar</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: FLASHCARDS MNEMÔNICOS */}
      {selectedSubTab === 'flashcards' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="p-4 sm:p-5 bg-[#FBFAF7] border border-slate-300 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <span className="text-xs font-mono font-bold text-[#12213B] flex items-center gap-1.5">
                <Brain className="w-4 h-4 text-[#B8862E]" />
                Baralho da Disciplina:
              </span>
              <select
                id="select-disciplina-flashcards"
                value={selectedDiscForCards}
                onChange={(e) => {
                  const newDiscId = e.target.value;
                  setSelectedDiscForCards(newDiscId);
                  const d = plan.disciplinas.find((x) => x.id === newDiscId);
                  if (d) fetchFlashcards(d);
                }}
                disabled={loadingCards}
                className="px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold text-[#12213B] focus:outline-none focus:ring-2 focus:ring-[#12213B] cursor-pointer"
              >
                {(plan?.disciplinas || []).map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.nome} ({d.topicos?.length || 0} tópicos)
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3">
              <button
                id="btn-novo-baralho-flashcards"
                onClick={() => fetchFlashcards()}
                disabled={loadingCards}
                className="px-4 py-2 bg-[#B8862E] hover:bg-[#9E7326] disabled:bg-slate-300 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingCards ? 'animate-spin' : ''}`} />
                <span>{loadingCards ? 'Gerando...' : 'Regerar Baralho'}</span>
              </button>
            </div>
          </div>

          {/* STATE 1: LOADING */}
          {loadingCards && (
            <div className="p-12 sm:p-16 bg-[#FBFAF7] border border-slate-300 rounded-2xl text-center space-y-4 shadow-sm">
              <div className="w-10 h-10 border-3 border-[#B8862E] border-t-transparent rounded-full animate-spin mx-auto" />
              <div>
                <h3 className="font-serif text-lg font-bold text-[#12213B]">
                  Gerando e sintetizando flashcards mnemônicos...
                </h3>
                <p className="text-xs text-[#4B5563] mt-1 max-w-md mx-auto">
                  Extraindo conceitos e macetes de memorização para {currentCardsDisc.nome}.
                </p>
              </div>
            </div>
          )}

          {/* STATE 2: ERROR */}
          {!loadingCards && errorCards && (
            <div className="p-8 sm:p-10 bg-[#FBFAF7] border border-[#B8862E]/40 rounded-2xl text-center space-y-4 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-[#B8862E]/10 text-[#B8862E] flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-base font-bold text-[#12213B]">
                  Não foi possível carregar os flashcards
                </h3>
                <p className="text-xs text-[#4B5563] mt-1 max-w-md mx-auto">
                  {errorCards}
                </p>
              </div>
              <button
                onClick={() => fetchFlashcards()}
                className="px-5 py-2.5 bg-[#12213B] hover:bg-[#1E355B] text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Tentar Novamente</span>
              </button>
            </div>
          )}

          {/* STATE 3: CONTENT */}
          {!loadingCards && !errorCards && currentCard && (
            <div className="max-w-2xl mx-auto space-y-4">
              {/* Card Container with Flip */}
              <div
                onClick={() => setIsCardFlipped(!isCardFlipped)}
                className={`min-h-[260px] p-6 sm:p-8 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col justify-between select-none shadow-sm ${
                  isCardFlipped
                    ? 'bg-white border-[#1F6F4F] ring-1 ring-[#1F6F4F]/30'
                    : 'bg-[#FBFAF7] border-slate-300 hover:border-slate-400'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#B8862E]/10 text-[#B8862E] font-mono font-bold text-[10px] uppercase border border-[#B8862E]/30">
                      {currentCard.grau_cobranca || 'Cai Muito na Prova'}
                    </span>
                    <span className="text-[#4B5563] font-mono text-[11px] flex items-center gap-1.5">
                      <RotateCcw className="w-3.5 h-3.5" />
                      {isCardFlipped ? 'Verso (Resposta) • Toque para virar' : 'Frente (Pergunta) • Toque para virar'}
                    </span>
                  </div>

                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#12213B] leading-relaxed">
                    {isCardFlipped ? currentCard.verso : currentCard.frente}
                  </h3>
                </div>

                {isCardFlipped && currentCard.dica_mnemonica && (
                  <div className="mt-4 p-3.5 bg-[#B8862E]/10 rounded-xl border border-[#B8862E]/30 text-xs text-[#12213B]">
                    <strong className="font-mono font-bold text-[#B8862E] block mb-0.5">💡 Macete Mnemônico:</strong>
                    <p className="font-sans text-[#4B5563]">{currentCard.dica_mnemonica}</p>
                  </div>
                )}

                <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] font-mono text-[#4B5563]">
                  <span>{currentCardsDisc.nome}</span>
                  <span>Cartão {currentCardIdx + 1} de {flashcardsList.length}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMasteredCards((prev) => ({ ...prev, [currentCardIdx]: !prev[currentCardIdx] }));
                    if (!masteredCards[currentCardIdx] && onTriggerStamp) {
                      onTriggerStamp('CONCEITO DOMINADO', `${currentCardsDisc.nome} fixado na memória`, 20);
                    }
                  }}
                  className={`px-4 py-2 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    masteredCards[currentCardIdx]
                      ? 'bg-[#1F6F4F] border-[#1F6F4F] text-white shadow-xs'
                      : 'bg-white border-slate-300 text-[#12213B] hover:border-slate-400'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>{masteredCards[currentCardIdx] ? 'Conceito Dominado!' : 'Marcar como Dominado'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    disabled={currentCardIdx === 0}
                    onClick={() => {
                      setIsCardFlipped(false);
                      setCurrentCardIdx((p) => p - 1);
                    }}
                    className="p-2 rounded-xl bg-white border border-slate-300 text-[#12213B] hover:bg-slate-50 disabled:opacity-40 transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    disabled={currentCardIdx === flashcardsList.length - 1}
                    onClick={() => {
                      setIsCardFlipped(false);
                      setCurrentCardIdx((p) => p + 1);
                    }}
                    className="p-2 rounded-xl bg-[#12213B] text-white hover:bg-[#1E355B] disabled:opacity-40 transition-colors cursor-pointer shadow-xs"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Grid of Disciplines to launch specific flashcard decks */}
          <div className="space-y-3">
            <h3 className="font-serif text-sm font-bold text-[#12213B]">
              Baralhos por Matéria do Edital:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {(plan?.disciplinas || []).map((d) => (
                <div
                  key={d.id}
                  className="p-3.5 bg-white border border-slate-200 rounded-xl hover:border-slate-300 shadow-2xs flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-[#B8862E]/10 text-[#B8862E]">
                      {d.topicos?.length || 0} tópicos
                    </span>
                    <h4 className="font-serif text-xs font-bold text-[#12213B] truncate mt-1">
                      {d.nome}
                    </h4>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedDiscForCards(d.id);
                      fetchFlashcards(d);
                    }}
                    className="px-3 py-1.5 bg-[#B8862E] hover:bg-[#9E7326] text-white rounded-lg text-xs font-mono font-bold flex items-center gap-1 flex-shrink-0 cursor-pointer"
                  >
                    <Brain className="w-3 h-3" />
                    <span>Estudar</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
