"use client";
import React, { useEffect, useRef } from "react";
import {
  X,
  CheckCheck,
  User,
  TrendingUp,
  Calendar,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface NotificationSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationSidebar = ({ isOpen, onClose }: NotificationSidebarProps) => {
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        isOpen
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const todayNotifications = [
    {
      id: 1,
      type: "assign",
      title: "New lead assigned",
      description: "Sarah Johnson from TechCorp has been assigned to you",
      time: "2m ago",
      icon: User,
      iconColor: "text-primary",
      iconBg: "bg-primary/10",
      isUnread: true,
    },
    {
      id: 2,
      type: "update",
      title: "Deal value updated",
      description: "Global Ventures deal increased to $45,000",
      time: "15m ago",
      icon: TrendingUp,
      iconColor: "text-green-500",
      iconBg: "bg-green-100",
      isUnread: true,
    },
    {
      id: 3,
      type: "reminder",
      title: "Meeting reminder",
      description: "Demo call with Michael Brown in 30 minutes",
      time: "30m ago",
      icon: Calendar,
      iconColor: "text-yellow-500",
      iconBg: "bg-yellow-100",
      isUnread: true,
    },
    {
      id: 4,
      type: "comment",
      title: "New comment on lead",
      description: 'Emily Chen commented on "ProDev Solutions"',
      time: "1h ago",
      icon: MessageSquare,
      iconColor: "text-primary",
      iconBg: "bg-primary/10",
      isUnread: true,
    },
  ];

  const yesterdayNotifications = [
    {
      id: 5,
      type: "assign",
      title: "New lead assigned",
      description: "Sarah Johnson from TechCorp has been assigned to you",
      time: "2m ago",
      icon: User,
      iconColor: "text-primary",
      iconBg: "bg-primary/10",
      isUnread: true,
    },
    {
      id: 6,
      type: "update",
      title: "Deal value updated",
      description: "Global Ventures deal increased to $45,000",
      time: "15m ago",
      icon: TrendingUp,
      iconColor: "text-green-500",
      iconBg: "bg-green-100",
      isUnread: true,
    },
    {
      id: 7,
      type: "reminder",
      title: "Meeting reminder",
      description: "Demo call with Michael Brown in 30 minutes",
      time: "30m ago",
      icon: Calendar,
      iconColor: "text-yellow-500",
      iconBg: "bg-yellow-100",
      isUnread: true,
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/20 z-40 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
      />

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={cn(
          "fixed top-0 right-0 h-full rounded-l-lg w-[400px] bg-white z-50 shadow-2xl transition-transform duration-300 transform flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Header */}
        <div className=" p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-gray-900">Notifications</h2>
            <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-full">
              7
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Mark as read */}
        <div className="px-4 border-b border-gray-100 pb-2  flex ">
          <button className="text-xs font-medium text-primary hover:text-primary/80 italic flex items-center gap-1">
            Mark all as read
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Today */}
          <div className="p-4">
            <h3 className="text-gray-400 text-sm italic mb-4">Today</h3>
            <div className="space-y-4">
              {todayNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex gap-3 group cursor-pointer"
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                      notification.iconBg,
                    )}
                  >
                    <notification.icon
                      className={cn("w-5 h-5", notification.iconColor)}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold text-gray-900 text-sm group-hover:text-primary transition-colors">
                        {notification.title}
                      </h4>
                      <span className="text-xs text-gray-400 italic shrink-0 ml-2">
                        {notification.time}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 italic truncate">
                      {notification.description}
                    </p>
                  </div>
                  {notification.isUnread && (
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Yesterday */}
          <div className="p-4 pt-0">
            <h3 className="text-gray-400 text-sm italic mb-4">Yesterday</h3>
            <div className="space-y-4">
              {yesterdayNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex gap-3 group cursor-pointer"
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                      notification.iconBg,
                    )}
                  >
                    <notification.icon
                      className={cn("w-5 h-5", notification.iconColor)}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold text-gray-900 text-sm group-hover:text-primary transition-colors">
                        {notification.title}
                      </h4>
                      <span className="text-xs text-gray-400 italic shrink-0 ml-2">
                        {notification.time}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 italic truncate">
                      {notification.description}
                    </p>
                  </div>
                  {notification.isUnread && (
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <Link
          href="/crm/notifications"
          className="p-4 border-t border-gray-100 text-center"
        >
          <button className="text-primary hover:text-primary/80 text-sm font-medium italic">
            View all notifications
          </button>
        </Link>
      </div>
    </>
  );
};

export default NotificationSidebar;
