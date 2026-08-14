import React, { useState } from 'react';
import { X, ExternalLink, Play, Search, BookOpen, Clock, CheckCircle2, Bookmark } from 'lucide-react';
import { extractYouTubeId, getYouTubeSearchUrl, getYouTubeWatchUrl } from '../lib/youtubeHelper';
import { DisciplinaPlano } from '../types';

interface VideoPlayerModalProps {
  disciplina: DisciplinaPlano;
  onClose: () => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ disciplina, onClose }) => {
  const [userNotes, setUserNotes] = useState(() => {
    return localStorage.getItem(`notes_${disciplina.id}`) || '';
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const videoId = extractYouTubeId(disciplina.video_youtube);
  const searchFallbackUrl =
    disciplina.video_youtube_busca_fallback ||
    getYouTubeSearchUrl(disciplina.busca_youtube_termo || `${disciplina.nome} aula completa concurso`);

  const handleSaveNotes = () => {
    localStorage.setItem(`notes_${disciplina.id}`, userNotes);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-slate-900 border-b border-slate-800 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400">
              <Play className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-white line-clamp-1">
                {disciplina.video_titulo || `Videoaula Recomendada: ${disciplina.nome}`}
              </h3>
              <p className="text-xs text-slate-400">
                Canal: <strong className="text-blue-400">{disciplina.canal_sugerido || 'Canal Especializado'}</strong> • {disciplina.nome}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Area */}
        <div className="bg-black aspect-video w-full flex items-center justify-center relative">
          {videoId ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
              title={disciplina.video_titulo || disciplina.nome}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <div className="p-8 text-center max-w-md">
              <Play className="w-12 h-12 text-slate-500 mx-auto mb-3" />
              <p className="text-sm font-bold text-white mb-2">Videoaula de Estudo Direcionado</p>
              <p className="text-xs text-slate-400 mb-4">
                Assista diretamente no YouTube ou faça a busca focada pelo conteúdo desta disciplina.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                {disciplina.video_youtube && (
                  <a
                    href={disciplina.video_youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <span>Abrir Link Direto do Vídeo</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                <a
                  href={searchFallbackUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Buscar Aulas Completas no YouTube</span>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Notes & Actions Panel */}
        <div className="p-5 bg-white border-t border-slate-200 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200 uppercase text-[11px]">
                Peso {disciplina.peso}
              </span>
              <span className="text-slate-600 font-mono font-medium">{disciplina.peso_pontuacao}</span>
            </div>

            <div className="flex items-center gap-2">
              {videoId && (
                <a
                  href={getYouTubeWatchUrl(videoId)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-slate-600 hover:text-red-600 font-medium transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Assistir no YouTube Oficial</span>
                </a>
              )}
              <a
                href={searchFallbackUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-slate-600 hover:text-blue-700 font-medium transition-colors pl-2 border-l border-slate-200"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Buscar Outros Professores</span>
              </a>
            </div>
          </div>

          {/* Interactive Notes */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                <span>Anotações e Mnemônicos da Aula (Salvo no Navegador)</span>
              </label>
              <button
                onClick={handleSaveNotes}
                className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-sm"
              >
                <Bookmark className="w-3 h-3" />
                <span>{savedSuccess ? 'Salvo!' : 'Salvar Nota'}</span>
              </button>
            </div>
            <textarea
              value={userNotes}
              onChange={(e) => setUserNotes(e.target.value)}
              placeholder="Digite seus resumos, artigos de lei citados pelo professor ou macetes desta aula..."
              rows={3}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
