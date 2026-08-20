export type LanguageCode = 'ar' | 'en' | 'fr' | 'es' | 'de' | 'tr' | 'zh';

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  dir: 'rtl' | 'ltr';
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', dir: 'ltr' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', dir: 'ltr' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', dir: 'ltr' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', dir: 'ltr' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷', dir: 'ltr' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳', dir: 'ltr' },
];

export const TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  ar: {
    siteTitle: 'Temp Mail Pro',
    siteTagline: 'بريد إلكتروني مؤقت آمن وفوري',
    home: 'الرئيسية',
    premium: 'تسجيل الدخول',
    blog: 'المدونة والمقالات',
    faq: 'الأسئلة الشائعة',
    heroTitle: 'انسَ رسائل البريد العشوائي والسبام نهائياً',
    heroSub: 'عنوان بريدك الإلكتروني المؤقت، المجاني، والآمن جاهز فوراً لحماية خصوصيتك واستلام رموز التفعيل.',
    activeStatus: 'نشط',
    autoRefreshIn: 'التحديث التلقائي خلال:',
    tempMailAddress: 'عنوان البريد الإلكتروني المؤقت:',
    copyEmail: 'نسخ البريد',
    copied: 'تم النسخ',
    newMail: 'بريد جديد',
    refresh: 'تحديث',
    delete: 'حذف',
    qrCode: 'رمز QR',
    changeEmail: 'تغيير البريد',
    liveInbox: 'صندوق الوارد المباشر',
    messages: 'رسائل',
    unread: 'غير مقروءة',
    searchMessages: 'البحث في الرسائل...',
    sendTestEmail: 'إرسال بريد تجريبي',
    emptyInboxTitle: 'صندوق الوارد فارغ حالياً',
    emptyInboxSub: 'في انتظار وصول الرسائل... ستظهر رسائل التفعيل والرموز هنا فور وصولها.',
    vipUpgrade: 'تسجيل الدخول',
    privacyPolicy: 'سياسة الخصوصية',
    termsOfService: 'شروط الخدمة',
    aboutUs: 'من نحن',
    contactUs: 'اتصل بنا',
  },
  en: {
    siteTitle: 'Temp Mail Pro',
    siteTagline: 'Instant & Secure Temporary Email Service',
    home: 'Home',
    premium: 'Log In / Sign In',
    blog: 'Blog & Articles',
    faq: 'FAQ',
    heroTitle: 'Forget About Spam and Data Leakage Forever',
    heroSub: 'Your temporary, anonymous, and free email address is ready instantly to protect your privacy and receive verification codes.',
    activeStatus: 'Active',
    autoRefreshIn: 'Auto-refresh in:',
    tempMailAddress: 'Temporary Email Address:',
    copyEmail: 'Copy Email',
    copied: 'Copied',
    newMail: 'New Mail',
    refresh: 'Refresh',
    delete: 'Delete',
    qrCode: 'QR Code',
    changeEmail: 'Change Email',
    liveInbox: 'Live Inbox',
    messages: 'messages',
    unread: 'unread',
    searchMessages: 'Search messages...',
    sendTestEmail: 'Send Test Email',
    emptyInboxTitle: 'Your inbox is currently empty',
    emptyInboxSub: 'Waiting for incoming emails... Activation codes and verification emails will appear here automatically.',
    vipUpgrade: 'Log In / Sign In',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    aboutUs: 'About Us',
    contactUs: 'Contact Us',
  },
  fr: {
    siteTitle: 'Temp Mail Pro',
    siteTagline: 'Service de messagerie temporaire instantané et sécurisé',
    home: 'Accueil',
    premium: 'Abonnement VIP',
    blog: 'Blog & Articles',
    faq: 'FAQ',
    heroTitle: 'Oubliez le spam et les fuites de données pour toujours',
    heroSub: 'Votre adresse e-mail temporaire, anonyme et gratuite est prête instantanément pour protéger votre vie privée.',
    activeStatus: 'Actif',
    autoRefreshIn: 'Actualisation auto dans:',
    tempMailAddress: 'Adresse e-mail temporaire:',
    copyEmail: 'Copier l\'e-mail',
    copied: 'Copié',
    newMail: 'Nouveau mail',
    refresh: 'Actualiser',
    delete: 'Supprimer',
    qrCode: 'Code QR',
    changeEmail: 'Changer d\'e-mail',
    liveInbox: 'Boîte de réception en direct',
    messages: 'messages',
    unread: 'non lus',
    searchMessages: 'Rechercher des messages...',
    sendTestEmail: 'Envoyer un e-mail test',
    emptyInboxTitle: 'Votre boîte de réception est vide',
    emptyInboxSub: 'En attente d\'e-mails entrants... Les codes de vérification apparaîtront ici automatiquement.',
    vipUpgrade: 'Amélioration VIP',
    privacyPolicy: 'Politique de confidentialité',
    termsOfService: 'Conditions d\'utilisation',
    aboutUs: 'À propos de nous',
    contactUs: 'Contactez-nous',
  },
  es: {
    siteTitle: 'Temp Mail Pro',
    siteTagline: 'Servicio de correo temporal instantáneo y seguro',
    home: 'Inicio',
    premium: 'Suscripción VIP',
    blog: 'Blog y Artículos',
    faq: 'Preguntas Frecuentes',
    heroTitle: 'Olvídate del spam y la filtración de datos para siempre',
    heroSub: 'Tu dirección de correo temporal, anónima y gratuita está lista al instante para proteger tu privacidad.',
    activeStatus: 'Activo',
    autoRefreshIn: 'Actualización auto en:',
    tempMailAddress: 'Dirección de correo temporal:',
    copyEmail: 'Copiar correo',
    copied: 'Copiado',
    newMail: 'Nuevo correo',
    refresh: 'Actualizar',
    delete: 'Eliminar',
    qrCode: 'Código QR',
    changeEmail: 'Cambiar correo',
    liveInbox: 'Bandeja de entrada en vivo',
    messages: 'mensajes',
    unread: 'no leídos',
    searchMessages: 'Buscar mensajes...',
    sendTestEmail: 'Enviar correo de prueba',
    emptyInboxTitle: 'Tu bandeja de entrada está vacía',
    emptyInboxSub: 'Esperando correos entrantes... Los códigos de verificación aparecerán aquí automáticamente.',
    vipUpgrade: 'Mejora VIP',
    privacyPolicy: 'Política de privacidad',
    termsOfService: 'Términos de servicio',
    aboutUs: 'Sobre nosotros',
    contactUs: 'Contáctanos',
  },
  de: {
    siteTitle: 'Temp Mail Pro',
    siteTagline: 'Sofortiger & sicherer temporärer E-Mail-Dienst',
    home: 'Startseite',
    premium: 'VIP Premium',
    blog: 'Blog & Artikel',
    faq: 'FAQ',
    heroTitle: 'Vergessen Sie Spam und Datenlecks für immer',
    heroSub: 'Ihre temporäre, anonyme und kostenlose E-Mail-Adresse ist sofort bereit, um Ihre Privatsphäre zu schützen.',
    activeStatus: 'Aktiv',
    autoRefreshIn: 'Auto-Aktualisierung in:',
    tempMailAddress: 'Temporäre E-Mail-Adresse:',
    copyEmail: 'E-Mail kopieren',
    copied: 'Kopiert',
    newMail: 'Neue E-Mail',
    refresh: 'Aktualisieren',
    delete: 'Löschen',
    qrCode: 'QR-Code',
    changeEmail: 'E-Mail ändern',
    liveInbox: 'Live-Posteingang',
    messages: 'Nachrichten',
    unread: 'ungelesen',
    searchMessages: 'Nachrichten suchen...',
    sendTestEmail: 'Test-E-Mail senden',
    emptyInboxTitle: 'Ihr Posteingang ist derzeit leer',
    emptyInboxSub: 'Warten auf eingehende E-Mails... Bestätigungscodes erscheinen hier automatisch.',
    vipUpgrade: 'VIP Upgrade',
    privacyPolicy: 'Datenschutz-Bestimmungen',
    termsOfService: 'Nutzungsbedingungen',
    aboutUs: 'Über uns',
    contactUs: 'Kontakt',
  },
  tr: {
    siteTitle: 'Temp Mail Pro',
    siteTagline: 'Anında & Güvenli Geçici E-posta Servisi',
    home: 'Ana Sayfa',
    premium: 'VIP Üyelik',
    blog: 'Blog ve Makaleler',
    faq: 'SSS',
    heroTitle: 'Spam ve Veri Sızıntılarını Sonsuza Dek Unutun',
    heroSub: 'Geçici, anonim ve ücretsiz e-posta adresiniz gizliliğinizi korumak için anında hazır.',
    activeStatus: 'Aktif',
    autoRefreshIn: 'Otomatik yenileme:',
    tempMailAddress: 'Geçici E-posta Adresi:',
    copyEmail: 'E-postayı Kopyala',
    copied: 'Kopyalandı',
    newMail: 'Yeni E-posta',
    refresh: 'Yenile',
    delete: 'Sil',
    qrCode: 'QR Kod',
    changeEmail: 'E-postayı Değiştir',
    liveInbox: 'Canlı Gelen Kutusu',
    messages: 'mesaj',
    unread: 'okunmamış',
    searchMessages: 'Mesajlarda ara...',
    sendTestEmail: 'Test E-postası Gönder',
    emptyInboxTitle: 'Gelen kutunuz şu anda boş',
    emptyInboxSub: 'Gelen e-postalar bekleniyor... Doğrulama kodları burada otomatik olarak görünecektir.',
    vipUpgrade: 'VIP Yükselt',
    privacyPolicy: 'Gizlilik Politikası',
    termsOfService: 'Kullanım Koşulları',
    aboutUs: 'Hakkımızda',
    contactUs: 'İletişim',
  },
  zh: {
    siteTitle: 'Temp Mail Pro',
    siteTagline: '即时 & 安全的临时电子邮件服务',
    home: '首页',
    premium: 'VIP 尊享会员',
    blog: '博客与文章',
    faq: '常见问题',
    heroTitle: '彻底告别垃圾邮件与隐私泄露',
    heroSub: '您的临时、匿名且免费的电子邮件地址已即刻就绪，全力保护您的个人隐私。',
    activeStatus: '活跃',
    autoRefreshIn: '自动刷新倒计时:',
    tempMailAddress: '临时电子邮件地址:',
    copyEmail: '复制邮箱',
    copied: '已复制',
    newMail: '新邮箱',
    refresh: '刷新',
    delete: '删除',
    qrCode: '二维码',
    changeEmail: '修改邮箱',
    liveInbox: '实时收件箱',
    messages: '封邮件',
    unread: '未读',
    searchMessages: '搜索邮件...',
    sendTestEmail: '发送测试邮件',
    emptyInboxTitle: '您的收件箱目前是空的',
    emptyInboxSub: '正在等待接收邮件... 验证码与激活邮件将在此自动显示。',
    vipUpgrade: '升级 VIP',
    privacyPolicy: '隐私政策',
    termsOfService: '服务条款',
    aboutUs: '关于我们',
    contactUs: '联系我们',
  },
};

const LANG_KEY = 'tempmail_selected_lang';

export function getCurrentLanguage(): LanguageOption {
  try {
    const saved = localStorage.getItem(LANG_KEY) as LanguageCode;
    const match = LANGUAGES.find(l => l.code === saved);
    if (match) return match;
  } catch (e) {
    // Fallback
  }
  return LANGUAGES[0]; // Default Arabic
}

export function setAppLanguage(code: LanguageCode): LanguageOption {
  const lang = LANGUAGES.find(l => l.code === code) || LANGUAGES[0];
  try {
    localStorage.setItem(LANG_KEY, lang.code);
  } catch (e) {
    // Fallback
  }

  // Update HTML document direction and lang attribute
  if (typeof document !== 'undefined') {
    document.documentElement.dir = lang.dir;
    document.documentElement.lang = lang.code;
  }

  return lang;
}

export function t(key: string, langCode: LanguageCode = 'ar'): string {
  const dict = TRANSLATIONS[langCode] || TRANSLATIONS.ar;
  return dict[key] || TRANSLATIONS.en[key] || key;
}
