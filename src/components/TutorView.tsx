import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  ExternalLink,
  BookOpen,
  HelpCircle,
  Brain,
  Shield,
  Clock,
  Target,
  RefreshCw,
  Lightbulb,
} from 'lucide-react';
import { ChatMessage, PlanoEstudoCompleto, DisciplinaPlano } from '../types';

interface TutorViewProps {
  activePlan: PlanoEstudoCompleto | null;
  onOpenFlashcardsModal?: (disc: DisciplinaPlano) => void;
  onOpenQuestoesModal?: (disc: DisciplinaPlano) => void;
}

export const TutorView: React.FC<TutorViewProps> = ({
  activePlan,
  onOpenFlashcardsModal,
  onOpenQuestoesModal,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      content: `Olá, candidato! Sou o seu **Tutor Especialista em Concursos Públicos**.

Estou preparado para esclarecer dúvidas sobre o edital de **${activePlan?.concurso || 'seu concurso'}** (${activePlan?.banca || 'Banca Oficial'}), detalhar artigos de leis, desvendar pegadinhas da banca e orientar a priorização das matérias com base no peso oficial.

Como posso ajudar seus estudos hoje? Escolha uma sugestão abaixo ou digite sua pergunta:`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const SUGESTOES = [
    `Quais as principais pegadinhas da banca ${activePlan?.banca || 'Cebraspe'}?`,
    `Como memorizar os prazos e artigos mais cobrados em Direito Constitucional?`,
    `Qual a melhor técnica para revisar matérias de Peso Alto?`,
    `Explique a regra de pontuação líquida da banca ${activePlan?.banca || 'do concurso'}.`,
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (userText?: string) => {
    const textToSend = userText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!userText) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/concurso/mentor-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          concursoContexto: {
            concurso: activePlan?.concurso,
            cargo: activePlan?.cargo,
            banca: activePlan?.banca,
            disciplinas: activePlan?.disciplinas?.map((d) => `${d.nome} (${d.peso})`),
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        const modelMsg: ChatMessage = {
          id: 'model_' + Date.now(),
          role: 'model',
          content: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          fontes: data.fontes,
        };
        setMessages((prev) => [...prev, modelMsg]);
      } else {
        throw new Error(data.error || 'Erro no chat');
      }
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: 'err_' + Date.now(),
          role: 'model',
          content: 'Desculpe, tive uma instabilidade temporária ao consultar a inteligência. Por favor, tente enviar novamente.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-[#FBFAF7] border border-slate-300 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#1F6F4F]/10 text-[#1F6F4F] border border-[#1F6F4F]/30">
                Mentor de Inteligência Artificial
              </span>
              <span className="text-xs font-mono text-[#12213B] font-bold">
                Edital: {activePlan?.concurso || 'Oficial'} ({activePlan?.banca || 'Banca'})
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#12213B]">
              Tutor & Orientador Estratégico AI
            </h1>
            <p className="text-xs sm:text-sm text-[#4B5563] mt-1 max-w-2xl">
              Tire dúvidas sobre matérias do edital, peça resumos mnemônicos, entenda a jurisprudência cobrada pela banca organizadora e refine sua rotina.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-[#1F6F4F] text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="bg-[#FBFAF7] border border-slate-300 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[600px]">
        {/* Messages List */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-mono font-bold shadow-2xs ${
                    isUser
                      ? 'bg-[#12213B] text-white'
                      : 'bg-[#1F6F4F] text-white'
                  }`}
                >
                  {isUser ? 'VC' : 'AI'}
                </div>

                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm shadow-2xs ${
                    isUser
                      ? 'bg-[#12213B] text-white rounded-tr-none'
                      : 'bg-white border border-slate-200 text-[#12213B] rounded-tl-none leading-relaxed'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.content}</div>

                  {msg.fontes && msg.fontes.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-slate-200 text-[11px] font-mono">
                      <span className="text-[#4B5563] font-bold block mb-1">Fontes consultadas:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.fontes.map((f, i) => (
                          <a
                            key={i}
                            href={f.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[#1F6F4F] hover:underline"
                          >
                            <span>{f.title || f.uri}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  <span
                    className={`text-[10px] font-mono block mt-2 ${
                      isUser ? 'text-slate-300 text-right' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 max-w-[85%] mr-auto">
              <div className="w-8 h-8 rounded-xl bg-[#1F6F4F] text-white flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-4 bg-white border border-slate-200 rounded-2xl rounded-tl-none shadow-2xs">
                <div className="flex items-center gap-2 text-xs text-[#1F6F4F] font-mono font-bold">
                  <div className="w-2 h-2 rounded-full bg-[#1F6F4F] animate-ping" />
                  <span>Consultando matriz do edital e jurisprudência...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 sm:px-6 py-2.5 bg-white/70 border-t border-slate-200 overflow-x-auto flex items-center gap-2">
          <span className="text-[11px] font-mono font-bold text-[#4B5563] flex-shrink-0 flex items-center gap-1">
            <Lightbulb className="w-3.5 h-3.5 text-[#B8862E]" />
            Sugestões:
          </span>
          {SUGESTOES.map((sug, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(sug)}
              disabled={loading}
              className="px-3 py-1.5 bg-[#FBFAF7] hover:bg-[#12213B] hover:text-white border border-slate-300 rounded-xl text-[11px] font-mono text-[#12213B] transition-all cursor-pointer whitespace-nowrap shadow-2xs flex-shrink-0"
            >
              {sug}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <div className="p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Pergunte ao tutor sobre ${activePlan?.concurso || 'o edital'}...`}
              disabled={loading}
              className="flex-1 px-4 py-3 bg-[#FBFAF7] border border-slate-300 rounded-xl text-xs sm:text-sm text-[#12213B] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#12213B] font-mono"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="px-5 py-3 bg-[#1F6F4F] hover:bg-[#18593F] disabled:bg-slate-300 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs transition-all cursor-pointer disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Enviar</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
