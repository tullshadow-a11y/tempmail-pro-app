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
  ArrowLeft
} from 'lucide-react';
import { PremiumPlan, SiteSettings } from '../types';

interface PremiumPageProps {
  settings: SiteSettings;
  isPremium: boolean;
  onActivatePremium: () => void;
  onCancelPremium: () => void;
  onBackToHome: () => void;
}

export const PremiumPage: React.FC<PremiumPageProps> = ({
  settings,
  isPremium,
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

  const plans: PremiumPlan[] = [
    {
      id: 'plan-monthly',
      name: 'Monthly Plan',
      nameEn: 'Monthly Plan',
      price: settings.premiumMonthlyPrice || 4.99,
      billingPeriod: 'month',
      description: 'Flexible billing, cancel anytime without long-term commitments.',
      features: [
        '100% Ad-free experience',
        'Exclusive VIP domain access',
        'Maintain 5 concurrent temp emails',
        '7-day message retention',
        '50MB attachment storage',
        'Priority technical support',
      ],
    },
    {
      id: 'plan-yearly',
      name: 'Yearly Plan (Best Value)',
      nameEn: 'Yearly Plan (Best Value)',
      price: settings.premiumYearlyPrice || 39.99,
      billingPeriod: 'year',
      popular: true,
      description: 'Save over 40% and enjoy high-speed, ad-free temporary mail.',
      features: [
        'All Monthly plan features included',
        '100% Ad-free high speed browsing',
        'Fresh VIP domains updated weekly',
        'Maintain 15 concurrent temp emails',
        '30-day message retention',
        '200MB attachment storage',
        'Automatic email forwarding',
        'Full developer API access',
      ],
    },
    {
      id: 'plan-lifetime',
      name: 'Lifetime VIP Pass',
      nameEn: 'Lifetime VIP Pass',
      price: 89.99,
      billingPeriod: 'lifetime',
      description: 'One-time payment for permanent VIP access with zero renewals.',
      features: [
        'All features included forever',
        'Unlimited permanent disposable emails',
        'Custom domain attachment support',
        'End-to-end military grade encryption',
        'Unlimited cloud message storage',
        '24/7 Direct developer support',
      ],
    },
  ];

  const handleOpenCheckout = (planId: 'monthly' | 'yearly' | 'lifetime') => {
    setSelectedPlan(planId);
    setShowStripeModal(true);
  };

  const handleSimulateStripePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      onActivatePremium();
      setTimeout(() => {
        setShowStripeModal(false);
        setPaymentSuccess(false);
      }, 2200);
    }, 1500);
  };

  const currentPlanObj = plans.find(p => p.id === `plan-${selectedPlan}`) || plans[1];

  return (
    <div className="w-full max-w-5xl mx-auto my-8 px-4 sm:px-6">
      {/* Back Button */}
      <button
        onClick={onBackToHome}
        className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-400 hover:text-white mb-6 p-2 rounded-xl hover:bg-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Inbox</span>
      </button>

      {/* Hero Banner */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-300 text-xs font-bold mb-4 border border-amber-500/30 shadow-lg shadow-amber-950/40">
          <Crown className="w-4 h-4 text-amber-400" />
          <span>Upgrade to TempMail Pro VIP</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-4">
          Elevate Your Temporary Email Experience
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Enjoy an ad-free interface, unblocked VIP email domains, extra storage space, and complete developer API access.
        </p>

        {isPremium && (
          <div className="mt-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-4 max-w-md mx-auto">
            <div className="flex items-center gap-3 text-left">
              <CheckCircle className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-emerald-300">You are an active VIP subscriber!</h4>
                <p className="text-xs text-slate-400">All premium features are unlocked.</p>
              </div>
            </div>
            <button
              onClick={onCancelPremium}
              className="text-xs text-rose-400 hover:text-rose-300 hover:underline shrink-0"
            >
              Cancel VIP
            </button>
          </div>
        )}
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {plans.map((plan) => {
          return (
            <motion.div
              key={plan.id}
              whileHover={{ y: -6 }}
              className={`relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all ${
                plan.popular
                  ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950/70 border-2 border-amber-500/60 shadow-2xl shadow-amber-950/30'
                  : 'bg-slate-900/80 border border-slate-800 shadow-xl'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-black shadow-md flex items-center gap-1">
                  <Star className="w-3 h-3 fill-slate-950" />
                  <span>Most Popular</span>
                </div>
              )}

              <div>
                <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                <p className="text-xs text-slate-400 mb-5 min-h-[32px]">{plan.description}</p>

                {/* Price */}
                <div className="mb-6 flex items-baseline gap-1.5">
                  <span className="text-3xl sm:text-4xl font-black text-white font-mono">
                    ${plan.price}
                  </span>
                  <span className="text-xs text-slate-400">
                    {plan.billingPeriod === 'month' && '/ month'}
                    {plan.billingPeriod === 'year' && '/ year'}
                    {plan.billingPeriod === 'lifetime' && '/ one-time'}
                  </span>
                </div>

                {/* Features list */}
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
                    : 'bg-slate-800 hover:bg-emerald-600 text-white hover:border-transparent border border-slate-700'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>{isPremium ? 'Change Subscription' : 'Upgrade with Stripe'}</span>
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Stripe Guarantee Badges */}
      <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800/80 max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-around gap-4 text-center sm:text-left text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>100% Encrypted SSL Checkout via Stripe</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-400" />
          <span>14-Day Money-Back Guarantee</span>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400" />
          <span>Instant VIP Feature Activation</span>
        </div>
      </div>

      {/* Stripe Checkout Modal */}
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
              className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-7 shadow-2xl z-10"
            >
              <button
                id="btn-close-stripe-modal"
                onClick={() => setShowStripeModal(false)}
                disabled={isProcessing}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>

              {paymentSuccess ? (
                <div className="py-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 animate-bounce">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Payment Completed</h3>
                  <p className="text-xs text-slate-300 mb-4">
                    Welcome to TempMail Pro VIP. Your account is active and all ads have been disabled.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSimulateStripePayment} className="space-y-4 text-left">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Stripe Checkout</h3>
                      <p className="text-xs text-slate-400">
                        Selected Plan: <strong className="text-amber-400">{currentPlanObj.name} (${currentPlanObj.price})</strong>
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>Secure 256-bit encrypted transaction via Stripe API</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Full Name on Card:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Alex Mercer"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Card Number:
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
                        Expiry Date (MM/YY):
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
                        CVC Code:
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
                          <span>Processing payment...</span>
                        </div>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          <span>Pay ${currentPlanObj.price} & Activate VIP</span>
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
