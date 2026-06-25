import React from "react";
import { useLanguage } from "../LanguageContext";
import { motion } from "motion/react";
import { 
  Newspaper, 
  RotateCw, 
  ExternalLink, 
  Globe, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle,
  Clock
} from "lucide-react";

interface NewsItem {
  title: string;
  date: string;
  summary: string;
  sourceName: string;
  url: string;
}

interface GroundingLink {
  title: string;
  url: string;
}

export default function ImmigrationNews() {
  const { lang, t } = useLanguage();
  const [news, setNews] = React.useState<NewsItem[]>([]);
  const [groundingLinks, setGroundingLinks] = React.useState<GroundingLink[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [isLive, setIsLive] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchNews = async (isRefresh = false) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/immigration-news${isRefresh ? "?refresh=true" : ""}`);
      if (!response.ok) {
        throw new Error("Failed to fetch news from server");
      }
      const data = await response.json();
      setNews(data.news || []);
      setGroundingLinks(data.groundingLinks || []);
      setIsLive(!!data.isLive);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchNews(false);
  }, []);

  // Set visual theme colors based on selected lang or branding
  const isCheese = lang === "cheese";

  return (
    <section id="immigration-news-section" className="py-20 bg-stone-50 dark:bg-stone-900 border-t border-b border-stone-200/60 dark:border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center space-x-2 bg-siam-teal/10 dark:bg-siam-gold/10 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase text-siam-teal-dark dark:text-siam-gold-light border border-siam-teal/15 dark:border-siam-gold/15">
              <Sparkles className="h-3.5 w-3.5 text-siam-teal dark:text-siam-gold animate-pulse" />
              <span>{t("news", "live_badge")}</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 dark:text-stone-50 tracking-tight">
              {t("news", "title")}
            </h2>
            <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300">
              {t("news", "subtitle")}
            </p>
          </div>

          <button
            onClick={() => fetchNews(true)}
            disabled={loading}
            className="inline-flex items-center space-x-2.5 px-6 py-3 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-200 text-sm font-semibold rounded-xl hover:bg-stone-50 dark:hover:bg-stone-750 transition-all duration-250 cursor-pointer disabled:opacity-50 select-none shadow-sm shadow-stone-100 dark:shadow-none shrink-0"
          >
            <RotateCw className={`h-4.5 w-4.5 text-stone-500 dark:text-stone-400 ${loading ? "animate-spin text-siam-teal" : ""}`} />
            <span>{t("news", "refresh_btn")}</span>
          </button>
        </div>

        {/* Warning info if running in fallback/mock mode */}
        {!loading && !isLive && (
          <div className="mb-10 bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4.5 flex items-start space-x-3 text-amber-800 dark:text-amber-400">
            <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5 text-amber-600 dark:text-amber-500" />
            <div className="space-y-1 text-xs">
              <span className="font-bold uppercase tracking-wider block">
                {isCheese ? "Melt Warning: Missing Secret Spices! 🧀" : "Обратите внимание / Notice"}
              </span>
              <p className="leading-relaxed text-stone-600 dark:text-stone-300">
                {t("news", "error_key")}
              </p>
            </div>
          </div>
        )}

        {/* Loading / Content Container */}
        {loading ? (
          <div className="bg-white dark:bg-stone-800/40 border border-stone-200/50 dark:border-stone-800 rounded-3xl p-16 flex flex-col items-center justify-center text-center space-y-5">
            <div className="relative">
              <div className="h-14 w-14 rounded-2xl bg-siam-teal/10 dark:bg-siam-gold/10 flex items-center justify-center text-siam-teal dark:text-siam-gold">
                <Newspaper className="h-7 w-7" />
              </div>
              <span className="absolute -bottom-1 -right-1 h-5.5 w-5.5 rounded-full bg-siam-teal text-white flex items-center justify-center shadow-md animate-bounce">
                <RotateCw className="h-3.5 w-3.5 animate-spin" />
              </span>
            </div>
            <div className="space-y-2 max-w-md">
              <h4 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
                {isCheese ? "Sniffing the pasture... 👃" : "Получаем данные..."}
              </h4>
              <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                {t("news", "loading")}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-10">
            {/* News Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {news.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  className="bg-white dark:bg-stone-800/30 border border-stone-200/60 dark:border-stone-800 rounded-3xl p-6 flex flex-col justify-between hover:border-siam-teal/45 dark:hover:border-siam-gold/45 hover:shadow-xl hover:shadow-stone-100/40 dark:hover:shadow-none transition-all duration-300 relative group overflow-hidden"
                >
                  <div className="space-y-4">
                    {/* Source Name & Date */}
                    <div className="flex items-center justify-between text-[11px] font-mono text-stone-500 dark:text-stone-400">
                      <span className="bg-stone-100 dark:bg-stone-800 px-2.5 py-1 rounded-md font-bold text-stone-700 dark:text-stone-300 group-hover:bg-siam-teal/10 dark:group-hover:bg-siam-gold/10 group-hover:text-siam-teal-dark dark:group-hover:text-siam-gold-light transition-colors">
                        {item.sourceName}
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="h-3 w-3 text-stone-400 shrink-0" />
                        <span>{item.date}</span>
                      </span>
                    </div>

                    {/* Headline */}
                    <h3 className="font-serif text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 leading-snug group-hover:text-siam-teal-dark dark:group-hover:text-siam-gold-light transition-colors">
                      {item.title}
                    </h3>

                    {/* Abstract / Summary */}
                    <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                      {item.summary}
                    </p>
                  </div>

                  {/* Read More link */}
                  <div className="pt-6 mt-6 border-t border-stone-100 dark:border-stone-800/80">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1.5 text-xs font-semibold text-siam-teal hover:text-siam-teal-dark dark:text-siam-gold-light dark:hover:text-siam-gold hover:underline transition-all group/link"
                    >
                      <span>{t("news", "read_more")}</span>
                      <ExternalLink className="h-3.5 w-3.5 transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Google Search Grounding Web Sources panel */}
            {groundingLinks.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-siam-sand/65 dark:bg-stone-800/10 border border-stone-200/50 dark:border-stone-800 rounded-3xl p-6 sm:p-8 space-y-4"
              >
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-500 shrink-0" />
                  <h4 className="font-serif text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100">
                    {t("news", "grounding_links")}
                  </h4>
                </div>
                <div className="flex flex-wrap gap-3">
                  {groundingLinks.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-750 px-4 py-2 rounded-xl text-xs font-medium text-stone-700 dark:text-stone-300 border border-stone-200/50 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600 transition-all shadow-xs"
                    >
                      <Globe className="h-3.5 w-3.5 text-stone-400" />
                      <span className="max-w-[200px] truncate">{link.title || link.url}</span>
                      <ExternalLink className="h-3 w-3 text-stone-400 shrink-0" />
                    </a>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
