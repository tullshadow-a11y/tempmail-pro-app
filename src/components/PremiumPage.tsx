import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Crown, 
  Check, 
  ShieldCheck, 
  CreditCard, 
  Lock, 
  Zap, 
  Star, 
  Clock, 
  X, 
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { PremiumPlan, SiteSettings } from '../types';
import { Language, translations } from '../utils/i18n';
import { SupabaseAuthService, UserProfile } from '../services/supabase';

interface PremiumPageProps {
  settings: SiteSettings;
  userProfile: UserProfile | null;
  language: Language;
  onActivatePremium: (tier: 'monthly' | 'yearly' | 'lifetime') => void;
  onCancelPremium: () => void;
  onBackToHome: () => void;
}

export const PremiumPage: React.FC<PremiumPageProps> = ({
  settings,
  userProfile,
  language,
  onActivatePremium,
  onCancelPremium,
  onBackToHome,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly' | 'lifetime'>('yearly');
  const [showStripeModal, setShowStripeModal] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardName, setCardName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const t = translations[language];
  const isVip = userProfile?.isVip;

  const plans: PremiumPlan[] = [
    {
      id: 'plan-monthly',
      name: 'الخطة الشهرية',
      nameEn: 'Monthly Plan',
      price: settings.premiumMonthlyPrice || 4.99,
      billingPeriod: 'month',
      description: 'مرونة كاملة في الاشتراك مع إمكانية الإلغاء في أي وقت.',
      features: [
        'تجربة بريد خالية من الإعلانات بنسبة 100%',
        'وصول حصري لنطاقات VIP غير محجوبة',
        'احتفاظ بالرسائل لمدة 7 أيام كاملة',
        'دعم استلام المرفقات الكبيرة',
        'أولوية الدعم الفني المباشر',
      ],
    },
    {
      id: 'plan-yearly',
      name: 'الخطة السنوية (الأكثر طلباً)',
      nameEn: 'Yearly Plan (Best Value)',
      price: settings.premiumYearlyPrice || 39.99,
      billingPeriod: 'year',
      popular: true,
      description: 'وفّر أكثر من 40% واستمتع بأعلى مستويات السرعة والأمان.',
      features: [
        'جميع مميزات الخطة الشهرية',
        'تصفح فائق السرعة بدون إعلانات',
        'تحديث أسبوعي للنطاقات الحصرية VIP',
        'إمكانية الاحتفاظ بـ 15 بريداً مؤقتاً في نفس الوقت',
        'توجيه تلقائي للرسائل',
        'وصول شامل لـ API المطورين',
      ],
    },
    {
      id: 'plan-lifetime',
      name: 'عضوية VIP مدى الحياة',
      nameEn: 'Lifetime VIP Pass',
      price: 89.99,
      billingPeriod: 'lifetime',
      description: 'دفعة واحدة فقط للحصول على وصول دائم لجميع الميزات مدى الحياة.',
      features: [
        'جميع ميزات التطبيق بلا حدود مدى الحياة',
        'تخصيص كامل لعناوين البريد والنطاقات',
        'تشفير عسكري تام لحماية الخصوصية',
        'دعم فني مخصص على مدار 24/7',
      ],
    },
  ];

  const handleOpenCheckout = (planId: 'monthly' | 'yearly' | 'lifetime') => {
    setSelectedPlan(planId);
    setShowStripeModal(true);
  };

  const handleSimulatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      if (userProfile?.id) {
        await SupabaseAuthService.updateVipStatus(userProfile.id, selectedPlan, true);
      }
    } catch (e) {
      console.warn('VIP Supabase update:', e);
    }

    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      onActivatePremium(selectedPlan);
      setTimeout(() => {
        setShowStripeModal(false);
        setPaymentSuccess(false);
      }, 2000);
    }, 1200);
  };

  const currentPlanObj = plans.find(p => p.id === `plan-${selectedPlan}`) || plans[1];

  return (
    <div className="w-full max-w-5xl mx-auto my-8 px-4 sm:px-6 text-start">
      {/* Back Button */}
      <button
        onClick={onBackToHome}
        className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-400 hover:text-white mb-6 p-2 rounded-xl hover:bg-slate-900 transition-colors"
      >
        <ArrowRight className="w-4 h-4" />
        <span>العودة إلى صندوق البريد</span>
      </button>

      {/* Hero Banner */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-300 text-xs font-bold mb-4 border border-amber-500/30 shadow-lg">
          <Crown className="w-4 h-4 text-amber-400" />
          <span>ترقية العضوية الممتازة TempMail Pro VIP</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-4">
          ارتقِ بتجربة البريد المؤقت إلى المستوى الاحترافي
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          استمتع ببريد مؤقت خالي تماماً من الإعلانات، مع نطاقات VIP حصرية ومتاحة دائماً.
        </p>

        {/* VIP Locked Features Highlight */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2 text-xs font-bold text-amber-300">
            <Lock className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Private Custom Domains</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2 text-xs font-bold text-amber-300">
            <Lock className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Automatic Email Forwarding</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2 text-xs font-bold text-amber-300">
            <Lock className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Custom Email Prefix</span>
          </div>
        </div>

        {isPremium && (
          <div className="mt-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-4 max-w-md mx-auto">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-emerald-300">أنت مشترك حالياً في عضوية VIP!</h4>
                <p className="text-xs text-slate-400">جميع الميزات الحصرية مفعلة بحسابك.</p>
              </div>
            </div>
            <button
              onClick={onCancelPremium}
              className="text-xs text-rose-400 hover:text-rose-300 hover:underline shrink-0"
            >
              إلغاء الاشتراك
            </button>
          </div>
        )}
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {plans.map((plan) => (
          <motion.div
            key={plan.id}
            whileHover={{ y: -6 }}
            className={`relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all ${
              plan.popular
                ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950/70 border-2 border-amber-500/60 shadow-2xl'
                : 'bg-slate-900/80 border border-slate-800 shadow-xl'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-black shadow-md flex items-center gap-1">
                <Star className="w-3 h-3 fill-slate-950" />
                <span>الأكثر شعبية</span>
              </div>
            )}

            <div>
              <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
              <p className="text-xs text-slate-400 mb-5 min-h-[32px]">{plan.description}</p>

              <div className="mb-6 flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-black text-white font-mono">
                  ${plan.price}
                </span>
                <span className="text-xs text-slate-400">
                  {plan.billingPeriod === 'month' && '/ شهرياً'}
                  {plan.billingPeriod === 'year' && '/ سنوياً'}
                  {plan.billingPeriod === 'lifetime' && '/ مدى الحياة'}
                </span>
              </div>

              <ul className="space-y-3 mb-8 pt-4 border-t border-slate-800">
                {plan.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              id={`btn-select-plan-${plan.id}`}
              onClick={() => handleOpenCheckout(plan.id.replace('plan-', '') as any)}
              className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95 ${
                plan.popular
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-900/30'
                  : 'bg-slate-800 hover:bg-emerald-600 text-white border border-slate-700'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>{isVip ? 'تغيير الخطة' : 'الاشتراك الآن'}</span>
            </button>
          </motion.div>
        ))}
      </div>

      {/* Stripe Guarantee Badges */}
      <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-around gap-4 text-center text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>دفع آمن ومشرّع بنسبة 100% عبر Supabase & Stripe</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-400" />
          <span>ضمان استعادة الأموال خلال 14 يوماً</span>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400" />
          <span>تفعيل فوري لمميزات VIP</span>
        </div>
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {showStripeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isProcessing && setShowStripeModal(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-7 shadow-2xl z-10 text-start"
            >
              <button
                onClick={() => setShowStripeModal(false)}
                disabled={isProcessing}
                className="absolute top-4 left-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>

              {paymentSuccess ? (
                <div className="py-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 animate-bounce">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">تم تفعيل العضوية بنجاح</h3>
                  <p className="text-xs text-slate-300 mb-4">
                    أهلاً بك في TempMail Pro VIP! تمت إزالة جميع الإعلانات وتفعيل النطاقات الحصرية.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSimulatePayment} className="space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">إتمام الاشتراك VIP</h3>
                      <p className="text-xs text-slate-400">
                        الخطة المختارة: <strong className="text-amber-400">{currentPlanObj.name} (${currentPlanObj.price})</strong>
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>تشفير آمن 256-bit وحفظ البيانات في Supabase Profile</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      الاسم المكتوب على البطاقة:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="أحمد علي"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      رقم البطاقة (Card Number):
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="4242 •••• •••• 4242"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-600 font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        تاريخ الانتهاء (MM/YY):
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="12/28"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-600 font-mono focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        رمز CVC:
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="123"
                        maxLength={4}
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-600 font-mono focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                      {isProcessing ? (
                        <div className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>جاري الدعم والتفعيل...</span>
                        </div>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          <span>دفع ${currentPlanObj.price} وتفعيل VIP</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
