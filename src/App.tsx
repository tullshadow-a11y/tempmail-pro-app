import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { EmailGeneratorCard } from './components/EmailGeneratorCard';
import { InboxView } from './components/InboxView';
import { InformationSection } from './components/InformationSection';
import { AdBanner } from './components/AdBanner';
import { MessageModal } from './components/MessageModal';
import { QRCodeModal } from './components/QRCodeModal';
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
import { MultiMailService } from './services/multiMailService';
import { StorageService } from './services/storage';
import { SupabaseService } from './services/supabase';
import { playNotificationSound } from './utils/audio';
import { getCurrentLanguage, setAppLanguage, LanguageOption, t } from './utils/i18n';

export default function App() {
  // Navigation & Page State
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [selectedPostSlug, setSelectedPostSlug] = useState<string | null>(null);
  const [selectedPageSlug, setSelectedPageSlug] = useState<string | null>(null);

  // i18n Language State
  const [currentLang, setCurrentLang] = useState<LanguageOption>(() => getCurrentLanguage());

  // Email & MultiMail Service State
  const [account, setAccount] = useState<Account | null>(null);
  const [domains, setDomains] = useState<DomainItem[]>([]);
  const [messages, setMessages] = useState<(MessageHeader | MessageDetail)[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<MessageDetail | null>(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  // Loading & Active Countdown Timer States (e.g. 600s -> 09:59 format)
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshSecondsLeft, setRefreshSecondsLeft] = useState(600);

  // Theme & Site Data
  const [theme, setTheme] = useState<'dark' | 'light'>(() => StorageService.getTheme());
  const [isPremium, setIsPremium] = useState<boolean>(() => StorageService.isPremium());
  const [settings, setSettings] = useState<SiteSettings>(() => StorageService.getSiteSettings());
  const [adSlots, setAdSlots] = useState<AdSlotConfig[]>(() => StorageService.getAdSlots());
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() => StorageService.getBlogPosts());
  const [customPages, setCustomPages] = useState<CustomPage[]>(() => StorageService.getCustomPages());

  const prevMsgCountRef = useRef(0);

  // -------------------------------------------------------------
  // INITIALIZATION: Language, Domains, Account, & Supabase VIP Check
  // -------------------------------------------------------------
  useEffect(() => {
    let isMounted = true;

    async function initApp() {
      setIsLoading(true);
      // Ensure document direction (RTL/LTR) is initialized
      setAppLanguage(currentLang.code);

      try {
        // 1. Fetch available domains from multi-provider engine
        const fetchedDomains = await MultiMailService.getDomains();
        if (isMounted) setDomains(fetchedDomains);

        // 2. Load stored account or create a new one
        const storedAccount = StorageService.getAccount();
        if (storedAccount && storedAccount.address && storedAccount.token) {
          if (isMounted) {
            setAccount(storedAccount);
            await fetchMessagesForAccount(storedAccount);
          }
        } else {
          const { account: newAcc } = await MultiMailService.createAccount();
          if (isMounted) {
            setAccount(newAcc);
            StorageService.saveAccount(newAcc);
            await fetchMessagesForAccount(newAcc);
          }
        }

        // 3. Check Supabase VIP status if account exists
        if (storedAccount?.address) {
          const isVip = await SupabaseService.checkSubscriberStatus(storedAccount.address);
          if (isVip && isMounted) {
            setIsPremium(true);
            StorageService.setPremium(true);
          }
        }
      } catch (err) {
        console.error('Initialization error:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    initApp();

    const pathname = (window.location.pathname || '').toLowerCase().replace(/\/$/, '');
    const hash = (window.location.hash || '').toLowerCase();
    const searchParams = new URLSearchParams(window.location.search || '');

    if (
      hash === '#admin' ||
      pathname === '/admin' ||
      pathname.startsWith('/admin/') ||
      searchParams.get('admin') === 'true' ||
      searchParams.get('tab') === 'admin'
    ) {
      setActiveTab('admin');
    } else if (
      hash === '#premium' ||
      pathname === '/premium' ||
      searchParams.get('tab') === 'premium'
    ) {
      setActiveTab('premium');
    } else if (
      hash === '#blog' ||
      pathname === '/blog' ||
      searchParams.get('tab') === 'blog'
    ) {
      setActiveTab('blog');
    }

    return () => {
      isMounted = false;
    };
  }, []);

  // Language Change Handler
  const handleLanguageChange = (lang: LanguageOption) => {
    const updated = setAppLanguage(lang.code);
    setCurrentLang(updated);
  };

  // -------------------------------------------------------------
  // THEME EFFECT
  // -------------------------------------------------------------
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light-theme');
      document.body.className = 'bg-slate-100 text-slate-900 antialiased selection:bg-emerald-500 selection:text-white min-h-screen';
    } else {
      root.classList.add('dark');
      root.classList.remove('light-theme');
      document.body.className = 'bg-slate-950 text-slate-100 antialiased selection:bg-emerald-500 selection:text-white min-h-screen';
    }
    StorageService.saveTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // -------------------------------------------------------------
  // ACTIVE COUNTDOWN TIMER (Counts down from 10 mins e.g. 09:59)
  // -------------------------------------------------------------
  useEffect(() => {
    if (!account) return;

    const timer = setInterval(() => {
      setRefreshSecondsLeft((prev) => {
        if (prev <= 1) {
          handleSilentRefresh();
          return 600; // Reset to 10 minutes (600 seconds)
        }
        // Poll every 10 seconds silently
        if (prev % 10 === 0) {
          handleSilentRefresh();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [account]);

  // -------------------------------------------------------------
  // FETCH MESSAGES
  // -------------------------------------------------------------
  const fetchMessagesForAccount = async (targetAccount?: Account | null) => {
    const currentAcc = targetAccount || account;
    if (!currentAcc) return;

    try {
      let remoteMessages: MessageHeader[] = [];
      if (currentAcc.token) {
        remoteMessages = await MultiMailService.getMessages(currentAcc.token);
      }

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
    await fetchMessagesForAccount(account);
    setIsRefreshing(false);
  };

  // -------------------------------------------------------------
  // CHANGE EMAIL
  // -------------------------------------------------------------
  const handleChangeEmail = async (customUser?: string, customDomain?: string) => {
    if (!isPremium && StorageService.getGeneratedCount() >= 10) {
      setActiveTab('premium');
      alert(currentLang.code === 'ar' ? 'لقد وصلت إلى الحد الأقصى للمستخدم غير المسجل (10 إيميلات مجانية). يرجى تسجيل الدخول أو الترقية للتعامل مع عدد غير محدود.' : 'You have reached the limit of 10 free emails for unauthenticated users. Please Sign Up / Log In to continue.');
      return;
    }
    setIsLoading(true);
    try {
      const { account: newAcc } = await MultiMailService.createAccount(customUser, customDomain);
      setAccount(newAcc);
      StorageService.saveAccount(newAcc);
      StorageService.incrementGeneratedCount();
      setMessages([]);
      prevMsgCountRef.current = 0;
      setRefreshSecondsLeft(600);
      await fetchMessagesForAccount(newAcc);
    } catch (err) {
      console.error('Change email error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------------------------------------------------
  // DELETE EMAIL & CREATE NEW
  // -------------------------------------------------------------
  const handleDeleteEmail = async () => {
    if (!account) return;
    if (!isPremium && StorageService.getGeneratedCount() >= 10) {
      setActiveTab('premium');
      alert(currentLang.code === 'ar' ? 'لقد وصلت إلى الحد الأقصى للمستخدم غير المسجل (10 إيميلات مجانية). يرجى تسجيل الدخول أو الترقية للمتابعة.' : 'You have reached the 10 free email limit for unauthenticated users. Please Sign Up / Log In to continue.');
      return;
    }
    setIsLoading(true);
    try {
      if (account.token) {
        await MultiMailService.deleteAccount(account.id, account.token);
      }
      StorageService.clearAccount();
      const { account: freshAcc } = await MultiMailService.createAccount();
      setAccount(freshAcc);
      StorageService.saveAccount(freshAcc);
      StorageService.incrementGeneratedCount();
      setMessages([]);
      prevMsgCountRef.current = 0;
      setRefreshSecondsLeft(600);
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

    if (account?.token) {
      const detail = await MultiMailService.getMessageDetail(msgId, account.token);
      if (detail) {
        setSelectedMessage(detail);
        setIsMessageModalOpen(true);
        setMessages(prev => prev.map(m => m.id === msgId ? { ...m, seen: true } : m));
      }
    }
  };

  // -------------------------------------------------------------
  // DELETE MESSAGE
  // -------------------------------------------------------------
  const handleDeleteMessage = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    StorageService.deleteLocalMessage(id);
    if (account?.token) {
      await MultiMailService.deleteMessage(id, account.token);
    }
    setMessages(prev => prev.filter(m => m.id !== id));
    if (selectedMessage?.id === id) {
      setIsMessageModalOpen(false);
      setSelectedMessage(null);
    }
  };

  const handleDeleteAllMessages = async () => {
    if (confirm('Are you sure you want to clear your inbox and delete all messages?')) {
      for (const msg of messages) {
        if (account?.token) {
          MultiMailService.deleteMessage(msg.id, account.token).catch(() => {});
        }
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
    let subject = `Your Telegram Login Code: ${randomOtp}`;
    let body = `Welcome!\n\nYour login verification code (OTP) is: ${randomOtp}\n\nPlease do not share this code with anyone to protect your account security.\nIf you did not request this code, you can safely ignore this message.`;
    let html = `
      <div style="font-family: sans-serif; padding: 20px; color: #1e293b; max-width: 500px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #2563eb; margin: 0;">Telegram Messenger</h2>
        </div>
        <p style="font-size: 14px; line-height: 1.6;">Welcome to Telegram Messenger,</p>
        <p style="font-size: 14px; line-height: 1.6;">Your verification code is:</p>
        <div style="text-align: center; margin: 25px 0;">
          <span style="font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #0f172a; background: #f1f5f9; padding: 12px 24px; border-radius: 8px; border: 1px dashed #cbd5e1; display: inline-block;">
            ${randomOtp}
          </span>
        </div>
        <p style="font-size: 12px; color: #64748b; line-height: 1.5;">This code is valid for 10 minutes. Do not share it with anyone.</p>
      </div>
    `;

    if (templateKey === 'netflix') {
      sender = { name: 'Netflix', address: 'info@account.netflix.com' };
      subject = `Confirm your email - Activation PIN: ${randomOtp}`;
      body = `Welcome to Netflix!\nYour account activation code is: ${randomOtp}`;
      html = `
        <div style="font-family: sans-serif; padding: 20px; background: #141414; color: #ffffff; border-radius: 12px;">
          <h1 style="color: #e50914; margin: 0 0 15px 0;">NETFLIX</h1>
          <p style="font-size: 15px;">Use the following verification code to complete setting up your account:</p>
          <div style="margin: 20px 0; font-size: 28px; font-weight: bold; color: #e50914; letter-spacing: 4px;">${randomOtp}</div>
        </div>
      `;
    } else if (templateKey === 'google') {
      sender = { name: 'Google Accounts', address: 'no-reply@accounts.google.com' };
      subject = `Google Security Alert: Verification code G-${randomOtp}`;
      body = `A verification code was requested for your Google account.\nCode is: G-${randomOtp}`;
      html = `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #dadce0; border-radius: 8px;">
          <h2 style="color: #4285f4;">Google</h2>
          <p>Verify your email address.</p>
          <p style="font-size: 24px; font-weight: bold; color: #202124;">G-${randomOtp}</p>
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

  const handleOpenCustomPage = (slug: string) => {
    setSelectedPageSlug(slug);
    setActiveTab('page');
  };

  const handleSelectBlogPost = (slug: string) => {
    setSelectedPostSlug(slug);
    setActiveTab('post');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const headerAdSlot = adSlots.find(s => s.position === 'header');
  const sidebarAdSlot = adSlots.find(s => s.position === 'sidebar');
  const inboxBottomAdSlot = adSlots.find(s => s.position === 'inbox_bottom');
  const socialBarAdSlot = adSlots.find(s => s.position === 'social_bar');

  const currentPageObj = customPages.find(p => p.slug === selectedPageSlug) || customPages[0];

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* 1. Centered Header with Logo & Language Dropdown Selector */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        toggleTheme={toggleTheme}
        isPremium={isPremium}
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        customPages={customPages}
        onOpenCustomPage={handleOpenCustomPage}
      />

      {/* 2. Top Leaderboard Banner */}
      {!isPremium && settings.sectionsVisibility.adsHeader && headerAdSlot && headerAdSlot.enabled && (
        <AdBanner slot={headerAdSlot} position="header" />
      )}

      {/* 3. Main Router */}
      <main className="flex-1 w-full">
        {activeTab === 'home' && (
          <div>
            {/* Hero Email Generator Card with Strict Matching Layout */}
            {settings.sectionsVisibility.hero && (
              <EmailGeneratorCard
                account={account}
                domains={domains}
                isLoading={isLoading}
                isRefreshing={isRefreshing}
                refreshSecondsLeft={refreshSecondsLeft}
                currentLang={currentLang}
                onRefresh={handleManualRefresh}
                onChangeEmail={handleChangeEmail}
                onDeleteEmail={handleDeleteEmail}
                onOpenQR={() => setIsQRModalOpen(true)}
              />
            )}

            {/* Main Content Layout */}
            <div className="w-full max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className={!isPremium && settings.sectionsVisibility.adsSidebar && sidebarAdSlot?.enabled ? 'lg:col-span-8' : 'lg:col-span-12'}>
                {settings.sectionsVisibility.inbox && (
                  <InboxView
                    messages={messages}
                    isLoading={isLoading}
                    isRefreshing={isRefreshing}
                    currentLang={currentLang}
                    onRefresh={handleManualRefresh}
                    onSelectMessage={handleSelectMessage}
                    onDeleteMessage={handleDeleteMessage}
                    onDeleteAllMessages={handleDeleteAllMessages}
                    onSendTestEmail={handleSendTestEmail}
                  />
                )}

                {!isPremium && settings.sectionsVisibility.adsNative && inboxBottomAdSlot && inboxBottomAdSlot.enabled && (
                  <AdBanner slot={inboxBottomAdSlot} position="inbox_bottom" />
                )}
              </div>

              {!isPremium && settings.sectionsVisibility.adsSidebar && sidebarAdSlot && sidebarAdSlot.enabled && (
                <div className="lg:col-span-4 space-y-6 pt-6">
                  <AdBanner slot={sidebarAdSlot} position="sidebar" />
                </div>
              )}
            </div>

            {settings.sectionsVisibility.whyUs && (
              <InformationSection />
            )}
          </div>
        )}

        {activeTab === 'premium' && (
          <PremiumPage
            settings={settings}
            isPremium={isPremium}
            onActivatePremium={async () => {
              setIsPremium(true);
              StorageService.setPremium(true);
              if (account?.address) {
                await SupabaseService.registerSubscriber(account.address, 'monthly');
              }
            }}
            onCancelPremium={() => {
              setIsPremium(false);
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

      {!isPremium && settings.sectionsVisibility.adsNative && socialBarAdSlot && socialBarAdSlot.enabled && (
        <AdBanner slot={socialBarAdSlot} position="social_bar" />
      )}

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

      <Footer
        setActiveTab={setActiveTab}
        customPages={customPages}
        onOpenCustomPage={handleOpenCustomPage}
      />
    </div>
  );
}
