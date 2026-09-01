import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogIn, Crown, X, Check, Mail, Lock, User, Sparkles, LogOut, CheckCircle2, ShieldCheck } from 'lucide-react';
import { UserSession } from '../types';
import { StorageService } from '../services/storage';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserSession | null;
  onLoginSuccess: (session: UserSession) => void;
  onLogout: () => void;
  onUpgradeToPremium: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
  onLogout,
  onUpgradeToPremium,
}) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('يرجى إدخال بريد إلكتروني صالح');
      return;
    }
    if (!password || password.length < 5) {
      setError('كلمة المرور يجب أن تكون 5 أحرف على الأقل');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const isVipEmail = email.toLowerCase().includes('vip') || email.toLowerCase().includes('premium');
      const session: UserSession = {
        id: 'usr_' + Date.now(),
        email: email.trim(),
        name: name.trim() || email.split('@')[0],
        isPremium: isVipEmail,
        premiumTier: isVipEmail ? 'yearly' : undefined,
        createdAt: new Date().toISOString(),
      };

      StorageService.saveUserSession(session);
      onLoginSuccess(session);
      setIsLoading(false);
      onClose();
    }, 600);
  };

  const handleInstantVipLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      const session: UserSession = {
        id: 'usr_vip_' + Date.now(),
        email: 'vip.member@flashmail.com',
        name: 'عضو VIP المميز',
        isPremium: true,
        premiumTier: 'yearly',
        createdAt: new Date().toISOString(),
      };

      StorageService.saveUserSession(session);
      onLoginSuccess(session);
      setIsLoading(false);
      onClose();
    }, 400);
  };

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

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          className="relative w-full max-w-md bg-[#130b26] border border-purple-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl z-10 overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-2 rounded-xl bg-purple-950/50 text-purple-300 hover:text-white hover:bg-purple-900/60 border border-purple-800/40 transition-all"
          >
            <X className="w-4 h-4" />
          </button>

          {/* If already logged in */}
          {currentUser ? (
            <div className="text-center pt-2">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#7c3aed] to-amber-400 p-0.5 mx-auto mb-3 shadow-lg shadow-purple-900/40">
                <div className="w-full h-full bg-[#120924] rounded-[14px] flex items-center justify-center text-white">
                  <User className="w-8 h-8 text-purple-300" />
                </div>
              </div>

              <h3 className="text-lg font-bold text-white mb-1">
                {currentUser.name}
              </h3>
              <p className="text-xs text-purple-300/80 mb-4 font-mono dir-ltr">
                {currentUser.email}
              </p>

              {/* Status Badge */}
              <div className="mb-6">
                {currentUser.isPremium ? (
                  <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-purple-600/20 border border-amber-500/40 text-amber-300 text-xs font-bold shadow-sm">
                    <Crown className="w-4 h-4 text-amber-400" />
                    <span>عضوية VIP بريميوم (إيميلات غير محدودة)</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-purple-950/60 border border-purple-800/40 text-purple-300 text-xs font-medium">
                    <span>حساب مجاني (10 إيميلات يومياً)</span>
                  </div>
                )}
              </div>

              {!currentUser.isPremium && (
                <button
                  onClick={() => {
                    onClose();
                    onUpgradeToPremium();
                  }}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-purple-900/40 transition-all flex items-center justify-center gap-2 mb-3"
                >
                  <Crown className="w-4 h-4 text-amber-300" />
                  <span>ترقية الحساب إلى Premium (إلغاء الحد)</span>
                </button>
              )}

              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="w-full py-3 px-4 rounded-xl bg-[#201035] hover:bg-rose-950/40 text-rose-300 border border-purple-800/40 hover:border-rose-700/40 text-sm font-semibold transition-all flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>تسجيل الخروج</span>
              </button>
            </div>
          ) : (
            /* Login / Signup Form */
            <div>
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 text-purple-300 mx-auto mb-2.5 flex items-center justify-center shadow-inner">
                  <LogIn className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-1">
                  {isSignUp ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}
                </h3>
                <p className="text-xs text-purple-300/70">
                  سجل دخولك لحفظ بريدك المفضل وإلغاء القيود اليومية
                </p>
              </div>

              {/* Instant VIP Demo Button */}
              <div className="mb-5 p-3 rounded-2xl bg-gradient-to-r from-purple-950/60 to-amber-950/40 border border-amber-500/30 text-center">
                <div className="text-xs font-bold text-amber-300 flex items-center justify-center gap-1.5 mb-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>دخول فوري بحساب VIP تجريبي</span>
                </div>
                <button
                  type="button"
                  onClick={handleInstantVipLogin}
                  disabled={isLoading}
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-[#7c3aed] hover:from-amber-400 hover:to-purple-600 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <Crown className="w-3.5 h-3.5" />
                  <span>دخول سريع كعضو بريميوم (غير محدود)</span>
                </button>
              </div>

              <div className="relative flex py-2 items-center mb-4">
                <div className="flex-grow border-t border-purple-900/60"></div>
                <span className="flex-shrink mx-3 text-[11px] text-purple-400/60">أو عبر البريد الإلكتروني</span>
                <div className="flex-grow border-t border-purple-900/60"></div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3.5">
                {isSignUp && (
                  <div>
                    <label className="block text-xs font-semibold text-purple-200 mb-1">
                      الاسم:
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-purple-400 absolute right-3 top-3" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="أدخل اسمك"
                        className="w-full bg-[#0a0517] border border-purple-900/60 focus:border-purple-500 rounded-xl pr-9 pl-3 py-2.5 text-xs sm:text-sm text-white placeholder-purple-400/40 outline-none transition-all"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-purple-200 mb-1">
                    البريد الإلكتروني:
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-purple-400 absolute right-3 top-3" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="user@example.com"
                      dir="ltr"
                      required
                      className="w-full bg-[#0a0517] border border-purple-900/60 focus:border-purple-500 rounded-xl pr-9 pl-3 py-2.5 text-xs sm:text-sm text-white placeholder-purple-400/40 outline-none transition-all text-left font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-purple-200 mb-1">
                    كلمة المرور:
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-purple-400 absolute right-3 top-3" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      dir="ltr"
                      required
                      className="w-full bg-[#0a0517] border border-purple-900/60 focus:border-purple-500 rounded-xl pr-9 pl-3 py-2.5 text-xs sm:text-sm text-white placeholder-purple-400/40 outline-none transition-all text-left font-mono"
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold text-sm shadow-lg shadow-purple-900/40 transition-all flex items-center justify-center gap-2 mt-2"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{isSignUp ? 'إنشاء الحساب' : 'تسجيل الدخول'}</span>
                    </>
                  )}
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(!isSignUp);
                      setError('');
                    }}
                    className="text-xs text-purple-300/80 hover:text-white transition-colors"
                  >
                    {isSignUp
                      ? 'لديك حساب بالفعل؟ تسجيل الدخول'
                      : 'ليس لديك حساب؟ اضغط هنا لإنشاء حساب مجاناً'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
