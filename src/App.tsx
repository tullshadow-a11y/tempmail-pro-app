import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { EmailGeneratorCard } from './components/EmailGeneratorCard';
import { InboxView } from './components/InboxView';
import { InformationSection } from './components/InformationSection';
import { AdBanner } from './components/AdBanner';
import { MessageModal } from './components/MessageModal';
import { QRCodeModal } from './components/QRCodeModal';
import { AuthModal } from './components/AuthModal';
import { PremiumPage } from './components/PremiumPage';
import { BlogSection } from './components/BlogSection';
import { CustomPageView } from './components/CustomPageView';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';

import { 
  Account, 
  ActiveTab, 
  AdSlotConfig, 
  BlogPost, 
  CustomPage, 
  DomainItem, 
  MessageDetail, 
  MessageHeader, 
  SiteSettings 
} from './types';
import { MultiFallbackEmailService } from './services/emailService';
import { StorageService } from './services/storage';
import { SupabaseAuthService, UserProfile } from './services/supabase';
import { applyLanguageLayout, getInitialLanguage, Language } from './utils/i18n';
import { playNotificationSound } from './utils/audio';

export default function App() {
  // Navigation & Page State
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [selectedPostSlug, setSelectedPostSlug] = useState<string | null>(null);
  const [selectedPageSlug, setSelectedPageSlug] = useState<string | null>(null);

  // Language & Layout Presentation (Default Arabic RTL)
  const [language, setLanguage] = useState<Language>(getInitialLanguage);

  // Supabase User Profile & VIP State
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Email State
  const [account, setAccount] = useState<Account | null>(null);
  const [domains, setDomains] = useState<DomainItem[]>([]);
  const [messages, setMessages] = useState<(MessageHeader | MessageDetail)[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<MessageDetail | null>(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  // Loading & Timer States
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshSecondsLeft, setRefreshSecondsLeft] = useState(10);

  // Theme & Site Data
  const [theme, setTheme] = useState<'dark' | 'light'>(() => StorageService.getTheme());
  const [settings, setSettings] = useState<SiteSettings>(() => StorageService.getSiteSettings());
  const [adSlots, setAdSlots] = useState<AdSlotConfig[]>(() => StorageService.getAdSlots());
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() => StorageService.getBlogPosts());
  const [customPages, setCustomPages] = useState<CustomPage[]>(() => StorageService.getCustomPages());

  // Ref for audio chime on new mail
  const prevMsgCountRef = useRef(0);

  // -------------------------------------------------------------
  // INITIALIZATION: Apply RTL layout, Supabase Auth, & Domains
  // -------------------------------------------------------------
  useEffect(() => {
    applyLanguageLayout(language);
  }, [language]);

  useEffect(() => {
    let isMounted = true;

    async function initApp() {
      setIsLoading(true);
      try {
        // 1. Fetch Supabase User Profile & VIP status
        const profile = await SupabaseAuthService.getUserProfile();
        if (isMounted && profile) {
          setUserProfile(profile);
          if (profile.isVip) StorageService.setPremium(true);
        }

        // 2. Fetch available domains
        const fetchedDomains = await MultiFallbackEmailService.getDomains();
        if (isMounted) setDomains(fetchedDomains);

        // 3. Load stored account or create fresh multi-fallback account
        const storedAccount = StorageService.getAccount();
        if (storedAccount && storedAccount.address) {
          if (isMounted) {
            setAccount(storedAccount);
            await fetchMessagesForAccount(storedAccount);
          }
        } else {
          const { account: newAcc } = await MultiFallbackEmailService.createAccount();
          if (isMounted) {
            setAccount(newAcc);
            StorageService.saveAccount(newAcc);
            await fetchMessagesForAccount(newAcc);
          }
        }
      } catch (err) {
        console.error('Initialization error:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    initApp();

    // Listen for Supabase auth state changes
    const { data: authListener } = SupabaseAuthService.onAuthStateChange(async (user) => {
      if (user) {
        const prof = await SupabaseAuthService.getUserProfile(user.id);
        if (isMounted && prof) {
          setUserProfile(prof);
          if (prof.isVip) StorageService.setPremium(true);
        }
      } else {
        if (isMounted) setUserProfile(null);
      }
    });

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  // -------------------------------------------------------------
  // THEME EFFECT
  // -------------------------------------------------------------
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light-theme');
      document.body.className = 'bg-slate-100 text-slate-900 antialiased min-h-screen';
    } else {
      root.classList.add('dark');
      root.classList.remove('light-theme');
      document.body.className = 'bg-slate-950 text-slate-100 antialiased min-h-screen';
    }
    StorageService.saveTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    applyLanguageLayout(lang);
  };

  // -------------------------------------------------------------
  // AUTO REFRESH TIMER
  // -------------------------------------------------------------
  useEffect(() => {
    if (!account) return;

    const timer = setInterval(() => {
      setRefreshSecondsLeft((prev) => {
        if (prev <= 1) {
          handleSilentRefresh();
          return settings.autoRefreshIntervalSec || 10;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [account, settings.autoRefreshIntervalSec]);

  // -------------------------------------------------------------
  // FETCH MESSAGES (Multi-Fallback)
  // -------------------------------------------------------------
  const fetchMessagesForAccount = async (targetAccount?: Account | null) => {
    const currentAcc = targetAccount || account;
    if (!currentAcc) return;

    try {
      const remoteMessages = await MultiFallbackEmailService.getMessages(currentAcc);
      const localMsgs = StorageService.getLocalMessages(currentAcc.address);
      const combined = [...localMsgs, ...remoteMessages.filter(rm => !localMsgs.some(lm => lm.id === rm.id))];

      combined.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      if (combined.length > prevMsgCountRef.current && settings.soundEnabled && prevMsgCountRef.current > 0) {
        playNotificationSound();
      }
      prevMsgCountRef.current = combined.length;

      setMessages(combined);
    } catch (e) {
      console.warn('Error refreshing messages:', e);
    }
  };

  const handleSilentRefresh = async () => {
    if (!account) return;
    await fetchMessagesForAccount(account);
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    setRefreshSecondsLeft(settings.autoRefreshIntervalSec || 10);
    await fetchMessagesForAccount(account);
    setIsRefreshing(false);
  };

  // -------------------------------------------------------------
  // CHANGE EMAIL & DELETE EMAIL
  // -------------------------------------------------------------
  const handleChangeEmail = async (customUser?: string, customDomain?: string) => {
    setIsLoading(true);
    try {
      const { account: newAcc } = await MultiFallbackEmailService.createAccount(customUser, customDomain);
      setAccount(newAcc);
      StorageService.saveAccount(newAcc);
      setMessages([]);
      prevMsgCountRef.current = 0;
      await fetchMessagesForAccount(newAcc);
    } catch (err) {
      console.error('Change email error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEmail = async () => {
    if (!account) return;
    setIsLoading(true);
    try {
      StorageService.clearAccount();
      const { account: freshAcc } = await MultiFallbackEmailService.createAccount();
      setAccount(freshAcc);
      StorageService.saveAccount(freshAcc);
      setMessages([]);
      prevMsgCountRef.current = 0;
      await fetchMessagesForAccount(freshAcc);
    } catch (err) {
      console.error('Delete email error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------------------------------------------------
  // SELECT & VIEW MESSAGE
  // -------------------------------------------------------------
  const handleSelectMessage = async (msgId: string) => {
    const local = StorageService.getLocalMessages().find(m => m.id === msgId);
    if (local) {
      setSelectedMessage(local);
      setIsMessageModalOpen(true);
      return;
    }

    if (account) {
      const detail = await MultiFallbackEmailService.getMessageDetail(msgId, account);
      if (detail) {
        setSelectedMessage(detail);
        setIsMessageModalOpen(true);
        setMessages(prev => prev.map(m => m.id === msgId ? { ...m, seen: true } : m));
      }
    }
  };

  const handleDeleteMessage = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    StorageService.deleteLocalMessage(id);
    setMessages(prev => prev.filter(m => m.id !== id));
    if (selectedMessage?.id === id) {
      setIsMessageModalOpen(false);
      setSelectedMessage(null);
    }
  };

  const handleDeleteAllMessages = async () => {
    if (confirm('هل أنت تأكد من رغبتك في مسح كافة الرسائل من صندوق الوارد؟')) {
      for (const msg of messages) {
        StorageService.deleteLocalMessage(msg.id);
      }
      setMessages([]);
      prevMsgCountRef.current = 0;
    }
  };

  // -------------------------------------------------------------
  // SIMULATE / SEND TEST EMAIL
  // -------------------------------------------------------------
  const handleSendTestEmail = (templateKey: string = 'telegram') => {
    if (!account) return;

    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();

    let sender = { name: 'Telegram Security', address: 'support@telegram.org' };
    let subject = `كود التحقق الخاص بك لتيليجرام: ${randomOtp}`;
    let body = `أهلاً بك!\nكود التحقق الخاص بك هو: ${randomOtp}\nيرجى عدم مشاركة هذا الكود مع أي شخص لحماية حسابك.`;
    let html = `
      <div style="font-family: Cairo, sans-serif; padding: 20px; color: #1e293b; max-width: 500px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px;" dir="rtl">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #2563eb; margin: 0;">Telegram Messenger</h2>
        </div>
        <p style="font-size: 14px; line-height: 1.6;">كود التفعيل والتحقق الخاص بك هو:</p>
        <div style="text-align: center; margin: 25px 0;">
          <span style="font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #0f172a; background: #f1f5f9; padding: 12px 24px; border-radius: 8px; border: 1px dashed #cbd5e1; display: inline-block;">
            ${randomOtp}
          </span>
        </div>
        <p style="font-size: 12px; color: #64748b;">هذا الكود صالِح لمدة 10 دقائق.</p>
      </div>
    `;

    if (templateKey === 'netflix') {
      sender = { name: 'Netflix', address: 'info@account.netflix.com' };
      subject = `تأكيد حسابك - رمز التفعيل: ${randomOtp}`;
      body = `أهلاً بك في نيتفلكس!\nرمز التفعيل الخاص بك هو: ${randomOtp}`;
      html = `
        <div style="font-family: sans-serif; padding: 20px; background: #141414; color: #ffffff; border-radius: 12px;" dir="rtl">
          <h1 style="color: #e50914; margin: 0 0 15px 0;">NETFLIX</h1>
          <p style="font-size: 15px;">استخدم رمز التفعيل التالي لإكمال إعداد حسابك:</p>
          <div style="margin: 20px 0; font-size: 28px; font-weight: bold; color: #e50914; letter-spacing: 4px;">${randomOtp}</div>
        </div>
      `;
    }

    const newMsg: MessageDetail = {
      id: 'local_msg_' + Date.now(),
      from: sender,
      to: [{ address: account.address, name: 'You' }],
      subject,
      intro: body.slice(0, 80) + '...',
      seen: false,
      isDeleted: false,
      hasAttachments: false,
      size: 1420,
      createdAt: new Date().toISOString(),
      text: body,
      html: [html],
      extractedOtp: randomOtp,
    };

    StorageService.saveLocalMessage(newMsg);
    fetchMessagesForAccount(account);
    if (settings.soundEnabled) {
      playNotificationSound();
    }
  };

  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenCustomPage = (slug: string) => {
    setSelectedPageSlug(slug);
    setActiveTab('page');
  };

  const handleSelectBlogPost = (slug: string) => {
    setSelectedPostSlug(slug);
    setActiveTab('post');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isVip = Boolean(userProfile?.isVip);

  const headerAdSlot = adSlots.find(s => s.position === 'header');
  const sidebarAdSlot = adSlots.find(s => s.position === 'sidebar');
  const inboxBottomAdSlot = adSlots.find(s => s.position === 'inbox_bottom');
  const socialBarAdSlot = adSlots.find(s => s.position === 'social_bar');

  const currentPageObj = customPages.find(p => p.slug === selectedPageSlug) || customPages[0];

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* 1. Reconstructed Header with Centered Logo & Language Selector */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        toggleTheme={toggleTheme}
        language={language}
        onLanguageChange={handleLanguageChange}
        userProfile={userProfile}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onSignOut={async () => {
          await SupabaseAuthService.signOut();
          setUserProfile(null);
        }}
        customPages={customPages}
        onOpenCustomPage={handleOpenCustomPage}
        onScrollToSection={handleScrollToSection}
      />

      {/* 2. Top Leaderboard Banner (Adsterra Embed) - If not VIP */}
      {!isVip && settings.sectionsVisibility.adsHeader && headerAdSlot && headerAdSlot.enabled && (
        <AdBanner slot={headerAdSlot} position="header" />
      )}

      {/* 3. Main Router Body */}
      <main className="flex-1 w-full">
        {activeTab === 'home' && (
          <div>
            {/* Reconstructed Hero Section */}
            {settings.sectionsVisibility.hero && (
              <HeroSection language={language} />
            )}

            {/* Reconstructed Mail Card */}
            {settings.sectionsVisibility.hero && (
              <EmailGeneratorCard
                account={account}
                domains={domains}
                isLoading={isLoading}
                isRefreshing={isRefreshing}
                refreshSecondsLeft={refreshSecondsLeft}
                language={language}
                onRefresh={handleManualRefresh}
                onChangeEmail={handleChangeEmail}
                onDeleteEmail={handleDeleteEmail}
                onOpenQR={() => setIsQRModalOpen(true)}
              />
            )}

            {/* Inbox Section & Optional Sidebar Banner */}
            <div className="w-full max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className={!isVip && settings.sectionsVisibility.adsSidebar && sidebarAdSlot?.enabled ? 'lg:col-span-8' : 'lg:col-span-12'}>
                {settings.sectionsVisibility.inbox && (
                  <InboxView
                    messages={messages}
                    isLoading={isLoading}
                    isRefreshing={isRefreshing}
                    onRefresh={handleManualRefresh}
                    onSelectMessage={handleSelectMessage}
                    onDeleteMessage={handleDeleteMessage}
                    onDeleteAllMessages={handleDeleteAllMessages}
                    onSendTestEmail={handleSendTestEmail}
                  />
                )}

                {!isVip && settings.sectionsVisibility.adsNative && inboxBottomAdSlot && inboxBottomAdSlot.enabled && (
                  <AdBanner slot={inboxBottomAdSlot} position="inbox_bottom" />
                )}
              </div>

              {!isVip && settings.sectionsVisibility.adsSidebar && sidebarAdSlot && sidebarAdSlot.enabled && (
                <div className="lg:col-span-4 space-y-6 pt-6">
                  <AdBanner slot={sidebarAdSlot} position="sidebar" />
                </div>
              )}
            </div>

            {/* Why Us / Educational Section */}
            {settings.sectionsVisibility.whyUs && (
              <InformationSection />
            )}
          </div>
        )}

        {activeTab === 'premium' && (
          <PremiumPage
            settings={settings}
            userProfile={userProfile}
            language={language}
            onActivatePremium={async (tier) => {
              if (userProfile?.id) {
                await SupabaseAuthService.updateVipStatus(userProfile.id, tier, true);
                const updated = await SupabaseAuthService.getUserProfile(userProfile.id);
                if (updated) setUserProfile(updated);
              } else {
                StorageService.setPremium(true);
                setUserProfile({
                  id: 'local_vip',
                  email: 'vip@local.user',
                  isVip: true,
                  vipTier: tier,
                  createdAt: new Date().toISOString(),
                });
              }
            }}
            onCancelPremium={async () => {
              if (userProfile?.id) {
                await SupabaseAuthService.updateVipStatus(userProfile.id, 'free', false);
                const updated = await SupabaseAuthService.getUserProfile(userProfile.id);
                if (updated) setUserProfile(updated);
              }
              StorageService.setPremium(false);
            }}
            onBackToHome={() => setActiveTab('home')}
          />
        )}

        {(activeTab === 'blog' || activeTab === 'post') && (
          <BlogSection
            posts={blogPosts}
            selectedPostSlug={activeTab === 'post' ? selectedPostSlug : null}
            onSelectPost={handleSelectBlogPost}
            onBackToList={() => {
              setSelectedPostSlug(null);
              setActiveTab('blog');
            }}
          />
        )}

        {activeTab === 'page' && currentPageObj && (
          <CustomPageView
            page={currentPageObj}
            onBackToHome={() => setActiveTab('home')}
          />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard
            settings={settings}
            onUpdateSettings={(newS) => {
              setSettings(newS);
              StorageService.saveSiteSettings(newS);
            }}
            adSlots={adSlots}
            onUpdateAdSlots={(newSlots) => {
              setAdSlots(newSlots);
              StorageService.saveAdSlots(newSlots);
            }}
            blogPosts={blogPosts}
            onUpdateBlogPosts={(newPosts) => {
              setBlogPosts(newPosts);
              StorageService.saveBlogPosts(newPosts);
            }}
            customPages={customPages}
            onUpdateCustomPages={(newPages) => {
              setCustomPages(newPages);
              StorageService.saveCustomPages(newPages);
            }}
            onBackToHome={() => setActiveTab('home')}
          />
        )}
      </main>

      {/* 4. Floating Adsterra Social Bar Ad - If not VIP */}
      {!isVip && settings.sectionsVisibility.adsNative && socialBarAdSlot && socialBarAdSlot.enabled && (
        <AdBanner slot={socialBarAdSlot} position="social_bar" />
      )}

      {/* 5. Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        language={language}
        onAuthSuccess={(prof) => setUserProfile(prof)}
      />

      <MessageModal
        message={selectedMessage}
        isOpen={isMessageModalOpen}
        onClose={() => {
          setIsMessageModalOpen(false);
          setSelectedMessage(null);
        }}
        onDelete={handleDeleteMessage}
      />

      <QRCodeModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        email={account?.address || ''}
      />

      {/* 6. Footer */}
      <Footer
        setActiveTab={setActiveTab}
        customPages={customPages}
        onOpenCustomPage={handleOpenCustomPage}
      />
    </div>
  );
}
