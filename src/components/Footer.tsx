import React from "react";
import { Send, MapPin, Phone, Mail, Sparkles } from "lucide-react";
import { useLanguage } from "../LanguageContext";

interface FooterProps {
  setCurrentTab: (tab: string) => void;
}

export default function Footer({ setCurrentTab }: FooterProps) {
  const { lang, t } = useLanguage();

  return (
    <footer className="bg-siam-teal-dark text-stone-200 mt-20 border-t-4 border-siam-gold">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Column 1: Brand & Promo */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-3">
              <div className="h-9 w-9 bg-siam-gold rounded-lg flex items-center justify-center text-siam-teal-dark font-serif font-bold text-lg">
                {lang === "cheese" ? "🧀" : "S"}
              </div>
              <span className="font-serif text-lg font-bold tracking-tight text-white">
                {lang === "cheese" ? (
                  <>SIAM<span className="text-siam-gold ml-1">CHEDDAR</span></>
                ) : (
                  <>SIAM<span className="text-siam-gold ml-1">ASSIST</span></>
                )}
              </span>
            </div>
            <p className="text-sm text-stone-300 leading-relaxed max-w-sm">
              {t("footer", "desc")}
            </p>
            <div className="pt-2 flex items-center space-x-2 text-xs text-siam-gold-light font-medium font-mono">
              <Sparkles className="h-4.5 w-4.5" />
              <span>
                {lang === "ru" 
                  ? "Интегрировано с ИИ-ассистентом" 
                  : lang === "en" 
                    ? "Integrated with AI Assistant" 
                    : "Infused with Active Yeast Bacteria"}
              </span>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <h3 className="font-serif text-white font-semibold text-sm tracking-wider uppercase mb-5">
              {lang === "ru" ? "Навигация" : lang === "en" ? "Navigation" : "The Slices 📋"}
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <button
                  onClick={() => setCurrentTab("landing")}
                  className="hover:text-siam-gold-light transition-colors text-left cursor-pointer"
                >
                  {t("nav", "landing")}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab("calculator")}
                  className="hover:text-siam-gold-light transition-colors text-left cursor-pointer"
                >
                  {t("nav", "calculator")}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab("booking")}
                  className="hover:text-siam-gold-light transition-colors text-left cursor-pointer"
                >
                  {t("nav", "booking")}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab("telegram")}
                  className="hover:text-siam-gold-light transition-colors text-left cursor-pointer"
                >
                  {t("nav", "telegram")}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact details */}
          <div className="space-y-3">
            <h3 className="font-serif text-white font-semibold text-sm tracking-wider uppercase mb-5">
              {lang === "ru" ? "Контакты" : lang === "en" ? "Contact Info" : "Cellar Coordinates 📍"}
            </h3>
            <ul className="space-y-3.5 text-sm text-stone-300">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-siam-gold shrink-0 mt-0.5" />
                <span>
                  <strong>Bangkok Office:</strong> 15th Fl., Mercury Tower, Ploenchit Rd, Bangkok
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-siam-gold shrink-0 mt-0.5" />
                <span>
                  <strong>Phuket Office:</strong> Royal Phuket Marina, Thepkrasattri Rd, Phuket
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-4.5 w-4.5 text-siam-gold shrink-0" />
                <span>+66 2 123 4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-4.5 w-4.5 text-siam-gold shrink-0" />
                <span>info@siamassist.com</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter or direct link */}
          <div>
            <h3 className="font-serif text-white font-semibold text-sm tracking-wider uppercase mb-5">
              {lang === "ru" ? "Телеграм Канал" : lang === "en" ? "Telegram Channel" : "Telegram Squeaker ✈"}
            </h3>
            <p className="text-xs text-stone-300 leading-relaxed mb-4">
              {lang === "ru"
                ? "Подпишитесь на наш официальный канал, чтобы получать свежие новости по визовому режиму, иммиграционным изменениям и законам в Таиланде."
                : lang === "en"
                  ? "Subscribe to our official Telegram feed to receive dynamic updates on immigration laws, visa extensions, and regulations."
                  : "Subscribe to stay updated with fresh milk quality, hole regulations, cat movements, and aged cheddar drops."}
            </p>
            <button
              onClick={() => setCurrentTab("telegram")}
              className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-siam-gold hover:bg-siam-gold/90 text-siam-teal-dark font-medium text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
            >
              <Send className="h-4 w-4 mr-2" />
              {lang === "ru" ? "Запустить ИИ-Бота" : lang === "en" ? "Launch AI Assistant" : "Stir Brie Bot 💬"}
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-teal-900 flex flex-col md:flex-row justify-between items-center text-xs text-stone-400">
          <p>{t("footer", "copyright")}</p>
          <p className="mt-4 md:mt-0 text-center md:text-right max-w-md">
            {lang === "ru"
              ? "Предупреждение: Предоставленная информация носит справочный характер. Окончательное решение принимается Иммиграционным бюро Таиланда (Royal Thai Immigration Bureau)."
              : lang === "en"
                ? "Disclaimer: The material provided here is for informational purposes only. Final decisions remain the exclusive prerogative of the Royal Thai Immigration Bureau."
                : "Mouse advisory: Crumbs outlined here are purely for mental chew cycles. Final rind slicing decisions are ruled by the Grand Dairy Council of Thailand."}
          </p>
        </div>
      </div>
    </footer>
  );
}
