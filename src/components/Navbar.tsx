import React from 'react';
import { BookOpen, Sparkles, Clock, PlusCircle, Bookmark, CheckCircle2, Shield } from 'lucide-react';
import { UserProfile, PlanoEstudoCompleto } from '../types';

interface NavbarProps {
  user: UserProfile | null;
  activePlan: PlanoEstudoCompleto | null;
  savedPlansCount: number;
  currentStep: number;
  onNavigateStep: (step: number) => void;
  onOpenSavedPlans: () => void;
  onOpenPomodoro: () => void;
  onOpenMentorChat: () => void;
  onNewPlan: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  activePlan,
  savedPlansCount,
  currentStep,
  onNavigateStep,
  onOpenSavedPlans,
  onOpenPomodoro,
  onOpenMentorChat,
  onNewPlan,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#12213B] border-b border-[#1E355B] text-[#EFF1EC] shadow-sm select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-[76px] sm:min-h-[80px] py-2.5 sm:py-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Logo & Identity Block */}
          <div className="flex items-center gap-3 cursor-pointer group flex-shrink-0" onClick={() => onNavigateStep(user ? 2 : 1)}>
            <div className="w-10 h-10 rounded-xl bg-[#B8412C] text-white flex items-center justify-center font-serif text-lg font-black shadow-xs border border-[#F5C7BE]/30 flex-shrink-0 group-hover:bg-[#9E3624] transition-colors">
              XP
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-lg leading-none tracking-tight text-[#FBFAF7] group-hover:text-white transition-colors">
                  ConcursoXP
                </span>
                <span className="inline-flex items-center text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#B8862E]/20 text-[#F6E3B8] border border-[#B8862E]/40 leading-none">
                  Edital Oficial
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono tracking-tight mt-1 hidden sm:block leading-none">
                Sistema de Preparação & Diário de Estudos
              </p>
            </div>
          </div>

          {/* Stepper (Desktop) */}
          {user && (
            <nav aria-label="Progresso do fluxo de estudo" className="hidden md:flex items-center gap-2 bg-[#0D182B] px-3 py-1.5 rounded-xl border border-[#1E355B] text-xs font-mono">
              <button
                onClick={() => onNavigateStep(2)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  currentStep === 2
                    ? 'bg-[#FBFAF7] text-[#12213B] shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <span>1. Concurso</span>
              </button>
              <span className="text-slate-600 font-bold">›</span>
              <button
                disabled={!activePlan && currentStep < 3}
                onClick={() => onNavigateStep(3)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  currentStep === 3
                    ? 'bg-[#FBFAF7] text-[#12213B] shadow-xs'
                    : 'text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed'
                }`}
              >
                <span>2. Edital Grounding</span>
              </button>
              <span className="text-slate-600 font-bold">›</span>
              <button
                disabled={!activePlan}
                onClick={() => onNavigateStep(4)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  currentStep === 4
                    ? 'bg-[#FBFAF7] text-[#12213B] shadow-xs'
                    : 'text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1F6F4F]" />
                <span>3. Estudo Planejado</span>
              </button>
            </nav>
          )}

          {/* Quick Actions (Without Gamification Badges) */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {user ? (
              <>
                {/* Pomodoro Focus Button */}
                <button
                  id="btn-pomodoro"
                  onClick={onOpenPomodoro}
                  title="Temporizador Pomodoro & Ciclo de Estudos"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10 text-slate-200 text-xs font-mono font-medium transition-all cursor-pointer"
                >
                  <Clock className="w-4 h-4 text-[#1F6F4F]" />
                  <span className="hidden sm:inline">Pomodoro</span>
                </button>

                {/* Mentor AI Chat Button */}
                <button
                  id="btn-mentor-chat"
                  onClick={onOpenMentorChat}
                  title="Falar com o Tutor IA"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#B8862E]/20 hover:bg-[#B8862E]/30 border border-[#B8862E]/40 text-[#F6E3B8] text-xs font-mono font-bold transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#B8862E]" />
                  <span className="hidden sm:inline">Tutor IA</span>
                </button>

                {/* Saved Plans */}
                <button
                  id="btn-saved-plans"
                  onClick={onOpenSavedPlans}
                  title="Meus Editais Homologados"
                  className="relative p-2.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10 text-slate-200 text-xs transition-all cursor-pointer"
                >
                  <Bookmark className="w-4 h-4 text-[#B8862E]" />
                  {savedPlansCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#B8412C] text-white font-mono font-bold text-[10px] rounded-full flex items-center justify-center ring-2 ring-[#12213B]">
                      {savedPlansCount}
                    </span>
                  )}
                </button>

                {/* New Plan Button */}
                <button
                  id="btn-new-plan"
                  onClick={onNewPlan}
                  className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#B8412C] hover:bg-[#9E3624] text-white text-xs font-bold font-mono uppercase tracking-wider transition-all cursor-pointer shadow-xs"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Novo Edital</span>
                </button>

                {/* User Dropdown / Logout */}
                <div className="flex items-center gap-2 pl-3 border-l border-[#1E355B]">
                  <div className="flex items-center gap-2 text-xs text-slate-200">
                    <div className="w-8 h-8 rounded-full bg-[#FBFAF7] text-[#12213B] font-serif font-bold text-xs flex items-center justify-center border border-[#B8862E] shadow-2xs">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'C'}
                    </div>
                    <span className="hidden xl:inline font-mono font-medium max-w-[90px] truncate text-slate-200">{user.name}</span>
                  </div>
                  <button
                    onClick={onLogout}
                    className="text-slate-400 hover:text-rose-400 p-2 rounded-lg hover:bg-white/5 transition-colors font-mono cursor-pointer"
                    title="Sair da conta"
                  >
                    Sair
                  </button>
                </div>
              </>
            ) : (
              <div className="text-xs font-mono font-bold text-[#F6E3B8] bg-[#B8862E]/20 px-3 py-1.5 rounded-lg border border-[#B8862E]/40">
                Padrão Oficial de Concursos Públicos
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

