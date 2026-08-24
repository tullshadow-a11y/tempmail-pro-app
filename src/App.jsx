import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Mail,
  Copy,
  RefreshCw,
  Inbox,
  Clock,
  Trash2,
  Eye,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Loader2,
  Globe,
  Shield,
  X,
  Pin,
  Printer,
  Download,
  Volume2,
  VolumeX,
  QrCode,
  Settings,
  ExternalLink
} from 'lucide-react';

// ==================== Translations ====================
const translations = {
  en: {
    appName: 'FlashMail',
    tagline: 'Professional Temporary Email Service',
    yourEmail: 'Your Temporary Email',
    copy: 'Copy',
    copied: 'Copied!',
    generateNew: 'Generate New Email',
    refreshInbox: 'Refresh Inbox',
    clearInbox: 'Clear Inbox',
    customUsername: 'Custom Username',
    enterUsername: 'Enter username...',
    selectDomain: 'Select Domain',
    createEmail: 'Create Email',
    inbox: 'Inbox',
    emptyInbox: 'Your inbox is empty',
    waitingEmails: 'Waiting for incoming emails...',
    selectEmail: 'Select an email to read',
    chooseMessage: 'Choose a message from your inbox',
    from: 'From',
    subject: 'Subject',
    date: 'Date',
    noSubject: '(No Subject)',
    noContent: 'No content available',
    attachments: 'Attachments',
    anonymous: 'Anonymous',
    autoRefresh: 'Auto-refresh: 4s',
    updated: 'Updated',
    justNow: 'Just now',
    secondsAgo: 's ago',
    minutesAgo: 'm ago',
    pinMessage: 'Pin Message',
    unpinMessage: 'Unpin Message',
    pinnedMessages: 'Pinned Messages',
    print: 'Print',
    download: 'Download',
    close: 'Close',
    qrCode: 'QR Code',
    scanQr: 'Scan this QR code to get the email address',
    soundOn: 'Sound On',
    soundOff: 'Sound Off',
    newEmailNotification: 'New email received!',
    errorGenerate: 'Failed to generate email. Please try again.',
    errorFetch: 'Failed to fetch messages. Will retry automatically.',
    errorRead: 'Failed to read message content.',
    adLabel: 'Advertisement',
    deleteConfirm: 'Are you sure you want to clear all messages?',
    language: 'Language',
    english: 'English',
    arabic: 'العربية'
  },
  ar: {
    appName: 'فلاش ميل',
    tagline: 'خدمة البريد المؤقت الاحترافية',
    yourEmail: 'بريدك المؤقت',
    copy: 'نسخ',
    copied: 'تم النسخ!',
    generateNew: 'إنشاء بريد جديد',
    refreshInbox: 'تحديث الصندوق',
    clearInbox: 'مسح الصندوق',
    customUsername: 'اسم مستخدم مخصص',
    enterUsername: 'أدخل اسم المستخدم...',
    selectDomain: 'اختر النطاق',
    createEmail: 'إنشاء البريد',
    inbox: 'صندوق الوارد',
    emptyInbox: 'صندوق الوارد فارغ',
    waitingEmails: 'في انتظار الرسائل الواردة...',
    selectEmail: 'اختر رسالة لقراءتها',
    chooseMessage: 'اختر رسالة من صندوق الوارد',
    from: 'من',
    subject: 'الموضوع',
    date: 'التاريخ',
    noSubject: '(بلا موضوع)',
    noContent: 'لا يوجد محتوى متاح',
    attachments: 'المرفقات',
    anonymous: 'مجهول الهوية',
    autoRefresh: 'تحديث تلقائي: ٤ ث',
    updated: 'تم التحديث',
    justNow: 'الآن',
    secondsAgo: 'ث',
    minutesAgo: 'د',
    pinMessage: 'تثبيت الرسالة',
    unpinMessage: 'إلغاء التثبيت',
    pinnedMessages: 'الرسائل المثبتة',
    print: 'طباعة',
    download: 'تحميل',
    close: 'إغلاق',
    qrCode: 'رمز الاستجابة السريعة',
    scanQr: 'امسح هذا الرمز للحصول على عنوان البريد',
    soundOn: 'تشغيل الصوت',
    soundOff: 'كتم الصوت',
    newEmailNotification: 'تم استلام رسالة جديدة!',
    errorGenerate: 'فشل إنشاء البريد. حاول مرة أخرى.',
    errorFetch: 'فشل جلب الرسائل. سيتم إعادة المحاولة تلقائياً.',
    errorRead: 'فشل قراءة محتوى الرسالة.',
    adLabel: 'إعلان',
    deleteConfirm: 'هل أنت متأكد من مسح جميع الرسائل؟',
    language: 'اللغة',
    english: 'English',
    arabic: 'العربية'
  }
};

