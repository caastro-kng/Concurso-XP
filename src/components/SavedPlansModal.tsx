import React from 'react';
import { X, Bookmark, Trash2, Calendar, Award, CheckCircle, PlusCircle, ArrowRight } from 'lucide-react';
import { PlanoEstudoCompleto } from '../types';

interface SavedPlansModalProps {
  plans: PlanoEstudoCompleto[];
  activePlanId: string | null;
  onSelectPlan: (plan: PlanoEstudoCompleto) => void;
  onDeletePlan: (planId: string) => void;
  onNewPlan: () => void;
  onClose: () => void;
}

export const SavedPlansModal: React.FC<SavedPlansModalProps> = ({
  plans,
  activePlanId,
  onSelectPlan,
  onDeletePlan,
  onNewPlan,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-slate-900 border-b border-slate-800 text-white">
          <div className="flex items-center gap-2.5">
            <Bookmark className="w-5 h-5 text-blue-400" />
            <h3 className="font-extrabold text-sm sm:text-base text-white">Meus Planos de Estudo Salvos</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-4">
          {(!plans || plans.length === 0) ? (
            <div className="text-center py-10">
              <Bookmark className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-900">Nenhum plano salvo ainda</p>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                Pesquise um concurso para gerar seu primeiro plano de estudos ordenado por peso.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onNewPlan();
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl inline-flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Criar Novo Plano Agora</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {plans.map((p) => {
                const isActive = p.id === activePlanId;
                const discList = p.disciplinas || [];
                const totalTopics = discList.reduce((acc, d) => acc + (d.topicos?.length || 0), 0);
                const completedTopics = discList.reduce(
                  (acc, d) => acc + (d.topicosConcluidos?.length || 0),
                  0
                );
                const pct = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

                return (
                  <div
                    key={p.id}
                    className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isActive
                        ? 'bg-blue-50/50 border-blue-500 shadow-sm ring-1 ring-blue-500/20'
                        : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-extrabold text-sm text-slate-900">{p.concurso}</h4>
                        {isActive && (
                          <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-full border border-blue-200">
                            Ativo
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                        <span>Cargo: <strong className="text-slate-800">{p.cargo || 'Geral'}</strong></span>
                        <span>•</span>
                        <span>Banca: <strong className="text-blue-700 font-bold">{p.banca}</strong></span>
                        <span>•</span>
                        <span>{discList.length} disciplinas</span>
                      </div>
                      {/* Mini progress bar */}
                      <div className="mt-2 flex items-center gap-2 max-w-xs">
                        <div className="flex-1 h-1.5 bg-slate-100 border border-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono font-medium">{pct}% concluído</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => {
                          onSelectPlan(p);
                          onClose();
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                          isActive
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        <span>{isActive ? 'Plano Atual' : 'Abrir Plano'}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>

                      <button
                        onClick={() => onDeletePlan(p.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Excluir Plano"
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

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
          <button
            onClick={() => {
              onClose();
              onNewPlan();
            }}
            className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-bold cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Criar Plano para Outro Concurso</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
