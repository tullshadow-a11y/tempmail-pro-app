export interface Account {
  id: string;
  address: string;
  password?: string;
  token?: string;
  createdAt: string;
  expiresAt?: string;
  isCustom?: boolean;
}

export interface DomainItem {
  id: string;
  domain: string;
  isActive: boolean;
  isPrivate?: boolean;
  createdAt?: string;
}

export interface MessageSender {
  address: string;
  name: string;
}

export interface MessageAttachment {
  id: string;
  filename: string;
  contentType: string;
  disposition: string;
  transferEncoding: string;
  related: boolean;
  size: number;
  downloadUrl: string;
}

export interface MessageHeader {
  id: string;
  accountId?: string;
  msgid?: string;
  from: MessageSender;
  to: MessageSender[];
  subject: string;
  intro: string;
  seen: boolean;
  isDeleted: boolean;
  hasAttachments: boolean;
  size: number;
  downloadUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface MessageDetail extends MessageHeader {
  text?: string;
  html?: string[];
  attachments?: MessageAttachment[];
  extractedOtp?: string;
}

export type AdPosition = 'header' | 'sidebar' | 'inbox_bottom' | 'social_bar' | 'native_card';

export interface AdSlotConfig {
  id: string;
  position: AdPosition;
  name: string;
  enabled: boolean;
  provider: 'adsterra' | 'adsense' | 'custom';
  codeSnippet: string;
  customTitle?: string;
  customSubtitle?: string;
  customButtonText?: string;
  customTargetUrl?: string;
  customImageUrl?: string;
  badgeText?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  readTime: string;
  coverImage: string;
  tags: string[];
  views: number;
  published: boolean;
  createdAt: string;
}

export interface CustomPage {
  id: string;
  slug: string;
  title: string;
  content: string;
  inHeader: boolean;
  inFooter: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SiteSettings {
  siteName: string;
  siteTagline: string;
  siteDescription: string;
  contactEmail: string;
  autoRefreshIntervalSec: number;
  soundEnabled: boolean;
  allowCustomPrefix: boolean;
  currency: string;
  premiumMonthlyPrice: number;
  premiumYearlyPrice: number;
  stripePublicKey: string;
  stripeTestMode: boolean;
  sectionsVisibility: {
    hero: boolean;
    inbox: boolean;
    adsHeader: boolean;
    adsSidebar: boolean;
    adsNative: boolean;
    whyUs: boolean;
    howItWorks: boolean;
    faq: boolean;
    blog: boolean;
    premiumBanner: boolean;
  };
}

export interface PremiumPlan {
  id: string;
  name: string;
  nameEn: string;
  price: number;
  billingPeriod: 'month' | 'year' | 'lifetime';
  description: string;
  popular?: boolean;
  features: string[];
}

export type ActiveTab = 'home' | 'premium' | 'blog' | 'faq' | 'admin' | 'page' | 'post';
