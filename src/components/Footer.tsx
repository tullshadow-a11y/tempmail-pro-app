import React from 'react';
import { 
  Mail, 
  ShieldCheck, 
  Lock, 
  Heart, 
  Crown, 
  BookOpen, 
  ExternalLink,
  Sliders
} from 'lucide-react';
import { ActiveTab, CustomPage } from '../types';

interface FooterProps {
  setActiveTab: (tab: ActiveTab) => void;
  customPages: CustomPage[];
  onOpenCustomPage: (slug: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  setActiveTab,
  customPages,
  onOpenCustomPage,
}) => {
  const footerPages = customPages.filter(p => p.inFooter);

  return (
    <footer className="w-full bg-slate-950 border-t border-slate-900 mt-20 pt-16 pb-12 text-slate-400">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div
              onClick={() => {
                setActiveTab('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2.5 cursor-pointer select-none"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-slate-950 font-black">
                <Mail className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="font-black text-lg text-white font-latin">
                TempMail<span className="text-emerald-400">Pro</span>
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              الخدمة الرائدة لتوليد عناوين البريد الإلكتروني المؤقتة واستقبال رسائل التفعيل والـ OTP فورياً بدون تسجيل وبحماية تامة للخصوصية.
            </p>

            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>مشفر ومحمي بنسبة 100%</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white text-sm mb-4">روابط سريعة</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => {
                    setActiveTab('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-emerald-400 transition-colors"
                >
                  صندوق البريد المؤقت
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('premium');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-amber-300 transition-colors flex items-center gap-1"
                >
                  <Crown className="w-3 h-3 text-amber-400" />
                  <span>باقات VIP المميزة</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('blog');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-emerald-400 transition-colors"
                >
                  المدونة والمقالات الأمنية
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Pages */}
          <div>
            <h4 className="font-bold text-white text-sm mb-4">الصفحات والسياسات</h4>
            <ul className="space-y-2.5 text-xs">
              {footerPages.map((page) => (
                <li key={page.id}>
                  <button
                    onClick={() => {
                      onOpenCustomPage(page.slug);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-emerald-400 transition-colors"
                  >
                    {page.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Security & System Info */}
          <div>
            <h4 className="font-bold text-white text-sm mb-4">حالة الأمان والخوادم</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              جميع الرسائل تخضع لسياسة التدمير التلقائي الدوري ولا يتم تخزين أي ملفات تعريف شخصية.
            </p>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>خوادم mail.gw متصلة وجاهزة</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright & Discreet Admin link */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} TempMail Pro. جميع الحقوق محفوظة.</p>

          <div className="flex items-center gap-4">
            {/* Discreet Admin Portal Access */}
            <button
              id="btn-footer-admin-link"
              onClick={() => {
                setActiveTab('admin');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-1 text-slate-500 hover:text-slate-300 transition-colors"
              title="لوحة تحكم المسؤول (Admin)"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>لوحة الإدارة</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
