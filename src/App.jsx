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
  Lock,
  Zap,
  Inbox,
  Edit3,
  Plus,
  Settings,
  LayoutDashboard,
  FileText,
  Link as LinkIcon,
  LogOut,
  Check,
  CreditCard,
  Star,
  ExternalLink,
  BookOpen,
  User,
  Key
} from 'lucide-react';

import { MailGwService } from './services/mailGw';
import { StorageService } from './services/storage';
import { DailyLimitModal } from './components/DailyLimitModal';
import { AuthModal } from './components/AuthModal';

// ==================== Storage Keys & Initial Data ====================
const STORAGE_KEYS = {
  ARTICLES: 'flashmail_articles',
  HEADER_LINKS: 'flashmail_header_links',
  FOOTER_LINKS: 'flashmail_footer_links',
  ADMIN_AUTH: 'flashmail_admin_auth'
};

const DEFAULT_ARTICLES = [
  {
    id: '1',
    title: 'دليل حماية الخصوصية الرقمية ومنع تتبع البريد الإلكتروني',
    slug: 'digital-privacy-guide',
    excerpt: 'تعرف على أفضل الممارسات والأدوات لحماية هويتك على الإنترنت واستخدام البريد المؤقت للحد من الرسائل المزعجة والتتبع.',
    content: `في العصر الرقمي الحالي، أصبحت الخصوصية واحدة من أكبر التحديات التي تواجه المستخدمين. تقوم الكثير من المواقع والخدمات برصد بيانات المستخدمين واستغلال بريدهم الإلكتروني لإرسال ملايين الرسائل الترويجية المزعجة (Spam).

### لماذا يجب عليك استخدام بريد إلكتروني مؤقت؟

1. **حماية بريدك الشخصي:** تجنب وضع بريدك الشخصي الأساسي في منتديات أو مواقع غير موثوقة.
2. **الحد من التتبع:** تمنع خدمات البريد المؤقت مثل "فلاش ميل" شركات الإعلانات من ربط نشاطك عبر الإنترنت بهويتك الحقيقية.
3. **تفعيل الخدمات بسرعة:** يمكنك استقبال أكواد التفعيل وتأكيد الحسابات خلال ثوانٍ معدودة دون الحاجة لإنشاء حسابات جديدة معقدة.`,
    tags: 'خصوصية, أمان, بريد مؤقت',
    date: '2025-02-20'
  },
  {
    id: '2',
    title: 'كيف تتجنب الوقوع في فخ الهجمات الإلكترونية والرسائل الاحتيالية',
    slug: 'avoid-phishing-attacks',
    excerpt: 'خطوات عملية لكشف الرسائل المزيفة والروابط المشبوهة لحماية معلوماتك الحساسة عند التسجيل في الخدمات الإلكترونية.',
    content: `تعتبر هجمات الهندسة الاجتماعية والبريد الاحتيالي (Phishing) من أكثر الوسائل شائعة لاختراق الحسابات الشخصية.

### أهم النصائح للحماية:

- **تحقق من اسم المرسب بدقة:** تحقق دائماً من عنوان بريد المنسل وليس الاسم فقط.
- **لا تضغط على الرابط المجهولة:** استخدم بريداً مؤقتاً لاختبار الخدمات والتسجيل الأولي قبل إدخال أية بيانات شخصية.
- **استخدم بريداً مؤقتاً للتسجيلات المترددة:** عند استخدام مواقع تستخدمها لمرة واحدة، يكون البريد المؤقت هو الخيار الآمن دائماً.`,
    tags: 'أمان, هجمات, بريد',
    date: '2025-02-22'
  }
];

const DEFAULT_HEADER_LINKS = [
  { id: '1', label: 'الرئيسية', url: '/', isExternal: false },
  { id: '2', label: 'الخطة المميزة Premium', url: '/premium', isExternal: false },
  { id: '3', label: 'المدونة', url: '#blog', isExternal: false },
  { id: '4', label: 'لوحة التحكم', url: '/admin-secret-dashboard', isExternal: false }
];

const DEFAULT_FOOTER_LINKS = [
  { id: '1', label: 'الرئيسية', url: '/', isExternal: false },
  { id: '2', label: 'الاشتراك المميز (VIP)', url: '/premium', isExternal: false },
  { id: '3', label: 'سياسة الخصوصية', url: '#privacy', isExternal: false },
  { id: '4', label: 'لوحة الإدارة', url: '/admin-secret-dashboard', isExternal: false }
];

// ==================== Helper Hook for LocalStorage ====================
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('LocalStorage read error:', e);
    }
    return initialValue;
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('LocalStorage write error:', e);
    }
  }, [key, value]);

  return [value, setValue];
}

