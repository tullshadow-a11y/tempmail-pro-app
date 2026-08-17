import React, { useEffect, useRef } from 'react';
import { ExternalLink, Info, Sparkles, ShieldCheck, X } from 'lucide-react';
import { AdPosition, AdSlotConfig } from '../types';

interface AdBannerProps {
  slot: AdSlotConfig;
  position: AdPosition;
  onDismissSocialBar?: () => void;
}

export const AdBanner: React.FC<AdBannerProps> = ({ slot, position, onDismissSocialBar }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [socialBarDismissed, setSocialBarDismissed] = React.useState(false);

  // If slot contains real JavaScript/HTML (Adsterra / AdSense) and is custom code
  useEffect(() => {
    if (!slot.enabled || !slot.codeSnippet || !containerRef.current) return;

    // Check if code contains script tags
    if (slot.codeSnippet.includes('<script') || slot.codeSnippet.includes('<ins')) {
      try {
        const container = containerRef.current;
        // Clean previous
        container.innerHTML = '';
        
        // Create range to execute scripts if any
        const range = document.createRange();
        range.selectNode(container);
        const fragment = range.createContextualFragment(slot.codeSnippet);
        container.appendChild(fragment);
      } catch (err) {
        console.warn('Ad script injection notice:', err);
      }
    }
  }, [slot.codeSnippet, slot.enabled]);

  if (!slot.enabled) return null;

  // 1. Social Bar / Floating Native Bar (Bottom-Right / Floating Toast)
  if (position === 'social_bar') {
    if (socialBarDismissed) return null;
    return (
      <div className="fixed bottom-4 left-4 z-40 max-w-sm w-[calc(100%-2rem)] sm:w-96 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950/90 border border-indigo-500/30 p-3.5 shadow-2xl backdrop-blur-md animate-bounce-subtle">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-emerald-400 flex items-center justify-center text-white shrink-0 shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                  {slot.badgeText || 'Adsterra Social Bar'}
                </span>
              </div>
              <p className="text-xs font-semibold text-white line-clamp-2 leading-relaxed">
                {slot.customTitle || 'احصل على اشتراك VPN مجاني لمدة 30 يوماً مع تشفير عالي الأمان'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setSocialBarDismissed(true);
              onDismissSocialBar?.();
            }}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            title="إغلاق الإعلان"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
          <span className="text-[10px] text-slate-400 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" /> شبكة إعلانات آمنة
          </span>
          <a
            href={slot.customTargetUrl || 'https://google.com'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-300 rounded-lg hover:brightness-110 shadow-sm transition-all"
          >
            <span>{slot.customButtonText || 'مشاهدة العرض'}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    );
  }

  // 2. Leaderboard Top Banner (728x90 style)
  if (position === 'header') {
    return (
      <div className="w-full max-w-5xl mx-auto my-3 px-4">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800/90 to-slate-900 border border-slate-700/60 p-3 sm:p-4 shadow-lg">
          {/* Ad Label badge */}
          <div className="absolute top-2 left-2 flex items-center gap-1 text-[10px] text-slate-400 bg-slate-950/60 px-2 py-0.5 rounded-md border border-slate-800">
            <span>{slot.badgeText || (slot.provider === 'adsterra' ? 'Adsterra Banner' : 'AdSense')}</span>
            <Info className="w-2.5 h-2.5" />
          </div>

          <div ref={containerRef} className="min-h-[70px] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-right">
              {slot.customImageUrl && (
                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-slate-700/80 hidden sm:block">
                  <img src={slot.customImageUrl} alt="Ad banner" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm sm:text-base font-bold text-white leading-snug">
                    {slot.customTitle || 'حماية أمنية فائقة وسرعة إنترنت غير محدودة'}
                  </h4>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.5 rounded border border-amber-500/30">
                    خصم 70%
                  </span>
                </div>
                <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">
                  {slot.customSubtitle || 'احصل على أفضل برامج الحماية لعام 2026 مع حماية متقدمة من التتبع والبرمجيات الخبيثة.'}
                </p>
              </div>
            </div>

            <a
              href={slot.customTargetUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto text-center px-4 py-2 text-xs sm:text-sm font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-xl hover:brightness-110 transition-all shadow-md shrink-0 flex items-center justify-center gap-1.5"
            >
              <span>{slot.customButtonText || 'تفعيل العرض الآن'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  // 3. Sidebar / Rectangle Banner (300x250 style)
  if (position === 'sidebar') {
    return (
      <div className="rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 p-4 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between text-[10px] text-slate-400 mb-3 border-b border-slate-800/80 pb-1.5">
          <span className="font-semibold">{slot.badgeText || 'إعلان Google AdSense'}</span>
          <span className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">300x250</span>
        </div>

        <div ref={containerRef} className="flex flex-col items-center text-center p-2">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3">
            <Sparkles className="w-7 h-7" />
          </div>

          <h5 className="font-bold text-white text-sm mb-1.5 leading-snug">
            {slot.customTitle || 'سحابة تخزين مجانية 100GB مشفرة'}
          </h5>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            {slot.customSubtitle || 'احفظ ملفاتك وصورك بأمان تام مع تشفير سحابي فائق السرعة وبدون أي إعلانات مزعجة.'}
          </p>

          <a
            href={slot.customTargetUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-indigo-500 to-emerald-500 hover:from-indigo-600 hover:to-emerald-600 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <span>{slot.customButtonText || 'ابدأ التجربة المجانية'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    );
  }

  // 4. Inline / Inbox Bottom Banner
  return (
    <div className="my-4 w-full">
      <div className="relative rounded-2xl bg-slate-900/90 border border-slate-800 p-3.5 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3 text-right">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono">
                {slot.badgeText || 'إعلان مدعوم'}
              </span>
              <h5 className="text-xs sm:text-sm font-bold text-white">
                {slot.customTitle || 'هل تحتاج إلى رقم هاتف وهمي لتفعيل واتساب وتيليجرام؟'}
              </h5>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
              {slot.customSubtitle || 'احصل على أرقام هواتف افتراضية من أكثر من 50 دولة لاستقبال رسائل SMS والتأكيد الفوري.'}
            </p>
          </div>
        </div>

        <a
          href={slot.customTargetUrl || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto px-4 py-1.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow shrink-0 text-center flex items-center justify-center gap-1"
        >
          <span>{slot.customButtonText || 'تصفح الأرقام المتاحة'}</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};
