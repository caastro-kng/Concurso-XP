import React from 'react';
import {
  BookOpen,
  Layers,
  Sparkles,
  Clock,
  PlusCircle,
  Bookmark,
  LogOut,
  User as UserIcon,
} from 'lucide-react';
import { UserProfile, PlanoEstudoCompleto, MainAppSection } from '../types';

interface AppNavigationProps {
  user: UserProfile | null;
  activePlan: PlanoEstudoCompleto | null;
  savedPlansCount: number;
  currentSection: MainAppSection;
  onSelectSection: (section: MainAppSection) => void;
  onOpenPomodoro: () => void;
  onOpenSavedPlans: () => void;
  onOpenUserProfile: () => void;
  onNewPlan: () => void;
  onLogout: () => void;
}

export const AppNavigation: React.FC<AppNavigationProps> = ({
  user,
  activePlan,
  savedPlansCount,
  currentSection,
  onSelectSection,
  onOpenPomodoro,
  onOpenSavedPlans,
  onOpenUserProfile,
  onNewPlan,
  onLogout,
}) => {
  const userName = user?.name || 'Candidato';
  const protocolo = user?.protocoloOficial || `CXP-2026-${(userName.length * 137).toString().padStart(4, '0')}`;

  return (
    <>
      {/* Top Header (Institutional Document Bar) - Sized generously to accommodate active menu items with comfortable spacing */}
      <header className="sticky top-0 z-40 bg-[#12213B] border-b border-[#1E355B] text-[#FBFAF7] shadow-md select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between min-h-[84px] py-3.5 sm:py-4 gap-4 sm:gap-6 lg:gap-8">
            {/* Bloco 1: Identidade (Logo ConcursoXP + Selo Edital Oficial perfeitamente alinhados) */}
            <div
              className="flex items-center gap-3 cursor-pointer group flex-shrink-0"
              onClick={() => onSelectSection('trilha')}
              title="Ir para a Trilha do Edital"
            >
              <div className="w-11 h-11 rounded-xl bg-[#B8412C] text-white flex items-center justify-center font-serif text-xl font-black shadow-sm border border-[#F5C7BE]/30 flex-shrink-0 group-hover:bg-[#9E3624] transition-colors">
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
                <p className="text-[11px] text-slate-400 font-mono tracking-tight mt-1.5 hidden sm:block leading-none">
                  Sistema de Preparação & Diário de Estudos
                </p>
              </div>
            </div>

            {/* Bloco 2: Navegação Principal Central (3 seções principais com espaçamento confortável) */}
            {user && (
              <nav
                aria-label="Navegação Principal do Sistema"
                className="hidden md:flex items-center gap-1.5 lg:gap-2 bg-[#0D182B] p-1.5 rounded-2xl border border-[#1E355B]"
              >
                <button
                  id="nav-trilha-desktop"
                  onClick={() => onSelectSection('trilha')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold tracking-normal transition-all flex items-center gap-2 cursor-pointer ${
                    currentSection === 'trilha'
                      ? 'bg-[#FBFAF7] text-[#12213B] shadow-sm font-bold ring-1 ring-white/20'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <BookOpen className="w-4 h-4 text-[#B8412C] flex-shrink-0" />
                  <span>Trilha do Edital</span>
                </button>

                <button
                  id="nav-revisoes-desktop"
                  onClick={() => onSelectSection('revisoes')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold tracking-normal transition-all flex items-center gap-2 cursor-pointer ${
                    currentSection === 'revisoes'
                      ? 'bg-[#FBFAF7] text-[#12213B] shadow-sm font-bold ring-1 ring-white/20'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Layers className="w-4 h-4 text-[#B8862E] flex-shrink-0" />
                  <span>Revisões & Ciclos</span>
                </button>

                <button
                  id="nav-tutor-desktop"
                  onClick={() => onSelectSection('tutor')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold tracking-normal transition-all flex items-center gap-2 cursor-pointer ${
                    currentSection === 'tutor'
                      ? 'bg-[#FBFAF7] text-[#12213B] shadow-sm font-bold ring-1 ring-white/20'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-[#1F6F4F] flex-shrink-0" />
                  <span>Tutor AI</span>
                </button>
              </nav>
            )}

            {/* Bloco 3: Ações e Utilidades (Pomodoro, Salvos, Novo Edital, Menu de Usuário) */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              {user ? (
                <>
                  {/* Cronômetro Pomodoro */}
                  <button
                    id="btn-pomodoro"
                    onClick={onOpenPomodoro}
                    title="Cronômetro Pomodoro de Estudos"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-slate-200 text-xs font-mono font-medium transition-all cursor-pointer"
                  >
                    <Clock className="w-4 h-4 text-[#1F6F4F]" />
                    <span className="hidden sm:inline">Pomodoro</span>
                  </button>

                  {/* Meus Editais Salvos */}
                  <button
                    id="btn-saved-plans"
                    onClick={onOpenSavedPlans}
                    title="Meus Editais Homologados"
                    className="relative p-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-slate-200 text-xs transition-all cursor-pointer"
                  >
                    <Bookmark className="w-4 h-4 text-[#B8862E]" />
                    {savedPlansCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#B8412C] text-white font-mono font-bold text-[10px] rounded-full flex items-center justify-center ring-2 ring-[#12213B]">
                        {savedPlansCount}
                      </span>
                    )}
                  </button>

                  {/* Botão Novo Edital */}
                  <button
                    id="btn-new-plan"
                    onClick={onNewPlan}
                    className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#B8412C] hover:bg-[#9E3624] text-white text-xs font-bold font-mono uppercase tracking-wider transition-all cursor-pointer shadow-xs"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Novo Edital</span>
                  </button>

                  {/* Menu do Usuário no Canto Superior Direito */}
                  <div className="flex items-center gap-2 pl-3 border-l border-[#1E355B]">
                    <button
                      id="btn-user-profile-menu"
                      onClick={onOpenUserProfile}
                      className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-white/10 text-xs text-slate-200 hover:text-white cursor-pointer group transition-all"
                      title="Ver Certidão & Perfil do Concurseiro"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#FBFAF7] text-[#12213B] font-serif font-bold text-xs flex items-center justify-center border border-[#B8862E] shadow-2xs group-hover:scale-105 transition-transform">
                        {userName.charAt(0).toUpperCase()}
                      </div>
                      <div className="hidden xl:flex flex-col text-left">
                        <span className="font-serif font-bold text-xs text-slate-100 group-hover:text-white max-w-[100px] truncate leading-tight">
                          {userName.split(' ')[0]}
                        </span>
                        <span className="text-[10px] font-mono text-[#F6E3B8] leading-tight">
                          {user.xp || 350} XP
                        </span>
                      </div>
                    </button>

                    <button
                      onClick={onLogout}
                      title="Sair da conta"
                      className="text-slate-400 hover:text-rose-400 p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-xs font-mono font-bold text-[#F6E3B8] bg-[#B8862E]/20 px-3 py-1.5 rounded-lg border border-[#B8862E]/40">
                  Acesso Institucional
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Fixed Bottom Navigation Bar (3 principal sections) */}
      {user && (
        <nav
          aria-label="Barra de Navegação Inferior Mobile"
          className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FBFAF7] border-t border-slate-300 shadow-lg px-3 py-2 select-none no-print"
        >
          <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
            <button
              id="mobile-nav-trilha"
              onClick={() => onSelectSection('trilha')}
              className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all ${
                currentSection === 'trilha'
                  ? 'text-[#B8412C] font-bold bg-[#B8412C]/10'
                  : 'text-[#4B5563] hover:text-[#12213B]'
              }`}
            >
              <BookOpen className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] font-mono tracking-tight font-bold">Trilha</span>
            </button>

            <button
              id="mobile-nav-revisoes"
              onClick={() => onSelectSection('revisoes')}
              className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all ${
                currentSection === 'revisoes'
                  ? 'text-[#B8862E] font-bold bg-[#B8862E]/10'
                  : 'text-[#4B5563] hover:text-[#12213B]'
              }`}
            >
              <Layers className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] font-mono tracking-tight font-bold">Revisões</span>
            </button>

            <button
              id="mobile-nav-tutor"
              onClick={() => onSelectSection('tutor')}
              className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all ${
                currentSection === 'tutor'
                  ? 'text-[#1F6F4F] font-bold bg-[#1F6F4F]/10'
                  : 'text-[#4B5563] hover:text-[#12213B]'
              }`}
            >
              <Sparkles className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] font-mono tracking-tight font-bold">Tutor AI</span>
            </button>
          </div>
        </nav>
      )}
    </>
  );
};
