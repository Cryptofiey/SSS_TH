import React from "react";
import { getBookingsFromDb, updateBookingInDb, getChatMessagesFromDb, saveChatMessageToDb, saveProfileToDb, getProfileFromDb, saveUserDocumentToDb, getUserDocumentsFromDb, getReferredUsersFromDb } from "../firebaseConfig";
import { Booking, SupportMessage, UserProfile, DocumentStatus, VisaProgress } from "../types";
import { SERVICES } from "../data";
import { User, LogIn, Mail, Lock, Shield, Calendar, Clock, FileText, Upload, RefreshCw, Send, Sparkles, CheckSquare, Plus, ArrowRight, MessageSquare, AlertCircle, CheckCircle, Loader2, Eye, Download, Star, Bell, BellRing, BellOff, Gift, Copy, Users } from "lucide-react";
import { downloadChecklistPdf } from "../utils/pdfGenerator";
import { useLanguage } from "../LanguageContext";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";

interface UserCabinetProps {
  currentUser: UserProfile | null;
  setCurrentUser: (user: UserProfile | null) => void;
  bookings: Booking[];
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  addNotification?: (title: string, message: string, type: 'info' | 'success' | 'warning' | 'alert', bookingId?: string) => void;
}

export default function UserCabinet({
  currentUser,
  setCurrentUser,
  bookings,
  setBookings,
  addNotification
}: UserCabinetProps) {
  const { lang, t } = useLanguage();

  // Auth Form states
  const [isSignUp, setIsSignUp] = React.useState<boolean>(false);
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [name, setName] = React.useState<string>("");
  const [phone, setPhone] = React.useState<string>("");
  const [telegram, setTelegram] = React.useState<string>("");
  const [authError, setAuthError] = React.useState<string>("");
  const [authSuccess, setAuthSuccess] = React.useState<string>("");

  // Cabinet View States
  const [activeSubTab, setActiveSubTab] = React.useState<'overview' | 'documents' | 'chat' | 'checklist' | 'referral'>('overview');
  const [referredUsers, setReferredUsers] = React.useState<UserProfile[]>([]);
  const [loadingReferred, setLoadingReferred] = React.useState<boolean>(false);
  const [copiedReferral, setCopiedReferral] = React.useState<boolean>(false);

  const getDocDefaultName = (id: string) => {
    switch(id) {
      case "p1":
        return lang === "ru" ? "Заграничный паспорт (Все страницы с отметками)" : lang === "en" ? "International Passport (All stamped pages)" : "Mouse Passport (Squeaked & Stamped pages) 🐭";
      case "p2":
        return lang === "ru" ? "Выписка из банка (Минимум 500k THB / 15k USD)" : lang === "en" ? "Bank Statement (Min 500k THB / 15k USD)" : "Milk Bank Statement (Min 500,000 yellow curds) 🏦";
      case "p3":
        return lang === "ru" ? "Контракт удаленной работы / Портфолио фрилансера" : lang === "en" ? "Remote Employment Contract / Freelance Portfolio" : "Freelance Nibbling Contract / Cheese Portfolio 💼";
      case "p4":
        return lang === "ru" ? "Residence Certificate (Справка из иммиграционной службы)" : lang === "en" ? "Residence Certificate (Immigration address confirmation)" : "Hole Residency Certificate (Cheddar local registry) 📜";
      default:
        return "";
    }
  };

  // Interactive Document uploads
  const [documents, setDocuments] = React.useState<DocumentStatus[]>([
    { id: "p1", name: getDocDefaultName("p1"), status: "pending_upload", lastUpdated: lang === "ru" ? "Не загружено" : lang === "en" ? "Not uploaded" : "Empty larder" },
    { id: "p2", name: getDocDefaultName("p2"), status: "pending_upload", lastUpdated: lang === "ru" ? "Не загружено" : lang === "en" ? "Not uploaded" : "Empty larder" },
    { id: "p3", name: getDocDefaultName("p3"), status: "pending_upload", lastUpdated: lang === "ru" ? "Не загружено" : lang === "en" ? "Not uploaded" : "Empty larder" },
    { id: "p4", name: getDocDefaultName("p4"), status: "pending_upload", lastUpdated: lang === "ru" ? "Не загружено" : lang === "en" ? "Not uploaded" : "Empty larder" }
  ]);

  // Adjust names dynamically on language toggle
  React.useEffect(() => {
    setDocuments(prev => prev.map(doc => ({
      ...doc,
      name: getDocDefaultName(doc.id)
    })));
  }, [lang]);

  const [uploadProgress, setUploadProgress] = React.useState<Record<string, number>>({});
  const [uploadedFiles, setUploadedFiles] = React.useState<Record<string, boolean>>({});

  // Direct Support Chat states
  const [supportChat, setSupportChat] = React.useState<SupportMessage[]>([]);
  const [chatInput, setChatInput] = React.useState<string>("");
  const [chatLoading, setChatLoading] = React.useState<boolean>(false);
  const chatEndRef = React.useRef<HTMLDivElement | null>(null);

  // Expat Checklist states
  const [checklist, setChecklist] = React.useState<{ id: string; text: string; done: boolean }[]>([
    { id: "c1", text: "Собрать выписки из банка с мокрой печатью", done: true },
    { id: "c2", text: "Заказать справку об отсутствии судимости (для Non-OA/LTR)", done: false },
    { id: "c3", text: "Перевести свидетельство о браке/рождении на английский язык", done: false },
    { id: "c4", text: "Купить тайскую туристическую SIM-карту (AIS/True)", done: false },
    { id: "c5", text: "Арендовать первоначальное жилье на 1 месяц", done: false },
    { id: "c6", text: "Оформить Residence Certificate через Siam Assist", done: false }
  ]);

  // Dynamic translated checklist items on change
  React.useEffect(() => {
    const isRu = lang === "ru";
    const isEn = lang === "en";
    const items = [
      { id: "c1", text: isRu ? "Собрать выписки из банка с мокрой печатью" : isEn ? "Collect bank statements with physical ink stamps" : "Melt milk curds & stamp bank cheese ledger 🧀", done: true },
      { id: "c2", text: isRu ? "Заказать справку об отсутствии судимости (для Non-OA/LTR)" : isEn ? "Request criminal background check (for Non-OA/LTR)" : "Confirm zero-trap criminal record with local sheriff 👮", done: false },
      { id: "c3", text: isRu ? "Перевести свидетельство о браке/рождении на английский язык" : isEn ? "Translate marriage/birth certificates to English" : "Translate wedding mice bonds into official royal script", done: false },
      { id: "c4", text: isRu ? "Купить тайскую туристическую SIM-карту (AIS/True)" : isEn ? "Buy a local Thai SIM card (AIS/True)" : "Acquire a local SIM for direct squeak lines 📱", done: false },
      { id: "c5", text: isRu ? "Арендовать первоначальное жилье на 1 месяц" : isEn ? "Rent temporary lodging for the first month" : "Lease a warm nesting hole for 1 month", done: false },
      { id: "c6", text: isRu ? "Оформить Residence Certificate через Siam Assist" : isEn ? "Apply for Residence Certificate via Siam Assist" : "Certify Nest residency through grand master cheesemongers", done: false }
    ];
    
    if (currentUser) {
      const saved = localStorage.getItem(`th_chk_${currentUser.uid}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const synchronized = items.map(it => {
            const match = parsed.find((p: any) => p.id === it.id);
            return match ? { ...it, done: match.done } : it;
          });
          setChecklist(synchronized);
          return;
        } catch (e) {
          console.error(e);
        }
      }
    }
    setChecklist(items);
  }, [lang, currentUser]);

  // Sync documents from DB
  React.useEffect(() => {
    if (currentUser) {
      const loadUserDocuments = async () => {
        try {
          const dbDocs = await getUserDocumentsFromDb(currentUser.uid);
          if (dbDocs && dbDocs.length > 0) {
            setDocuments(prevDocs => 
              prevDocs.map(defaultDoc => {
                const found = dbDocs.find(d => d.id === defaultDoc.id);
                return found ? { ...defaultDoc, ...found } : defaultDoc;
              })
            );
            const uploaded: Record<string, boolean> = {};
            dbDocs.forEach(d => {
              if (d.status !== "pending_upload" && d.fileData) {
                uploaded[d.id] = true;
              }
            });
            setUploadedFiles(uploaded);
          }
        } catch (error) {
          console.error("Error loading user documents:", error);
        }
      };
      loadUserDocuments();
    }
  }, [currentUser]);

  const handleToggleChecklist = (id: string) => {
    const updated = checklist.map((item) => item.id === id ? { ...item, done: !item.done } : item);
    setChecklist(updated);
    if (currentUser) {
      localStorage.setItem(`th_chk_${currentUser.uid}`, JSON.stringify(updated));
    }
  };

  // Visa Status Mock Tracker
  const [visaStepIndex, setVisaStepIndex] = React.useState<number>(1);
  const getVisaSteps = () => {
    if (lang === "ru") {
      return [
        { title: "Сбор и аудит документов", description: "Юристы проверили выписки и контракты на соответствие требованиям" },
        { title: "Подача и оплата пошлины", description: "Заявка успешно направлена в Иммиграционную службу" },
        { title: "Консульская верификация", description: "Ожидаем принятия решения ведомством" },
        { title: "Вклейка визы (E-Visa Stamp)", description: "Виза будет отправлена на вашу почту в PDF формате" }
      ];
    }
    if (lang === "cheese") {
      return [
        { title: "Milk curd review", description: "Master cheesemongers inspected your dairy ledger & hole parameters" },
        { title: "Rennet heating & Taxes", description: "Cheddar tax successfully dispatched to Royal Dairy Chamber" },
        { title: "Grate-room evaluation", description: "Aged blocks under review inside the grand imperial storage" },
        { title: "Maturity Certificate (PDF)", description: "Lactose-free gold certificate dispatched to your mouse-mail!" }
      ];
    }
    return [
      { title: "Document aggregation & audit", description: "Lawyers cross-checked statements & employment contracts" },
      { title: "Submission & fee processing", description: "Visa petition securely delivered to Royal Immigration authorities" },
      { title: "Consular verification", description: "Awaiting final clearance and decision from the embassy" },
      { title: "E-Visa Stamp dispatch", description: "Your approved visa PDF will be delivered directly to your mailbox" }
    ];
  };

  const visaSteps = getVisaSteps();
  const currentProgressPercent = visaStepIndex === 0 ? 25 : visaStepIndex === 1 ? 50 : visaStepIndex === 2 ? 75 : 100;
  
  const visaTracker: VisaProgress = {
    visaType: currentUser?.currentVisa || "Destination Thailand Visa (DTV)",
    progressPercent: currentProgressPercent,
    currentStep: visaStepIndex < 4 ? visaSteps[visaStepIndex].title : (lang === "ru" ? "Виза Одобрена!" : lang === "en" ? "Visa Approved!" : "Fully Mature Cheese! 🎉"),
    steps: visaSteps.map((step, idx) => ({
      ...step,
      completed: idx <= visaStepIndex
    }))
  };

  // Recharts data for the DTV Visa application progress stages
  const chartData = [
    {
      name: lang === "ru" ? "Документы" : lang === "cheese" ? "Curd Review" : "Docs Verified",
      status: visaStepIndex >= 0 ? 100 : 0,
      label: visaStepIndex >= 0 ? (lang === "ru" ? "Пройдено" : "Completed") : (lang === "ru" ? "Ожидание" : "Pending"),
      color: visaStepIndex >= 0 ? "#0f766e" : "#e7e5e4"
    },
    {
      name: lang === "ru" ? "Подача" : lang === "cheese" ? "Rennet Heat" : "Submission",
      status: visaStepIndex >= 1 ? 100 : (visaStepIndex === 0 ? 40 : 0),
      label: visaStepIndex >= 1 ? (lang === "ru" ? "Пройдено" : "Completed") : (visaStepIndex === 0 ? (lang === "ru" ? "В процессе" : "In Progress") : (lang === "ru" ? "Ожидание" : "Pending")),
      color: visaStepIndex >= 1 ? "#0f766e" : (visaStepIndex === 0 ? "#d97706" : "#e7e5e4")
    },
    {
      name: lang === "ru" ? "Верификация" : lang === "cheese" ? "Evaluation" : "Processing",
      status: visaStepIndex >= 2 ? 100 : (visaStepIndex === 1 ? 40 : 0),
      label: visaStepIndex >= 2 ? (lang === "ru" ? "Пройдено" : "Completed") : (visaStepIndex === 1 ? (lang === "ru" ? "В процессе" : "In Progress") : (lang === "ru" ? "Ожидание" : "Pending")),
      color: visaStepIndex >= 2 ? "#0f766e" : (visaStepIndex === 1 ? "#d97706" : "#e7e5e4")
    },
    {
      name: lang === "ru" ? "Выдача" : lang === "cheese" ? "Maturity Cert" : "Issued",
      status: visaStepIndex >= 3 ? 100 : (visaStepIndex === 2 ? 40 : 0),
      label: visaStepIndex >= 3 ? (lang === "ru" ? "Пройдено" : "Completed") : (visaStepIndex === 2 ? (lang === "ru" ? "В процессе" : "In Progress") : (lang === "ru" ? "Ожидание" : "Pending")),
      color: visaStepIndex >= 3 ? "#0f766e" : (visaStepIndex === 2 ? "#d97706" : "#e7e5e4")
    }
  ];

  const handleSimulateVisaNextStep = () => {
    if (visaStepIndex < 3) {
      const nextIndex = visaStepIndex + 1;
      setVisaStepIndex(nextIndex);
      if (addNotification) {
        if (nextIndex === 2) {
          addNotification(
            lang === "ru" ? "Статус визы обновлен 🔔" : lang === "en" ? "Visa Status Updated 🔔" : "Cheese status fermented! 🔔",
            lang === "ru" 
              ? `Ваш кейс прошел проверку! Текущий статус: "${visaSteps[2].title}". Ожидаем финального решения.`
              : lang === "en"
                ? `Your application cleared verification! Status: "${visaSteps[2].title}". Awaiting embassy response.`
                : `Your milk got warm! Status: "${visaSteps[2].title}".`,
            "info"
          );
        } else if (nextIndex === 3) {
          addNotification(
            lang === "ru" ? "Виза одобрена! 🎉🇹🇭" : lang === "en" ? "Visa Approved! 🎉🇹🇭" : "Cheddar Wheel Ready! 🎉🇹🇭",
            lang === "ru" 
              ? `Консульство Таиланда полностью утвердило ваш кейс! Электронная виза E-Visa выслана в PDF.`
              : lang === "en"
                ? `The Royal Thai Embassy has approved your entry! Your E-Visa has been dispatched.`
                : `The Grand Dairy Chamber granted access! Your gold ledger PDF is dispatched.`,
            "success"
          );
        }
      }
    } else {
      setVisaStepIndex(1);
      if (addNotification) {
        addNotification(
          lang === "ru" ? "Статус визы сброшен 🔄" : "Visa Status Reset 🔄",
          lang === "ru" 
            ? `Визовый статус возвращен на шаг "Подача и оплата пошлины" для тестирования.`
            : `Visa status reverted for simulation loops.`,
          "info"
        );
      }
    }
  };

  // Rating states for each booking
  const [ratingStates, setRatingStates] = React.useState<Record<string, { rating: number; comment: string; isSubmitting: boolean }>>({});

  const isDatePassed = (bookingDateStr: string) => {
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      return bookingDateStr < todayStr;
    } catch (e) {
      return false;
    }
  };

  const handleRateBooking = async (bookingId: string, rating: number, comment: string) => {
    if (rating === 0) {
      if (addNotification) {
        addNotification(
          lang === "ru" ? "Ошибка оценки ⚠️" : "Rating Error ⚠️",
          lang === "ru" ? "Пожалуйста, выберите количество звезд." : "Please select a star rating.",
          "warning"
        );
      }
      return;
    }

    setRatingStates(prev => ({
      ...prev,
      [bookingId]: { ...(prev[bookingId] || { rating, comment: "" }), isSubmitting: true }
    }));

    try {
      const success = await updateBookingInDb(bookingId, {
        rating,
        ratingComment: comment,
        ratedAt: new Date().toISOString(),
        status: "completed"
      });

      if (success) {
        if (currentUser) {
          const updatedBookings = await getBookingsFromDb(currentUser.uid);
          setBookings(updatedBookings);
        }
        if (addNotification) {
          addNotification(
            lang === "ru" ? "Спасибо за отзыв! ❤️" : lang === "cheese" ? "Squeak! Nibble registered! ❤️" : "Thank you for your feedback! ❤️",
            lang === "ru" 
              ? "Ваша оценка и отзыв успешно сохранены. Это помогает нам становиться лучше!"
              : lang === "cheese"
                ? "Your tasting notes are stashed safely in our royal larder."
                : "Your rating and feedback have been successfully registered. Thank you!",
            "success"
          );
        }
      }
    } catch (err) {
      console.error("Failed to submit rating:", err);
    } finally {
      setRatingStates(prev => ({
        ...prev,
        [bookingId]: { ...(prev[bookingId] || { rating, comment: "" }), isSubmitting: false }
      }));
    }
  };

  const [pdfLoading, setPdfLoading] = React.useState<boolean>(false);

  // Quick Question Chat Overlay States
  const [isQuickChatOpen, setIsQuickChatOpen] = React.useState<boolean>(false);
  const [quickChatMessages, setQuickChatMessages] = React.useState<SupportMessage[]>([
    {
      id: "qc_init",
      sender: "bot",
      text: lang === "ru" 
        ? "Привет! Я ИИ-помощник Siam Assist. Напишите ваш вопрос о визах, документах или банках в Таиланде!"
        : lang === "cheese"
          ? "Squeak! I am Brie Bot! Ask me any questions about our matured cheese visas or curd safety!"
          : "Hello! I am your Siam Assist FAQ AI. Ask me anything about Thai visas, documentation, or bank accounts!",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
  ]);
  const [quickChatInput, setQuickChatInput] = React.useState<string>("");
  const [isQuickChatTyping, setIsQuickChatTyping] = React.useState<boolean>(false);
  const quickChatEndRef = React.useRef<HTMLDivElement | null>(null);

  // Sync initial message language if list is only the initial message
  React.useEffect(() => {
    setQuickChatMessages(prev => {
      if (prev.length === 1 && prev[0].id === "qc_init") {
        return [
          {
            id: "qc_init",
            sender: "bot",
            text: lang === "ru" 
              ? "Привет! Я ИИ-помощник Siam Assist. Напишите ваш вопрос о визах, документах или банках в Таиланде!"
              : lang === "cheese"
                ? "Squeak! I am Brie Bot! Ask me any questions about our matured cheese visas or curd safety!"
                : "Hello! I am your Siam Assist FAQ AI. Ask me anything about Thai visas, documentation, or bank accounts!",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          }
        ];
      }
      return prev;
    });
  }, [lang]);

  // Scroll to bottom on open or new messages
  React.useEffect(() => {
    if (isQuickChatOpen) {
      setTimeout(() => {
        quickChatEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 80);
    }
  }, [quickChatMessages, isQuickChatTyping, isQuickChatOpen]);

  const handleSendQuickChat = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: SupportMessage = {
      id: "qc_" + Date.now().toString(),
      sender: "user",
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setQuickChatMessages(prev => [...prev, userMsg]);
    setQuickChatInput("");
    setIsQuickChatTyping(true);

    try {
      const res = await fetch("/api/chat-gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          lang: lang,
          chatHistory: quickChatMessages.map(m => ({ sender: m.sender === "bot" ? "bot" : "user", text: m.text }))
        })
      });
      const data = await res.json();

      const botMsg: SupportMessage = {
        id: "qc_bot_" + Date.now().toString(),
        sender: "bot",
        text: data.text || (lang === "ru" ? "Извините, возникла ошибка. Попробуйте еще раз." : "Sorry, an error occurred. Please try again."),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      setQuickChatMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg: SupportMessage = {
        id: "qc_err_" + Date.now().toString(),
        sender: "bot",
        text: lang === "ru" 
          ? "Не удалось подключиться к серверу ИИ. Пожалуйста, проверьте интернет-соединение или ключ API."
          : "Failed to connect to the AI service. Please check your network or API settings.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setQuickChatMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsQuickChatTyping(false);
    }
  };

  // Push Notification States
  const [pushStatus, setPushStatus] = React.useState<'unsupported' | 'default' | 'granted' | 'denied'>('default');
  const [isSubscribing, setIsSubscribing] = React.useState<boolean>(false);
  const [simulatedDelay, setSimulatedDelay] = React.useState<number>(5);
  const [simulationSent, setSimulationSent] = React.useState<boolean>(false);

  // Synchronize initial push status on mount
  React.useEffect(() => {
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      setPushStatus('unsupported');
    } else {
      setPushStatus(Notification.permission as any);
    }
  }, []);

  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const handleEnablePush = async () => {
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      alert("Push notifications are not supported in this browser.");
      return;
    }

    setIsSubscribing(true);
    try {
      const permission = await Notification.requestPermission();
      setPushStatus(permission);
      if (permission !== 'granted') {
        setIsSubscribing(false);
        return;
      }

      // Fetch public key from backend
      const keyRes = await fetch("/api/push/public-key");
      const { publicKey } = await keyRes.json();
      if (!publicKey) {
        throw new Error("No public VAPID key received from the server.");
      }

      // Register service worker
      const reg = await navigator.serviceWorker.register('/sw.js');
      console.log("Service Worker registered successfully:", reg);

      // Wait until SW is ready
      await navigator.serviceWorker.ready;

      // Subscribe to Push
      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey)
      });

      // Send subscription object to the server
      const subRes = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: currentUser?.uid,
          subscription
        })
      });

      if (!subRes.ok) {
        throw new Error("Failed to register subscription on Express backend.");
      }

      if (addNotification) {
        addNotification(
          lang === "ru" ? "Напоминания активированы! 🔔" : lang === "cheese" ? "Squeak Alerts Primed! 🧀" : "Reminders Activated! 🔔",
          lang === "ru" 
            ? "Мы пришлем вам системное уведомление, даже когда эта вкладка будет закрыта!" 
            : lang === "cheese" 
              ? "We will squeak a background alarm on your mouse-wheel desk even when you sleep!" 
              : "We will send a system push reminder even when your browser tab or app is closed!",
          "success"
        );
      }
    } catch (err: any) {
      console.error("Push registration error:", err);
      if (addNotification) {
        addNotification(
          lang === "ru" ? "Ошибка подписки 🔔" : "Subscription Failure 🔔",
          err.message || "Failed to set up service worker push.",
          "warning"
        );
      }
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleTriggerSimulatedPush = async () => {
    if (!currentUser) return;
    setSimulationSent(true);
    try {
      const res = await fetch("/api/push/send-reminder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: currentUser.uid,
          title: lang === "ru" 
            ? "Предстоящая консультация ⚖️" 
            : lang === "cheese"
              ? "Squeak Alert: Cheesemonger Slicing 🧀"
              : "Upcoming Legal Consultation ⚖️",
          message: lang === "ru"
            ? `Напоминание: Ваша сессия начнется через 10 минут. Мы ждем вас в Zoom!`
            : lang === "cheese"
              ? "Nibble reminder: Your professional cheese cutting session starts in 10 minutes. Wash your paws!"
              : `Reminder: Your DTV Visa/Documents session starts in 10 minutes. Click to join our specialists!`,
          delaySeconds: simulatedDelay
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to send simulated push request.");
      }

      if (addNotification) {
        addNotification(
          lang === "ru" ? "Таймер запущен ⏱️" : "Timer Scheduled ⏱️",
          lang === "ru"
            ? `Системное push-уведомление придет через ${simulatedDelay} секунд. Вы можете закрыть эту вкладку!`
            : `A native system reminder will be delivered in ${simulatedDelay} seconds. Close this tab to test!`,
          "info"
        );
      }
    } catch (err: any) {
      console.error("Simulated push error:", err);
      if (addNotification) {
        addNotification(
          lang === "ru" ? "Ошибка симуляции" : "Simulation Error",
          err.message || "Please enable push notifications first.",
          "warning"
        );
      }
    } finally {
      setTimeout(() => setSimulationSent(false), 3000);
    }
  };

  const quickSuggestions = lang === "ru" ? [
    { label: "DTV виза?", text: "Что такое DTV виза и какие требования к ней?" },
    { label: "Открыть счет?", text: "Как открыть банковский счет в Таиланде?" },
    { label: "Продлить визу?", text: "Как продлить 60-дневный штамп по прибытии?" }
  ] : lang === "cheese" ? [
    { label: "DTV Pass?", text: "Tell me about DTV cheese visas and yeast rules!" },
    { label: "Secure Cheddar?", text: "How do I secure my cheddar reserves in a Thai bank?" },
    { label: "Ageing rules?", text: "How do I extend my 60-day milk stay at the larder?" }
  ] : [
    { label: "DTV Visa?", text: "What is the Destination Thailand Visa (DTV) and what are the rules?" },
    { label: "Bank Account?", text: "What is the procedure to open a Thai bank account?" },
    { label: "Extend stay?", text: "How can I extend my 60-day visa-exempt entry?" }
  ];

  const handleDownloadPersonalChecklist = async () => {
    const activeVisaName = currentUser?.currentVisa || "Destination Thailand Visa (DTV)";
    const matchedService = SERVICES.find(s => 
      s.title.toLowerCase().includes(activeVisaName.toLowerCase()) || 
      activeVisaName.toLowerCase().includes(s.title.toLowerCase())
    ) || SERVICES[0];

    await downloadChecklistPdf({
      service: matchedService,
      userName: currentUser?.name || "Client",
      customChecklist: checklist,
      onProgress: setPdfLoading
    });
    
    if (addNotification) {
      addNotification(
        lang === "ru" ? "Чек-лист скачан 📥" : "Checklist Downloaded 📥",
        lang === "ru" 
          ? `Ваш персональный PDF чек-лист по услуге "${matchedService.title}" загружен.`
          : `Your custom PDF migration checklist for "${matchedService.title}" is ready.`,
        "success"
      );
    }
  };

  // Sync support chats when sub-tab changes to chat
  React.useEffect(() => {
    if (currentUser && activeSubTab === 'chat') {
      const loadChats = async () => {
        const msgs = await getChatMessagesFromDb(currentUser.uid);
        if (msgs.length === 0) {
          // Add initial assistant greeting if empty
          const welcome: SupportMessage = {
            id: "sw1",
            sender: "agent",
            text: lang === "ru" 
              ? `Савади кхап, ${currentUser.name}! 🙏 Я ваш персональный координатор в Siam Assist.\n\nЗдесь вы можете напрямую общаться с юристами поддержки. Загрузите необходимые документы в раздел 'Документы', и я сразу возьму их в работу.`
              : lang === "en"
                ? `Sawasdee khap, ${currentUser.name}! 🙏 I am your primary coordinator at Siam Assist.\n\nAsk me any immigration query. You can upload secure documents inside the 'Documents' tab, and our lawyers will review them instantly.`
                : `Squeak, ${currentUser.name}! 🙏 I am Michael, the Grand Assistant.\n\nSqueak with me directly. Drop your passport recipes in the Slices tab so we can check if they are ripe.`,
            timestamp: new Date().toISOString()
          };
          await saveChatMessageToDb(currentUser.uid, welcome);
          setSupportChat([welcome]);
        } else {
          setSupportChat(msgs);
        }
      };
      loadChats();
    }
  }, [currentUser, activeSubTab, lang]);

  React.useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [supportChat, chatLoading]);

  // Booking details sync
  const fetchBookings = React.useCallback(async (uid: string) => {
    const data = await getBookingsFromDb(uid);
    setBookings(data);
  }, [setBookings]);

  React.useEffect(() => {
    if (currentUser) {
      fetchBookings(currentUser.uid);
    }
  }, [currentUser, fetchBookings]);

  // Referred users sync
  const fetchReferredUsers = React.useCallback(async (uid: string) => {
    setLoadingReferred(true);
    try {
      const data = await getReferredUsersFromDb(uid);
      setReferredUsers(data);
    } catch (err) {
      console.error("Error loading referred users:", err);
    } finally {
      setLoadingReferred(false);
    }
  }, []);

  React.useEffect(() => {
    if (currentUser) {
      fetchReferredUsers(currentUser.uid);
    }
  }, [currentUser, fetchReferredUsers]);

  // Auth Handler
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccess("");

    if (!email || !password) {
      setAuthError(lang === "ru" ? "Заполните Email и Пароль." : "Please complete Email and Password.");
      return;
    }

    if (isSignUp && !name) {
      setAuthError(lang === "ru" ? "Пожалуйста, введите ваше Имя." : "Please fill out your name.");
      return;
    }

    try {
      if (isSignUp) {
        // Sign up logic
        const uid = "u_" + Math.random().toString(36).substr(2, 9);
        const refCode = localStorage.getItem("th_referral_code") || undefined;
        const profilePayload: UserProfile = {
          uid,
          email,
          name,
          phone: phone || undefined,
          telegram: telegram || undefined,
          currentVisa: "Destination Thailand Visa (DTV)",
          ...(refCode && { referredBy: refCode })
        };
        await saveProfileToDb(profilePayload);

        if (refCode) {
          localStorage.removeItem("th_referral_code");
        }
        
        // Connect guest bookings if any
        const localGuestBookings = JSON.parse(localStorage.getItem("th_bookings") || "[]");
        const matchingBookings = localGuestBookings.filter((b: any) => b.userEmail === email || b.userId === "guest_" + email);
        for (const b of matchingBookings) {
          await updateBookingInDb(b.id, { userId: uid });
        }

        setAuthSuccess(lang === "ru" ? "Аккаунт создан!" : "Account created successfully!");
        setCurrentUser(profilePayload);
      } else {
        // Sign in logic
        const profile = await getProfileFromDb(email);
        if (profile) {
          setCurrentUser(profile);
          setAuthSuccess(lang === "ru" ? "Успешный вход!" : "Successful entry!");
        } else {
          // Autocreate simple session
          const uid = "u_" + Math.random().toString(36).substr(2, 9);
          const p: UserProfile = {
            uid,
            email,
            name: email.split("@")[0].toUpperCase(),
            currentVisa: "Destination Thailand Visa (DTV)"
          };
          await saveProfileToDb(p);
          setCurrentUser(p);
          setAuthSuccess(lang === "ru" ? "Вход выполнен!" : "Signed in successfully!");
        }
      }
    } catch (err: any) {
      console.error(err);
      setAuthError(lang === "ru" ? "Не удалось авторизоваться. Проверьте данные." : "Authentication failed. Check your inputs.");
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    const bookToCancel = bookings.find(b => b.id === bookingId);
    if (window.confirm(lang === "ru" ? "Вы уверены, что хотите отменить консультацию?" : "Are you sure you want to cancel?")) {
      const success = await updateBookingInDb(bookingId, { status: "cancelled" });
      if (success && currentUser) {
        fetchBookings(currentUser.uid);
        if (addNotification && bookToCancel) {
          addNotification(
            lang === "ru" ? "Запись отменена ❌" : "Meeting Cancelled ❌",
            lang === "ru" 
              ? `Запись на "${bookToCancel.serviceTitle}" отменена.` 
              : `Appointment for "${bookToCancel.serviceTitle}" cancelled.`,
            "warning",
            bookingId
          );
        }
      }
    }
  };

  const handleSimulateStatusChange = async (bookingId: string, newStatus: 'confirmed' | 'completed' | 'cancelled', serviceTitle: string) => {
    const success = await updateBookingInDb(bookingId, { status: newStatus });
    if (success && currentUser) {
      fetchBookings(currentUser.uid);
      if (addNotification) {
        if (newStatus === "confirmed") {
          addNotification(
            lang === "ru" ? "Встреча подтверждена! 📅" : "Meeting Confirmed! 📅",
            lang === "ru" 
              ? `Консультация "${serviceTitle}" подтверждена. Ссылка для входа выслана.`
              : `Consultation for "${serviceTitle}" has been verified. Access credentials delivered.`,
            "success",
            bookingId
          );
        } else if (newStatus === "completed") {
          addNotification(
            lang === "ru" ? "Консультация завершена ✅" : "Consultation Finished ✅",
            lang === "ru" 
              ? `Отчет юриста по услуге "${serviceTitle}" загружен.`
              : `Expert evaluation report for "${serviceTitle}" has been uploaded.`,
            "info",
            bookingId
          );
        }
      }
    }
  };

  const handleSimulateUpload = (docId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && currentUser) {
      const file = e.target.files[0];
      const fileName = file.name;
      const rawSize = file.size;
      const formattedSize = rawSize > 1024 * 1024 
        ? (rawSize / (1024 * 1024)).toFixed(2) + " MB" 
        : (rawSize / 1024).toFixed(0) + " KB";

      if (rawSize > 850 * 1024) {
        if (addNotification) {
          addNotification(
            lang === "ru" ? "Файл слишком большой ⚠️" : "File Limit Exceeded ⚠️",
            lang === "ru" 
              ? "Размер ограничен 850 КБ во избежание сбоев БД. Пожалуйста, сожмите документ."
              : "For secure DB storage, file limit is 850 KB. Please compress your document.",
            "warning"
          );
        }
        return;
      }

      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = reader.result as string;

        setUploadProgress(prev => ({ ...prev, [docId]: 1 }));
        
        let progress = 0;
        const interval = setInterval(async () => {
          progress += 25;
          setUploadProgress(prev => ({ ...prev, [docId]: progress }));
          if (progress >= 100) {
            clearInterval(interval);
            setUploadedFiles(prev => ({ ...prev, [docId]: true }));
            
            const docName = getDocDefaultName(docId);
            const updatedDoc: DocumentStatus = {
              id: docId,
              name: docName,
              status: "under_review",
              lastUpdated: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              fileName,
              fileSize: formattedSize,
              fileData: base64Data
            };

            setDocuments(prevDocs => 
              prevDocs.map(d => d.id === docId ? updatedDoc : d)
            );

            try {
              await saveUserDocumentToDb(currentUser.uid, updatedDoc);
              if (addNotification) {
                addNotification(
                  lang === "ru" ? "Документ загружен 🔒" : "Document Attached 🔒",
                  lang === "ru" ? `Файл "${docName}" отправлен на проверку юристам.` : `"${docName}" attached securely for lawyer review.`,
                  "success"
                );
              }
            } catch (error) {
              console.error("Failed to save doc:", error);
            }
          }
        }, 150);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendSupportChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !currentUser) return;

    const userMsg: SupportMessage = {
      id: "ch_" + Date.now().toString(),
      sender: "user",
      text: chatInput,
      timestamp: new Date().toISOString()
    };

    setSupportChat(prev => [...prev, userMsg]);
    setChatInput("");
    setChatLoading(true);

    try {
      await saveChatMessageToDb(currentUser.uid, userMsg);

      const res = await fetch("/api/chat-gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: chatInput,
          lang: lang,
          chatHistory: supportChat.map(s => ({ sender: s.sender, text: s.text }))
        })
      });
      const data = await res.json();

      const botMsg: SupportMessage = {
        id: "ch_bot_" + Date.now().toString(),
        sender: "agent",
        text: data.text || (lang === "ru" ? "Спасибо. Наш юрист ответит вам в ближайшее время." : "Thank you. Our attorney will follow up shortly."),
        timestamp: new Date().toISOString()
      };

      setSupportChat(prev => [...prev, botMsg]);
      await saveChatMessageToDb(currentUser.uid, botMsg);
    } catch (err) {
      console.error(err);
    } finally {
      setChatLoading(false);
    }
  };

  // Auth screen
  if (!currentUser) {
    return (
      <div className="py-20 max-w-md mx-auto px-4">
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-8 shadow-xl space-y-6 relative overflow-hidden animate-fadeIn transition-colors">
          
          <div className="text-center space-y-2">
            <div className="h-12 w-12 bg-siam-teal/10 dark:bg-siam-teal/20 rounded-2xl flex items-center justify-center text-siam-teal dark:text-siam-gold-light mx-auto">
              <Shield className="h-6 w-6 text-siam-teal dark:text-siam-gold-light" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">
              {isSignUp ? t("auth", "title_reg") : t("auth", "title_login")}
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
              {lang === "ru"
                ? "Отслеживайте этапы оформления визы, загружайте документы и общайтесь с юристами."
                : lang === "en"
                  ? "Track visa stages, aggregate required documents, and consult directly with legal advisors."
                  : "Track cheese maturity steps, upload passport crumbs, and squeak with expert inspectors."}
            </p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {isSignUp && (
              <>
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-stone-500 dark:text-stone-400 block">{t("auth", "name_lbl")}</label>
                  <input
                    type="text"
                    required
                    placeholder={lang === "ru" ? "Александр" : "John Doe"}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 border border-stone-200 dark:border-stone-700 rounded-xl text-sm focus:outline-hidden focus:ring-1 focus:ring-siam-teal bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-450"
                    id="cabinet-reg-name"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-stone-500 dark:text-stone-400 block">
                    {lang === "ru" ? "Номер телефона" : "Phone number"}
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 border border-stone-200 dark:border-stone-700 rounded-xl text-sm focus:outline-hidden focus:ring-1 focus:ring-siam-teal bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-450"
                    id="cabinet-reg-phone"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-stone-500 dark:text-stone-400 block">
                    {lang === "ru" ? "Юзернейм в Telegram (опционально)" : "Telegram username (optional)"}
                  </label>
                  <input
                    type="text"
                    placeholder="@username"
                    value={telegram}
                    onChange={(e) => setTelegram(e.target.value)}
                    className="w-full px-4 py-2.5 border border-stone-200 dark:border-stone-700 rounded-xl text-sm focus:outline-hidden focus:ring-1 focus:ring-siam-teal bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-450"
                    id="cabinet-reg-tg"
                  />
                </div>
              </>
            )}

            <div className="space-y-1">
              <label className="text-[11px] font-medium text-stone-500 dark:text-stone-400 block flex items-center">
                <Mail className="h-3 w-3 mr-1 text-stone-400 dark:text-stone-500" /> {t("auth", "email_lbl")}
              </label>
              <input
                type="email"
                required
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 border border-stone-200 dark:border-stone-700 rounded-xl text-sm focus:outline-hidden focus:ring-1 focus:ring-siam-teal bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-450"
                id="cabinet-auth-email"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-medium text-stone-500 dark:text-stone-400 block flex items-center">
                <Lock className="h-3 w-3 mr-1 text-stone-400 dark:text-stone-500" /> {t("auth", "pass_lbl")}
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-stone-200 dark:border-stone-700 rounded-xl text-sm focus:outline-hidden focus:ring-1 focus:ring-siam-teal bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-450"
                id="cabinet-auth-pass"
              />
            </div>

            {authError && (
              <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-400 p-3.5 rounded-xl text-xs flex items-center space-x-2">
                <AlertCircle className="h-4.5 w-4.5 text-red-500 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {authSuccess && (
              <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 text-emerald-700 dark:text-emerald-400 p-3.5 rounded-xl text-xs flex items-center space-x-2">
                <CheckCircle className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                <span>{authSuccess}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-siam-teal hover:bg-siam-teal-dark text-white font-semibold text-sm rounded-xl shadow-md cursor-pointer transition-colors"
              id="cabinet-auth-submit"
            >
              {isSignUp ? t("auth", "submit_reg") : t("auth", "submit_login")}
            </button>
          </form>

          <div className="border-t border-stone-100 dark:border-stone-800 pt-4 text-center text-xs">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setAuthError("");
                setAuthSuccess("");
              }}
              className="text-siam-teal dark:text-siam-gold-light font-medium hover:underline cursor-pointer"
              id="cabinet-toggle-auth-type"
            >
              {isSignUp ? t("auth", "toggle_login") : t("auth", "toggle_reg")}
            </button>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Welcome header banner */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8 animate-fadeIn transition-colors">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-siam-gold">
            {t("cabinet", "title")}
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100 tracking-tight mt-1">
            {lang === "ru" ? `Рады видеть вас, ${currentUser.name}! 🙏` : lang === "en" ? `Welcome back, ${currentUser.name}! 🙏` : `Warm squeaks, ${currentUser.name}! 🧀`}
          </h2>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
            Email: {currentUser.email} | {t("cabinet", "sec_visa_type")} <strong className="font-semibold">{visaTracker.visaType}</strong>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveSubTab("overview")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${activeSubTab === "overview" ? "bg-siam-teal text-white shadow-xs" : "bg-siam-sand dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-750"}`}
          >
            {t("cabinet", "sub_overview")}
          </button>
          <button
            onClick={() => setActiveSubTab("documents")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${activeSubTab === "documents" ? "bg-siam-teal text-white shadow-xs" : "bg-siam-sand dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-750"}`}
          >
            {t("cabinet", "sub_docs")}
          </button>
          <button
            onClick={() => setActiveSubTab("chat")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${activeSubTab === "chat" ? "bg-siam-teal text-white shadow-xs" : "bg-siam-sand dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-750"}`}
          >
            {t("cabinet", "sub_chat")}
          </button>
          <button
            onClick={() => setActiveSubTab("checklist")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${activeSubTab === "checklist" ? "bg-siam-teal text-white shadow-xs" : "bg-siam-sand dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-750"}`}
          >
            {t("cabinet", "sub_checklist")}
          </button>
          <button
            onClick={() => setActiveSubTab("referral")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${activeSubTab === "referral" ? "bg-siam-teal text-white shadow-xs" : "bg-siam-sand dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-750"}`}
          >
            {lang === "ru" ? "Пригласить друга 🎁" : lang === "cheese" ? "Cheese Guild 🧀" : "Refer a Friend 🎁"}
          </button>
          <button
            onClick={() => setIsQuickChatOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-siam-gold hover:bg-siam-gold/90 text-stone-900 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center space-x-1 border border-siam-gold/30 cursor-pointer animate-pulse duration-1000"
          >
            <Sparkles className="h-3.5 w-3.5 text-stone-950 fill-stone-950" />
            <span>{lang === "ru" ? "Быстрый вопрос ИИ" : lang === "cheese" ? "Squeak FAQ" : "Quick Question AI"}</span>
          </button>
        </div>
      </div>

      {/* Conditional Sub-views */}
      {activeSubTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn">
          
          {/* Main left block: Visa status and bookings */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Visa tracker */}
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs transition-colors">
              <div className="flex justify-between items-center pb-4 border-b border-stone-100 dark:border-stone-800">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">{t("cabinet", "sec_tracker_title")}</h3>
                    <button
                      type="button"
                      onClick={handleSimulateVisaNextStep}
                      className="inline-flex items-center space-x-1 px-2.5 py-1 bg-siam-teal/10 hover:bg-siam-teal/20 text-siam-teal dark:text-siam-gold-light text-[10px] font-bold rounded-full transition-all cursor-pointer"
                      title="Advance Visa Progress (Simulation)"
                    >
                      <Sparkles className="h-3 w-3 animate-pulse text-siam-gold" />
                      <span>{lang === "ru" ? "Продвинуть (Имитация)" : "Advance Step"}</span>
                    </button>
                  </div>
                  <p className="text-xs text-stone-500 dark:text-stone-400">{t("cabinet", "sec_tracker_desc")}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-stone-400 dark:text-stone-500 block">Progress</span>
                  <strong className="text-siam-teal dark:text-siam-gold-light font-serif text-lg font-bold">{visaTracker.progressPercent}%</strong>
                </div>
              </div>

              {/* Progress visual with chart */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Left side: Status List */}
                <div className="lg:col-span-6 space-y-4">
                  {/* Progress bar visual */}
                  <div className="w-full bg-stone-100 dark:bg-stone-800 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-siam-teal dark:bg-siam-gold h-full rounded-full transition-all duration-500" style={{ width: `${visaTracker.progressPercent}%` }} />
                  </div>

                  {/* Steps list */}
                  <div className="space-y-3.5 pt-2">
                    {visaTracker.steps.map((step, idx) => (
                      <div key={idx} className="space-y-1 text-xs">
                        <div className="flex items-center space-x-2">
                          <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${step.completed ? "bg-siam-teal dark:bg-siam-gold text-white dark:text-stone-950" : "bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-400 dark:text-stone-500"}`}>
                            {idx + 1}
                          </span>
                          <strong className={step.completed ? "text-stone-800 dark:text-stone-150 font-semibold text-[11px]" : "text-stone-400 dark:text-stone-500 text-[11px]"}>{step.title}</strong>
                        </div>
                        <p className="text-[10px] text-stone-500 dark:text-stone-400 leading-snug pl-7">{step.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right side: Recharts Visualization Chart */}
                <div className="lg:col-span-6 bg-stone-50 dark:bg-stone-950 border border-stone-200/60 dark:border-stone-800/80 rounded-2xl p-4 h-[220px] flex flex-col justify-between" id="visa-recharts-analytics">
                  <div className="flex items-center justify-between pb-1.5 border-b border-stone-200 dark:border-stone-800">
                    <span className="text-[10px] font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider font-mono">
                      {lang === "ru" ? "Визуальный Анализ Прогресса" : lang === "cheese" ? "Dairy Aging Analytics" : "Visa Progress Analytics"}
                    </span>
                    <span className="text-[9px] font-medium text-stone-400 dark:text-stone-500">
                      Recharts
                    </span>
                  </div>
                  
                  {/* Recharts responsive container */}
                  <div className="flex-1 w-full h-full min-h-[140px] pt-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={chartData}
                        layout="vertical"
                        margin={{ top: 5, right: 10, left: -25, bottom: 5 }}
                      >
                        <XAxis type="number" domain={[0, 100]} hide />
                        <YAxis
                          dataKey="name"
                          type="category"
                          tick={{ fill: 'currentColor', fontSize: 9, fontWeight: 500 }}
                          className="text-stone-600 dark:text-stone-400 font-sans"
                          width={110}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-white dark:bg-stone-850 p-2 border border-stone-200 dark:border-stone-750 rounded-lg shadow-md text-[10px] space-y-0.5">
                                  <p className="font-bold text-stone-800 dark:text-stone-200">{data.name}</p>
                                  <p className="text-stone-500 dark:text-stone-400">
                                    {lang === "ru" ? "Статус:" : "Status:"} <strong className={data.status === 100 ? "text-emerald-600 dark:text-emerald-400" : data.status > 0 ? "text-amber-600 dark:text-amber-400" : "text-stone-400"}>{data.label}</strong>
                                  </p>
                                  <p className="text-[9px] text-stone-400">
                                    {lang === "ru" ? "Выполнено:" : "Completed:"} {data.status}%
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Bar dataKey="status" radius={[0, 4, 4, 0]} barSize={10}>
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            {/* Booked Consultations */}
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xs transition-colors">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
                  {lang === "ru" ? "Ваши Записи на Консультацию" : lang === "en" ? "Your Consultations" : "Your Cheesemonger bookings"}
                </h3>
                <span className="text-xs text-stone-400 dark:text-stone-500 font-mono">
                  {lang === "ru" ? `Всего записей: ${bookings.length}` : `Count: ${bookings.length}`}
                </span>
              </div>

              {/* Push Notifications control widget */}
              <div className="bg-stone-50 dark:bg-stone-900/60 border border-stone-200/85 dark:border-stone-800 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4" id="push-reminder-widget">
                <div className="space-y-1 max-w-lg">
                  <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                    {pushStatus === 'granted' ? (
                      <BellRing className="h-4.5 w-4.5 text-siam-teal animate-bounce" />
                    ) : pushStatus === 'denied' ? (
                      <BellOff className="h-4.5 w-4.5 text-red-500" />
                    ) : (
                      <Bell className="h-4.5 w-4.5 text-stone-400 dark:text-stone-500" />
                    )}
                    <span>
                      {lang === "ru" ? "Push-напоминания о консультациях" : lang === "cheese" ? "Squeak Alarm System" : "Consultation Push Reminders"}
                    </span>
                  </h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                    {lang === "ru"
                      ? "Включите системные уведомления, чтобы получать напоминания о созвонах, даже когда ваш браузер или вкладка закрыты."
                      : lang === "cheese"
                        ? "Register your browser mouse-trap alerts to wake you when cheese-slicing slot is ready, even with larder closed."
                        : "Enable desktop/mobile notification alerts to get reminded of upcoming sessions even when your browser tab or app is closed."}
                  </p>
                  
                  {/* Permission Status Pill */}
                  <div className="flex items-center space-x-1.5 pt-1">
                    <span className="text-[10px] uppercase tracking-wider font-mono text-stone-400 dark:text-stone-500">
                      {lang === "ru" ? "Статус разрешений:" : "Permission Status:"}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold ${
                      pushStatus === 'granted' ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200/30" :
                      pushStatus === 'denied' ? "bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border border-red-200/30" :
                      pushStatus === 'unsupported' ? "bg-stone-100 dark:bg-stone-800 text-stone-500 border border-stone-200/40" :
                      "bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border border-amber-200/30"
                    }`}>
                      {pushStatus === 'granted' ? (lang === "ru" ? "Разрешено" : "Granted") :
                       pushStatus === 'denied' ? (lang === "ru" ? "Заблокировано" : "Denied") :
                       pushStatus === 'unsupported' ? (lang === "ru" ? "Не поддерживается" : "Not Supported") :
                       (lang === "ru" ? "Не настроено" : "Not Set")}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-stretch sm:items-center gap-3 shrink-0">
                  {pushStatus !== 'granted' ? (
                    <button
                      type="button"
                      disabled={isSubscribing || pushStatus === 'unsupported'}
                      onClick={handleEnablePush}
                      className="px-4 py-2.5 bg-siam-teal hover:bg-siam-teal-dark disabled:bg-stone-300 dark:disabled:bg-stone-800 disabled:text-stone-500 dark:disabled:text-stone-600 font-semibold text-xs text-white rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                      id="btn-enable-push"
                    >
                      {isSubscribing ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          <span>{lang === "ru" ? "Подключение..." : "Connecting..."}</span>
                        </>
                      ) : (
                        <>
                          <Bell className="h-3.5 w-3.5" />
                          <span>{lang === "ru" ? "Разрешить уведомления" : "Enable Reminders"}</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 rounded-xl p-3 space-y-2 max-w-[280px]" id="sim-push-controls">
                      <div className="flex items-center gap-1 text-[11px] font-medium text-stone-700 dark:text-stone-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
                        <span>{lang === "ru" ? "Режим разработчика / Симулятор:" : "Notification Simulator:"}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <select
                          value={simulatedDelay}
                          onChange={(e) => setSimulatedDelay(parseInt(e.target.value, 10))}
                          className="px-1.5 py-1 text-[11px] border border-stone-200 dark:border-stone-700 rounded-lg bg-stone-50 dark:bg-stone-800 text-stone-850 dark:text-stone-150 focus:outline-hidden"
                          title="Simulated delay in seconds"
                          id="select-push-delay"
                        >
                          <option value={3}>3s</option>
                          <option value={5}>5s</option>
                          <option value={10}>10s</option>
                          <option value={15}>15s</option>
                        </select>
                        <button
                          type="button"
                          disabled={simulationSent}
                          onClick={handleTriggerSimulatedPush}
                          className="flex-1 px-2.5 py-1 bg-siam-gold hover:bg-siam-gold-dark text-stone-950 font-bold text-[10px] rounded-lg shadow-xs transition-colors cursor-pointer text-center whitespace-nowrap"
                          id="btn-trigger-sim-push"
                        >
                          {simulationSent ? (lang === "ru" ? "Отправлено!" : "Dispatched!") : (lang === "ru" ? "Тест (Закройте вкладку)" : "Test (Close Tab)")}
                        </button>
                      </div>
                      <p className="text-[9px] text-stone-400 dark:text-stone-500 leading-tight">
                        {lang === "ru"
                          ? "Нажмите кнопку, сразу закройте вкладку и через 5 секунд вы получите реальное системное пуш-уведомление!"
                          : "Trigger timer, close the browser tab, and receive a system push even with the webapp completely offline!"}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {bookings.length === 0 ? (
                <div className="border-2 border-dashed border-stone-200 dark:border-stone-850 rounded-2xl p-8 text-center text-stone-500 dark:text-stone-400 space-y-4">
                  <Calendar className="h-10 w-10 text-stone-300 dark:text-stone-700 mx-auto" />
                  <p className="text-sm">
                    {lang === "ru" ? "У вас пока нет запланированных консультаций." : "No upcoming meetings scheduled."}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((book) => {
                    const passed = isDatePassed(book.date) || book.status === 'completed';
                    const hasRated = book.rating !== undefined;

                    return (
                      <div key={book.id} className="border border-stone-200/80 dark:border-stone-800 rounded-2xl p-5 bg-stone-50/50 dark:bg-stone-900/40 hover:bg-stone-50 dark:hover:bg-stone-850/60 transition-all flex flex-col space-y-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2 flex-wrap">
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                book.status === 'completed' ? "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900" :
                                book.status === 'confirmed' ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900" :
                                book.status === 'cancelled' ? "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900" :
                                "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900"
                              }`}>
                                {book.status === 'completed' ? (lang === "ru" ? "Завершено" : lang === "cheese" ? "Digested 🧀" : "Completed") :
                                 book.status === 'confirmed' ? (lang === "ru" ? "Подтверждено" : "Confirmed") :
                                 book.status === 'cancelled' ? (lang === "ru" ? "Отменено" : "Cancelled") :
                                 (lang === "ru" ? "На проверке" : "Awaiting Review")}
                              </span>
                              <strong className="text-stone-800 dark:text-stone-150 text-sm block">{book.serviceTitle}</strong>
                            </div>
                            <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs text-stone-500 dark:text-stone-400">
                              <span className="flex items-center"><Calendar className="h-3.5 w-3.5 mr-1 text-stone-400 dark:text-stone-500 shrink-0" /> {book.date}</span>
                              <span className="flex items-center"><Clock className="h-3.5 w-3.5 mr-1 text-stone-400 dark:text-stone-500 shrink-0" /> {book.timeSlot}</span>
                            </div>
                            <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-snug">
                              <strong>Format:</strong> {book.format === 'video' ? 'Zoom Call' : book.format === 'telegram' ? 'Telegram' : 'Bangkok/Phuket HQ'}
                            </p>
                          </div>

                          {/* Simulation and cancel controls (only if NOT passed / completed) */}
                          {!passed && book.status !== 'cancelled' && (
                            <div className="flex flex-wrap gap-2 self-start md:self-center items-center">
                              {book.status === 'pending' && (
                                <button
                                  type="button"
                                  onClick={() => handleSimulateStatusChange(book.id, "confirmed", book.serviceTitle)}
                                  className="px-3.5 py-1.5 bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/55 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 text-xs font-semibold rounded-xl transition-all cursor-pointer"
                                  title="Simulate Lawyer Approval"
                                >
                                  {lang === "ru" ? "Подтвердить (Имитация)" : "Confirm Slot"}
                                </button>
                              )}
                              {book.status === 'confirmed' && (
                                <button
                                  type="button"
                                  onClick={() => handleSimulateStatusChange(book.id, "completed", book.serviceTitle)}
                                  className="px-3.5 py-1.5 bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-900/55 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900 text-xs font-semibold rounded-xl transition-all cursor-pointer"
                                  title="Simulate Service Completion"
                                >
                                  {lang === "ru" ? "Завершить (Имитация)" : "Complete Consultation"}
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleCancelBooking(book.id)}
                                className="px-3.5 py-1.5 bg-white dark:bg-stone-800 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 border border-stone-200 dark:border-stone-700 hover:border-red-200 dark:hover:border-red-900 text-xs font-medium rounded-xl transition-all cursor-pointer"
                              >
                                {lang === "ru" ? "Отменить" : "Cancel"}
                              </button>
                            </div>
                          )}

                          {book.status === 'cancelled' && (
                            <span className="text-xs text-stone-400 dark:text-stone-550 italic font-medium">
                              {lang === "ru" ? "Запись отменена" : "Meeting Cancelled"}
                            </span>
                          )}
                        </div>

                        {/* Interactive Rating Section */}
                        {passed && book.status !== 'cancelled' && (
                          <div className="border-t border-stone-150 dark:border-stone-800/80 pt-4 mt-2">
                            {hasRated ? (
                              <div className="bg-stone-100/35 dark:bg-stone-800/20 border border-stone-200/40 dark:border-stone-800/60 rounded-xl p-4 space-y-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-1.5 text-xs text-stone-500 dark:text-stone-400">
                                    <span className="font-semibold text-stone-700 dark:text-stone-300">
                                      {lang === "ru" ? "Ваша оценка:" : lang === "cheese" ? "Tasting Grade:" : "Your Rating:"}
                                    </span>
                                    <div className="flex items-center text-siam-gold">
                                      {Array.from({ length: 5 }).map((_, i) => (
                                        <Star key={i} className={`h-3.5 w-3.5 ${i < (book.rating || 0) ? "fill-siam-gold text-siam-gold" : "text-stone-300 dark:text-stone-700"}`} />
                                      ))}
                                    </div>
                                  </div>
                                  {book.ratedAt && (
                                    <span className="text-[10px] font-mono text-stone-400 dark:text-stone-500">
                                      {new Date(book.ratedAt).toLocaleDateString()}
                                    </span>
                                  )}
                                </div>
                                {book.ratingComment && (
                                  <p className="text-xs text-stone-600 dark:text-stone-300 italic pl-1 leading-relaxed border-l-2 border-stone-200 dark:border-stone-700 pl-2.5">
                                    "{book.ratingComment}"
                                  </p>
                                )}
                              </div>
                            ) : (
                              <div className="space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                  <div className="space-y-1">
                                    <h4 className="text-xs font-semibold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                                      <Star className="h-4 w-4 text-siam-gold fill-siam-gold animate-pulse animate-duration-1000" />
                                      <span>
                                        {lang === "ru" ? "Оцените вашу консультацию" : lang === "cheese" ? "Rate Your Nibble Session" : "Rate Your Consultation"}
                                      </span>
                                    </h4>
                                    <p className="text-[11px] text-stone-500 dark:text-stone-450 leading-normal">
                                      {lang === "ru"
                                        ? "Пожалуйста, поделитесь вашим мнением о работе юриста."
                                        : lang === "cheese"
                                          ? "Let us know if your legal expert was sharp like Cheddar or soft like Brie."
                                          : "Help us keep Siam Assist pristine. Rate your expert legal liaison."}
                                    </p>
                                  </div>

                                  {/* Star Selector */}
                                  <div className="flex items-center space-x-1">
                                    {Array.from({ length: 5 }).map((_, i) => {
                                      const starValue = i + 1;
                                      const currentRatingState = ratingStates[book.id]?.rating || 0;
                                      const isHighlighted = starValue <= currentRatingState;
                                      return (
                                        <button
                                          type="button"
                                          key={i}
                                          onClick={() => setRatingStates(prev => ({
                                            ...prev,
                                            [book.id]: { ...(prev[book.id] || { comment: "" }), rating: starValue, isSubmitting: false }
                                          }))}
                                          className="p-1 text-stone-300 hover:text-siam-gold transition-colors focus:outline-hidden cursor-pointer group"
                                        >
                                          <Star className={`h-6 w-6 transition-transform group-hover:scale-120 ${isHighlighted ? "fill-siam-gold text-siam-gold" : "text-stone-300 dark:text-stone-700"}`} />
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>

                                {/* Comment field and submit button */}
                                <div className="flex flex-col sm:flex-row gap-3 items-end">
                                  <div className="flex-1 w-full space-y-1">
                                    <input
                                      type="text"
                                      placeholder={
                                        lang === "ru" ? "Напишите отзыв (например, 'Отличный юрист, всё разложил по полочкам!')" :
                                        lang === "cheese" ? "Tasting notes (e.g. 'Very mature, sharp advice!')" :
                                        "Write your review (e.g., 'Incredibly helpful advisor, clarified all DTV requirements!')"
                                      }
                                      value={ratingStates[book.id]?.comment || ""}
                                      onChange={(e) => setRatingStates(prev => ({
                                        ...prev,
                                        [book.id]: { ...(prev[book.id] || { rating: 0, isSubmitting: false }), comment: e.target.value }
                                      }))}
                                      className="w-full px-4 py-2.5 border border-stone-200 dark:border-stone-700 rounded-xl text-xs focus:outline-hidden focus:ring-1 focus:ring-siam-teal bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-450"
                                      id={`rating-comment-${book.id}`}
                                    />
                                  </div>
                                  <button
                                    type="button"
                                    disabled={ratingStates[book.id]?.isSubmitting}
                                    onClick={() => handleRateBooking(book.id, ratingStates[book.id]?.rating || 0, ratingStates[book.id]?.comment || "")}
                                    className="px-5 py-2.5 bg-siam-teal hover:bg-siam-teal-dark text-white font-semibold text-xs rounded-xl shadow-xs transition-colors shrink-0 disabled:opacity-50 cursor-pointer"
                                  >
                                    {ratingStates[book.id]?.isSubmitting ? (lang === "ru" ? "Отправка..." : "Saving...") : (lang === "ru" ? "Отправить отзыв" : lang === "cheese" ? "Stash Nibble Feedback" : "Submit Review")}
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

          {/* Right column - Quick summaries */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Expat Support Details */}
            <div className="bg-siam-teal-dark text-white rounded-3xl p-6.5 space-y-4 shadow-xl">
              <h4 className="text-xs font-mono font-bold tracking-wider text-siam-gold uppercase">
                {lang === "ru" ? "Координатор поддержки" : lang === "en" ? "Support Coordinator" : "Grand Cheesemonger"}
              </h4>
              
              <div className="flex items-center space-x-3.5">
                <div className="h-12 w-12 bg-white/10 rounded-full flex items-center justify-center border border-teal-500/20 shrink-0">
                  <span className="text-siam-gold font-serif font-bold text-lg">M</span>
                </div>
                <div>
                  <strong className="text-sm block">Michael Lawson</strong>
                  <span className="text-[10px] text-stone-300 block">Senior Relocation Manager</span>
                </div>
              </div>

              <p className="text-xs text-stone-300 leading-relaxed pt-2">
                {lang === "ru"
                  ? "Привет! Я ваш назначенный менеджер. Любые вопросы по подготовке документов вы можете задавать в прямом чате со мной. Я на связи!"
                  : lang === "en"
                    ? "Hello! I am your primary relocation liaison. Ask me about embassy forms, bank details, or checklist items right here in the support chat."
                    : "Squeak! I am Michael. Squeak with me anytime about milk safety, Swiss hole configurations, or cheese wheel custom rules."}
              </p>

              <button
                onClick={() => setActiveSubTab("chat")}
                className="w-full py-3 bg-siam-gold hover:bg-siam-gold/90 text-siam-teal-dark font-semibold rounded-xl text-xs uppercase tracking-wider transition-all block text-center cursor-pointer"
              >
                {lang === "ru" ? "Открыть Чат" : lang === "en" ? "Open Live Chat" : "Stir the Squeak Channel"}
              </button>
            </div>

            {/* Quick checklist indicator */}
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6.5 space-y-4 transition-colors">
              <h4 className="text-xs font-mono font-bold tracking-wider text-siam-gold uppercase">
                {lang === "ru" ? "Прогресс по задачам" : "Checklist progress"}
              </h4>
              
              <div className="space-y-3 pt-1">
                <div className="flex justify-between text-xs font-semibold text-stone-700 dark:text-stone-300">
                  <span>{lang === "ru" ? "Выполнено шагов:" : "Completed:"}</span>
                  <span>{checklist.filter(c => c.done).length} {lang === "ru" ? "из" : "of"} {checklist.length}</span>
                </div>
                <div className="w-full bg-stone-100 dark:bg-stone-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-siam-teal dark:bg-siam-gold h-full transition-all" style={{ width: `${(checklist.filter(c => c.done).length / checklist.length) * 100}%` }} />
                </div>
                
                <button
                  onClick={() => setActiveSubTab("checklist")}
                  className="text-xs text-siam-teal dark:text-siam-gold-light font-semibold hover:underline block pt-2 cursor-pointer text-left"
                >
                  {lang === "ru" ? "Перейти в чек-лист →" : "View checklist details →"}
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Document Manager */}
      {activeSubTab === "documents" && (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs animate-fadeIn transition-colors">
          <div className="pb-4 border-b border-stone-100 dark:border-stone-800 space-y-1">
            <h3 className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100">{t("cabinet", "upload_doc_title")}</h3>
            <p className="text-sm text-stone-500 dark:text-stone-400">{t("cabinet", "upload_doc_desc")}</p>
          </div>

          <div className="space-y-4">
            {documents.map((docItem) => {
              const isUploaded = uploadedFiles[docItem.id];
              const progress = uploadProgress[docItem.id] || 0;

              return (
                <div key={docItem.id} className="border border-stone-200/80 dark:border-stone-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:border-stone-300 dark:hover:border-stone-700 transition-colors bg-stone-50/20 dark:bg-stone-900/10">
                  <div className="space-y-1">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider block w-max ${
                      docItem.status === 'under_review' ? "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900" : "bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 border border-stone-200 dark:border-stone-700"
                    }`}>
                      {docItem.status === 'under_review' ? t("cabinet", "status_review") : t("cabinet", "status_pending")}
                    </span>
                    <strong className="text-stone-800 dark:text-stone-100 text-xs md:text-sm block pt-1">{docItem.name}</strong>
                    
                    {/* Secure File Info */}
                    {isUploaded && docItem.fileName ? (
                      <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                        <span className="text-stone-600 dark:text-stone-300 font-medium bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded flex items-center gap-1">
                          <FileText className="h-3 w-3 text-stone-500 shrink-0" />
                          {docItem.fileName}
                        </span>
                        {docItem.fileSize && (
                          <span className="text-stone-400 dark:text-stone-500 font-mono">({docItem.fileSize})</span>
                        )}
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
                          <CheckCircle className="h-3 w-3 shrink-0" /> {t("cabinet", "status_secured")}
                        </span>
                        <span className="text-stone-400 dark:text-stone-500 block pl-1">{t("cabinet", "status_uploaded")} {docItem.lastUpdated}</span>
                      </div>
                    ) : (
                      <span className="text-[11px] text-stone-400 dark:text-stone-500 block">{lang === "ru" ? `Статус: ${docItem.lastUpdated}` : `Status: ${docItem.lastUpdated}`}</span>
                    )}
                  </div>

                  {/* Actions / Upload Button */}
                  <div className="flex items-center space-x-3.5">
                    {progress > 0 && progress < 100 && (
                      <div className="w-24 text-right space-y-1">
                        <span className="text-[10px] text-stone-400 block">Uploading... {progress}%</span>
                        <div className="w-full bg-stone-100 dark:bg-stone-850 h-1 rounded-full overflow-hidden">
                          <div className="bg-siam-teal h-full transition-all" style={{ width: `${progress}%` }} />
                        </div>
                      </div>
                    )}

                    {isUploaded && docItem.fileData && (
                      <div className="flex items-center gap-2">
                        <a
                          href={docItem.fileData}
                          download={docItem.fileName || "document"}
                          className="p-2.5 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-xl transition-colors cursor-pointer flex items-center justify-center shrink-0"
                          title="Download attached file"
                        >
                          <Download className="h-4 w-4" />
                        </a>
                        <button
                          onClick={() => {
                            const newTab = window.open();
                            if (newTab) {
                              newTab.document.write(`<iframe src="${docItem.fileData}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
                            }
                          }}
                          className="p-2.5 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-xl transition-colors cursor-pointer flex items-center justify-center shrink-0"
                          title="Preview Document"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    )}

                    <label className="px-4.5 py-2.5 bg-siam-teal hover:bg-siam-teal-dark text-white font-semibold text-xs rounded-xl cursor-pointer shadow-xs transition-colors flex items-center space-x-2 shrink-0">
                      <Upload className="h-3.5 w-3.5" />
                      <span>{isUploaded ? t("cabinet", "upload_update_btn") : t("cabinet", "upload_choose_btn")}</span>
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={(e) => handleSimulateUpload(docItem.id, e)}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-amber-50 dark:bg-amber-950/15 border border-amber-200 dark:border-amber-900/40 text-amber-800 dark:text-amber-350 p-4 rounded-xl text-xs flex items-start space-x-3 leading-relaxed max-w-4xl">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-semibold mb-0.5">
                {lang === "ru" ? "Важное примечание по безопасности" : "Important Security Notice"}
              </strong>
              <span>
                {lang === "ru"
                  ? "Все передаваемые персональные и конфиденциальные данные защищаются по протоколу SSL, а файлы сохраняются в ваше персональное облако в Google Firebase. Доступ имеют только лицензированные юристы, ведущие ваше дело."
                  : "All transmitted personal and biometric data is protected under robust SSL protocols, storing files inside secure client partitions. Access is strictly limited to certified Thai legal partners administering your immigration file."}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Support chat */}
      {activeSubTab === "chat" && (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl h-[540px] shadow-xs flex flex-col overflow-hidden animate-fadeIn transition-colors">
          
          {/* Header */}
          <div className="bg-stone-50 dark:bg-stone-900/60 border-b border-stone-200/80 dark:border-stone-800 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-siam-teal/10 dark:bg-siam-teal/20 rounded-full flex items-center justify-center text-siam-teal dark:text-siam-gold-light font-bold text-sm">
                {lang === "cheese" ? "🧀" : "S"}
              </div>
              <div>
                <span className="text-sm font-semibold text-stone-800 dark:text-stone-100 block">Michael Lawson (Siam Assist)</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono block">● Online • {lang === "ru" ? "Персональный куратор" : "Personal Liaison"}</span>
              </div>
            </div>
            <span className="text-xs text-stone-400 dark:text-stone-500">
              {lang === "ru" ? "Среднее время ответа: ~5 мин" : "Average response: ~5m"}
            </span>
          </div>

          {/* Chat message box */}
          <div className="flex-1 bg-stone-50/50 dark:bg-stone-950/20 p-6 overflow-y-auto space-y-4">
            {supportChat.map((msg) => {
              const isMe = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`max-w-[70%] flex flex-col p-4 rounded-2xl relative text-xs ${
                    isMe
                      ? "bg-siam-teal text-white self-end ml-auto rounded-tr-xs"
                      : "bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-100 self-start rounded-tl-xs shadow-xs"
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed text-[12.5px]">{msg.text}</p>
                  <span className={`text-[9px] self-end mt-1.5 ${isMe ? "text-teal-200 dark:text-teal-350" : "text-stone-400 dark:text-stone-500"}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              );
            })}

            {chatLoading && (
              <div className="bg-white dark:bg-stone-800 border border-stone-100 dark:border-stone-700 p-4 rounded-2xl rounded-tl-xs max-w-[200px] shadow-xs flex items-center space-x-1.5 self-start animate-pulse">
                <span className="h-1.5 w-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="h-1.5 w-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="h-1.5 w-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          {/* Input field Form */}
          <form onSubmit={handleSendSupportChat} className="p-4 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-850 flex items-center space-x-2">
            <input
              type="text"
              placeholder={t("cabinet", "chat_placeholder")}
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 px-4 py-3 border border-stone-200 dark:border-stone-700 rounded-xl text-xs focus:outline-hidden focus:ring-1 focus:ring-siam-teal bg-stone-50/30 dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-450"
              id="cabinet-chat-input"
            />
            <button
              type="submit"
              className="px-5 py-3 bg-siam-teal hover:bg-siam-teal-dark text-white rounded-xl flex items-center justify-center transition-colors cursor-pointer shrink-0 animate-fadeIn"
              id="cabinet-chat-send-btn"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>

        </div>
      )}

      {/* Expat checklists tracker */}
      {activeSubTab === "checklist" && (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs animate-fadeIn transition-colors">
          <div className="pb-4 border-b border-stone-100 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100">
                {lang === "ru" ? "Ваш Персональный Чек-лист Переезда" : lang === "en" ? "Your Relocation Checklists" : "Your Cheese board configuration"}
              </h3>
              <p className="text-sm text-stone-500 dark:text-stone-400">
                {lang === "ru" ? "Пошаговый план подготовки к приезду в Таиланд и обустройства на месте." : "Step-by-step guideline detailing arrival readiness and regional settlement."}
              </p>
            </div>
            <button
              onClick={handleDownloadPersonalChecklist}
              disabled={pdfLoading}
              className="px-4 py-2.5 bg-siam-teal hover:bg-siam-teal-dark text-white font-medium text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center space-x-1.5 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap self-start sm:self-center shrink-0"
              id="cabinet-download-checklist-pdf-btn"
              title="Download formatted checklist as PDF"
            >
              {pdfLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{lang === "ru" ? "Загрузка PDF..." : "Building..."}</span>
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4" />
                  <span>{t("cabinet", "dl_pdf")}</span>
                </>
              )}
            </button>
          </div>

          {/* Checklist boxes */}
          <div className="space-y-3">
            {checklist.map((item) => (
              <div
                key={item.id}
                onClick={() => handleToggleChecklist(item.id)}
                className={`p-4.5 rounded-2xl border flex items-center space-x-4 cursor-pointer transition-all ${
                  item.done
                    ? "border-emerald-200 dark:border-emerald-900 bg-emerald-50/20 dark:bg-emerald-950/10 opacity-80"
                    : "border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-750 hover:bg-stone-50 dark:hover:bg-stone-850"
                }`}
              >
                <button
                  type="button"
                  className={`h-5 w-5 rounded-md flex items-center justify-center border transition-all ${
                    item.done
                      ? "bg-emerald-500 border-emerald-500 text-white"
                      : "border-stone-300 dark:border-stone-650 bg-white dark:bg-stone-800"
                  }`}
                >
                  {item.done && "✓"}
                </button>
                <span className={`text-xs sm:text-sm font-medium ${item.done ? "line-through text-stone-400 dark:text-stone-500" : "text-stone-800 dark:text-stone-200"}`}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>

          {/* Informational checklist advice */}
          <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs text-stone-400 dark:text-stone-550">
            <span>
              {lang === "ru" ? "Прогресс:" : "Progress:"} <strong>{Math.round((checklist.filter(c => c.done).length / checklist.length) * 100)}%</strong>
            </span>
            <span>
              {lang === "ru" ? "Чек-лист автоматически сохраняется в вашем профиле" : "Progress is synced to your profile larder automatically"}
            </span>
          </div>
        </div>
      )}

      {/* Refer a friend portal */}
      {activeSubTab === "referral" && currentUser && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Header banner */}
          <div className="bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-stone-900 dark:to-emerald-950/20 border border-teal-100 dark:border-emerald-900/30 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 transition-colors">
            <div className="space-y-2 text-center md:text-left">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-teal-100 dark:bg-teal-900/40 text-teal-800 dark:text-teal-300">
                <Gift className="h-3.5 w-3.5 mr-1.5" />
                {lang === "ru" ? "Реферальная программа" : "Referral Program"}
              </span>
              <h3 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">
                {lang === "ru" ? "Делитесь выгодой с близкими" : "Share the Benefit with Friends"}
              </h3>
              <p className="text-sm text-stone-600 dark:text-stone-400 max-w-xl">
                {lang === "ru"
                  ? "Пригласите друзей в Siam Assist. Каждый зарегистрированный друг получит приоритетную консультацию, а вы — 10% скидку за каждого друга на любую следующую услугу!"
                  : "Invite friends to Siam Assist. Every friend who signs up gets a priority visa consultation, and you lock in a 10% discount on your next service!"}
              </p>
            </div>
            <div className="shrink-0 flex flex-col items-center justify-center p-4 bg-white dark:bg-stone-850 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs">
              <span className="text-[10px] font-mono text-stone-400 dark:text-stone-500 uppercase tracking-wider block mb-1">
                {lang === "ru" ? "Текущая скидка" : "Current Discount"}
              </span>
              <strong className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                {Math.min(referredUsers.length * 10, 50)}%
              </strong>
              <span className="text-[10px] text-stone-500 dark:text-stone-400 mt-1">
                {lang === "ru" ? `${referredUsers.length} друзей зарегистрировано` : `${referredUsers.length} friends referred`}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left columns: Link and program details */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Copy Referral Link Card */}
              <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs transition-colors">
                <h4 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
                  {lang === "ru" ? "Ваша личная ссылка" : "Your Referral Link"}
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  {lang === "ru" 
                    ? "Отправьте её в мессенджерах, соцсетях или по почте. Мы свяжем её с вашим профилем автоматически."
                    : "Send it via Telegram, WhatsApp, social networks, or email. We link new sign-ups with your profile."}
                </p>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    readOnly
                    value={`${window.location.origin}?ref=${currentUser.uid}`}
                    className="flex-1 bg-stone-50 dark:bg-stone-950 border border-stone-250 dark:border-stone-800 text-stone-750 dark:text-stone-300 rounded-xl px-4 py-3 text-xs focus:outline-hidden font-mono"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}?ref=${currentUser.uid}`);
                      setCopiedReferral(true);
                      setTimeout(() => setCopiedReferral(false), 2000);
                    }}
                    className="px-4.5 py-3 bg-siam-teal hover:bg-siam-teal-dark text-white rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer"
                  >
                    {copiedReferral ? (
                      <>
                        <span>✓</span>
                        <span className="text-xs">{lang === "ru" ? "Скопировано" : "Copied"}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        <span className="text-xs">{lang === "ru" ? "Копировать" : "Copy"}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Progress and benefits chart */}
              <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs transition-colors">
                <h4 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
                  {lang === "ru" ? "Сетка накопительных скидок" : "Staggered Loyalty Percentages"}
                </h4>
                
                <div className="space-y-4">
                  {/* Progress bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-stone-700 dark:text-stone-350">
                      <span>{lang === "ru" ? "Прогресс до макс. скидки (50%)" : "Progress to max loyalty (50% off)"}</span>
                      <span>{Math.min(referredUsers.length, 5)} / 5 {lang === "ru" ? "друзей" : "friends"}</span>
                    </div>
                    <div className="h-2.5 w-full bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((referredUsers.length / 5) * 100, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Benefit milestones */}
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    <div className={`p-3.5 rounded-2xl border text-center space-y-1 transition-all ${referredUsers.length >= 1 ? "bg-teal-50/20 dark:bg-teal-950/10 border-teal-300 dark:border-teal-900" : "bg-stone-50/20 dark:bg-stone-950/10 border-stone-200 dark:border-stone-800"}`}>
                      <span className="block text-xs font-mono font-semibold text-stone-400 dark:text-stone-550">1 {lang === "ru" ? "друг" : "friend"}</span>
                      <strong className={`block text-lg font-bold ${referredUsers.length >= 1 ? "text-teal-600 dark:text-teal-400" : "text-stone-500 dark:text-stone-400"}`}>10% OFF</strong>
                      <span className="block text-[9px] text-stone-400 dark:text-stone-500">{referredUsers.length >= 1 ? (lang === "ru" ? "Разблокировано" : "Unlocked") : (lang === "ru" ? "Закрыто" : "Locked")}</span>
                    </div>
                    
                    <div className={`p-3.5 rounded-2xl border text-center space-y-1 transition-all ${referredUsers.length >= 3 ? "bg-teal-50/20 dark:bg-teal-950/10 border-teal-300 dark:border-teal-900" : "bg-stone-50/20 dark:bg-stone-950/10 border-stone-200 dark:border-stone-800"}`}>
                      <span className="block text-xs font-mono font-semibold text-stone-400 dark:text-stone-550">3 {lang === "ru" ? "друга" : "friends"}</span>
                      <strong className={`block text-lg font-bold ${referredUsers.length >= 3 ? "text-teal-600 dark:text-teal-400" : "text-stone-500 dark:text-stone-400"}`}>30% OFF</strong>
                      <span className="block text-[9px] text-stone-400 dark:text-stone-500">{referredUsers.length >= 3 ? (lang === "ru" ? "Достигнуто" : "Earned") : (lang === "ru" ? "В процессе" : "In Progress")}</span>
                    </div>

                    <div className={`p-3.5 rounded-2xl border text-center space-y-1 transition-all ${referredUsers.length >= 5 ? "bg-teal-50/20 dark:bg-teal-950/10 border-teal-300 dark:border-teal-900" : "bg-stone-50/20 dark:bg-stone-950/10 border-stone-200 dark:border-stone-800"}`}>
                      <span className="block text-xs font-mono font-semibold text-stone-400 dark:text-stone-550">5 {lang === "ru" ? "друзей" : "friends"}</span>
                      <strong className={`block text-lg font-bold ${referredUsers.length >= 5 ? "text-teal-600 dark:text-teal-400" : "text-stone-500 dark:text-stone-400"}`}>50% OFF</strong>
                      <span className="block text-[9px] text-stone-400 dark:text-stone-550">{referredUsers.length >= 5 ? (lang === "ru" ? "Максимум!" : "Max reached!") : (lang === "ru" ? "Цель" : "Goal")}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right column: List of sign-ups and test simulation button */}
            <div className="lg:col-span-5 space-y-8">
              
              {/* Referred friends tracker table */}
              <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs transition-colors">
                <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
                  <h4 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center">
                    <Users className="h-5 w-5 mr-2 text-siam-teal" />
                    {lang === "ru" ? "Приглашенные друзья" : "Successful Sign-ups"}
                  </h4>
                  <span className="text-xs font-mono px-2 py-0.5 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 rounded-md">
                    {referredUsers.length}
                  </span>
                </div>

                {loadingReferred ? (
                  <div className="py-8 flex flex-col items-center justify-center space-y-2">
                    <Loader2 className="h-8 w-8 text-siam-teal animate-spin" />
                    <span className="text-xs text-stone-400">{lang === "ru" ? "Загрузка списка..." : "Loading referrals..."}</span>
                  </div>
                ) : referredUsers.length === 0 ? (
                  <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                    <div className="h-12 w-12 bg-stone-100 dark:bg-stone-800 rounded-full flex items-center justify-center text-stone-400">
                      <Users className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                        {lang === "ru" ? "Никто еще не зарегистрировался" : "No friends registered yet"}
                      </p>
                      <p className="text-[11px] text-stone-450 dark:text-stone-400 max-w-[200px] mx-auto">
                        {lang === "ru" 
                          ? "Поделитесь ссылкой выше, чтобы получить скидку на следующую консультацию." 
                          : "Share your unique referral link to start earning stackable consult benefits."}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                    {referredUsers.map((user) => (
                      <div key={user.uid} className="flex items-center justify-between p-3.5 bg-stone-50 dark:bg-stone-950 rounded-2xl border border-stone-200 dark:border-stone-850">
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-stone-800 dark:text-stone-200 truncate">{user.name}</p>
                          <p className="text-[10px] text-stone-400 truncate">{user.email}</p>
                        </div>
                        <div className="shrink-0 flex flex-col items-end">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400">
                            {lang === "ru" ? "Активен" : "Successful"}
                          </span>
                          <span className="text-[9px] text-stone-400 mt-1 font-mono">
                            {user.arrivalDate || "2026-06-24"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Simulation card for easy review and QA testing */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-stone-900 dark:to-orange-950/10 border border-amber-200 dark:border-amber-900/30 rounded-3xl p-6 sm:p-8 space-y-4">
                <div className="space-y-1">
                  <h4 className="font-serif text-sm font-bold text-amber-800 dark:text-amber-400 flex items-center">
                    <span className="text-base mr-1.5">🧪</span>
                    {lang === "ru" ? "Песочница тестирования рефералов" : "Referral QA Sandbox"}
                  </h4>
                  <p className="text-[11px] text-amber-700/85 dark:text-stone-400">
                    {lang === "ru" 
                      ? "Поскольку вы находитесь в изолированном окне просмотра, воспользуйтесь этим симулятором для мгновенного создания фиктивной регистрации друга по вашей ссылке!"
                      : "Because you are in an isolated preview container, use this interactive action to trigger a simulated signup using your referral code!"}
                  </p>
                </div>
                
                <button
                  onClick={async () => {
                    if (!currentUser) return;
                    const randomNames = ["Emma Watson", "Johnathan Doe", "Sophia Loren", "Alex Mercer", "Diana Prince", "Bruce Wayne", "Clark Kent", "Barry Allen"];
                    const randomName = randomNames[Math.floor(Math.random() * randomNames.length)];
                    const randomEmail = randomName.toLowerCase().replace(" ", ".") + "_" + Math.floor(Math.random() * 1000) + "@example.com";
                    const uid = "u_" + Math.random().toString(36).substr(2, 9);
                    
                    const simulatedProfile: UserProfile = {
                      uid,
                      email: randomEmail,
                      name: randomName,
                      currentVisa: "Destination Thailand Visa (DTV)",
                      referredBy: currentUser.uid,
                      arrivalDate: new Date().toISOString().split("T")[0]
                    };
                    
                    try {
                      await saveProfileToDb(simulatedProfile);
                      if (addNotification) {
                        addNotification(
                          lang === "ru" ? "Реферал зарегистрирован! 🎉" : "Referral Joined! 🎉",
                          lang === "ru" 
                            ? `${randomName} успешно зарегистрировался по вашей ссылке. Ваша скидка увеличена!` 
                            : `${randomName} successfully joined using your link. Your discount has increased!`,
                          "success"
                        );
                      }
                      await fetchReferredUsers(currentUser.uid);
                    } catch (err) {
                      console.error("Simulation failed:", err);
                    }
                  }}
                  className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-center space-x-1.5 border border-amber-500/20"
                >
                  <span>{lang === "ru" ? "Симулировать регистрацию друга" : "Simulate Friend Sign-up 🧪"}</span>
                </button>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* Floating Quick Question Action Button (rendered if closed and user logged in) */}
      {!isQuickChatOpen && currentUser && (
        <button
          onClick={() => setIsQuickChatOpen(true)}
          className="fixed bottom-6 right-6 z-50 h-14 w-14 bg-siam-gold hover:bg-siam-gold/90 text-stone-900 rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group animate-bounce"
          title={lang === "ru" ? "Задать вопрос ИИ" : lang === "cheese" ? "Squeak Quick Question" : "Ask AI a Quick Question"}
        >
          <Sparkles className="h-6 w-6 text-stone-900 fill-stone-900 group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-siam-teal opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-siam-teal"></span>
          </span>
        </button>
      )}

      {/* Persistent Compact Chat Overlay */}
      {isQuickChatOpen && currentUser && (
        <div className="fixed bottom-6 right-6 z-50 w-[340px] sm:w-[380px] h-[500px] bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 flex flex-col overflow-hidden animate-fadeIn transition-all duration-300 pointer-events-auto">
          
          {/* Header */}
          <div className="bg-[#242F3D] text-white py-3.5 px-4.5 flex items-center justify-between border-b border-stone-100 dark:border-stone-800 shrink-0">
            <div className="flex items-center space-x-3">
              <div className="h-9 w-9 bg-[#0d5c53] rounded-full flex items-center justify-center border border-teal-500/30">
                <span className="font-serif text-base font-bold text-siam-gold-light">
                  {lang === "cheese" ? "🧀" : "AI"}
                </span>
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold block truncate leading-tight">
                  {lang === "ru" ? "ИИ-Помощник Siam Assist" : lang === "cheese" ? "Brie Assistant Bot" : "Siam AI FAQ Assistant"}
                </span>
                <span className="text-[10px] text-teal-400 font-mono block leading-none mt-0.5">
                  {lang === "ru" ? "● Онлайн" : lang === "cheese" ? "● Active curd" : "● AI Online"}
                </span>
              </div>
            </div>
            
            {/* Control buttons */}
            <div className="flex items-center space-x-1.5">
              <button
                type="button"
                onClick={() => setQuickChatMessages([
                  {
                    id: "qc_init",
                    sender: "bot",
                    text: lang === "ru" 
                      ? "Привет! Я ИИ-помощник Siam Assist. Напишите ваш вопрос о визах, документах или банках в Таиланде!"
                      : lang === "cheese"
                        ? "Squeak! I am Brie Bot! Ask me any questions about our matured cheese visas or curd safety!"
                        : "Hello! I am your Siam Assist FAQ AI. Ask me anything about Thai visas, documentation, or bank accounts!",
                    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                  }
                ])}
                className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors text-[10px] font-mono cursor-pointer"
                title={lang === "ru" ? "Очистить чат" : "Clear chat"}
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => setIsQuickChatOpen(false)}
                className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                id="close-quick-chat-overlay"
              >
                <Plus className="h-5 w-5 rotate-45" />
              </button>
            </div>
          </div>

          {/* Chat message body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-stone-50/50 dark:bg-stone-950/20 scrollbar-thin">
            {quickChatMessages.map((msg) => {
              const isBot = msg.sender === "bot";
              return (
                <div
                  key={msg.id}
                  className={`max-w-[85%] flex flex-col p-3 rounded-2xl relative text-xs ${
                    isBot
                      ? "bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 self-start rounded-tl-xs border border-stone-200/60 dark:border-stone-800/80 shadow-xs"
                      : "bg-siam-teal text-white self-end rounded-tr-xs shadow-xs"
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed text-[12px]">{msg.text}</p>
                  <span className={`text-[8px] self-end mt-1 ${isBot ? "text-stone-400 dark:text-stone-500" : "text-stone-200"}`}>
                    {msg.timestamp}
                  </span>
                </div>
              );
            })}

            {/* AI typing animation */}
            {isQuickChatTyping && (
              <div className="bg-white dark:bg-stone-800 border border-stone-200/60 dark:border-stone-800/80 text-stone-400 self-start p-3 rounded-2xl rounded-tl-xs max-w-[50%] flex items-center space-x-1.5 shadow-xs">
                <span className="h-1.5 w-1.5 bg-siam-teal rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="h-1.5 w-1.5 bg-siam-teal rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="h-1.5 w-1.5 bg-siam-teal rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            )}

            <div ref={quickChatEndRef} />
          </div>

          {/* Dynamic Suggestion Pills */}
          {quickSuggestions.length > 0 && (
            <div className="px-3.5 py-2.5 border-t border-stone-150 dark:border-stone-850 bg-stone-50/30 dark:bg-stone-900/10 flex gap-1.5 overflow-x-auto scrollbar-none shrink-0">
              {quickSuggestions.map((sug, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSendQuickChat(sug.text)}
                  className="px-3 py-1.5 bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-750 text-[10px] text-stone-600 dark:text-stone-300 font-bold border border-stone-200 dark:border-stone-700 rounded-full cursor-pointer whitespace-nowrap shadow-xs hover:border-siam-gold hover:text-stone-900 dark:hover:text-white transition-all"
                >
                  {sug.label}
                </button>
              ))}
            </div>
          )}

          {/* Form input field */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendQuickChat(quickChatInput);
            }}
            className="p-3 bg-stone-50 dark:bg-stone-900/80 border-t border-stone-150 dark:border-stone-850 flex items-center space-x-2 shrink-0"
          >
            <input
              type="text"
              placeholder={
                lang === "ru" ? "Задайте быстрый вопрос..." :
                lang === "cheese" ? "Squeak a cheddar question..." :
                "Ask a quick question..."
              }
              value={quickChatInput}
              onChange={(e) => setQuickChatInput(e.target.value)}
              disabled={isQuickChatTyping}
              className="flex-1 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-full px-4 py-2.5 text-xs text-stone-900 dark:text-stone-100 placeholder-stone-450 focus:outline-hidden focus:ring-1 focus:ring-siam-teal disabled:opacity-60"
              id="quick-chat-input-field"
            />
            <button
              type="submit"
              disabled={!quickChatInput.trim() || isQuickChatTyping}
              className="h-9 w-9 bg-siam-teal hover:bg-siam-teal-dark text-white rounded-full flex items-center justify-center transition-colors cursor-pointer shrink-0 disabled:opacity-40 shadow-xs"
              id="quick-chat-send-btn"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>

        </div>
      )}

    </div>
  );
}
