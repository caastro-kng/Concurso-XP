import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, User, ExternalLink, RefreshCw, BookOpen, Lightbulb } from 'lucide-react';
import { ChatMessage, PlanoEstudoCompleto } from '../types';

interface MentorChatModalProps {
  activePlan: PlanoEstudoCompleto | null;
  onClose: () => void;
}

const SUGESTOES_PERGUNTAS = [
  'Como memorizar os prazos da Lei 8.112/90?',
  'Quais os principais tópicos da Nova Lei de Licitações (14.133)?',
  'Qual a melhor estratégia para resolver provas da Cebraspe (C/E)?',
  'Como organizar o ciclo de estudos nas 4 semanas antes da prova?',
];

export const MentorChatModal: React.FC<MentorChatModalProps> = ({ activePlan, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      content: `Olá! Sou seu **Mentor Especialista em Concursos Públicos**. 
Estou pronto para tirar dúvidas sobre o edital de **${activePlan?.concurso || 'seu concurso'}** (${activePlan?.banca || 'Banca Oficial'}), explicar legislações, desmistificar pegadinhas e orientar sua rotina de estudos.

Qual tema ou dúvida quer explorar agora?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
          content: 'Desculpe, tive uma instabilidade temporária. Por favor, tente enviar novamente.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[85vh] max-h-[700px]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-slate-900 border-b border-slate-800 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base text-white">Mentor IA de Concursos</h3>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 font-bold px-2 py-0.5 rounded-full border border-blue-400/30">
                  Online
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Focado em: <span className="text-blue-400 font-semibold">{activePlan?.concurso || 'Concursos Públicos'}</span>
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

        {/* Messages Body */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 bg-slate-50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-blue-600 border border-slate-200 shadow-sm'
                }`}
              >
                {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
              </div>

              <div
                className={`max-w-[82%] sm:max-w-[75%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none shadow-sm'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none whitespace-pre-line shadow-sm'
                }`}
              >
                <div>{msg.content}</div>

                {msg.fontes && msg.fontes.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-200">
                    <p className="text-[10px] font-bold text-slate-500 mb-1">Fontes Oficiais & Jurisprudência:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.fontes.map((f, idx) => (
                        <a
                          key={idx}
                          href={f.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-50 text-[10px] text-blue-700 hover:text-blue-900 border border-slate-200"
                        >
                          <span className="max-w-[150px] truncate">{f.title || f.uri}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <div
                  className={`text-[10px] mt-1 text-right ${
                    msg.role === 'user' ? 'text-blue-100' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-blue-600 border border-slate-200 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none flex items-center gap-2 text-xs text-slate-600 shadow-sm">
                <div className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <span>Consultando edital e doutrina...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Prompts */}
        {messages.length <= 2 && (
          <div className="p-3 bg-white border-t border-slate-200 overflow-x-auto">
            <div className="flex gap-1.5 whitespace-nowrap">
              {SUGESTOES_PERGUNTAS.map((sugestao, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(sugestao)}
                  className="px-2.5 py-1 rounded-full bg-slate-50 hover:bg-blue-50 border border-slate-200 text-[11px] text-slate-700 hover:text-blue-700 transition-colors flex items-center gap-1 cursor-pointer font-medium"
                >
                  <Lightbulb className="w-3 h-3 text-amber-500" />
                  <span>{sugestao}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder="Tire uma dúvida sobre matérias, leis ou edital..."
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="p-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-300 text-white rounded-xl shadow-sm transition-colors flex-shrink-0 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
