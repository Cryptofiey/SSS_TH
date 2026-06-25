import React from "react";
import { ArrowRight, Compass, Shield, Users, Clock, CheckCircle, MessageSquare } from "lucide-react";
import { useLanguage } from "../LanguageContext";

interface HeroProps {
  setCurrentTab: (tab: string) => void;
}

export default function Hero({ setCurrentTab }: HeroProps) {
  const { lang, t } = useLanguage();

  const stats = [
    { value: t("hero", "stat1_val"), label: t("hero", "stat1_lbl"), icon: Shield },
    { value: t("hero", "stat2_val"), label: t("hero", "stat2_lbl"), icon: Users },
    { value: t("hero", "stat3_val"), label: t("hero", "stat3_lbl"), icon: Clock },
  ];

  return (
    <div className="relative overflow-hidden py-16 sm:py-24 bg-gradient-to-b from-stone-50 to-white">
      {/* Background elegant circles */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/4 w-[600px] h-[600px] rounded-full bg-siam-teal/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-1/4 w-[400px] h-[400px] rounded-full bg-siam-gold/5 blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
          
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-siam-teal/10 text-siam-teal px-4.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider font-mono">
              <Compass className="h-3.5 w-3.5 animate-spin" style={{ animationDuration: "12s" }} />
              <span>{t("hero", "official")}</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-900 leading-[1.1]">
              {t("hero", "title_main")}
              <span className="text-siam-teal relative inline-block">
                {t("hero", "title_highlight")}
                <span className="absolute bottom-1.5 left-0 w-full h-1.5 bg-siam-gold/30 rounded-full" />
              </span>
              {t("hero", "title_suffix")}
            </h1>

            <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {t("hero", "desc")}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => setCurrentTab("booking")}
                className="inline-flex items-center justify-center px-8 py-4 bg-siam-teal hover:bg-siam-teal-dark text-white font-medium text-base rounded-full shadow-lg shadow-siam-teal/25 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
                id="hero-btn-booking"
              >
                {t("hero", "cta_booking")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button
                onClick={() => setCurrentTab("telegram")}
                className="inline-flex items-center justify-center px-8 py-4 bg-white border border-stone-200 hover:border-siam-gold hover:bg-stone-50 text-stone-880 font-medium text-base rounded-full shadow-xs transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
                id="hero-btn-telegram"
              >
                <MessageSquare className="mr-2 h-5 w-5 text-siam-gold" />
                {t("hero", "cta_telegram")}
              </button>
            </div>

            {/* Mini Bullet points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-left max-w-lg mx-auto lg:mx-0 pt-4 text-sm text-stone-600">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4.5 w-4.5 text-siam-teal shrink-0" />
                <span>{t("hero", "bullet1")}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4.5 w-4.5 text-siam-teal shrink-0" />
                <span>{t("hero", "bullet2")}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4.5 w-4.5 text-siam-teal shrink-0" />
                <span>{t("hero", "bullet3")}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4.5 w-4.5 text-siam-teal shrink-0" />
                <span>{t("hero", "bullet4")}</span>
              </div>
            </div>
          </div>

          {/* Visual Container */}
          <div className="lg:col-span-5 mt-16 lg:mt-0 relative flex justify-center">
            <div className="relative w-full max-w-sm">
              
              {/* Main tropical mockup card */}
              <div className="bg-white border border-stone-200/60 rounded-3xl p-6.5 shadow-2xl relative z-10 overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-siam-gold/10 rounded-full blur-xl" />
                
                {/* Header card info */}
                <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-full bg-siam-teal/10 flex items-center justify-center">
                      <span className="text-siam-teal text-xs font-bold">★</span>
                    </div>
                    <div>
                      <span className="text-xs font-mono uppercase tracking-widest text-stone-400 block">
                        {t("hero", "mock_status")}
                      </span>
                      <span className="text-sm font-semibold text-stone-800">
                        {lang === "cheese" ? "🧀 Premium Cheese Roll" : "DTV Visa Application"}
                      </span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200 rounded-full">
                    {t("hero", "mock_in_progress")}
                  </span>
                </div>

                {/* Steps visualizer */}
                <div className="space-y-4.5 py-5">
                  <div className="flex items-start space-x-3 text-xs">
                    <div className="w-5 h-5 rounded-full bg-siam-teal flex items-center justify-center text-white shrink-0 mt-0.5">✓</div>
                    <div>
                      <strong className="text-stone-800 block">{t("hero", "mock_step1")}</strong>
                      <span className="text-stone-500">{t("hero", "mock_step1_desc")}</span>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 text-xs">
                    <div className="w-5 h-5 rounded-full bg-siam-teal flex items-center justify-center text-white shrink-0 mt-0.5">✓</div>
                    <div>
                      <strong className="text-stone-800 block">{t("hero", "mock_step2")}</strong>
                      <span className="text-stone-500">{t("hero", "mock_step2_desc")}</span>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 text-xs">
                    <div className="w-5 h-5 rounded-full bg-siam-gold flex items-center justify-center text-white shrink-0 mt-0.5 animate-pulse">●</div>
                    <div>
                      <strong className="text-stone-800 block">{t("hero", "mock_step3")}</strong>
                      <span className="text-siam-gold font-medium">{t("hero", "mock_step3_desc")}</span>
                    </div>
                  </div>
                </div>

                {/* Action button inside mockup */}
                <button
                  onClick={() => setCurrentTab("cabinet")}
                  className="w-full py-2.5 bg-siam-teal hover:bg-siam-teal-dark text-white font-medium text-xs rounded-xl transition-colors mt-2 cursor-pointer"
                >
                  {t("hero", "mock_cabinet_btn")}
                </button>
              </div>

              {/* Back card decoration */}
              <div className="absolute top-6 -left-6 w-full h-full bg-stone-100 border border-stone-200/40 rounded-3xl -z-10 shadow-lg" />
              
              {/* Telegram mini notification pill */}
              <div className="absolute -bottom-6 -right-6 bg-white border border-stone-200/60 rounded-2xl p-4 shadow-xl z-20 max-w-[220px] flex items-center space-x-3">
                <div className="h-10 w-10 bg-[#229ED9]/10 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-[#229ED9] text-base font-bold">✈</span>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-[#229ED9] block">{t("hero", "tg_live")}</span>
                  <span className="text-xs text-stone-600 leading-snug">{t("hero", "tg_text")}</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Stats Section */}
        <div className="mt-20 md:mt-24 border-t border-stone-200/80 pt-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="flex items-center space-x-4 bg-white/50 backdrop-blur-xs p-5.5 rounded-2xl border border-stone-200/30">
                  <div className="h-12 w-12 bg-siam-teal/10 rounded-xl flex items-center justify-center text-siam-teal shrink-0">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="font-serif text-2xl sm:text-3xl font-bold text-stone-950 block">{stat.value}</span>
                    <span className="text-sm text-stone-500 font-medium">{stat.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