// ==================== AdBanner Component ====================
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

// ==================== Audio Notification ====================
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

// ==================== Premium Page Component ====================
function PremiumPage({ navigate }) {
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleStripeCheckout = (planName, price) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      StorageService.setPremium(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white py-12 px-4" dir="rtl">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-10 pb-6 border-b border-white/10">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-semibold transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>العودة للرئيسية</span>
          </button>
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-amber-400" />
            <h1 className="text-2xl font-black bg-gradient-to-r from-amber-300 via-purple-300 to-blue-300 bg-clip-text text-transparent">
              فلاش ميل برو (FlashMail Premium)
            </h1>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <span className="px-4 py-1.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30 inline-block mb-4">
            خطط اشتراك بدون حدود
          </span>
          <h2 className="text-3xl md:text-5xl font-black mb-4">ارتقِ بتجربتك لحماية خصوصيتك</h2>
          <p className="text-white/50 max-w-2xl mx-auto text-sm md:text-base">
            احصل على دومينات خاصة مخصصة، دعم الرسائل المباشر عبر WebSocket، وسعة غير محدودة دون أية إعلانات.
          </p>
        </div>

        {/* Success Modal Notification */}
        {success && (
          <div className="mb-8 p-6 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-center animate-fadeIn">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-2" />
            <h3 className="text-xl font-bold mb-1">تمت المحاكاة وتفعيل العضوية المميزة بنجاح!</h3>
            <p className="text-sm text-emerald-300/80">استمتع بتوليد عدد غير محدود من الإيميلات اليومية.</p>
            <button
              onClick={() => {
                setSuccess(false);
                navigate('/');
              }}
              className="mt-4 px-6 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
            >
              العودة للرئيسية
            </button>
          </div>
        )}

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Free Tier */}
          <div className="bg-[#12121a] border border-white/10 rounded-3xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">المجانية</h3>
              <p className="text-xs text-white/40 mb-6">للاستخدام الشخصي اليومي والسريع</p>
              <div className="text-3xl font-black mb-6">$0 <span className="text-xs text-white/40 font-normal">/ للأبد</span></div>
              <ul className="space-y-3 text-xs text-white/70 mb-8">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> بريد مؤقت فوري</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> دومينات عامة مشتركة</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> حد 10 إيميلات يومياً</li>
                <li className="flex items-center gap-2 text-white/30"><X className="w-4 h-4 shrink-0" /> بدون إعلانات</li>
                <li className="flex items-center gap-2 text-white/30"><X className="w-4 h-4 shrink-0" /> نطاق مخصص (Custom Domain)</li>
              </ul>
            </div>
            <button
              onClick={() => navigate('/')}
              className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all"
            >
              الخطة الحالية
            </button>
          </div>

          {/* Pro Monthly Tier */}
          <div className="relative bg-[#12121a] border-2 border-purple-500/80 rounded-3xl p-6 flex flex-col justify-between shadow-2xl shadow-purple-500/20">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white text-[10px] font-black uppercase tracking-wider">
              الأكثر شعبية
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Pro الشهرية</h3>
              <p className="text-xs text-white/40 mb-6">لالمحترفين وأصحاب الأعمال اليومية</p>
              <div className="text-3xl font-black mb-6 text-purple-300">$4.99 <span className="text-xs text-white/40 font-normal">/ شهرياً</span></div>
              <ul className="space-y-3 text-xs text-white/70 mb-8">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400 shrink-0" /> توليد إيميلات غير محدود</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400 shrink-0" /> تجربة خالية تماماً من الإعلانات</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400 shrink-0" /> حفظ الرسائل لمدة 30 يوماً</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400 shrink-0" /> تنبيهات صوتية ولحظية للرسائل</li>
              </ul>
            </div>
            <button
              onClick={() => handleStripeCheckout('Pro Monthly', '$4.99')}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
              <span>اشترك عبر Stripe</span>
            </button>
          </div>

          {/* VIP Annual Tier */}
          <div className="bg-[#12121a] border border-white/10 rounded-3xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-amber-300 mb-2">VIP السنوية</h3>
              <p className="text-xs text-white/40 mb-6">وفر أكثر من 40% مع الدعم الخاص</p>
              <div className="text-3xl font-black mb-6 text-amber-300">$39.99 <span className="text-xs text-white/40 font-normal">/ سنوياً</span></div>
              <ul className="space-y-3 text-xs text-white/70 mb-8">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-400 shrink-0" /> كل ميزات خطة Pro</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-400 shrink-0" /> ربط دومين خاص باسم موقعك (Custom Domain)</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-400 shrink-0" /> دعم فني مباشر VIP 24/7</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-400 shrink-0" /> وصول مبكر لأحدث الميزات والمكتبات</li>
              </ul>
            </div>
            <button
              onClick={() => handleStripeCheckout('VIP Yearly', '$39.99')}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-xs transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Star className="w-4 h-4 fill-black" />}
              <span>احصل على الاشتراك السنوي</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== Admin Secret Dashboard Component ====================
