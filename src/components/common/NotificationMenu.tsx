import React, { useState, useRef, useEffect } from 'react';
import { Bell, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { useAppStore } from '../../lib/store';
import { cn, formatDate } from '../../utils/helpers';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';

export const NotificationMenu: React.FC = () => {
  const { notifications, markAsRead } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const handleNotificationClick = (id: string) => {
    markAsRead(id);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:text-slate-300 hover:bg-gray-100 rounded-full transition-colors focus:outline-none"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 block w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 w-80 mt-2 origin-top-right bg-white dark:bg-slate-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{t("notifications.title") || "Notifications"}</h3>
            {unreadCount > 0 && (
              <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 px-2 py-0.5 rounded-full font-medium">
                {unreadCount} {t("notifications.new") || "new"}
              </span>
            )}
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500 dark:text-slate-400">
                {t("notifications.empty") || "No notifications"}
              </div>
            ) : (
              <ul className="divide-y divide-gray-100 dark:divide-slate-700">
                {notifications.map((notification) => (
                  <li 
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification.id)}
                    className={cn(
                      "p-4 hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer transition-colors",
                      !notification.read ? "bg-blue-50/50 dark:bg-slate-700/50" : ""
                    )}
                  >
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn("text-sm font-medium", !notification.read ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-slate-300")}>
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">
                          {formatDate(notification.date)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};