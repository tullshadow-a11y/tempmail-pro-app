import React, { useEffect, useRef } from 'react';

interface AdBannerProps {
  slot?: AdSlotConfig;
  position?: AdPosition;
  onDismissSocialBar?: () => void;
}

export const AdBanner: React.FC<AdBannerProps> = ({ slot, position = 'header', onDismissSocialBar }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Adsterra Native Banner script injection (30830719)
  useEffect(() => {
    const containerId = 'ad-container-30830719';
    const container = document.getElementById(containerId);
    if (container && !container.hasChildNodes()) {
      try {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.src = '//www.highperformanceformat.com/30830719/invoke.js';
        container.appendChild(script);
      } catch (e) {
        console.warn('Adsterra script load notice:', e);
      }
    }
  }, []);

  // Custom snippet script injection
  useEffect(() => {
    if (!slot || !slot.enabled || !slot.codeSnippet || !containerRef.current) return;

    if (slot.codeSnippet.includes('<script') || slot.codeSnippet.includes('<ins')) {
      try {
        const container = containerRef.current;
        container.innerHTML = '';
        if (document.body.contains(container)) {
          const range = document.createRange();
          range.selectNodeContents(container);
          const fragment = range.createContextualFragment(slot.codeSnippet);
          container.appendChild(fragment);
        }
      } catch (err) {
        console.warn('Ad script injection notice:', err);
      }
    }
  }, [slot?.codeSnippet, slot?.enabled]);

  // If explicit slot is provided and disabled, hide
  if (slot && !slot.enabled) return null;

  // 1. Social Bar / Floating Native Bar
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
                  {slot?.badgeText || 'Adsterra Network'}
                </span>
              </div>
              <p className="text-xs font-semibold text-white line-clamp-2 leading-relaxed">
                {slot?.customTitle || 'Get a 30-day free high-speed VPN trial with top-tier security'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setSocialBarDismissed(true);
              onDismissSocialBar?.();
            }}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            title="Dismiss Ad"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
          <span className="text-[10px] text-slate-400 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" /> Verified Ad
          </span>
          <a
            href={slot?.customTargetUrl || 'https://google.com'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-300 rounded-lg hover:brightness-110 shadow-sm transition-all"
          >
            <span>{slot?.customButtonText || 'View Deal'}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    );
  }

  // 2. Leaderboard Top Banner / Adsterra Slot (30830719)
  return (
    <div className="w-full max-w-5xl mx-auto my-4 px-4">
      <div className="relative overflow-hidden rounded-2xl bg-slate-900/90 border border-slate-800 p-3 sm:p-4 shadow-lg text-center">
        <div className="flex items-center justify-between text-[10px] text-slate-500 mb-2 border-b border-slate-800 pb-1">
          <span className="font-semibold uppercase tracking-wider">Adsterra Sponsored Content [30830719]</span>
          <Info className="w-3 h-3 text-slate-500" />
        </div>

        {/* Adsterra script container */}
        <div id="ad-container-30830719" className="w-full min-h-[90px] flex items-center justify-center" />

        {/* Custom fallback layout if script is blocked by browser extensions */}
        <div ref={containerRef} className="mt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
          <div>
            <h4 className="text-sm font-bold text-white">
              {slot?.customTitle || 'Ultra Security Protection & High Speed VPN'}
            </h4>
            <p className="text-xs text-slate-400">
              {slot?.customSubtitle || 'Protect your online identity and browse anonymously worldwide.'}
            </p>
          </div>
          <a
            href={slot?.customTargetUrl || 'https://google.com'}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-xl hover:brightness-110 transition-all shadow-md shrink-0 flex items-center justify-center gap-1"
          >
            <span>{slot?.customButtonText || 'Learn More'}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
