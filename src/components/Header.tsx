import React, { useState } from 'react';
import { 
  Crown, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  Mail,
  Globe,
  User as UserIcon,
  LogOut,
  Sparkles
} from 'lucide-react';
import { ActiveTab, CustomPage } from '../types';
import { Language, translations } from '../utils/i18n';
import { UserProfile } from '../services/supabase';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  userProfile: UserProfile | null;
  onOpenAuthModal: () => void;
  onSignOut: () => void;
  customPages: CustomPage[];
  onOpenCustomPage: (slug: string) => void;
  onScrollToSection: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  theme,
  toggleTheme,
  language,
  onLanguageChange,
  userProfile,
  onOpenAuthModal,
  onSignOut,
  customPages,
  onOpenCustomPage,
  onScrollToSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const t = translations[language];
  const headerPages = customPages.filter((p) => p.inHeader);

  const isVip = userProfile?.isVip;

  const handleNavClick = (tab: ActiveTab, sectionId?: string) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    if (sectionId) {
      setTimeout(() => onScrollToSection(sectionId), 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">

        {/* Right side navigation items (in RTL) / Left side (in LTR) */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          <button
            id="nav-link-home"
            onClick={() => handleNavClick('home')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'home'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {t.navHome}
          </button>

          <button
            id="nav-link-features"
            onClick={() => handleNavClick('home', 'info-section')}
            className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all"
          >
            {t.navFeatures}
          </button>

          <button
            id="nav-link-faq"
            onClick={() => handleNavClick('home', 'faq-section')}
            className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all"
          >
            {t.navFaq}
          </button>

          <button
            id="nav-link-premium"
            onClick={() => handleNavClick('premium')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'premium'
                ? 'bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-amber-400 hover:text-amber-300 hover:bg-amber-500/10'
            }`}
          >
            <Crown className="w-4 h-4 text-amber-400" />
            <span>{t.navPremium}</span>
          </button>

          <button
            id="nav-link-blog"
            onClick={() => handleNavClick('blog')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'blog' || activeTab === 'post'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {t.navBlog}
          </button>

          {headerPages.map((page) => (
            <button
              key={page.id}
              onClick={() => onOpenCustomPage(page.slug)}
              className="px-3 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all"
            >
              {page.title}
            </button>
          ))}
        </nav>

        {/* CENTERED BRAND LOGO (Strict Reference Match) */}
        <div
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 cursor-pointer group select-none mx-auto lg:mx-0"
        >
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/25 group-hover:scale-105 transition-transform">
            <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-slate-950 stroke-[2.5]" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-950 animate-ping" />
          </div>

          <div className="text-center sm:text-start">
            <div className="flex items-center gap-1.5 justify-center sm:justify-start">
              <span className="font-black text-lg sm:text-xl text-white tracking-tight font-latin">
                Temp Mail <span className="text-emerald-400">Pro</span>
              </span>
              {isVip && (
                <span className="px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30 flex items-center gap-0.5">
                  <Crown className="w-2.5 h-2.5" /> VIP
                </span>
              )}
            </div>
            <span className="text-[10px] sm:text-xs text-slate-400 block -mt-0.5 font-medium">
              {t.appTagline}
            </span>
          </div>
        </div>

        {/* Controls: Language Dropdown, User Profile, VIP CTA */}
        <div className="flex items-center gap-2">
          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              id="btn-language-dropdown"
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-bold transition-all"
              title="Select Language / اختر اللغة"
            >
              <Globe className="w-4 h-4 text-emerald-400" />
              <span className="uppercase">{language}</span>
            </button>

            {langDropdownOpen && (
              <div className="absolute left-0 lg:right-0 lg:left-auto mt-2 w-36 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-1.5 z-50 space-y-1">
                <button
                  onClick={() => {
                    onLanguageChange('ar');
                    setLangDropdownOpen(false);
                  }}
                  className={`w-full text-start px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
                    language === 'ar' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>🇸🇦 العربية</span>
                  {language === 'ar' && <Sparkles className="w-3 h-3 text-emerald-400" />}
                </button>

                <button
                  onClick={() => {
                    onLanguageChange('en');
                    setLangDropdownOpen(false);
                  }}
                  className={`w-full text-start px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
                    language === 'en' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>🇺🇸 English</span>
                  {language === 'en' && <Sparkles className="w-3 h-3 text-emerald-400" />}
                </button>

                <button
                  onClick={() => {
                    onLanguageChange('fr');
                    setLangDropdownOpen(false);
                  }}
                  className={`w-full text-start px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
                    language === 'fr' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>🇫🇷 Français</span>
                  {language === 'fr' && <Sparkles className="w-3 h-3 text-emerald-400" />}
                </button>
              </div>
            )}
          </div>

          {/* Theme Switcher */}
          <button
            id="btn-toggle-theme"
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>

          {/* User Profile / Supabase Auth Button */}
          {userProfile ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleNavClick('premium')}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-200 flex items-center gap-1.5"
              >
                <UserIcon className="w-3.5 h-3.5 text-emerald-400" />
                <span className="max-w-[100px] truncate">{userProfile.fullName || userProfile.email.split('@')[0]}</span>
                {isVip && <Crown className="w-3 h-3 text-amber-400" />}
              </button>

              <button
                onClick={onSignOut}
                title={t.logout}
                className="p-2 rounded-xl bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 border border-slate-800 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              id="btn-open-auth-modal"
              onClick={onOpenAuthModal}
              className="px-3.5 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 font-bold text-xs transition-all flex items-center gap-1.5"
            >
              <UserIcon className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.login}</span>
            </button>
          )}

          {/* Premium VIP CTA Button */}
          {!isVip && (
            <button
              id="btn-header-premium-cta"
              onClick={() => handleNavClick('premium')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-md shadow-amber-900/20 transition-all active:scale-95"
            >
              <Crown className="w-3.5 h-3.5" />
              <span>{t.vipUpgrade}</span>
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            id="btn-mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-xl bg-slate-900 text-slate-300 hover:text-white border border-slate-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 py-4 space-y-2 shadow-2xl">
          <button
            onClick={() => handleNavClick('home')}
            className={`w-full text-start px-4 py-2.5 rounded-xl text-sm font-bold ${
              activeTab === 'home' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-200 hover:bg-slate-800'
            }`}
          >
            {t.navHome}
          </button>

          <button
            onClick={() => handleNavClick('home', 'info-section')}
            className="w-full text-start px-4 py-2.5 rounded-xl text-sm font-bold text-slate-200 hover:bg-slate-800"
          >
            {t.navFeatures}
          </button>

          <button
            onClick={() => handleNavClick('home', 'faq-section')}
            className="w-full text-start px-4 py-2.5 rounded-xl text-sm font-bold text-slate-200 hover:bg-slate-800"
          >
            {t.navFaq}
          </button>

          <button
            onClick={() => handleNavClick('premium')}
            className={`w-full text-start px-4 py-2.5 rounded-xl text-sm font-bold flex items-center justify-between ${
              activeTab === 'premium' ? 'bg-amber-500/20 text-amber-300' : 'text-amber-400 hover:bg-slate-800'
            }`}
          >
            <span>{t.navPremium}</span>
            <Crown className="w-4 h-4 text-amber-400" />
          </button>

          <button
            onClick={() => handleNavClick('blog')}
            className={`w-full text-start px-4 py-2.5 rounded-xl text-sm font-bold ${
              activeTab === 'blog' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-200 hover:bg-slate-800'
            }`}
          >
            {t.navBlog}
          </button>

          {headerPages.map((page) => (
            <button
              key={page.id}
              onClick={() => {
                onOpenCustomPage(page.slug);
                setMobileMenuOpen(false);
              }}
              className="w-full text-start px-4 py-2.5 rounded-xl text-sm font-bold text-slate-300 hover:bg-slate-800"
            >
              {page.title}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
