export type Language = 'ar' | 'en' | 'fr';

export interface Translations {
  appName: string;
  appTagline: string;
  navHome: string;
  navFeatures: string;
  navFaq: string;
  navPremium: string;
  navBlog: string;
  heroBadge: string;
  heroHeadline: string;
  heroSubtitle: string;
  activeStatus: string;
  autoRefreshIn: string;
  emailLabel: string;
  copyEmail: string;
  copied: string;
  qrCodeTitle: string;
  btnNewEmail: string;
  btnRefresh: string;
  btnDelete: string;
  changeCustomEmail: string;
  customModalTitle: string;
  customModalSubtitle: string;
  usernameLabel: string;
  domainLabel: string;
  saveCustom: string;
  randomEmail: string;
  cancel: string;
  liveInbox: string;
  noMessagesTitle: string;
  noMessagesDesc: string;
  sendTestEmail: string;
  unread: string;
  messagesCount: string;
  otpCode: string;
  vipUpgrade: string;
  freePlan: string;
  vipMember: string;
  login: string;
  logout: string;
  signUp: string;
  account: string;
}

export const translations: Record<Language, Translations> = {
  ar: {
    appName: 'Temp Mail Pro',
    appTagline: 'بريد إلكتروني مؤقت وسريع وآمن',
    navHome: 'الرئيسية',
    navFeatures: 'المميزات',
    navFaq: 'الأسئلة',
    navPremium: 'العضوية الممتازة VIP',
    navBlog: 'المدونة',
    heroBadge: 'حماية كاملة للخصوصية والبيانات',
    heroHeadline: 'بريد إلكتروني مؤقت بشكل احترافي',
    heroSubtitle: 'احصل على عنوان بريد إلكتروني مؤقت فوراً لاستقبال رسائل التفعيل وأكواد التحقق OTP بدون تسجيل أو إدخال بياناتك الشخصية.',
    activeStatus: 'نشط وجاهز',
    autoRefreshIn: 'تحديث تلقائي خلال:',
    emailLabel: 'عنوان البريد المؤقت الحالي:',
    copyEmail: 'نسخ البريد',
    copied: 'تم النسخ!',
    qrCodeTitle: 'مسح رمز QR',
    btnNewEmail: 'بريد جديد',
    btnRefresh: 'تحديث',
    btnDelete: 'حذف',
    changeCustomEmail: 'تخصيص البريد',
    customModalTitle: 'إنشاء بريد مخصص',
    customModalSubtitle: 'اختر اسم المستخدِم والنطاق المفضل لديك',
    usernameLabel: 'اسم المستخدِم:',
    domainLabel: 'اختر النطاق:',
    saveCustom: 'حفظ البريد المخصص',
    randomEmail: 'عشوائي',
    cancel: 'إلغاء',
    liveInbox: 'صندوق الرسائل المباشر',
    noMessagesTitle: 'صندوق الرسائل فارغ حالياً',
    noMessagesDesc: 'في انتظار وصول الرسائل... ستظهر رسائل التفعيل وأكواد OTP هنا فور وصولها.',
    sendTestEmail: 'إرسال رسالة تجريبية',
    unread: 'غير مقروء',
    messagesCount: 'رسالة',
    otpCode: 'كود التحقق:',
    vipUpgrade: 'ترقية VIP',
    freePlan: 'خطة مجانية',
    vipMember: 'عضوية VIP',
    login: 'تسجيل الدخول',
    logout: 'تسجيل الخروج',
    signUp: 'حساب جديد',
    account: 'الحساب',
  },
  en: {
    appName: 'Temp Mail Pro',
    appTagline: 'Fast & Secure Temporary Email',
    navHome: 'Home',
    navFeatures: 'Features',
    navFaq: 'FAQ',
    navPremium: 'VIP Premium',
    navBlog: 'Blog',
    heroBadge: '100% Privacy & Data Protection',
    heroHeadline: 'Professional Disposable Email',
    heroSubtitle: 'Get an instant temporary email address to receive activation messages and OTP codes without any registration or personal data.',
    activeStatus: 'Active & Ready',
    autoRefreshIn: 'Auto refresh in:',
    emailLabel: 'Current Temporary Email:',
    copyEmail: 'Copy Email',
    copied: 'Copied!',
    qrCodeTitle: 'Scan QR Code',
    btnNewEmail: 'New Email',
    btnRefresh: 'Refresh',
    btnDelete: 'Delete',
    changeCustomEmail: 'Customize Email',
    customModalTitle: 'Create Custom Email',
    customModalSubtitle: 'Select custom username and domain',
    usernameLabel: 'Username:',
    domainLabel: 'Select Domain:',
    saveCustom: 'Save Custom Email',
    randomEmail: 'Random',
    cancel: 'Cancel',
    liveInbox: 'Live Inbox',
    noMessagesTitle: 'Your inbox is currently empty',
    noMessagesDesc: 'Waiting for incoming emails... Verification codes and OTPs will appear here automatically.',
    sendTestEmail: 'Send Test Email',
    unread: 'Unread',
    messagesCount: 'messages',
    otpCode: 'OTP Code:',
    vipUpgrade: 'VIP Upgrade',
    freePlan: 'Free Plan',
    vipMember: 'VIP Member',
    login: 'Sign In',
    logout: 'Sign Out',
    signUp: 'Sign Up',
    account: 'Account',
  },
  fr: {
    appName: 'Temp Mail Pro',
    appTagline: 'Email Temporaire Rapide et Sécurisé',
    navHome: 'Accueil',
    navFeatures: 'Fonctionnalités',
    navFaq: 'FAQ',
    navPremium: 'Abonnement VIP',
    navBlog: 'Blog',
    heroBadge: '100% Protection de la Vie Privée',
    heroHeadline: 'E-mail Temporaire Professionnel',
    heroSubtitle: 'Obtenez instantanément une adresse e-mail temporaire pour recevoir des codes de vérification OTP sans aucune inscription.',
    activeStatus: 'Actif & Prêt',
    autoRefreshIn: 'Actualisation dans :',
    emailLabel: 'E-mail temporaire actuel :',
    copyEmail: 'Copier',
    copied: 'Copié !',
    qrCodeTitle: 'Scanner le QR Code',
    btnNewEmail: 'Nouveau',
    btnRefresh: 'Actualiser',
    btnDelete: 'Supprimer',
    changeCustomEmail: 'Personnaliser',
    customModalTitle: 'Créer un e-mail personnalisé',
    customModalSubtitle: 'Choisissez un nom d\'utilisateur et un domaine',
    usernameLabel: 'Nom d\'utilisateur :',
    domainLabel: 'Sélectionnez le domaine :',
    saveCustom: 'Enregistrer',
    randomEmail: 'Aléatoire',
    cancel: 'Annuler',
    liveInbox: 'Boîte de Réception en Direct',
    noMessagesTitle: 'Votre boîte de réception est vide',
    noMessagesDesc: 'En attente de messages... Les codes OTP apparaîtront ici automatiquement.',
    sendTestEmail: 'Envoyer un e-mail de test',
    unread: 'Non lu',
    messagesCount: 'messages',
    otpCode: 'Code OTP :',
    vipUpgrade: 'Passer VIP',
    freePlan: 'Plan Gratuit',
    vipMember: 'Membre VIP',
    login: 'Connexion',
    logout: 'Déconnexion',
    signUp: 'S\'inscrire',
    account: 'Compte',
  },
};

const LANG_STORAGE_KEY = 'tempmail_language';

export function getInitialLanguage(): Language {
  try {
    const saved = localStorage.getItem(LANG_STORAGE_KEY) as Language;
    if (saved && ['ar', 'en', 'fr'].includes(saved)) {
      return saved;
    }
  } catch {}
  // Default language is Arabic (RTL)
  return 'ar';
}

export function applyLanguageLayout(lang: Language): void {
  const root = document.documentElement;
  root.lang = lang;
  if (lang === 'ar') {
    root.dir = 'rtl';
  } else {
    root.dir = 'ltr';
  }
  try {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  } catch {}
}
