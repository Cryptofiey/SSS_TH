import { Service } from "./types";

export type Language = "ru" | "en" | "cheese";

export const TRANSLATIONS = {
  nav: {
    logo_sub: {
      ru: "Expat Support Hub",
      en: "Expat Support Hub",
      cheese: "Mice & Curds Paradise 🐭"
    },
    landing: {
      ru: "Главная",
      en: "Home",
      cheese: "Fondue Central 🫕"
    },
    calculator: {
      ru: "Калькулятор",
      en: "Calculator",
      cheese: "Cheddar Counter 🧮"
    },
    booking: {
      ru: "Запись на консультацию",
      en: "Book Consultation",
      cheese: "Schedule a Melt 📅"
    },
    telegram: {
      ru: "Telegram Бот",
      en: "Telegram Bot",
      cheese: "Brie Bot 💬"
    },
    cabinet: {
      ru: "Личный Кабинет",
      en: "Client Portal",
      cheese: "Mouse Hole 🧀"
    },
    logout: {
      ru: "Выйти",
      en: "Logout",
      cheese: "Squeeze the Whey 🚪"
    },
    login_btn: {
      ru: "Личный кабинет",
      en: "Sign In",
      cheese: "Squeak In 🔑"
    }
  },
  banner: {
    db: {
      ru: "База данных",
      en: "Database",
      cheese: "Cheese Cellar"
    },
    connected: {
      ru: "Google Firebase Cloud Firestore (Подключено)",
      en: "Google Firebase Cloud Firestore (Connected)",
      cheese: "Double-Cream Blue Mold Firestore (Aged & Active 🔵)"
    },
    local: {
      ru: "Локальная автономная копия",
      en: "Local Offline Backup",
      cheese: "Pasteurized Processed Local Copy 🧀"
    },
    ai_active: {
      ru: "ИИ: Gemini 3.5 Flash Активен",
      en: "AI: Gemini 3.5 Flash Active",
      cheese: "AI: Sharp Gorgonzola 3.5 Extra Creamy Active ⚡"
    }
  },
  hero: {
    official: {
      ru: "Официальный сервис релокации 2026",
      en: "Official Relocation Service 2026",
      cheese: "Guaranteed Zero-Lactose Melting Service 2026"
    },
    title_main: {
      ru: "Беззаботная жизнь и бизнес в ",
      en: "Carefree life and business in ",
      cheese: "Smooth rolling and aging in "
    },
    title_highlight: {
      ru: "Таиланде",
      en: "Thailand",
      cheese: "Land of Cheddar 🧀"
    },
    title_suffix: {
      ru: " под ключ",
      en: " under key",
      cheese: " fully grated & melted!"
    },
    desc: {
      ru: "Помощь иностранцам с визами (DTV, Elite, пенсионные), получением тайских водительских прав, открытием банковских счетов и регистрацией бизнеса. Управляйте делами через личный кабинет и нашего интерактивного Telegram-бота с искусственным интеллектом.",
      en: "Assisting expats with visas (DTV, Elite, Retirement), driving licenses, opening bank accounts, and registering businesses in Thailand. Manage your documents via your Client Portal and our smart AI-powered Telegram Bot.",
      cheese: "Helping foreign mice secure golden passes (Swiss DTV, Elite Cheddar, Aged Parmesan), roll their cheese wheels (licenses), unlock cheddar vaults (bank accounts), and establish legal dairy factories. Track your curds in the Mouse Hole and squeak with our extra-matured Brie Bot!"
    },
    cta_booking: {
      ru: "Запись на консультацию",
      en: "Book a Consultation",
      cheese: "Schedule a Grating 🧀"
    },
    cta_telegram: {
      ru: "Тест-драйв ИИ-бота",
      en: "Test-drive AI Bot",
      cheese: "Bite the Cheese-Bot 🐭"
    },
    bullet1: {
      ru: "Личный юрист всегда на связи",
      en: "Personal lawyer always online",
      cheese: "Chief Cheesemonger on 24/7 call"
    },
    bullet2: {
      ru: "Оплата по этапам или после результата",
      en: "Step-by-step payment or upon success",
      cheese: "No pay if the milk goes sour!"
    },
    bullet3: {
      ru: "Личный кабинет с трекером документов",
      en: "Client Portal with document tracker",
      cheese: "Mouse Hole with visual cheese-wheel counter"
    },
    bullet4: {
      ru: "Умный бот в Telegram 24/7",
      en: "Smart Telegram Bot 24/7",
      cheese: "Whispering Brie Bot in Telegram 24/7"
    },
    mock_status: {
      ru: "Статус заявки",
      en: "Application Status",
      cheese: "Fermentation Stage"
    },
    mock_in_progress: {
      ru: "В процессе",
      en: "In Progress",
      cheese: "Curdling ⏳"
    },
    mock_step1: {
      ru: "Подача документов",
      en: "Document Submission",
      cheese: "Pouring the Milk"
    },
    mock_step1_desc: {
      ru: "Успешно пройдено 12 июня",
      en: "Completed successfully June 12",
      cheese: "Squeezed successfully June 12"
    },
    mock_step2: {
      ru: "Оплата госпошлины",
      en: "Fee Payment",
      cheese: "Buying the Starter Culture"
    },
    mock_step2_desc: {
      ru: "Подтверждено 15 июня",
      en: "Confirmed on June 15",
      cheese: "Melted on June 15"
    },
    mock_step3: {
      ru: "Рассмотрение Консульством",
      en: "Consulate Review",
      cheese: "Aging in the Royal Vault"
    },
    mock_step3_desc: {
      ru: "Ожидаемая дата: 26 июня 2026",
      en: "Estimated date: June 26, 2026",
      cheese: "Maturity check: June 26, 2026"
    },
    mock_cabinet_btn: {
      ru: "Открыть кабинет трекера",
      en: "Open Tracker Portal",
      cheese: "Inspect the Vault 🔍"
    },
    tg_live: {
      ru: "Telegram Bot Live",
      en: "Telegram Bot Live",
      cheese: "Whey-Fi Cheese Broadcast 📡"
    },
    tg_text: {
      ru: "Ваш Residence Certificate готов!",
      en: "Your Residence Certificate is ready!",
      cheese: "Your Extra-Sharp Cheese Wheel is Aged!"
    },
    stat1_val: {
      ru: "99.4%",
      en: "99.4%",
      cheese: "99.9% Fat 🧀"
    },
    stat1_lbl: {
      ru: "Успешных виз",
      en: "Visa Success Rate",
      cheese: "Perfect Melts"
    },
    stat2_val: {
      ru: "4,500+",
      en: "4,500+",
      cheese: "8,200+ Mice"
    },
    stat2_lbl: {
      ru: "Довольных экспатов",
      en: "Happy Expats",
      cheese: "Fed and Squeaking"
    },
    stat3_val: {
      ru: "< 24 часов",
      en: "< 24 Hours",
      cheese: "1.2 Seconds"
    },
    stat3_lbl: {
      ru: "Время ответа",
      en: "Response Time",
      cheese: "To Sniff a Trap"
    }
  },
  services: {
    title: {
      ru: "Наши Услуги и Сопровождение под ключ",
      en: "Our Comprehensive Services",
      cheese: "Cheese Board Assortment 🍽️"
    },
    desc: {
      ru: "Выберите необходимую категорию поддержки. Мы обеспечиваем полное юридическое сопровождение, от первой консультации до гарантированного получения результата.",
      en: "Select the required support category. We provide full legal guidance, from the first consultation to the final result.",
      cheese: "Choose your favorite flavor of legal support. We guide you from curds to mature wheels with double-cream guarantees."
    },
    all: {
      ru: "Все услуги",
      en: "All Services",
      cheese: "Full Cheese Board 🧀"
    },
    visas: {
      ru: "Визы и Релокация",
      en: "Visas & Relocation",
      cheese: "Swiss Passports & Hole Passes"
    },
    legal: {
      ru: "Бизнес и Банки",
      en: "Business & Bank Accounts",
      cheese: "Cheddar Factories & Vaults"
    },
    living: {
      ru: "Комфортная Жизнь",
      en: "Living & Comfort",
      cheese: "Mouse Hole Leases"
    },
    cost: {
      ru: "Стоимость:",
      en: "Cost Range:",
      cheese: "Cheese Weight:"
    },
    duration: {
      ru: "Срок оформления:",
      en: "Processing Time:",
      cheese: "Aging Time:"
    },
    req_docs: {
      ru: "Необходимые документы:",
      en: "Required Documents:",
      cheese: "Recipe Ingredients:"
    },
    book_btn: {
      ru: "Забронировать услугу",
      en: "Book This Service",
      cheese: "Add to Fondue 🫕"
    }
  },
  calculator: {
    title: {
      ru: "Калькулятор стоимости релокации",
      en: "Relocation Cost Calculator",
      cheese: "Cheddar Melt & Fondue Estimator 🧮"
    },
    desc: {
      ru: "Выберите интересующие вас услуги, чтобы рассчитать предварительную стоимость юридического сопровождения и госпошлин со скидкой за пакет.",
      en: "Select services to calculate preliminary legal costs, state fees, and bundle discounts.",
      cheese: "Select multiple slices of cheese to compute total ripening costs, starter culture tax, and wholesale cheese-wheel discounts."
    },
    selected: {
      ru: "Выбранные услуги",
      en: "Selected Services",
      cheese: "Your Cheese Slices"
    },
    no_services: {
      ru: "Вы не выбрали ни одной услуги. Кликните на карточки выше, чтобы добавить их в расчет.",
      en: "No services selected. Click the cards above to add them to the calculation.",
      cheese: "Your cheese board is empty! Squeak-click the cards above to start slicing."
    },
    discount: {
      ru: "Пакетная скидка (15%):",
      en: "Bundle Discount (15%):",
      cheese: "Mice Nibbled Discount (15%):"
    },
    total: {
      ru: "Итоговая стоимость под ключ:",
      en: "Total Package Cost:",
      cheese: "Total Cheddar Weight:"
    },
    clear: {
      ru: "Очистить все",
      en: "Clear All",
      cheese: "Eat All Cheese 🐭"
    },
    book_bundle: {
      ru: "Оформить этот пакет услуг",
      en: "Book This Bundle",
      cheese: "Melt This Entire Board!"
    }
  },
  booking: {
    title: {
      ru: "Онлайн-запись к юристу",
      en: "Book Legal Consultation",
      cheese: "Melt with a Cheesemonger 📅"
    },
    desc: {
      ru: "Выберите удобную дату и время для проведения первичной юридической консультации по визовым или корпоративным вопросам.",
      en: "Select a convenient date and time for an initial legal consultation on visa or business matters.",
      cheese: "Sniff out the perfect timing to melt down and debate cheese aging, milk chemistry, or hole configurations."
    },
    service_lbl: {
      ru: "Интересующая услуга",
      en: "Service of Interest",
      cheese: "Flavor profile"
    },
    date_lbl: {
      ru: "Выберите дату",
      en: "Select Date",
      cheese: "Choose Ripeness Day"
    },
    time_lbl: {
      ru: "Выберите время",
      en: "Select Time Slot",
      cheese: "Choose Milking Hour"
    },
    info_title: {
      ru: "Контактная информация",
      en: "Contact Information",
      cheese: "Mice Identifiers"
    },
    guest_disclaimer: {
      ru: "Вы бронируете как Гость. Будет автоматически создан временный аккаунт.",
      en: "Booking as Guest. A temporary client account will be generated for you.",
      cheese: "Squeaking as Guest. A temporary mouse hole will be dug for you automatically."
    },
    logged_in_as: {
      ru: "Вы авторизованы как:",
      en: "Signed in as:",
      cheese: "Authenticated Mouse:"
    },
    notes_lbl: {
      ru: "Примечания и вопросы (необязательно)",
      en: "Notes and Questions (optional)",
      cheese: "Cheesy comments & cheese-hole specs (optional)"
    },
    notes_placeholder: {
      ru: "Опишите вашу ситуацию...",
      en: "Describe your situation...",
      cheese: "I prefer sharp Cheddar, also my bank balance has 500k yellow curds..."
    },
    submit_btn: {
      ru: "Подтвердить запись",
      en: "Confirm Consultation",
      cheese: "Engrave on Cheese Wheel ✍️"
    },
    login_req_title: {
      ru: "Требуется авторизация",
      en: "Authentication Required",
      cheese: "Trap Check / Squeak Required"
    },
    login_req_desc: {
      ru: "Для завершения бронирования, пожалуйста, войдите в личный кабинет или зарегистрируйтесь. Это позволит отслеживать статус в реальном времени.",
      en: "Please sign in or create an account to complete your booking and track your application status.",
      cheese: "You must enter the cheese vaults to complete this order and monitor your aging cheese wheels."
    },
    login_req_btn: {
      ru: "Войти или зарегистрироваться",
      en: "Sign In / Sign Up",
      cheese: "Squeak or Chew an Account"
    },
    slots_avail: {
      ru: "Доступные интервалы на",
      en: "Available slots on",
      cheese: "Fresh milk sessions on"
    }
  },
  telegram: {
    title: {
      ru: "Интерактивный ИИ-ассистент",
      en: "Interactive AI Assistant",
      cheese: "Brie Bot Simulator 💬"
    },
    desc: {
      ru: "Протестируйте нашего умного Telegram-бота в реальном времени. Он обучен отвечать на сложные иммиграционные вопросы, рассчитывать стоимость услуг и помогать с загрузкой документов.",
      en: "Test our smart Telegram assistant in real-time. It is trained to resolve visa questions, calculate fees, and guide your document uploads.",
      cheese: "Squeak directly with our extra-mature Brie Bot. Powered by active yeast, it can snort out visa regulations, sniff bank ledger holes, and help squeeze documents."
    },
    sim_title: {
      ru: "Симулятор Telegram Бота",
      en: "Telegram Bot Simulator",
      cheese: "Whey-Fi Cheese Box"
    },
    status_online: {
      ru: "в сети",
      en: "online",
      cheese: "ripening"
    },
    suggest_title: {
      ru: "Выберите готовый запрос для проверки бота:",
      en: "Select a sample prompt for the bot:",
      cheese: "Select a crumb to feed the bot:"
    },
    suggest_dtv: {
      ru: "Какие условия для DTV?",
      en: "What are the DTV requirements?",
      cheese: "How sharp is Swiss DTV? 🇨🇭"
    },
    suggest_bank: {
      ru: "Как открыть счет в банке?",
      en: "How to open a Thai bank account?",
      cheese: "How to store my golden curds? 🏦"
    },
    suggest_calc: {
      ru: "Рассчитай визу + права",
      en: "Calculate Visa + Driving License",
      cheese: "Cheese Roll + Cheddar Bundle cost 🧀"
    },
    typing: {
      ru: "Бот печатает...",
      en: "Bot is typing...",
      cheese: "Mold is growing / Bot is nibbling..."
    },
    placeholder: {
      ru: "Задайте вопрос по релокации...",
      en: "Ask a relocation question...",
      cheese: "Squeak about your cheese troubles..."
    },
    send: {
      ru: "Отправить",
      en: "Send",
      cheese: "Chew"
    },
    auto_response: {
      ru: "Юрист-ассистент SIAMASSIST:",
      en: "SIAMASSIST Legal Assistant:",
      cheese: "Extra-Aged Brie Bot 🧀:"
    }
  },
  cabinet: {
    title: {
      ru: "Кабинет Экспата",
      en: "Expat Portal",
      cheese: "The Mouse Hole Vault 🐭"
    },
    desc: {
      ru: "Управляйте юридическими процессами, отслеживайте статус документов в реальном времени и общайтесь с вашим персональным юристом в защищенной среде.",
      en: "Manage your legal processes, track document status in real-time, and securely chat with your personal advisor.",
      cheese: "Govern your dairy factories, monitor your cheese fermentation, and securely consult with the Grand Cheesemonger."
    },
    sub_overview: {
      ru: "Обзор",
      en: "Overview",
      cheese: "The Pantry 🥖"
    },
    sub_docs: {
      ru: "Документы",
      en: "Documents",
      cheese: "Cheese Slices 📁"
    },
    sub_chat: {
      ru: "Чат с юристом",
      en: "Lawyer Chat",
      cheese: "Squeak Channel 💬"
    },
    sub_checklist: {
      ru: "Чек-лист релокации",
      en: "Relocation Checklist",
      cheese: "Cheese Board Plan 📋"
    },
    sec_tracker_title: {
      ru: "Интерактивный трекер визового процесса",
      en: "Interactive Visa Progress Tracker",
      cheese: "Interactive Whey-to-Cheese Ripener"
    },
    sec_tracker_desc: {
      ru: "Этапы готовности вашей активной визы",
      en: "Completion stages for your active visa",
      cheese: "Ripening timeline for your premium block"
    },
    sec_visa_type: {
      ru: "Тип визы:",
      en: "Visa Type:",
      cheese: "Cheese Variety:"
    },
    sec_stage: {
      ru: "Текущий этап:",
      en: "Current Stage:",
      cheese: "Fermentation Stage:"
    },
    sec_updated: {
      ru: "Последнее обновление:",
      en: "Last updated:",
      cheese: "Last scraped:"
    },
    upload_doc_title: {
      ru: "Безопасная загрузка документов",
      en: "Secure Document Upload",
      cheese: "Secure Crumb Safe"
    },
    upload_doc_desc: {
      ru: "Загрузите скан-копии документов. Все файлы шифруются по стандарту SSL и передаются лично вашему юристу для предварительной проверки.",
      en: "Upload high-quality copies of your papers. Files are encrypted via SSL and directly delivered to your lawyer for secure evaluation.",
      cheese: "Drop your recipes here. All cheese pictures are protected from cats by double-bolt SSL traps and processed by our expert inspectors."
    },
    upload_choose_btn: {
      ru: "Выбрать файл",
      en: "Choose File",
      cheese: "Nibble File 📁"
    },
    upload_update_btn: {
      ru: "Обновить файл",
      en: "Update File",
      cheese: "Replace Slice 🔄"
    },
    status_pending: {
      ru: "Ожидает загрузки",
      en: "Pending Upload",
      cheese: "Needs Cheese ⭕"
    },
    status_review: {
      ru: "Проверка Юристом",
      en: "Lawyer Review",
      cheese: "Sniffed by Inspector 🔍"
    },
    status_secured: {
      ru: "Защищено SSL",
      en: "SSL Secured",
      cheese: "Cat-Proof Vault"
    },
    status_uploaded: {
      ru: "Загружено:",
      en: "Uploaded:",
      cheese: "Aged on:"
    },
    dl_pdf: {
      ru: "Скачать PDF Чек-лист",
      en: "Download PDF Checklist",
      cheese: "Export Butter Ledger 📋"
    },
    chat_placeholder: {
      ru: "Напишите сообщение юристу...",
      en: "Write a message to your advisor...",
      cheese: "Squeak some words to the Cheesemonger..."
    }
  },
  auth: {
    title_login: {
      ru: "Вход в Личный Кабинет",
      en: "Sign In to Client Portal",
      cheese: "Squeak into Your Mouse Hole 🔑"
    },
    title_reg: {
      ru: "Регистрация Клиента",
      en: "Client Registration",
      cheese: "Dig a New Mouse Hole 🧀"
    },
    email_lbl: {
      ru: "Электронная почта",
      en: "Email Address",
      cheese: "Mouthful Email 📧"
    },
    pass_lbl: {
      ru: "Пароль доступа",
      en: "Access Password",
      cheese: "Mouse Trap Code 🔒"
    },
    name_lbl: {
      ru: "Ваше имя и фамилия",
      en: "Full Name",
      cheese: "Mouse Name"
    },
    submit_login: {
      ru: "Войти в кабинет",
      en: "Access Portal",
      cheese: "Unlock Vault 🔓"
    },
    submit_reg: {
      ru: "Создать аккаунт",
      en: "Create Account",
      cheese: "Melt Account"
    },
    toggle_login: {
      ru: "Уже есть аккаунт? Войти",
      en: "Already have an account? Sign In",
      cheese: "Already have a hole? Squeak here"
    },
    toggle_reg: {
      ru: "Нет аккаунта? Зарегистрироваться за 10 секунд",
      en: "No account? Register in 10 seconds",
      cheese: "New mouse? Dig a hole in 10 seconds!"
    }
  },
  faqs: {
    title: {
      ru: "Полезные Знания и FAQ",
      en: "Knowledge Hub & FAQ",
      cheese: "Encyclopedia of Holes & Rinds 🧀"
    },
    subtitle: {
      ru: "Отвечаем на популярные вопросы экспатов об иммиграционном законодательстве Таиланда в 2026 году",
      en: "Answering popular expat questions about Thai immigration laws in 2026",
      cheese: "Answering critical questions about how to avoid traps and age your blocks in Thailand in 2026"
    }
  },
  footer: {
    desc: {
      ru: "Профессиональная юридическая и организационная поддержка иностранцев в Таиланде. Получение виз, открытие банковских счетов, аренда недвижимости и открытие бизнеса под ключ.",
      en: "Professional legal and organizational assistance for expats in Thailand. Secure long-term visas, open accounts, register companies, and find premium accommodation.",
      cheese: "High-grade dairy and bureaucratic assistance for foreign mice in Thailand. Cheese wheel rollers, Swiss licenses, Kasikorn butter savings, and cat protection."
    },
    copyright: {
      ru: "© 2026 SIAMASSIST. Все права защищены. Юридическое сопровождение в соответствии с законами Королевства Таиланд.",
      en: "© 2026 SIAMASSIST. All rights reserved. Professional support compliant with the laws of the Kingdom of Thailand.",
      cheese: "© 2026 SIAMCHEDDAR. All rinds reserved. Squeaking compliant with the Dairy Council of Thailand."
    }
  },
  news: {
    title: {
      ru: "Новости Иммиграции в Реальном Времени",
      en: "Real-Time Immigration News",
      cheese: "Fresh Squeaks on Golden Passes 🧀"
    },
    subtitle: {
      ru: "Актуальные изменения правил въезда и виз, полученные напрямую из официальных источников с помощью ИИ и Google Search Grounding",
      en: "Up-to-date visa changes and entry rules fetched directly from official sources using AI and Google Search Grounding",
      cheese: "Hot off the press from the Master Cheesemongers using extra-matured search curds!"
    },
    refresh_btn: {
      ru: "Обновить новости",
      en: "Refresh News",
      cheese: "Churn the Butter 🧈"
    },
    loading: {
      ru: "ИИ отправляет поисковые запросы и сканирует тайские иммиграционные указы...",
      en: "AI is dispatching search queries and scanning the latest Thai immigration decrees...",
      cheese: "Brie Bot is sniffing the winds and scanning the pastures for new milk rules..."
    },
    source: {
      ru: "Источник:",
      en: "Source:",
      cheese: "Liaison:"
    },
    grounding_links: {
      ru: "Официальные веб-источники Google Search:",
      en: "Official Google Search Web Sources:",
      cheese: "Cheddar links from Google search:"
    },
    read_more: {
      ru: "Читать первоисточник",
      en: "Read original source",
      cheese: "Nibble details 🐭"
    },
    live_badge: {
      ru: "ИИ LIVE ИСТОЧНИК",
      en: "AI LIVE SOURCE",
      cheese: "FRESHLY CHURNED"
    },
    error_key: {
      ru: "Для получения новостей в реальном времени укажите GEMINI_API_KEY в Settings > Secrets. Показана сохраненная копия:",
      en: "For live search grounding, configure GEMINI_API_KEY in Settings > Secrets. Showing saved copy:",
      cheese: "Cheddar key is missing in milk jar! Showing cold-storage process copy:"
    }
  }
};

