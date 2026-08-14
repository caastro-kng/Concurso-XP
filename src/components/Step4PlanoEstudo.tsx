import React, { useState } from 'react';
import {
  Award,
  BookOpen,
  CheckCircle2,
  Circle,
  ExternalLink,
  Flame,
  HelpCircle,
  Layers,
  ListOrdered,
  Play,
  Printer,
  Search,
  Sparkles,
  Target,
  Video,
  Clock,
  ChevronDown,
  ChevronUp,
  Filter,
  Check,
  Calendar,
  Share2,
  ShieldCheck,
  Scale,
  Feather,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PlanoEstudoCompleto, DisciplinaPlano, StampData } from '../types';
import { extractYouTubeId, getYouTubeThumbnail, getYouTubeSearchUrl } from '../lib/youtubeHelper';
import { CicloEstudosView } from './CicloEstudosView';

interface Step4PlanoEstudoProps {
  plan: PlanoEstudoCompleto;
  onUpdatePlan: (updatedPlan: PlanoEstudoCompleto) => void;
  onOpenVideoModal: (disciplina: DisciplinaPlano) => void;
  onOpenQuestoesModal: (disciplina: DisciplinaPlano) => void;
  onOpenFlashcardsModal: (disciplina: DisciplinaPlano) => void;
  onOpenMentorChat: () => void;
  onNewConcurso: () => void;
  onTriggerStamp?: (stamp: StampData) => void;
}

