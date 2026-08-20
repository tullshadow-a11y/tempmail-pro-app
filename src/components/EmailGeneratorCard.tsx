import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Copy, 
  Check, 
  RefreshCw, 
  Trash2, 
  QrCode, 
  Shield, 
  Clock, 
  PlusCircle,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { Account, DomainItem } from '../types';
import { Language, translations } from '../utils/i18n';

interface EmailGeneratorCardProps {
  account: Account | null;
  domains: DomainItem[];
  isLoading: boolean;
  isRefreshing: boolean;
  refreshSecondsLeft: number;
  language: Language;
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
  language,
  onRefresh,
  onChangeEmail,
  onDeleteEmail,
  onOpenQR,
}) => {
  const [copied, setCopied] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customUsername, setCustomUsername] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('');
  const [customError, setCustomError] = useState('');
  const [isChanging, setIsChanging] = useState(false);

  const t = translations[language];
  const emailAddress = account?.address || 'جاري إنشاء بريد إلكتروني مؤقت...';

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
      setCustomError('تعذر إنشاء البريد المخصص. يرجى اختيار اسم آخر.');
    } finally {
      setIsChanging(false);
    }
  };

  const handleRandomChange = async () => {
    try {
      setIsChanging(true);
      await onChangeEmail();
      setShowCustomModal(false);
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-6 px-4">
      {/* Dark Glassmorphism Mail Card */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl p-5 sm:p-7 backdrop-blur-xl">
        {/* Glow ambient background effects */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Row with Countdown Timer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </span>
            <span className="text-xs sm:text-sm font-semibold text-emerald-400">
              {t.activeStatus}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>{t.autoRefreshIn}</span>
            <span className="font-mono font-bold text-emerald-400 bg-slate-950 px-2.5 py-0.5 rounded-md border border-slate-800">
              {refreshSecondsLeft}s
            </span>
          </div>
        </div>

        {/* The Mail Display Box with GREEN Email Copy Button */}
        <div className="relative mb-6">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3 sm:p-3.5 rounded-2xl bg-slate-950/95 border border-slate-800 focus-within:border-emerald-500/60 transition-all shadow-inner">
            <div className="flex-1 flex items-center gap-3 px-2 overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
                <Shield className="w-5 h-5" />
              </div>
              <div className="overflow-hidden flex-1 text-start">
                <span className="text-[11px] text-slate-400 block">{t.emailLabel}</span>
                <input
                  type="text"
                  readOnly
                  value={emailAddress}
                  className="w-full bg-transparent font-mono-code font-bold text-base sm:text-lg text-emerald-400 outline-none select-all truncate cursor-pointer tracking-wide"
                  onClick={handleCopy}
                  title="انقر للنسخ"
                />
              </div>
            </div>

            {/* Quick Actions in Display Bar (Green Copy Button) */}
            <div className="flex items-center gap-2 justify-end shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
              <button
                id="btn-copy-email-green"
                onClick={handleCopy}
                disabled={isLoading || !account}
                className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-lg active:scale-95 ${
                  copied
                    ? 'bg-emerald-400 text-slate-950 shadow-emerald-500/30'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
                }`}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? t.copied : t.copyEmail}</span>
              </button>

              <button
                id="btn-qr-code-open"
                onClick={onOpenQR}
                disabled={isLoading || !account}
                title={t.qrCodeTitle}
                className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all"
              >
                <QrCode className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* 3 Core Action Buttons Bar (Strict Reference Match) */}
        {/* Blue: "بريد جديد" | Outlined Yellow: "تحديث" | Outlined Red: "حذف" */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Blue Button: "بريد جديد" */}
          <button
            id="btn-action-new-email"
            onClick={handleOpenCustomModal}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-900/30 transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t.btnNewEmail}</span>
          </button>

          {/* Outlined Yellow Button: "تحديث" */}
          <button
            id="btn-action-refresh-yellow"
            onClick={onRefresh}
            disabled={isRefreshing || isLoading}
            className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-transparent hover:bg-amber-500/10 text-amber-300 border-2 border-amber-400/80 font-bold text-sm transition-all active:scale-95"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
            <span>{isRefreshing ? 'جاري التحديث...' : t.btnRefresh}</span>
          </button>

          {/* Outlined Red Button: "حذف" */}
          <button
            id="btn-action-delete-red"
            onClick={onDeleteEmail}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-transparent hover:bg-rose-500/10 text-rose-400 border-2 border-rose-500/80 font-bold text-sm transition-all active:scale-95"
          >
            <Trash2 className="w-4 h-4" />
            <span>{t.btnDelete}</span>
          </button>
        </div>

        {/* Auto Refresh Progress bar */}
        <div className="mt-5 w-full bg-slate-950 rounded-full h-1 overflow-hidden">
          <motion.div
            className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full"
            initial={{ width: '0%' }}
            animate={{ width: `${((10 - refreshSecondsLeft) / 10) * 100}%` }}
            transition={{ duration: 1, ease: 'linear' }}
          />
        </div>
      </div>

      {/* Custom Email Creation Modal */}
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
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <PlusCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{t.customModalTitle}</h3>
                <p className="text-xs text-slate-400">{t.customModalSubtitle}</p>
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
                  onChange={(e) => setCustomUsername(e.target.value)}
                  placeholder="مثال: myname, test.user, john"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-emerald-400 font-mono focus:border-emerald-500 focus:outline-none placeholder-slate-600 text-start"
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
                    {domains.length === 0 && (
                      <option value="inboxbear.com">@inboxbear.com</option>
                    )}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute left-3 top-3.5 pointer-events-none" />
                </div>
              </div>

              {/* Preview */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono text-center text-emerald-400 truncate">
                {customUsername.trim() || 'username'}@{selectedDomain || domains[0]?.domain || 'inboxbear.com'}
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
                  <span>{t.saveCustom}</span>
                </button>

                <button
                  type="button"
                  onClick={handleRandomChange}
                  disabled={isChanging}
                  className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-700 transition-all flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>{t.randomEmail}</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setShowCustomModal(false)}
                className="w-full text-center text-xs text-slate-400 hover:text-slate-200 pt-1"
              >
                {t.cancel}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
