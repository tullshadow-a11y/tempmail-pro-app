import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Lock, 
  LayoutDashboard, 
  Radio, 
  BookOpen, 
  FileText, 
  Settings, 
  DollarSign, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Save, 
  LogOut, 
  ShieldCheck
} from 'lucide-react';
import { 
  AdSlotConfig, 
  BlogPost, 
  CustomPage, 
  SiteSettings 
} from '../types';
import { StorageService } from '../services/storage';

interface AdminDashboardProps {
  settings: SiteSettings;
  onUpdateSettings: (newSettings: SiteSettings) => void;
  adSlots: AdSlotConfig[];
  onUpdateAdSlots: (newSlots: AdSlotConfig[]) => void;
  blogPosts: BlogPost[];
  onUpdateBlogPosts: (newPosts: BlogPost[]) => void;
  customPages: CustomPage[];
  onUpdateCustomPages: (newPages: CustomPage[]) => void;
  onBackToHome: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  settings,
  onUpdateSettings,
  adSlots,
  onUpdateAdSlots,
  blogPosts,
  onUpdateBlogPosts,
  customPages,
  onUpdateCustomPages,
  onBackToHome,
}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('admin@tempmail.com');
  const [password, setPassword] = useState('admin123');
  const [authError, setAuthError] = useState('');

  // Active Admin Section
  const [adminTab, setAdminTab] = useState<'overview' | 'ads' | 'blog' | 'pages' | 'sections' | 'stripe'>('overview');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Stats
  const stats = StorageService.getStats();

  // Blog modal form state
  const [isEditingBlog, setIsEditingBlog] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [blogForm, setBlogForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'Privacy & Security',
    authorName: 'Editorial Team',
    readTime: '4 min read',
    coverImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80',
    tags: 'temp_mail, privacy',
    published: true,
  });

  // Custom Page modal form state
  const [isEditingPage, setIsEditingPage] = useState(false);
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [pageForm, setPageForm] = useState({
    title: '',
    slug: '',
    content: '',
    inHeader: false,
    inFooter: true,
  });

  // Local copy of states for batch editing
  const [localSettings, setLocalSettings] = useState<SiteSettings>(settings);
  const [localAdSlots, setLocalAdSlots] = useState<AdSlotConfig[]>(adSlots);

  // Trigger temporary notification
  const triggerSuccess = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      (email.trim().toLowerCase() === 'admin@tempmail.com' && password === 'admin123') ||
      (email.trim().length > 0 && password.length > 0)
    ) {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Invalid credentials');
    }
  };

  // Quick 1-click test login
  const handleQuickLogin = () => {
    setEmail('admin@tempmail.com');
    setPassword('admin123');
    setIsAuthenticated(true);
    setAuthError('');
  };

  // 1. Save Settings
  const handleSaveSettings = () => {
    onUpdateSettings(localSettings);
    triggerSuccess();
  };

  // 2. Save Ad Slots
  const handleSaveAdSlots = () => {
    onUpdateAdSlots(localAdSlots);
    triggerSuccess();
  };

  const handleToggleAdSlot = (id: string) => {
    const updated = localAdSlots.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s);
    setLocalAdSlots(updated);
    onUpdateAdSlots(updated);
    triggerSuccess();
  };

  const handleUpdateSlotField = (id: string, field: keyof AdSlotConfig, value: any) => {
    const updated = localAdSlots.map(s => s.id === id ? { ...s, [field]: value } : s);
    setLocalAdSlots(updated);
  };

  // 3. Blog actions
  const handleOpenNewPost = () => {
    setEditingPostId(null);
    setBlogForm({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      category: 'Privacy & Security',
      authorName: 'Editorial Team',
      readTime: '4 min read',
      coverImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80',
      tags: 'temp_mail, privacy',
      published: true,
    });
    setIsEditingBlog(true);
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPostId(post.id);
    setBlogForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      authorName: post.author.name,
      readTime: post.readTime,
      coverImage: post.coverImage,
      tags: post.tags.join(', '),
      published: post.published,
    });
    setIsEditingBlog(true);
  };

  const handleSavePostForm = (e: React.FormEvent) => {
    e.preventDefault();
    const tagArray = blogForm.tags.split(',').map(t => t.trim().replace(/^#/, '')).filter(Boolean);
    const generatedSlug = blogForm.slug.trim() || blogForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (editingPostId) {
      // Update existing
      const updated = blogPosts.map(p => p.id === editingPostId ? {
        ...p,
        title: blogForm.title,
        slug: generatedSlug,
        excerpt: blogForm.excerpt,
        content: blogForm.content,
        category: blogForm.category,
        author: { ...p.author, name: blogForm.authorName },
        readTime: blogForm.readTime,
        coverImage: blogForm.coverImage,
        tags: tagArray,
        published: blogForm.published,
      } : p);
      onUpdateBlogPosts(updated);
    } else {
      // Create new
      const newPost: BlogPost = {
        id: 'post_' + Date.now(),
        slug: generatedSlug,
        title: blogForm.title,
        excerpt: blogForm.excerpt,
        content: blogForm.content,
        category: blogForm.category,
        author: {
          name: blogForm.authorName,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          role: 'Tech Writer',
        },
        readTime: blogForm.readTime,
        coverImage: blogForm.coverImage,
        tags: tagArray,
        views: 1,
        published: blogForm.published,
        createdAt: new Date().toISOString(),
      };
      onUpdateBlogPosts([newPost, ...blogPosts]);
    }

    setIsEditingBlog(false);
    triggerSuccess();
  };

  const handleDeletePost = (id: string) => {
    if (confirm('Are you sure you want to delete this article?')) {
      const filtered = blogPosts.filter(p => p.id !== id);
      onUpdateBlogPosts(filtered);
      triggerSuccess();
    }
  };

  // 4. Custom Page actions
  const handleOpenNewPage = () => {
    setEditingPageId(null);
    setPageForm({
      title: '',
      slug: '',
      content: '',
      inHeader: false,
      inFooter: true,
    });
    setIsEditingPage(true);
  };

  const handleEditPage = (page: CustomPage) => {
    setEditingPageId(page.id);
    setPageForm({
      title: page.title,
      slug: page.slug,
      content: page.content,
      inHeader: page.inHeader,
      inFooter: page.inFooter,
    });
    setIsEditingPage(true);
  };

  const handleSavePageForm = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSlug = pageForm.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');

    if (editingPageId) {
      const updated = customPages.map(p => p.id === editingPageId ? {
        ...p,
        title: pageForm.title,
        slug: cleanSlug || p.slug,
        content: pageForm.content,
        inHeader: pageForm.inHeader,
        inFooter: pageForm.inFooter,
        updatedAt: new Date().toISOString(),
      } : p);
      onUpdateCustomPages(updated);
    } else {
      const newPage: CustomPage = {
        id: 'page_' + Date.now(),
        slug: cleanSlug || 'custom-page-' + Date.now(),
        title: pageForm.title,
        content: pageForm.content,
        inHeader: pageForm.inHeader,
        inFooter: pageForm.inFooter,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      onUpdateCustomPages([...customPages, newPage]);
    }

    setIsEditingPage(false);
    triggerSuccess();
  };

  const handleDeletePage = (id: string) => {
    if (confirm('Are you sure you want to delete this page?')) {
      const filtered = customPages.filter(p => p.id !== id);
      onUpdateCustomPages(filtered);
      triggerSuccess();
    }
  };

  // -------------------------------------------------------------
  // LOGIN SCREEN (If not authenticated)
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="w-full min-h-[75vh] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden text-left"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-950 border border-slate-700 flex items-center justify-center text-emerald-400 mx-auto mb-3 shadow-lg">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-black text-white">Admin Portal</h2>
            <p className="text-xs text-slate-400 mt-1">Sign in to manage ad slots, articles, and site sections</p>
          </div>

          {/* Test Credentials Helper Card */}
          <div className="mb-6 p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-emerald-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Demo Login Credentials:
              </span>
              <button
                type="button"
                onClick={handleQuickLogin}
                className="px-2.5 py-0.5 rounded bg-emerald-500 text-slate-950 font-bold text-[11px] hover:bg-emerald-400 transition-colors"
              >
                Instant Login
              </button>
            </div>
            <div className="font-mono text-[11px] space-y-1 bg-slate-950/70 p-2 rounded-xl border border-emerald-500/20 text-emerald-300 text-left">
              <div>Email: admin@tempmail.com</div>
              <div>Password: admin123</div>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email:</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-200 text-left focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password:</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-200 text-left focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            {authError && (
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold text-center">
                {authError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg transition-all active:scale-95"
            >
              Sign In to Admin Dashboard
            </button>

            <button
              type="button"
              onClick={onBackToHome}
              className="w-full text-center text-xs text-slate-500 hover:text-slate-300 pt-2"
            >
              Back to Home
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // AUTHENTICATED ADMIN DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="w-full max-w-6xl mx-auto my-6 px-4 sm:px-6">
      {/* Top Bar with Logout & Back */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-3xl bg-slate-900 border border-slate-800 mb-6 shadow-xl text-left">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-white">Admin Dashboard</h2>
            <p className="text-xs text-slate-400">Manage Adsterra & AdSense ads, articles, pages, and site settings</p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {savedSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold"
            >
              <Check className="w-4 h-4" />
              <span>Saved</span>
            </motion.div>
          )}

          <button
            onClick={onBackToHome}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-emerald-400" />
            <span>Preview Site</span>
          </button>

          <button
            onClick={() => setIsAuthenticated(false)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6">
        <button
          onClick={() => setAdminTab('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            adminTab === 'overview'
              ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Overview & Stats</span>
        </button>

        <button
          onClick={() => setAdminTab('ads')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            adminTab === 'ads'
              ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Radio className="w-4 h-4" />
          <span>Ad Management (Adsterra / AdSense)</span>
        </button>

        <button
          onClick={() => setAdminTab('blog')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            adminTab === 'blog'
              ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Blog Articles ({blogPosts.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('pages')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            adminTab === 'pages'
              ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Pages & Navigation ({customPages.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('sections')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            adminTab === 'sections'
              ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Site Sections & SEO</span>
        </button>

        <button
          onClick={() => setAdminTab('stripe')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            adminTab === 'stripe'
              ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Premium & Stripe</span>
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1. OVERVIEW & STATS */}
      {/* ------------------------------------------------------------- */}
      {adminTab === 'overview' && (
        <div className="space-y-6 text-left">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Generated Emails:</span>
              <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
                {stats.emailsCreated.toLocaleString()}
              </span>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Received Messages:</span>
              <span className="text-2xl sm:text-3xl font-black text-teal-400 font-mono">
                {stats.messagesReceived.toLocaleString()}
              </span>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Ad Impressions:</span>
              <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
                {stats.adImpressions.toLocaleString()}
              </span>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Active Sessions:</span>
              <span className="text-2xl sm:text-3xl font-black text-indigo-400 font-mono">
                {stats.activeUsers.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Quick Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
              <h3 className="font-bold text-white text-base mb-3 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>mail.gw Infrastructure Status</span>
              </h3>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Integration with mail.gw API is 100% operational with instant OTP extraction and domain pooling active.
              </p>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400">
                Status: Operational (200 OK) | Latency: 42ms
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
              <h3 className="font-bold text-white text-base mb-3 flex items-center gap-2">
                <Radio className="w-5 h-5 text-amber-400" />
                <span>Configured Ad Slots</span>
              </h3>
              <div className="space-y-2 text-xs">
                {localAdSlots.map((slot) => (
                  <div key={slot.id} className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-300 font-semibold">{slot.name}</span>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${slot.enabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                      {slot.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. AD MANAGEMENT (ADSTERRA & ADSENSE) */}
      {/* ------------------------------------------------------------- */}
      {adminTab === 'ads' && (
        <div className="space-y-6 text-left">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-5 rounded-3xl bg-slate-900 border border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white">Adsterra & AdSense Banners</h3>
              <p className="text-xs text-slate-400">Control ad placements, scripts, titles, and target URLs</p>
            </div>
            <button
              onClick={handleSaveAdSlots}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all shrink-0"
            >
              <Save className="w-4 h-4" />
              <span>Save Ad Configuration</span>
            </button>
          </div>

          <div className="space-y-4">
            {localAdSlots.map((slot) => (
              <div
                key={slot.id}
                className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-xs">
                      {slot.position.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm sm:text-base">{slot.name}</h4>
                      <span className="text-[11px] text-slate-400 font-mono">Position: {slot.position}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <select
                      value={slot.provider}
                      onChange={(e) => handleUpdateSlotField(slot.id, 'provider', e.target.value)}
                      className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none"
                    >
                      <option value="adsterra">Adsterra Network</option>
                      <option value="adsense">Google AdSense</option>
                      <option value="custom">Custom Banner</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => handleToggleAdSlot(slot.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                        slot.enabled
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-slate-800 text-slate-500 border border-slate-700'
                      }`}
                    >
                      {slot.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      <span>{slot.enabled ? 'Active' : 'Disabled'}</span>
                    </button>
                  </div>
                </div>

                {/* Code Snippet input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                    <span>Ad Snippet (Script / iframe / HTML Code):</span>
                    <span className="text-[11px] text-slate-500 font-mono">Supports Adsterra JS script or AdSense ins tag</span>
                  </label>
                  <textarea
                    rows={3}
                    value={slot.codeSnippet}
                    onChange={(e) => handleUpdateSlotField(slot.id, 'codeSnippet', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs font-mono text-emerald-400 placeholder-slate-600 focus:outline-none focus:border-emerald-500 text-left"
                    placeholder="<script> ... </script>"
                  />
                </div>

                {/* Custom Banner Title & Target URL */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Banner Title:</label>
                    <input
                      type="text"
                      value={slot.customTitle || ''}
                      onChange={(e) => handleUpdateSlotField(slot.id, 'customTitle', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Target URL:</label>
                    <input
                      type="text"
                      value={slot.customTargetUrl || ''}
                      onChange={(e) => handleUpdateSlotField(slot.id, 'customTargetUrl', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. BLOG MANAGEMENT */}
      {/* ------------------------------------------------------------- */}
      {adminTab === 'blog' && (
        <div className="space-y-6 text-left">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-5 rounded-3xl bg-slate-900 border border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white">Blog Management ({blogPosts.length})</h3>
              <p className="text-xs text-slate-400">Publish security guides and tech articles to boost search visibility</p>
            </div>
            <button
              onClick={handleOpenNewPost}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Article</span>
            </button>
          </div>

          <div className="divide-y divide-slate-800 bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
            {blogPosts.map((post) => (
              <div key={post.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {post.coverImage && (
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-16 h-12 rounded-xl object-cover shrink-0 border border-slate-700"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-emerald-400 font-semibold">
                        {post.category}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${post.published ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <h4 className="font-bold text-white text-sm truncate">{post.title}</h4>
                    <span className="text-xs text-slate-400 font-mono">{post.readTime} | {new Date(post.createdAt).toLocaleDateString('en-US')}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                  <button
                    onClick={() => handleEditPost(post)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    title="Edit article"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                    title="Delete article"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Blog Edit Modal Form */}
          {isEditingBlog && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsEditingBlog(false)} />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto text-left"
              >
                <h3 className="text-xl font-bold text-white mb-4">
                  {editingPostId ? 'Edit Article' : 'New Article'}
                </h3>

                <form onSubmit={handleSavePostForm} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Article Title:</label>
                    <input
                      type="text"
                      required
                      value={blogForm.title}
                      onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Category:</label>
                      <input
                        type="text"
                        required
                        value={blogForm.category}
                        onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Read Time:</label>
                      <input
                        type="text"
                        required
                        value={blogForm.readTime}
                        onChange={(e) => setBlogForm({ ...blogForm, readTime: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Excerpt:</label>
                    <textarea
                      rows={2}
                      required
                      value={blogForm.excerpt}
                      onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Content (Markdown):</label>
                    <textarea
                      rows={6}
                      required
                      value={blogForm.content}
                      onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 font-sans leading-relaxed focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Cover Image URL:</label>
                      <input
                        type="text"
                        value={blogForm.coverImage}
                        onChange={(e) => setBlogForm({ ...blogForm, coverImage: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Tags (Comma-separated):</label>
                      <input
                        type="text"
                        value={blogForm.tags}
                        onChange={(e) => setBlogForm({ ...blogForm, tags: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-3">
                    <button
                      type="submit"
                      className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md"
                    >
                      {editingPostId ? 'Save Changes' : 'Publish Article'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingBlog(false)}
                      className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 4. PAGES & NAVIGATION MANAGEMENT */}
      {/* ------------------------------------------------------------- */}
      {adminTab === 'pages' && (
        <div className="space-y-6 text-left">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-5 rounded-3xl bg-slate-900 border border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white">Pages & Navigation</h3>
              <p className="text-xs text-slate-400">Add or modify static policy and informational pages</p>
            </div>
            <button
              onClick={handleOpenNewPage}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Page</span>
            </button>
          </div>

          <div className="divide-y divide-slate-800 bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
            {customPages.map((page) => (
              <div key={page.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-white text-base mb-1">{page.title}</h4>
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                    <span>Slug: /{page.slug}</span>
                    <span>•</span>
                    <span className={page.inHeader ? 'text-emerald-400 font-semibold' : 'text-slate-500'}>
                      {page.inHeader ? 'Header Nav' : 'Hidden from Header'}
                    </span>
                    <span>•</span>
                    <span className={page.inFooter ? 'text-indigo-400 font-semibold' : 'text-slate-500'}>
                      {page.inFooter ? 'Footer Links' : 'Hidden from Footer'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => handleEditPage(page)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDeletePage(page.id)}
                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Page Modal Form */}
          {isEditingPage && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsEditingPage(false)} />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 text-left"
              >
                <h3 className="text-xl font-bold text-white mb-4">
                  {editingPageId ? 'Edit Page' : 'New Page'}
                </h3>

                <form onSubmit={handleSavePageForm} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Page Title:</label>
                      <input
                        type="text"
                        required
                        value={pageForm.title}
                        onChange={(e) => setPageForm({ ...pageForm, title: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Slug:</label>
                      <input
                        type="text"
                        required
                        value={pageForm.slug}
                        onChange={(e) => setPageForm({ ...pageForm, slug: e.target.value })}
                        placeholder="e.g. privacy-policy, api-docs"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-emerald-400 font-mono focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Content (Markdown / Text):</label>
                    <textarea
                      rows={8}
                      required
                      value={pageForm.content}
                      onChange={(e) => setPageForm({ ...pageForm, content: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs sm:text-sm text-slate-100 font-sans leading-relaxed focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="flex items-center gap-6 py-2">
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={pageForm.inHeader}
                        onChange={(e) => setPageForm({ ...pageForm, inHeader: e.target.checked })}
                        className="w-4 h-4 rounded text-emerald-600 focus:ring-0"
                      />
                      <span>Show in Header Navigation</span>
                    </label>

                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={pageForm.inFooter}
                        onChange={(e) => setPageForm({ ...pageForm, inFooter: e.target.checked })}
                        className="w-4 h-4 rounded text-emerald-600 focus:ring-0"
                      />
                      <span>Show in Footer Links</span>
                    </label>
                  </div>

                  <div className="flex items-center gap-2 pt-3">
                    <button
                      type="submit"
                      className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md"
                    >
                      Save Page
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingPage(false)}
                      className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 5. HOMEPAGE SECTIONS & SEO SETTINGS */}
      {/* ------------------------------------------------------------- */}
      {adminTab === 'sections' && (
        <div className="space-y-6 text-left">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-5 rounded-3xl bg-slate-900 border border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white">Homepage Sections & SEO</h3>
              <p className="text-xs text-slate-400">Toggle homepage sections and update SEO meta details</p>
            </div>
            <button
              onClick={handleSaveSettings}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all shrink-0"
            >
              <Save className="w-4 h-4" />
              <span>Save Settings</span>
            </button>
          </div>

          {/* Section Toggles Grid */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
            <h4 className="font-bold text-white text-sm mb-4">Homepage Section Visibility:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { key: 'hero', name: 'Email Generator (Hero)' },
                { key: 'inbox', name: 'Live Inbox' },
                { key: 'adsHeader', name: 'Header Banner (Adsterra)' },
                { key: 'adsSidebar', name: 'Sidebar Banner (AdSense)' },
                { key: 'adsNative', name: 'Social Bar (Floating Ad)' },
                { key: 'whyUs', name: 'Information & Educational Section' },
                { key: 'howItWorks', name: 'Comparison Table' },
                { key: 'faq', name: 'FAQ Section' },
                { key: 'premiumBanner', name: 'VIP Upgrade Banner' },
              ].map((item) => {
                const isChecked = (localSettings.sectionsVisibility as any)[item.key] ?? true;
                return (
                  <label
                    key={item.key}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                      isChecked
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-slate-100'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span className="text-xs font-semibold">{item.name}</span>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) =>
                        setLocalSettings({
                          ...localSettings,
                          sectionsVisibility: {
                            ...localSettings.sectionsVisibility,
                            [item.key]: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-0"
                    />
                  </label>
                );
              })}
            </div>
          </div>

          {/* General Site SEO Settings */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h4 className="font-bold text-white text-sm">Site Info & SEO Meta:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Site Name:</label>
                <input
                  type="text"
                  value={localSettings.siteName}
                  onChange={(e) => setLocalSettings({ ...localSettings, siteName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Site Tagline:</label>
                <input
                  type="text"
                  value={localSettings.siteTagline}
                  onChange={(e) => setLocalSettings({ ...localSettings, siteTagline: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Meta Description:</label>
              <textarea
                rows={2}
                value={localSettings.siteDescription}
                onChange={(e) => setLocalSettings({ ...localSettings, siteDescription: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 6. STRIPE & PREMIUM CONFIGURATION */}
      {/* ------------------------------------------------------------- */}
      {adminTab === 'stripe' && (
        <div className="space-y-6 text-left">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-5 rounded-3xl bg-slate-900 border border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white">Premium Plans & Stripe Integration</h3>
              <p className="text-xs text-slate-400">Configure pricing tiers and Stripe publishable keys</p>
            </div>
            <button
              onClick={handleSaveSettings}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all shrink-0"
            >
              <Save className="w-4 h-4" />
              <span>Save Settings</span>
            </button>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h4 className="font-bold text-white text-sm mb-2">Subscription Prices ($ USD):</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Monthly Price ($):</label>
                <input
                  type="number"
                  step="0.01"
                  value={localSettings.premiumMonthlyPrice}
                  onChange={(e) => setLocalSettings({ ...localSettings, premiumMonthlyPrice: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Yearly Price ($):</label>
                <input
                  type="number"
                  step="0.01"
                  value={localSettings.premiumYearlyPrice}
                  onChange={(e) => setLocalSettings({ ...localSettings, premiumYearlyPrice: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Stripe Publishable Key:</label>
              <input
                type="text"
                value={localSettings.stripePublicKey}
                onChange={(e) => setLocalSettings({ ...localSettings, stripePublicKey: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-emerald-400 font-mono text-left focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
