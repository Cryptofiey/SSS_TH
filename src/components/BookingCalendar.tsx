import React from "react";
import { getTranslatedServices } from "../translations";
import { saveBookingToDb } from "../firebaseConfig";
import { Booking, UserProfile } from "../types";
import { Calendar as CalendarIcon, Clock, MessageSquare, Video, Landmark, User, Mail, Phone, Send, CheckCircle2, Sparkles, AlertCircle, UserCheck, X } from "lucide-react";
import { useLanguage } from "../LanguageContext";

interface BookingCalendarProps {
  preselectedServiceId: string;
  currentUser: UserProfile | null;
  onBookingSuccess: (newBooking: Booking) => void;
  onOpenLogin: () => void;
  setCurrentTab: (tab: string) => void;
}

export default function BookingCalendar({
  preselectedServiceId,
  currentUser,
  onBookingSuccess,
  onOpenLogin,
  setCurrentTab
}: BookingCalendarProps) {
  const { lang, t } = useLanguage();

  const servicesList = getTranslatedServices(lang);

  // Booking States
  const [serviceId, setServiceId] = React.useState<string>(preselectedServiceId || "dtv-visa");
  const [bookingDate, setBookingDate] = React.useState<string>("");
  const [timeSlot, setTimeSlot] = React.useState<string>("");
  const [format, setFormat] = React.useState<'video' | 'telegram' | 'office'>("video");
  const [notes, setNotes] = React.useState<string>("");

  // Guest Details (if not logged in)
  const [guestName, setGuestName] = React.useState<string>(currentUser?.name || "");
  const [guestEmail, setGuestEmail] = React.useState<string>(currentUser?.email || "");
  const [guestPhone, setGuestPhone] = React.useState<string>(currentUser?.phone || "");
  const [guestTelegram, setGuestTelegram] = React.useState<string>(currentUser?.telegram || "");

  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const [isDone, setIsDone] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string>("");
  const [createdBooking, setCreatedBooking] = React.useState<Booking | null>(null);
  const [preferredExpert, setPreferredExpert] = React.useState<string | null>(null);

  React.useEffect(() => {
    const saved = localStorage.getItem("th_preferred_expert");
    if (saved) {
      setPreferredExpert(saved);
    }
  }, []);

  React.useEffect(() => {
    if (preselectedServiceId) {
      setServiceId(preselectedServiceId);
    }
  }, [preselectedServiceId]);

  React.useEffect(() => {
    if (currentUser) {
      setGuestName(currentUser.name);
      setGuestEmail(currentUser.email);
      if (currentUser.phone) setGuestPhone(currentUser.phone);
      if (currentUser.telegram) setGuestTelegram(currentUser.telegram);
    }
  }, [currentUser]);

  // Generate next 14 days for selection
  const getBookingDates = () => {
    const dates = [];
    const today = new Date();
    const isRu = lang === "ru";
    for (let i = 1; i <= 14; i++) {
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + i);
      // Skip Sundays
      if (nextDate.getDay() !== 0) {
        dates.push({
          isoString: nextDate.toISOString().split('T')[0],
          dayName: nextDate.toLocaleDateString(isRu ? "ru-RU" : "en-US", { weekday: "short" }),
          dayNum: nextDate.getDate(),
          monthName: nextDate.toLocaleDateString(isRu ? "ru-RU" : "en-US", { month: "short" })
        });
      }
    }
    return dates;
  };

  const timeSlots = [
    "09:30 ICT (Bangkok Time)",
    "11:00 ICT (Bangkok Time)",
    "14:00 ICT (Bangkok Time)",
    "15:30 ICT (Bangkok Time)",
    "17:00 ICT (Bangkok Time)"
  ];

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!bookingDate) {
      setErrorMessage(
        lang === "ru" 
          ? "Пожалуйста, выберите дату консультации." 
          : lang === "en" 
            ? "Please select a consultation date." 
            : "Please choose a cheese-aging date! 🧀"
      );
      return;
    }
    if (!timeSlot) {
      setErrorMessage(
        lang === "ru" 
          ? "Пожалуйста, выберите удобное время." 
          : lang === "en" 
            ? "Please select a time slot." 
            : "Please pick a fermentation hour! ⏳"
      );
      return;
    }
    if (!guestName || !guestEmail || !guestPhone) {
      setErrorMessage(
        lang === "ru" 
          ? "Пожалуйста, заполните Контактные данные: Имя, Email и Телефон." 
          : lang === "en" 
            ? "Please complete contact details: Name, Email, and Phone." 
            : "Mouse identifiers missing! We need your name, email, and squeak-phone."
      );
      return;
    }

    setIsSubmitting(true);

    const targetService = servicesList.find(s => s.id === serviceId);

    const bookingPayload: Omit<Booking, 'id'> & { id?: string } = {
      userId: currentUser ? currentUser.uid : "guest_" + guestEmail,
      userName: guestName,
      userEmail: guestEmail,
      userPhone: guestPhone,
      telegramUsername: guestTelegram.replace("@", ""),
      serviceId,
      serviceTitle: targetService ? targetService.title : "Consultation",
      date: bookingDate,
      timeSlot,
      format,
      status: "pending",
      notes: preferredExpert ? `[Preferred Advisor: ${preferredExpert}] ${notes}` : notes,
      createdAt: new Date().toISOString()
    };

    try {
      const savedId = await saveBookingToDb(bookingPayload);
      const completeBooking: Booking = {
        ...bookingPayload,
        id: savedId
      } as Booking;

      // Clear preferred expert after booking is created
      localStorage.removeItem("th_preferred_expert");
      setPreferredExpert(null);

      setCreatedBooking(completeBooking);
      setIsDone(true);
      onBookingSuccess(completeBooking);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(
        lang === "ru" 
          ? "Произошла ошибка при сохранении бронирования. Пожалуйста, попробуйте снова." 
          : "An error occurred while saving your booking. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const datesToBook = getBookingDates();
  const selectedService = servicesList.find(s => s.id === serviceId);

  const getFormatLabel = (fmt: string) => {
    switch (fmt) {
      case "video":
        return lang === "ru" ? "Видео-звонок Zoom" : lang === "en" ? "Zoom / Meet Video" : "Double-Cream Zoom 📹";
      case "telegram":
        return lang === "ru" ? "Звонок в Telegram" : lang === "en" ? "Telegram Audio Call" : "Brie Bot Squeak Line 💬";
      case "office":
        return lang === "ru" ? "Встреча в офисе" : lang === "en" ? "In-Office Session" : "Fondue Headquarters 🫕";
      default:
        return fmt;
    }
  };

  if (isDone && createdBooking) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6 animate-fadeIn">
        <div className="h-20 w-20 bg-siam-teal/10 dark:bg-siam-teal/20 rounded-full flex items-center justify-center text-siam-teal dark:text-siam-gold-light mx-auto mb-4 border border-siam-teal/30 dark:border-siam-teal/50">
          <CheckCircle2 className="h-10 w-10 animate-bounce" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">
          {lang === "ru" 
            ? "Запись Успешно Подтверждена!" 
            : lang === "en" 
              ? "Booking Successfully Confirmed!" 
              : "Fondue Session Matured! 🫕"}
        </h2>
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 text-left space-y-4 shadow-sm transition-colors">
          <div className="flex justify-between border-b border-stone-100 dark:border-stone-800 pb-3 text-xs">
            <span className="text-stone-400 dark:text-stone-500">{lang === "ru" ? "Услуга:" : lang === "en" ? "Service:" : "Cheese flavor:"}</span>
            <strong className="text-stone-800 dark:text-stone-100">{createdBooking.serviceTitle}</strong>
          </div>
          <div className="flex justify-between border-b border-stone-100 dark:border-stone-800 pb-3 text-xs">
            <span className="text-stone-400 dark:text-stone-500">{lang === "ru" ? "Дата & Время:" : lang === "en" ? "Date & Time:" : "Milk Seasoning time:"}</span>
            <strong className="text-stone-800 dark:text-stone-100">{createdBooking.date} в {createdBooking.timeSlot}</strong>
          </div>
          <div className="flex justify-between border-b border-stone-100 dark:border-stone-800 pb-3 text-xs">
            <span className="text-stone-400 dark:text-stone-500">{lang === "ru" ? "Формат встречи:" : lang === "en" ? "Format:" : "Melt Profile:"}</span>
            <strong className="text-siam-teal dark:text-siam-gold-light font-semibold">
              {getFormatLabel(createdBooking.format)}
            </strong>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-stone-400 dark:text-stone-500">{lang === "ru" ? "Клиент:" : lang === "en" ? "Client:" : "Mouse Name:"}</span>
            <strong className="text-stone-800 dark:text-stone-100">{createdBooking.userName} ({createdBooking.userPhone})</strong>
          </div>
        </div>

        <p className="text-sm text-stone-500 leading-relaxed max-w-sm mx-auto">
          {lang === "ru"
            ? `Мы отправили детали записи на указанный адрес ${createdBooking.userEmail} и свяжемся с вами в Telegram за 30 минут до начала встречи.`
            : lang === "en"
              ? `We have dispatched confirmation specifics to ${createdBooking.userEmail} and will connect on Telegram 30 minutes before your slot.`
              : `Confirmation crumbs flown to ${createdBooking.userEmail}. Our cheesemongers will squeak at you in Telegram 30 minutes before melting.`}
        </p>

        <div className="pt-4 flex flex-col gap-3">
          <button
            onClick={() => {
              if (currentUser) {
                setCurrentTab("cabinet");
              } else {
                onOpenLogin();
              }
            }}
            className="w-full py-3.5 bg-siam-teal hover:bg-siam-teal-dark text-white font-medium text-sm rounded-xl transition-all shadow-md cursor-pointer"
          >
            {lang === "ru" ? "Войти в кабинет для трекинга визы" : lang === "en" ? "Access Client Portal to track status" : "Inspect Mouse Hole Vault 🧀"}
          </button>
          <button
            onClick={() => {
              setIsDone(false);
              setBookingDate("");
              setTimeSlot("");
              setNotes("");
            }}
            className="w-full py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium text-xs rounded-xl transition-colors cursor-pointer"
          >
            {lang === "ru" ? "Забронировать другую консультацию" : lang === "en" ? "Book another consultation" : "Schedule a new slice 🧀"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-14 space-y-4">
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">
          {t("booking", "title")}
        </h2>
        <p className="text-sm text-stone-600 dark:text-stone-400">
          {t("booking", "desc")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* left column - Booking Form */}
        <form onSubmit={handleBookingSubmit} className="lg:col-span-8 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs transition-colors">
          
          {preferredExpert && (
            <div className="bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-stone-900/40 dark:to-emerald-950/20 border border-teal-100 dark:border-emerald-900/30 rounded-2xl p-4 flex items-center justify-between text-xs transition-all">
              <div className="flex items-center space-x-2.5">
                <div className="h-8 w-8 bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-xl flex items-center justify-center shrink-0">
                  <UserCheck className="h-4.5 w-4.5" />
                </div>
                <div className="space-y-0.5 text-left">
                  <p className="font-semibold text-stone-850 dark:text-stone-200">
                    {lang === "ru" ? "Выбранный специалист" : lang === "cheese" ? "Assigned Guild Master" : "Requested Specialist"}
                  </p>
                  <p className="text-stone-500 dark:text-stone-400 font-medium">
                    {lang === "ru" ? `Консультация с: ${preferredExpert}` : lang === "cheese" ? `Aging session with: ${preferredExpert}` : `Session with: ${preferredExpert}`}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem("th_preferred_expert");
                  setPreferredExpert(null);
                }}
                className="p-1.5 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors cursor-pointer"
                title={lang === "ru" ? "Сбросить выбор" : "Clear selection"}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
          
          {/* Service Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-stone-500 dark:text-stone-400 flex items-center">
              <Landmark className="h-4 w-4 mr-1.5 text-siam-teal dark:text-siam-gold-light" />
              {t("booking", "service_lbl")}
            </label>
            <select
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className="w-full px-4 py-3 border border-stone-200 dark:border-stone-700 rounded-xl text-sm focus:outline-hidden focus:ring-1 focus:ring-siam-teal bg-white dark:bg-stone-800 font-medium text-stone-800 dark:text-stone-100"
              id="booking-service-select"
            >
              {servicesList.map((serv) => (
                <option key={serv.id} value={serv.id}>
                  {serv.title} — ({serv.costRange})
                </option>
              ))}
            </select>
          </div>

          {/* Date Selector */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-stone-500 dark:text-stone-400 flex items-center">
              <CalendarIcon className="h-4 w-4 mr-1.5 text-siam-teal dark:text-siam-gold-light" />
              {t("booking", "date_lbl")}
            </label>
            
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {datesToBook.map((dt) => {
                const isSelected = bookingDate === dt.isoString;
                return (
                  <button
                    type="button"
                    key={dt.isoString}
                    onClick={() => setBookingDate(dt.isoString)}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                      isSelected
                        ? "border-siam-teal dark:border-siam-gold bg-siam-teal/5 dark:bg-siam-gold/5 ring-1 ring-siam-teal dark:ring-siam-gold text-siam-teal dark:text-siam-gold-light font-semibold"
                        : "border-stone-200 dark:border-stone-850 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-300"
                    }`}
                  >
                    <span className={`text-[10px] uppercase font-mono font-medium ${isSelected ? 'text-siam-teal dark:text-siam-gold-light' : 'text-stone-400 dark:text-stone-500'}`}>{dt.dayName}</span>
                    <span className={`text-base font-bold mt-0.5 ${isSelected ? 'text-siam-teal dark:text-siam-gold-light' : 'text-stone-800 dark:text-stone-100'}`}>{dt.dayNum}</span>
                    <span className={`text-[9px] ${isSelected ? 'text-siam-teal/80 dark:text-siam-gold-light/85' : 'text-stone-500 dark:text-stone-400'}`}>{dt.monthName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Slot Picker */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-stone-500 dark:text-stone-400 flex items-center">
              <Clock className="h-4 w-4 mr-1.5 text-siam-teal dark:text-siam-gold-light" />
              {t("booking", "time_lbl")}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {timeSlots.map((slot) => {
                const isSelected = timeSlot === slot;
                return (
                  <button
                    type="button"
                    key={slot}
                    onClick={() => setTimeSlot(slot)}
                    className={`py-3.5 px-4 rounded-xl border text-xs font-medium text-left transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? "border-siam-teal dark:border-siam-gold bg-siam-teal/5 dark:bg-siam-gold/5 text-siam-teal dark:text-siam-gold-light font-semibold ring-1 ring-siam-teal dark:ring-siam-gold"
                        : "border-stone-200 dark:border-stone-850 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300"
                    }`}
                  >
                    <span>{slot}</span>
                    {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-siam-teal dark:bg-siam-gold block" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Consultation Format */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-stone-500 dark:text-stone-400">
              {lang === "ru" ? "4. Формат Консультации" : lang === "en" ? "4. Format of Consultation" : "4. Milk & Bacteria Blend Mode"}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { 
                  id: "video", 
                  label: lang === "ru" ? "Видеозвонок" : lang === "en" ? "Video Call" : "Zoom Melt 📹", 
                  desc: "Zoom / Meet", 
                  icon: Video 
                },
                { 
                  id: "telegram", 
                  label: lang === "ru" ? "Telegram звонок" : lang === "en" ? "Telegram Call" : "Squeak Line 💬", 
                  desc: lang === "ru" ? "Аудио или чат" : lang === "en" ? "Audio or Chat" : "Mallow talk", 
                  icon: MessageSquare 
                },
                { 
                  id: "office", 
                  label: lang === "ru" ? "Офис фирмы" : lang === "en" ? "Headquarters" : "Cheddar Vault 🫕", 
                  desc: "Bangkok / Phuket", 
                  icon: Landmark 
                },
              ].map((fmt) => {
                const Icon = fmt.icon;
                const isSelected = format === fmt.id;
                return (
                  <button
                    type="button"
                    key={fmt.id}
                    onClick={() => setFormat(fmt.id as any)}
                    className={`p-3 rounded-xl border flex flex-col items-center text-center space-y-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? "border-siam-teal dark:border-siam-gold bg-siam-teal/5 dark:bg-siam-gold/5 ring-1 ring-siam-teal dark:ring-siam-gold text-siam-teal dark:text-siam-gold-light font-medium"
                        : "border-stone-200 dark:border-stone-850 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <div>
                      <span className="text-xs font-semibold block">{fmt.label}</span>
                      <span className="text-[9px] text-stone-400 dark:text-stone-500 block">{fmt.desc}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-4 pt-3 border-t border-stone-100 dark:border-stone-800">
            <h4 className="text-xs font-mono font-bold tracking-wider text-stone-400 dark:text-stone-500 uppercase">
              {t("booking", "info_title")}
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-stone-600 dark:text-stone-350 flex items-center">
                  <User className="h-3.5 w-3.5 mr-1 text-stone-400 dark:text-stone-500" /> 
                  {t("auth", "name_lbl")}
                </label>
                <input
                  type="text"
                  required
                  placeholder={lang === "ru" ? "Иван Иванов" : "John Smith"}
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-stone-200 dark:border-stone-700 rounded-xl text-sm focus:outline-hidden focus:ring-1 focus:ring-siam-teal bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-450"
                  id="booking-name-input"
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-stone-600 dark:text-stone-350 flex items-center">
                  <Mail className="h-3.5 w-3.5 mr-1 text-stone-400 dark:text-stone-500" /> 
                  {t("auth", "email_lbl")}
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  className="w-full px-4 py-2.5 border border-stone-200 dark:border-stone-700 rounded-xl text-sm focus:outline-hidden focus:ring-1 focus:ring-siam-teal bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-450"
                  id="booking-email-input"
                />
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-stone-600 dark:text-stone-350 flex items-center">
                  <Phone className="h-3.5 w-3.5 mr-1 text-stone-400 dark:text-stone-500" /> 
                  {lang === "ru" ? "Номер телефона" : "Phone Number"}
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+1 (555) 123-4567"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  className="w-full px-4 py-2.5 border border-stone-200 dark:border-stone-700 rounded-xl text-sm focus:outline-hidden focus:ring-1 focus:ring-siam-teal bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-450"
                  id="booking-phone-input"
                />
              </div>

              {/* Telegram */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-stone-600 dark:text-stone-350 flex items-center">
                  <Send className="h-3.5 w-3.5 mr-1 text-stone-400 dark:text-stone-500" /> 
                  {lang === "ru" ? "Юзернейм в Telegram" : "Telegram @handle"}
                </label>
                <input
                  type="text"
                  placeholder="@handle"
                  value={guestTelegram}
                  onChange={(e) => setGuestTelegram(e.target.value)}
                  className="w-full px-4 py-2.5 border border-stone-200 dark:border-stone-700 rounded-xl text-sm focus:outline-hidden focus:ring-1 focus:ring-siam-teal bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-450"
                  id="booking-telegram-input"
                />
              </div>
            </div>
          </div>

          {/* Special notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-stone-600 dark:text-stone-350">
              {t("booking", "notes_lbl")}
            </label>
            <textarea
              rows={3}
              placeholder={t("booking", "notes_placeholder")}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2.5 border border-stone-200 dark:border-stone-700 rounded-xl text-sm focus:outline-hidden focus:ring-1 focus:ring-siam-teal bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-450"
              id="booking-notes-input"
            />
          </div>

          {/* Feedback logs */}
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-xs flex items-center space-x-2">
              <AlertCircle className="h-4.5 w-4.5 text-red-500 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form Actions */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            {!currentUser ? (
              <span className="text-[11px] text-stone-400 dark:text-stone-500">
                {t("booking", "guest_disclaimer")}
              </span>
            ) : (
              <span className="text-[11px] text-siam-teal dark:text-siam-gold-light font-medium">
                {t("booking", "logged_in_as")} <strong className="font-semibold">{currentUser.name}</strong>
              </span>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3.5 bg-siam-teal hover:bg-siam-teal-dark text-white font-medium rounded-xl text-sm shadow-md shadow-siam-teal/15 transition-all ml-auto flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-60"
              id="booking-submit-btn"
            >
              <span>{isSubmitting ? (lang === "ru" ? "Отправка..." : "Submitting...") : t("booking", "submit_btn")}</span>
              <Send className="h-4 w-4" />
            </button>
          </div>

        </form>

        {/* Right column - Sidebar info */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Selected Service Detail Info */}
          {selectedService && (
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6.5 space-y-4 shadow-xs transition-colors">
              <h4 className="text-xs font-mono font-bold tracking-wider text-siam-gold uppercase">
                {lang === "ru" ? "Выбранная услуга" : "Selected flavor"}
              </h4>
              <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">{selectedService.title}</h3>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">{selectedService.description}</p>
              
              <div className="border-t border-stone-100 dark:border-stone-800 pt-4 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-stone-400 dark:text-stone-500">{t("services", "cost")}</span>
                  <strong className="text-stone-800 dark:text-stone-100">{selectedService.costRange}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400 dark:text-stone-500">{t("services", "duration")}</span>
                  <strong className="text-stone-800 dark:text-stone-100">{selectedService.duration}</strong>
                </div>
              </div>

              {/* Mini visual list */}
              <div className="border-t border-stone-100 dark:border-stone-800 pt-4">
                <span className="text-[10px] uppercase font-mono font-semibold text-stone-400 dark:text-stone-500 block mb-2.5">
                  {lang === "ru" ? "Основные документы:" : "Core ingredients:"}
                </span>
                <ul className="space-y-1.5 text-[11px] text-stone-600 dark:text-stone-300">
                  {selectedService.checklists.slice(0, 3).map((chk, i) => (
                    <li key={i} className="flex items-center space-x-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-siam-teal dark:bg-siam-gold shrink-0" />
                      <span className="truncate">{chk}</span>
                    </li>
                  ))}
                  {selectedService.checklists.length > 3 && (
                    <li className="text-[10px] text-siam-teal dark:text-siam-gold-light font-medium italic pl-3">
                      {lang === "ru" 
                        ? `+ ещё ${selectedService.checklists.length - 3} документа(ов)` 
                        : lang === "en"
                          ? `+ ${selectedService.checklists.length - 3} more items`
                          : `+ ${selectedService.checklists.length - 3} more crumbs 🧀`}
                    </li>
                  )}
                </ul>
              </div>
            </div>
          )}

          {/* Preparation block */}
          <div className="bg-siam-teal-dark text-white rounded-3xl p-6 space-y-4">
            <div className="h-10 w-10 bg-siam-gold rounded-xl flex items-center justify-center text-siam-teal-dark">
              <Sparkles className="h-5 w-5" />
            </div>
            <h4 className="font-serif font-bold text-md text-white">
              {lang === "ru" ? "Как подготовиться?" : lang === "en" ? "How to Prepare?" : "Aging Preparations"}
            </h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              {lang === "ru"
                ? "Для эффективной консультации, пожалуйста:"
                : lang === "en"
                  ? "For a highly efficient review, please:"
                  : "To keep our mold healthy, please:"}
            </p>
            <ul className="space-y-2 text-xs text-stone-300 pl-1">
              <li className="flex items-start space-x-2">
                <span className="text-siam-gold mt-0.5">•</span>
                <span>
                  {lang === "ru" 
                    ? "Имейте при себе цифровые копии страниц паспорта." 
                    : lang === "en" 
                      ? "Have digital copies of your passport pages ready." 
                      : "Have screenshots of your mouse ears & holes ready."}
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-siam-gold mt-0.5">•</span>
                <span>
                  {lang === "ru" 
                    ? "Подготовьте выписку из банка (если требуется для визы)." 
                    : lang === "en" 
                      ? "Prepare a fresh bank statement (if needed)." 
                      : "Prepare your cheese ledger with 500k savings."}
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-siam-gold mt-0.5">•</span>
                <span>
                  {lang === "ru" 
                    ? "Сформулируйте точные даты вашего планируемого прибытия." 
                    : lang === "en" 
                      ? "Outline your estimated dates of arrival in Thailand." 
                      : "Decide when your wheel rolling commences."}
                </span>
              </li>
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
}
