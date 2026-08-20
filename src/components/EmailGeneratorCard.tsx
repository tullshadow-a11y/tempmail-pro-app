import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Copy, 
  Check, 
  RefreshCw, 
  Edit3, 
  Trash2, 
  QrCode, 
  Shield, 
  Clock, 
  Sparkles,
  ChevronDown,
  Lock,
  ArrowRight
} from 'lucide-react';
import { Account, DomainItem } from '../types';

interface EmailGeneratorCardProps {
  account: Account | null;
  domains: DomainItem[];
  isLoading: boolean;
  isRefreshing: boolean;
  refreshSecondsLeft: number;
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

  const emailAddress = account?.address || 'جاري توليد البريد المؤقت...';

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
      setCustomError('الرجاء إدخال اسم المستخدم المطلوب');
      return;
    }
    const cleanUser = customUsername.trim().toLowerCase().replace(/[^a-z0-9._-]/g, '');
    if (cleanUser.length < 3) {
      setCustomError('يجب أن يحتوي الاسم على 3 أحرف على الأقل (بالإنجليزية)');
      return;
    }

    try {
      setIsChanging(true);
      await onChangeEmail(cleanUser, selectedDomain || domains[0]?.domain);
      setShowCustomModal(false);
    } catch (err: any) {
      setCustomError('تعذر إنشاء البريد المخصص، يرجى تجربة اسم أو نطاق آخر');
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
      <div className="relative overflow-hidden rounded-3xl bg-slate-900/95 border border-slate-700/80 shadow-2xl p-5 sm:p-7 backdrop-blur-xl">
        {/* Glow decorative effects */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-xs sm:text-sm font-semibold text-emerald-400">
              بريدك الإلكتروني المؤقت جاهز ونشط
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
              تلقائي وآمن 100%
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>التحديث التلقائي خلال:</span>
            <span className="font-mono font-bold text-emerald-400 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700">
              {refreshSecondsLeft} ثانية
            </span>
          </div>
        </div>

        {/* The Email Display Box */}
        <div className="relative mb-6">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-2.5 sm:p-3 rounded-2xl bg-slate-950/90 border border-slate-700/80 focus-within:border-emerald-500/60 transition-all shadow-inner">
            <div className="flex-1 flex items-center gap-3 px-3 py-2 overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
                <Shield className="w-5 h-5" />
              </div>
              <div className="overflow-hidden flex-1 text-left dir-ltr">
                <span className="text-xs text-slate-400 block font-sans text-right dir-rtl">عنوان البريد المؤقت:</span>
                <input
                  type="text"
                  readOnly
                  value={emailAddress}
                  className="w-full bg-transparent font-mono-code font-bold text-base sm:text-lg md:text-xl text-emerald-400 outline-none select-all truncate cursor-pointer tracking-wide"
                  onClick={handleCopy}
                  title="انقر للنسخ"
                />
              </div>
            </div>

            {/* Quick Action buttons in display */}
            <div className="flex items-center gap-2 justify-end shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
              <button
                id="btn-copy-email-main"
                onClick={handleCopy}
                disabled={isLoading || !account}
                className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all shadow-lg active:scale-95 ${
                  copied
                    ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/30'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
                }`}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'تم النسخ بنجاح!' : 'نسخ البريد'}</span>
              </button>

              <button
                id="btn-qr-modal-open"
                onClick={onOpenQR}
                disabled={isLoading || !account}
                title="عرض رمز QR للهاتف"
                className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all"
              >
                <QrCode className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* 4 Core Action Buttons Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
          {/* 1. Copy Button */}
          <button
            id="btn-action-copy"
            onClick={handleCopy}
            disabled={isLoading || !account}
            className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700/80 hover:border-emerald-500/40 transition-all text-xs sm:text-sm font-semibold active:scale-95 group"
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Copy className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            )}
            <span>{copied ? 'تم النسخ' : 'نسخ الإيميل'}</span>
          </button>

          {/* 2. Refresh Inbox */}
          <button
            id="btn-action-refresh"
            onClick={onRefresh}
            disabled={isRefreshing || isLoading}
            className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700/80 hover:border-teal-500/40 transition-all text-xs sm:text-sm font-semibold active:scale-95 group"
          >
            <RefreshCw className={`w-4 h-4 text-teal-400 ${isRefreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
            <span>{isRefreshing ? 'جاري التحديث...' : 'تحديث الوارد'}</span>
          </button>

          {/* 3. Change Email (Custom or Random) */}
          <button
            id="btn-action-change"
            onClick={handleOpenCustomModal}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700/80 hover:border-amber-500/40 transition-all text-xs sm:text-sm font-semibold active:scale-95 group"
          >
            <Edit3 className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            <span>تغيير الإيميل</span>
          </button>

          {/* 4. Delete Email */}
          <button
            id="btn-action-delete"
            onClick={onDeleteEmail}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-slate-800/80 hover:bg-rose-950/40 text-slate-200 hover:text-rose-200 border border-slate-700/80 hover:border-rose-500/40 transition-all text-xs sm:text-sm font-semibold active:scale-95 group"
          >
            <Trash2 className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
            <span>حذف وإنشاء جديد</span>
          </button>
        </div>

        {/* Auto Refresh Progress bar */}
        <div className="mt-4 w-full bg-slate-950 rounded-full h-1 overflow-hidden">
          <motion.div
            className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full"
            initial={{ width: '0%' }}
            animate={{ width: `${((10 - refreshSecondsLeft) / 10) * 100}%` }}
            transition={{ duration: 1, ease: 'linear' }}
          />
        </div>
      </div>

      {/* Change / Custom Email Modal */}
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
                  <h3 className="text-lg font-bold text-white">تخصيص وتغيير البريد</h3>
                  <p className="text-xs text-slate-400">اختر اسماً مخصصاً أو ولد بريداً عشوائياً جديداً</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleApplyCustomEmail} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  اسم المستخدم (بالإنجليزية):
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={customUsername}
                    onChange={(e) => setCustomUsername(e.target.value)}
                    placeholder="e.g. myname, test.user, john"
                    dir="ltr"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-emerald-400 font-mono focus:border-emerald-500 focus:outline-none placeholder-slate-600 text-left"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  اختر النطاق (Domain):
                </label>
                <div className="relative">
                  <select
                    value={selectedDomain}
                    onChange={(e) => setSelectedDomain(e.target.value)}
                    dir="ltr"
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
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono text-center text-emerald-400 dir-ltr truncate">
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
                  className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  {isChanging ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>حفظ البريد المخصص</span>
                </button>

                <button
                  type="button"
                  onClick={handleRandomChange}
                  disabled={isChanging}
                  className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-700 transition-all flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>توليد عشوائي</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setShowCustomModal(false)}
                className="w-full text-center text-xs text-slate-400 hover:text-slate-200 pt-1"
              >
                إلغاء
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
