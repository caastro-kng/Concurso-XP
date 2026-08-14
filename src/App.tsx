import React, { useState, useEffect } from 'react';
import { AppNavigation } from './components/AppNavigation';
import { Step1Login } from './components/Step1Login';
import { Step2ConcursoInput } from './components/Step2ConcursoInput';
import { Step3EditalConfirmation } from './components/Step3EditalConfirmation';
import { Step4PlanoEstudo } from './components/Step4PlanoEstudo';
import { PerfilView } from './components/PerfilView';
import { RevisoesView } from './components/RevisoesView';
import { StampCelebration } from './components/StampCelebration';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { QuestoesModal } from './components/QuestoesModal';
import { FlashcardsModal } from './components/FlashcardsModal';
import { MentorChatModal } from './components/MentorChatModal';
import { PomodoroModal } from './components/PomodoroModal';
import { SavedPlansModal } from './components/SavedPlansModal';

import {
  UserProfile,
  ConcursoIdentificado,
  PlanoEstudoCompleto,
  DisciplinaPlano,
  MainAppSection,
} from './types';
import {
  getStoredUser,
  saveStoredUser,
  getStoredPlans,
  savePlan,
  getActivePlanId,
  setActivePlanId,
  deletePlan,
} from './lib/storageHelper';

