import React, { useState } from 'react';
import { 
  ShieldCheck, 
  HelpCircle, 
  Lock, 
  CheckCircle, 
  XCircle, 
  ChevronDown, 
  Code, 
  ShoppingBag, 
  Briefcase, 
  EyeOff, 
  Zap, 
  Trash
} from 'lucide-react';

export const InformationSection: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What is a Temporary Email Service?',
      a: 'A temporary email service (also known as disposable mail, temp mail, or fake email) provides an instant, temporary email address with no registration required. You can receive verification messages, OTP codes, and activation links securely without exposing your personal email address to spam.',
    },
    {
      q: 'Is this service completely free?',
      a: 'Yes! The core temporary email service is 100% free with zero limits on the number of verification emails you can receive.',
    },
    {
      q: 'How does Temp Mail differ from Gmail or Outlook?',
      a: 'Permanent email services (like Gmail) require your personal information, remain active indefinitely, and expose you to marketing spam and data tracking. Temporary email requires no personal data and automatically self-destructs to protect your online identity.',
    },
    {
      q: 'Can I send outbound emails from this address?',
      a: 'No. Outbound email capability is disabled to prevent abuse and spamming, ensuring our domain reputation stays clean for instant message delivery.',
    },
    {
      q: 'How long are received messages kept?',
      a: 'Messages remain accessible while your session is open and are subject to automatic periodic cleanups to maintain high server speed and security.',
    },
    {
      q: 'Can I choose a custom username or domain?',
      a: 'Yes! Simply click "Change Email" on the hero generator card to select a custom username and domain prefix.',
    },
  ];

  const personas = [
    {
      icon: <ShoppingBag className="w-6 h-6 text-emerald-400" />,
      title: 'Online Shoppers',
      desc: 'Grab discount codes, promo vouchers, and coupons without flooding your personal inbox with marketing promotions.',
    },
    {
      icon: <Code className="w-6 h-6 text-indigo-400" />,
      title: 'Developers & QA Teams',
      desc: 'Automate registration testing, account activation flows, and password resets in minutes during software staging.',
    },
    {
      icon: <EyeOff className="w-6 h-6 text-amber-400" />,
      title: 'Privacy Enthusiasts',
      desc: 'Explore forums, download files, and test new platforms without leaving digital traces or personal data behind.',
    },
    {
      icon: <Briefcase className="w-6 h-6 text-teal-400" />,
      title: 'Marketers & Researchers',
      desc: 'Inspect competitor onboarding flows, newsletter experiences, and sales funnels securely.',
    },
  ];

  return (
    <section id="info-section" className="w-full max-w-5xl mx-auto my-12 px-4 space-y-16">
      {/* 1. What is Temp Mail Header & Hero Card */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-6 sm:p-10 shadow-2xl overflow-hidden">
        <div className="absolute top-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold mb-3 border border-emerald-500/20">
            <ShieldCheck className="w-4 h-4" />
            <span>100% Digital Privacy Protection</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-3">
            What is Temporary Email (Temp Mail)?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Temporary mail is your instant digital shield against promotional spam, advertising trackers, and online data breaches.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-emerald-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base mb-1.5">Instant & No Signup</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Get an active address in one click without providing your name, phone number, or password.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-indigo-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base mb-1.5">Anti-Spam & Anti-Tracking</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Keep your personal mailbox clean and protected from marketing harvesters and phishing attacks.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-amber-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3">
              <Trash className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base mb-1.5">Automatic Self-Destruction</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Emails and mailboxes are destroyed automatically to ensure zero lingering data logs.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Who is this service for? */}
      <div>
        <div className="text-center max-w-xl mx-auto mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
            Who Uses TempMail Pro?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Designed for everyday internet users, developers, testers, and privacy seekers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {personas.map((p, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all hover:-translate-y-1 shadow-lg"
            >
              <div className="w-12 h-12 rounded-2xl bg-slate-950 flex items-center justify-center mb-4 border border-slate-800">
                {p.icon}
              </div>
              <h3 className="font-bold text-white text-sm sm:text-base mb-2">
                {p.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Why should you use it for Privacy? */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold border border-indigo-500/20">
            <Lock className="w-4 h-4" />
            <span>Cybersecurity & Privacy</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
            Why Use Temporary Mail to Protect Your Identity?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            According to recent cybersecurity statistics, over 85% of cyber threats and credential leaks originate from phishing emails and compromised third-party signups.
          </p>

          <ul className="space-y-3 pt-2">
            <li className="flex items-start gap-3 text-xs sm:text-sm text-slate-300">
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Prevent Password Leakage:</strong> Avoid reusing real credentials on secondary platforms.</span>
            </li>
            <li className="flex items-start gap-3 text-xs sm:text-sm text-slate-300">
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Clutter-Free Main Inbox:</strong> Reserve your main email exclusively for work, family, and financial services.</span>
            </li>
            <li className="flex items-start gap-3 text-xs sm:text-sm text-slate-300">
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Stop Cross-Site Tracking:</strong> Disrupt ad algorithms from tracking your online habits.</span>
            </li>
          </ul>
        </div>

        {/* Comparison Box */}
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl">
          <h3 className="font-bold text-base text-white mb-4 text-center">
            Comparison: Temporary vs Permanent Email
          </h3>
          
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-300">Personal Info Required</span>
              <div className="flex items-center gap-4">
                <span className="text-emerald-400 font-bold flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> None</span>
                <span className="text-rose-400 font-bold flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> Required</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-300">Future Spam Risk</span>
              <div className="flex items-center gap-4">
                <span className="text-emerald-400 font-bold">0% Impossible</span>
                <span className="text-amber-400 font-bold">Very High</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-300">OTP & Verification Delivery</span>
              <div className="flex items-center gap-4">
                <span className="text-emerald-400 font-bold">Instant</span>
                <span className="text-slate-300 font-bold">Instant</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-300">One-Click Address Regeneration</span>
              <div className="flex items-center gap-4">
                <span className="text-emerald-400 font-bold flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> Yes</span>
                <span className="text-rose-400 font-bold flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> Complex</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Interactive FAQ Section */}
      <div id="faq-section">
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-bold mb-2">
            <HelpCircle className="w-4 h-4 text-emerald-400" />
            <span>Instant Answers</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3 max-w-3xl mx-auto">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-white hover:text-emerald-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform shrink-0 ${
                      isOpen ? 'rotate-180 text-emerald-400' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/80">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
