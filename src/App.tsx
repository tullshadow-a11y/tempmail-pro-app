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
import { MailGwService, extractVerificationCode } from './services/mailGw';
import { StorageService } from './services/storage';
import { playNotificationSound } from './utils/audio';

export default function App() {
  // Navigation & Page State
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [selectedPostSlug, setSelectedPostSlug] = useState<string | null>(null);
  const [selectedPageSlug, setSelectedPageSlug] = useState<string | null>(null);

  // Email & Mail.gw State
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
  const [isPremium, setIsPremium] = useState<boolean>(() => StorageService.isPremium());
  const [settings, setSettings] = useState<SiteSettings>(() => StorageService.getSiteSettings());
  const [adSlots, setAdSlots] = useState<AdSlotConfig[]>(() => StorageService.getAdSlots());
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() => StorageService.getBlogPosts());
  const [customPages, setCustomPages] = useState<CustomPage[]>(() => StorageService.getCustomPages());

  // Ref to track previous message count for audio chime
  const prevMsgCountRef = useRef(0);

  // -------------------------------------------------------------
  // INITIALIZATION: Load Domains & Create/Load Account
  // -------------------------------------------------------------
  useEffect(() => {
    let isMounted = true;

    async function initApp() {
      setIsLoading(true);
      try {
        // 1. Fetch available domains
        const fetchedDomains = await MailGwService.getDomains();
        if (isMounted) setDomains(fetchedDomains);

        // 2. Load stored account or create a fresh one
        const storedAccount = StorageService.getAccount();
        if (storedAccount && storedAccount.address && storedAccount.token) {
          if (isMounted) {
            setAccount(storedAccount);
            await fetchMessagesForAccount(storedAccount);
          }
        } else {
          // Create a new fresh account
          const { account: newAcc } = await MailGwService.createAccount();
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

    // Check if URL specifies admin or custom route
    if (window.location.hash === '#admin' || window.location.pathname.includes('/admin')) {
      setActiveTab('admin');
    }

    return () => {
      isMounted = false;
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
  // AUTO REFRESH TIMER (Countdown from 10s to 0)
  // -------------------------------------------------------------
  useEffect(() => {
    if (!account) return;

    const timer = setInterval(() => {
      setRefreshSecondsLeft((prev) => {
        if (prev <= 1) {
          // Trigger message check
          handleSilentRefresh();
          return settings.autoRefreshIntervalSec || 10;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [account, settings.autoRefreshIntervalSec]);

  // -------------------------------------------------------------
  // FETCH MESSAGES (Combining mail.gw & local messages)
  // -------------------------------------------------------------
  const fetchMessagesForAccount = async (targetAccount?: Account | null) => {
    const currentAcc = targetAccount || account;
    if (!currentAcc) return;

    try {
      let remoteMessages: MessageHeader[] = [];
      if (currentAcc.token && !currentAcc.token.startsWith('local_')) {
        try {
          remoteMessages = await MailGwService.getMessages(currentAcc.token);
        } catch (err: any) {
          // If token expired, recreate
          if (err.message === 'UNAUTHORIZED') {
            const fresh = await MailGwService.createAccount();
            setAccount(fresh.account);
            StorageService.saveAccount(fresh.account);
            return;
          }
        }
      }

      // Merge with local simulated messages for this address
      const localMsgs = StorageService.getLocalMessages(currentAcc.address);
      const combined = [...localMsgs, ...remoteMessages.filter(rm => !localMsgs.some(lm => lm.id === rm.id))];

      // Sort by newest first
      combined.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      // Check if new message arrived -> play chime sound!
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
  // CHANGE EMAIL (Custom Prefix & Domain OR Random)
  // -------------------------------------------------------------
  const handleChangeEmail = async (customUser?: string, customDomain?: string) => {
    setIsLoading(true);
    try {
      const { account: newAcc } = await MailGwService.createAccount(customUser, customDomain);
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

  // -------------------------------------------------------------
  // DELETE EMAIL & CREATE NEW
  // -------------------------------------------------------------
  const handleDeleteEmail = async () => {
    if (!account) return;
    setIsLoading(true);
    try {
      if (account.token && !account.token.startsWith('local_')) {
        await MailGwService.deleteAccount(account.id, account.token);
      }
      StorageService.clearAccount();
      const { account: freshAcc } = await MailGwService.createAccount();
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
    // 1. Check if it's in local messages
    const local = StorageService.getLocalMessages().find(m => m.id === msgId);
    if (local) {
      setSelectedMessage(local);
      setIsMessageModalOpen(true);
      return;
    }

    // 2. Fetch full detail from mail.gw
    if (account?.token) {
      const detail = await MailGwService.getMessageDetail(msgId, account.token);
      if (detail) {
        setSelectedMessage(detail);
        setIsMessageModalOpen(true);
        // Mark as seen in messages state
        setMessages(prev => prev.map(m => m.id === msgId ? { ...m, seen: true } : m));
      }
    }
  };

  // -------------------------------------------------------------
  // DELETE MESSAGE
  // -------------------------------------------------------------
  const handleDeleteMessage = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    // Delete local
    StorageService.deleteLocalMessage(id);
    // Delete remote if token exists
    if (account?.token && !account.token.startsWith('local_')) {
      await MailGwService.deleteMessage(id, account.token);
    }
    setMessages(prev => prev.filter(m => m.id !== id));
    if (selectedMessage?.id === id) {
      setIsMessageModalOpen(false);
      setSelectedMessage(null);
    }
  };

  const handleDeleteAllMessages = async () => {
    if (confirm('هل تريد بالتأكيد إفراغ صندوق الوارد وحذف جميع الرسائل؟')) {
      for (const msg of messages) {
        if (account?.token && !account.token.startsWith('local_')) {
          MailGwService.deleteMessage(msg.id, account.token).catch(() => {});
        }
        StorageService.deleteLocalMessage(msg.id);
      }
      setMessages([]);
      prevMsgCountRef.current = 0;
    }
  };

  // -------------------------------------------------------------
  // SIMULATE / SEND TEST EMAIL (Immediate OTP test delivery)
  // -------------------------------------------------------------
  const handleSendTestEmail = (templateKey: string = 'telegram') => {
    if (!account) return;

    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();

    let sender = { name: 'Telegram Security', address: 'support@telegram.org' };
    let subject = `كود تسجيل الدخول الخاص بك في تيليجرام: ${randomOtp}`;
    let body = `مرحباً بك!\n\nرمز التحقق (OTP) الخاص بتسجيل دخول حسابك هو: ${randomOtp}\n\nيرجى عدم مشاركة هذا الرمز مع أي شخص لحماية حسابك.\nإذا لم تطلب هذا الرمز، يمكنك تجاهل هذه الرسالة بأمان.`;
    let html = `
      <div style="font-family: sans-serif; padding: 20px; color: #1e293b; max-width: 500px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #2563eb; margin: 0;">Telegram Messenger</h2>
        </div>
        <p style="font-size: 14px; line-height: 1.6;">مرحباً بك في خدمة تيليجرام،</p>
        <p style="font-size: 14px; line-height: 1.6;">رمز التحقق الخاص بك هو:</p>
        <div style="text-align: center; margin: 25px 0;">
          <span style="font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #0f172a; background: #f1f5f9; padding: 12px 24px; border-radius: 8px; border: 1px dashed #cbd5e1; display: inline-block;">
            ${randomOtp}
          </span>
        </div>
        <p style="font-size: 12px; color: #64748b; line-height: 1.5;">هذا الرمز صالح لمدة 10 دقائق فقط. لا تشاركه مع أي جهة.</p>
      </div>
    `;

    if (templateKey === 'netflix') {
      sender = { name: 'Netflix', address: 'info@account.netflix.com' };
      subject = `تأكيد بريدك الإلكتروني - رمز التفعيل: ${randomOtp}`;
      body = `أهلاً بك في Netflix!\nرمز التفعيل الخاص بحسابك هو: ${randomOtp}`;
      html = `
        <div style="font-family: sans-serif; padding: 20px; background: #141414; color: #ffffff; border-radius: 12px;">
          <h1 style="color: #e50914; margin: 0 0 15px 0;">NETFLIX</h1>
          <p style="font-size: 15px;">استخدم رمز التحقق التالي لإكمال إعداد حسابك:</p>
          <div style="margin: 20px 0; font-size: 28px; font-weight: bold; color: #e50914; letter-spacing: 4px;">${randomOtp}</div>
        </div>
      `;
    } else if (templateKey === 'google') {
      sender = { name: 'Google Accounts', address: 'no-reply@accounts.google.com' };
      subject = `تنبيه أمان Google: رمز التحقق G-${randomOtp}`;
      body = `تم طلب رمز التحقق لحسابك في Google.\nالرمز هو: G-${randomOtp}`;
      html = `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #dadce0; border-radius: 8px;">
          <h2 style="color: #4285f4;">Google</h2>
          <p>تحقق من عنوان بريدك الإلكتروني.</p>
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

  // -------------------------------------------------------------
  // CUSTOM PAGES & BLOG NAVIGATION
  // -------------------------------------------------------------
  const handleOpenCustomPage = (slug: string) => {
    setSelectedPageSlug(slug);
    setActiveTab('page');
  };

  const handleSelectBlogPost = (slug: string) => {
    setSelectedPostSlug(slug);
    setActiveTab('post');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // -------------------------------------------------------------
  // ADS CONFIGURATION HELPERS
  // -------------------------------------------------------------
  const headerAdSlot = adSlots.find(s => s.position === 'header');
  const sidebarAdSlot = adSlots.find(s => s.position === 'sidebar');
  const inboxBottomAdSlot = adSlots.find(s => s.position === 'inbox_bottom');
  const socialBarAdSlot = adSlots.find(s => s.position === 'social_bar');

  const currentPageObj = customPages.find(p => p.slug === selectedPageSlug) || customPages[0];

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* 1. Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        toggleTheme={toggleTheme}
        isPremium={isPremium}
        customPages={customPages}
        onOpenCustomPage={handleOpenCustomPage}
      />

      {/* 2. Top Leaderboard Banner (Under Header) - If not Premium & Enabled */}
      {!isPremium && settings.sectionsVisibility.adsHeader && headerAdSlot && headerAdSlot.enabled && (
        <AdBanner slot={headerAdSlot} position="header" />
      )}

      {/* 3. Main Body Route Router */}
      <main className="flex-1 w-full">
        {/* ========================================================= */}
        {/* TAB: HOME / INBOX */}
        {/* ========================================================= */}
        {activeTab === 'home' && (
          <div>
            {/* Hero Email Generator Card */}
            {settings.sectionsVisibility.hero && (
              <EmailGeneratorCard
                account={account}
                domains={domains}
                isLoading={isLoading}
                isRefreshing={isRefreshing}
                refreshSecondsLeft={refreshSecondsLeft}
                onRefresh={handleManualRefresh}
                onChangeEmail={handleChangeEmail}
                onDeleteEmail={handleDeleteEmail}
                onOpenQR={() => setIsQRModalOpen(true)}
              />
            )}

            {/* Main Content Layout with Sidebar Banner Support */}
            <div className="w-full max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Center Inbox Area */}
              <div className={!isPremium && settings.sectionsVisibility.adsSidebar && sidebarAdSlot?.enabled ? 'lg:col-span-8' : 'lg:col-span-12'}>
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

                {/* Inline Banner Under Inbox */}
                {!isPremium && settings.sectionsVisibility.adsNative && inboxBottomAdSlot && inboxBottomAdSlot.enabled && (
                  <AdBanner slot={inboxBottomAdSlot} position="inbox_bottom" />
                )}
              </div>

              {/* Sidebar Ad (AdSense 300x250) */}
              {!isPremium && settings.sectionsVisibility.adsSidebar && sidebarAdSlot && sidebarAdSlot.enabled && (
                <div className="lg:col-span-4 space-y-6 pt-6">
                  <AdBanner slot={sidebarAdSlot} position="sidebar" />
                </div>
              )}
            </div>

            {/* Educational & Privacy Information Section */}
            {settings.sectionsVisibility.whyUs && (
              <InformationSection />
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: PREMIUM PRICING PAGE */}
        {/* ========================================================= */}
        {activeTab === 'premium' && (
          <PremiumPage
            settings={settings}
            isPremium={isPremium}
            onActivatePremium={() => {
              setIsPremium(true);
              StorageService.setPremium(true);
            }}
            onCancelPremium={() => {
              setIsPremium(false);
              StorageService.setPremium(false);
            }}
            onBackToHome={() => setActiveTab('home')}
          />
        )}

        {/* ========================================================= */}
        {/* TAB: BLOG & ARTICLES */}
        {/* ========================================================= */}
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

        {/* ========================================================= */}
        {/* TAB: CUSTOM PAGE (Privacy, Terms, About, etc.) */}
        {/* ========================================================= */}
        {activeTab === 'page' && currentPageObj && (
          <CustomPageView
            page={currentPageObj}
            onBackToHome={() => setActiveTab('home')}
          />
        )}

        {/* ========================================================= */}
        {/* TAB: ADMIN DASHBOARD */}
        {/* ========================================================= */}
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

      {/* 4. Social Bar Ad (Adsterra Floating Toast) - If not Premium */}
      {!isPremium && settings.sectionsVisibility.adsNative && socialBarAdSlot && socialBarAdSlot.enabled && (
        <AdBanner slot={socialBarAdSlot} position="social_bar" />
      )}

      {/* 5. Message Reader Modal */}
      <MessageModal
        message={selectedMessage}
        isOpen={isMessageModalOpen}
        onClose={() => {
          setIsMessageModalOpen(false);
          setSelectedMessage(null);
        }}
        onDelete={handleDeleteMessage}
      />

      {/* 6. QR Code Scanner Modal */}
      <QRCodeModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        email={account?.address || ''}
      />

      {/* 7. Footer */}
      <Footer
        setActiveTab={setActiveTab}
        customPages={customPages}
        onOpenCustomPage={handleOpenCustomPage}
      />
    </div>
  );
}
