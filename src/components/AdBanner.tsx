import React from 'react';
import { ExternalLink, Info, Sparkles } from 'lucide-react';
import { AdPosition, AdSlotConfig } from '../types';
import { AdsterraNative } from './AdsterraNative';

interface AdBannerProps {
  slot: AdSlotConfig;
  position: AdPosition;
  onDismissSocialBar?: () => void;
}

export const AdBanner: React.FC<AdBannerProps> = ({ slot, position }) => {
  if (!slot || !slot.enabled) return null;

  // Render Adsterra component when provider is 'adsterra' or position is 'social_bar'
  if (slot.provider === 'adsterra' || position === 'social_bar') {
    return (
      <AdsterraNative
        type={position === 'social_bar' ? 'social_bar' : 'banner'}
        scriptCode={slot.codeSnippet}
        customTitle={slot.customTitle}
        customSubtitle={slot.customSubtitle}
        customButtonText={slot.customButtonText}
        customTargetUrl={slot.customTargetUrl}
        customImageUrl={slot.customImageUrl}
        badgeText={slot.badgeText}
      />
    );
  }

  // Generic fallback or AdSense slots
  return (
    <div className="w-full max-w-5xl mx-auto my-3 px-4">
      <div className="relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 p-4 shadow-lg text-start">
        <div className="flex items-center justify-between text-[10px] text-slate-400 mb-2 border-b border-slate-800/80 pb-1.5">
          <span className="font-bold text-indigo-400 flex items-center gap-1">
            <Info className="w-3 h-3" />
            {slot.badgeText || 'Google AdSense'}
          </span>
          <span className="bg-slate-950 px-2 py-0.5 rounded font-mono">Sponsored</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs sm:text-sm font-bold text-white">
                {slot.customTitle || 'احصل على مساحة تخزين سحابية مشفرة مجاناً'}
              </h5>
              <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                {slot.customSubtitle || 'احفظ جميع ملفاتك وأظهر أقصى مستويات الأمان والسرعة.'}
              </p>
            </div>
          </div>

          <a
            href={slot.customTargetUrl || 'https://google.com'}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-4 py-2 text-xs font-black text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow shrink-0 text-center flex items-center justify-center gap-1"
          >
            <span>{slot.customButtonText || 'تجربة مجانية'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
