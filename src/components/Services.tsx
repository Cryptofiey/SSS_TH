import React from "react";
import { getTranslatedServices } from "../translations";
import { Service } from "../types";
import { Check, ArrowUpRight, FileText, ShieldCheck, Loader2 } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { downloadChecklistPdf } from "../utils/pdfGenerator";
import { useLanguage } from "../LanguageContext";

interface ServicesProps {
  onSelectService: (serviceId: string) => void;
}

export default function Services({ onSelectService }: ServicesProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<'all' | 'visa' | 'legal' | 'living'>('all');
  const [expandedServiceId, setExpandedServiceId] = React.useState<string | null>(null);
  const [pdfLoadingId, setPdfLoadingId] = React.useState<string | null>(null);
  const { lang, t } = useLanguage();

  const servicesList = getTranslatedServices(lang);

  const handleDownloadChecklist = async (service: Service) => {
    await downloadChecklistPdf({
      service,
      onProgress: (loading) => setPdfLoadingId(loading ? service.id : null),
    });
  };

  const categories = [
    { id: 'all', label: t("services", "all") },
    { id: 'visa', label: t("services", "visas") },
    { id: 'legal', label: t("services", "legal") },
    { id: 'living', label: t("services", "living") },
  ];

  const filteredServices = selectedCategory === 'all' 
    ? servicesList 
    : servicesList.filter(s => s.category === selectedCategory);

  // Helper to dynamically get Lucide Icon
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Globe": return LucideIcons.Globe;
      case "Crown": return LucideIcons.Crown;
      case "Heart": return LucideIcons.Heart;
      case "Briefcase": return LucideIcons.Briefcase;
      case "CreditCard": return LucideIcons.CreditCard;
      case "FileText": return LucideIcons.FileText;
      case "Home": return LucideIcons.Home;
      default: return LucideIcons.Compass;
    }
  };

  const getTranslatedCategoryLabel = (cat: string) => {
    if (lang === "cheese") {
      return cat === 'visa' ? 'Swiss Cheese / Hole pass' : cat === 'legal' ? 'Cheddar Factory' : 'Mouse Hole Nest';
    }
    if (lang === "en") {
      return cat === 'visa' ? 'Visa & Immigration' : cat === 'legal' ? 'Corporate & Business' : 'Property & Rent';
    }
    return cat === 'visa' ? 'Виза & Иммиграция' : cat === 'legal' ? 'Юридические & Бизнес' : 'Проживание';
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
            {t("services", "title")}
          </h2>
          <p className="text-base text-stone-600">
            {t("services", "desc")}
          </p>
        </div>

        {/* Category Selector Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id as any);
                setExpandedServiceId(null);
              }}
              className={`px-5.5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-siam-teal text-white shadow-md shadow-siam-teal/15"
                  : "bg-siam-sand text-stone-600 hover:bg-stone-100"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => {
            const IconComponent = getIcon(service.iconName);
            const isExpanded = expandedServiceId === service.id;

            return (
              <div 
                key={service.id}
                id={`service-card-${service.id}`}
                className={`flex flex-col rounded-2xl border bg-white p-6.5 transition-all duration-300 ${
                  isExpanded 
                    ? "border-siam-gold ring-1 ring-siam-gold/40 shadow-xl lg:col-span-3 lg:flex-row lg:gap-8" 
                    : "border-stone-200 hover:border-siam-teal hover:shadow-lg hover:-translate-y-0.5"
                }`}
              >
                {/* Visual Icon & Identity block */}
                <div className={`flex items-start justify-between ${isExpanded ? "lg:w-1/3 lg:flex-col lg:justify-between lg:h-full" : "mb-5"}`}>
                  <div className="space-y-3">
                    <div className="h-12 w-12 bg-siam-sand rounded-xl flex items-center justify-center text-siam-teal border border-stone-100">
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <span className="text-[10px] font-mono font-semibold tracking-wider text-siam-gold uppercase block">
                      {getTranslatedCategoryLabel(service.category)}
                    </span>
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900 leading-snug">
                      {service.title}
                    </h3>
                  </div>

                  {!isExpanded && (
                    <button
                      onClick={() => setExpandedServiceId(service.id)}
                      className="p-1.5 text-stone-400 hover:text-siam-teal hover:bg-siam-sand rounded-lg transition-colors cursor-pointer"
                      title={lang === "ru" ? "Подробнее" : lang === "en" ? "Learn more" : "Nibble more 🧀"}
                    >
                      <ArrowUpRight className="h-5 w-5" />
                    </button>
                  )}
                </div>

                {/* Details / Content Box */}
                <div className={`flex-1 flex flex-col justify-between ${isExpanded ? "lg:border-l lg:border-stone-200 lg:pl-8 pt-6 lg:pt-0" : ""}`}>
                  <div className="space-y-4">
                    <p className="text-sm text-stone-600 leading-relaxed">
                      {service.description}
                    </p>

                    {/* Cost and Duration block */}
                    <div className="grid grid-cols-2 gap-4 bg-siam-sand rounded-xl p-4 text-xs">
                      <div>
                        <span className="text-stone-400 block mb-0.5 font-medium">{t("services", "cost")}</span>
                        <strong className="text-stone-800 font-semibold">{service.costRange}</strong>
                      </div>
                      <div>
                        <span className="text-stone-400 block mb-0.5 font-medium">{t("services", "duration")}</span>
                        <strong className="text-stone-800 font-semibold">{service.duration}</strong>
                      </div>
                    </div>

                    {/* Detailed info if Expanded */}
                    {isExpanded && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 animate-fadeIn">
                        {/* Bullet description */}
                        <div>
                          <h4 className="text-xs font-mono font-bold tracking-wider text-stone-400 uppercase mb-3">
                            {lang === "ru" ? "Особенности услуги" : lang === "en" ? "Service Features" : "Dairy Particulars 🧀"}
                          </h4>
                          <ul className="space-y-2 text-xs text-stone-600">
                            {service.fullDetails.map((detail, idx) => (
                              <li key={idx} className="flex items-start space-x-2">
                                <span className="text-siam-teal shrink-0 font-bold mt-0.5">•</span>
                                <span>{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        {/* Checklist */}
                        <div>
                          <h4 className="text-xs font-mono font-bold tracking-wider text-stone-400 uppercase mb-3">
                            {t("services", "req_docs")}
                          </h4>
                          <ul className="space-y-2 text-xs text-stone-600 bg-stone-50 border border-stone-200/50 rounded-xl p-4">
                            {service.checklists.map((check, idx) => (
                              <li key={idx} className="flex items-start space-x-2.5">
                                <Check className="h-4 w-4 text-siam-teal shrink-0 mt-0.5" />
                                <span>{check}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 mt-6 pt-4 border-t border-stone-100">
                    <button
                      onClick={() => onSelectService(service.id)}
                      className="flex-1 min-w-[120px] py-3 bg-siam-teal hover:bg-siam-teal-dark text-white font-medium text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                      id={`book-service-${service.id}`}
                    >
                      {t("services", "book_btn")}
                    </button>

                    {isExpanded && (
                      <button
                        onClick={() => handleDownloadChecklist(service)}
                        disabled={pdfLoadingId === service.id}
                        className="px-4 py-3 bg-stone-50 hover:bg-stone-100 text-stone-700 font-medium text-xs rounded-xl border border-stone-200 transition-all cursor-pointer flex items-center space-x-1.5 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                        id={`download-checklist-${service.id}`}
                        title={lang === "ru" ? "Скачать чек-лист документов в PDF" : "Download PDF checklist"}
                      >
                        {pdfLoadingId === service.id ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin text-siam-teal" />
                            <span>{lang === "ru" ? "Загрузка..." : "Loading..."}</span>
                          </>
                        ) : (
                          <>
                            <FileText className="h-4 w-4 text-siam-teal" />
                            <span>{lang === "ru" ? "Чек-лист (PDF)" : "Checklist (PDF)"}</span>
                          </>
                        )}
                      </button>
                    )}

                    {isExpanded ? (
                      <button
                        onClick={() => setExpandedServiceId(null)}
                        className="px-4 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium text-xs rounded-xl transition-colors cursor-pointer"
                      >
                        {lang === "ru" ? "Свернуть" : lang === "en" ? "Collapse" : "Melt together 🫕"}
                      </button>
                    ) : (
                      <button
                        onClick={() => setExpandedServiceId(service.id)}
                        className="px-4 py-3 bg-siam-sand hover:bg-stone-100 text-siam-teal font-medium text-xs rounded-xl border border-stone-200/40 transition-colors cursor-pointer"
                        id={`expand-service-${service.id}`}
                      >
                        {lang === "ru" ? "Подробнее" : lang === "en" ? "Learn more" : "Inspect 🧀"}
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Informational Legal Trust Badge */}
        <div className="mt-16 bg-siam-sand border border-stone-200/60 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center md:justify-between gap-6">
          <div className="flex items-start space-x-4">
            <div className="h-12 w-12 bg-siam-teal/10 rounded-xl flex items-center justify-center text-siam-teal shrink-0">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-serif text-lg font-bold text-stone-900 mb-1">
                {lang === "ru" 
                  ? "Юридическая безопасность и гарантия возврата денег" 
                  : lang === "en"
                    ? "Full Legal Security & Money-back Guarantee"
                    : "Zero-Cat Attack Guarantee & Dairy Refund Security 🛡️"}
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed max-w-2xl">
                {lang === "ru"
                  ? "Мы подписываем официальный двуязычный договор обслуживания (Thai & English). Если по вине нашей компании вы получаете отказ иммиграционной службы Таиланда, мы возвращаем 100% стоимости наших услуг."
                  : lang === "en"
                    ? "We sign an official bilingual service contract (Thai & English). If you receive a rejection from the Thai Immigration Service due to our error, we refund 100% of our service fees."
                    : "We sign an official double-stamped butter contract. If the grand Thai inspectors reject your cheese rolls due to our faulty butter starter, we deliver 100% of your crumbs back."}
              </p>
            </div>
          </div>
          <button
            onClick={() => onSelectService("dtv-visa")}
            className="px-6 py-3 bg-white border border-stone-200 hover:border-siam-gold text-stone-880 font-medium text-xs rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap"
          >
            {lang === "ru" ? "Читать пример договора" : lang === "en" ? "View sample contract" : "Sniff sample recipe 📋"}
          </button>
        </div>

      </div>
    </section>
  );
}
