import { Account, AdSlotConfig, BlogPost, CustomPage, MessageDetail, SiteSettings } from '../types';

const STORAGE_KEYS = {
  ACCOUNT: 'tempmail_account',
  MESSAGES: 'tempmail_local_messages',
  AD_SLOTS: 'tempmail_ad_slots',
  BLOG_POSTS: 'tempmail_blog_posts',
  CUSTOM_PAGES: 'tempmail_custom_pages',
  SITE_SETTINGS: 'tempmail_site_settings',
  THEME: 'tempmail_theme',
  LANG: 'tempmail_lang',
  ANALYTICS: 'tempmail_analytics',
  PREMIUM_STATUS: 'tempmail_premium_user',
  GENERATED_COUNT: 'tempmail_generated_count',
};

export const DEFAULT_AD_SLOTS: AdSlotConfig[] = [
  {
    id: 'slot-header',
    position: 'header',
    name: 'Header Banner (Leaderboard 728x90)',
    enabled: true,
    provider: 'adsterra',
    codeSnippet: '<!-- Adsterra Leaderboard Script Code -->\n<script type="text/javascript">\n\tatOptions = {\n\t\t\'key\' : \'adsterra_leaderboard_demo_key\',\n\t\t\'format\' : \'iframe\',\n\t\t\'height\' : 90,\n\t\t\'width\' : 728,\n\t\t\'params\' : {}\n\t};\n</script>',
    customTitle: 'Ultra Security Protection & High Speed VPN Access',
    customSubtitle: 'Get 70% off top security tools with advanced malware and anti-tracking protection.',
    customButtonText: 'Claim Offer',
    customTargetUrl: 'https://google.com',
    customImageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80',
    badgeText: 'Adsterra Recommended',
  },
  {
    id: 'slot-sidebar',
    position: 'sidebar',
    name: 'Sidebar Ad (Medium Rectangle 300x250)',
    enabled: true,
    provider: 'adsense',
    codeSnippet: '<!-- Google AdSense Responsive Unit -->\n<ins class="adsbygoogle"\n     style="display:block"\n     data-ad-client="ca-pub-1234567890123456"\n     data-ad-slot="9876543210"\n     data-ad-format="auto"\n     data-full-width-responsive="true"></ins>',
    customTitle: '100GB Free Encrypted Cloud Storage',
    customSubtitle: 'Securely store and share your files with end-to-end encryption.',
    customButtonText: 'Try Free',
    customTargetUrl: 'https://google.com',
    badgeText: 'Google Ad',
  },
  {
    id: 'slot-inbox-bottom',
    position: 'inbox_bottom',
    name: 'Native Inbox Banner (Inline)',
    enabled: true,
    provider: 'adsterra',
    codeSnippet: '<!-- Adsterra Native Banner -->\n<div id="adsterra-native-container"></div>',
    customTitle: 'Need virtual phone numbers for instant SMS activation?',
    customSubtitle: 'Get virtual numbers from over 50 countries to receive SMS verification instantly.',
    customButtonText: 'View Numbers',
    customTargetUrl: 'https://google.com',
    badgeText: 'Sponsored',
  },
  {
    id: 'slot-social-bar',
    position: 'social_bar',
    name: 'Social Bar (Floating Toast)',
    enabled: true,
    provider: 'adsterra',
    codeSnippet: '<!-- Adsterra Social Bar Script -->',
    customTitle: 'Special offer! Claim your 30-day premium VPN trial now.',
    customButtonText: 'View Deal',
    customTargetUrl: 'https://google.com',
    badgeText: 'Adsterra Social Bar',
  },
];

