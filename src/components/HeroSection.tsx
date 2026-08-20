import React from 'react';
import { ShieldCheck, Zap, Lock, Sparkles } from 'lucide-react';
import { Language, translations } from '../utils/i18n';

interface HeroSectionProps {
  language: Language;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ language }) => {
  const t = translations[language];

  return (
    <div className="relative pt-8 pb-4 text-center px-4 max-w-4xl mx-auto overflow-hidden">
      {/* Dark background radial glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 sm:w-[500px] sm:h-[500px] bg-gradient-to-tr from-emerald-600/15 via-teal-500/10 to-indigo-600/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-subtle" />

      {/* Hero Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs sm:text-sm font-bold mb-5 border border-emerald-500/20 shadow-lg backdrop-blur-md">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span>{t.heroBadge}</span>
        <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
      </div>

      {/* Main Headline - Strict Reference Match */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-4 drop-shadow-md">
        {t.heroHeadline}
      </h1>

      {/* Hero Subtitle */}
      <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed mb-6 font-medium">
        {t.heroSubtitle}
      </p>

      {/* Features Pills */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-semibold text-slate-400">
        <div className="flex items-center gap-1.5 bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-800">
          <Zap className="w-4 h-4 text-emerald-400" />
          <span>استقبال فورّي للأكواد</span>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-800">
          <Lock className="w-4 h-4 text-emerald-400" />
          <span>تشفير تام وحماية الخصوصية</span>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-800">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>بدون إعلانات مزعجة</span>
        </div>
      </div>
    </div>
  );
};
