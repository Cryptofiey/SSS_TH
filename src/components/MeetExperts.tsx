import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "../LanguageContext";
import { 
  ShieldCheck, 
  Award, 
  Briefcase, 
  Calendar, 
  MapPin, 
  Star, 
  UserCheck, 
  X, 
  MessageSquare,
  Sparkles,
  HelpCircle,
  Clock,
  ArrowRight
} from "lucide-react";

interface ExpertProfile {
  id: string;
  name: {
    en: string;
    ru: string;
    cheese: string;
  };
  title: {
    en: string;
    ru: string;
    cheese: string;
  };
  category: "visa" | "corporate" | "property" | "civil";
  experience: {
    en: string;
    ru: string;
    cheese: string;
  };
  specializations: {
    en: string[];
    ru: string[];
    cheese: string[];
  };
  bio: {
    en: string;
    ru: string;
    cheese: string;
  };
  accreditation: {
    en: string;
    ru: string;
    cheese: string;
  };
  rating: number;
  consultations: number;
  avatarColor: string;
}

const EXPERTS: ExpertProfile[] = [
  {
    id: "somchai",
    name: {
      en: "Somchai Jaidee",
      ru: "Сомчай Джайди",
      cheese: "Somchai Big-Cheese 🧀"
    },
    title: {
      en: "Senior Immigration Attorney",
      ru: "Старший иммиграционный адвокат",
      cheese: "Grand Swiss-Pass Cheesemonger"
    },
    category: "visa",
    experience: {
      en: "15 years",
      ru: "15 лет практики",
      cheese: "15 seasons of aging"
    },
    specializations: {
      en: ["DTV Visa", "Elite Privilege", "Long-term Residency", "Thai Citizenship"],
      ru: ["Виза DTV", "Thailand Privilege", "Долгосрочное резидентство", "Гражданство"],
      cheese: ["Swiss DTV Pass", "Elite Cheddar", "Vat Matured Stays", "Curd Citizenships"]
    },
    bio: {
      en: "Former Ministry of Foreign Affairs legal consultant, specializing in high-net-worth immigration, complex DTV visa submissions, and VIP elite entry clearances. Somchai has a 100% success record in resolving complicated administrative status rejections for European and US clients.",
      ru: "Бывший юрист-консультант Министерства иностранных дел Таиланда. Специализируется на инвестиционной иммиграции, сложных кейсах виз DTV и получении VIP-статусов. Обладает безупречной репутацией и опытом успешного обжалования отказов в визах для экспатов со всего мира.",
      cheese: "Former Royal Dairy Ministry legal consultant, specializing in extra-sharp curd entries, complex Swiss-DTV permissions, and VIP double-cream passes. Somchai has a flawless record of aging curds and preventing any moldy visa rejections for top cheese-loving clients."
    },
    accreditation: {
      en: "Licensed Thai Bar Association Member (No. 48292/09)",
      ru: "Лицензированный член Коллегии адвокатов Таиланда (№ 48292/09)",
      cheese: "Certified Grand Master of the King's Cheese Vault (No. 48292/09)"
    },
    rating: 4.9,
    consultations: 1420,
    avatarColor: "from-teal-600 to-emerald-700 text-teal-50"
  },
  {
    id: "chanya",
    name: {
      en: "Chanya Prasert",
      ru: "Чанья Прасерт",
      cheese: "Chanya Melted Brie 🧈"
    },
    title: {
      en: "Corporate & Business Law Advisor",
      ru: "Советник по корпоративному праву",
      cheese: "Dairy Factory Enterprise Coordinator"
    },
    category: "corporate",
    experience: {
      en: "11 years",
      ru: "11 лет практики",
      cheese: "11 cycles of curd pressing"
    },
    specializations: {
      en: ["Company Registration", "BOI Privileges", "Work Permits", "Tax Optimization"],
      ru: ["Регистрация бизнеса", "Льготы BOI", "Разрешения на работу", "Оптимизация налогов"],
      cheese: ["Cheese Shop Setup", "BOI Curd Grants", "Mouse Work Permits", "Whey Tax Cuts"]
    },
    bio: {
      en: "Specializes in establishing foreign-owned enterprises, BOI (Board of Investment) approvals, and ensuring tight compliance with Thai business licensing. Chanya has assisted over 600 tech startups and international digital agencies in seamlessly relocating to Thailand.",
      ru: "Эксперт по регистрации юридических лиц с иностранным капиталом, получению преференций BOI и полному соответствию тайским законам о бизнесе. Чанья помогла более чем 600 ИТ-стартапам и диджитал-агентствам успешно легализоваться в Бангкоке и Пхукете.",
      cheese: "Expert in establishing foreign-owned cheese factories, BOI (Board of Dairy) approvals, and securing licenses for commercial cheese aging. Chanya has successfully curdled and set up over 600 digital cheese-trading agencies in Thailand."
    },
    accreditation: {
      en: "Executive Legal Advisor & Certified Corporate Secretary",
      ru: "Сертифицированный корпоративный секретарь и юрист-консультант",
      cheese: "Master Secretary of the Associated Curd Guilds"
    },
    rating: 4.8,
    consultations: 980,
    avatarColor: "from-amber-600 to-siam-gold text-amber-50"
  },
  {
    id: "kitti",
    name: {
      en: "Kitti Chaimongkol",
      ru: "Китти Чаймонгкол",
      cheese: "Kitti Mozzarella 🍕"
    },
    title: {
      en: "Real Estate & Property Counsel",
      ru: "Консультант по недвижимости",
      cheese: "Property & Cheese Cave Inspector"
    },
    category: "property",
    experience: {
      en: "9 years",
      ru: "9 лет практики",
      cheese: "9 years of curing & storage"
    },
    specializations: {
      en: ["Condo Freehold", "Leasehold Structures", "Title Due Diligence", "Escrow Escapes"],
      ru: ["Свободное владение кондо", "Лизхолд и аренда", "Проверка документов", "Эскроу счета"],
      cheese: ["Freehold Caves", "Leasehold Nesting", "Dairy Vault Due Diligence", "Curd Escrow"]
    },
    bio: {
      en: "Focused on securing clean title deeds and protecting foreign buyers in real estate acquisitions. Kitti performs rigorous legal due diligence at the Land Department and structures watertight leasehold/freehold contracts for luxury villas and high-end condos.",
      ru: "Специализируется на защите прав иностранных покупателей недвижимости в Таиланде. Проводит комплексную проверку юридической чистоты объектов в Земельном департаменте, сопровождает сделки купли-продажи вилл и апартаментов класса люкс.",
      cheese: "Dedicated to securing clean, rodent-free land titles and protecting cheese-loving investors. Kitti performs rigorous physical and legal audits at the Royal Land Department, ensuring your cheese caves and luxury nesting properties are fully protected."
    },
    accreditation: {
      en: "Registered Thai Land Title Auditor & Arbitrator",
      ru: "Зарегистрированный аудитор сделок с землей и арбитражный юрист",
      cheese: "Grand Inspector of the Royal Land and Cave Reserves"
    },
    rating: 4.9,
    consultations: 850,
    avatarColor: "from-blue-600 to-indigo-700 text-blue-50"
  },
  {
    id: "priya",
    name: {
      en: "Priya Wongsuwan",
      ru: "Прийя Вонгсуван",
      cheese: "Priya Parmesan 🧀"
    },
    title: {
      en: "Family & Retirement Law Specialist",
      ru: "Специалист по семейным и пенсионным делам",
      cheese: "Mild Mozzarella & Golden Years Arbitrator"
    },
    category: "civil",
    experience: {
      en: "8 years",
      ru: "8 лет практики",
      cheese: "8 rounds of stretching whey"
    },
    specializations: {
      en: ["Retirement Visas", "Marriage Registration", "Wills & Estates", "Civil Disputes"],
      ru: ["Пенсионные визы", "Регистрация брака", "Наследство и завещания", "Гражданские споры"],
      cheese: ["Aged Retirement", "Marriage Blends", "Cheese Will Wills", "Milky Disputes"]
    },
    bio: {
      en: "Priya excels in family law matters, helping retirees settle seamlessly in Thailand, coordinating complex marriage procedures, and drafting watertight testaments. She provides compassionate and precise legal assistance tailored for long-term expats.",
      ru: "Специалист по пенсионному законодательству, оформлению семейных виз и брачных контрактов. Прийя помогает пенсионерам со всего мира комфортно устроиться в Таиланде, занимается составлением юридически сильных завещаний и урегулированием гражданских споров.",
      cheese: "Priya excels in gentle cheese blends, helping aged mice secure peaceful retirement caves, arranging perfect marriage recipes, and drafting secure wills. She offers compassionate, crumb-free guidance for long-term expat mice."
    },
    accreditation: {
      en: "Certified Civil Mediator & Family Law Advocate",
      ru: "Сертифицированный гражданский медиатор и семейный адвокат",
      cheese: "Certified Milk Mediator & Family Fondue Advocate"
    },
    rating: 4.7,
    consultations: 640,
    avatarColor: "from-purple-600 to-pink-700 text-purple-50"
  }
];

