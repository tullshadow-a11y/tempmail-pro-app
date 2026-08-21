import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Copy, 
  Check, 
  RefreshCw, 
  Trash2, 
  Clock, 
  Plus,
  ChevronDown,
  Sparkles,
  Edit3,
  Mail
} from 'lucide-react';
import { Account, DomainItem } from '../types';
import { LanguageOption, t } from '../utils/i18n';

interface EmailGeneratorCardProps {
  account: Account | null;
  domains: DomainItem[];
  isLoading: boolean;
  isRefreshing: boolean;
  refreshSecondsLeft: number;
  currentLang: LanguageOption;
  onRefresh: () => void;
  onChangeEmail: (customUsername?: string, customDomain?: string) => Promise<void>;
  onDeleteEmail: () => Promise<void>;
  onOpenQR: () => void;
}

export const EmailGeneratorCard: React.FC<EmailGeneratorCardProps> = ({
  account,
  domains,
  isLoading,
  isRefreshing,
  refreshSecondsLeft,
  currentLang,
  onRefresh,
  onChangeEmail,
  onDeleteEmail,
}) => {
  const [copied, setCopied] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customUsername, setCustomUsername] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('');
  const [customError, setCustomError] = useState('');
  const [isChanging, setIsChanging] = useState(false);

  const t = translations[language];
  const emailAddress = account?.address || 'جاري إنشاء بريد إلكتروني مؤقت...';

  // Format countdown mm:ss (e.g. 09:59 or 00:10)
  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const formattedMins = String(mins).padStart(2, '0');
    const formattedSecs = String(secs).padStart(2, '0');
    return `${formattedMins}:${formattedSecs}`;
  };

  const handleCopy = () => {
    if (!account?.address) return;
    navigator.clipboard.writeText(account.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleOpenCustomModal = () => {
    const currentPrefix = account?.address ? account.address.split('@')[0] : '';
    const currentDom = account?.address ? account.address.split('@')[1] : (domains[0]?.domain || '');
    setCustomUsername(currentPrefix);
    setSelectedDomain(currentDom || domains[0]?.domain || '');
    setCustomError('');
    setShowCustomModal(true);
  };

  const handleApplyCustomEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUsername.trim()) {
      setCustomError('يرجى إدخال اسم المستخدِم');
      return;
    }
    const cleanUser = customUsername.trim().toLowerCase().replace(/[^a-z0-9._-]/g, '');
    if (cleanUser.length < 3) {
      setCustomError('يجب أن يتكون اسم المستخدم من 3 أحرف على الأقل');
      return;
    }

    try {
      setIsChanging(true);
      await onChangeEmail(cleanUser, selectedDomain || domains[0]?.domain);
      setShowCustomModal(false);
    } catch (err: any) {
      setCustomError('Could not create custom email. Please try another username.');
    } finally {
      setIsChanging(false);
    }
  };

  const handleNewEmailClick = async () => {
    try {
      setIsChanging(true);
      await onChangeEmail();
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-8 px-4">
      {/* Hero Headline Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-3">
          {t('heroTitle', currentLang.code)}
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
          {t('heroSub', currentLang.code)}
        </p>
      </div>

      {/* Hero Dark Glassmorphism Card */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900/95 border border-slate-700/80 shadow-2xl p-6 sm:p-8 backdrop-blur-xl">
        {/* Glow Effects */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Active Countdown Display & Card Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-6">
          <div className="flex items-center gap-2 font-mono text-emerald-400 font-bold text-base sm:text-lg tracking-wider">
            <span>{formatCountdown(refreshSecondsLeft)}</span>
            <div className="w-7 h-7 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/30">
              <Clock className="w-4 h-4 text-emerald-400 animate-pulse" />
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-300 text-sm font-bold">
            <span>{t('tempMailAddress', currentLang.code)}</span>
            <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Mail className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Centered Email Display Box with Glowing Border & Green Copy Button inside */}
        <div className="relative mb-6">
          <div className="p-6 rounded-2xl bg-slate-950/80 border-2 border-cyan-500/70 shadow-lg shadow-cyan-500/10 text-center flex flex-col items-center justify-center gap-4">
            <input
              type="text"
              readOnly
              value={emailAddress}
              onClick={handleCopy}
              title="Click to copy"
              className="w-full bg-transparent font-mono text-cyan-300 font-bold text-lg sm:text-xl md:text-2xl outline-none text-center cursor-pointer tracking-wider select-all truncate"
            />

            {/* Centered Circular Green Copy Button */}
            <button
              id="btn-copy-email-inside"
              onClick={handleCopy}
              disabled={isLoading || !account}
              title={copied ? t('copied', currentLang.code) : t('copyEmail', currentLang.code)}
              className={`w-12 h-12 rounded-full border border-emerald-400/40 flex items-center justify-center transition-all shadow-lg active:scale-95 ${
                copied
                  ? 'bg-emerald-400 text-slate-950 shadow-emerald-400/50'
                  : 'bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-400 shadow-emerald-500/20'
              }`}
            >
              {copied ? <Check className="w-5 h-5 stroke-[2.5]" /> : <Copy className="w-5 h-5 stroke-[2.5]" />}
            </button>
          </div>
        </div>

        {/* Three Distinct Action Buttons arranged in 2 rows as in image */}
        <div className="space-y-3">
          {/* Top Row: Blue Solid "New Mail" & Yellow Outlined "Refresh" */}
          <div className="grid grid-cols-2 gap-3">
            <button
              id="btn-action-new-mail"
              onClick={handleNewEmailClick}
              disabled={isLoading || isChanging}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-600/30 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>{t('newMail', currentLang.code)}</span>
            </button>

            <button
              id="btn-action-refresh-yellow"
              onClick={onRefresh}
              disabled={isRefreshing || isLoading}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-transparent border border-amber-400 hover:bg-amber-400/10 text-amber-300 font-bold text-sm sm:text-base transition-all active:scale-95"
            >
              <RefreshCw className={`w-4 h-4 text-amber-400 stroke-[2.5] ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{t('refresh', currentLang.code)}</span>
            </button>
          </div>

          {/* Bottom Row: Red Outlined "Delete" Centered */}
          <div className="flex justify-center">
            <button
              id="btn-action-delete-red"
              onClick={onDeleteEmail}
              disabled={isLoading}
              className="w-1/2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-full bg-transparent border border-rose-500/80 hover:bg-rose-500/10 text-rose-300 font-bold text-sm sm:text-base transition-all active:scale-95"
            >
              <Trash2 className="w-4 h-4 text-rose-400 stroke-[2.5]" />
              <span>{t('delete', currentLang.code)}</span>
            </button>
          </div>
        </div>

        {/* Secondary Custom Alias Button */}
        <div className="mt-4 text-center">
          <button
            onClick={handleOpenCustomModal}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 font-semibold transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{t('changeEmail', currentLang.code)}</span>
          </button>
        </div>
      </div>

      {/* Custom Username Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => !isChanging && setShowCustomModal(false)}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl z-10 text-start"
          >
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{t('changeEmail', currentLang.code)}</h3>
                  <p className="text-xs text-slate-400">Specify custom prefix and domain</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleApplyCustomEmail} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {t.usernameLabel}
                </label>
                <input
                  type="text"
                  value={customUsername}
                  onChange={(e) => setCustomUsername(e.target.value)}                  placeholder="e.g. user.test"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-emerald-400 font-mono focus:border-emerald-500 focus:outline-none placeholder-slate-600 text-left"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {t.domainLabel}
                </label>
                <div className="relative">
                  <select
                    value={selectedDomain}
                    onChange={(e) => setSelectedDomain(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 font-mono focus:border-emerald-500 focus:outline-none appearance-none"
                  >
                    {domains.map((dom) => (
                      <option key={dom.id} value={dom.domain}>
                        @{dom.domain}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute left-3 top-3.5 pointer-events-none" />
                </div>
              </div>

              {customError && (
                <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
                  {customError}
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isChanging}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  {isChanging ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>Save</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-700 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
