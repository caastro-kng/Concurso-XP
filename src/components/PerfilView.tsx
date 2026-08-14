import React from 'react';
import {
  UserProfile,
  PlanoEstudoCompleto,
  StampData,
} from '../types';
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  FileCheck,
  Flame,
  PlusCircle,
  Shield,
  Trash2,
  TrendingUp,
  User,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface PerfilViewProps {
  user: UserProfile;
  activePlan: PlanoEstudoCompleto | null;
  savedPlans: PlanoEstudoCompleto[];
  onSelectPlan: (plan: PlanoEstudoCompleto) => void;
  onDeletePlan: (planId: string) => void;
  onNewPlan: () => void;
  onTriggerStamp: (stamp: StampData) => void;
}

export const PerfilView: React.FC<PerfilViewProps> = ({
  user,
  activePlan,
  savedPlans,
  onSelectPlan,
  onDeletePlan,
  onNewPlan,
  onTriggerStamp,
}) => {
  const currentXp = user?.xp || 350;
  const currentStreak = user?.streakDias || 4;
  const userName = user?.name || 'Candidato';
  const protocolo = user?.protocoloOficial || `CXP-2026-${(userName.length * 137).toString().padStart(4, '0')}`;

  // XP Ranking / Escalões de Servidor
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

  // Stats from active plan
  const totalTopics = (activePlan?.disciplinas || []).reduce((acc, d) => acc + (d.topicos?.length || 0), 0);
  const completedTopics = (activePlan?.disciplinas || []).reduce((acc, d) => acc + (d.topicosConcluidos?.length || 0), 0);

  const handleTestStamp = () => {
    onTriggerStamp({
      id: 'test_' + Date.now(),
      title: 'HOMOLOGADO',
      subtitle: `Protocolo ${protocolo} • Certidão Válida`,
      colorTheme: 'vermelho',
      badgeType: 'aprovado',
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Official Certificate Header Banner */}
      <div className="bg-[#FBFAF7] border border-slate-300 rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        {/* Top watermark / Seal background */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5 mb-6">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-[#12213B] text-[#FBFAF7] flex items-center justify-center font-serif text-2xl font-black shadow-md border-2 border-[#B8862E]">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#12213B]/5 text-[#12213B] border border-slate-300">
                  {protocolo}
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#1F6F4F]/10 text-[#1F6F4F] border border-[#1F6F4F]/30">
                  Matrícula Ativa
                </span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#12213B] mt-1">
                {user.name}
              </h1>
              <p className="text-xs text-[#4B5563] font-mono">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleTestStamp}
              className="w-full sm:w-auto px-4 py-2 bg-[#B8412C] hover:bg-[#9E3624] text-white rounded-xl text-xs font-bold font-mono uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>Ver Selo Oficial</span>
            </button>
          </div>
        </div>

        {/* Gamification Stats: XP, Streak, Level, Protocol */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          {/* XP Total */}
          <div className="p-4 bg-white border border-slate-200 rounded-xl">
            <div className="flex items-center justify-between text-xs text-[#4B5563] mb-1">
              <span className="font-medium">XP de Concurso</span>
              <Award className="w-4 h-4 text-[#B8862E]" />
            </div>
            <div className="font-mono text-2xl font-bold text-[#B8862E]">
              {currentXp} <span className="text-xs font-sans text-slate-500 font-normal">XP</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Acumulado por estudo e metas</p>
          </div>

          {/* Daily Streak */}
          <div className="p-4 bg-white border border-slate-200 rounded-xl">
            <div className="flex items-center justify-between text-xs text-[#4B5563] mb-1">
              <span className="font-medium">Ofensiva Oficial</span>
              <Flame className="w-4 h-4 text-[#B8412C]" />
            </div>
            <div className="font-mono text-2xl font-bold text-[#B8412C]">
              {currentStreak} <span className="text-xs font-sans text-slate-500 font-normal">dias</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Estudo contínuo diário</p>
          </div>

          {/* Horas Diárias */}
          <div className="p-4 bg-white border border-slate-200 rounded-xl">
            <div className="flex items-center justify-between text-xs text-[#4B5563] mb-1">
              <span className="font-medium">Carga Diária</span>
              <Clock className="w-4 h-4 text-[#1F6F4F]" />
            </div>
            <div className="font-mono text-2xl font-bold text-[#1F6F4F]">
              {user.horasDiarias}h <span className="text-xs font-sans text-slate-500 font-normal">/dia</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">{user.horasDiarias * 6}h estimadas/semana</p>
          </div>

          {/* Tópicos Concluídos */}
          <div className="p-4 bg-white border border-slate-200 rounded-xl">
            <div className="flex items-center justify-between text-xs text-[#4B5563] mb-1">
              <span className="font-medium">Edital Lido</span>
              <CheckCircle2 className="w-4 h-4 text-[#12213B]" />
            </div>
            <div className="font-mono text-2xl font-bold text-[#12213B]">
              {completedTopics} <span className="text-xs font-sans text-slate-500 font-normal">/ {totalTopics}</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Tópicos homologados</p>
          </div>
        </div>

        {/* Level Progression Progress Bar */}
        <div className="mt-5 p-4 bg-white border border-slate-200 rounded-xl">
          <div className="flex items-center justify-between text-xs mb-2">
            <div className="flex items-center gap-2">
              <span className="text-base">{rankingLevel.badge}</span>
              <strong className="font-serif text-[#12213B] font-bold text-sm">
                Escalão: {rankingLevel.title}
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
      </div>

      {/* Official Badges / Selos Conquistados */}
      <div className="bg-[#FBFAF7] border border-slate-300 rounded-2xl p-6 sm:p-8 shadow-sm">
        <h2 className="font-serif text-xl font-bold text-[#12213B] mb-2 flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#B8862E]" />
          Selos de Homologação Conquistados
        </h2>
        <p className="text-xs text-[#4B5563] mb-5">
          Conquistas desbloqueadas durante a preparação estratégica de editais.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="p-4 bg-white border border-[#1F6F4F]/30 rounded-xl flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1F6F4F]/10 text-[#1F6F4F] flex items-center justify-center flex-shrink-0 font-bold text-lg border border-[#1F6F4F]/30">
              ✓
            </div>
            <div>
              <h4 className="font-bold text-xs text-[#12213B]">Edital Localizado</h4>
              <p className="text-[11px] text-[#4B5563] mt-0.5">Grounding oficial indexado com sucesso.</p>
              <span className="text-[9px] font-mono text-[#1F6F4F] font-bold uppercase mt-1 inline-block">Conquistado</span>
            </div>
          </div>

          <div className="p-4 bg-white border border-[#B8862E]/30 rounded-xl flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#B8862E]/10 text-[#B8862E] flex items-center justify-center flex-shrink-0 font-bold text-lg border border-[#B8862E]/30">
              ★
            </div>
            <div>
              <h4 className="font-bold text-xs text-[#12213B]">Peso Estratégico</h4>
              <p className="text-[11px] text-[#4B5563] mt-0.5">Matérias ordenadas da mais importante à menor.</p>
              <span className="text-[9px] font-mono text-[#B8862E] font-bold uppercase mt-1 inline-block">Conquistado</span>
            </div>
          </div>

          <div className="p-4 bg-white border border-[#B8412C]/30 rounded-xl flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#B8412C]/10 text-[#B8412C] flex items-center justify-center flex-shrink-0 font-bold text-lg border border-[#B8412C]/30">
              🔥
            </div>
            <div>
              <h4 className="font-bold text-xs text-[#12213B]">Ofensiva de 3 Dias</h4>
              <p className="text-[11px] text-[#4B5563] mt-0.5">Consistência sem interrupções.</p>
              <span className="text-[9px] font-mono text-[#B8412C] font-bold uppercase mt-1 inline-block">Conquistado</span>
            </div>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-xl opacity-75 flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center flex-shrink-0 font-bold text-lg border border-slate-200">
              🏛️
            </div>
            <div>
              <h4 className="font-bold text-xs text-slate-600">Gabarito 100%</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Conclua todos os tópicos de uma matéria de peso alto.</p>
              <span className="text-[9px] font-mono text-slate-400 font-bold uppercase mt-1 inline-block">Bloqueado</span>
            </div>
          </div>
        </div>
      </div>

      {/* Saved Contests & Plans List */}
      <div className="bg-[#FBFAF7] border border-slate-300 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-serif text-xl font-bold text-[#12213B] flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#12213B]" />
              Editais e Planos Cadastrados
            </h2>
            <p className="text-xs text-[#4B5563] mt-0.5">
              Alterne entre seus concursos cadastrados ou inicie uma nova homologação.
            </p>
          </div>

          <button
            onClick={onNewPlan}
            className="px-3.5 py-2 bg-[#12213B] hover:bg-[#1E355B] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Novo Concurso</span>
          </button>
        </div>

        {savedPlans.length === 0 ? (
          <div className="p-8 text-center bg-white border border-slate-200 rounded-xl">
            <FileCheck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">Nenhum concurso adicional salvo.</p>
            <p className="text-xs text-slate-500 mt-1">Adicione novos editais para acompanhar múltiplos concursos.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {savedPlans.map((p) => {
              const isActive = activePlan?.id === p.id;
              const discList = p.disciplinas || [];
              const pTopics = discList.reduce((acc, d) => acc + (d.topicos?.length || 0), 0);
              const pDone = discList.reduce((acc, d) => acc + (d.topicosConcluidos?.length || 0), 0);
              const pPercent = pTopics > 0 ? Math.round((pDone / pTopics) * 100) : 0;

              return (
                <div
                  key={p.id}
                  className={`p-4 bg-white border rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${
                    isActive
                      ? 'border-[#1F6F4F] ring-2 ring-[#1F6F4F]/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {isActive && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#1F6F4F]/10 text-[#1F6F4F] uppercase">
                          Plano Ativo
                        </span>
                      )}
                      <span className="text-xs font-mono font-bold text-slate-600">
                        Banca: {p.banca}
                      </span>
                    </div>
                    <h3 className="font-serif text-base font-bold text-[#12213B]">
                      {p.concurso} • <span className="font-sans text-sm font-medium text-slate-600">{p.cargo}</span>
                    </h3>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500 font-mono">
                      <span>{discList.length} matérias</span>
                      <span>•</span>
                      <span>Progresso: {pPercent}%</span>
                      <span>•</span>
                      <span>{p.horasDiariasPlanejadas || 2}h diárias</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {!isActive ? (
                      <button
                        onClick={() => onSelectPlan(p)}
                        className="flex-1 sm:flex-none px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                      >
                        Ativar Este Plano
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-[#1F6F4F] flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Em andamento
                      </span>
                    )}

                    <button
                      onClick={() => onDeletePlan(p.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Excluir plano"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
