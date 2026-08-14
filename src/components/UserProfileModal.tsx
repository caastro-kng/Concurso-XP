import React from 'react';
import {
  X,
  User,
  Shield,
  Award,
  Flame,
  Clock,
  CheckCircle2,
  Bookmark,
  LogOut,
  PlusCircle,
  Trash2,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { UserProfile, PlanoEstudoCompleto, StampData } from '../types';

interface UserProfileModalProps {
  user: UserProfile;
  activePlan: PlanoEstudoCompleto | null;
  savedPlans: PlanoEstudoCompleto[];
  onClose: () => void;
  onSelectPlan: (plan: PlanoEstudoCompleto) => void;
  onDeletePlan: (planId: string) => void;
  onNewPlan: () => void;
  onLogout: () => void;
  onTriggerStamp?: (title: string, subtitle?: string, xpGained?: number) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  user,
  activePlan,
  savedPlans,
  onClose,
  onSelectPlan,
  onDeletePlan,
  onNewPlan,
  onLogout,
  onTriggerStamp,
}) => {
  const currentXp = user?.xp || 350;
  const currentStreak = user?.streakDias || 4;
  const userName = user?.name || 'Candidato';
  const protocolo = user?.protocoloOficial || `CXP-2026-${(userName.length * 137).toString().padStart(4, '0')}`;

  const rankingLevel =
    currentXp >= 1500
      ? { title: 'Gabinete de Posse (Nível 4)', next: 2500, min: 1500, badge: '👑' }
      : currentXp >= 800
      ? { title: 'Especialista em Banca (Nível 3)', next: 1500, min: 800, badge: '🏛️' }
      : currentXp >= 300
      ? { title: 'Candidato Competitivo (Nível 2)', next: 800, min: 300, badge: '⚡' }
      : { title: 'Aspirante a Servidor (Nível 1)', next: 300, min: 0, badge: '🌱' };

  const progressPercent = Math.min(
    100,
    Math.round(((currentXp - rankingLevel.min) / (rankingLevel.next - rankingLevel.min)) * 100)
  );

  const totalTopics = (activePlan?.disciplinas || []).reduce((acc, d) => acc + (d.topicos?.length || 0), 0);
  const completedTopics = (activePlan?.disciplinas || []).reduce((acc, d) => acc + (d.topicosConcluidos?.length || 0), 0);

  const handleTestStamp = () => {
    if (onTriggerStamp) {
      onTriggerStamp('HOMOLOGADO', `Protocolo ${protocolo} • Certidão Válida`, 50);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#12213B]/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#FBFAF7] border border-slate-300 rounded-3xl shadow-2xl overflow-hidden my-6 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#12213B] border-b border-[#1E355B] text-[#FBFAF7]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#B8412C] text-white flex items-center justify-center font-serif text-lg font-bold border border-[#F5C7BE]/30">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-base font-bold text-white">
                  Certidão & Perfil do Concurseiro
                </h3>
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-[#B8862E]/20 text-[#F6E3B8] border border-[#B8862E]/40">
                  {protocolo}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-mono">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Quick Level & XP Banner */}
          <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-2xs">
            <div className="flex items-center justify-between text-xs mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">{rankingLevel.badge}</span>
                <strong className="font-serif text-[#12213B] font-bold text-sm">
                  {rankingLevel.title}
                </strong>
              </div>
              <span className="font-mono text-xs text-[#B8862E] font-bold">
                {currentXp} / {rankingLevel.next} XP ({progressPercent}%)
              </span>
            </div>

            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <div
                className="h-full bg-gradient-to-r from-[#B8862E] to-[#1F6F4F] transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Gamification Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-white border border-slate-200 rounded-xl text-center">
              <div className="flex items-center justify-center text-xs text-[#4B5563] mb-1 gap-1">
                <Award className="w-3.5 h-3.5 text-[#B8862E]" />
                <span className="font-medium">XP Total</span>
              </div>
              <div className="font-mono text-xl font-bold text-[#B8862E]">
                {currentXp}
              </div>
            </div>

            <div className="p-3.5 bg-white border border-slate-200 rounded-xl text-center">
              <div className="flex items-center justify-center text-xs text-[#4B5563] mb-1 gap-1">
                <Flame className="w-3.5 h-3.5 text-[#B8412C]" />
                <span className="font-medium">Ofensiva</span>
              </div>
              <div className="font-mono text-xl font-bold text-[#B8412C]">
                {currentStreak} <span className="text-xs font-normal">dias</span>
              </div>
            </div>

            <div className="p-3.5 bg-white border border-slate-200 rounded-xl text-center">
              <div className="flex items-center justify-center text-xs text-[#4B5563] mb-1 gap-1">
                <Clock className="w-3.5 h-3.5 text-[#1F6F4F]" />
                <span className="font-medium">Meta Diária</span>
              </div>
              <div className="font-mono text-xl font-bold text-[#1F6F4F]">
                {user.horasDiarias}h <span className="text-xs font-normal">/dia</span>
              </div>
            </div>

            <div className="p-3.5 bg-white border border-slate-200 rounded-xl text-center">
              <div className="flex items-center justify-center text-xs text-[#4B5563] mb-1 gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#12213B]" />
                <span className="font-medium">Tópicos</span>
              </div>
              <div className="font-mono text-xl font-bold text-[#12213B]">
                {completedTopics}/{totalTopics}
              </div>
            </div>
          </div>

          {/* Test Rubber Stamp */}
          <div className="p-4 bg-[#1F6F4F]/10 border border-[#1F6F4F]/30 rounded-2xl flex items-center justify-between gap-4">
            <div>
              <h4 className="font-serif font-bold text-xs sm:text-sm text-[#12213B]">
                Selo Oficial de Homologação
              </h4>
              <p className="text-[11px] text-[#4B5563] mt-0.5">
                Valide seus avanços com a animação de carimbo no Diário Oficial.
              </p>
            </div>
            <button
              onClick={handleTestStamp}
              className="px-3.5 py-2 bg-[#1F6F4F] hover:bg-[#18593F] text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs transition-all cursor-pointer flex-shrink-0"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Ver Selo</span>
            </button>
          </div>

          {/* Saved Plans List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-serif text-sm font-bold text-[#12213B] flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-[#B8862E]" />
                Meus Editais e Concursos ({savedPlans.length})
              </h4>
              <button
                onClick={() => {
                  onClose();
                  onNewPlan();
                }}
                className="text-xs font-mono font-bold text-[#B8412C] hover:text-[#9E3624] flex items-center gap-1 cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Novo Concurso</span>
              </button>
            </div>

            {savedPlans.length === 0 ? (
              <p className="text-xs text-slate-500 italic p-3 bg-white border border-slate-200 rounded-xl">
                Nenhum concurso adicional salvo no momento.
              </p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {savedPlans.map((p) => {
                  const isActive = activePlan?.id === p.id;
                  return (
                    <div
                      key={p.id}
                      className={`p-3 bg-white border rounded-xl flex items-center justify-between gap-3 text-xs ${
                        isActive
                          ? 'border-[#1F6F4F] ring-1 ring-[#1F6F4F]/20'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#12213B] truncate">{p.concurso}</span>
                          {isActive && (
                            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#1F6F4F]/10 text-[#1F6F4F] uppercase">
                              Ativo
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 font-mono truncate">
                          {p.cargo} • Banca {p.banca}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {!isActive && (
                          <button
                            onClick={() => {
                              onSelectPlan(p);
                              onClose();
                            }}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-[11px] font-bold cursor-pointer"
                          >
                            Ativar
                          </button>
                        )}
                        <button
                          onClick={() => onDeletePlan(p.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                          title="Excluir plano"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100/80 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onLogout();
            }}
            className="px-4 py-2 bg-white hover:bg-rose-50 border border-slate-300 hover:border-rose-300 text-rose-600 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Encerrar Sessão</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#12213B] hover:bg-[#1E355B] text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
