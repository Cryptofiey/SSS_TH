import React from "react";
import { motion, AnimatePresence } from "motion/react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Services from "./components/Services";
import ImmigrationNews from "./components/ImmigrationNews";
import MeetExperts from "./components/MeetExperts";
import CostCalculator from "./components/CostCalculator";
import BookingCalendar from "./components/BookingCalendar";
import BotSimulator from "./components/BotSimulator";
import UserCabinet from "./components/UserCabinet";
import { UserProfile, Booking, Notification } from "./types";
import { getProfileFromDb, isFirebaseAvailable, getNotificationsFromDb, saveNotificationToDb, markNotificationAsReadInDb, markAllNotificationsAsReadInDb, saveProfileToDb } from "./firebaseConfig";
import { Landmark, Compass, Calendar, MessageSquare, ShieldCheck, Mail, LogIn, Lock, HelpCircle, X, Check } from "lucide-react";
import { FAQS } from "./data";

export default function App() {
  const [currentTab, setCurrentTab] = React.useState<string>("landing");
  const [currentUser, setCurrentUser] = React.useState<UserProfile | null>(null);
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [showLoginModal, setShowLoginModal] = React.useState<boolean>(false);
  const [preselectedServiceId, setPreselectedServiceId] = React.useState<string>("dtv-visa");

  // Notifications states & handlers
  const [notifications, setNotifications] = React.useState<Notification[]>([]);

  const fetchNotifications = React.useCallback(async (uid: string) => {
    const data = await getNotificationsFromDb(uid);
    setNotifications(data);
  }, []);

  const addNotification = React.useCallback(async (title: string, message: string, type: 'info' | 'success' | 'warning' | 'alert', bookingId?: string) => {
    const userId = currentUser ? currentUser.uid : "guest_session";
    const newNotif = {
      userId,
      title,
      message,
      type,
      read: false,
      createdAt: new Date().toISOString(),
      bookingId
    };
    await saveNotificationToDb(newNotif);
    await fetchNotifications(userId);
  }, [currentUser, fetchNotifications]);

  const handleMarkNotificationRead = async (id: string) => {
    await markNotificationAsReadInDb(id);
    const userId = currentUser ? currentUser.uid : "guest_session";
    await fetchNotifications(userId);
  };

  const handleMarkAllNotificationsRead = async () => {
    const userId = currentUser ? currentUser.uid : "guest_session";
    await markAllNotificationsAsReadInDb(userId);
    await fetchNotifications(userId);
  };

  // Sync notifications on user change or mount
  React.useEffect(() => {
    const userId = currentUser ? currentUser.uid : "guest_session";
    fetchNotifications(userId);
  }, [currentUser, fetchNotifications]);

  // Auth Modal states
  const [authEmail, setAuthEmail] = React.useState<string>("");
  const [authPass, setAuthPass] = React.useState<string>("");
  const [authName, setAuthName] = React.useState<string>("");
  const [isRegisterMode, setIsRegisterMode] = React.useState<boolean>(false);
  const [modalError, setModalError] = React.useState<string>("");

  // Auto load logged-in user from localStorage on start
  React.useEffect(() => {
    const cachedUid = localStorage.getItem("th_current_uid");
    if (cachedUid) {
      const loadProfile = async () => {
        const p = await getProfileFromDb(cachedUid);
        if (p) {
          setCurrentUser(p);
        }
      };
      loadProfile();
    }
  }, []);

  // Capture referral code from URL if present
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const refCode = params.get("ref");
    if (refCode) {
      localStorage.setItem("th_referral_code", refCode);
      console.log("Captured referral code:", refCode);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("th_current_uid");
    setCurrentUser(null);
    setBookings([]);
    setCurrentTab("landing");
  };

  const handleSelectServiceFromLanding = (serviceId: string) => {
    setPreselectedServiceId(serviceId);
    setCurrentTab("booking");
  };

  const handleBookingCreatedSuccess = (newBooking: Booking) => {
    setBookings((prev) => [newBooking, ...prev]);
    addNotification(
      "Консультация забронирована ⏳",
      `Вы успешно записались на консультацию "${newBooking.serviceTitle}" на ${newBooking.date} в ${newBooking.timeSlot}. Ожидайте подтверждения юриста.`,
      "info",
      newBooking.id
    );
  };

  const handleModalAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError("");

    if (!authEmail || !authPass) {
      setModalError("Заполните Email и Пароль.");
      return;
    }

    try {
      const uid = "u_" + Math.random().toString(36).substr(2, 9);
      const nameVal = isRegisterMode ? authName : authEmail.split("@")[0].toUpperCase();
      const refCode = isRegisterMode ? localStorage.getItem("th_referral_code") || undefined : undefined;

      const p: UserProfile = {
        uid,
        email: authEmail,
        name: nameVal,
        currentVisa: "Destination Thailand Visa (DTV)",
        ...(refCode && { referredBy: refCode })
      };

      // Persist to DB fallback
      await saveProfileToDb(p);
      localStorage.setItem("th_current_uid", uid);

      if (refCode) {
        localStorage.removeItem("th_referral_code");
      }
      
      setCurrentUser(p);
      setShowLoginModal(false);
      setCurrentTab("cabinet");

      // Reset modal fields
      setAuthEmail("");
      setAuthPass("");
      setAuthName("");
    } catch (err) {
      setModalError("Ошибка авторизации. Попробуйте снова.");
    }
  };

  // Switch sections smoothly with AnimatePresence
  const renderTabContent = () => {
    switch (currentTab) {
      case "landing":
        return (
          <motion.div
            key="landing-page"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <Hero setCurrentTab={setCurrentTab} />
            <Services onSelectService={handleSelectServiceFromLanding} />
            <ImmigrationNews />
            <MeetExperts setCurrentTab={setCurrentTab} />
            
            {/* FAQ Section integrated in landing */}
            <div className="py-16 bg-white dark:bg-stone-900 border-t border-stone-100 dark:border-stone-800 transition-colors">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                <div className="text-center space-y-3">
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">Полезные Знания и FAQ</h3>
                  <p className="text-xs text-stone-500 dark:text-stone-450">Отвечаем на популярные вопросы экспатов об иммиграционном законодательстве Таиланда в 2026 году</p>
                </div>

                <div className="space-y-5">
                  {FAQS.map((faq, idx) => (
                    <div key={idx} className="bg-siam-sand dark:bg-stone-800/40 border border-stone-200/55 dark:border-stone-800 rounded-2xl p-5.5 space-y-2 transition-colors">
                      <h4 className="font-serif text-sm sm:text-base font-bold text-siam-teal-dark dark:text-siam-gold-light flex items-start space-x-2">
                        <HelpCircle className="h-4.5 w-4.5 text-siam-gold shrink-0 mt-0.5" />
                        <span>{faq.question}</span>
                      </h4>
                      <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed pl-6.5">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        );

      case "calculator":
        return (
          <motion.div
            key="calculator-page"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            <CostCalculator onGoToBooking={() => setCurrentTab("booking")} />
          </motion.div>
        );

      case "booking":
        return (
          <motion.div
            key="booking-page"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            <BookingCalendar
              preselectedServiceId={preselectedServiceId}
              currentUser={currentUser}
              onBookingSuccess={handleBookingCreatedSuccess}
              onOpenLogin={() => setShowLoginModal(true)}
              setCurrentTab={setCurrentTab}
            />
          </motion.div>
        );

      case "telegram":
        return (
          <motion.div
            key="telegram-page"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            <BotSimulator onGoToBooking={handleSelectServiceFromLanding} />
          </motion.div>
        );

      case "cabinet":
        return (
          <motion.div
            key="cabinet-page"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            <UserCabinet
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
              bookings={bookings}
              setBookings={setBookings}
              addNotification={addNotification}
            />
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 selection:bg-siam-teal/20 selection:text-siam-teal-dark transition-colors">
      
      {/* Top Banner indicating system status & dynamic db connection */}
      <div className="bg-siam-teal-dark/95 text-stone-300 py-1.5 px-4 text-[10px] sm:text-xs text-center font-mono border-b border-teal-950 flex items-center justify-center space-x-2 shrink-0">
        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
        <span>
          База данных: 
          <strong className="text-white ml-1">
            {isFirebaseAvailable ? "Google Firebase Cloud Firestore (Подключено)" : "Локальная автономная копия"}
          </strong>
        </span>
        <span className="text-siam-gold font-bold ml-2">•</span>
        <span className="text-siam-gold-light">ИИ: Gemini 3.5 Flash Active</span>
      </div>

      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenLogin={() => setShowLoginModal(true)}
        notifications={notifications}
        onMarkRead={handleMarkNotificationRead}
        onMarkAllRead={handleMarkAllNotificationsRead}
        onSimulateNotification={addNotification}
      />

      {/* Main viewport */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {renderTabContent()}
        </AnimatePresence>
      </main>

      <Footer setCurrentTab={setCurrentTab} />

      {/* Modal Auth System */}
      <AnimatePresence>
        {showLoginModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLoginModal(false)}
              className="absolute inset-0 bg-stone-900/40 backdrop-blur-xs"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 w-full max-w-sm relative z-10 shadow-2xl space-y-5 overflow-hidden"
            >
              
              <button
                onClick={() => setShowLoginModal(false)}
                className="absolute top-4 right-4 p-1 text-stone-400 hover:text-stone-600 rounded-lg transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="text-center space-y-1.5">
                <div className="h-10 w-10 bg-siam-teal/10 rounded-xl flex items-center justify-center text-siam-teal mx-auto">
                  <LogIn className="h-5.5 w-5.5" />
                </div>
                <h3 className="font-serif text-xl font-bold text-stone-900">
                  {isRegisterMode ? "Регистрация" : "Вход в кабинет"}
                </h3>
                <p className="text-xs text-stone-500">
                  {isRegisterMode ? "Создайте профиль за 10 секунд" : "Введите учетные данные для входа"}
                </p>
              </div>

              <form onSubmit={handleModalAuthSubmit} className="space-y-4">
                {isRegisterMode && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-bold tracking-wider text-stone-400 uppercase">Имя</label>
                    <input
                      type="text"
                      required
                      placeholder="Иван"
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      className="w-full px-4 py-2 border border-stone-200 rounded-xl text-xs focus:outline-hidden focus:ring-1 focus:ring-siam-teal"
                    />
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold tracking-wider text-stone-400 uppercase">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="ivan@gmail.com"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-stone-200 rounded-xl text-xs focus:outline-hidden focus:ring-1 focus:ring-siam-teal"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold tracking-wider text-stone-400 uppercase">Пароль</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={authPass}
                    onChange={(e) => setAuthPass(e.target.value)}
                    className="w-full px-4 py-2 border border-stone-200 rounded-xl text-xs focus:outline-hidden focus:ring-1 focus:ring-siam-teal"
                  />
                </div>

                {modalError && (
                  <p className="text-[10px] text-red-600 font-medium bg-red-50 p-2.5 rounded-lg border border-red-150 flex items-center">
                    {modalError}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 bg-siam-teal hover:bg-siam-teal-dark text-white font-medium text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-siam-teal/10 cursor-pointer"
                >
                  {isRegisterMode ? "Зарегистрироваться" : "Войти"}
                </button>
              </form>

              <div className="text-center pt-2 border-t border-stone-100 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setIsRegisterMode(!isRegisterMode);
                    setModalError("");
                  }}
                  className="text-siam-teal font-semibold hover:underline cursor-pointer"
                >
                  {isRegisterMode ? "Уже зарегистрированы? Войти" : "Нет учетной записи? Регистрация"}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
