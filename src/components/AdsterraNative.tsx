import React, { useEffect, useRef } from 'react';
import { ExternalLink, Info, Sparkles, X, ShieldCheck } from 'lucide-react';

interface AdsterraNativeProps {
  type: 'banner' | 'social_bar';
  scriptCode?: string;
  customTitle?: string;
  customSubtitle?: string;
  customButtonText?: string;
  customTargetUrl?: string;
  customImageUrl?: string;
  badgeText?: string;
}

export const AdsterraNative: React.FC<AdsterraNativeProps> = ({
  type,
  scriptCode,
  customTitle,
  customSubtitle,
  customButtonText,
  customTargetUrl,
  customImageUrl,
  badgeText,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDismissed, setIsDismissed] = React.useState(false);

  // Native script injection handler
  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Target external container if #adsterra-container exists in index.html for native banner
    const targetEl = (type === 'banner' && document.getElementById('adsterra-container'))
      ? document.getElementById('adsterra-container')
      : containerRef.current;

    if (targetEl) {
      if (type === 'banner') {
        targetEl.classList.remove('hidden');
      }

      if (scriptCode && (scriptCode.includes('<script') || scriptCode.includes('<ins'))) {
        try {
          const range = document.createRange();
          range.selectNodeContents(targetEl);
          const fragment = range.createContextualFragment(scriptCode);
          targetEl.appendChild(fragment);
        } catch (err) {
          console.warn('Adsterra script injection notice:', err);
        }
      }
    }

    return () => {
      const extContainer = document.getElementById('adsterra-container');
      if (extContainer && type === 'banner') {
        extContainer.classList.add('hidden');
      }
    };
  }, [type, scriptCode]);

  if (isDismissed) return null;

  // Social Bar Adsterra Float
  if (type === 'social_bar') {
    return (
      <div
        ref={containerRef}
        id="adsterra-social-bar"
        className="fixed bottom-4 left-4 z-40 max-w-sm w-[calc(100%-2rem)] sm:w-96 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950/95 border border-indigo-500/40 p-4 shadow-2xl backdrop-blur-md animate-float text-start"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-emerald-400 flex items-center justify-center text-white shrink-0 shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {badgeText || 'إعلان Adsterra'}
                </span>
              </div>
              <p className="text-xs font-bold text-white line-clamp-2 leading-relaxed">
                {customTitle || 'احصل على تجربة شبكة افتراضية آمنة لمدة 30 يوماً مجاناً'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsDismissed(true)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            title="إغلاق الإعلان"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-slate-800">
          <span className="text-[10px] text-slate-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> شبكة معتمدة
          </span>
          <a
            href={customTargetUrl || 'https://google.com'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-black text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-300 rounded-lg hover:brightness-110 shadow-sm transition-all"
          >
            <span>{customButtonText || 'مشاهدة العرض'}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    );
  }

  // Native Banner Adsterra Component
  return (
    <div className="w-full max-w-5xl mx-auto my-4 px-4">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800/90 to-slate-900 border border-slate-700/80 p-3.5 sm:p-4 shadow-xl">
        <div className="flex items-center justify-between text-[10px] text-slate-400 mb-2 border-b border-slate-800 pb-1.5">
          <span className="font-bold text-emerald-400 flex items-center gap-1">
            <Info className="w-3 h-3" />
            {badgeText || 'إعلان Adsterra الموصى به'}
          </span>
          <span className="bg-slate-950 px-2 py-0.5 rounded font-mono">Native Ad</span>
        </div>

        <div ref={containerRef} id="adsterra-native-banner" className="min-h-[70px] flex flex-col sm:flex-row items-center justify-between gap-4 text-start">
          <div className="flex items-center gap-3">
            {customImageUrl && (
              <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-slate-700 hidden sm:block">
                <img src={customImageUrl} alt="Ad banner" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs sm:text-sm font-bold text-white leading-snug">
                  {customTitle || 'احصل على حماية قصوى وخصوصية فائقة بدون تتبع'}
                </h4>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.5 rounded border border-amber-500/30">
                  خصم 70%
                </span>
              </div>
              <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                {customSubtitle || 'أدوات حظر البرمجيات الخبيثة والتصفح الخفي السريع.'}
              </p>
            </div>
          </div>

          <a
            href={customTargetUrl || 'https://google.com'}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto text-center px-4 py-2 text-xs font-black text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-xl hover:brightness-110 transition-all shadow-md shrink-0 flex items-center justify-center gap-1.5"
          >
            <span>{customButtonText || 'احصل على العرض'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