export default function App() {
  // Authentication & State
  const [user, setUser] = useState<UserProfile | null>(() => getStoredUser());
  const [currentStep, setCurrentStep] = useState<number>(() => (getStoredUser() ? 2 : 1));
  const [currentSection, setCurrentSection] = useState<MainAppSection>('trilha');
  const [savedPlans, setSavedPlans] = useState<PlanoEstudoCompleto[]>(() => getStoredPlans());
  const [activePlan, setActivePlan] = useState<PlanoEstudoCompleto | null>(() => {
    const activeId = getActivePlanId();
    const plans = getStoredPlans();
    return plans.find((p) => p.id === activeId) || (plans.length > 0 ? plans[0] : null);
  });

  // Flow State
  const [concursoIdentificado, setConcursoIdentificado] = useState<ConcursoIdentificado | null>(null);
  const [groundingFontes, setGroundingFontes] = useState<Array<{ title: string; uri: string }>>([]);
  const [isSearchingConcurso, setIsSearchingConcurso] = useState(false);
  const [isGeneratingPlano, setIsGeneratingPlano] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  // Stamp Celebration State
  const [stampCelebration, setStampCelebration] = useState<{
    isOpen: boolean;
    title: string;
    subtitle?: string;
    xpGained?: number;
    type?: 'homologado' | 'concluido' | 'meta_batida' | 'topico_concluido';
  }>({
    isOpen: false,
    title: 'HOMOLOGADO',
    subtitle: 'Meta atingida com sucesso!',
    xpGained: 50,
    type: 'homologado',
  });

  // Active Modals
  const [activeVideoModalDisc, setActiveVideoModalDisc] = useState<DisciplinaPlano | null>(null);
  const [activeQuestoesModalDisc, setActiveQuestoesModalDisc] = useState<DisciplinaPlano | null>(null);
  const [activeFlashcardsModalDisc, setActiveFlashcardsModalDisc] = useState<DisciplinaPlano | null>(null);
  const [isMentorChatOpen, setIsMentorChatOpen] = useState(false);
  const [isPomodoroOpen, setIsPomodoroOpen] = useState(false);
  const [isSavedPlansOpen, setIsSavedPlansOpen] = useState(false);

  // If we have an active plan already, start at step 4
  useEffect(() => {
    if (user && activePlan && currentStep === 2) {
      setCurrentStep(4);
    }
  }, []);

  const handleLogin = (newUser: UserProfile) => {
    saveStoredUser(newUser);
    setUser(newUser);
    if (activePlan) {
      setCurrentStep(4);
    } else {
      setCurrentStep(2);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('concurso_mentor_user');
    setUser(null);
    setCurrentStep(1);
  };

  const handleTriggerStamp = (title: string, subtitle?: string, xpGained: number = 35) => {
    // Add XP to user
    if (user) {
      const updatedUser: UserProfile = {
        ...user,
        xp: (user.xp || 350) + xpGained,
        questoesResolvidas: (user.questoesResolvidas || 0) + 1,
      };
      saveStoredUser(updatedUser);
      setUser(updatedUser);
    }

    setStampCelebration({
      isOpen: true,
      title,
      subtitle: subtitle || 'Protocolo de estudo registrado no Diário Oficial!',
      xpGained,
      type: title.includes('HOMOLOGADO')
        ? 'homologado'
        : title.includes('META')
        ? 'meta_batida'
        : 'topico_concluido',
    });
  };

  // Step 2 -> Step 3: Search contest details with grounding
  const handleSearchConcurso = async (concursoQuery: string, cargoExtra?: string) => {
    setIsSearchingConcurso(true);
    setGlobalError(null);

    try {
      const fullQuery = cargoExtra ? `${concursoQuery} ${cargoExtra}` : concursoQuery;
      const res = await fetch('/api/concurso/identificar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: fullQuery }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Não foi possível identificar o concurso informado.');
      }

      setConcursoIdentificado(json.data);
      setGroundingFontes(json.fontes || []);
      setCurrentStep(3);
    } catch (err: any) {
      console.error(err);
      setGlobalError(err.message || 'Erro ao conectar com o motor de busca.');
    } finally {
      setIsSearchingConcurso(false);
    }
  };

  // Step 3 -> Step 4: Confirm edital and generate full study plan
  const handleConfirmAndGeneratePlano = async (customParams?: { cargo?: string; banca?: string; ano?: string }) => {
    if (!concursoIdentificado) return;

    setIsGeneratingPlano(true);
    setGlobalError(null);

    const finalCargo = customParams?.cargo || concursoIdentificado.cargo;
    const finalBanca = customParams?.banca || concursoIdentificado.banca;
    const finalAno = customParams?.ano || concursoIdentificado.ano_edital;

    try {
      const dailyHours = user?.horasDiarias || (user?.horasSemana ? Math.round(user.horasSemana / 6) : 2);
      const weeklyHours = user?.horasSemana || (dailyHours * 6);

      const res = await fetch('/api/concurso/gerar-plano', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          concurso: concursoIdentificado.concurso_identificado || concursoIdentificado.orgao,
          cargo: finalCargo,
          banca: finalBanca,
          ano: finalAno,
          horasDiarias: dailyHours,
          horasSemana: weeklyHours,
          nivelAtual: user?.nivel || 'intermediario',
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success || !json.plano) {
        throw new Error(json.error || 'Erro ao processar as matérias do edital.');
      }

      const generatedPlano = json.plano;

      // Format disciplines ensuring IDs and proper order
      const formattedDisciplinas: DisciplinaPlano[] = (generatedPlano.disciplinas || []).map(
        (d: any, idx: number) => ({
          ...d,
          id: d.id || `disc_${idx}_${Date.now()}`,
          ordem_importancia: d.ordem_importancia || idx + 1,
          topicosConcluidos: [],
        })
      );

      const newPlan: PlanoEstudoCompleto = {
        id: 'plan_' + Date.now(),
        dataCriacao: new Date().toISOString(),
        concurso: generatedPlano.concurso || concursoIdentificado.concurso_identificado,
        cargo: generatedPlano.cargo || finalCargo || 'Geral',
        banca: generatedPlano.banca || finalBanca || 'Banca Oficial',
        ano_edital: generatedPlano.ano_edital || finalAno || 'Mais recente',
        resumo_edital: generatedPlano.resumo_edital,
        disciplinas: formattedDisciplinas,
        ciclo_sugerido: generatedPlano.ciclo_sugerido,
        mensagem_mentor: generatedPlano.mensagem_mentor,
        fontes: json.fontes || groundingFontes,
        horasDiariasPlanejadas: dailyHours,
        horasSemanaPlanejadas: weeklyHours,
      };

      savePlan(newPlan);
      setActivePlan(newPlan);
      setSavedPlans(getStoredPlans());
      setCurrentStep(4);
      setCurrentSection('trilha');

      // Trigger initial plan creation celebration
      handleTriggerStamp('EDITAL HOMOLOGADO', `Plano oficial estruturado para ${newPlan.concurso}`, 100);
    } catch (err: any) {
      console.error(err);
      setGlobalError(err.message || 'Erro ao montar o plano de estudos.');
    } finally {
      setIsGeneratingPlano(false);
    }
  };

  const handleUpdateActivePlan = (updatedPlan: PlanoEstudoCompleto) => {
    setActivePlan(updatedPlan);
    savePlan(updatedPlan);
    setSavedPlans(getStoredPlans());
  };

  const handleSelectSavedPlan = (plan: PlanoEstudoCompleto) => {
    setActivePlan(plan);
    setActivePlanId(plan.id);
    setCurrentStep(4);
    setCurrentSection('trilha');
  };

  const handleDeletePlan = (planId: string) => {
    deletePlan(planId);
    const remaining = getStoredPlans();
    setSavedPlans(remaining);
    if (activePlan?.id === planId) {
      if (remaining.length > 0) {
        setActivePlan(remaining[0]);
        setActivePlanId(remaining[0].id);
      } else {
        setActivePlan(null);
        setCurrentStep(2);
      }
    }
  };

  const handleNewPlan = () => {
    setConcursoIdentificado(null);
    setCurrentStep(2);
  };

  return (
    <div className="min-h-screen bg-[#EFF1EC] text-[#12213B] flex flex-col font-sans selection:bg-[#B8412C] selection:text-white">
      {/* Global Navigation Header with ConcursoXP Branding */}
      <AppNavigation
        user={user}
        activePlan={activePlan}
        savedPlansCount={savedPlans.length}
        currentSection={currentSection}
        onSelectSection={(sec) => {
          if (sec === 'tutor') {
            setIsMentorChatOpen(true);
          } else {
            setCurrentSection(sec);
            if (currentStep !== 4 && activePlan) {
              setCurrentStep(4);
            }
          }
        }}
        onOpenPomodoro={() => setIsPomodoroOpen(true)}
        onOpenSavedPlans={() => setIsSavedPlansOpen(true)}
        onNewPlan={handleNewPlan}
        onLogout={handleLogout}
      />

      {/* Global Error Banner */}
      {globalError && (
        <div className="max-w-4xl mx-auto px-4 mt-4 w-full">
          <div className="p-4 bg-[#B8412C]/10 border border-[#B8412C]/30 rounded-xl text-[#B8412C] text-xs flex items-center justify-between shadow-2xs font-mono font-bold">
            <span>{globalError}</span>
            <button
              onClick={() => setGlobalError(null)}
              className="text-[#B8412C] hover:text-[#9E3624] font-bold ml-3 cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 pb-24 md:pb-16">
        {/* Step 1: Login */}
        {currentStep === 1 && <Step1Login onLogin={handleLogin} />}

        {/* Step 2: Concurso Input */}
        {currentStep === 2 && user && (
          <Step2ConcursoInput
            user={user}
            onSearchConcurso={handleSearchConcurso}
            isLoading={isSearchingConcurso}
          />
        )}

        {/* Step 3: Edital Confirmation */}
        {currentStep === 3 && user && concursoIdentificado && (
          <Step3EditalConfirmation
            identificado={concursoIdentificado}
            fontes={groundingFontes}
            user={user}
            onConfirm={handleConfirmAndGeneratePlano}
            onBack={() => setCurrentStep(2)}
            isLoadingPlano={isGeneratingPlano}
          />
        )}

        {/* Step 4: Full App with Multi-Section Navigation */}
        {currentStep === 4 && user && activePlan && (
          <>
            {currentSection === 'trilha' && (
              <Step4PlanoEstudo
                plan={activePlan}
                onUpdatePlan={handleUpdateActivePlan}
                onOpenVideoModal={(d) => setActiveVideoModalDisc(d)}
                onOpenQuestoesModal={(d) => setActiveQuestoesModalDisc(d)}
                onOpenFlashcardsModal={(d) => setActiveFlashcardsModalDisc(d)}
                onOpenMentorChat={() => setIsMentorChatOpen(true)}
                onNewConcurso={handleNewPlan}
                onTriggerStamp={handleTriggerStamp}
              />
            )}

            {currentSection === 'revisoes' && (
              <RevisoesView
                plan={activePlan}
                onTriggerStamp={handleTriggerStamp}
                onOpenFlashcards={(d) => setActiveFlashcardsModalDisc(d)}
                onOpenQuestoes={(d) => setActiveQuestoesModalDisc(d)}
                onOpenFlashcardsModal={(d) => setActiveFlashcardsModalDisc(d)}
                onOpenQuestoesModal={(d) => setActiveQuestoesModalDisc(d)}
                onOpenPomodoro={() => setIsPomodoroOpen(true)}
                onOpenMentorChat={() => setIsMentorChatOpen(true)}
              />
            )}

            {currentSection === 'perfil' && (
              <PerfilView
                user={user}
                plan={activePlan}
                onTriggerCelebration={handleTriggerStamp}
              />
            )}
          </>
        )}
      </main>

      {/* Rubber Stamp Animated Celebration */}
      <StampCelebration
        isOpen={stampCelebration.isOpen}
        title={stampCelebration.title}
        subtitle={stampCelebration.subtitle}
        xpGained={stampCelebration.xpGained}
        type={stampCelebration.type}
        onClose={() => setStampCelebration((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Video Modal (Search YouTube / Direct) */}
      {activeVideoModalDisc && (
        <VideoPlayerModal
          disciplina={activeVideoModalDisc}
          onClose={() => setActiveVideoModalDisc(null)}
        />
      )}

      {/* Questoes & Quiz Modal */}
      {activeQuestoesModalDisc && (
        <QuestoesModal
          disciplina={activeQuestoesModalDisc}
          banca={activePlan?.banca || 'Oficial'}
          concurso={activePlan?.concurso || 'Concurso'}
          onClose={() => setActiveQuestoesModalDisc(null)}
        />
      )}

      {/* Flashcards Modal */}
      {activeFlashcardsModalDisc && (
        <FlashcardsModal
          disciplina={activeFlashcardsModalDisc}
          banca={activePlan?.banca || 'Oficial'}
          onClose={() => setActiveFlashcardsModalDisc(null)}
        />
      )}

      {/* Mentor AI Modal */}
      {isMentorChatOpen && (
        <MentorChatModal
          activePlan={activePlan}
          onClose={() => setIsMentorChatOpen(false)}
        />
      )}

      {/* Pomodoro Focus Modal */}
      {isPomodoroOpen && (
        <PomodoroModal
          onClose={() => setIsPomodoroOpen(false)}
          disciplinaNome={activePlan?.disciplinas?.[0]?.nome}
        />
      )}

      {/* Saved Plans Modal */}
      {isSavedPlansOpen && (
        <SavedPlansModal
          plans={savedPlans}
          activePlanId={activePlan?.id || null}
          onSelectPlan={handleSelectSavedPlan}
          onDeletePlan={handleDeletePlan}
          onNewPlan={handleNewPlan}
          onClose={() => setIsSavedPlansOpen(false)}
        />
      )}
    </div>
  );
}

