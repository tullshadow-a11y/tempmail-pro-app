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
  Edit3
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

  const emailAddress = account?.address || 'Generating temporary email...';

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
      setCustomError('Please enter a username');
      return;
    }
    const cleanUser = customUsername.trim().toLowerCase().replace(/[^a-z0-9._-]/g, '');
    if (cleanUser.length < 3) {
      setCustomError('Username must be at least 3 characters');
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
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Active Countdown Display */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40 shadow-inner">
            <Clock className="w-4 h-4 text-emerald-400 animate-pulse" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-semibold text-slate-300">
              {t('autoRefreshIn', currentLang.code)}
            </span>
            <span className="font-mono text-base sm:text-lg font-bold text-emerald-400 bg-slate-950 px-3 py-1 rounded-xl border border-slate-800 shadow-inner">
              {formatCountdown(refreshSecondsLeft)}
            </span>
          </div>
        </div>

        {/* Centered Email Box with Glowing Border & Green Copy Button */}
        <div className="relative mb-8">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3 sm:p-4 rounded-2xl bg-slate-950/90 border-2 border-emerald-500/60 shadow-lg shadow-emerald-500/10 transition-all">
            <div className="flex-1 overflow-hidden px-2 py-1 text-center md:text-left">
              <span className="text-xs text-slate-400 block font-sans mb-1">
                {t('tempMailAddress', currentLang.code)}
              </span>
              <input
                type="text"
                readOnly
                value={emailAddress}
                onClick={handleCopy}
                title="Click to copy"
                className="w-full bg-transparent font-mono-code font-bold text-lg sm:text-xl md:text-2xl text-emerald-400 outline-none select-all truncate text-center md:text-left cursor-pointer tracking-wide"
              />
            </div>

            {/* Inner Green Copy Button */}
            <button
              id="btn-copy-email-inside"
              onClick={handleCopy}
              disabled={isLoading || !account}
              className={`flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg shrink-0 active:scale-95 ${
                copied
                  ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/40'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
              }`}
            >
              {copied ? <Check className="w-5 h-5 stroke-[2.5]" /> : <Copy className="w-5 h-5 stroke-[2.5]" />}
              <span>{copied ? t('copied', currentLang.code) : t('copyEmail', currentLang.code)}</span>
            </button>
          </div>
        </div>

        {/* Three Distinct Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">

          {/* 1. Filled Blue "New Mail" / "بريد جديد" */}
          <button
            id="btn-action-new-mail"
            onClick={handleNewEmailClick}
            disabled={isLoading || isChanging}
            className="flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-600/30 transition-all active:scale-95 group"
          >
            <Plus className="w-5 h-5 group-hover:scale-110 transition-transform stroke-[2.5]" />
            <span>{t('newMail', currentLang.code)}</span>
          </button>

          {/* 2. Outlined Yellow "Refresh" / "تحديث" */}
          <button
            id="btn-action-refresh-yellow"
            onClick={onRefresh}
            disabled={isRefreshing || isLoading}
            className="flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-xl bg-transparent border-2 border-amber-400 hover:bg-amber-400/10 text-amber-300 font-bold text-sm sm:text-base shadow-lg transition-all active:scale-95 group"
          >
            <RefreshCw className={`w-5 h-5 text-amber-400 stroke-[2.5] ${isRefreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
            <span>{t('refresh', currentLang.code)}</span>
          </button>

          {/* 3. Outlined Red "Delete" / "حذف" */}
          <button
            id="btn-action-delete-red"
            onClick={onDeleteEmail}
            disabled={isLoading}
            className="flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-xl bg-transparent border-2 border-rose-500 hover:bg-rose-500/10 text-rose-300 font-bold text-sm sm:text-base shadow-lg transition-all active:scale-95 group"
          >
            <Trash2 className="w-5 h-5 text-rose-400 group-hover:scale-110 transition-transform stroke-[2.5]" />
            <span>{t('delete', currentLang.code)}</span>
          </button>
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
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            onClick={() => !isChanging && setShowCustomModal(false)}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-md bg-slate-900 border border-slate-700/90 rounded-3xl p-6 shadow-2xl z-10"
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
                  Username:
                </label>
                <input
                  type="text"
                  value={customUsername}
                  onChange={(e) => setCustomUsername(e.target.value)}
                  placeholder="e.g. user.test"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-emerald-400 font-mono focus:border-emerald-500 focus:outline-none placeholder-slate-600 text-left"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Select Domain:
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
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
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
                  className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-1.5"
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