interface MeetExpertsProps {
  setCurrentTab: (tab: string) => void;
}

export default function MeetExperts({ setCurrentTab }: MeetExpertsProps) {
  const { lang, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [selectedExpert, setSelectedExpert] = React.useState<ExpertProfile | null>(null);

  const categories = [
    { id: "all", en: "All Specialists", ru: "Все специалисты", cheese: "All Mongers 🧀" },
    { id: "visa", en: "Visas & Immigration", ru: "Визы и иммиграция", cheese: "Swiss Passes" },
    { id: "corporate", en: "Corporate & BOI", ru: "Бизнес и BOI", cheese: "Factory Owners" },
    { id: "property", en: "Real Estate & Land", ru: "Недвижимость и земля", cheese: "Cave Inspector" },
    { id: "civil", en: "Family & Retirement", ru: "Семья и пенсия", cheese: "Aged Matures" },
  ];

  const filteredExperts = selectedCategory === "all"
    ? EXPERTS
    : EXPERTS.filter(exp => exp.category === selectedCategory);

  const handleBookExpert = (expertName: string) => {
    // Save chosen expert in localStorage to prefill/display in BookingCalendar
    localStorage.setItem("th_preferred_expert", expertName);
    setSelectedExpert(null);
    setCurrentTab("booking");
    
    // Smooth scroll to top of booking view
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getLocalizedValue = (obj: any) => {
    return obj[lang] || obj["en"];
  };

  const getCategoryLabel = (catId: string) => {
    const found = categories.find(c => c.id === catId);
    return found ? getLocalizedValue(found) : catId;
  };

  return (
    <section id="meet-experts-section" className="py-20 bg-siam-sand/60 dark:bg-stone-900/40 border-t border-b border-stone-200/50 dark:border-stone-800 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center space-x-1.5 bg-siam-teal/10 dark:bg-siam-gold/10 px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase text-siam-teal-dark dark:text-siam-gold-light border border-siam-teal/15 dark:border-siam-gold/15">
            <UserCheck className="h-3.5 w-3.5 text-siam-teal dark:text-siam-gold" />
            <span>
              {lang === "ru" ? "100% ЛЕГАЛЬНО И БЕЗОПАСНО" : lang === "cheese" ? "SUPREME CHEESE GUILD" : "EXPERT LEGAL COHORT"}
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 dark:text-stone-50 tracking-tight">
            {lang === "ru" ? "Познакомьтесь с нашими экспертами" : lang === "cheese" ? "Meet Our Dairy Guild Masters" : "Meet Our Legal Experts"}
          </h2>
          <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 max-w-2xl mx-auto">
            {lang === "ru" 
              ? "Лицензированные тайские адвокаты с совокупным стажем работы более 40 лет защищают ваши интересы, бизнес и собственность в Таиланде."
              : lang === "cheese"
                ? "Highly certified cheese judges and legal curdlists with 40 seasons of aging. We keep your cheese wheels safe from mold and hungry cats!"
                : "Licensed Thai barristers and senior legal counselors with combined decades of expertise. We guarantee watertight paperwork and total peace of mind."}
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center items-center gap-2 mb-10">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4.5 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-200 select-none ${
                  isActive
                    ? "bg-siam-teal text-white shadow-md shadow-siam-teal/10"
                    : "bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-750 border border-stone-200 dark:border-stone-750"
                }`}
              >
                {getLocalizedValue(cat)}
              </button>
            );
          })}
        </div>

        {/* Experts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredExperts.map((exp, idx) => (
              <motion.div
                layout
                key={exp.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850 rounded-3xl overflow-hidden shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all group duration-300 flex flex-col justify-between"
              >
                {/* Visual Avatar / Gradient Header */}
                <div className={`h-36 bg-gradient-to-br ${exp.avatarColor} p-5 flex flex-col justify-between relative`}>
                  {/* Decorative background circle */}
                  <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-10 bg-white rounded-full h-32 w-32" />
                  
                  {/* Rating Badge */}
                  <div className="flex justify-between items-center z-10">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-white/25 text-white backdrop-blur-xs">
                      <Star className="h-2.5 w-2.5 fill-current mr-1 text-siam-gold-light" />
                      {exp.rating}
                    </span>
                    <span className="text-[10px] font-mono text-white/80">
                      {getLocalizedValue(exp.experience)}
                    </span>
                  </div>

                  {/* Initial-based Circle Avatar */}
                  <div className="h-14 w-14 bg-white/20 border border-white/35 rounded-2xl flex items-center justify-center font-serif text-2xl font-bold text-white shadow-xs z-10 uppercase select-none">
                    {getLocalizedValue(exp.name).split(" ").map((n: string) => n[0]).join("")}
                  </div>
                </div>

                {/* Info Area */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100 leading-tight group-hover:text-siam-teal dark:group-hover:text-siam-gold-light transition-colors">
                      {getLocalizedValue(exp.name)}
                    </h3>
                    <p className="text-[11px] font-mono font-bold text-stone-450 dark:text-stone-400 uppercase tracking-wide">
                      {getLocalizedValue(exp.title)}
                    </p>
                    <p className="text-xs text-stone-600 dark:text-stone-350 line-clamp-3 leading-relaxed">
                      {getLocalizedValue(exp.bio)}
                    </p>
                  </div>

                  {/* Specializations Tags */}
                  <div className="space-y-3.5">
                    <div className="flex flex-wrap gap-1">
                      {getLocalizedValue(exp.specializations).slice(0, 2).map((spec: string, sIdx: number) => (
                        <span 
                          key={sIdx} 
                          className="px-2 py-0.5 bg-stone-100 dark:bg-stone-800 text-[10px] text-stone-500 dark:text-stone-400 font-semibold rounded-md"
                        >
                          {spec}
                        </span>
                      ))}
                      {getLocalizedValue(exp.specializations).length > 2 && (
                        <span className="px-1.5 py-0.5 bg-stone-50 dark:bg-stone-850 text-[9px] text-stone-400 rounded-md font-mono">
                          +{getLocalizedValue(exp.specializations).length - 2}
                        </span>
                      )}
                    </div>

                    <div className="border-t border-stone-100 dark:border-stone-800/80 pt-3 flex gap-2">
                      <button
                        onClick={() => setSelectedExpert(exp)}
                        className="flex-1 py-2 bg-stone-50 hover:bg-stone-100 dark:bg-stone-850 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-bold transition-all cursor-pointer text-center select-none"
                      >
                        {lang === "ru" ? "Подробнее" : lang === "cheese" ? "Squeak Bio" : "Read Bio"}
                      </button>
                      
                      <button
                        onClick={() => handleBookExpert(getLocalizedValue(exp.name))}
                        className="p-2 bg-siam-teal/10 hover:bg-siam-teal text-siam-teal hover:text-white dark:bg-siam-gold/10 dark:hover:bg-siam-gold dark:text-siam-gold-light dark:hover:text-stone-950 rounded-xl transition-all cursor-pointer"
                        title={lang === "ru" ? "Записаться на встречу" : "Book session"}
                      >
                        <ArrowRight className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Total Trust Footer */}
        <div className="mt-12 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-5.5 sm:p-6 flex flex-col sm:flex-row justify-around items-center gap-6 text-center select-none">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-emerald-500/10 text-emerald-600 rounded-xl flex items-center justify-center">
              <ShieldCheck className="h-5.5 w-5.5" />
            </div>
            <div className="text-left">
              <span className="block text-xs font-bold text-stone-800 dark:text-stone-200">
                {lang === "ru" ? "Лицензия Минюста" : lang === "cheese" ? "Royal Cheese Seal" : "Ministry Registered"}
              </span>
              <span className="block text-[10px] font-mono text-stone-400 dark:text-stone-500">
                {lang === "ru" ? "Все адвокаты состоят в тайском реестре" : lang === "cheese" ? "Pure zero-lactose legal team" : "Every barrister fully accredited"}
              </span>
            </div>
          </div>
          <div className="h-px w-full sm:h-8 sm:w-px bg-stone-200 dark:bg-stone-800" />
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-amber-500/10 text-amber-600 rounded-xl flex items-center justify-center">
              <Award className="h-5.5 w-5.5" />
            </div>
            <div className="text-left">
              <span className="block text-xs font-bold text-stone-800 dark:text-stone-200">
                {lang === "ru" ? "Гарантия надежности" : lang === "cheese" ? "No Cat Guarantee" : "Watertight Escrow"}
              </span>
              <span className="block text-[10px] font-mono text-stone-400 dark:text-stone-500">
                {lang === "ru" ? "100% защита интересов клиентов с 2012 года" : lang === "cheese" ? "Aged over 14 years since first milk" : "Client asset protection since 2012"}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Profile Details Modal Dialog */}
      <AnimatePresence>
        {selectedExpert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedExpert(null)}
              className="absolute inset-0 bg-stone-900/40 backdrop-blur-xs"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25 }}
              className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl w-full max-w-lg relative z-10 shadow-2xl overflow-hidden text-stone-900 dark:text-stone-100"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedExpert(null)}
                className="absolute top-4 right-4 p-1.5 text-white/80 hover:text-white bg-black/10 rounded-lg hover:bg-black/20 transition-all cursor-pointer z-20"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Banner Details */}
              <div className={`p-6 sm:p-8 bg-gradient-to-br ${selectedExpert.avatarColor} text-white relative`}>
                <div className="absolute right-0 bottom-0 translate-x-6 translate-y-6 opacity-10 bg-white rounded-full h-36 w-36" />
                <span className="text-[10px] font-mono font-bold tracking-wider uppercase px-2.5 py-1 bg-white/20 rounded-md inline-block mb-3 select-none">
                  {getCategoryLabel(selectedExpert.category)}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold leading-tight mb-1">
                  {getLocalizedValue(selectedExpert.name)}
                </h3>
                <p className="text-xs text-white/90 font-mono font-medium tracking-wide">
                  {getLocalizedValue(selectedExpert.title)}
                </p>
              </div>

              {/* Body Details */}
              <div className="p-6 sm:p-8 space-y-6 max-h-[400px] overflow-y-auto">
                {/* Stats row */}
                <div className="grid grid-cols-3 gap-4 text-center bg-stone-50 dark:bg-stone-850 p-4 rounded-2xl border border-stone-150 dark:border-stone-800 select-none">
                  <div className="space-y-0.5">
                    <span className="block text-[10px] font-mono text-stone-400 uppercase tracking-wide">{lang === "ru" ? "Опыт работы" : "Experience"}</span>
                    <strong className="block text-sm text-stone-850 dark:text-stone-100 font-bold">{getLocalizedValue(selectedExpert.experience)}</strong>
                  </div>
                  <div className="border-l border-stone-200 dark:border-stone-800 space-y-0.5">
                    <span className="block text-[10px] font-mono text-stone-400 uppercase tracking-wide">{lang === "ru" ? "Рейтинг" : "Rating"}</span>
                    <strong className="block text-sm text-siam-gold font-bold flex items-center justify-center">
                      <Star className="h-3.5 w-3.5 fill-current text-siam-gold mr-1" />
                      {selectedExpert.rating}
                    </strong>
                  </div>
                  <div className="border-l border-stone-200 dark:border-stone-800 space-y-0.5">
                    <span className="block text-[10px] font-mono text-stone-400 uppercase tracking-wide">{lang === "ru" ? "Успешных дел" : "Consults"}</span>
                    <strong className="block text-sm text-stone-850 dark:text-stone-100 font-bold">{selectedExpert.consultations}+</strong>
                  </div>
                </div>

                {/* Professional Bio */}
                <div className="space-y-2">
                  <h4 className="text-xs font-mono font-bold tracking-wider text-stone-400 uppercase">{lang === "ru" ? "Профессиональный профиль" : "Professional Profile"}</h4>
                  <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                    {getLocalizedValue(selectedExpert.bio)}
                  </p>
                </div>

                {/* Accreditation detail */}
                <div className="space-y-2">
                  <h4 className="text-xs font-mono font-bold tracking-wider text-stone-400 uppercase">{lang === "ru" ? "Сертификация и Лицензия" : "Accreditation & Registry"}</h4>
                  <div className="flex items-start space-x-2 bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">
                    <Award className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-xs text-stone-750 dark:text-stone-300 leading-tight">
                      {getLocalizedValue(selectedExpert.accreditation)}
                    </span>
                  </div>
                </div>

                {/* Focus areas / Specializations list */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-mono font-bold tracking-wider text-stone-400 uppercase">{lang === "ru" ? "Основные специализации" : "Key Focus Areas"}</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {getLocalizedValue(selectedExpert.specializations).map((spec: string, sIdx: number) => (
                      <span
                        key={sIdx}
                        className="px-3 py-1 bg-stone-100 dark:bg-stone-800 border border-stone-200/40 dark:border-stone-750 text-xs text-stone-700 dark:text-stone-300 rounded-lg font-medium"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-6 bg-stone-50 dark:bg-stone-850 border-t border-stone-100 dark:border-stone-800 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setSelectedExpert(null)}
                  className="w-full sm:w-1/3 py-3 bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-750 text-stone-600 dark:text-stone-300 text-xs font-bold border border-stone-200 dark:border-stone-700 rounded-xl transition-all cursor-pointer"
                >
                  {lang === "ru" ? "Закрыть" : "Close"}
                </button>
                <button
                  onClick={() => handleBookExpert(getLocalizedValue(selectedExpert.name))}
                  className="w-full sm:w-2/3 py-3 bg-siam-teal hover:bg-siam-teal-dark text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center space-x-1"
                >
                  <Calendar className="h-4 w-4" />
                  <span>
                    {lang === "ru" 
                      ? `Записаться к адвокату` 
                      : lang === "cheese" 
                        ? `Rent the Cheese Cave` 
                        : `Book Appointment`}
                  </span>
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
