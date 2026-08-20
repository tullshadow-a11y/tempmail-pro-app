import React, { useState } from 'react';
import { 
  Crown, 
  BookOpen, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  Mail,
  Globe,
  Home,
  HelpCircle
} from 'lucide-react';
import { ActiveTab, CustomPage } from '../types';
import { LANGUAGES, LanguageOption, t } from '../utils/i18n';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  isPremium: boolean;
  currentLang: LanguageOption;
  onLanguageChange: (lang: LanguageOption) => void;
  customPages: CustomPage[];
  onOpenCustomPage: (slug: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  theme,
  toggleTheme,
  isPremium,
  currentLang,
  onLanguageChange,
  customPages,
  onOpenCustomPage,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const headerPages = customPages.filter((p) => p.inHeader);

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">

        {/* Brand Logo */}
        <div
          onClick={() => {
            setActiveTab('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
        >
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-slate-950 stroke-[2.5]" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-950 animate-ping" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-lg sm:text-xl text-white tracking-tight">
                Temp Mail <span className="text-emerald-400">Pro</span>
              </span>
              {isPremium && (
                <span className="px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30 flex items-center gap-0.5">
                  <Crown className="w-2.5 h-2.5" /> VIP
                </span>
              )}
            </div>
            <span className="text-[10px] sm:text-xs text-slate-400 block -mt-1 font-medium">
              {t('siteTagline', currentLang.code)}
            </span>
          </div>
        </div>

        {/* Center Navigation Links with Icons */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2">
          <button
            id="nav-link-home"
            onClick={() => setActiveTab('home')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'home'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Home className="w-4 h-4 text-emerald-400" />
            <span>{t('home', currentLang.code)}</span>
          </button>

          <button
            id="nav-link-premium"
            onClick={() => setActiveTab('premium')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'premium'
                ? 'bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-amber-400 hover:text-amber-300 hover:bg-amber-500/10'
            }`}
          >
            <Crown className="w-4 h-4 text-amber-400" />
            <span>{t('premium', currentLang.code)}</span>
          </button>

          <button
            id="nav-link-blog"
            onClick={() => setActiveTab('blog')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'blog' || activeTab === 'post'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>{t('blog', currentLang.code)}</span>
          </button>

          {headerPages.map((page) => (
            <button
              key={page.id}
              onClick={() => onOpenCustomPage(page.slug)}
              className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all"
            >
              {page.title}
            </button>
          ))}
        </nav>

        {/* Right Controls: Multi-Language Selector & Theme */}
        <div className="flex items-center gap-2 shrink-0">

          {/* Multi-Language Dropdown */}
          <div className="relative">
            <button
              id="btn-language-selector"
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-800 transition-colors flex items-center gap-2 text-xs font-bold"
            >
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>{currentLang.flag} {currentLang.nativeName}</span>
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-1.5 z-50">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1 border-b border-slate-800 mb-1">
                  Select Language / اختر اللغة
                </div>
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      onLanguageChange(lang);
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                      currentLang.code === lang.code
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <span>{lang.nativeName}</span>
                    </span>
                    <span className="text-[10px] text-slate-500 uppercase">{lang.code}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Switcher */}
          <button
            id="btn-toggle-theme"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>

          {/* VIP Upgrade Button */}
          {!isPremium && (
            <button
              id="btn-header-vip-upgrade"
              onClick={() => setActiveTab('premium')}
              className="hidden lg:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-900/20 transition-all active:scale-95"
            >
              <Crown className="w-3.5 h-3.5" />
              <span>{t('vipUpgrade', currentLang.code)}</span>
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            id="btn-mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl bg-slate-900 text-slate-300 hover:text-white border border-slate-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 py-4 space-y-2 shadow-2xl">
          <button
            onClick={() => {
              setActiveTab('home');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 ${
              activeTab === 'home' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Home className="w-4 h-4 text-emerald-400" />
            <span>{t('home', currentLang.code)}</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('premium');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold flex items-center justify-between ${
              activeTab === 'premium' ? 'bg-amber-500/20 text-amber-300' : 'text-amber-400 hover:bg-slate-800'
            }`}
          >
            <span className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-400" />
              <span>{t('premium', currentLang.code)}</span>
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('blog');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 ${
              activeTab === 'blog' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-200 hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>{t('blog', currentLang.code)}</span>
          </button>

          {headerPages.map((page) => (
            <button
              key={page.id}
              onClick={() => {
                onOpenCustomPage(page.slug);
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold text-slate-300 hover:bg-slate-800"
            >
              {page.title}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
