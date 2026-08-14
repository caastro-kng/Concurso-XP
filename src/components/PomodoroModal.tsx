import React, { useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw, Clock, CheckCircle, Bell, Award } from 'lucide-react';

interface PomodoroModalProps {
  onClose: () => void;
  disciplinaNome?: string;
}

export const PomodoroModal: React.FC<PomodoroModalProps> = ({ onClose, disciplinaNome }) => {
  const [mode, setMode] = useState<'study' | 'shortBreak' | 'longBreak'>('study');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);

  const getDuration = (m: 'study' | 'shortBreak' | 'longBreak') => {
    switch (m) {
      case 'study':
        return 25 * 60;
      case 'shortBreak':
        return 5 * 60;
      case 'longBreak':
        return 15 * 60;
    }
  };

  const handleModeChange = (newMode: 'study' | 'shortBreak' | 'longBreak') => {
    setMode(newMode);
    setIsRunning(false);
    setTimeLeft(getDuration(newMode));
  };

  useEffect(() => {
    let timer: any = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      if (mode === 'study') {
        setCompletedSessions((prev) => prev + 1);
        handleModeChange('shortBreak');
      } else {
        handleModeChange('study');
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, mode]);

  const toggleRunning = () => setIsRunning(!isRunning);

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(getDuration(mode));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = ((getDuration(mode) - timeLeft) / getDuration(mode)) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-slate-900 border-b border-slate-800 text-white">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            <h3 className="font-extrabold text-sm sm:text-base text-white">Pomodoro do Concurseiro</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 text-center">
          {disciplinaNome && (
            <div className="mb-4 inline-block bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full border border-blue-200 font-bold">
              Foco Atual: <strong>{disciplinaNome}</strong>
            </div>
          )}

          {/* Mode Switcher */}
          <div className="flex justify-center gap-2 mb-6 bg-slate-100 p-1.5 rounded-xl border border-slate-200 max-w-xs mx-auto">
            <button
              onClick={() => handleModeChange('study')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mode === 'study' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Foco (25m)
            </button>
            <button
              onClick={() => handleModeChange('shortBreak')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mode === 'shortBreak' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pausa (5m)
            </button>
            <button
              onClick={() => handleModeChange('longBreak')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mode === 'longBreak' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Descanso (15m)
            </button>
          </div>

          {/* Timer Display */}
          <div className="relative w-48 h-48 mx-auto flex items-center justify-center mb-6">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="44" className="text-slate-100" strokeWidth="6" stroke="currentColor" fill="transparent" />
              <circle
                cx="50"
                cy="50"
                r="44"
                className={mode === 'study' ? 'text-blue-600' : 'text-emerald-500'}
                strokeWidth="6"
                strokeDasharray={276}
                strokeDashoffset={276 - (276 * progressPercent) / 100}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                style={{ transition: 'stroke-dashoffset 0.5s ease' }}
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-4xl font-black font-mono tracking-tight text-slate-900 block">
                {formatTime(timeLeft)}
              </span>
              <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold mt-0.5 block">
                {mode === 'study' ? 'Foco Total' : 'Pausa Relaxante'}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <button
              onClick={toggleRunning}
              className={`px-6 py-3 rounded-xl font-bold text-sm text-white shadow-md flex items-center gap-2 transition-all transform active:scale-95 cursor-pointer ${
                isRunning
                  ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/20'
                  : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/25'
              }`}
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isRunning ? 'Pausar' : 'Iniciar Foco'}</span>
            </button>

            <button
              onClick={handleReset}
              className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors cursor-pointer"
              title="Reiniciar"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Session Counter */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span className="flex items-center gap-1.5 font-medium">
              <Award className="w-4 h-4 text-amber-500" />
              Ciclos completados hoje:
            </span>
            <span className="font-bold text-slate-900 font-mono bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-lg">
              {completedSessions} {completedSessions === 1 ? 'bloco' : 'blocos'} ({completedSessions * 25}min)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
