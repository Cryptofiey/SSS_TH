import React from "react";
import { Compass, MessageSquare, Calendar, User, LogOut, Menu, X, Landmark, Globe, Sun, Moon } from "lucide-react";
import { UserProfile, Notification } from "../types";
import NotificationBell from "./NotificationBell";
import { useLanguage } from "../LanguageContext";
import { useTheme } from "../ThemeContext";

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currentUser: UserProfile | null;
  onLogout: () => void;
  onOpenLogin: () => void;
  notifications: Notification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onSimulateNotification: (title: string, message: string, type: 'info' | 'success' | 'warning' | 'alert') => void;
}

export default function Navbar({
  currentTab,
  setCurrentTab,
  currentUser,
  onLogout,
  onOpenLogin,
  notifications,
  onMarkRead,
  onMarkAllRead,
  onSimulateNotification
}: NavbarProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLangOpen, setIsLangOpen] = React.useState(false);
  const { lang, setLang, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isLangOpen && !target.closest("#lang-switcher-container")) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isLangOpen]);

  const navItems = [
    { id: "landing", label: t("nav", "landing"), icon: Compass },
    { id: "calculator", label: t("nav", "calculator"), icon: Landmark },
    { id: "booking", label: t("nav", "booking"), icon: Calendar },
    { id: "telegram", label: t("nav", "telegram"), icon: MessageSquare },
  ];

  const getLangFlag = (currentLang: typeof lang) => {
    switch (currentLang) {
      case "ru": return "🇷🇺 RU";
      case "en": return "🇬🇧 EN";
      case "cheese": return "🧀 Cheese";
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800/80 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            {/* Logo */}
            <div 
              className="flex items-center space-x-3 cursor-pointer" 
              onClick={() => setCurrentTab("landing")}
              id="nav-logo"
            >
              <div className="h-11 w-11 bg-siam-teal rounded-xl flex items-center justify-center text-white shadow-md shadow-siam-teal/20">
                <span className="font-serif text-2xl font-bold tracking-wider text-siam-gold-light">
                  {lang === "cheese" ? "🧀" : "S"}
                </span>
              </div>
              <div>
                <span className="font-serif text-xl font-bold tracking-tight text-siam-teal-dark dark:text-stone-100 block">
                  {lang === "cheese" ? (
                    <>SIAM<span className="text-siam-gold ml-1">CHEDDAR</span></>
                  ) : (
                    <>SIAM<span className="text-siam-gold ml-1">ASSIST</span></>
                  )}
                </span>
                <span className="text-[10px] tracking-widest text-stone-400 font-mono uppercase block -mt-1">
                  {t("nav", "logo_sub")}
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentTab(item.id);
                      setIsOpen(false);
                    }}
                    id={`nav-item-${item.id}`}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "border-siam-gold text-siam-teal dark:text-siam-gold-light font-semibold"
                        : "border-transparent text-stone-500 dark:text-stone-400 hover:border-stone-300 dark:hover:border-stone-700 hover:text-stone-700 dark:hover:text-stone-200"
                    }`}
                  >
                    <Icon className="h-4.5 w-4.5 mr-1.5 opacity-80" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Language Switcher & User Section & Mobile Menu Button */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            
            {/* Theme Toggle Button */}
            <button
              id="theme-toggle-desktop"
              onClick={toggleTheme}
              className="p-2 rounded-full bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition-colors cursor-pointer border border-stone-200/40 dark:border-stone-850"
              title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
            >
              {theme === "light" ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4 text-siam-gold" />
              )}
            </button>

            {/* Language Switcher dropdown (Visible on all screens) */}
            <div className="relative" id="lang-switcher-container">
              <button 
                id="lang-switcher-toggle"
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-semibold bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition-colors border border-stone-200/40 dark:border-stone-800 cursor-pointer"
              >
                <Globe className="h-3 sm:h-3.5 w-3 sm:w-3.5 text-stone-500 dark:text-stone-450" />
                <span className="hidden xs:inline">{getLangFlag(lang)}</span>
                <span className="xs:hidden uppercase">{lang}</span>
              </button>
              
              {isLangOpen && (
                <div className="absolute right-0 mt-1.5 w-32 bg-white dark:bg-stone-900 rounded-2xl shadow-xl border border-stone-100 dark:border-stone-800 py-1.5 z-50">
                  <button
                    onClick={() => {
                      setLang("ru");
                      setIsLangOpen(false);
                    }}
                    className={`flex items-center w-full px-4 py-2 text-xs font-medium text-left transition-colors cursor-pointer ${lang === "ru" ? "text-siam-teal dark:text-siam-gold-light bg-siam-sand/60 dark:bg-stone-800/60 font-semibold" : "text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800"}`}
                  >
                    🇷🇺 Русский
                  </button>
                  <button
                    onClick={() => {
                      setLang("en");
                      setIsLangOpen(false);
                    }}
                    className={`flex items-center w-full px-4 py-2 text-xs font-medium text-left transition-colors cursor-pointer ${lang === "en" ? "text-siam-teal dark:text-siam-gold-light bg-siam-sand/60 dark:bg-stone-800/60 font-semibold" : "text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800"}`}
                  >
                    🇬🇧 English
                  </button>
                  <button
                    onClick={() => {
                      setLang("cheese");
                      setIsLangOpen(false);
                    }}
                    className={`flex items-center w-full px-4 py-2 text-xs font-medium text-left transition-colors cursor-pointer ${lang === "cheese" ? "text-siam-teal dark:text-siam-gold-light bg-siam-sand/60 dark:bg-stone-800/60 font-semibold animate-pulse" : "text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800"}`}
                  >
                    🧀 Cheese!
                  </button>
                </div>
              )}
            </div>

            <NotificationBell
              notifications={notifications}
              onMarkRead={onMarkRead}
              onMarkAllRead={onMarkAllRead}
              onSimulateNotification={onSimulateNotification}
            />

            {currentUser ? (
              <div className="hidden md:flex items-center space-x-4">
                <button
                  onClick={() => setCurrentTab("cabinet")}
                  id="nav-btn-cabinet"
                  className={`flex items-center space-x-2 px-4.5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
                    currentTab === "cabinet"
                      ? "bg-siam-teal text-white shadow-md shadow-siam-teal/20"
                      : "bg-siam-sand dark:bg-stone-800 text-siam-teal dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-750"
                  }`}
                >
                  <User className="h-4.5 w-4.5" />
                  <span>
                    {lang === "cheese" ? "🧀 Mouse Hole" : t("nav", "cabinet")} ({currentUser.name})
                  </span>
                </button>
                <button
                  onClick={onLogout}
                  id="nav-btn-logout"

                  className="p-2 text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
                  title={t("nav", "logout")}
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                id="nav-btn-login"
                className="hidden md:inline-flex items-center justify-center px-6 py-2.5 border border-transparent rounded-full text-sm font-medium text-white bg-siam-teal hover:bg-siam-teal-dark shadow-md shadow-siam-teal/15 transition-all duration-200 cursor-pointer"
              >
                {t("nav", "login_btn")}
              </button>
            )}

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                id="mobile-menu-btn"
                className="inline-flex items-center justify-center p-2 rounded-md text-stone-400 hover:text-stone-500 hover:bg-stone-100 focus:outline-hidden cursor-pointer"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-stone-900 border-t border-stone-100 dark:border-stone-800">
          <div className="pt-2 pb-3 space-y-1">
            
            {/* Mobile Language Selection Bar */}
            <div className="px-4.5 py-2 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between bg-stone-50/50 dark:bg-stone-950/40">
              <span className="text-xs text-stone-500 dark:text-stone-400 font-mono flex items-center">
                <Globe className="h-3 w-3 mr-1" /> LANGUAGE / ЯЗЫК:
              </span>
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => setLang("ru")}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-md cursor-pointer ${lang === "ru" ? "bg-siam-teal text-white" : "bg-stone-200/60 dark:bg-stone-800 text-stone-600 dark:text-stone-300"}`}
                >
                  RU
                </button>
                <button
                  onClick={() => setLang("en")}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-md cursor-pointer ${lang === "en" ? "bg-siam-teal text-white" : "bg-stone-200/60 dark:bg-stone-800 text-stone-600 dark:text-stone-300"}`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLang("cheese")}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-md cursor-pointer ${lang === "cheese" ? "bg-amber-500 text-white" : "bg-stone-200/60 dark:bg-stone-800 text-stone-600 dark:text-stone-300"}`}
                >
                  🧀 Cheese
                </button>
              </div>
            </div>

            {/* Mobile Theme Selection Bar */}
            <div className="px-4.5 py-2 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between bg-stone-50/50 dark:bg-stone-950/40">
              <span className="text-xs text-stone-500 dark:text-stone-400 font-mono flex items-center">
                {theme === 'light' ? <Moon className="h-3 w-3 mr-1 text-stone-400" /> : <Sun className="h-3 w-3 mr-1 text-siam-gold" />}
                THEME / ТЕМА:
              </span>
              <button
                onClick={toggleTheme}
                className="px-2.5 py-1 text-[11px] font-semibold rounded-md bg-stone-200/60 dark:bg-stone-800 text-stone-600 dark:text-stone-300 cursor-pointer"
                id="theme-toggle-mobile"
              >
                {theme === 'light' ? (lang === 'ru' ? 'Тёмная' : 'Dark') : (lang === 'ru' ? 'Светлая' : 'Light')}
              </button>
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentTab(item.id);
                    setIsOpen(false);
                  }}
                  id={`mobile-nav-item-${item.id}`}
                  className={`flex items-center w-full px-4.5 py-3 text-base font-medium border-l-4 transition-colors cursor-pointer ${
                    isActive
                      ? "bg-siam-sand border-siam-gold text-siam-teal font-semibold"
                      : "border-transparent text-stone-500 hover:bg-stone-50 hover:text-stone-700"
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3 text-stone-400" />
                  {item.label}
                </button>
              );
            })}
            
            {currentUser ? (
              <>
                <button
                  onClick={() => {
                    setCurrentTab("cabinet");
                    setIsOpen(false);
                  }}
                  id="mobile-nav-cabinet"
                  className={`flex items-center w-full px-4.5 py-3 text-base font-medium border-l-4 transition-colors cursor-pointer ${
                    currentTab === "cabinet"
                      ? "bg-siam-sand border-siam-teal text-siam-teal font-semibold"
                      : "border-transparent text-stone-500 hover:bg-stone-50"
                  }`}
                >
                  <User className="h-5 w-5 mr-3 text-stone-400" />
                  {lang === "cheese" ? "🧀 Mouse Hole" : t("nav", "cabinet")} ({currentUser.name})
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    setIsOpen(false);
                  }}
                  id="mobile-nav-logout"
                  className="flex items-center w-full px-4.5 py-3 text-base font-medium text-red-600 border-l-4 border-transparent hover:bg-red-50 cursor-pointer"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  {t("nav", "logout")}
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  onOpenLogin();
                  setIsOpen(false);
                }}
                id="mobile-nav-login"
                className="flex items-center w-full px-4.5 py-3 text-base font-medium text-siam-teal border-l-4 border-transparent hover:bg-stone-50 cursor-pointer"
              >
                <User className="h-5 w-5 mr-3" />
                {t("nav", "login_btn")}
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
