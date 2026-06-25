import React from "react";
import { Send, Sparkles, BookOpen, Copy, Check, Terminal } from "lucide-react";
import { SupportMessage } from "../types";
import { useLanguage } from "../LanguageContext";

interface BotSimulatorProps {
  onGoToBooking: (serviceId?: string) => void;
}

export default function BotSimulator({ onGoToBooking }: BotSimulatorProps) {
  const { lang, t } = useLanguage();

  const getBotInitialGreeting = () => {
    if (lang === "cheese") {
      return "Squeak! 🙏 Welcome to Siam Cheddar Assistant Bot.\n\nI am Brie Bot, fermented with active yeast cultures. I will help you sniff out hole configurations, Swiss passes, and locate the finest milk supplies in Thailand.\n\nSelect a slice below or squeak with me directly!";
    }
    if (lang === "en") {
      return "Siam Assist Bot: Hello and welcome! 🙏\n\nI will assist you with visas, corporate structures, bank accounts, and relocation details in Thailand.\n\nSelect an option below or type your question.";
    }
    return "Савади кхап! 🙏 Добро пожаловать в Siam Assist Bot.\n\nЯ помогу вам сориентироваться по жизни, визам и бизнесу в Таиланде.\n\nВыберите одну из опций ниже или напишите мне любой интересующий вопрос!";
  };

  // Chat state
  const [messages, setMessages] = React.useState<SupportMessage[]>([]);
  const [inputValue, setInputValue] = React.useState<string>("");
  const [isTyping, setIsTyping] = React.useState<boolean>(false);
  const [copiedWebhook, setCopiedWebhook] = React.useState<boolean>(false);
  const chatEndRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    // Reinitialize greeting if language changes
    setMessages([
      {
        id: "1",
        sender: "bot",
        text: getBotInitialGreeting(),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }
    ]);
  }, [lang]);

  // Scroll to bottom
  React.useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Handle automatic or Gemini responses
  const sendMessageToBot = async (text: string) => {
    if (!text.trim()) return;

    // 1. Add user message
    const userMsg: SupportMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    try {
      // Send directly to our server-side API proxying Gemini!
      const response = await fetch("/api/chat-gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          lang: lang, // pass language context
          chatHistory: messages.map(m => ({ sender: m.sender, text: m.text }))
        })
      });

      const data = await response.json();
      
      setIsTyping(false);
      const botMsg: SupportMessage = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: data.text || (lang === "ru" ? "Извините, не удалось получить ответ. Пожалуйста, попробуйте снова." : "Sorry, we couldn't get a response. Please try again."),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages((prev) => [...prev, botMsg]);

    } catch (e) {
      console.error("Chat simulator error:", e);
      setIsTyping(false);
      
      // Local fallback in case server has issues
      const localMsg: SupportMessage = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: lang === "ru" 
          ? "Извините, возникли проблемы при подключении к ИИ-серверу. Проверьте ваши настройки API в личном кабинете." 
          : lang === "en"
            ? "Sorry, there was an issue connecting to the AI server. Please check your API variables in settings."
            : "Squeak! Traps triggered! Lost connection to the cheese server.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages((prev) => [...prev, localMsg]);
    }
  };

  // Pre-defined menu options inside Telegram simulation (Inline keyboard)
  const handleMenuClick = (label: string, userText: string) => {
    sendMessageToBot(userText);
  };

  const copyWebhookToClipboard = () => {
    const webhookUrl = window.location.origin + "/api/telegram-webhook";
    navigator.clipboard.writeText(webhookUrl);
    setCopiedWebhook(true);
    setTimeout(() => setCopiedWebhook(false), 2000);
  };

  return (
    <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
          {t("telegram", "title")}
        </h2>
        <p className="text-sm text-stone-600">
          {t("telegram", "desc")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
        
        {/* Left Side: Mockup of Telegram app inside iPhone style frame */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-full max-w-[360px] h-[640px] bg-slate-950 rounded-[40px] p-3 shadow-2xl border-4 border-stone-800 flex flex-col overflow-hidden">
            
            {/* iPhone Top Notch/Speaker */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-5 w-32 bg-stone-800 rounded-b-xl z-20 flex justify-center items-center">
              <span className="h-1 w-8 bg-stone-900 rounded-full" />
              <span className="h-1.5 w-1.5 bg-stone-900 rounded-full ml-2" />
            </div>

            {/* Telegram Header */}
            <div className="bg-[#242F3D] text-white pt-6 pb-3 px-4 flex items-center space-x-3.5 relative z-10">
              <div className="h-10 w-10 bg-[#0d5c53] rounded-full flex items-center justify-center border border-teal-500/30">
                <span className="font-serif text-lg font-bold text-siam-gold-light">
                  {lang === "cheese" ? "🧀" : "S"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-semibold block truncate">
                  {lang === "cheese" ? "Brie Support Assistant" : "Siam Support Assistant"}
                </span>
                <span className="text-[10px] text-teal-400 font-mono block">
                  bot • {t("telegram", "status_online")}
                </span>
              </div>
              <span className="text-xs text-stone-400">•••</span>
            </div>

            {/* Telegram Chat Wallpaper Area */}
            <div className="flex-1 bg-[#0E1621] p-4.5 overflow-y-auto space-y-3 flex flex-col scrollbar-thin">
              
              {messages.map((msg) => {
                const isBot = msg.sender === "bot";
                return (
                  <div
                    key={msg.id}
                    className={`max-w-[85%] flex flex-col p-3 rounded-2xl relative text-xs ${
                      isBot
                        ? "bg-[#182533] text-stone-100 self-start rounded-tl-xs"
                        : "bg-[#2B5278] text-white self-end rounded-tr-xs"
                    }`}
                  >
                    <p className="whitespace-pre-line leading-relaxed text-[13px]">{msg.text}</p>
                    <span className="text-[9px] text-stone-400 self-end mt-1">{msg.timestamp}</span>
                  </div>
                );
              })}

              {/* Bot typing simulator */}
              {isTyping && (
                <div className="bg-[#182533] text-stone-300 self-start p-3 rounded-2xl rounded-tl-xs max-w-[60%] flex items-center space-x-1.5">
                  <span className="h-1.5 w-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="h-1.5 w-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="h-1.5 w-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Simulated Telegram Inline Keyboard buttons */}
            <div className="bg-[#17212B] p-2 border-t border-slate-900 grid grid-cols-2 gap-1.5">
              <button
                onClick={() => handleMenuClick("visa", 
                  lang === "ru" 
                    ? "Какие визы есть для фрилансеров?" 
                    : lang === "en" 
                      ? "What visas are available for remote freelancers?" 
                      : "Which Swiss Cheese passes are available? 🇨🇭"
                )}
                className="py-2.5 bg-[#202B36] hover:bg-[#283645] text-stone-200 text-[10px] sm:text-[11px] font-semibold rounded-lg transition-colors cursor-pointer text-center block truncate"
              >
                {lang === "ru" ? "🇹🇭 Визы и Иммиграция" : lang === "en" ? "🇹🇭 Visas & Relocation" : "🇨🇭 Swiss Passes"}
              </button>
              <button
                onClick={() => handleMenuClick("bank", 
                  lang === "ru" 
                    ? "Как открыть счет в тайском банке?" 
                    : lang === "en" 
                      ? "How do I set up a bank account?" 
                      : "How do I secure my cheddar? 🏦"
                )}
                className="py-2.5 bg-[#202B36] hover:bg-[#283645] text-stone-200 text-[10px] sm:text-[11px] font-semibold rounded-lg transition-colors cursor-pointer text-center block truncate"
              >
                {lang === "ru" ? "💳 Банковский Счёт" : lang === "en" ? "💳 Bank Account" : "💳 Cheddar Vaults"}
              </button>
              <button
                onClick={() => handleMenuClick("driver", 
                  lang === "ru" 
                    ? "Как сделать тайские водительские права?" 
                    : lang === "en" 
                      ? "What is the process for a driving license?" 
                      : "How to convert driving wheels? 🚗"
                )}
                className="py-2.5 bg-[#202B36] hover:bg-[#283645] text-stone-200 text-[10px] sm:text-[11px] font-semibold rounded-lg transition-colors cursor-pointer text-center block truncate"
              >
                {lang === "ru" ? "🚗 Водительские Права" : lang === "en" ? "🚗 Driving License" : "🚗 Wheel rolling"}
              </button>
              <button
                type="button"
                onClick={() => onGoToBooking()}
                className="py-2.5 bg-siam-teal text-white text-[10px] sm:text-[11px] font-bold rounded-lg transition-colors cursor-pointer text-center block truncate"
              >
                {lang === "ru" ? "📅 Запись на звонок" : lang === "en" ? "📅 Book Appointment" : "📅 Schedule Melt"}
              </button>
            </div>

            {/* Telegram Input Area */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessageToBot(inputValue);
              }}
              className="bg-[#17212B] p-3 flex items-center space-x-2 border-t border-slate-950"
            >
              <input
                type="text"
                placeholder={t("telegram", "placeholder")}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 bg-[#24303F] border-none rounded-full px-4.5 py-2.5 text-xs text-white placeholder-stone-400 focus:outline-hidden focus:ring-1 focus:ring-teal-500"
                id="bot-input-field"
              />
              <button
                type="submit"
                className="h-9 w-9 bg-[#2B5278] hover:bg-[#34628F] rounded-full flex items-center justify-center text-white transition-colors cursor-pointer shrink-0"
                id="bot-send-btn"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>

          </div>
        </div>

        {/* Right Side: Setup Instructions & Developer documentation Console */}
        <div className="lg:col-span-7 space-y-7 flex flex-col justify-between">
          
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 bg-siam-teal/10 text-siam-teal px-4.5 py-1.5 rounded-full text-xs font-mono font-semibold uppercase tracking-wider">
              <Sparkles className="h-4 w-4 mr-1 text-siam-gold" />
              <span>{t("telegram", "auto_response")}</span>
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 leading-tight">
              {lang === "ru" 
                ? "Как устроен ИИ-помощник?" 
                : lang === "en" 
                  ? "How is the AI Bot Configured?" 
                  : "Milk Science of Yeast AI 🧪"}
            </h3>
            
            <p className="text-sm text-stone-600 leading-relaxed">
              {lang === "ru"
                ? "Наш бот работает на базе языковой модели Gemini 3.5 Flash на стороне сервера Express. Он полностью подключен к базе данных Firestore, что позволяет ему в реальном времени проверять статусы заявок пользователей, предоставлять консультации по визовым правилам Таиланда и предлагать записаться на встречу с юристами."
                : lang === "en"
                  ? "Our assistant operates on Google Gemini 3.5 Flash utilizing Express on the backend. Highly customized system context aligns response patterns directly with real-time Firestore database queries, addressing Thai visa frameworks, company setups, and automated booking referrals."
                  : "Brie Bot operates on fermented whey intelligence (extra-matured Gemini 3.5 Flash server routes). It sniffs Firestore larders to check whether your cheese documents are fully aged, answering dairy questions, and steering mice straight toward consult slots."}
            </p>

            {/* Code / Configuration Panel */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-5 text-stone-300 font-mono text-xs shadow-inner">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2 text-stone-400">
                  <Terminal className="h-4.5 w-4.5 text-siam-gold" />
                  <span className="font-semibold text-stone-300">Telegram Bot Webhook Setup</span>
                </div>
                <span className="text-[9px] bg-slate-800 text-siam-gold px-2.5 py-1 rounded-full uppercase tracking-widest font-bold">API v2026</span>
              </div>

              {/* Webhook block */}
              <div className="space-y-2">
                <span className="text-[10px] text-stone-400 block uppercase tracking-wider">
                  {lang === "ru" ? "Webhook URL вашей инсталляции:" : "Webhook URL endpoint:"}
                </span>
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between gap-3 overflow-x-auto">
                  <span className="text-stone-300 text-xs select-all truncate">{window.location.origin}/api/telegram-webhook</span>
                  <button
                    onClick={copyWebhookToClipboard}
                    className="p-1.5 text-stone-400 hover:text-white hover:bg-slate-850 rounded-lg transition-colors shrink-0 cursor-pointer"
                  >
                    {copiedWebhook ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Setup list step-by-step */}
              <div className="space-y-2 pt-2 text-stone-300">
                <span className="text-[10px] text-stone-400 block uppercase tracking-wider">
                  {lang === "ru" ? "3 шага для подключения реального бота:" : "3 steps for live Telegram integration:"}
                </span>
                <div className="space-y-3.5 pl-1 leading-relaxed text-[11px]">
                  <div className="flex items-start space-x-3">
                    <span className="text-siam-gold font-bold">01.</span>
                    <span>
                      {lang === "ru"
                        ? "Создайте бота в Telegram через @BotFather и скопируйте предоставленный API Token."
                        : lang === "en"
                          ? "Create your Telegram handle via @BotFather and secure your API Token."
                          : "Whistle at @BotFather in Telegram and obtain your secret yeast key."}
                    </span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-siam-gold font-bold">02.</span>
                    <span>
                      {lang === "ru" ? "Зарегистрируйте этот Webhook URL в Telegram, сделав GET-запрос:" : "Bind this Webhook URL to Telegram using a GET call:"}
                      <code className="text-teal-400 text-[10px] block mt-1 break-all bg-slate-950 p-2 rounded-lg font-mono">
                        https://api.telegram.org/bot{"{TOKEN}"}/setWebhook?url={"{WEBHOOK_URL}"}
                      </code>
                    </span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-siam-gold font-bold">03.</span>
                    <span>
                      {lang === "ru"
                        ? "Укажите ваш TELEGRAM_BOT_TOKEN в секретах панели управления, и все сообщения будут обрабатываться ИИ."
                        : lang === "en"
                          ? "Declare TELEGRAM_BOT_TOKEN in environment settings, and your live chats will stream directly through this server-side core."
                          : "Save your TELEGRAM_BOT_TOKEN in the environment secret vault to let Brie Bot listen in."}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Quick Booking Help */}
          <div className="bg-siam-sand border border-stone-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center sm:justify-between gap-4">
            <div className="flex items-start space-x-3 text-xs text-stone-600">
              <BookOpen className="h-5 w-5 text-siam-teal shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-800 block mb-0.5">
                  {lang === "ru" ? "Нужна глубокая правовая экспертиза?" : "Require Professional Juridical Support?"}
                </strong>
                <span>
                  {lang === "ru"
                    ? "ИИ отлично справляется с быстрыми ответами, но оформление документов требует профессиональной проверки документов нашими сертифицированными тайскими юристами."
                    : lang === "en"
                      ? "AI resolves preliminary context perfectly, but final document drafting must be meticulously cross-examined by qualified Thai immigration lawyers."
                      : "AI nibbles fast, but rolling actual wheels through the royal Thai customs requires professional oversight by grand master cheesemongers."}
                </span>
              </div>
            </div>
            <button
              onClick={() => onGoToBooking()}
              className="px-5 py-2.5 bg-siam-teal hover:bg-siam-teal-dark text-white font-medium text-xs rounded-xl shadow-xs transition-colors cursor-pointer whitespace-nowrap"
            >
              {t("services", "book_btn")}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
