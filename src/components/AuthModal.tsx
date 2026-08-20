import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User as UserIcon, Crown, CheckCircle, AlertCircle, LogIn, UserPlus } from 'lucide-react';
import { SupabaseAuthService, UserProfile } from '../services/supabase';
import { Language, translations } from '../utils/i18n';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onAuthSuccess: (profile: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  language,
  onAuthSuccess,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const t = translations[language];

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      if (mode === 'signup') {
        const { user, error } = await SupabaseAuthService.signUp(email, password, fullName);
        if (error) {
          setErrorMsg(error);
          return;
        }
        if (user) {
          const profile = await SupabaseAuthService.getUserProfile(user.id);
          if (profile) onAuthSuccess(profile);
          onClose();
        }
      } else {
        const { user, error } = await SupabaseAuthService.signIn(email, password);
        if (error) {
          setErrorMsg(error);
          return;
        }
        if (user) {
          const profile = await SupabaseAuthService.getUserProfile(user.id);
          if (profile) onAuthSuccess(profile);
          onClose();
        }
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'حدث خطأ أثناء الاتصال بالخادم');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-7 shadow-2xl z-10 text-start"
        >
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Crown className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                {mode === 'signin' ? t.login : t.signUp}
              </h3>
              <p className="text-xs text-slate-400">
                ربط الحساب عبر Supabase لإدارة العضوية VIP
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  الاسم الكامل:
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-500 absolute right-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="مثال: أحمد محمد"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pr-9 pl-3 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                البريد الإلكتروني الشخصي:
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute right-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pr-9 pl-3 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                كلمة السر:
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute right-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pr-9 pl-3 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : mode === 'signin' ? (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>{t.login}</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>{t.signUp}</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
            {mode === 'signin' ? (
              <p>
                ليس لديك حساب؟{' '}
                <button
                  onClick={() => { setMode('signup'); setErrorMsg(''); }}
                  className="text-emerald-400 font-bold hover:underline"
                >
                  إنشاء حساب جديد
                </button>
              </p>
            ) : (
              <p>
                لديك حساب بالفعل؟{' '}
                <button
                  onClick={() => { setMode('signin'); setErrorMsg(''); }}
                  className="text-emerald-400 font-bold hover:underline"
                >
                  تسجيل الدخول
                </button>
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