export const DEFAULT_BLOG_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    slug: 'what-is-temp-mail-and-why-use-it',
    title: 'What is Temporary Email and Why You Should Use It Daily for Privacy',
    excerpt: 'Learn about disposable temporary email services and how they protect your primary inbox from spam, data breaches, and ad tracking.',
    content: `
# What is Temporary Mail and Why is it Essential?

Every website and online platform asks for your email address during registration, file downloads, or article reading. But where does your real email address end up?

## Risks of Using Your Real Email Everywhere:
1. **Spam Overload:** Email lists are sold to advertisers, flooding your personal inbox with unwanted offers.
2. **Data Breaches:** If a service you signed up for suffers a breach, your email address and credentials can be exposed.
3. **Cross-Site Tracking:** Ad networks link your online activity across platforms using your primary email.

## How Temporary Mail Protects You:
- **Instant Address:** No registration, passwords, or personal details required.
- **Fast OTP Delivery:** Receive activation codes and verification links within seconds.
- **Automatic Self-Destruction:** Emails are destroyed automatically to leave zero digital footprint.

> **Pro Tip:** Keep your real email for banks, government services, and primary accounts. Use temporary email for everything else!
    `,
    category: 'Privacy & Security',
    author: {
      name: 'Alex Mercer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'Cybersecurity Expert',
    },
    readTime: '4 min read',
    coverImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80',
    tags: ['Temp Mail', 'Privacy', 'Data Protection', 'Anti-Spam'],
    views: 1420,
    published: true,
    createdAt: '2026-08-10T10:00:00Z',
  },
  {
    id: 'post-2',
    slug: 'how-developers-use-temp-mail-for-testing',
    title: 'How Developers and QA Engineers Use Disposable Mail for Testing',
    excerpt: 'A practical guide for developers and QA teams on automating user registration flows and email verification tests using temporary email APIs.',
    content: `
# Using Temporary Email in Software Testing

Testing user onboarding flows (Sign-up, Password Reset, Email Verification) is a core part of web and mobile development.

## Challenges Solved by Disposable Mail:
1. **Unlimited Accounts:** Create hundreds of test accounts without managing real mailboxes.
2. **HTML Inspection:** Ensure email templates render cleanly across clients.
3. **Automated Testing:** Programmatically generate addresses and verify inbox contents via lightweight APIs.
    `,
    category: 'Software Engineering',
    author: {
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      role: 'QA Automation Specialist',
    },
    readTime: '5 min read',
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
    tags: ['QA', 'Developers', 'Software Testing', 'API'],
    views: 890,
    published: true,
    createdAt: '2026-08-12T14:30:00Z',
  },
  {
    id: 'post-3',
    slug: 'top-safety-tips-against-phishing',
    title: '7 Crucial Safety Tips to Recognize Phishing Emails and Fraud',
    excerpt: 'Learn key indicators of suspicious emails, fake links, and malicious attachments to keep your personal data secure.',
    content: `
# How to Spot Phishing Messages Before It Is Too Late

Phishing attacks remain the leading entry point for credential theft and financial scams online.

## Warning Signs in Emails:
- **Unfamiliar Sender Domain:** Messages claiming to be from official services sending from random domains.
- **Urgent or Threatening Tone:** Demands for immediate action under threat of account suspension.
- **Requests for Sensitive Info:** Legitimate organizations never request passwords or PINs via email.
    `,
    category: 'Guides & Safety',
    author: {
      name: 'David Vance',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      role: 'Security Consultant',
    },
    readTime: '3 min read',
    coverImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80',
    tags: ['Phishing', 'Account Security', 'Tech Tips'],
    views: 2150,
    published: true,
    createdAt: '2026-08-15T09:15:00Z',
  }
];

