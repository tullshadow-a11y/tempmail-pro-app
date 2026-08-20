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
};

export const DEFAULT_AD_SLOTS: AdSlotConfig[] = [
  {
    id: 'slot-header',
    position: 'header',
    name: 'بنر إعلاني علوي (Leaderboard 728x90)',
    enabled: true,
    provider: 'adsterra',
    codeSnippet: '<!-- Adsterra Leaderboard Script Code -->\n<script type="text/javascript">\n\tatOptions = {\n\t\t\'key\' : \'adsterra_leaderboard_demo_key\',\n\t\t\'format\' : \'iframe\',\n\t\t\'height\' : 90,\n\t\t\'width\' : 728,\n\t\t\'params\' : {}\n\t};\n</script>',
    customTitle: 'حماية أمنية فائقة وسرعة إنترنت غير محدودة',
    customSubtitle: 'احصل على خصم 70% على أفضل VPN لعام 2026 مع حماية متقدمة من التتبع.',
    customButtonText: 'تفعيل العرض الآن',
    customTargetUrl: 'https://google.com',
    customImageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80',
    badgeText: 'إعلان موصى به',
  },
  {
    id: 'slot-sidebar',
    position: 'sidebar',
    name: 'بنر إعلاني جانبي (Medium Rectangle 300x250)',
    enabled: true,
    provider: 'adsense',
    codeSnippet: '<!-- Google AdSense Responsive Unit -->\n<ins class="adsbygoogle"\n     style="display:block"\n     data-ad-client="ca-pub-1234567890123456"\n     data-ad-slot="9876543210"\n     data-ad-format="auto"\n     data-full-width-responsive="true"></ins>',
    customTitle: 'سحابة تخزين مجانية 100GB مشفرة',
    customSubtitle: 'احفظ ملفاتك بأمان مع تشفير من طرف لطرف بدون أي إعلانات مزعجة.',
    customButtonText: 'تجربة مجانية',
    customTargetUrl: 'https://google.com',
    badgeText: 'Google Ad',
  },
  {
    id: 'slot-inbox-bottom',
    position: 'inbox_bottom',
    name: 'بنر تحت صندوق الوارد (Inline Banner)',
    enabled: true,
    provider: 'adsterra',
    codeSnippet: '<!-- Adsterra Native Banner -->\n<div id="adsterra-native-container"></div>',
    customTitle: 'هل تحتاج إلى رقم هاتف مؤقت لاستقبال SMS؟',
    customSubtitle: 'احصل على أرقام هواتف افتراضية لتفعيل حسابات واتساب وتيليجرام وجوجل فوراً.',
    customButtonText: 'تصفح الأرقام المتاحة',
    customTargetUrl: 'https://google.com',
    badgeText: 'إعلان مدعوم',
  },
  {
    id: 'slot-social-bar',
    position: 'social_bar',
    name: 'شريط الإعلانات التفاعلي (Social Bar / Floating Notification)',
    enabled: true,
    provider: 'adsterra',
    codeSnippet: '<!-- Adsterra Social Bar Script -->',
    customTitle: '🎉 وصلك عرض خاص! استبدل كود الخصم TEMPFREE للحصول على اشتراك VIP',
    customButtonText: 'مشاهدة التفاصيل',
    customTargetUrl: 'https://google.com',
    badgeText: 'إشعار مميز',
  },
];

