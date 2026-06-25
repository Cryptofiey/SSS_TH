import React from "react";
import { Bell, Check, Trash2, Info, AlertTriangle, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import { Notification } from "../types";

interface NotificationBellProps {
  notifications: Notification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onSimulateNotification: (title: string, message: string, type: 'info' | 'success' | 'warning' | 'alert') => void;
}

export default function NotificationBell({
  notifications,
  onMarkRead,
  onMarkAllRead,
  onSimulateNotification
}: NotificationBellProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const unreadNotifications = notifications.filter((n) => !n.read);
  const unreadCount = unreadNotifications.length;

  // Handle click outside to close dropdown
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }) + " " + date.toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
    } catch {
      return "Только что";
    }
  };

  const handleSimulate = (type: 'visa_approved' | 'docs_error' | 'meeting_alert') => {
    if (type === 'visa_approved') {
      onSimulateNotification(
        "Виза Одобрена! 🎉🇹🇭",
        "Ваш паспорт получил штамп Destination Thailand Visa (DTV). Файл визы отправлен на Email.",
        "success"
      );
    } else if (type === 'docs_error') {
      onSimulateNotification(
        "Ошибка верификации документов ⚠️",
        "Пожалуйста, загрузите выписку из банка повторно. Предоставленный файл поврежден или не открывается.",
        "warning"
      );
    } else if (type === 'meeting_alert') {
      onSimulateNotification(
        "Запись подтверждена! 📅",
        "Индивидуальная визовая консультация с юристом подтверждена на завтра в 14:00.",
        "info"
      );
    }
  };

  return (
    <div className="relative" ref={dropdownRef} id="notification-bell-container">
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 text-stone-500 hover:text-siam-teal rounded-full hover:bg-stone-100 transition-all duration-200 cursor-pointer focus:outline-hidden"
        title="Уведомления"
        id="notification-bell-btn"
      >
        <Bell className={`h-5 w-5 ${unreadCount > 0 ? "animate-swing" : ""}`} />
        
        {unreadCount > 0 && (
          <span 
            className="absolute top-1.5 right-1.5 h-5 w-5 bg-red-500 text-white font-mono text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white animate-pulse"
            id="notification-unread-count"
          >
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Box */}
      {isOpen && (
        <div 
          className="absolute right-0 mt-3 w-80 sm:w-96 bg-white border border-stone-200 rounded-2xl shadow-xl z-50 overflow-hidden"
          id="notification-dropdown"
        >
          {/* Header */}
          <div className="px-4 py-3 bg-stone-50 border-b border-stone-150 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-stone-950 font-serif">Уведомления</h4>
              <p className="text-[10px] text-stone-500 font-mono">
                Непрочитанных: {unreadCount}
              </p>
            </div>
            
            {unreadCount > 0 && (
              <button
                onClick={() => {
                  onMarkAllRead();
                }}
                className="inline-flex items-center space-x-1 text-[11px] font-semibold text-siam-teal hover:text-siam-teal-dark bg-white hover:bg-stone-50 border border-stone-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                id="notification-mark-all-read-btn"
              >
                <Check className="h-3 w-3" />
                <span>Прочитать все</span>
              </button>
            )}
          </div>

          {/* Quick-Test Interactive simulation buttons */}
          <div className="p-3 bg-stone-50/50 border-b border-stone-150 space-y-1.5">
            <span className="text-[9px] font-mono font-bold tracking-wider text-stone-400 uppercase block">
              Быстрый тест уведомлений (Симулятор)
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => handleSimulate('visa_approved')}
                className="inline-flex items-center space-x-1 px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] font-medium rounded-md transition-colors cursor-pointer"
              >
                <Sparkles className="h-2.5 w-2.5" />
                <span>Одобрить визу</span>
              </button>
              <button
                onClick={() => handleSimulate('docs_error')}
                className="inline-flex items-center space-x-1 px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 text-[10px] font-medium rounded-md transition-colors cursor-pointer"
              >
                <Sparkles className="h-2.5 w-2.5" />
                <span>Ошибка док-тов</span>
              </button>
              <button
                onClick={() => handleSimulate('meeting_alert')}
                className="inline-flex items-center space-x-1 px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-[10px] font-medium rounded-md transition-colors cursor-pointer"
              >
                <Sparkles className="h-2.5 w-2.5" />
                <span>Запись одобрена</span>
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-72 overflow-y-auto divide-y divide-stone-100" id="notification-list">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-stone-500 space-y-2">
                <Bell className="h-8 w-8 text-stone-300 mx-auto" />
                <p className="text-xs">У вас пока нет уведомлений</p>
                <p className="text-[10px] text-stone-400">Воспользуйтесь кнопками симуляции выше для теста системы</p>
              </div>
            ) : (
              notifications.map((notif) => {
                const isSuccess = notif.type === "success";
                const isWarning = notif.type === "warning";
                const isAlert = notif.type === "alert";

                let Icon = Info;
                let colorClass = "bg-blue-50 text-blue-600 border border-blue-100";
                if (isSuccess) {
                  Icon = CheckCircle2;
                  colorClass = "bg-emerald-50 text-emerald-600 border border-emerald-100";
                } else if (isWarning) {
                  Icon = AlertTriangle;
                  colorClass = "bg-amber-50 text-amber-600 border border-amber-100";
                } else if (isAlert) {
                  Icon = AlertCircle;
                  colorClass = "bg-red-50 text-red-600 border border-red-100";
                }

                return (
                  <div
                    key={notif.id}
                    onClick={() => {
                      if (!notif.read) {
                        onMarkRead(notif.id);
                      }
                    }}
                    className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer ${
                      notif.read ? "bg-white hover:bg-stone-50" : "bg-siam-sand/30 hover:bg-siam-sand/50"
                    }`}
                  >
                    {/* Status icon */}
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${colorClass}`}>
                      <Icon className="h-4.5 w-4.5" />
                    </div>

                    {/* Content */}
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <strong className={`text-xs block ${notif.read ? "text-stone-700" : "text-stone-900 font-semibold"}`}>
                          {notif.title}
                        </strong>
                        {!notif.read && (
                          <span className="h-1.5 w-1.5 bg-siam-teal rounded-full shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-stone-500 leading-snug">{notif.message}</p>
                      <span className="text-[9px] text-stone-400 font-mono block">
                        {formatTime(notif.createdAt)}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