export const Step4PlanoEstudo: React.FC<Step4PlanoEstudoProps> = ({
  plan,
  onUpdatePlan,
  onOpenVideoModal,
  onOpenQuestoesModal,
  onOpenFlashcardsModal,
  onOpenMentorChat,
  onNewConcurso,
  onTriggerStamp,
}) => {
  const [activeTab, setActiveTab] = useState<'materias' | 'ciclo'>('materias');
  const [filterPeso, setFilterPeso] = useState<'todos' | 'alto' | 'medio' | 'baixo'>('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const disciplinasList = plan?.disciplinas || [];

  const [expandedDisciplinas, setExpandedDisciplinas] = useState<Record<string, boolean>>(() => {
    // Open the first two high weight subjects by default
    const initial: Record<string, boolean> = {};
    if (disciplinasList.length > 0) {
      initial[disciplinasList[0].id || '0'] = true;
      if (disciplinasList.length > 1) {
        initial[disciplinasList[1].id || '1'] = true;
      }
    }
    return initial;
  });

  // Calculate global topics completed
  const totalTopics = disciplinasList.reduce((acc, d) => acc + (d.topicos?.length || 0), 0);
  const completedTopics = disciplinasList.reduce(
    (acc, d) => acc + (d.topicosConcluidos?.length || 0),
    0
  );
  const globalProgress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  const toggleExpand = (id: string) => {
    setExpandedDisciplinas((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleToggleTopic = (disciplinaIndex: number, topicoText: string) => {
    const updatedDisciplinas = [...disciplinasList];
    const targetDisc = { ...updatedDisciplinas[disciplinaIndex] };
    const currentCompleted = targetDisc.topicosConcluidos || [];
    const targetTopicos = targetDisc.topicos || [];

    if (currentCompleted.includes(topicoText)) {
      targetDisc.topicosConcluidos = currentCompleted.filter((t) => t !== topicoText);
    } else {
      targetDisc.topicosConcluidos = [...currentCompleted, topicoText];
      
      // Trigger signature stamp celebration when finishing entire subject or milestones
      if (targetDisc.topicosConcluidos.length === targetTopicos.length && targetTopicos.length > 0) {
        if (onTriggerStamp) {
          onTriggerStamp({
            id: 'disc_' + targetDisc.id + '_' + Date.now(),
            title: 'HOMOLOGADO',
            subtitle: `${targetDisc.nome} • 100% Concluído (+150 XP)`,
            colorTheme: targetDisc.peso === 'alto' ? 'vermelho' : 'dourado',
            badgeType: 'aprovado',
          });
        }
        try {
          confetti({
            particleCount: 60,
            spread: 80,
            origin: { y: 0.6 },
          });
        } catch (e) {
          // ignore
        }
      } else if (onTriggerStamp && targetDisc.topicosConcluidos.length % 3 === 0) {
        onTriggerStamp({
          id: 'topic_' + Date.now(),
          title: 'DEFERIDO',
          subtitle: `Tópico Validado • +25 XP`,
          colorTheme: 'verde',
          badgeType: 'deferido',
        });
      }
    }

    updatedDisciplinas[disciplinaIndex] = targetDisc;
    onUpdatePlan({ ...plan, disciplinas: updatedDisciplinas });
  };

  // Filter and ensure strict sort by importance
  const filteredDisciplinas = disciplinasList
    .filter((d) => {
      if (filterPeso !== 'todos' && d.peso !== filterPeso) return false;
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        return (
          d.nome.toLowerCase().includes(query) ||
          d.topicos?.some((t) => t.toLowerCase().includes(query))
        );
      }
      return true;
    })
    .sort((a, b) => (a.ordem_importancia || 0) - (b.ordem_importancia || 0));

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Top Banner with Contest Overview */}
      <div className="bg-[#FBFAF7] border border-slate-300 rounded-2xl shadow-sm p-6 sm:p-8 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#12213B]/10 text-[#12213B] border border-slate-300">
                Plano de Estudo Oficial
              </span>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-white text-[#B8412C] border border-slate-300">
                Banca: {plan.banca}
              </span>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-white text-[#4B5563] border border-slate-300">
                Edital: {plan.ano_edital || 'Vigente'}
              </span>
            </div>

            <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#12213B] tracking-tight">
              {plan.concurso}
            </h1>
            <p className="text-xs sm:text-sm text-[#4B5563] mt-1 font-mono">
              Cargo em Foco: <span className="text-[#12213B] font-bold font-sans">{plan.cargo || 'Geral'}</span>
            </p>

            {plan.mensagem_mentor && (
              <p className="text-xs sm:text-sm text-[#12213B] mt-3 max-w-3xl leading-relaxed italic bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                "{plan.mensagem_mentor}"
              </p>
            )}
          </div>

          {/* Progress Box */}
          <div className="bg-white border border-slate-300 p-5 rounded-2xl flex flex-col justify-between min-w-[240px] shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-[#12213B] uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-4 h-4 text-[#1F6F4F]" />
                Progresso no Edital
              </span>
              <span className="text-lg font-mono font-bold text-[#1F6F4F]">{globalProgress}%</span>
            </div>

            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-2 border border-slate-200">
              <div
                className="h-full bg-[#1F6F4F] rounded-full transition-all duration-500"
                style={{ width: `${globalProgress}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#4B5563] font-mono">
              <span>{completedTopics} de {totalTopics} tópicos homologados</span>
              <span>{disciplinasList.length} matérias</span>
            </div>
          </div>
        </div>

        {/* Quick Highlights of Edital */}
        {plan.resumo_edital && (
          <div className="mt-6 pt-5 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            {plan.resumo_edital.salario_inicial && (
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-[#4B5563] block text-[10px] uppercase font-mono font-bold">Remuneração</span>
                <span className="text-[#1F6F4F] font-bold text-sm font-mono">{plan.resumo_edital.salario_inicial}</span>
              </div>
            )}
            {plan.resumo_edital.total_vagas && (
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-[#4B5563] block text-[10px] uppercase font-mono font-bold">Vagas Previstas</span>
                <span className="text-[#12213B] font-bold text-sm font-mono">{plan.resumo_edital.total_vagas}</span>
              </div>
            )}
            {plan.resumo_edital.estrutura_prova && (
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-[#4B5563] block text-[10px] uppercase font-mono font-bold">Formato da Prova</span>
                <span className="text-[#12213B] font-bold text-xs line-clamp-1">{plan.resumo_edital.estrutura_prova}</span>
              </div>
            )}
            {plan.resumo_edital.escolaridade && (
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-[#4B5563] block text-[10px] uppercase font-mono font-bold">Escolaridade</span>
                <span className="text-[#12213B] font-bold text-xs line-clamp-1">{plan.resumo_edital.escolaridade}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tabs and Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 bg-[#FBFAF7] p-1.5 rounded-xl border border-slate-300 shadow-2xs">
          <button
            onClick={() => setActiveTab('materias')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'materias'
                ? 'bg-[#12213B] text-white shadow-sm'
                : 'text-[#4B5563] hover:text-[#12213B]'
            }`}
          >
            <ListOrdered className="w-4 h-4 text-[#B8412C]" />
            <span>Matérias por Peso ({disciplinasList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('ciclo')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'ciclo'
                ? 'bg-[#12213B] text-white shadow-sm'
                : 'text-[#4B5563] hover:text-[#12213B]'
            }`}
          >
            <Calendar className="w-4 h-4 text-[#B8862E]" />
            <span>Ciclo Semanal</span>
          </button>
        </div>

        {/* Global Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenMentorChat}
            className="px-3.5 py-2 bg-[#FBFAF7] hover:bg-white border border-slate-300 text-[#12213B] text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#B8862E]" />
            <span>Tirar Dúvida com Tutor AI</span>
          </button>

          <button
            onClick={handlePrint}
            title="Imprimir ou Salvar em PDF"
            className="p-2 bg-[#FBFAF7] hover:bg-white border border-slate-300 text-[#12213B] text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
          >
            <Printer className="w-4 h-4 text-[#4B5563]" />
            <span className="hidden sm:inline font-mono">Imprimir</span>
          </button>
        </div>
      </div>

      {activeTab === 'ciclo' ? (
        <CicloEstudosView
          plan={plan}
          onOpenQuestoes={onOpenQuestoesModal}
          onOpenFlashcards={onOpenFlashcardsModal}
        />
      ) : (
        <>
          {/* Filters Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#FBFAF7] p-4 sm:p-5 rounded-2xl border border-slate-300 shadow-2xs">
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              <span className="text-xs sm:text-sm font-mono font-bold text-[#4B5563] mr-1 flex items-center gap-1.5">
                <Filter className="w-4 h-4 text-[#12213B]" />
                Filtrar Peso:
              </span>
              {[
                {
                  id: 'todos',
                  label: 'Todas',
                  icon: <Layers className="w-4 h-4" />,
                  activeClasses: 'bg-[#12213B] text-white border-[#12213B] shadow-xs',
                  inactiveClasses: 'bg-white border-slate-300 text-[#4B5563] hover:text-[#12213B] hover:border-slate-400',
                  iconColor: 'text-[#12213B]',
                },
                {
                  id: 'alto',
                  label: 'Peso Alto',
                  icon: <Flame className="w-4 h-4" />,
                  activeClasses: 'bg-[#B8412C] text-white border-[#B8412C] shadow-xs',
                  inactiveClasses: 'bg-white border-slate-300 text-[#4B5563] hover:text-[#B8412C] hover:border-[#B8412C]/50',
                  iconColor: 'text-[#B8412C]',
                },
                {
                  id: 'medio',
                  label: 'Peso Médio',
                  icon: <Scale className="w-4 h-4" />,
                  activeClasses: 'bg-[#B8862E] text-white border-[#B8862E] shadow-xs',
                  inactiveClasses: 'bg-white border-slate-300 text-[#4B5563] hover:text-[#B8862E] hover:border-[#B8862E]/50',
                  iconColor: 'text-[#B8862E]',
                },
                {
                  id: 'baixo',
                  label: 'Peso Baixo',
                  icon: <Feather className="w-4 h-4" />,
                  activeClasses: 'bg-[#1F6F4F] text-white border-[#1F6F4F] shadow-xs',
                  inactiveClasses: 'bg-white border-slate-300 text-[#4B5563] hover:text-[#1F6F4F] hover:border-[#1F6F4F]/50',
                  iconColor: 'text-[#1F6F4F]',
                },
              ].map((filter) => {
                const isActive = filterPeso === filter.id;
                return (
                  <button
                    key={filter.id}
                    onClick={() => setFilterPeso(filter.id as any)}
                    className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-mono font-bold tracking-tight transition-all flex items-center gap-2 cursor-pointer border ${
                      isActive ? filter.activeClasses : filter.inactiveClasses
                    }`}
                  >
                    <span className={isActive ? 'text-white' : filter.iconColor}>
                      {filter.icon}
                    </span>
                    <span>{filter.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Search filter in disciplines */}
            <div className="relative min-w-[240px] sm:min-w-[280px]">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar disciplina ou tópico..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-[#12213B] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#12213B] shadow-2xs font-mono"
              />
            </div>
          </div>

          {/* Disciplines List Strictly Ordered By Weight */}
          <div className="space-y-4">
            {filteredDisciplinas.length === 0 ? (
              <div className="p-8 text-center bg-[#FBFAF7] border border-slate-300 rounded-2xl shadow-sm">
                <p className="text-sm text-[#4B5563]">Nenhuma disciplina encontrada com os filtros atuais.</p>
              </div>
            ) : (
              filteredDisciplinas.map((disc, idx) => {
                const originalIndex = plan.disciplinas.findIndex((d) => d.id === disc.id || d.nome === disc.nome);
                const discId = disc.id || String(idx);
                const isExpanded = !!expandedDisciplinas[discId];
                const completedCount = disc.topicosConcluidos?.length || 0;
                const totalDiscTopics = disc.topicos?.length || 0;
                const isDiscFinished = totalDiscTopics > 0 && completedCount === totalDiscTopics;
                const discProgress = totalDiscTopics > 0 ? Math.round((completedCount / totalDiscTopics) * 100) : 0;

                // Color coding per weight according to design spec:
                // vermelho-carimbo #B8412C (urgência/peso alto), dourado #B8862E (peso médio), verde #1F6F4F (peso baixo)
                let weightBadge = (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#1F6F4F]/10 text-[#1F6F4F] border border-[#1F6F4F]/30 uppercase">
                    Peso Baixo
                  </span>
                );
                if (disc.peso === 'alto') {
                  weightBadge = (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#B8412C]/10 text-[#B8412C] border border-[#B8412C]/30 uppercase">
                      🔥 Peso Alto • Prioridade
                    </span>
                  );
                } else if (disc.peso === 'medio') {
                  weightBadge = (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#B8862E]/10 text-[#B8862E] border border-[#B8862E]/30 uppercase">
                      ⚖️ Peso Médio
                    </span>
                  );
                }

                return (
                  <div
                    key={disc.id || idx}
                    className={`bg-[#FBFAF7] border rounded-2xl shadow-xs transition-all overflow-hidden ${
                      isDiscFinished
                        ? 'border-[#1F6F4F] ring-1 ring-[#1F6F4F]/30 bg-[#1F6F4F]/5'
                        : disc.peso === 'alto'
                        ? 'border-[#B8412C]/30 hover:border-[#B8412C]/60'
                        : 'border-slate-300 hover:border-slate-400'
                    }`}
                  >
                    {/* Discipline Header Card */}
                    <div className="p-5 sm:p-6 cursor-pointer" onClick={() => toggleExpand(discId)}>
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        {/* Title & Rank */}
                        <div className="flex items-start gap-3.5">
                          {/* Order Rank Badge */}
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-black text-sm flex-shrink-0 shadow-xs ${
                              disc.peso === 'alto'
                                ? 'bg-[#B8412C] text-white'
                                : disc.peso === 'medio'
                                ? 'bg-[#B8862E] text-white'
                                : 'bg-[#12213B] text-white'
                            }`}
                          >
                            #{disc.ordem_importancia || idx + 1}
                          </div>

                          <div>
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#12213B] tracking-tight">
                                {disc.nome}
                              </h3>
                              {weightBadge}
                              {isDiscFinished && (
                                <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#1F6F4F]/10 text-[#1F6F4F] border border-[#1F6F4F]/30 flex items-center gap-1">
                                  <Check className="w-3 h-3 text-[#1F6F4F]" />
                                  Homologada!
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-[#4B5563] flex flex-wrap items-center gap-2 font-mono">
                              <span className="text-[#12213B] font-bold">{disc.peso_pontuacao}</span>
                              <span>•</span>
                              <span className="text-[#B8412C] font-bold">
                                {disc.horas_por_dia || disc.horas_diarias_sugeridas
                                  ? `Tempo diário: ${disc.horas_por_dia || disc.horas_diarias_sugeridas}`
                                  : `Sugerido: ~${disc.horas_semanais_sugeridas || 3}h/semana`}
                              </span>
                            </p>
                          </div>
                        </div>

                        {/* Progress and Expand trigger */}
                        <div className="flex items-center gap-4 self-end md:self-center">
                          <div className="text-right hidden sm:block">
                            <span className="text-xs font-mono font-bold text-[#12213B] block">
                              {completedCount}/{totalDiscTopics} tópicos
                            </span>
                            <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden mt-1 border border-slate-300">
                              <div className="h-full bg-[#1F6F4F] rounded-full" style={{ width: `${discProgress}%` }} />
                            </div>
                          </div>

                          <div className="p-2 rounded-xl bg-white text-[#12213B] border border-slate-300 hover:bg-slate-100 transition-colors">
                            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                          </div>
                        </div>
                      </div>

                      {/* Strategic Context from Edital */}
                      {disc.por_que_importa && (
                        <div className="mt-3.5 pt-3 border-t border-slate-200/70 text-xs text-[#4B5563] flex items-start gap-2">
                          <span className="font-bold text-[#12213B] font-mono flex-shrink-0">
                            Relevância no Edital:
                          </span>
                          <span>{disc.por_que_importa}</span>
                        </div>
                      )}
                    </div>

                    {/* Expanded Content: Video + Topics Checklist + Study Tools */}
                    {isExpanded && (
                      <div className="px-5 sm:px-6 pb-6 pt-3 bg-white/70 border-t border-slate-200 space-y-6">
                        {/* YouTube Search Direct Link for Subject (Strictly Concatenated Search Query) */}
                        <div className="p-4 bg-white border border-slate-300 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
                          <div className="flex items-center gap-3.5">
                            <div className="w-12 h-12 rounded-xl bg-[#CC0000] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                              <Play className="w-6 h-6 fill-current ml-0.5" />
                            </div>

                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#CC0000]/10 text-[#CC0000] uppercase tracking-wider">
                                  YouTube Aulas
                                </span>
                                <span className="text-xs text-[#4B5563] font-mono">
                                  Busca Oficial Direta
                                </span>
                              </div>
                              <h4 className="font-serif text-xs sm:text-sm font-bold text-[#12213B] mt-0.5 line-clamp-1">
                                {`Videoaulas de ${disc.nome} (${plan.banca || 'Concurso'})`}
                              </h4>
                              <p className="text-[11px] text-[#4B5563] line-clamp-1 font-mono">
                                Link concatenado direto para pesquisa no YouTube sem links quebrados.
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 w-full sm:w-auto">
                            <a
                              href={
                                disc.video_youtube_busca ||
                                disc.video_youtube_busca_fallback ||
                                getYouTubeSearchUrl(
                                  disc.busca_youtube_termo || `${disc.nome} ${plan.concurso || ''}`
                                )
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full sm:w-auto px-4 py-2.5 bg-[#CC0000] hover:bg-[#B30000] text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                            >
                              <ExternalLink className="w-4 h-4" />
                              <span>Pesquisar no YouTube</span>
                            </a>
                          </div>
                        </div>

                        {/* Topics of the Syllabus with Checklist & Quick Search */}
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-xs font-mono font-bold text-[#12213B] uppercase tracking-wider flex items-center gap-2">
                              <BookOpen className="w-3.5 h-3.5 text-[#12213B]" />
                              Conteúdo Programático do Edital ({disc.topicos?.length || 0} Tópicos)
                            </h4>
                            <span className="text-[11px] text-[#4B5563] font-mono">
                              Marque tópicos para validar o carimbo
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {disc.topicos?.map((topico, tIdx) => {
                              const isChecked = disc.topicosConcluidos?.includes(topico);
                              const topicSearchUrl = getYouTubeSearchUrl(
                                `${disc.nome} ${topico} ${plan.concurso || ''}`
                              );

                              return (
                                <div
                                  key={tIdx}
                                  className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 transition-all ${
                                    isChecked
                                      ? 'bg-[#1F6F4F]/10 border-[#1F6F4F]/40 text-[#1F6F4F] opacity-90'
                                      : 'bg-[#FBFAF7] border-slate-300 hover:border-slate-400 text-[#12213B] shadow-2xs'
                                  }`}
                                >
                                  <div
                                    onClick={() => handleToggleTopic(originalIndex, topico)}
                                    className="flex items-start gap-2.5 flex-1 cursor-pointer select-none"
                                  >
                                    <div
                                      className={`w-4 h-4 rounded-md border flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                                        isChecked
                                          ? 'bg-[#1F6F4F] border-[#1F6F4F] text-white'
                                          : 'border-slate-400 bg-white'
                                      }`}
                                    >
                                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                                    </div>
                                    <span className={`text-xs font-medium leading-snug ${isChecked ? 'line-through text-[#1F6F4F] font-semibold' : ''}`}>
                                      {topico}
                                    </span>
                                  </div>

                                  <a
                                    href={topicSearchUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title={`Pesquisar videoaulas de "${topico}" no YouTube`}
                                    className="p-1.5 text-slate-400 hover:text-[#CC0000] hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Search className="w-3.5 h-3.5" />
                                  </a>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Strategy Advice & AI Practice Tools */}
                        <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          {disc.estrategia_estudo && (
                            <p className="text-xs text-[#4B5563] italic">
                              💡 <strong className="font-serif text-[#12213B]">Dica da banca:</strong> {disc.estrategia_estudo}
                            </p>
                          )}

                          <div className="flex items-center gap-2 flex-shrink-0">
                            {/* Questions button */}
                            <button
                              onClick={() => onOpenQuestoesModal(disc)}
                              className="px-3 py-1.5 bg-[#12213B] hover:bg-[#1E355B] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-[#B8862E]" />
                              <span>Simular Questões</span>
                            </button>

                            {/* Flashcards button */}
                            <button
                              onClick={() => onOpenFlashcardsModal(disc)}
                              className="px-3 py-1.5 bg-[#B8862E] hover:bg-[#9B7024] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                            >
                              <Flame className="w-3.5 h-3.5 text-white" />
                              <span>Flashcards</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </>
      )}

      {/* Sources list at the bottom */}
      {plan.fontes && plan.fontes.length > 0 && (
        <div className="mt-8 p-4 bg-[#FBFAF7] border border-slate-300 rounded-xl shadow-2xs">
          <h4 className="text-xs font-mono font-bold text-[#4B5563] uppercase tracking-wider mb-2">
            Fontes do Edital Oficial e Editais Anteriores:
          </h4>
          <div className="flex flex-wrap gap-2">
            {plan.fontes.map((f, idx) => (
              <a
                key={idx}
                href={f.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-[11px] text-[#12213B] font-mono border border-slate-300 transition-colors"
              >
                <span className="max-w-[200px] truncate">{f.title || f.uri}</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

