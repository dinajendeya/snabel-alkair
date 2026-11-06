import React, { useRef, useEffect } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { Bell, Check, CheckCheck, Clock, ShieldAlert, Award, FileText } from 'lucide-react';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ isOpen, onClose }) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const formatTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const diffMs = Date.now() - d.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      return d.toLocaleDateString();
    } catch {
      return '';
    }
  };

  const getIcon = (title: string) => {
    if (title.includes('Approved')) return <Award className="w-4 h-4 text-emerald-600" />;
    if (title.includes('Declined') || title.includes('Update')) return <ShieldAlert className="w-4 h-4 text-amber-600" />;
    if (title.includes('Submitted')) return <FileText className="w-4 h-4 text-blue-600" />;
    return <Bell className="w-4 h-4 text-emerald-600" />;
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
    >
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center space-x-2">
          <Bell className="w-4 h-4 text-emerald-600" />
          <h3 className="font-semibold text-slate-800 text-sm">Notifications</h3>
          {unreadCount > 0 && (
            <span className="bg-emerald-600 text-white text-xs px-2 py-0.5 rounded-full font-medium">
              {unreadCount} new
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => markAllAsRead()}
            className="text-xs text-emerald-700 hover:text-emerald-800 font-medium flex items-center space-x-1 hover:underline"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark all read</span>
          </button>
        )}
      </div>

      <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            <Bell className="w-8 h-8 mx-auto mb-2 text-slate-300 stroke-[1.5]" />
            <p className="text-sm">No notifications yet</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 transition-colors hover:bg-slate-50/80 flex items-start space-x-3 ${
                !n.isRead ? 'bg-emerald-50/40' : 'bg-white'
              }`}
            >
              <div className="mt-0.5 p-1.5 rounded-lg bg-slate-100 flex-shrink-0">
                {getIcon(n.title)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className={`text-xs font-semibold ${!n.isRead ? 'text-slate-900' : 'text-slate-700'}`}>
                    {n.title}
                  </p>
                  <span className="text-[10px] text-slate-400 flex items-center">
                    <Clock className="w-2.5 h-2.5 mr-1" />
                    {formatTime(n.createdAt)}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
                {!n.isRead && (
                  <button
                    onClick={() => markAsRead(n.id)}
                    className="mt-2 text-[11px] text-emerald-700 hover:text-emerald-900 font-medium flex items-center space-x-1"
                  >
                    <Check className="w-3 h-3" />
                    <span>Mark as read</span>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

