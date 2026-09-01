import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Crown, LogIn, X, Sparkles, CheckCircle2, Zap } from 'lucide-react';
import { DailyLimitInfo } from '../types';

interface DailyLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgradePremium: () => void;
  onOpenLogin: () => void;
  dailyUsage: DailyLimitInfo;
}

export const DailyLimitModal: React.FC<DailyLimitModalProps> = ({
  isOpen,
  onClose,
  onUpgradePremium,
  onOpenLogin,
  dailyUsage,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg bg-[#140b2b] border-2 border-purple-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-purple-950/80 z-10 overflow-hidden"
        >
          {/* Top Decorative Ambient Glow */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-600/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            id="btn-close-limit-modal"
            onClick={onClose}
            className="absolute top-4 left-4 p-2 rounded-xl bg-purple-950/60 text-purple-300 hover:text-white hover:bg-purple-900/60 border border-purple-800/40 transition-all"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Icon & Badges */}
          <div className="flex flex-col items-center text-center pt-2">
            <div className="relative mb-4">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-rose-600 via-purple-600 to-amber-500 p-0.5 shadow-xl shadow-purple-900/50 flex items-center justify-center">
                <div className="w-full h-full bg-[#120924] rounded-[22px] flex items-center justify-center">
                  <ShieldAlert className="w-10 h-10 text-amber-400 animate-pulse" />
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[11px] font-extrabold border border-[#140b2b] shadow">
                10 / 10
              </div>
            </div>

            {/* Title */}
            <h3 className="text-xl sm:text-2xl font-black text-white mb-2 tracking-tight">
              وصلت للحد اليومي المجاني
            </h3>

            {/* Exact Required Warning Message */}
            <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-200 text-sm sm:text-base font-semibold leading-relaxed my-3 shadow-inner text-center">
              لقد استهلكت حدك اليومي (10/10 إيميلات). يرجى تسجيل الدخول أو الاشتراك في خطة Premium للحصول على عدد غير محدود
            </div>

            <p className="text-xs sm:text-sm text-purple-300/80 mb-6 max-w-md leading-relaxed">
              لتوفير أفضل أداء وحماية الخوادم من الضغط، يتم تجديد حد الـ 10 إيميلات تلقائياً كل 24 ساعة، أو يمكنك الترقية فورياً للاستمتاع ببريد غير محدود ونطاقات VIP خاصة.
            </p>

            {/* Daily Usage Progress Bar */}
            <div className="w-full bg-[#0a0517] rounded-2xl p-4 border border-purple-900/40 mb-6">
              <div className="flex items-center justify-between text-xs font-bold text-purple-200 mb-2">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>استهلاك اليوم ({dailyUsage.date})</span>
                </span>
                <span className="text-rose-400 font-mono">10 من 10 إيميلات (100%)</span>
              </div>
              <div className="w-full bg-purple-950/80 rounded-full h-2.5 overflow-hidden p-0.5 border border-purple-800/40">
                <div className="bg-gradient-to-r from-purple-500 to-rose-500 h-full rounded-full w-full" />
              </div>
            </div>

            {/* VIP Plan Perks list */}
            <div className="w-full bg-purple-950/30 rounded-2xl p-3.5 border border-purple-800/30 mb-6 text-right">
              <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5 mb-2">
                <Crown className="w-4 h-4 text-amber-400" />
                <span>مزايا باقة Premium الفورية:</span>
              </div>
              <ul className="space-y-1.5 text-xs text-purple-200/90">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>توليد عدد غير محدود من الإيميلات بدون أي قيود يومية</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>نطاقات مخصصة حصرية فائقة السرعة واستقبال لحظي</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>تجربة خالية تماماً من الإعلانات مع دعم فني مباشر</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="w-full space-y-3">
              {/* 1. Upgrade Premium Button */}
              <button
                id="btn-limit-modal-upgrade"
                onClick={() => {
                  onClose();
                  onUpgradePremium();
                }}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-[#7c3aed] to-purple-600 hover:from-amber-400 hover:to-purple-500 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-purple-900/50 hover:shadow-amber-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
              >
                <Crown className="w-5 h-5 text-amber-300 group-hover:scale-110 transition-transform" />
                <span>الاشتراك في باقة Premium (غير محدود)</span>
                <Sparkles className="w-4 h-4 text-amber-200" />
              </button>

              {/* 2. Login Button */}
              <button
                id="btn-limit-modal-login"
                onClick={() => {
                  onClose();
                  onOpenLogin();
                }}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#1f133d] hover:bg-[#2c1b57] text-purple-200 font-bold text-sm border border-purple-500/30 hover:border-purple-400 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <LogIn className="w-4 h-4 text-purple-400" />
                <span>تسجيل الدخول إلى حسابك</span>
              </button>

              {/* Close link */}
              <button
                onClick={onClose}
                className="w-full text-center text-xs text-purple-300/60 hover:text-purple-200 py-1"
              >
                المتابعة واستخدام البريد الحالي
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