export const DEFAULT_CUSTOM_PAGES: CustomPage[] = [
  {
    id: 'page-privacy',
    slug: 'privacy-policy',
    title: 'Privacy Policy',
    content: `
# Privacy Policy for TempMail Pro

Your privacy is our highest priority. This policy outlines how we handle data when you use our temporary email services.

## 1. No Personal Data Collection
- We do not ask for your real name, phone number, or personal details to generate temporary email addresses.
- The service is free and available without creating an account or logging in.

## 2. Automatic Email Deletion
- All received messages are subject to automatic periodic deletion to ensure zero persistent logs.
- You can manually destroy your mailbox or messages at any time.

## 3. Cookies & Ads
- We may store cookies locally on your device to save UI preferences (such as dark mode settings).
- Reliable ad networks (such as Adsterra and Google AdSense) display ads to maintain server operations and keep the service free.
    `,
    inHeader: false,
    inFooter: true,
    createdAt: '2026-08-01T00:00:00Z',
    updatedAt: '2026-08-16T00:00:00Z',
  },
  {
    id: 'page-terms',
    slug: 'terms-of-service',
    title: 'Terms of Service',
    content: `
# Terms of Service for TempMail Pro

By accessing or using our service, you agree to comply with the following terms:

## 1. Acceptable Use
- TempMail Pro is designed for personal privacy protection, software testing, and temporary communications.
- Illicit activities, spamming, fraud, and unlawful behavior using temporary emails are strictly prohibited.

## 2. Service Disclaimer
- Disposable mailboxes are temporary public channels. We hold no liability for lost messages after email expiration.
- Do not use temporary email addresses for critical financial accounts or permanent services.
    `,
    inHeader: false,
    inFooter: true,
    createdAt: '2026-08-01T00:00:00Z',
    updatedAt: '2026-08-16T00:00:00Z',
  },
  {
    id: 'page-about',
    slug: 'about-us',
    title: 'About Us',
    content: `
# About TempMail Pro

**TempMail Pro** is a leading disposable temporary email platform providing instant, secure, and spam-free communication tools to users worldwide.

## Our Mission:
Empower internet users to take full control over their digital privacy and online identity through fast, user-friendly, and accessible technology.
    `,
    inHeader: true,
    inFooter: true,
    createdAt: '2026-08-01T00:00:00Z',
    updatedAt: '2026-08-16T00:00:00Z',
  },
  {
    id: 'page-contact',
    slug: 'contact-us',
    title: 'Contact Us',
    content: `
# Get in Touch with TempMail Pro

We welcome your feedback, questions, and partnership inquiries.

- **Support Email:** support@tempmail.local
- **Advertising & Business:** ads@tempmail.local
- **Support Hours:** 24/7 Automated Infrastructure Support.
    `,
    inHeader: false,
    inFooter: true,
    createdAt: '2026-08-01T00:00:00Z',
    updatedAt: '2026-08-16T00:00:00Z',
  }
];

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  siteName: 'TempMail Pro',
  siteTagline: 'Instant & Secure Temporary Email Service',
  siteDescription: 'Generate instant temporary email addresses to receive activation messages, verification codes, and keep your primary inbox free from spam.',
  contactEmail: 'admin@tempmail.com',
  autoRefreshIntervalSec: 10,
  soundEnabled: true,
  allowCustomPrefix: true,
  currency: 'USD',
  premiumMonthlyPrice: 4.99,
  premiumYearlyPrice: 39.99,
  stripePublicKey: 'pk_test_TYooMQauvdEDq54NiTphI7jx',
  stripeTestMode: true,
  sectionsVisibility: {
    hero: true,
    inbox: true,
    adsHeader: true,
    adsSidebar: true,
    adsNative: true,
    whyUs: true,
    howItWorks: true,
    faq: true,
    blog: true,
    premiumBanner: true,
  },
};