// Translate services metadata on the fly
export function getTranslatedServices(lang: Language): Service[] {
  const isRu = lang === "ru";
  const isCheese = lang === "cheese";

  return [
    {
      id: "dtv-visa",
      title: isCheese 
        ? "Swiss Cheese Hole-Pass (DCP) 🧀" 
        : isRu 
          ? "Виза цифрового кочевника DTV" 
          : "Destination Thailand Visa (DTV)",
      description: isCheese
        ? "5-year multi-entry Swiss Cheese pass for digital cheese-grazers, remote curders, and fondue enthusiasts needing 180-day aging loops."
        : isRu
          ? "Многократная виза на 5 лет для удаленщиков, фрилансеров, а также участников спортивных и культурных курсов (Муай Тай, тайская кулинария и др.)."
          : "Multi-entry 5-year visa for digital nomads, remote workers, freelancers, and cultural activity participants (Muay Thai, cooking courses, medical appointments).",
      category: "visa",
      costRange: isCheese ? "25,000 - 35,000 crumbs 🧀" : "25,000 - 35,000 THB",
      duration: isCheese ? "2 - 3 curdles ⏳" : isRu ? "2 - 3 недели" : "2 - 3 weeks",
      iconName: "Globe",
      fullDetails: isCheese
        ? [
            "5-Year Multi-entry mousepass with 180 days stay per bite.",
            "Can extend each entry by another 180 days at any Cheddar Office.",
            "Requires proof of remote grazing or freelance work outside the trap.",
            "Requires minimum financial savings of 500,000 golden crumbs.",
            "Perfect for programmers, designers, and professional cheese-nibblers."
          ]
        : isRu
          ? [
              "5-летняя мультивиза с периодом пребывания до 180 дней на каждый въезд.",
              "Возможность продления каждого въезда еще на 180 дней внутри Таиланда.",
              "Требуется подтверждение удаленной работы или фриланса за пределами Таиланда.",
              "Необходим остаток на банковском счете от 500,000 THB (или эквивалент).",
              "Идеально подходит для программистов, дизайнеров, маркетологов и учителей онлайн."
            ]
          : [
              "5-Year Multi-entry visa with 180 days stay per entry.",
              "Can extend each entry by another 180 days at Thai Immigration.",
              "Requires proof of remote employment or freelance work outside Thailand.",
              "Requires minimum financial savings of 500,000 THB (or equivalent in foreign currency).",
              "Perfect for programmers, designers, digital marketers, and online teachers."
            ],
      checklists: isCheese
        ? [
            "Mouse identity papers valid for at least 6 months",
            "Ledger showing 500,000 yellow curds or more",
            "Contract from a foreign mousehole outside Thailand",
            "Portfolio of cheese slices or registration of cheese-mongery",
            "Proof of nest in Thailand (rental agreement or cage booking)"
          ]
        : isRu
          ? [
              "Заграничный паспорт, действующий еще минимум 6 месяцев",
              "Выписка из банка с остатком не менее 500,000 THB",
              "Контракт с иностранной компанией или соглашения о фрилансе",
              "Портфолио выполненных работ или регистрация ИП за рубежом",
              "Подтверждение проживания в Таиланде (договор аренды или бронь)"
            ]
          : [
              "Passport valid for at least 6 months",
              "Bank statement showing 500,000 THB or more for the last 3-6 months",
              "Employment contract or freelance service agreements outside Thailand",
              "Portfolio of work or professional business registration (if freelancer)",
              "Proof of accommodation in Thailand (rental agreement or booking)"
            ]
    },
    {
      id: "elite-visa",
      title: isCheese
        ? "Double-Gloucester Premium Privilege 👑"
        : isRu
          ? "Элитная виза Privilege (Elite)"
          : "Thailand Privilege Visa (Elite)",
      description: isCheese
        ? "Ultra-exclusive residency for high-net-worth mice, offering 5 to 20 years of access to royal cream vaults with private butler trays."
        : isRu
          ? "Премиальная долгосрочная виза от 5 до 20 лет для инвесторов и состоятельных экспатов с полным VIP-обслуживанием."
          : "Premium long-term residency program for high-net-worth individuals, offering 5 to 20 years multi-entry visas with exclusive VIP privileges.",
      category: "visa",
      costRange: isCheese ? "900,000 - 5,000,000 curds 👑" : "900,000 - 5,000,000 THB",
      duration: isCheese ? "4 - 8 churns ⏳" : isRu ? "4 - 8 недель" : "4 - 8 weeks",
      iconName: "Crown",
      fullDetails: isCheese
        ? [
            "Choice of 5, 10, 15, or 20-year multiple-entry luxury mouse passes.",
            "Fast-track airport cheese trays upon arrival and departure.",
            "Access to luxury mouse lounges and cheese limousine transfers.",
            "Personal EPA (Elite Pampering Assistant) to guide you through cat areas.",
            "Annual mouse-health checks and golf/spa packages included."
          ]
        : isRu
          ? [
              "Выбор членства на 5, 10, 15 или 20 лет с многократным въездом.",
              "VIP-сопровождение через ускоренный паспортный контроль (Fast Track) в аэропортах.",
              "Доступ в лаунджи аэропортов и бесплатные трансферы на лимузине.",
              "Личные ассистенты (EPA) для помощи с государственными ведомствами и правами.",
              "Ежегодный медицинский чекап, спа-пакеты и игра в гольф включены в стоимость."
            ]
          : [
              "Choice of 5, 10, 15, or 20-year multiple-entry visa options.",
              "VIP Fast-track immigration service upon arrival and departure at major airports.",
              "Access to luxury airport lounges and complimentary limousine transfers.",
              "Personal elite assistants (EPA) to help with government offices and driving licenses.",
              "Annual health checks and golf/spa packages included in memberships."
            ],
      checklists: isCheese
        ? [
            "Prinstine mouse passport with 3-4 clean pages",
            "Clean trap record (no stealing of cheese in home country)",
            "Completed Privilege application form",
            "Full membership fee payment (900k - 5M curds)",
            "Cute photo of mouse face"
          ]
        : isRu
          ? [
              "Заграничный паспорт с минимум 3-4 пустыми страницами",
              "Справка об отсутствии судимости (с переводом и заверением)",
              "Заполненная анкета участника Thailand Privilege",
              "Квитанция об оплате членского взноса (от 900 тыс. до 5 млн бат)",
              "Цветная паспортная фотография"
            ]
          : [
              "Clean passport with at least 3-4 blank pages",
              "No criminal record in home country (notarized certificate)",
              "Completed Thailand Privilege membership application form",
              "Membership payment receipt (900K THB to 5M THB depending on tier)",
              "Color passport-sized photograph"
            ]
    },
    {
      id: "retirement-visa",
      title: isCheese
        ? "Aged Parmesan Retirement Visa 👴"
        : isRu
          ? "Пенсионная виза (Non-O / OA)"
          : "Thai Retirement Visa (Non-Immigrant O / OA)",
      description: isCheese
        ? "Renewable pass for mature wheels aged 50 and over wishing to crumble gracefully in sunny Siam without melting."
        : isRu
          ? "Годовая возобновляемая виза для иностранцев от 50 лет, желающих комфортно жить в Таиланде на пассивный доход."
          : "Annual renewable visa for foreigners aged 50 and over wishing to spend their golden years in Thailand without working.",
      category: "visa",
      costRange: isCheese ? "15,000 - 25,000 yellow blocks 🧀" : "15,000 - 25,000 THB",
      duration: isCheese ? "10 - 14 suns ☀️" : isRu ? "10 - 14 дней" : "10 - 14 days",
      iconName: "Heart",
      fullDetails: isCheese
        ? [
            "1-Year stay with unlimited aging loops inside Thailand.",
            "Requires mouse to be 50 seasons of age or older.",
            "Must satisfy financial criteria: 800,000 crumbs in bank OR monthly pension.",
            "Medical insurance certificate covering cat scratches and aging mold.",
            "Standard 90-day cheese-hole reports to the Immigration Department."
          ]
        : isRu
          ? [
              "Пребывание на 1 год с возможностью безграничного продления на месте.",
              "Кандидат должен быть старше 50 лет на момент подачи.",
              "Финансовые требования: 800,000 THB на счете в тайском банке ИЛИ доход от 65,000 THB в месяц.",
              "Медицинская страховка с покрытием от 100,000 USD (для визы OA).",
              "Стандартная отчетность каждые 90 дней (90-days reporting) в иммиграционную службу."
            ]
          : [
              "1-Year stay with unlimited renewable yearly terms inside Thailand.",
              "Requires applicant to be 50 years of age or older.",
              "Must satisfy financial criteria: 800,000 THB in a Thai bank account OR proof of monthly income of at least 65,000 THB.",
              "Medical insurance certificate covering at least 100,000 USD (for Non-OA variant).",
              "Requires standard 90-day address reporting to Thai Immigration."
            ],
      checklists: isCheese
        ? [
            "Old passport valid for 18 seasons",
            "Thai bank book showing 800,000 crumbs seasoned for 2 months",
            "Income certificate from foreign mousehole embassy",
            "Medical certificate from a Thai dairy doctor",
            "Recent photos of mouse ears (4x6 cm)"
          ]
        : isRu
          ? [
              "Заграничный паспорт, действующий не менее 18 месяцев",
              "Тайская сберкнижка с остатком 800,000 THB, лежащими на счете 2+ месяца",
              "Справка о доходе из посольства или пенсионный сертификат",
              "Медицинская справка из тайского госпиталя (не старше 3 месяцев)",
              "Свежие фотографии паспортного формата (4х6 см)"
            ]
          : [
              "Passport (valid for at least 18 months)",
              "Thai bank book showing 800,000 THB seasoned for at least 2 months",
              "Income certificate from Embassy or home country pension (if using income method)",
              "Medical certificate from a Thai hospital (no older than 3 months)",
              "Recent passport photos (4x6 cm)"
            ]
    },
    {
      id: "company-registration",
      title: isCheese
        ? "Cheese Factory Licensing & Melt Permit 🏢"
        : isRu
          ? "Регистрация бизнеса и Work Permit"
          : "Company Registration & Work Permit",
      description: isCheese
        ? "Complete legal setup for your cheese-mongering business, corporate butter account setup, and work authorization for foreign dairy-workers."
        : isRu
          ? "Полное юридическое оформление компании, открытие корпоративного счета и получение разрешения на работу для директоров."
          : "Complete legal setup for your business in Thailand, corporate bank account setup, and work authorization for foreign employees.",
      category: "legal",
      costRange: isCheese ? "45,000 - 75,000 chunks 🏬" : "45,000 - 75,000 THB",
      duration: isCheese ? "30 - 45 curdles ⏳" : isRu ? "30 - 45 дней" : "30 - 45 days",
      iconName: "Briefcase",
      fullDetails: isCheese
        ? [
            "Drafting and registering Memorandum of Butter Association (MOA).",
            "Setting up a private dairy limited (requires Thai mice majority for corporate safety).",
            "Registration with the Butter Revenue Department for Yeast Taxes.",
            "Opening a corporate bank account with local banks (Kasikorn, SCB).",
            "Sponsoring and obtaining Non-Immigrant B visa and digital Work Permit."
          ]
        : isRu
          ? [
              "Составление и регистрация Учредительного договора компании (MOA).",
              "Регистрация закрытого акционерного общества (с участием тайских акционеров).",
              "Постановка на учет в Налоговом департаменте (VAT и Налоговый номер).",
              "Открытие корпоративного банковского счета в Kasikorn Bank или SCB.",
              "Спонсорство неиммиграционной бизнес-визы (Non-B) и получение Work Permit."
            ]
          : [
              "Drafting and registering Memorandum of Association (MOA).",
              "Setting up a private limited company (requires Thai majority shareholders for general business).",
              "Registration with the Revenue Department (VAT and Tax ID registration).",
              "Opening a corporate bank account with local banks (Kasikorn, SCB).",
              "Sponsoring and obtaining Non-Immigrant B visa and digital Work Permit."
            ],
      checklists: isCheese
        ? [
            "3 proposed factory names in Thai and Cheese font",
            "Passport copies of foreign managers and curd experts",
            "ID copies of Thai mice shareholders",
            "Address details of the dairy warehouse with map to cheese fridge",
            "Photos of the office cheese shelves"
          ]
        : isRu
          ? [
              "Минимум 3 варианта названия компании на тайском и английском",
              "Копии паспортов иностранных директоров и учредителей",
              "Копии ID-карт и адресных регистраций тайских акционеров",
              "Адрес офиса компании (с согласием собственника здания)",
              "Карта проезда к офису и качественные фотографии здания снаружи и внутри"
            ]
          : [
              "At least 3 proposed company names in Thai and English",
              "Passport copies of all foreign directors and promoters",
              "Thai ID copies and house registrations of Thai shareholders",
              "Address details of the corporate office (with landlord consent letter)",
              "Map of the business location and photos of the office building"
            ]
    },
    {
      id: "bank-account",
      title: isCheese
        ? "Cheddar Vault & Card setup 💳"
        : isRu
          ? "Открытие личного банковского счета"
          : "Personal Thai Bank Account Opening",
      description: isCheese
        ? "No-hassle setup of personal cheese-saving vaults with debit cards that can slice through soft Brie."
        : isRu
          ? "Быстрое открытие счетов в надежных банках Таиланда (Kasikorn, Bangkok Bank) с дебетовой картой и мобильным приложением."
          : "Quick and hassle-free setup of personal savings bank accounts with debit cards and robust mobile banking applications.",
      category: "legal",
      costRange: isCheese ? "4,000 - 6,000 crumbs" : "4,000 - 6,000 THB",
      duration: isCheese ? "1 sun ☀️" : isRu ? "1 день" : "1 day",
      iconName: "CreditCard",
      fullDetails: isCheese
        ? [
            "Account setup with top-tier Thai banks (Bangkok Bank or Kasikorn Bank).",
            "Instant issuance of a VISA or Mastercard debit card to buy cheese.",
            "Full activation of Thai Mobile Banking app for cheese transfers.",
            "Can be opened even on tourist visas, Swiss DTV, or student passes.",
            "Official address certification required by banks provided."
          ]
        : isRu
          ? [
              "Открытие счета в ведущих тайских банках (Bangkok Bank или Kasikorn Bank).",
              "Мгновенный выпуск международной дебетовой карты VISA или Mastercard.",
              "Полная активация тайского мобильного приложения (переводы, оплата по QR).",
              "Возможность открытия на туристической визе, DTV или учебной визе.",
              "Подготовка необходимой для банков справки о резиденции (Residence Certificate)."
            ]
          : [
              "Account setup with top-tier Thai banks (Bangkok Bank or Kasikorn Bank).",
              "Instant issuance of a VISA or Mastercard debit card valid internationally.",
              "Full activation of Thai Mobile Banking app (transfer, scan QR to pay, etc.).",
              "Can be opened even on tourist visas, DTV, or student visas without work permits.",
              "Support with local address certification required by banks."
            ],
      checklists: isCheese
        ? [
            "Mouse passport with active entry stamp",
            "Residence Certificate from Dairy Immigration or lease agreement",
            "Thai SIM card for OTP notifications",
            "Minimum initial deposit of 500 - 1,000 crumbs"
          ]
        : isRu
          ? [
              "Оригинал паспорта с действующим штампом въезда",
              "Справка о резиденции (Residence Certificate) или договор аренды",
              "Тайская сим-карта для авторизации мобильного банка и СМС-паролей",
              "Минимальный депозит для активации счета (500 - 1,000 THB)"
            ]
          : [
              "Passport with current valid Thai visa stamp",
              "Certificate of Residence from Immigration or Embassy OR lease agreement",
              "Thai mobile phone number (for OTP and mobile app activation)",
              "Minimum initial deposit of 500 - 1,000 THB"
            ]
    },
    {
      id: "driving-license",
      title: isCheese
        ? "Cheese Wheels Rolling Permit 🚗"
        : isRu
          ? "Получение тайских водительских прав"
          : "Thai Driving License Conversion",
      description: isCheese
        ? "Convert your national driver's license or international driving permit (IDP) into an official Thai driving license."
        : isRu
          ? "Конвертация ваших национальных или международных водительских прав в официальное тайское водительское удостоверение."
          : "Convert your national driver's license or international driving permit (IDP) into an official Thai driving license.",
      category: "legal",
      costRange: isCheese ? "3,500 - 5,000 crumbs" : "3,500 - 5,000 THB",
      duration: isCheese ? "1 - 2 suns ☀️" : isRu ? "1 - 2 дня" : "1 - 2 days",
      iconName: "FileText",
      fullDetails: isCheese
        ? [
            "Preparation of Department of Land Cheese (DLC) applications.",
            "Obtaining the required official Certificate of Residence from Immigration.",
            "Scheduling and accompanying you to the Land Cheese Office.",
            "Fast-track assistance with medical certificate issuance.",
            "Skip long lines; complete physical reaction and cheese color test in 2 hours."
          ]
        : isRu
          ? [
              "Подготовка пакета документов для Департамента наземного транспорта (DLT).",
              "Получение официальной справки о резиденции (Residence Certificate) в иммиграции.",
              "Запись на прием и личное сопровождение в ведомство транспорта.",
              "Помощь с быстрым оформлением медицинской справки в клинике.",
              "Прохождение обязательных тестов на реакцию и цветовосприятие без длинных очередей за 2 часа."
            ]
          : [
              "Preparation of Department of Land Transport (DLT) application forms.",
              "Obtaining the required official Certificate of Residence from Immigration.",
              "Scheduling and accompanying you to the Land Transport Office.",
              "Fast-track assistance with medical certificate issuance.",
              "Skip long queues and complete reaction tests, color-blindness tests in 2 hours."
            ],
      checklists: isCheese
        ? [
            "Original passport with entry stamp",
            "Valid national driving license from mousehole country",
            "Certificate of Residence or work card",
            "Medical certificate from a Thai clinic (standard 100 crumbs)",
            "International Driving Permit (IDP) if national is not in English"
          ]
        : isRu
          ? [
              "Оригинал заграничного паспорта с действующей визой/штампом",
              "Действующие национальные права (с переводом на англ. или тайский)",
              "Справка о резиденции (Residence Certificate) или оригинал Work Permit",
              "Медицинская справка из клиники (стандартная справка за 100 бат)",
              "Международное водительское удостоверение (МВУ), если национальные права не на англ."
            ]
          : [
              "Original passport with valid visa stamp + copies",
              "Valid national driving license from home country (translated to English if not in English)",
              "Certificate of Residence from Thai Immigration OR Work Permit",
              "Medical certificate from a Thai clinic (standard 100 THB certificate)",
              "International Driving Permit (IDP) if national license is not in English"
            ]
    },
    {
      id: "condo-rental",
      title: isCheese
        ? "Mouse Trap Property Hunting 🐭"
        : isRu
          ? "Аренда жилья и помощь с контрактом"
          : "Relocation & Property Search",
      description: isCheese
        ? "Find expat-friendly mouseholes, cheese cellars, and luxury traps in Bangkok, Phuket, or Chiang Mai."
        : isRu
          ? "Поиск апартаментов, проверка договоров аренды для защиты депозита, подключение интернета и коммунальных услуг."
          : "Expat-friendly property hunt, legal lease agreements review, and utility connections setup in Bangkok, Phuket, or Chiang Mai.",
      category: "living",
      costRange: isCheese ? "Free (paid by landlord cheese)" : isRu ? "Бесплатно (комиссию платит владелец)" : "Free (Commission paid by landlord)",
      duration: isCheese ? "3 - 7 suns ☀️" : isRu ? "3 - 7 дней" : "3 - 7 days",
      iconName: "Home",
      fullDetails: isCheese
        ? [
            "Personalized search of mouseholes and boxes based on your budget and favorite pantry.",
            "Accompanied physical or virtual tours via WhatsApp/Telegram video.",
            "Drafting of standard contracts protecting your cheddar security deposit.",
            "Setup of high-speed fiber internet and help paying electricity/water bills.",
            "Immigration TM30 reporting submitted automatically on your behalf."
          ]
        : isRu
          ? [
              "Персональный поиск кондоминиумов и вилл под ваш бюджет и пожелания по району.",
              "Организация физических просмотров или качественных онлайн-туров по видео.",
              "Составление и проверка договора аренды на англо-тайском для защиты вашего депозита.",
              "Помощь с подключением скоростного интернета и настройкой оплаты коммунальных услуг.",
              "Автоматическая отправка уведомления иммиграционной службы (TM30) от владельца."
            ]
          : [
              "Personalized search of condos and villas based on your budget and preferred neighborhood.",
              "Accompanied physical or virtual tours via WhatsApp/Telegram video.",
              "Drafting and review of standard Thai-English tenancy contracts protecting your security deposit.",
              "Setup of high-speed fiber internet and guidance on paying electricity/water bills.",
              "Immigration TM30 reporting submitted automatically on your behalf."
            ],
      checklists: isCheese
        ? [
            "Mouse passport copy",
            "Visa status details",
            "Move-in date",
            "First month rent + 2-month security deposit in golden crumbs"
          ]
        : isRu
          ? [
              "Копия заграничного паспорта",
              "Информация о визовом статусе",
              "Предпочтительная дата заселения",
              "Арендная плата за первый месяц + 2 месяца страхового депозита"
            ]
          : [
              "Passport copy",
              "Visa status details",
              "Required move-in date",
              "First month's rent + 2-month security deposit in cash or bank transfer"
            ]
    }
  ];
}
