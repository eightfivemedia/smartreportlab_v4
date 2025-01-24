import React from 'react';
import { Search, PanelLeft, PanelLeftClose, Bell } from 'lucide-react';
import NotificationsPopup from './NotificationsPopup';
import { useState } from 'react';
import { defaultNotifications } from './NotificationsPopup';

interface DashboardHeaderProps {
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (value: boolean) => void;
  isScrolled: boolean;
}

const DashboardHeader = ({ isSidebarCollapsed, setIsSidebarCollapsed, isScrolled }: DashboardHeaderProps) => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState(defaultNotifications);

  const hasUnreadNotifications = notifications.some(notification => notification.unread);

  return (
    <div className={`sticky top-0 bg-white z-40 transition-all duration-200 ${
      isScrolled ? 'shadow-[0_4px_12px_rgba(0,0,0,0.05)]' : 'border-b border-transparent'
    }`}>
      <div className="flex items-center gap-4 p-4 lg:px-8">
        {/* Panel Toggle */}
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="text-gray-500 hover:text-brand-primary transition-colors"
        >
          {isSidebarCollapsed ? (
            <PanelLeft className="w-6 h-6" />
          ) : (
            <PanelLeftClose className="w-6 h-6" />
          )}
        </button>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl ml-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search reports..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
            />
          </div>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative text-gray-500 hover:text-brand-primary transition-colors"
          >
            <Bell className="w-6 h-6" />
            {notifications.some(notification => notification.unread) && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
            )}
          </button>
          {isNotificationsOpen && (
            <NotificationsPopup
              isOpen={isNotificationsOpen}
              notifications={notifications}
              setNotifications={setNotifications}
              onClose={() => setIsNotificationsOpen(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;