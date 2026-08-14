import React, { useState } from 'react';
import { User, Mail, Award, Clock, ArrowRight, ShieldCheck, Zap, BookOpen, FileText } from 'lucide-react';
import { UserProfile } from '../types';

interface Step1LoginProps {
  onLogin: (user: UserProfile) => void;
}

export const Step1Login: React.FC<Step1LoginProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [nivel, setNivel] = useState<'iniciante' | 'intermediario' | 'avancado'>('intermediario');
  const [horasDiarias, setHorasDiarias] = useState<number>(2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = name.trim() || 'Candidato Oficial';
    const finalEmail = email.trim() || 'concurseiro@estudos.gov.br';
    
    const user: UserProfile = {
      id: 'user_' + Date.now(),
      name: finalName,
      email: finalEmail,
      nivel,
      horasDiarias,
      horasSemana: horasDiarias * 6,
      dataInicio: new Date().toISOString(),
      protocoloOficial: `CXP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      xp: 150,
      streakDias: 1,
      questoesFeitas: 0,
      questoesAcertos: 0,
    };
    onLogin(user);
  };

  const handleQuickDemo = () => {
    const user: UserProfile = {
      id: 'user_guest_' + Date.now(),
      name: 'Carlos Silva (Candidato)',
      email: 'carlos.candidato@gmail.com',
      nivel: 'intermediario',
      horasDiarias: 3,
      horasSemana: 18,
      dataInicio: new Date().toISOString(),
      protocoloOficial: `CXP-2026-7841`,
      xp: 450,
      streakDias: 5,
      questoesFeitas: 24,
      questoesAcertos: 21,
    };
    onLogin(user);
  };

  return (
    <div className="min-h-[calc(100vh-4.5rem)] flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-xl bg-[#FBFAF7] border border-slate-300 rounded-2xl shadow-md p-6 sm:p-10 text-[#12213B] relative overflow-hidden">
        {/* Institutional Document Header */}
        <div className="text-center mb-8 border-b border-slate-200/80 pb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#12213B] text-white shadow-md mb-4 border border-[#B8862E]">
            <FileText className="w-7 h-7 text-[#FBFAF7]" />
          </div>
          
          <div className="inline-block mb-2">
            <span className="text-[11px] font-mono font-bold text-[#12213B] bg-[#12213B]/5 border border-slate-300 px-3 py-1 rounded-full uppercase tracking-wider">
              PROTOCOLO DE ACESSO • ETAPA 1 DE 4
            </span>
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#12213B] mt-1">
            Ficha de Inscrição do Candidato
          </h1>
          <p className="text-xs sm:text-sm text-[#4B5563] mt-2 max-w-md mx-auto leading-relaxed">
            Identificação em tempo real do edital oficial, cálculo do peso real das matérias e curadoria das videoaulas do YouTube.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nome */}
          <div>
            <label className="block text-xs font-mono font-bold text-[#12213B] uppercase tracking-wider mb-1.5">
              Nome do Candidato / Assinatura
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                id="input-login-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Carlos Silva ou Concurseiro Focado"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-[#12213B] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#12213B] focus:border-transparent text-sm transition-all shadow-2xs font-medium"
              />
            </div>
          </div>

          {/* Email / Contato */}
          <div>
            <label className="block text-xs font-mono font-bold text-[#12213B] uppercase tracking-wider mb-1.5">
              E-mail Institucional ou Pessoal
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="input-login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@exemplo.com"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-[#12213B] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#12213B] focus:border-transparent text-sm transition-all shadow-2xs font-medium"
              />
            </div>
          </div>

          {/* Nível de Preparação */}
          <div>
            <label className="block text-xs font-mono font-bold text-[#12213B] uppercase tracking-wider mb-2">
              Nível Atual de Preparação
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'iniciante', label: 'Iniciante', desc: 'Primeiro edital' },
                { id: 'intermediario', label: 'Intermediário', desc: 'Base consolidada' },
                { id: 'avancado', label: 'Avançado', desc: 'Reta final de posse' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setNivel(item.id as any)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    nivel === item.id
                      ? 'bg-white border-[#12213B] text-[#12213B] ring-2 ring-[#12213B]/20 shadow-xs'
                      : 'bg-white/60 border-slate-300 text-slate-600 hover:border-slate-400 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-[#12213B]">{item.label}</span>
                    {nivel === item.id && <Award className="w-3.5 h-3.5 text-[#B8862E]" />}
                  </div>
                  <p className="text-[11px] text-[#4B5563] line-clamp-1">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Horas Diárias Disponíveis (Cálculo essencial da Etapa 4) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-mono font-bold text-[#12213B] uppercase tracking-wider">
                Horas Disponíveis por Dia
              </label>
              <span className="font-mono text-xs font-bold text-[#B8412C]">
                {horasDiarias} {horasDiarias === 1 ? 'hora/dia' : 'horas/dia'}
              </span>
            </div>
            <p className="text-xs text-[#4B5563] mb-3">
              O motor distribuirá esse tempo proporcionalmente ao peso de cada disciplina do edital.
            </p>

            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 6].map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => setHorasDiarias(h)}
                  className={`py-2.5 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer ${
                    horasDiarias === h
                      ? 'bg-[#1F6F4F] border-[#1F6F4F] text-white shadow-xs'
                      : 'bg-white border-slate-300 text-[#12213B] hover:border-slate-400'
                  }`}
                >
                  {h}h/dia
                </button>
              ))}
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="pt-3 space-y-2.5">
            <button
              id="btn-login-submit"
              type="submit"
              className="w-full py-3 px-4 bg-[#B8412C] hover:bg-[#9E3624] text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Homologar Inscrição & Escolher Concurso</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleQuickDemo}
              className="w-full py-2.5 px-4 bg-white hover:bg-slate-100 border border-slate-300 text-[#12213B] font-mono font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Acesso Rápido de Demonstração (Demo)</span>
            </button>
          </div>
        </form>

        {/* Benefits footer */}
        <div className="mt-8 pt-6 border-t border-slate-200 grid grid-cols-3 gap-2 text-center text-[11px] text-[#4B5563] font-mono">
          <div className="flex flex-col items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-[#1F6F4F]" />
            <span>Editais com Grounding</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Award className="w-4 h-4 text-[#B8412C]" />
            <span>Matérias por Peso Real</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Zap className="w-4 h-4 text-[#B8862E]" />
            <span>Aulas do YouTube</span>
          </div>
        </div>
      </div>
    </div>
  );
};