export class StorageService {
  static getAccount(): Account | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACCOUNT);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  static saveAccount(account: Account): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ACCOUNT, JSON.stringify(account));
      this.incrementStat('emailsCreated');
    } catch (e) {
      console.error(e);
    }
  }

  static clearAccount(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.ACCOUNT);
    } catch (e) {
      console.error(e);
    }
  }

  // Local simulated messages when testing or offline
  static getLocalMessages(address?: string): MessageDetail[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MESSAGES);
      const list: MessageDetail[] = data ? JSON.parse(data) : [];
      if (address) {
        return list.filter(m => m.to.some(t => t.address.toLowerCase() === address.toLowerCase()));
      }
      return list;
    } catch {
      return [];
    }
  }

  static saveLocalMessage(msg: MessageDetail): void {
    try {
      const existing = this.getLocalMessages();
      const updated = [msg, ...existing.filter(m => m.id !== msg.id)];
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(updated));
      this.incrementStat('messagesReceived');
    } catch (e) {
      console.error(e);
    }
  }

  static deleteLocalMessage(id: string): void {
    try {
      const existing = this.getLocalMessages();
      const filtered = existing.filter(m => m.id !== id);
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(filtered));
    } catch (e) {
      console.error(e);
    }
  }

  // Ad slots
  static getAdSlots(): AdSlotConfig[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AD_SLOTS);
      return data ? JSON.parse(data) : DEFAULT_AD_SLOTS;
    } catch {
      return DEFAULT_AD_SLOTS;
    }
  }

  static saveAdSlots(slots: AdSlotConfig[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.AD_SLOTS, JSON.stringify(slots));
    } catch (e) {
      console.error(e);
    }
  }

  // Blog posts
  static getBlogPosts(): BlogPost[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BLOG_POSTS);
      return data ? JSON.parse(data) : DEFAULT_BLOG_POSTS;
    } catch {
      return DEFAULT_BLOG_POSTS;
    }
  }

  static saveBlogPosts(posts: BlogPost[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.BLOG_POSTS, JSON.stringify(posts));
    } catch (e) {
      console.error(e);
    }
  }

  // Custom pages
  static getCustomPages(): CustomPage[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_PAGES);
      return data ? JSON.parse(data) : DEFAULT_CUSTOM_PAGES;
    } catch {
      return DEFAULT_CUSTOM_PAGES;
    }
  }

  static saveCustomPages(pages: CustomPage[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_PAGES, JSON.stringify(pages));
    } catch (e) {
      console.error(e);
    }
  }

  // Site Settings
  static getSiteSettings(): SiteSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SITE_SETTINGS);
      if (!data) return DEFAULT_SITE_SETTINGS;
      const parsed = JSON.parse(data);
      return {
        ...DEFAULT_SITE_SETTINGS,
        ...parsed,
        sectionsVisibility: {
          ...DEFAULT_SITE_SETTINGS.sectionsVisibility,
          ...(parsed?.sectionsVisibility || {}),
        },
      };
    } catch {
      return DEFAULT_SITE_SETTINGS;
    }
  }

  static saveSiteSettings(settings: SiteSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SITE_SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  }

  // Theme
  static getTheme(): 'dark' | 'light' {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME);
      return (saved === 'light' || saved === 'dark') ? saved : 'dark';
    } catch {
      return 'dark';
    }
  }

  static saveTheme(theme: 'dark' | 'light'): void {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch (e) {
      console.error(e);
    }
  }

  // Premium status
  static getGeneratedCount(): number {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.GENERATED_COUNT);
      return data ? parseInt(data, 10) : 0;
    } catch {
      return 0;
    }
  }

  static incrementGeneratedCount(): number {
    try {
      const current = this.getGeneratedCount();
      const updated = current + 1;
      localStorage.setItem(STORAGE_KEYS.GENERATED_COUNT, String(updated));
      return updated;
    } catch {
      return 1;
    }
  }

  static isPremium(): boolean {
    try {
      return localStorage.getItem(STORAGE_KEYS.PREMIUM_STATUS) === 'true';
    } catch {
      return false;
    }
  }

  static setPremium(val: boolean): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PREMIUM_STATUS, val ? 'true' : 'false');
    } catch (e) {
      console.error(e);
    }
  }

  // Analytics
  static getStats(): { emailsCreated: number; messagesReceived: number; activeUsers: number; adImpressions: number } {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ANALYTICS);
      return data ? JSON.parse(data) : { emailsCreated: 12480, messagesReceived: 48920, activeUsers: 830, adImpressions: 142300 };
    } catch {
      return { emailsCreated: 12480, messagesReceived: 48920, activeUsers: 830, adImpressions: 142300 };
    }
  }

  static incrementStat(key: 'emailsCreated' | 'messagesReceived' | 'adImpressions'): void {
    try {
      const stats = this.getStats();
      stats[key] = (stats[key] || 0) + 1;
      localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(stats));
    } catch (e) {
      console.error(e);
    }
  }
}