function AdminDashboard({ navigate, articles, setArticles, headerLinks, setHeaderLinks, footerLinks, setFooterLinks }) {
  const [adminAuth, setAdminAuth] = useLocalStorage(STORAGE_KEYS.ADMIN_AUTH, false);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('articles'); // 'articles' | 'links'

  // New Article Form State
  const [newArticle, setNewArticle] = useState({ title: '', excerpt: '', content: '', tags: '' });
  const [editingArticleId, setEditingArticleId] = useState(null);

  // Link Form State
  const [newLink, setNewLink] = useState({ label: '', url: '', isHeader: true, isExternal: false });

  const handleLogin = (e) => {
    e.preventDefault();
    if (usernameInput === 'admin' && passwordInput === 'admin123') {
      setAdminAuth(true);
      setLoginError('');
    } else {
      setLoginError('اسم المستخدم أو كلمة المرور غير صحيحة');
    }
  };

  const handleLogout = () => {
    setAdminAuth(false);
  };

  const handleSaveArticle = (e) => {
    e.preventDefault();
    if (!newArticle.title || !newArticle.content) return;

    const slug = newArticle.title.toLowerCase().replace(/[^\w\u0600-\u06FF]+/g, '-');

    if (editingArticleId) {
      setArticles(articles.map(a => a.id === editingArticleId ? { ...a, ...newArticle, slug } : a));
      setEditingArticleId(null);
    } else {
      const created = {
        id: Date.now().toString(),
        ...newArticle,
        slug,
        date: new Date().toISOString().split('T')[0]
      };
      setArticles([created, ...articles]);
    }

    setNewArticle({ title: '', excerpt: '', content: '', tags: '' });
  };

  const handleDeleteArticle = (id) => {
    setArticles(articles.filter(a => a.id !== id));
  };

  const handleEditArticle = (article) => {
    setEditingArticleId(article.id);
    setNewArticle({
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      tags: article.tags
    });
  };

  const handleAddLink = (e) => {
    e.preventDefault();
    if (!newLink.label || !newLink.url) return;

    const item = { id: Date.now().toString(), label: newLink.label, url: newLink.url, isExternal: newLink.isExternal };
    if (newLink.isHeader) {
      setHeaderLinks([...headerLinks, item]);
    } else {
      setFooterLinks([...footerLinks, item]);
    }

    setNewLink({ label: '', url: '', isHeader: true, isExternal: false });
  };

  const handleDeleteHeaderLink = (id) => {
    setHeaderLinks(headerLinks.filter(l => l.id !== id));
  };

  const handleDeleteFooterLink = (id) => {
    setFooterLinks(footerLinks.filter(l => l.id !== id));
  };

  // Protected Login Screen
  if (!adminAuth) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center p-4" dir="rtl">
        <div className="w-full max-w-md bg-[#12121a] border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-purple-500/20">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-black text-white mb-1">تسجيل دخول لوحة التحكم</h2>
            <p className="text-xs text-white/40">مسار الإدارة المحمي (/admin-secret-dashboard)</p>
          </div>

          {/* Demo Login Credentials Box */}
          <div className="mb-6 p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-xs">
            <div className="flex items-center gap-2 text-purple-300 font-bold mb-2">
              <Key className="w-4 h-4" />
              <span>بيانات الدخول التجريبية (Demo Credentials):</span>
            </div>
            <div className="space-y-1 font-mono text-white/80">
              <p>اسم المستخدم: <span className="text-purple-300 font-bold">admin</span></p>
              <p>كلمة المرور: <span className="text-purple-300 font-bold">admin123</span></p>
            </div>
          </div>

          {loginError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs text-center font-bold">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs text-white/50 mb-1">اسم المستخدم</label>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500"
                placeholder="admin"
                required
              />
            </div>

            <div>
              <label className="block text-xs text-white/50 mb-1">كلمة المرور</label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm transition-all shadow-lg shadow-purple-600/30"
            >
              دخول اللوحة
            </button>
          </form>

          <button
            onClick={() => navigate('/')}
            className="w-full mt-4 text-center text-xs text-white/40 hover:text-white transition-colors"
          >
            العودة للرئيسية
          </button>
        </div>
      </div>
    );
  }

  // Admin Dashboard Management Area
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white p-4 md:p-8" dir="rtl">
      <div className="max-w-6xl mx-auto">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black">لوحة التحكم والإدارة (Admin CMS)</h1>
              <p className="text-xs text-white/40">إدارة المقالات، روابط الهيدر والفوتر، والمحتوى</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold transition-all"
            >
              معاينة الموقع
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-semibold border border-rose-500/30 transition-all flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>تسجيل خروج</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 border-b border-white/10 pb-4">
          <button
            onClick={() => setActiveTab('articles')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
              activeTab === 'articles' ? 'bg-purple-600 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>إدارة المقالات (CMS Blog)</span>
          </button>
          <button
            onClick={() => setActiveTab('links')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
              activeTab === 'links' ? 'bg-purple-600 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            <LinkIcon className="w-4 h-4" />
            <span>تعديل روابط الهيدر والفوتر</span>
          </button>
        </div>

        {/* TAB 1: Articles CMS */}
        {activeTab === 'articles' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Create / Edit Article Form */}
            <div className="lg:col-span-1 bg-[#12121a] border border-white/10 rounded-2xl p-6 h-fit">
              <h2 className="text-base font-bold mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4 text-purple-400" />
                <span>{editingArticleId ? 'تعديل المقال' : 'إضافة مقال جديد للـ SEO'}</span>
              </h2>

              <form onSubmit={handleSaveArticle} className="space-y-4">
                <div>
                  <label className="block text-xs text-white/50 mb-1">عنوان المقال</label>
                  <input
                    type="text"
                    value={newArticle.title}
                    onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                    placeholder="مثال: دليل استخدام البريد المؤقت"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs text-white/50 mb-1">المقتطف (Excerpt)</label>
                  <textarea
                    value={newArticle.excerpt}
                    onChange={(e) => setNewArticle({ ...newArticle, excerpt: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 h-20"
                    placeholder="وصف قصير للمقال يظهر في الصفحة الرئيسية..."
                  />
                </div>

                <div>
                  <label className="block text-xs text-white/50 mb-1">محتوى المقال الكامل</label>
                  <textarea
                    value={newArticle.content}
                    onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 h-36"
                    placeholder="أدخل النص التفصيلي للمقال..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs text-white/50 mb-1">الكلمات المفتاحية (Tags)</label>
                  <input
                    type="text"
                    value={newArticle.tags}
                    onChange={(e) => setNewArticle({ ...newArticle, tags: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                    placeholder="مثال: خصوصية, أمان, بريد"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-500 rounded-xl font-bold text-xs transition-all"
                  >
                    {editingArticleId ? 'تحديث المقال' : 'نشر المقال'}
                  </button>
                  {editingArticleId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingArticleId(null);
                        setNewArticle({ title: '', excerpt: '', content: '', tags: '' });
                      }}
                      className="px-4 py-2.5 bg-white/10 hover:bg-white/15 rounded-xl text-xs font-bold"
                    >
                      إلغاء
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Articles List */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-base font-bold mb-4">المقالات المنشورة ({articles.length})</h2>
              {articles.map((art) => (
                <div key={art.id} className="bg-[#12121a] border border-white/10 rounded-2xl p-5 flex flex-col md:flex-row items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-sm text-purple-300 mb-1">{art.title}</h3>
                    <p className="text-xs text-white/50 line-clamp-2 mb-2">{art.excerpt || art.content}</p>
                    <div className="flex items-center gap-3 text-[10px] text-white/30">
                      <span>تاريخ النشر: {art.date}</span>
                      <span>•</span>
                      <span>الوسوم: {art.tags || 'عام'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleEditArticle(art)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-amber-400"
                      title="تعديل"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteArticle(art.id)}
                      className="p-2 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: Navigation Links Management */}
        {activeTab === 'links' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Add Link Form */}
            <div className="lg:col-span-1 bg-[#12121a] border border-white/10 rounded-2xl p-6 h-fit">
              <h2 className="text-base font-bold mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4 text-purple-400" />
                <span>إضافة رابط جديد</span>
              </h2>

              <form onSubmit={handleAddLink} className="space-y-4">
                <div>
                  <label className="block text-xs text-white/50 mb-1">اسم الرابط</label>
                  <input
                    type="text"
                    value={newLink.label}
                    onChange={(e) => setNewLink({ ...newLink, label: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                    placeholder="مثال: من نحن"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs text-white/50 mb-1">المسار أو الرابط (URL)</label>
                  <input
                    type="text"
                    value={newLink.url}
                    onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                    placeholder="مثال: /premium أو https://example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs text-white/50 mb-1">مكان العرض</label>
                  <select
                    value={newLink.isHeader ? 'header' : 'footer'}
                    onChange={(e) => setNewLink({ ...newLink, isHeader: e.target.value === 'header' })}
                    className="w-full bg-[#1a1a2e] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="header">روابط الهيدر (Header Nav)</option>
                    <option value="footer">روابط الفوتر (Footer Nav)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 rounded-xl font-bold text-xs transition-all"
                >
                  حفظ الرابط
                </button>
              </form>
            </div>

            {/* Links Lists */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header Links */}
              <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6">
                <h3 className="font-bold text-sm text-purple-300 mb-4">روابط الهيدر الحالية ({headerLinks.length})</h3>
                <div className="space-y-2">
                  {headerLinks.map((link) => (
                    <div key={link.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 text-xs">
                      <div>
                        <span className="font-bold text-white ml-2">{link.label}</span>
                        <span className="text-white/40 font-mono">({link.url})</span>
                      </div>
                      <button
                        onClick={() => handleDeleteHeaderLink(link.id)}
                        className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/20"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Links */}
              <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6">
                <h3 className="font-bold text-sm text-blue-300 mb-4">روابط الفوتر الحالية ({footerLinks.length})</h3>
                <div className="space-y-2">
                  {footerLinks.map((link) => (
                    <div key={link.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 text-xs">
                      <div>
                        <span className="font-bold text-white ml-2">{link.label}</span>
                        <span className="text-white/40 font-mono">({link.url})</span>
                      </div>
                      <button
                        onClick={() => handleDeleteFooterLink(link.id)}
                        className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/20"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ==================== Main App Component ====================
export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname || '/');

  const [articles, setArticles] = useLocalStorage(STORAGE_KEYS.ARTICLES, DEFAULT_ARTICLES);
  const [headerLinks, setHeaderLinks] = useLocalStorage(STORAGE_KEYS.HEADER_LINKS, DEFAULT_HEADER_LINKS);
  const [footerLinks, setFooterLinks] = useLocalStorage(STORAGE_KEYS.FOOTER_LINKS, DEFAULT_FOOTER_LINKS);

  const [selectedArticle, setSelectedArticle] = useState(null);

  // Email API States
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [account, setAccount] = useState(null);
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedOtp, setCopiedOtp] = useState(false);
  const [copiedLink, setCopiedLink] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showCustom, setShowCustom] = useState(false);
  const [customUsername, setCustomUsername] = useState('');
  const [domains, setDomains] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState('');

  // Daily Limit & Auth States
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [dailyUsageInfo, setDailyUsageInfo] = useState(() => StorageService.getDailyLimitInfo(10));
  const [currentUser, setCurrentUser] = useState(() => StorageService.getUserSession());

  const prevCountRef = useRef(0);

  const navigate = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname || '/');
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Sync Daily Limit Status
  const updateDailyLimitState = useCallback(() => {
    const info = StorageService.getDailyLimitInfo(10);
    setDailyUsageInfo(info);
    return info;
  }, []);

  // Mail Account Generator using mail.gw live API with Domain Rotator
  const createMailGwAccount = useCallback(async (customUser = '', targetDomain = '', isInitial = false) => {
    const currentLimitInfo = updateDailyLimitState();

    // Limit check: if reached 10 emails (or isLimitReached) and not initial load or user manually creating email #11
    if (!isInitial && currentLimitInfo.isLimitReached) {
      setShowLimitModal(true);
      return;
    }

    setLoading(true);
    try {
      let activeDomains = domains;
      if (activeDomains.length === 0) {
        activeDomains = await MailGwService.getDomains();
        setDomains(activeDomains);
      }

      const domainToUse = targetDomain || selectedDomain || '';
      const { account: newAccount, token: newToken } = await MailGwService.createAccount(customUser, domainToUse);

      // Increment daily limit count if not initial page load
      if (!isInitial) {
        const updatedInfo = StorageService.incrementDailyEmailCount(10);
        setDailyUsageInfo(updatedInfo);
      }

      setAccount(newAccount);
      setEmail(newAccount.address);
      setToken(newToken);
      setMessages([]);
      setSelectedMessage(null);
      setShowCustom(false);
      setCustomUsername('');
      if (newAccount.address.includes('@')) {
        setSelectedDomain(newAccount.address.split('@')[1]);
      }
    } catch (err) {
      console.error('Account generation error:', err);
    } finally {
      setLoading(false);
    }
  }, [domains, selectedDomain, updateDailyLimitState]);

  useEffect(() => {
    if (currentPath === '/') {
      createMailGwAccount('', '', true);
    }
  }, [createMailGwAccount, currentPath]);

  // Fetch Messages with 3-second Polling requirement
  const fetchMessages = useCallback(async (silent = false) => {
    if (!token) return;
    if (!silent) setRefreshing(true);
    try {
      const fetchedMsgs = await MailGwService.getMessages(token);
      if (silent && fetchedMsgs.length > prevCountRef.current && prevCountRef.current > 0 && soundEnabled) {
        playNotificationSound();
      }
      prevCountRef.current = fetchedMsgs.length;
      setMessages(fetchedMsgs);
    } catch (e) {
      console.error('Error fetching messages:', e);
    } finally {
      if (!silent) setRefreshing(false);
    }
  }, [token, soundEnabled]);

  // Live polling every 3 seconds for messages (GET /messages)
  useEffect(() => {
    if (!token || currentPath !== '/') return;
    fetchMessages(true);
    const interval = setInterval(() => fetchMessages(true), 3000);
    return () => clearInterval(interval);
  }, [token, fetchMessages, currentPath]);

  const copyEmail = async () => {
    if (!email) return;
    await navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyText = async (text, setCopiedState) => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopiedState(true);
    setTimeout(() => setCopiedState(false), 2000);
  };

  const handleOpenMessage = async (msgId) => {
    if (!token) return;
    const detail = await MailGwService.getMessageDetail(msgId, token);
    if (detail) {
      setSelectedMessage(detail);
    }
  };

  // Route Views
  if (currentPath === '/admin-secret-dashboard') {
    return (
      <AdminDashboard
        navigate={navigate}
        articles={articles}
        setArticles={setArticles}
        headerLinks={headerLinks}
        setHeaderLinks={setHeaderLinks}
        footerLinks={footerLinks}
        setFooterLinks={setFooterLinks}
      />
    );
  }

  if (currentPath === '/premium') {
    return <PremiumPage navigate={navigate} />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-sans selection:bg-purple-500/30" dir="rtl">
      {/* Background Lighting Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8">
        {/* Header Navigation Bar */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
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

          {/* Dynamic Header Links */}
          <nav className="flex items-center gap-1 bg-white/5 border border-white/10 p-1.5 rounded-2xl backdrop-blur-md">
            {headerLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  if (link.url.startsWith('#')) {
                    const el = document.querySelector(link.url);
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    navigate(link.url);
                  }
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  currentPath === link.url ? 'bg-purple-600 text-white shadow-md' : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </button>
            ))}

            <button
              onClick={() => setShowAuthModal(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-300 transition-all flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5" />
              <span>{currentUser ? currentUser.name : 'تسجيل الدخول'}</span>
            </button>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-xl hover:bg-white/10 text-white/70 mr-1"
              title={soundEnabled ? 'كتم الصوت' : 'تشغيل الصوت'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-white/40" />}
            </button>
          </nav>
        </header>

        {/* Top Ad Unit */}
        <AdBanner label="إعلان علوي (Header Leaderboard)" />

        {/* Daily Limit Notice Banner */}
        <div className="mb-6 px-4 py-3 rounded-2xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-between text-xs text-purple-200">
          <div className="flex items-center gap-2 font-semibold">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>الحد اليومي للإيميلات: {dailyUsageInfo.isPremium ? 'غير محدود (VIP)' : `${dailyUsageInfo.count} من 10 إيميلات (متبقي ${dailyUsageInfo.remaining})`}</span>
          </div>
          {!dailyUsageInfo.isPremium && (
            <button
              onClick={() => navigate('/premium')}
              className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-[11px] transition-all"
            >
              ترقية لـ Premium
            </button>
          )}
        </div>

        {/* Main Email Box Card */}
        <div className="mb-8">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-500" />
            <div className="relative bg-[#12121a]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
              <div className="flex flex-col gap-6">
                <div>
                  <label className="text-xs text-purple-300/70 uppercase tracking-wider font-bold mb-2 block">
                    عنوان البريد المؤقت الخاص بك (mail.gw)
                  </label>
                  <div className="flex items-center gap-3 bg-black/40 rounded-2xl px-5 py-4 border border-white/10 shadow-inner">
                    <Globe className="w-6 h-6 text-purple-400 shrink-0" />
                    <span className="text-xl md:text-2xl font-mono text-white font-bold truncate tracking-wide">
                      {loading ? 'جاري التوليد من mail.gw...' : (email || 'جاري التوليد...')}
                    </span>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <button
                    onClick={copyEmail}
                    disabled={!email}
                    className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold transition-all disabled:opacity-30 active:scale-95 shadow-lg shadow-purple-600/30 text-xs sm:text-sm"
                  >
                    {copied ? <CheckCircle2 className="w-5 h-5 text-emerald-300" /> : <Copy className="w-5 h-5" />}
                    <span>{copied ? 'تم النسخ!' : 'نسخ (Copy)'}</span>
                  </button>

                  <button
                    onClick={() => fetchMessages(false)}
                    disabled={refreshing || !token}
                    className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 font-bold transition-all active:scale-95 text-xs sm:text-sm"
                  >
                    <RefreshCw className={`w-5 h-5 text-blue-400 ${refreshing ? 'animate-spin' : ''}`} />
                    <span>تحديث (Refresh)</span>
                  </button>

                  <button
                    onClick={() => setShowCustom(!showCustom)}
                    className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 font-bold transition-all active:scale-95 text-xs sm:text-sm"
                  >
                    <Edit3 className="w-5 h-5 text-amber-400" />
                    <span>تغيير (Change)</span>
                  </button>

                  <button
                    onClick={() => createMailGwAccount()}
                    className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-300 font-bold transition-all active:scale-95 text-xs sm:text-sm"
                  >
                    <Trash2 className="w-5 h-5 text-rose-400" />
                    <span>حذف (Delete)</span>
                  </button>
                </div>

                {showCustom && (
                  <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col md:flex-row items-center gap-3">
                    <input
                      type="text"
                      value={customUsername}
                      onChange={(e) => setCustomUsername(e.target.value)}
                      placeholder="أدخل الاسم المخصص..."
                      className="w-full md:flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-purple-500 text-xs sm:text-sm font-mono"
                    />
                    <select
                      value={selectedDomain}
                      onChange={(e) => setSelectedDomain(e.target.value)}
                      className="w-full md:w-auto bg-[#1a1a2e] border border-white/10 rounded-xl px-3 py-3 text-xs sm:text-sm text-purple-200 focus:outline-none"
                    >
                      {domains.map((dom) => (
                        <option key={dom.id} value={dom.domain}>
                          @{dom.domain}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => createMailGwAccount(customUsername, selectedDomain)}
                      disabled={loading}
                      className="w-full md:w-auto px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold transition-all shrink-0 text-xs sm:text-sm"
                    >
                      توليد البريد
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Messages Section */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-12">
          <div className="lg:col-span-2 bg-[#12121a]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-white/5">
              <div className="flex items-center gap-2">
                <Inbox className="w-5 h-5 text-purple-400" />
                <h2 className="font-bold text-white">صندوق الوارد (Live Polling 3s)</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold">
                  {messages.length}
                </span>
              </div>
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {messages.length === 0 ? (
                <div className="py-16 text-center px-4">
                  <Inbox className="w-8 h-8 text-white/20 mx-auto mb-2" />
                  <p className="text-white/40 text-xs">في انتظار وصول الرسائل عبر mail.gw...</p>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {messages.map((msg) => (
                    <button
                      key={msg.id}
                      onClick={() => handleOpenMessage(msg.id)}
                      className="w-full text-right p-4 transition-all hover:bg-white/5"
                    >
                      <p className="text-xs font-bold text-purple-300">{msg.from?.address || msg.from?.name}</p>
                      <p className="text-sm font-semibold text-white truncate">{msg.subject || '(بدون موضوع)'}</p>
                      {msg.intro && <p className="text-xs text-white/40 truncate mt-1">{msg.intro}</p>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-3 bg-[#12121a]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 min-h-[300px]">
            {!selectedMessage ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <Mail className="w-10 h-10 text-white/20 mb-2" />
                <p className="text-white/40 text-xs">اختر رسالة من صندوق الوارد لقراءة تفاصيلها</p>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-bold text-white mb-2">{selectedMessage.subject}</h3>
                <p className="text-xs text-purple-300 mb-1">من: {selectedMessage.from?.address} ({selectedMessage.from?.name})</p>
                <p className="text-[11px] text-white/40 mb-4">التاريخ: {new Date(selectedMessage.createdAt).toLocaleString('ar-EG')}</p>

                {/* Highlighted OTP Extractor Card */}
                {selectedMessage.extractedOtp && (
                  <div className="mb-4 p-4 rounded-2xl bg-gradient-to-r from-purple-900/60 to-amber-950/50 border-2 border-amber-400/50 shadow-lg flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-amber-400/20 text-amber-300">
                        <Shield className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-[11px] text-amber-300/80 font-bold uppercase tracking-wider">رمز التفعيل المكتشف (OTP Code)</p>
                        <p className="text-2xl font-mono font-black text-amber-300 tracking-widest">{selectedMessage.extractedOtp}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => copyText(selectedMessage.extractedOtp, setCopiedOtp)}
                      className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs transition-all shadow flex items-center gap-1.5 shrink-0"
                    >
                      {copiedOtp ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedOtp ? 'تم النسخ!' : 'نسخ الرمز'}</span>
                    </button>
                  </div>
                )}

                {/* Highlighted Activation Links Extractor Card */}
                {selectedMessage.extractedLinks && selectedMessage.extractedLinks.length > 0 && (
                  <div className="mb-4 p-4 rounded-2xl bg-purple-950/60 border border-purple-500/40 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-purple-300">
                      <ExternalLink className="w-4 h-4 text-purple-400" />
                      <span>رابط التفعيل والتأكيد المباشر (Activation Links):</span>
                    </div>
                    {selectedMessage.extractedLinks.map((link, idx) => (
                      <div key={idx} className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-black/40 border border-white/5">
                        <span className="text-xs font-mono text-purple-200 truncate dir-ltr">{link}</span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => copyText(link, () => {
                              setCopiedLink(idx);
                              setTimeout(() => setCopiedLink(null), 2000);
                            })}
                            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-[11px] transition-all flex items-center gap-1"
                          >
                            {copiedLink === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedLink === idx ? 'تم' : 'نسخ'}</span>
                          </button>
                          <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-[11px] transition-all flex items-center gap-1"
                          >
                            <span>فتح</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="prose prose-invert max-w-none text-xs text-white/80 border-t border-white/10 pt-4">
                  {selectedMessage.html && selectedMessage.html.length > 0 ? (
                    <div dangerouslySetInnerHTML={{ __html: selectedMessage.html[0] }} />
                  ) : (
                    <p className="whitespace-pre-wrap">{selectedMessage.text || selectedMessage.intro}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Middle Ad Unit */}
        <AdBanner label="إعلان وسط الصفحة (Native Article Ad)" />

        {/* SEO Blog Articles Section */}
        <section id="blog" className="mt-12 p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl md:text-2xl font-black bg-gradient-to-r from-purple-200 to-blue-200 bg-clip-text text-transparent">
              مقالات الخصوصية والأمان الرقمي (SEO Blog)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {articles.map((art) => (
              <div
                key={art.id}
                onClick={() => setSelectedArticle(art)}
                className="p-6 rounded-2xl bg-black/30 border border-white/5 hover:border-purple-500/40 transition-all cursor-pointer group"
              >
                <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider block mb-2">
                  {art.tags || 'مقالات الخصوصية'}
                </span>
                <h3 className="font-bold text-white text-base mb-2 group-hover:text-purple-300 transition-colors">
                  {art.title}
                </h3>
                <p className="text-xs text-white/50 leading-relaxed line-clamp-3 mb-4">
                  {art.excerpt || art.content}
                </p>
                <div className="flex items-center justify-between text-[11px] text-purple-300 font-bold">
                  <span>اقرأ المقال كاملة ←</span>
                  <span className="text-white/30 font-normal">{art.date}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Single Article Reader Modal */}
        {selectedArticle && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#12121a] border border-white/10 rounded-3xl p-6 md:p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <span className="text-xs text-purple-300 font-bold">{selectedArticle.tags}</span>
                <button onClick={() => setSelectedArticle(null)} className="p-2 text-white/50 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <h2 className="text-xl font-bold text-white mb-4">{selectedArticle.title}</h2>
              <p className="text-xs text-white/40 mb-6">{selectedArticle.date}</p>
              <div className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap">
                {selectedArticle.content}
              </div>
            </div>
          </div>
        )}

        {/* Bottom Ad Unit */}
        <AdBanner label="إعلان سفلي (Footer Banner)" />

        {/* Footer Navigation */}
        <footer className="mt-12 text-center text-xs text-white/40 border-t border-white/5 pt-8 pb-4">
          <div className="flex flex-wrap items-center justify-center gap-6 mb-4">
            {footerLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => navigate(link.url)}
                className="hover:text-white transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>
          <p>© {new Date().getFullYear()} فلاش ميل — جميع الحقوق محفوظة</p>
        </footer>
      </div>

      {/* Daily Limit Modal (Shown when email limit reaches 10) */}
      <DailyLimitModal
        isOpen={showLimitModal}
        onClose={() => setShowLimitModal(false)}
        onUpgradePremium={() => navigate('/premium')}
        onOpenLogin={() => setShowAuthModal(true)}
        dailyUsage={dailyUsageInfo}
      />

      {/* Auth Modal (Login / Sign Up) */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        currentUser={currentUser}
        onLoginSuccess={(session) => {
          setCurrentUser(session);
          StorageService.saveUserSession(session);
          setDailyUsageInfo(StorageService.getDailyLimitInfo(10));
        }}
        onLogout={() => {
          setCurrentUser(null);
          StorageService.saveUserSession(null);
          setDailyUsageInfo(StorageService.getDailyLimitInfo(10));
        }}
        onUpgradeToPremium={() => navigate('/premium')}
      />
    </div>
  );
}