const DOMAINS = ['1secmail.com', '1secmail.net', '1secmail.org', 'wwjmp.com', 'esiix.com', 'xojxe.com', 'yoggm.com'];

// ==================== AdBanner Component ====================
const AdBanner = ({ t }) => {
  useEffect(() => {
    const container = document.getElementById('ad-container-30830719');
    if (container && !container.hasChildNodes()) {
      try {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.src = '//www.highperformanceformat.com/30830719/invoke.js';
        container.appendChild(script);
      } catch (e) {
        console.error("Ad loading error", e);
      }
    }
  }, []);

  return (
    <div className="w-full my-4 flex justify-center">
      <div
        id="ad-container-30830719"
        className="min-h-[90px] w-full max-w-[728px] bg-white/5 rounded-xl border border-white/10 flex items-center justify-center overflow-hidden"
      >
        <span className="text-white/20 text-xs">{t.adLabel}</span>
      </div>
    </div>
  );
};

// ==================== Notification Sound ====================
const playNotificationSound = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(523.25, ctx.currentTime);
    oscillator.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
    oscillator.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2);
    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.5);
  } catch (e) {
    console.error('Sound play error', e);
  }
};

// ==================== Format Date ====================
const formatDate = (dateStr, lang) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleString(lang === 'ar' ? 'ar-SA' : 'en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// ==================== Main App Component ====================
export default function App() {
  const [lang, setLang] = useState(() => localStorage.getItem('flashmail-lang') || 'en');
  const [email, setEmail] = useState('');
  const [login, setLogin] = useState('');
  const [domain, setDomain] = useState('');
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(() => localStorage.getItem('flashmail-sound') !== 'false');
  const [showQr, setShowQr] = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const [customUser, setCustomUser] = useState('');
  const [customDomain, setCustomDomain] = useState(DOMAINS[0]);
  const [pinnedIds, setPinnedIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('flashmail-pinned') || '[]');
    } catch {
      return [];
    }
  });
  const [showPinned, setShowPinned] = useState(false);

  const t = translations[lang];
  const isRTL = lang === 'ar';
  const dropdownRef = useRef(null);
  const intervalRef = useRef(null);
  const prevCountRef = useRef(0);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Save language preference & set direction
  useEffect(() => {
    localStorage.setItem('flashmail-lang', lang);
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  }, [lang, isRTL]);

  // Save sound preference
  useEffect(() => {
    localStorage.setItem('flashmail-sound', soundEnabled);
  }, [soundEnabled]);

  // Save pinned messages
  useEffect(() => {
    localStorage.setItem('flashmail-pinned', JSON.stringify(pinnedIds));
  }, [pinnedIds]);

  // Generate random email
  const generateEmail = useCallback(async (user, dom) => {
    setLoading(true);
    setError(null);
    try {
      let fullEmail;
      if (user && dom) {
        fullEmail = `${user}@${dom}`;
      } else {
        const res = await fetch('https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=1');
        if (!res.ok) throw new Error('Failed to generate email');
        const data = await res.json();
        fullEmail = data[0];
      }
      const [u, d] = fullEmail.split('@');
      setEmail(fullEmail);
      setLogin(u);
      setDomain(d);
      setMessages([]);
      setSelectedMessage(null);
      setShowCustom(false);
    } catch (err) {
      setError(t.errorGenerate);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [t]);

  // Initial email generation on mount
  useEffect(() => {
    generateEmail();
  }, [generateEmail]);

  // Fetch inbox messages
  const fetchMessages = useCallback(async (silent = false) => {
    if (!login || !domain) return;
    if (!silent) setRefreshing(true);
    try {
      const res = await fetch(
        `https://www.1secmail.com/api/v1/?action=getMessages&login=${login}&domain=${domain}`
      );
      if (!res.ok) throw new Error('Failed to fetch messages');
      const data = await res.json();
      const newMessages = data || [];

      // Check for new messages and play sound
      if (silent && newMessages.length > prevCountRef.current && prevCountRef.current > 0 && soundEnabled) {
        playNotificationSound();
      }
      prevCountRef.current = newMessages.length;

      setMessages(newMessages);
      setLastUpdate(new Date());
      setError(null);
    } catch (err) {
      if (!silent) setError(t.errorFetch);
      console.error(err);
    } finally {
      if (!silent) setRefreshing(false);
    }
  }, [login, domain, t, soundEnabled]);

  // Auto-refresh inbox every 4 seconds
  useEffect(() => {
    if (!login || !domain) return;
    fetchMessages(true);
    intervalRef.current = setInterval(() => fetchMessages(true), 4000);
    return () => clearInterval(intervalRef.current);
  }, [login, domain, fetchMessages]);

  // Read specific message
  const readMessage = useCallback(async (msgId) => {
    if (!login || !domain || !msgId) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://www.1secmail.com/api/v1/?action=readMessage&login=${login}&domain=${domain}&id=${msgId}`
      );
      if (!res.ok) throw new Error('Failed to read message');
      const data = await res.json();
      setSelectedMessage({ ...data, id: msgId });
    } catch (err) {
      setError(t.errorRead);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [login, domain, t]);

  // Copy email to clipboard
  const copyEmail = async () => {
    if (!email) return;
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed', err);
    }
  };

  // Reset / Generate new email
  const resetInbox = () => {
    setMessages([]);
    setSelectedMessage(null);
    setLastUpdate(null);
    generateEmail();
    setShowDropdown(false);
  };

  // Clear all messages
  const clearInbox = () => {
    if (window.confirm(t.deleteConfirm)) {
      setMessages([]);
      setSelectedMessage(null);
    }
    setShowDropdown(false);
  };

  // Toggle pin message
  const togglePin = (msgId) => {
    setPinnedIds(prev => {
      if (prev.includes(msgId)) return prev.filter(id => id !== msgId);
      return [...prev, msgId];
    });
  };

  // Print message
  const printMessage = () => {
    if (!selectedMessage) return;
    const content = selectedMessage.htmlBody || selectedMessage.textBody || selectedMessage.body || '';
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html dir="${isRTL ? 'rtl' : 'ltr'}">
        <head>
          <title>${selectedMessage.subject || t.noSubject}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; line-height: 1.6; color: #333; }
            h2 { margin-bottom: 10px; }
            p { margin: 5px 0; }
            hr { margin: 20px 0; border: none; border-top: 1px solid #ddd; }
          </style>
        </head>
        <body>
          <h2>${selectedMessage.subject || t.noSubject}</h2>
          <p><strong>${t.from}:</strong> ${selectedMessage.from || 'Unknown'}</p>
          <p><strong>${t.date}:</strong> ${formatDate(selectedMessage.date, lang)}</p>
          <hr/>
          <div>${content}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  // Download message as text file
  const downloadMessage = () => {
    if (!selectedMessage) return;
    const content = selectedMessage.textBody || selectedMessage.body || selectedMessage.htmlBody || '';
    const textContent = `Subject: ${selectedMessage.subject || t.noSubject}\nFrom: ${selectedMessage.from || 'Unknown'}\nDate: ${formatDate(selectedMessage.date, lang)}\n\n${content}`;
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flashmail-${selectedMessage.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Relative time formatter
  const getRelativeTime = () => {
    if (!lastUpdate) return '';
    const diff = Math.floor((new Date() - lastUpdate) / 1000);
    if (diff < 5) return t.justNow;
    if (diff < 60) return `${diff}${t.secondsAgo}`;
    return `${Math.floor(diff / 60)}${t.minutesAgo}`;
  };

  // Create custom email
  const createCustomEmail = () => {
    if (!customUser.trim()) return;
    generateEmail(customUser.trim(), customDomain);
  };

  // Get pinned messages from current list
  const pinnedMessages = messages.filter(m => pinnedIds.includes(m.id));

  return (
    <div className={`min-h-screen bg-[#0a0a0f] text-white font-sans selection:bg-purple-500/30 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] left-[50%] w-[300px] h-[300px] bg-pink-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-6 md:py-10">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                {t.appName}
              </h1>
              <p className="text-white/50 text-xs md:text-sm">{t.tagline}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
              title={soundEnabled ? t.soundOff : t.soundOn}
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-green-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-white/40" />
              )}
            </button>
            <button
              onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-sm font-medium"
            >
              {lang === 'en' ? 'العربية' : 'English'}
            </button>
          </div>
        </header>

        {/* Ad Banner Top */}
        <AdBanner t={t} />

        {/* Email Address Card */}
        <div className="mb-6">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500" />
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
                  {/* Email Display */}
                  <div className="flex-1 min-w-0">
                    <label className="text-xs text-white/40 uppercase tracking-wider font-semibold mb-1.5 block">
                      {t.yourEmail}
                    </label>
                    <div className="flex items-center gap-3 bg-black/30 rounded-xl px-4 py-3 border border-white/5">
                      <Globe className="w-5 h-5 text-purple-400 shrink-0" />
                      <span className="text-lg md:text-xl font-mono text-white/90 truncate">
                        {email || '...'}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={copyEmail}
                      disabled={!email}
                      className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
                    >
                      {copied ? (
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                      ) : (
                        <Copy className="w-5 h-5 text-white/70" />
                      )}
                      <span className="hidden sm:inline text-sm font-medium">
                        {copied ? t.copied : t.copy}
                      </span>
                    </button>

                    <button
                      onClick={() => setShowQr(true)}
                      disabled={!email}
                      className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 transition-all disabled:opacity-30 active:scale-95"
                    >
                      <QrCode className="w-5 h-5 text-white/70" />
                    </button>

                    <div className="relative" ref={dropdownRef}>
                      <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="flex items-center gap-2 px-4 py-3 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 transition-all active:scale-95"
                      >
                        <RefreshCw className={`w-5 h-5 text-purple-400 ${loading ? 'animate-spin' : ''}`} />
                        <ChevronDown className={`w-4 h-4 text-purple-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                      </button>

                      {showDropdown && (
                        <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} top-full mt-2 w-64 bg-[#1a1a2e] backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-50`}>
                          <button
                            onClick={() => { setShowCustom(true); setShowDropdown(false); }}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left"
                          >
                            <Settings className="w-4 h-4 text-blue-400" />
                            <span className="text-sm">{t.customUsername}</span>
                          </button>
                          <button
                            onClick={resetInbox}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left"
                          >
                            <RefreshCw className="w-4 h-4 text-green-400" />
                            <span className="text-sm">{t.generateNew}</span>
                          </button>
                          <button
                            onClick={() => { fetchMessages(); setShowDropdown(false); }}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left"
                          >
                            <Inbox className="w-4 h-4 text-purple-400" />
                            <span className="text-sm">{t.refreshInbox}</span>
                          </button>
                          <div className="border-t border-white/5" />
                          <button
                            onClick={clearInbox}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span className="text-sm">{t.clearInbox}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Custom Email Form */}
                {showCustom && (
                  <div className="flex flex-col md:flex-row items-end gap-3 pt-3 border-t border-white/10 animate-[fadeIn_0.2s_ease-out]">
                    <div className="flex-1 w-full">
                      <label className="text-xs text-white/40 mb-1 block">{t.customUsername}</label>
                      <input
                        type="text"
                        value={customUser}
                        onChange={(e) => setCustomUser(e.target.value)}
                        placeholder={t.enterUsername}
                        className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/20 focus:outline-none focus:border-purple-500/50"
                      />
                    </div>
                    <div className="w-full md:w-48">
                      <label className="text-xs text-white/40 mb-1 block">{t.selectDomain}</label>
                      <select
                        value={customDomain}
                        onChange={(e) => setCustomDomain(e.target.value)}
                        className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500/50 appearance-none"
                      >
                        {DOMAINS.map(d => (
                          <option key={d} value={d} className="bg-[#1a1a2e]">{d}</option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={createCustomEmail}
                      disabled={!customUser.trim() || loading}
                      className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm font-medium active:scale-95"
                    >
                      {t.createEmail}
                    </button>
                    <button
                      onClick={() => setShowCustom(false)}
                      className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
                    >
                      <X className="w-5 h-5 text-white/50" />
                    </button>
                  </div>
                )}

                {/* Stats Bar */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-4 text-xs text-white/40">
                    <div className="flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5" />
                      <span>{t.anonymous}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{t.autoRefresh}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {lastUpdate && (
                      <div className="flex items-center gap-1.5 text-xs text-white/30">
                        <span className={`w-2 h-2 rounded-full ${refreshing ? 'bg-purple-400 animate-pulse' : 'bg-green-400'}`} />
                        <span>{t.updated} {getRelativeTime()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
            <button onClick={() => setError(null)} className="ml-auto hover:text-red-200">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Ad Banner Middle */}
        <AdBanner t={t} />

        {/* Pinned Messages Toggle */}
        {pinnedMessages.length > 0 && (
          <div className="mb-4">
            <button
              onClick={() => setShowPinned(!showPinned)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 text-sm hover:bg-yellow-500/20 transition-all"
            >
              <Pin className="w-4 h-4" />
              <span>{t.pinnedMessages} ({pinnedMessages.length})</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showPinned ? 'rotate-180' : ''}`} />
            </button>
            {showPinned && (
              <div className="mt-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden">
                {pinnedMessages.map(msg => (
                  <button
                    key={`pinned-${msg.id}`}
                    onClick={() => readMessage(msg.id)}
                    className="w-full text-left px-5 py-3 hover:bg-white/5 transition-all border-b border-white/5 last:border-0 flex items-center gap-3"
                  >
                    <Pin className="w-4 h-4 text-yellow-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-white/90 truncate">{msg.from}</span>
                        <span className="text-xs text-white/30">{formatDate(msg.date, lang)}</span>
                      </div>
                      <p className="text-sm text-white/60 truncate">{msg.subject || t.noSubject}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Messages List */}
          <div className={`lg:col-span-2 ${selectedMessage ? 'hidden lg:block' : 'block'}`}>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Inbox className="w-5 h-5 text-purple-400" />
                  <h2 className="font-semibold text-white/90">{t.inbox}</h2>
                  <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-medium">
                    {messages.length}
                  </span>
                </div>
                <button
                  onClick={() => fetchMessages()}
                  disabled={refreshing}
                  className="p-2 rounded-lg hover:bg-white/5 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 text-white/50 ${refreshing ? 'animate-spin' : ''}`} />
                </button>
              </div>

              <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                      <Inbox className="w-8 h-8 text-white/20" />
                    </div>
                    <p className="text-white/40 text-sm mb-1">{t.emptyInbox}</p>
                    <p className="text-white/20 text-xs">{t.waitingEmails}</p>
                  </div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {messages.map((msg) => {
                      const isPinned = pinnedIds.includes(msg.id);
                      return (
                        <div
                          key={msg.id}
                          className={`group relative px-5 py-4 transition-all duration-200 hover:bg-white/5 ${
                            selectedMessage?.id === msg.id ? 'bg-white/10' : ''
                          }`}
                        >
                          <button
                            onClick={() => readMessage(msg.id)}
                            className="w-full text-left"
                          >
                            <div className="flex items-start justify-between gap-3 mb-1">
                              <span className="text-sm font-medium text-white/90 truncate">
                                {msg.from || 'Unknown'}
                              </span>
                              <span className="text-xs text-white/30 shrink-0">
                                {formatDate(msg.date, lang)}
                              </span>
                            </div>
                            <p className="text-sm text-white/70 font-medium mb-1 truncate">
                              {msg.subject || t.noSubject}
                            </p>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-white/30 truncate">
                                {msg.body ? msg.body.substring(0, 60) + '...' : 'No preview'}
                              </span>
                              <Eye className="w-3.5 h-3.5 text-white/20 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                            </div>
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); togglePin(msg.id); }}
                            className={`absolute top-4 ${isRTL ? 'left-3' : 'right-3'} opacity-0 group-hover:opacity-100 transition-all p-1 rounded-lg hover:bg-white/10`}
                            title={isPinned ? t.unpinMessage : t.pinMessage}
                          >
                            <Pin className={`w-4 h-4 ${isPinned ? 'text-yellow-400 fill-yellow-400' : 'text-white/40'}`} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Message Detail */}
          <div className={`lg:col-span-3 ${selectedMessage ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden min-h-[400px]">
              {!selectedMessage ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[400px] px-4 text-center">
                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
                    <Mail className="w-10 h-10 text-white/20" />
                  </div>
                  <p className="text-white/40 text-lg font-medium mb-1">{t.selectEmail}</p>
                  <p className="text-white/20 text-sm">{t.chooseMessage}</p>
                </div>
              ) : (
                <div className="flex flex-col h-full">
                  {/* Message Header */}
                  <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
                    <button
                      onClick={() => setSelectedMessage(null)}
                      className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5 text-white/70" />
                    </button>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-white/90 truncate">
                        {selectedMessage.subject || t.noSubject}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-white/40 mt-1">
                        <span>{t.from}: {selectedMessage.from || 'Unknown'}</span>
                        <span>•</span>
                        <span>{formatDate(selectedMessage.date, lang)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => togglePin(selectedMessage.id)}
                        className={`p-2 rounded-lg hover:bg-white/5 transition-colors ${pinnedIds.includes(selectedMessage.id) ? 'text-yellow-400' : 'text-white/40'}`}
                        title={pinnedIds.includes(selectedMessage.id) ? t.unpinMessage : t.pinMessage}
                      >
                        <Pin className={`w-5 h-5 ${pinnedIds.includes(selectedMessage.id) ? 'fill-yellow-400' : ''}`} />
                      </button>
                      <button
                        onClick={printMessage}
                        className="p-2 rounded-lg hover:bg-white/5 transition-colors text-white/40 hover:text-white/70"
                        title={t.print}
                      >
                        <Printer className="w-5 h-5" />
                      </button>
                      <button
                        onClick={downloadMessage}
                        className="p-2 rounded-lg hover:bg-white/5 transition-colors text-white/40 hover:text-white/70"
                        title={t.download}
                      >
                        <Download className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setSelectedMessage(null)}
                        className="hidden lg:block p-2 rounded-lg hover:bg-white/5 transition-colors"
                      >
                        <X className="w-5 h-5 text-white/50" />
                      </button>
                    </div>
                  </div>

                  {/* Message Body */}
                  <div className="flex-1 p-5 overflow-y-auto custom-scrollbar">
                    {loading ? (
                      <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                      </div>
                    ) : (
                      <div className="prose prose-invert max-w-none">
                        {selectedMessage.htmlBody ? (
                          <iframe
                            srcDoc={`<style>body{color:#e5e5e5;font-family:sans-serif;line-height:1.6;padding:0;margin:0;max-width:100%;word-wrap:break-word;}a{color:#a78bfa;}img{max-width:100%;height:auto;}blockquote{border-left:3px solid #a78bfa;padding-left:1rem;margin-left:0;color:#ccc;}</style>${selectedMessage.htmlBody}`}
                            className="w-full min-h-[300px] bg-transparent border-0"
                            sandbox="allow-same-origin"
                            title="Email Content"
                          />
                        ) : selectedMessage.textBody ? (
                          <div className="text-white/80 whitespace-pre-wrap leading-relaxed">
                            {selectedMessage.textBody}
                          </div>
                        ) : selectedMessage.body ? (
                          <div className="text-white/80 whitespace-pre-wrap leading-relaxed">
                            {selectedMessage.body}
                          </div>
                        ) : (
                          <div className="text-white/30 text-center py-10">{t.noContent}</div>
                        )}
                      </div>
                    )}

                    {/* Attachments */}
                    {selectedMessage.attachments && selectedMessage.attachments.length > 0 && (
                      <div className="mt-6 pt-6 border-t border-white/10">
                        <h4 className="text-sm font-medium text-white/60 mb-3">
                          {t.attachments} ({selectedMessage.attachments.length})
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedMessage.attachments.map((att, idx) => (
                            <a
                              key={idx}
                              href={`https://www.1secmail.com/api/v1/?action=download&login=${login}&domain=${domain}&id=${selectedMessage.id}&file=${att.filename}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-sm text-purple-300"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span className="truncate max-w-[200px]">{att.filename}</span>
                              <span className="text-white/30 text-xs">({Math.round(att.size / 1024)} KB)</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Ad Banner Bottom */}
        <AdBanner t={t} />

        {/* Footer */}
        <footer className="mt-8 text-center">
          <div className="flex items-center justify-center gap-2 text-white/20 text-xs">
            <Shield className="w-3.5 h-3.5" />
            <span>FlashMail — {t.anonymous} • {t.autoRefresh}</span>
          </div>
        </footer>
      </div>

      {/* QR Code Modal */}
      {showQr && email && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowQr(false)}>
          <div className="bg-[#1a1a2e] border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{t.qrCode}</h3>
              <button onClick={() => setShowQr(false)} className="p-1 rounded-lg hover:bg-white/5">
                <X className="w-5 h-5 text-white/50" />
              </button>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="bg-white p-4 rounded-xl">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(email)}`}
                  alt="QR Code"
                  className="w-48 h-48"
                />
              </div>
              <p className="text-sm text-white/50 text-center">{t.scanQr}</p>
              <p className="text-sm font-mono text-purple-300 bg-purple-500/10 px-3 py-1 rounded-lg">{email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
