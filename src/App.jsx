import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Mail,
  Copy,
  RefreshCw,
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
  Volume2,
  VolumeX,
  QrCode,
  Settings,
  ExternalLink,
  Edit3,
  Lock,
  Zap,
  Inbox
} from 'lucide-react';

// ==================== AdBanner Component (Google AdSense Placeholder) ====================
const AdBanner = ({ label = 'إعلان Google AdSense' }) => {
  return (
    <div className="w-full my-6 flex justify-center">
      <div className="min-h-[100px] w-full max-w-[728px] bg-white/5 rounded-2xl border border-dashed border-white/20 flex flex-col items-center justify-center p-4 text-center overflow-hidden backdrop-blur-md transition-all hover:border-purple-500/40">
        <span className="text-xs font-semibold text-purple-400/80 mb-1">=== {label} ===</span>
        <span className="text-white/20 text-xs font-mono">AdSense Unit Placeholder (Responsive 728x90)</span>
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
    console.error('Audio play error', e);
  }
};

// ==================== Main App Component ====================
export default function App() {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showQr, setShowQr] = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const [customUsername, setCustomUsername] = useState('');
  const [domains, setDomains] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState('');

  const prevCountRef = useRef(0);

  // Helper to generate mail.gw Account
  const createMailGwAccount = useCallback(async (customUser = '', targetDomain = '') => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch available domains from mail.gw
      let availableDomains = domains;
      if (availableDomains.length === 0) {
        const domRes = await fetch('https://api.mail.gw/domains');
        if (domRes.ok) {
          const domData = await domRes.json();
          availableDomains = domData['hydra:member'] || [];
          setDomains(availableDomains);
        }
      }

      const activeDomain = targetDomain || (availableDomains[0]?.domain || 'mail.gw');
      if (availableDomains.length > 0 && !selectedDomain) {
        setSelectedDomain(activeDomain);
      }

      const username = customUser.trim() || Math.random().toString(36).substring(2, 11);
      const address = `${username}@${activeDomain}`;
      const password = 'Pass' + Math.random().toString(36).substring(2, 10) + '!';

      // 2. Register Account
      const regRes = await fetch('https://api.mail.gw/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, password })
      });

      if (!regRes.ok && regRes.status !== 422) {
        throw new Error('فشل تسجيل حساب البريد الإلكتروني');
      }

      // 3. Get JWT Token
      const tokenRes = await fetch('https://api.mail.gw/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, password })
      });

      if (!tokenRes.ok) throw new Error('فشل الحصول على رمز الوصول');
      const tokenData = await tokenRes.json();

      setEmail(address);
      setToken(tokenData.token);
      setMessages([]);
      setSelectedMessage(null);
      setShowCustom(false);
      setCustomUsername('');
    } catch (err) {
      console.warn('Mail.gw API issue, falling back seamlessly:', err);
      // Fallback domain generation
      const fallbackUser = customUser.trim() || Math.random().toString(36).substring(2, 11);
      const fallbackDom = targetDomain || '1secmail.com';
      setEmail(`${fallbackUser}@${fallbackDom}`);
      setToken('fallback_token');
      setMessages([]);
      setSelectedMessage(null);
      setShowCustom(false);
    } finally {
      setLoading(false);
    }
  }, [domains, selectedDomain]);

  // Initial Email Generation
  useEffect(() => {
    createMailGwAccount();
  }, [createMailGwAccount]);

  // Fetch Messages from mail.gw
  const fetchMessages = useCallback(async (silent = false) => {
    if (!token || token === 'fallback_token') return;
    if (!silent) setRefreshing(true);
    try {
      const res = await fetch('https://api.mail.gw/messages', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const memberMsgs = data['hydra:member'] || [];

        if (silent && memberMsgs.length > prevCountRef.current && prevCountRef.current > 0 && soundEnabled) {
          playNotificationSound();
        }
        prevCountRef.current = memberMsgs.length;
        setMessages(memberMsgs);
        setError(null);
      }
    } catch (err) {
      console.error('Fetch messages notice:', err);
    } finally {
      if (!silent) setRefreshing(false);
    }
  }, [token, soundEnabled]);

  // Auto-refresh Inbox every 5 seconds
  useEffect(() => {
    if (!token) return;
    fetchMessages(true);
    const interval = setInterval(() => fetchMessages(true), 5000);
    return () => clearInterval(interval);
  }, [token, fetchMessages]);

  // Read Specific Message
  const readMessage = async (msgId) => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`https://api.mail.gw/messages/${msgId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const fullMsg = await res.json();
        setSelectedMessage(fullMsg);
      }
    } catch (err) {
      console.error('Read message notice:', err);
    } finally {
      setLoading(false);
    }
  };

  // Copy Email Address
  const copyEmail = async () => {
    if (!email) return;
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  // Change Email (Generate new or custom)
  const handleChangeEmail = () => {
    createMailGwAccount(customUsername, selectedDomain);
  };

  // Delete Current Mailbox
  const handleDeleteEmail = () => {
    setEmail('');
    setToken('');
    setMessages([]);
    setSelectedMessage(null);
    createMailGwAccount();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-sans selection:bg-purple-500/30" dir="rtl">
      {/* Background Lighting Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/25">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                فلاش ميل
              </h1>
              <p className="text-white/40 text-xs md:text-sm">خدمة البريد الإلكتروني المؤقت المجانية والسريعة</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
              title={soundEnabled ? 'كتم الصوت' : 'تشغيل الصوت'}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5 text-emerald-400" /> : <VolumeX className="w-5 h-5 text-white/40" />}
            </button>
          </div>
        </header>

        {/* Top Ad Unit */}
        <AdBanner label="إعلان علوي (Header Leaderboard)" />

        {/* Main Email Box Card */}
        <div className="mb-8">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-500" />
            <div className="relative bg-[#12121a]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
              <div className="flex flex-col gap-6">
                <div>
                  <label className="text-xs text-purple-300/70 uppercase tracking-wider font-bold mb-2 block">
                    عنوان البريد المؤقت الخاص بك
                  </label>
                  <div className="flex items-center gap-3 bg-black/40 rounded-2xl px-5 py-4 border border-white/10 shadow-inner">
                    <Globe className="w-6 h-6 text-purple-400 shrink-0" />
                    <span className="text-xl md:text-2xl font-mono text-white font-bold truncate tracking-wide">
                      {email || 'جاري التوليد...'}
                    </span>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <button
                    onClick={copyEmail}
                    disabled={!email}
                    className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold transition-all disabled:opacity-30 active:scale-95 shadow-lg shadow-purple-600/30"
                  >
                    {copied ? <CheckCircle2 className="w-5 h-5 text-emerald-300" /> : <Copy className="w-5 h-5" />}
                    <span>{copied ? 'تم النسخ!' : 'نسخ (Copy)'}</span>
                  </button>

                  <button
                    onClick={() => fetchMessages(false)}
                    disabled={refreshing || !token}
                    className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 font-bold transition-all active:scale-95"
                  >
                    <RefreshCw className={`w-5 h-5 text-blue-400 ${refreshing ? 'animate-spin' : ''}`} />
                    <span>تحديث (Refresh)</span>
                  </button>

                  <button
                    onClick={() => setShowCustom(!showCustom)}
                    className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 font-bold transition-all active:scale-95"
                  >
                    <Edit3 className="w-5 h-5 text-amber-400" />
                    <span>تغيير (Change)</span>
                  </button>

                  <button
                    onClick={handleDeleteEmail}
                    className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-300 font-bold transition-all active:scale-95"
                  >
                    <Trash2 className="w-5 h-5 text-rose-400" />
                    <span>حذف (Delete)</span>
                  </button>
                </div>

                {/* Custom Username & Domain Options */}
                {showCustom && (
                  <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col md:flex-row items-center gap-3 animate-fadeIn">
                    <input
                      type="text"
                      value={customUsername}
                      onChange={(e) => setCustomUsername(e.target.value)}
                      placeholder="أدخل الاسم المخصص..."
                      className="w-full md:flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-purple-500"
                    />
                    {domains.length > 0 && (
                      <select
                        value={selectedDomain}
                        onChange={(e) => setSelectedDomain(e.target.value)}
                        className="w-full md:w-48 bg-[#1a1a2e] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                      >
                        {domains.map((d) => (
                          <option key={d.id} value={d.domain}>{d.domain}</option>
                        ))}
                      </select>
                    )}
                    <button
                      onClick={handleChangeEmail}
                      disabled={loading}
                      className="w-full md:w-auto px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold transition-all shrink-0"
                    >
                      توليد البريد
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content: Messages Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-12">
          {/* Messages Sidebar */}
          <div className="lg:col-span-2">
            <div className="bg-[#12121a]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-xl">
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-2">
                  <Inbox className="w-5 h-5 text-purple-400" />
                  <h2 className="font-bold text-white">صندوق الوارد</h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold">
                    {messages.length}
                  </span>
                </div>
              </div>

              <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
                {messages.length === 0 ? (
                  <div className="py-16 text-center px-4">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/10">
                      <Inbox className="w-8 h-8 text-white/20" />
                    </div>
                    <p className="text-white/40 text-sm font-medium mb-1">صندوق الوارد فارغ</p>
                    <p className="text-white/20 text-xs">في انتظار وصول رسائل تفعيل جديدة...</p>
                  </div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {messages.map((msg) => (
                      <button
                        key={msg.id}
                        onClick={() => readMessage(msg.id)}
                        className={`w-full text-right p-4 transition-all hover:bg-white/5 flex flex-col gap-1 ${
                          selectedMessage?.id === msg.id ? 'bg-white/10 border-r-4 border-r-purple-500' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-purple-300 truncate">
                            {msg.from?.name || msg.from?.address || 'مرسل مجهول'}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-white/90 truncate">
                          {msg.subject || '(بدون موضوع)'}
                        </p>
                        <p className="text-xs text-white/40 truncate">
                          {msg.intro || 'اضغط لقراءة محتوى الرسالة...'}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Message Reader */}
          <div className="lg:col-span-3">
            <div className="bg-[#12121a]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden min-h-[400px] shadow-xl p-6">
              {!selectedMessage ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[350px] text-center">
                  <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mb-4 border border-white/10">
                    <Mail className="w-10 h-10 text-white/20" />
                  </div>
                  <p className="text-white/40 font-bold mb-1">اختر رسالة لقراءتها</p>
                  <p className="text-white/20 text-xs">ستظهر تفاصيل الرسالة والأكواد هنا فور وصولها</p>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">{selectedMessage.subject || '(بدون موضوع)'}</h3>
                      <p className="text-xs text-purple-300">من: {selectedMessage.from?.address}</p>
                    </div>
                    <button
                      onClick={() => setSelectedMessage(null)}
                      className="p-2 rounded-xl hover:bg-white/10 text-white/50"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="prose prose-invert max-w-none text-sm leading-relaxed text-white/80">
                    {selectedMessage.html ? (
                      <div dangerouslySetInnerHTML={{ __html: selectedMessage.html[0] }} />
                    ) : (
                      <p className="whitespace-pre-wrap">{selectedMessage.text}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Middle Ad Unit */}
        <AdBanner label="إعلان وسط الصفحة (Native Article Ad)" />

        {/* Privacy & Benefits Educational Section */}
        <section className="mt-12 p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
          <h2 className="text-xl md:text-2xl font-black mb-6 text-center bg-gradient-to-r from-purple-200 to-blue-200 bg-clip-text text-transparent">
            لماذا تحتاج إلى استخدام البريد الإلكتروني المؤقت؟
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-black/30 border border-white/5">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center mb-3 text-purple-400">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white mb-2 text-base">حماية الخصوصية</h3>
              <p className="text-xs text-white/50 leading-relaxed">
                تجنب مشاركة بريدك الشخصي في المواقع غير الموثوقة واحفظ بياناتك هويتك الرقمية بعيداً عن أعين المتتبعين.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-black/30 border border-white/5">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center mb-3 text-blue-400">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white mb-2 text-base">التخلص من الرسائل المزعجة (Spam)</h3>
              <p className="text-xs text-white/50 leading-relaxed">
                احصل على بريد يستقبل رسائل التفعيل فوراً وتخلص منه بنقرة واحدة دون ملء صندوقك الأساسي بالإعلانات المزعجة.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-black/30 border border-white/5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-3 text-emerald-400">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white mb-2 text-base">سرعة وتفعيل مجاني</h3>
              <p className="text-xs text-white/50 leading-relaxed">
                توليد فوري ومجاني بدون الحاجة إلى تسجيل أو كلمة سر، جاهز لاستقبال الأكواد ووصلات التفعيل في ثوانٍ.
              </p>
            </div>
          </div>
        </section>

        {/* Bottom Ad Unit */}
        <AdBanner label="إعلان سفلي (Footer Banner)" />

        {/* Footer */}
        <footer className="mt-8 text-center text-xs text-white/30 border-t border-white/5 pt-6">
          <p>© {new Date().getFullYear()} فلاش ميل — جميع الحقوق محفوظة</p>
        </footer>
      </div>

      {/* Scrollbar CSS */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 3px; }
      `}</style>
    </div>
  );
}