export const DEFAULT_BLOG_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    slug: 'what-is-temp-mail-and-why-use-it',
    title: 'ما هو البريد المؤقت ولماذا يجب أن تستخدمه يومياً لحماية خصوصيتك؟',
    excerpt: 'تعرف على مفهوم البريد الإلكتروني المؤقت (Disposable Email) وكيف يساعدك في التخلص من الرسائل الترويجية المزعجة وحماية بياناتك الشخصية.',
    content: `
# ما هو البريد المؤقت ولماذا أصبح ضرورة رقمية؟

في عالم اليوم، يطلب كل موقع أو تطبيق على الإنترنت عنوان بريدك الإلكتروني عند التسجيل أو حتى لتحميل ملف بسيط أو قراءة مقال. ولكن هل تساءلت يوماً أين ينتهي المطاف ببريدك الإلكتروني الحقيقي؟

## أخطار استخدام بريدك الشخصي في كل مكان:
1. **تراكم الرسائل المزعجة (Spam):** تباع قوائم البريد الإلكتروني للشركات الإعلانية، مما يغرق صندوق بريدك بآلاف العروض غير المرغوبة.
2. **تسريب البيانات والاختراقات:** إذا تعرض الموقع الذي سجلت فيه للاختراق، فإن بريدك وربما كلمة مرورك تصبح متاحة للمخترقين.
3. **تتبع نشاطك الرقمي:** تستخدم بعض الشركات عنوان بريدك لربط نشاطك عبر مواقع متعددة وبناء ملف إعلاني عنك.

## كيف يحميك البريد المؤقت (Temp Mail)؟
- **عنوان بريد فوري:** بدون الحاجة لأي تسجيل أو إدخال بيانات شخصية.
- **استقبال فوري لأكواد التفعيل:** تصلك رسائل التحقق (OTP) خلال ثوانٍ معدودة.
- **تدمير ذاتي آمن:** يتم حذف الرسائل والعناوين بعد فترة محددة، مما يضمن عدم ترك أي أثر لك على الشبكة.

> **نصيحة ذهبية:** استخدم بريدك الشخصي فقط للبنوك، والخدمات الحكومية، والمعاملات الرسمية. واستخدم البريد المؤقت لأي موقع آخر!
    `,
    category: 'الخصوصية والأمان',
    author: {
      name: 'أحمد المنصور',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'خبير الأمن السيبراني',
    },
    readTime: '4 دقائق',
    coverImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80',
    tags: ['البريد المؤقت', 'الخصوصية', 'حماية البيانات', 'مكافحة السبام'],
    views: 1420,
    published: true,
    createdAt: '2026-08-10T10:00:00Z',
  },
  {
    id: 'post-2',
    slug: 'how-developers-use-temp-mail-for-testing',
    title: 'كيف يستفيد المطورون ومختبرو الأنظمة (QA) من البريد المؤقت في اختبار التطبيقات؟',
    excerpt: 'دليل عملي للمبرمجين ومختبري الجودة حول كيفية أتمتة اختبارات التسجيل وتفعيل الحسابات باستخدام خدمات البريد المؤقت.',
    content: `
# استخدام البريد المؤقت في هندسة البرمجيات واختبار الأنظمة

يعد اختبار دورة حياة المستخدم (Sign-up flow, Password Reset, Email Verification) من أهم مراحل تطوير أي تطبيق ويب أو هاتف.

## التحديات التي يحلها البريد المؤقت للمطورين:
1. **اختبار غير محدود:** إنشاء مئات الحسابات الوهمية دون الحاجة لامتلاك مئات العناوين الحقيقية على Gmail أو Outlook.
2. **فحص الروابط والأكواد:** التأكد من وصول رسائل HTML بشكل سليم وتطابق التصميم مع مختلف عملاء البريد.
3. **سرعة التنفيذ:** لا حاجة لعمليات التحقق الثنائي المعقدة أثناء مرحلة التطوير والاختبار التجريبي (Staging).

## نصائح لأتمتة الاختبارات:
يمكنك استخدام واجهات البرمجة الخاصة بنا لإنشاء إيميلات واستقبال الرسائل برمجياً عبر API مخصص ومجاني.
    `,
    category: 'تطوير البرمجيات',
    author: {
      name: 'سارة العتيبي',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      role: 'مهندسة جودة برمجيات',
    },
    readTime: '5 دقائق',
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
    tags: ['QA', 'مطورين', 'اختبار البرمجيات', 'API'],
    views: 890,
    published: true,
    createdAt: '2026-08-12T14:30:00Z',
  },
  {
    id: 'post-3',
    slug: 'top-safety-tips-against-phishing',
    title: 'أهم 7 نصائح للحماية من هجمات التصيد الاحتيالي (Phishing) والرسائل الخبيثة',
    excerpt: 'تعرف على حيل المحتالين عبر البريد الإلكتروني وكيف تميز الرسائل المزيفة والروابط المشبوهة بسهولة واحترافية.',
    content: `
# كيف تكتشف رسائل التصيد الاحتيالي قبل فوات الأوان؟

تعتبر هجمات التصيد الإلكتروني السبب الأول في اختراق الحسابات وسرقة البطاقات البنكية حول العالم.

## العلامات التحذيرية في أي رسالة إلكترونية:
- **اسم النطاق غير المألوف:** وصول رسالة تدعي أنها من بنك أو شركة معروفة من عنوان ينتهي بنطاق مجاني أو غريب.
- **نبرة التهديد أو الاستعجال:** "سيتم إغلاق حسابك خلال 24 ساعة إن لم تؤكد بياناتك فوراً!".
- **طلب معلومات حساسة:** لا تطلب المؤسسات الحقيقية كلمة المرور أو رقم البطاقة عبر رسالة إيميل عادية.
- **روابط مختصرة أو مخفية:** مرر الماوس فوق الرابط قبل الضغط عليه للتأكد من الوجهة الحقيقية.
    `,
    category: 'نصائح وإرشادات',
    author: {
      name: 'خالد إبراهيم',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      role: 'مستشار أمن المعلومات',
    },
    readTime: '3 دقائق',
    coverImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80',
    tags: ['التصيد الاحتيالي', 'أمان الحسابات', 'نصائح تقنية'],
    views: 2150,
    published: true,
    createdAt: '2026-08-15T09:15:00Z',
  }
];

