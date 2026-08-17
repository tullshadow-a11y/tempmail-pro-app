import React, { useState } from 'react';
import { 
  ShieldCheck, 
  HelpCircle, 
  Users, 
  Lock, 
  Sparkles, 
  CheckCircle, 
  XCircle, 
  ChevronDown, 
  Code, 
  ShoppingBag, 
  Briefcase, 
  EyeOff, 
  Zap, 
  Clock, 
  Trash
} from 'lucide-react';

export const InformationSection: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'ما هو البريد المؤقت (Temporary Mail)؟',
      a: 'البريد المؤقت (ويُعرف أيضاً باسم البريد الوهمي أو البريد القابل للتخلص منه Disposable Email) هو خدمة توفر لك عنوان بريد إلكتروني صالح للاستخدام فورياً ودون أي تسجيل مسبق. تستطيع من خلاله استقبال رسائل التفعيل وأكواد التحقق والروابط بكل أمان وسرية، مع ضمان تدمير الرسائل ذاتياً بعد انتهاء حاجتك إليها.',
    },
    {
      q: 'هل الخدمة مجانية تماماً؟',
      a: 'نعم، الخدمة الأساسية مجانية 100% وبدون أي قيود على عدد رسائل التفعيل التي يمكنك استقبالها يومياً.',
    },
    {
      q: 'ما الفرق بين البريد المؤقت وبريد Gmail أو Outlook؟',
      a: 'البريد الدائم (مثل Gmail) يتطلب بياناتك الحقيقية ويظل نشطاً مدى الحياة مما يعرضك للرسائل المزعجة وتتبع الشركات، بينما البريد المؤقت لا يطلب أي معلومات شخصية، ويتم تدميره ذاتياً فور الانتهاء لحماية خصوصيتك التامة.',
    },
    {
      q: 'هل يمكنني إرسال رسائل من هذا البريد؟',
      a: 'الخدمة مخصصة لاستقبال الرسائل وأكواد التحقق والتفعيل فقط لمنع إساءة استخدام الخدمة في إرسال البريد المزعج (Spam).',
    },
    {
      q: 'كم تظل الرسائل محفوظة في صندوق الوارد؟',
      a: 'تظل الرسائل متاحة طالما الصفحة مفتوحة وفي جلسة التصفح، ويتم تفريغ الصناديق تلقائياً كل فترة للحفاظ على أمان وسرعة السيرفرات.',
    },
    {
      q: 'هل يمكنني اختيار اسم مخصص لعنوان البريد؟',
      a: 'نعم! يمكنك النقر على زر "تغيير الإيميل" واختيار اسم المستخدم الذي تريده مع النطاق المفضل لديك.',
    },
  ];

  const personas = [
    {
      icon: <ShoppingBag className="w-6 h-6 text-emerald-400" />,
      title: 'المتسوقون عبر الإنترنت',
      desc: 'للحصول على أكواد الخصم والعروض الترويجية من المتاجر الإلكترونية دون إغراق بريدك الحقيقي بإعلانات لا تنتهي.',
    },
    {
      icon: <Code className="w-6 h-6 text-indigo-400" />,
      title: 'المطورون ومختبرو البرمجيات (QA)',
      desc: 'لاختبار عمليات تسجيل المستخدمين، وتأكيد الحسابات، ودورات إعادة تعيين كلمة المرور في دقائق معدودة.',
    },
    {
      icon: <EyeOff className="w-6 h-6 text-amber-400" />,
      title: 'الباحثون عن الخصوصية والأمان',
      desc: 'لتصفح وتجربة المنتديات، تحميل الكتب والملفات، والتسجيل في المواقع غير الموثوقة دون ترك أي أثر شخصي.',
    },
    {
      icon: <Briefcase className="w-6 h-6 text-teal-400" />,
      title: 'رواد الأعمال والمسوقون',
      desc: 'لفحص تجربة المنافسين، واختبار قنوات الاشتراك البريدي، ودراسة مسارات العملاء بأمان.',
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
            <span>حماية الخصوصية الرقمية 100%</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-3">
            ما هو البريد المؤقت (Temporary Mail)؟
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            البريد المؤقت هو درعك الرقمي الآمن ضد الرسائل الترويجية المزعجة، والتتبع الإعلاني، وتسريبات البيانات على الإنترنت.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-emerald-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base mb-1.5">فوري وبدون تسجيل</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              تحصل على عنوان بريدك بنقرة زر واحدة دون الحاجة لكتابة اسمك أو رقم هاتفك أو اختيار كلمة مرور.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-indigo-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base mb-1.5">مكافحة الـ Spam والتتبع</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              احمِ بريدك الشخصي من البيع لشركات الإعلانات وعمليات التصيد الاحتيالي والبرمجيات الخبيثة.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-amber-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3">
              <Trash className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base mb-1.5">تدمير ذاتي آمن</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              يتم مسح الرسائل فور إغلاق الجلسة أو انتهاء فترتها لضمان عدم بقاء أي أثر لبياناتك على السيرفرات.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Who is this service for? (لمن هذا الموقع؟) */}
      <div>
        <div className="text-center max-w-xl mx-auto mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
            لمن هذا الموقع؟
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            تم تصميم TempMail Pro ليخدم فئات متعددة من مستخدمي الإنترنت اليومي والمحترفين
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

      {/* 3. Why should you use it for Privacy? (لماذا يجب استخدامه للحفاظ على الخصوصية؟) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold border border-indigo-500/20">
            <Lock className="w-4 h-4" />
            <span>الأمن السيبراني والخصوصية</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
            لماذا يجب أن تستخدم البريد المؤقت للحفاظ على خصوصيتك؟
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            وفقاً للإحصائيات الأمنية الحديثة، فإن أكثر من 85% من الهجمات الإلكترونية وسرقة الحسابات تبدأ من خلال رسائل بريد إلكتروني ترويجية أو مزيفة.
          </p>

          <ul className="space-y-3 pt-2">
            <li className="flex items-start gap-3 text-xs sm:text-sm text-slate-300">
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>منع تسريب كلمة المرور:</strong> عدم تكرار بريدك الحقيقي على مواقع قد تعاني من ثغرات أمنية.</span>
            </li>
            <li className="flex items-start gap-3 text-xs sm:text-sm text-slate-300">
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>صندوق وارد نظيف 100%:</strong> الحفاظ على بريدك الشخصي فقط لرسائل العمل والأسرة والبنوك.</span>
            </li>
            <li className="flex items-start gap-3 text-xs sm:text-sm text-slate-300">
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>تجنب التتبع الرقمي:</strong> كسر الروابط التي تستخدمها خوارزميات الإعلانات لتحديد اهتماماتك.</span>
            </li>
          </ul>
        </div>

        {/* Comparison Box */}
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl">
          <h3 className="font-bold text-base text-white mb-4 text-center">
            مقارنة: البريد المؤقت vs البريد الدائم
          </h3>
          
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-300">التسجيل وطلب البيانات الشخصية</span>
              <div className="flex items-center gap-4">
                <span className="text-emerald-400 font-bold flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> غير مطلوب</span>
                <span className="text-rose-400 font-bold flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> إجباري</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-300">احتمالية وصول Spam مستقبلاً</span>
              <div className="flex items-center gap-4">
                <span className="text-emerald-400 font-bold">0% مستحيل</span>
                <span className="text-amber-400 font-bold">عالية جداً</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-300">استقبال أكواد OTP والتفعيل</span>
              <div className="flex items-center gap-4">
                <span className="text-emerald-400 font-bold">فوري ثوانٍ</span>
                <span className="text-slate-300 font-bold">فوري</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-300">إمكانية التغيير بنقرة واحدة</span>
              <div className="flex items-center gap-4">
                <span className="text-emerald-400 font-bold flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> نعم</span>
                <span className="text-rose-400 font-bold flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> معقد</span>
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
            <span>إجابات فورية</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            الأسئلة الشائعة حول البريد المؤقت
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
                  className="w-full p-4 sm:p-5 text-right flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-white hover:text-emerald-400 transition-colors"
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
