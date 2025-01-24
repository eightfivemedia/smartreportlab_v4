import React, { useState } from 'react';
import { Bell, X, FileText, Users, MessageSquare, Trash2, ChevronRight } from 'lucide-react';

export interface Notification {
  id: number;
  icon: any;
  title: string;
  message: string;
  time: string;
  unread: boolean;
}

interface NotificationsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}

export const defaultNotifications = [
  {
    id: 1,
    icon: FileText,
    title: 'New Report Generated',
    message: 'Q1 Marketing Report is ready for review',
    time: '2 min ago',
    unread: true,
  },
  {
    id: 2,
    icon: Users,
    title: 'Team Member Invited',
    message: 'Sarah Johnson accepted your invitation',
    time: '1 hour ago',
    unread: true,
  },
  {
    id: 3,
    icon: MessageSquare,
    title: 'New Comment',
    message: 'John left a comment on Monthly Report with detailed feedback about the performance metrics and suggestions for improvement. Click to view the full comment and respond.',
    time: '3 hours ago',
    unread: false,
  },
];

const NotificationsPopup = ({ isOpen, onClose, notifications, setNotifications }: NotificationsPopupProps) => {
  // Initialize notifications if empty
  React.useEffect(() => {
    if (notifications.length === 0) {
      setNotifications(defaultNotifications);
    }
  }, []);

  const hasUnread = notifications.some(notification => notification.unread);
  const [expandedMessage, setExpandedMessage] = useState<number | null>(null);

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      unread: !hasUnread,
    })));
  };

  const handleMarkAsRead = (id: number) => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, unread: false } : notification
    ));
  };

  const handleDelete = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-brand-primary" />
          <h3 className="font-semibold">Notifications</h3>
          {hasUnread && (
            <span className="w-2 h-2 bg-brand-primary rounded-full"></span>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="max-h-[400px] overflow-y-auto">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            onClick={() => {
              handleMarkAsRead(notification.id);
              setExpandedMessage(expandedMessage === notification.id ? null : notification.id);
            }}
            className={`p-4 hover:bg-gray-50 cursor-pointer ${
              notification.unread ? 'bg-brand-light/20' : ''
            }`}
          >
            <div className="flex gap-3">
              <notification.icon className="w-5 h-5 text-brand-primary flex-shrink-0 mt-1" />
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-medium text-sm flex items-center gap-2">
                      {notification.title}
                      {notification.unread && (
                        <span className="w-2 h-2 bg-brand-primary rounded-full"></span>
                      )}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {expandedMessage === notification.id
                        ? notification.message
                        : notification.message.length > 100
                        ? `${notification.message.slice(0, 100)}...`
                        : notification.message}
                    </p>
                    {notification.message.length > 100 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedMessage(expandedMessage === notification.id ? null : notification.id);
                        }}
                        className="text-brand-primary text-xs mt-1 flex items-center hover:underline"
                      >
                        {expandedMessage === notification.id ? 'Show less' : 'Read more'}
                        <ChevronRight className="w-3 h-3 ml-1" />
                      </button>
                    )}
                    <span className="text-xs text-gray-400 block mt-1">{notification.time}</span>
                  </div>
                  <button
                    onClick={(e) => handleDelete(notification.id, e)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-3 border-t border-gray-200 text-center">
        <button
          onClick={handleMarkAllRead}
          className="text-brand-primary text-sm hover:text-brand-primary-dark transition-colors"
        >
          {hasUnread ? 'Mark all as read' : 'Mark all as unread'}
        </button>
      </div>
    </div>
  );
};

export default NotificationsPopup;