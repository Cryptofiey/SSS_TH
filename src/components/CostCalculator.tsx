import React from "react";
import { Info, Calculator, ArrowRight } from "lucide-react";
import { useLanguage } from "../LanguageContext";

interface CostCalculatorProps {
  onGoToBooking: () => void;
}

export default function CostCalculator({ onGoToBooking }: CostCalculatorProps) {
  const { lang, t } = useLanguage();

  // Calculator States
  const [visaType, setVisaType] = React.useState<string>("dtv");
  const [city, setCity] = React.useState<string>("bangkok");
  const [housingType, setHousingType] = React.useState<string>("condo_medium");
  const [hasInsurance, setHasInsurance] = React.useState<boolean>(true);
  const [coworking, setCoworking] = React.useState<boolean>(false);
  const [scooterRental, setScooterRental] = React.useState<boolean>(true);
  const [mealsFormat, setMealsFormat] = React.useState<string>("mix");

  // Visa costs map (one-time or initial support setup)
  const getVisaCosts = () => {
    if (lang === "cheese") {
      return {
        dtv: { title: "Swiss Hole-Pass Support", initialFee: 30000, label: "Swiss DTV (Nomad)" },
        retirement: { title: "Parmesan Seasoning Support", initialFee: 18000, label: "Aged Parmesan (50+)" },
        elite: { title: "Royal Cream VIP Membership", initialFee: 900000, label: "Double-Gloucester Privilege" },
        tourist: { title: "Melt Extension & Local Squeaks", initialFee: 4500, label: "Temporary Cheese Stamp" },
      };
    }
    if (lang === "en") {
      return {
        dtv: { title: "DTV Visa Setup Support", initialFee: 30000, label: "Destination Thailand Visa (DTV)" },
        retirement: { title: "Retirement Visa Setup", initialFee: 18000, label: "Retirement Visa (50+)" },
        elite: { title: "Privilege Elite 5-Year Membership", initialFee: 900000, label: "Elite Privilege Visa" },
        tourist: { title: "Tourist Extension Services", initialFee: 4500, label: "Residence Cert. & Extension" },
      };
    }
    return {
      dtv: { title: "DTV Visa Setup Support", initialFee: 30000, label: "5-летняя виза + сопровождение" },
      retirement: { title: "Retirement 1-Year Setup", initialFee: 18000, label: "1-летняя пенсионная виза" },
      elite: { title: "Elite Privileges 5-Year Initial", initialFee: 900000, label: "Премиальная виза на 5 лет" },
      tourist: { title: "Tourist Extension Services", initialFee: 4500, label: "Оформление Residence Certificate" },
    };
  };

  const visaCosts = getVisaCosts();

  // Monthly costs database based on selected options (in THB)
  const housingCosts: Record<string, number> = {
    studio_budget: 8000, 
    condo_medium: 16000, 
    luxury_condo: 35000, 
  };

  const foodCosts: Record<string, number> = {
    local: 7000, 
    mix: 14000,  
    expat: 22000, 
  };

  const visaOneTime = visaCosts[visaType as keyof typeof visaCosts]?.initialFee || 0;
  const housingMonthly = housingCosts[housingType] || 0;
  const foodMonthly = foodCosts[mealsFormat] || 0;
  const insuranceMonthly = hasInsurance ? 2500 : 0;
  const transportMonthly = scooterRental ? 3500 : 1500; 
  const workingMonthly = coworking ? 5000 : 0;

  const totalMonthlyCost = housingMonthly + foodMonthly + insuranceMonthly + transportMonthly + workingMonthly;
  const firstMonthRequired = visaOneTime + totalMonthlyCost + (housingMonthly * 2); 

  // Conversion rates (approximate for 2026)
  const thbToUsd = 0.028;
  const thbToRub = 2.6;

  const getCurrencySuffix = () => {
    if (lang === "cheese") return " crumbs 🧀";
    return " THB";
  };

  const formatCurrency = (thb: number) => {
    const formattedThb = thb.toLocaleString(lang === "ru" ? "ru-RU" : "en-US") + getCurrencySuffix();
    const usdVal = "$" + Math.round(thb * thbToUsd).toLocaleString("en-US");
    const rubVal = Math.round(thb * thbToRub).toLocaleString("ru-RU") + " ₽";
    return { thb: formattedThb, usd: usdVal, rub: rubVal };
  };

  return (
    <div className="py-16 bg-stone-50 border-y border-stone-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center space-x-2 bg-siam-gold/10 text-siam-gold px-4 py-1.5 rounded-full text-xs font-mono font-semibold uppercase tracking-wider">
            <Calculator className="h-4 w-4 mr-1" />
            <span>{t("calculator", "title")}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
            {lang === "ru" 
              ? "Рассчитайте Бюджет Переезда в Таиланд" 
              : lang === "en" 
                ? "Calculate Your Relocation Budget" 
                : "Estimate Your Cheddar Ripening Costs 🧀"}
          </h2>
          <p className="text-sm text-stone-600">
            {t("calculator", "desc")}
          </p>
        </div>

        {/* Calculator Main Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Controls Box */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-7 shadow-xs">
            
            {/* Visa setup */}
            <div className="space-y-3">
              <label className="text-xs font-mono font-bold tracking-wider text-stone-400 uppercase block">
                {lang === "ru" ? "1. Визовая Программа" : lang === "en" ? "1. Visa Program" : "1. Cheese-Pass Blend 🧀"}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => setVisaType("dtv")}
                  className={`p-4 text-left rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                    visaType === "dtv"
                      ? "border-siam-teal bg-siam-teal/5 ring-1 ring-siam-teal"
                      : "border-stone-200 hover:border-stone-300"
                  }`}
                >
                  <strong className="block text-stone-800 text-sm">DTV (Nomad)</strong>
                  <span className="text-stone-500 block mt-1">
                    {lang === "ru" ? "5-летняя виза цифрового кочевника" : lang === "en" ? "5-year digital nomad visa" : "5-year Swiss Cheese pass for remote curders"}
                  </span>
                  <span className="text-siam-teal font-semibold block mt-1">{formatCurrency(30000).thb}</span>
                </button>
                
                <button
                  onClick={() => setVisaType("retirement")}
                  className={`p-4 text-left rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                    visaType === "retirement"
                      ? "border-siam-teal bg-siam-teal/5 ring-1 ring-siam-teal"
                      : "border-stone-200 hover:border-stone-300"
                  }`}
                >
                  <strong className="block text-stone-800 text-sm">
                    {lang === "ru" ? "Пенсионная" : lang === "en" ? "Retirement" : "Aged Parmesan"}
                  </strong>
                  <span className="text-stone-500 block mt-1">
                    {lang === "ru" ? "1-летняя виза для лиц 50+ лет" : lang === "en" ? "1-year visa for ages 50+" : "1-year passive aging for mature wheels"}
                  </span>
                  <span className="text-siam-teal font-semibold block mt-1">{formatCurrency(18000).thb}</span>
                </button>

                <button
                  onClick={() => setVisaType("elite")}
                  className={`p-4 text-left rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                    visaType === "elite"
                      ? "border-siam-teal bg-siam-teal/5 ring-1 ring-siam-teal"
                      : "border-stone-200 hover:border-stone-300"
                  }`}
                >
                  <strong className="block text-stone-800 text-sm">Privilege (Elite)</strong>
                  <span className="text-stone-500 block mt-1">
                    {lang === "ru" ? "Премиум членство на 5-20 лет" : lang === "en" ? "Premium membership 5-20 years" : "Royal Double-Gloucester VIP card 5-20 years"}
                  </span>
                  <span className="text-siam-teal font-semibold block mt-1">{formatCurrency(900000).thb}</span>
                </button>

                <button
                  onClick={() => setVisaType("tourist")}
                  className={`p-4 text-left rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                    visaType === "tourist"
                      ? "border-siam-teal bg-siam-teal/5 ring-1 ring-siam-teal"
                      : "border-stone-200 hover:border-stone-300"
                  }`}
                >
                  <strong className="block text-stone-800 text-sm">
                    {lang === "ru" ? "Без визы / Штамп" : lang === "en" ? "Visa-Exempt Stamp" : "No-Pass / Squeak Stamp"}
                  </strong>
                  <span className="text-stone-500 block mt-1">
                    {lang === "ru" ? "Residence Cert. + выезды" : lang === "en" ? "Residence Certificate & fast runs" : "Residence Certificate & mouse trap runs"}
                  </span>
                  <span className="text-siam-teal font-semibold block mt-1">{formatCurrency(4500).thb}</span>
                </button>
              </div>
            </div>

            {/* City Selection */}
            <div className="space-y-3">
              <label className="text-xs font-mono font-bold tracking-wider text-stone-400 uppercase block">
                {lang === "ru" ? "2. Локация в Таиланде" : lang === "en" ? "2. Location in Thailand" : "2. Fermentation Spot 📍"}
              </label>
              <div className="grid grid-cols-3 gap-3">
                {["bangkok", "phuket", "chiang_mai"].map((c) => (
                  <button
                    key={c}
                    onClick={() => setCity(c)}
                    className={`py-3 text-center rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      city === c
                        ? "border-siam-teal bg-siam-teal/5 text-siam-teal"
                        : "border-stone-200 text-stone-600 hover:bg-stone-50"
                    }`}
                  >
                    {c === "bangkok" 
                      ? (lang === "cheese" ? "Brie Town 🏙" : lang === "en" ? "Bangkok 🏙" : "Бангкок 🏙") 
                      : c === "phuket" 
                        ? (lang === "cheese" ? "Lactose Shore 🌴" : lang === "en" ? "Phuket 🌴" : "Пхукет 🌴") 
                        : (lang === "cheese" ? "Gouda Peaks ⛰" : lang === "en" ? "Chiang Mai ⛰" : "Чиангмай ⛰")}
                  </button>
                ))}
              </div>
            </div>

            {/* Housing Type */}
            <div className="space-y-3">
              <label className="text-xs font-mono font-bold tracking-wider text-stone-400 uppercase block">
                {lang === "ru" ? "3. Тип Аренды Жилья" : lang === "en" ? "3. Rental Property Selection" : "3. Mouse Hole Sizing 🐭"}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => setHousingType("studio_budget")}
                  className={`p-3 text-left rounded-xl border transition-all cursor-pointer ${
                    housingType === "studio_budget" ? "border-siam-teal bg-siam-teal/5 ring-1 ring-siam-teal" : "border-stone-200"
                  }`}
                >
                  <strong className="text-xs text-stone-800 block">
                    {lang === "ru" ? "Бюджетная студия" : lang === "en" ? "Budget Studio" : "Shoebox Hole 🕳"}
                  </strong>
                  <span className="text-[10px] text-stone-400">
                    {lang === "ru" ? "Периферия / Тайский стиль" : lang === "en" ? "Periphery / Local style" : "Cozy perimeter nest"}
                  </span>
                  <span className="text-xs font-semibold block text-stone-700 mt-1">{formatCurrency(8000).thb} / {lang === "ru" ? "мес" : lang === "en" ? "mo" : "bite"}</span>
                </button>
                
                <button
                  onClick={() => setHousingType("condo_medium")}
                  className={`p-3 text-left rounded-xl border transition-all cursor-pointer ${
                    housingType === "condo_medium" ? "border-siam-teal bg-siam-teal/5 ring-1 ring-siam-teal" : "border-stone-200"
                  }`}
                >
                  <strong className="text-xs text-stone-800 block">
                    {lang === "ru" ? "Modern Кондо" : lang === "en" ? "Modern Condo" : "Cheddar Loft"}
                  </strong>
                  <span className="text-[10px] text-stone-400">
                    {lang === "ru" ? "1 спальня у метро / у моря" : lang === "en" ? "1-bedroom near BTS / sea" : "Comfortable storage shelf"}
                  </span>
                  <span className="text-xs font-semibold block text-stone-700 mt-1">{formatCurrency(16000).thb} / {lang === "ru" ? "мес" : lang === "en" ? "mo" : "bite"}</span>
                </button>
                
                <button
                  onClick={() => setHousingType("luxury_condo")}
                  className={`p-3 text-left rounded-xl border transition-all cursor-pointer ${
                    housingType === "luxury_condo" ? "border-siam-teal bg-siam-teal/5 ring-1 ring-siam-teal" : "border-stone-200"
                  }`}
                >
                  <strong className="text-xs text-stone-800 block">
                    {lang === "ru" ? "Премиум Вилла / Апт" : lang === "en" ? "Premium Villa / Suite" : "Royal Blue Mold Suite 🏰"}
                  </strong>
                  <span className="text-[10px] text-stone-400">
                    {lang === "ru" ? "Бассейн, спортзал, люкс класс" : lang === "en" ? "Private pool, gym, high luxury" : "Palace fridge with direct guards"}
                  </span>
                  <span className="text-xs font-semibold block text-stone-700 mt-1">{formatCurrency(35000).thb} / {lang === "ru" ? "мес" : lang === "en" ? "mo" : "bite"}</span>
                </button>
              </div>
            </div>

            {/* Food Style */}
            <div className="space-y-3">
              <label className="text-xs font-mono font-bold tracking-wider text-stone-400 uppercase block">
                {lang === "ru" ? "4. Питание & Рестораны" : lang === "en" ? "4. Dining & Groceries" : "4. Butter & Starter Culture Feeding 🥖"}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => setMealsFormat("local")}
                  className={`p-3 text-left rounded-xl border transition-all cursor-pointer ${
                    mealsFormat === "local" ? "border-siam-teal bg-siam-teal/5 ring-1 ring-siam-teal" : "border-stone-200"
                  }`}
                >
                  <strong className="text-xs text-stone-800 block">
                    {lang === "ru" ? "Локальная кухня" : lang === "en" ? "Local streetfood" : "Street Curds"}
                  </strong>
                  <span className="text-[10px] text-stone-400">
                    {lang === "ru" ? "Рынки и тайские кафе" : lang === "en" ? "Local food stalls & fresh markets" : "Basic milk vats & crumbs"}
                  </span>
                  <span className="text-xs font-semibold block text-stone-700 mt-1">{formatCurrency(7000).thb} / {lang === "ru" ? "мес" : lang === "en" ? "mo" : "bite"}</span>
                </button>

                <button
                  onClick={() => setMealsFormat("mix")}
                  className={`p-3 text-left rounded-xl border transition-all cursor-pointer ${
                    mealsFormat === "mix" ? "border-siam-teal bg-siam-teal/5 ring-1 ring-siam-teal" : "border-stone-200"
                  }`}
                >
                  <strong className="text-xs text-stone-800 block">
                    {lang === "ru" ? "Микс (Европейское + Тай)" : lang === "en" ? "Mix of Local & Western" : "Fondues & Mac"}
                  </strong>
                  <span className="text-[10px] text-stone-400">
                    {lang === "ru" ? "Кофейни, доставка, рестораны" : lang === "en" ? "Trendy cafes, deliveries, dine-outs" : "Grated Cheddar on hot pasta"}
                  </span>
                  <span className="text-xs font-semibold block text-stone-700 mt-1">{formatCurrency(14000).thb} / {lang === "ru" ? "мес" : lang === "en" ? "mo" : "bite"}</span>
                </button>

                <button
                  onClick={() => setMealsFormat("expat")}
                  className={`p-3 text-left rounded-xl border transition-all cursor-pointer ${
                    mealsFormat === "expat" ? "border-siam-teal bg-siam-teal/5 ring-1 ring-siam-teal" : "border-stone-200"
                  }`}
                >
                  <strong className="text-xs text-stone-800 block">
                    {lang === "ru" ? "Импортные продукты" : lang === "en" ? "Imported western food" : "Blue Mold Connoisseur"}
                  </strong>
                  <span className="text-[10px] text-stone-400">
                    {lang === "ru" ? "Западная еда, бары, супермаркеты" : lang === "en" ? "European specialty shops & pubs" : "Imported Roquefort & fine yeast"}
                  </span>
                  <span className="text-xs font-semibold block text-stone-700 mt-1">{formatCurrency(22000).thb} / {lang === "ru" ? "мес" : lang === "en" ? "mo" : "bite"}</span>
                </button>
              </div>
            </div>

            {/* Supplementary Options Toggle Switch */}
            <div className="space-y-3.5 pt-2">
              <label className="text-xs font-mono font-bold tracking-wider text-stone-400 uppercase block">
                {lang === "ru" ? "5. Дополнительные Услуги" : lang === "en" ? "5. Supplemental Selections" : "5. Cheese Board Extras 🍕"}
              </label>
              
              <div className="space-y-3">
                {/* Insurance Toggle */}
                <div className="flex items-center justify-between p-4.5 bg-stone-50 hover:bg-stone-100/70 border border-stone-200/60 rounded-xl transition-colors">
                  <div>
                    <span className="text-sm font-semibold text-stone-800 block">
                      {lang === "ru" ? "Медицинская страховка" : lang === "en" ? "Medical Insurance" : "Anti-Cat Claws Coverage 🛡️"}
                    </span>
                    <span className="text-xs text-stone-500">
                      {lang === "ru" 
                        ? "Покрытие госпиталей, страховка от несчастных случаев" 
                        : lang === "en" 
                          ? "Full hospital coverage and premium accident shield" 
                          : "Full yeast bacterial protection & allergy support"}
                    </span>
                  </div>
                  <button
                    onClick={() => setHasInsurance(!hasInsurance)}
                    className={`h-6.5 w-12 rounded-full p-1 transition-all cursor-pointer ${hasInsurance ? "bg-siam-teal flex justify-end" : "bg-stone-300 flex justify-start"}`}
                  >
                    <span className="h-4.5 w-4.5 rounded-full bg-white block" />
                  </button>
                </div>

                {/* Scooter Toggle */}
                <div className="flex items-center justify-between p-4.5 bg-stone-50 hover:bg-stone-100/70 border border-stone-200/60 rounded-xl transition-colors">
                  <div>
                    <span className="text-sm font-semibold text-stone-800 block">
                      {lang === "ru" ? "Аренда байка (Scooter) & Топливо" : lang === "en" ? "Scooter Rental & Petrol" : "Cheese Wheel Express Scooter 🛵"}
                    </span>
                    <span className="text-xs text-stone-500">
                      {lang === "ru" 
                        ? "Honda PCX/Click + шлем и бензин (иначе MRT/BTS метро)" 
                        : lang === "en" 
                          ? "Honda PCX/Click scooter + helmet & fuel (otherwise subway)" 
                          : "High-speed wheel delivery vessel"}
                    </span>
                  </div>
                  <button
                    onClick={() => setScooterRental(!scooterRental)}
                    className={`h-6.5 w-12 rounded-full p-1 transition-all cursor-pointer ${scooterRental ? "bg-siam-teal flex justify-end" : "bg-stone-300 flex justify-start"}`}
                  >
                    <span className="h-4.5 w-4.5 rounded-full bg-white block" />
                  </button>
                </div>

                {/* Co-working Toggle */}
                <div className="flex items-center justify-between p-4.5 bg-stone-50 hover:bg-stone-100/70 border border-stone-200/60 rounded-xl transition-colors">
                  <div>
                    <span className="text-sm font-semibold text-stone-800 block">
                      {lang === "ru" ? "Безлимитный абонемент в Коворкинг" : lang === "en" ? "Unlimited Co-working Pass" : "Mice Social Chamber 🐭"}
                    </span>
                    <span className="text-xs text-stone-500">
                      {lang === "ru" 
                        ? "Доступ 24/7 в True Digital Park или Phuket Innovation Lab" 
                        : lang === "en" 
                          ? "24/7 access to Bangkok Digital Parks or Phuket beach labs" 
                          : "24/7 access to cheese tasting hubs & high-speed Wi-Fi"}
                    </span>
                  </div>
                  <button
                    onClick={() => setCoworking(!coworking)}
                    className={`h-6.5 w-12 rounded-full p-1 transition-all cursor-pointer ${coworking ? "bg-siam-teal flex justify-end" : "bg-stone-300 flex justify-start"}`}
                  >
                    <span className="h-4.5 w-4.5 rounded-full bg-white block" />
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* Results Summary Box */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            
            <div className="bg-siam-teal-dark border border-teal-950 rounded-3xl p-6 sm:p-8 text-white space-y-6 shadow-2xl relative overflow-hidden">
              {/* Golden corner seal decoration */}
              <div className="absolute top-0 right-0 h-28 w-28 bg-siam-gold/15 rounded-full translate-x-10 -translate-y-10 blur-xl" />
              
              <div className="flex items-center space-x-3.5 pb-4 border-b border-teal-900">
                <div className="h-10 w-10 bg-siam-gold rounded-xl flex items-center justify-center text-siam-teal-dark font-serif font-bold text-lg">
                  {lang === "cheese" ? "🧀" : "฿"}
                </div>
                <div>
                  <h3 className="font-serif font-semibold text-lg">
                    {lang === "ru" ? "Ваш Бюджетный Отчет" : lang === "en" ? "Your Relocation Report" : "Your Ripening Ledger 📜"}
                  </h3>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-siam-gold-light">
                    {lang === "cheese" ? "SIAM CHEDDAR SPECIAL 2026" : "Kingdom of Thailand 2026"}
                  </span>
                </div>
              </div>

              {/* Monthly breakdown */}
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-stone-300">
                    {lang === "ru" ? "Жилье" : lang === "en" ? "Housing Rental" : "Nest Cave"} ({
                      city === "bangkok" 
                        ? (lang === "cheese" ? "Brie" : lang === "en" ? "Bangkok" : "Бангкок") 
                        : city === "phuket" 
                          ? (lang === "cheese" ? "Phuket" : lang === "en" ? "Phuket" : "Пхукет") 
                          : (lang === "cheese" ? "Chiang Mai" : lang === "en" ? "Chiang Mai" : "Чиангмай")
                    })
                  </span>
                  <span className="font-semibold">{formatCurrency(housingMonthly).thb}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-stone-300">{lang === "ru" ? "Питание & Кафе" : lang === "en" ? "Dining & Cafes" : "Cheese Slices & Fondues"}</span>
                  <span className="font-semibold">{formatCurrency(foodMonthly).thb}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-stone-300">{lang === "ru" ? "Медицинская страховка" : lang === "en" ? "Medical Insurance" : "Anti-Cat Health Shield"}</span>
                  <span className="font-semibold">{formatCurrency(insuranceMonthly).thb}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-stone-300">{lang === "ru" ? "Транспорт и логистика" : lang === "en" ? "Transport & Subway" : "Cheese Wheel Rollers"}</span>
                  <span className="font-semibold">{formatCurrency(transportMonthly).thb}</span>
                </div>
                {coworking && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-stone-300">{lang === "ru" ? "Коворкинг" : lang === "en" ? "Coworking Space" : "Mouse Social Chamber"}</span>
                    <span className="font-semibold">{formatCurrency(workingMonthly).thb}</span>
                  </div>
                )}
                
                <div className="pt-4 border-t border-teal-900 flex justify-between items-end">
                  <div>
                    <span className="text-xs text-siam-gold-light uppercase font-mono tracking-wider font-semibold block">
                      {lang === "ru" ? "Ежемесячно" : lang === "en" ? "Monthly Total" : "Bite Total (Monthly)"}
                    </span>
                    <strong className="font-serif text-2xl sm:text-3xl text-white font-bold block">{formatCurrency(totalMonthlyCost).thb}</strong>
                  </div>
                  <div className="text-right text-xs text-stone-300">
                    <span className="block font-medium">{formatCurrency(totalMonthlyCost).usd}</span>
                    <span className="block font-medium">{formatCurrency(totalMonthlyCost).rub}</span>
                  </div>
                </div>
              </div>

              {/* Initial Startup Budget */}
              <div className="bg-teal-950/80 border border-teal-900 rounded-2xl p-5 space-y-3.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-stone-400">
                    {lang === "ru" ? "Стоимость визы" : lang === "en" ? "Visa support fee" : "Cheese-Pass cost"}:
                  </span>
                  <span className="text-stone-200 font-semibold">{formatCurrency(visaOneTime).thb}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-stone-400">
                    {lang === "ru" ? "Депозит аренды (2 мес.)" : lang === "en" ? "Security deposit (2 mo.)" : "Security crust (2 bites)"}:
                  </span>
                  <span className="text-stone-200 font-semibold">{formatCurrency(housingMonthly * 2).thb}</span>
                </div>
                
                <div className="pt-3 border-t border-teal-900 flex justify-between items-end">
                  <div>
                    <span className="text-[10px] text-siam-gold uppercase font-mono tracking-wider font-semibold block">
                      {lang === "ru" ? "Стартовый бюджет (1-й месяц)" : lang === "en" ? "First Month Required" : "First Month Starters (Cream + Yeast)"}
                    </span>
                    <strong className="font-serif text-xl sm:text-2xl text-siam-gold-light font-bold block">{formatCurrency(firstMonthRequired).thb}</strong>
                  </div>
                  <div className="text-right text-xs text-stone-400">
                    <span className="block font-medium">{formatCurrency(firstMonthRequired).usd}</span>
                    <span className="block font-medium">{formatCurrency(firstMonthRequired).rub}</span>
                  </div>
                </div>
              </div>

              {/* Call to action inside sidebar */}
              <button
                onClick={onGoToBooking}
                className="w-full py-4 bg-siam-gold hover:bg-siam-gold/90 text-siam-teal-dark font-semibold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center justify-center space-x-2"
              >
                <span>
                  {lang === "ru" 
                    ? "Оформить визу & Забронировать жилье" 
                    : lang === "en" 
                      ? "Acquire Visa & Secure Housing" 
                      : "Squeak for Visa & Start Aging 🧀"}
                </span>
                <ArrowRight className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Note block */}
            <div className="bg-white rounded-2xl border border-stone-200/60 p-5 flex items-start space-x-3 text-xs text-stone-500 leading-relaxed">
              <Info className="h-5 w-5 text-siam-gold shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-800 block mb-0.5">
                  {lang === "ru" ? "Информация о расчётах" : lang === "en" ? "Budget Notes" : "Science of Cheese Ripeness"}
                </strong>
                <span>
                  {lang === "ru"
                    ? "Бюджет основан на средних затратах экспатов в Таиланде за 2026 год. В Бангкоке и Пхукете расходы на аренду современных кондоминиумов у пляжа или станций BTS Skytrain выше, чем в северной части страны (Чиангмай). Запись на консультацию поможет подобрать точное жилье под ваши цели."
                    : lang === "en"
                      ? "Budget estimates are derived from median expat expenditures in Thailand in 2026. Properties near central Bangkok transit stations or beachfronts in Phuket carry higher rates than northern Thailand (Chiang Mai). A consultation will align these figures with your goals."
                      : "These numbers represent standard curd consumption across Siamese pantry cellars in 2026. Central Brie Town transit platforms or Phuket shoreline crates take more crumbs than the northern mountain ranges of Chiang Mai. Consulting our grand cheesemongers stabilizes your milk fat ratios."}
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
