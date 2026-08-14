import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { StampData } from '../types';
import { ShieldCheck, Award, CheckCircle2, Sparkles, X } from 'lucide-react';

interface StampCelebrationProps {
  stamp: StampData | null;
  onDismiss: () => void;
}

export const StampCelebration: React.FC<StampCelebrationProps> = ({ stamp, onDismiss }) => {
  useEffect(() => {
    if (!stamp) return;

    // Web Audio API tactile stamp sound effect (zero external audio files required)
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const now = ctx.currentTime;

        // Low impact thud (rubber stamp hitting paper)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(35, now + 0.12);

        gain.gain.setValueAtTime(0.7, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.15);

        // High mechanical click/creak
        const clickOsc = ctx.createOscillator();
        const clickGain = ctx.createGain();
        clickOsc.type = 'sine';
        clickOsc.frequency.setValueAtTime(800, now);
        clickOsc.frequency.exponentialRampToValueAtTime(120, now + 0.08);

        clickGain.gain.setValueAtTime(0.3, now);
        clickGain.gain.exponentialRampToValueAtTime(0.01, now + 0.09);

        clickOsc.connect(clickGain);
        clickGain.connect(ctx.destination);

        clickOsc.start(now);
        clickOsc.stop(now + 0.09);
      }
    } catch (e) {
      // Audio might be blocked by autoplay policies
    }

    // Auto dismiss after 2.6s
    const timer = setTimeout(() => {
      onDismiss();
    }, 2600);

    return () => clearTimeout(timer);
  }, [stamp, onDismiss]);

  if (!stamp) return null;

  const isGreen = stamp.colorTheme === 'verde';
  const isGold = stamp.colorTheme === 'dourado';

  // Palette tokens
  const borderColor = isGreen ? 'border-[#1F6F4F]' : isGold ? 'border-[#B8862E]' : 'border-[#B8412C]';
  const textColor = isGreen ? 'text-[#1F6F4F]' : isGold ? 'text-[#B8862E]' : 'text-[#B8412C]';
  const bgGlow = isGreen ? 'rgba(31,111,79,0.12)' : isGold ? 'rgba(184,134,46,0.12)' : 'rgba(184,65,44,0.12)';
  const chipBg = isGreen ? 'bg-[#1F6F4F]/10 text-[#1F6F4F]' : isGold ? 'bg-[#B8862E]/10 text-[#B8862E]' : 'bg-[#B8412C]/10 text-[#B8412C]';

  return (
    <AnimatePresence>
      <div 
        id="stamp-celebration-overlay"
        onClick={onDismiss}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs cursor-pointer select-none"
      >
        {/* Shockwave circle behind */}
        <motion.div
          initial={{ scale: 0.6, opacity: 0.8 }}
          animate={{ scale: 1.8, opacity: 0 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className={`absolute w-72 h-72 rounded-full border-4 ${borderColor} pointer-events-none`}
        />

        {/* The Official Rubber Stamp Seal */}
        <motion.div
          initial={{ scale: 2.6, rotate: -25, opacity: 0 }}
          animate={{ scale: 1, rotate: -11, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0, transition: { duration: 0.2 } }}
          transition={{ type: 'spring', damping: 14, stiffness: 320 }}
          className="relative bg-[#FBFAF7] p-6 sm:p-8 rounded-full shadow-2xl border-4 border-dashed max-w-xs sm:max-w-sm w-full aspect-square flex flex-col items-center justify-center text-center overflow-hidden"
          style={{
            borderColor: isGreen ? '#1F6F4F' : isGold ? '#B8862E' : '#B8412C',
            boxShadow: `0 20px 40px -15px ${bgGlow}, 0 0 0 8px rgba(251,250,247,0.9), inset 0 0 20px ${bgGlow}`
          }}
        >
          {/* Inner decorative double ring */}
          <div 
            className="absolute inset-3.5 rounded-full border-2 border-dashed pointer-events-none opacity-80"
            style={{ borderColor: isGreen ? '#1F6F4F' : isGold ? '#B8862E' : '#B8412C' }}
          />

          <div 
            className="absolute inset-5 rounded-full border pointer-events-none opacity-40"
            style={{ borderColor: isGreen ? '#1F6F4F' : isGold ? '#B8862E' : '#B8412C' }}
          />

          {/* Stamp Header Text */}
          <div className={`text-[10px] sm:text-xs font-mono font-bold tracking-[0.25em] uppercase ${textColor} mb-1 opacity-90`}>
            ★ DIÁRIO OFICIAL • CXP ★
          </div>

          {/* Icon */}
          <div className={`my-1 ${textColor}`}>
            {isGreen ? (
              <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 mx-auto stroke-[2.5]" />
            ) : isGold ? (
              <Award className="w-8 h-8 sm:w-10 sm:h-10 mx-auto stroke-[2.5]" />
            ) : (
              <ShieldCheck className="w-8 h-8 sm:w-10 sm:h-10 mx-auto stroke-[2.5]" />
            )}
          </div>

          {/* Stamp Main Title with Official Document typography */}
          <div className="relative my-1">
            <h2 className={`font-serif text-2xl sm:text-3xl font-black uppercase tracking-tight ${textColor} leading-none drop-shadow-xs border-y-2 py-1 px-3 ${borderColor}`}>
              {stamp.title}
            </h2>
          </div>

          {/* Subtitle & Protocol */}
          {stamp.subtitle && (
            <p className="text-xs font-mono font-bold text-[#12213B] mt-1.5 max-w-[200px] leading-tight">
              {stamp.subtitle}
            </p>
          )}

          {/* Stamp Footer */}
          <div className={`mt-2 text-[9px] font-mono tracking-wider ${chipBg} px-2.5 py-0.5 rounded-full font-bold uppercase`}>
            REGISTRO VÁLIDO • {new Date().toLocaleDateString('pt-BR')}
          </div>

          {/* Close hint */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDismiss();
            }}
            className="absolute top-2 right-2 p-1 text-slate-400 hover:text-slate-700 rounded-full"
            title="Fechar selo"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
