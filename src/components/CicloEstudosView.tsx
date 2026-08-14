import React from 'react';
import { Calendar, Clock, CheckCircle, BookOpen, Sparkles, Award, Flame } from 'lucide-react';
import { PlanoEstudoCompleto, CicloSugerido, DisciplinaPlano } from '../types';

interface CicloEstudosViewProps {
  plan?: PlanoEstudoCompleto;
  ciclo?: CicloSugerido;
  disciplinas?: DisciplinaPlano[];
  horasDiarias?: number;
  horasSemana?: number;
  onOpenQuestoes?: (disciplina: DisciplinaPlano) => void;
  onOpenFlashcards?: (disciplina: DisciplinaPlano) => void;
}

export const CicloEstudosView: React.FC<CicloEstudosViewProps> = ({
  plan,
  ciclo: directCiclo,
  disciplinas: directDisciplinas,
  horasDiarias: directHorasDiarias,
  horasSemana: directHorasSemana,
  onOpenQuestoes,
  onOpenFlashcards,
}) => {
  const activeCiclo = directCiclo || plan?.ciclo_sugerido;
  const activeDisciplinas = directDisciplinas || plan?.disciplinas || [];
  const horasDiarias = directHorasDiarias || plan?.horasDiariasPlanejadas || 2;
  const horasSemana = directHorasSemana || plan?.horasSemanaPlanejadas || horasDiarias * 6;

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="p-5 bg-[#FBFAF7] border border-slate-300 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-serif font-bold text-base text-[#12213B]">Ciclo de Estudos Diário & Semanal</h3>
            <span className="text-[11px] font-mono px-2.5 py-0.5 bg-[#12213B]/5 text-[#12213B] font-bold rounded-full border border-slate-300">
              Método 24/7/30 Oficial
            </span>
          </div>
          <p className="text-xs text-[#4B5563] mt-1">
            Distribuição balanceada para cobrir as {activeDisciplinas.length} matérias do edital sem sobrecarga mental, priorizando as de maior peso.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs text-[#4B5563] block font-mono font-medium">Meta Diária</span>
            <span className="font-mono font-bold text-[#1F6F4F] text-sm">
              {horasDiarias}h por dia
            </span>
            <span className="text-[10px] text-[#4B5563] block font-mono">
              (~{horasSemana}h semanais)
            </span>
          </div>
        </div>
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {activeCiclo?.distribuicao_dias?.map((diaItem, idx) => {
          const isWeekend = diaItem.dia.toLowerCase().includes('sábado') || diaItem.dia.toLowerCase().includes('domingo');

          return (
            <div
              key={idx}
              className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                isWeekend
                  ? 'bg-white border-slate-300 shadow-2xs'
                  : 'bg-[#FBFAF7] border-slate-300 hover:border-slate-400 shadow-2xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-200">
                  <span className="font-mono font-bold text-xs text-[#12213B] uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#B8862E]" />
                    {diaItem.dia}
                  </span>
                  <span className="text-[10px] text-[#4B5563] font-mono font-bold">Dia {idx + 1}</span>
                </div>

                <div className="space-y-2 mb-3">
                  {(diaItem.disciplinas || []).map((disc, dIdx) => (
                    <div
                      key={dIdx}
                      className="p-2 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-[#12213B] flex items-center justify-between gap-2 shadow-2xs"
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#B8412C] flex-shrink-0" />
                        <span className="truncate">{disc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <span className="text-[11px] text-[#4B5563] font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#B8862E] flex-shrink-0" />
                  <span className="line-clamp-1">{diaItem.foco}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Method Legend */}
      <div className="p-4 bg-[#FBFAF7] border border-slate-300 rounded-xl text-xs text-[#4B5563] space-y-2">
        <h4 className="font-serif font-bold text-[#12213B] uppercase tracking-wider flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-[#1F6F4F]" />
          Regra de Ouro do Concurseiro Homologado
        </h4>
        <p className="leading-relaxed font-sans">
          Estude blocos de 50 a 90 minutos por matéria alternando disciplinas de raciocínio com matérias de leitura/legislação. Resolva questões da banca examinadora após finalizar a teoria de cada bloco para fixar na memória de longo prazo.
        </p>
      </div>
    </div>
  );
};