export const DEFAULT_CUSTOM_PAGES: CustomPage[] = [
  {
    id: 'page-privacy',
    slug: 'privacy-policy',
    title: 'سياسة الخصوصية',
    content: `
# سياسة الخصوصية لموقع TempMail Pro

نحن نضع خصوصيتك وأمان بياناتك على رأس أولوياتنا. تهدف هذه السياسة إلى توضيح كيفية تعاملنا مع البيانات عند استخدامك لخدمات البريد المؤقت.

## 1. عدم جمع البيانات الشخصية
- لا نطلب منك إدخال اسمك الحقيقي، رقم هاتفك، أو أي بيانات شخصية لتوليد بريد مؤقت.
- الخدمة مجانية ومتاحة دون الحاجة لإنشاء حساب أو تسجيل دخول.

## 2. حذف الرسائل التلقائي
- جميع الرسائل الواردة إلى صناديق البريد المؤقتة تخضع لسياسة الحذف الدوري التلقائي لضمان عدم بقاء أي سجلات.
- يمكنك حذف البريد أو الرسائل يدوياً بنقرة زر واحدة في أي وقت.

## 3. ملفات تعريف الارتباط والإعلانات
- قد نستخدم ملفات تعريف ارتباط (Cookies) لحفظ تفضيلاتك في التصفح (مثل الوضع الليلي واللغة).
- يتم عرض إعلانات موثوقة من شركائنا (مثل Google AdSense و Adsterra) لتغطية تكاليف السيرفرات واستمرار الخدمة المجانية.
    `,
    inHeader: false,
    inFooter: true,
    createdAt: '2026-08-01T00:00:00Z',
    updatedAt: '2026-08-16T00:00:00Z',
  },
  {
    id: 'page-terms',
    slug: 'terms-of-service',
    title: 'شروط الاستخدام',
    content: `
# شروط وأحكام استخدام TempMail Pro

باستخدامك لموقعنا، فإنك توافق على الالتزام بالشروط والأحكام التالية:

## 1. الاستخدام المشروع
- الخدمة مخصصة للاستخدام الشخصي والاختبارات البرمجية وحماية الخصوصية.
- يُحظر تماماً استخدام البريد المؤقت في أي أنشطة غير قانونية، مثل الاحتيال، إرسال البريد العشوائي، أو انتهاك حقوق الآخرين.

## 2. إخلاء المسؤولية
- البريد المؤقت هو خدمة عامة ومؤقتة. لا نتحمل أي مسؤولية عن فقدان الرسائل أو الأكواد بعد انتهاء صلاحية البريد.
- لا يُنصح باستخدام البريد المؤقت للمعاملات المالية الهامة أو الحسابات الدائمة ذات القيمة العالية.
    `,
    inHeader: false,
    inFooter: true,
    createdAt: '2026-08-01T00:00:00Z',
    updatedAt: '2026-08-16T00:00:00Z',
  },
  {
    id: 'page-about',
    slug: 'about-us',
    title: 'من نحن',
    content: `
# عن TempMail Pro

**TempMail Pro** هي المنصة الرائدة في تقديم حلول البريد الإلكتروني المؤقت والسريع في العالم العربي والعالم. نسعى لتوفير بيئة إنترنت نظيفة وخالية من الرسائل المزعجة للملايين من المستخدمين يومياً.

## رؤيتنا:
تمكين كل مستخدم للإنترنت من السيطرة الكاملة على خصوصيته وهويته الرقمية، وتوفير أدوات متطورة للمطورين والمستخدمين العاديين بكل سهولة ومجانية.
    `,
    inHeader: true,
    inFooter: true,
    createdAt: '2026-08-01T00:00:00Z',
    updatedAt: '2026-08-16T00:00:00Z',
  },
  {
    id: 'page-contact',
    slug: 'contact-us',
    title: 'اتصل بنا',
    content: `
# تواصل مع فريق TempMail Pro

يسعدنا دائماً الاستماع إلى استفساراتكم واقتراحاتكم لتطوير الخدمة.

- **البريد الإلكتروني للدعم:** support@tempmail.local
- **الشراكات والإعلانات:** ads@tempmail.local
- **أوقات العمل:** الدعم الفني متاح على مدار الساعة طوال أيام الأسبوع.
    `,
    inHeader: false,
    inFooter: true,
    createdAt: '2026-08-01T00:00:00Z',
    updatedAt: '2026-08-16T00:00:00Z',
  }
];

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  siteName: 'TempMail Pro',
  siteTagline: 'بريدك المؤقت الفوري والآمن لحماية خصوصيتك',
  siteDescription: 'أنشئ بريداً إلكترونياً مؤقتاً فورياً لاستقبال رسائل التفعيل والرموز وتجنب الرسائل المزعجة بضغطة زر واحدة.',
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
