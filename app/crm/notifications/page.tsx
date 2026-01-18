
"use client";
import React, { useState } from "react";
import {
  CheckCheck,
  Search,
  User,
  TrendingUp,
  MessageSquare,
  Calendar,
  AlertCircle,
  Mail,
  FileText,
  ChevronsRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "@/components/logo/logo";

const NotificationsPage = () => {
  const [activeFilter, setActiveFilter] = useState("All");

  const filters = [
    { name: "All", count: 18 },
    { name: "Unread", count: 2 },
    { name: "System", count: 0 },
    { name: "Leads", count: 0 },
  ];

  const notifications = [
    {
      group: "Today",
      items: [
        {
          id: 1,
          title: "New lead assigned to you",
          description:
            "Sarah Johnson from TechCorp Inc. has been assigned to your pipeline",
          time: "15m ago",
          type: "lead",
          icon: User,
          iconBg: "bg-blue-100",
          iconColor: "text-blue-600",
          border: "border-l-blue-500",
          isUnread: true,
          isNew: true,
        },
        {
          id: 2,
          title: "Monthly sales target achieved",
          description:
            "Congratulations! You've reached 105% of your monthly target",
          time: "45m ago",
          type: "system",
          icon: TrendingUp,
          iconBg: "bg-green-100",
          iconColor: "text-green-600",
          border: "border-l-green-500",
          isUnread: true,
          isNew: true,
        },
        {
          id: 3,
          title: "Follow-up reminder",
          description:
            "Sarah Johnson from TechCorp Inc. has been assigned to your pipeline",
          time: "2h ago",
          type: "reminder",
          icon: MessageSquare,
          iconBg: "bg-yellow-100",
          iconColor: "text-yellow-600",
          border: "border-l-blue-500", // Using blue based on image for reminder, or could be yellow
          isUnread: false,
          isNew: false,
        },
      ],
    },
    {
      group: "Yesterday",
      items: [
        {
          id: 4,
          title: "Meeting scheduled",
          description:
            "Demo call with Robert Miller scheduled for tomorrow at 2:00 PM",
          time: "Yesterday",
          type: "calendar",
          icon: Calendar,
          iconBg: "bg-blue-100",
          iconColor: "text-blue-600",
          border: "border-l-green-500", // Greenish in image
          isUnread: false,
          isNew: false,
        },
        {
          id: 5,
          title: "System maintenance scheduled",
          description:
            "CRM will be under maintenance on Sunday from 2:00 AM to 4:00 AM",
          time: "Yesterday",
          type: "system",
          icon: AlertCircle,
          iconBg: "bg-green-100",
          iconColor: "text-green-600",
          border: "border-l-green-500",
          isUnread: false,
          isNew: false,
        },
      ],
    },
    {
      group: "Earlier",
      items: [
        {
          id: 6,
          title: "Email campaign sent",
          description:
            "Your Q1 newsletter was sent to 1,234 leads successfully",
          time: "2d ago",
          type: "email",
          icon: Mail,
          iconBg: "bg-blue-100",
          iconColor: "text-blue-600",
          border: "border-l-yellow-400",
          isUnread: false,
          isNew: false,
        },
        {
          id: 7,
          title: "Weekly report ready",
          description:
            "Your weekly performance report is now available to view",
          time: "3d ago",
          type: "report",
          icon: TrendingUp,
          iconBg: "bg-green-100",
          iconColor: "text-green-600",
          border: "border-l-yellow-400",
          isUnread: false,
          isNew: false,
        },
      ],
    },
  ];

  return (
    <div className="p-4 min-h-screen font-sans">
      <div className="flex items-center justify-between">
  <div className="flex items-center gap-1">
          <Logo width={160}/>
          <ChevronsRight className="text-[#8CE553] w-[18px] h-[18px]" />
          <p className="text-primary text-sm font-semibold">CRM</p>
        </div>

  <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-full text-blue-500 text-sm font-medium italic shadow-sm hover:shadow transition-shadow">
            <CheckCheck className="w-4 h-4" />
            Mark all as read
          </button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search notifications..."
              className="pl-9 pr-4 py-2 bg-white border-none rounded-full text-sm w-64 shadow-sm outline-none focus:ring-1 focus:ring-blue-100"
            />
          </div>
        </div>
      </div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between my-8  gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 italic">
            Notifications
          </h1>
          <p className="text-gray-500 italic text-sm mt-1">
            Stay updated without distraction
          </p>
        </div>

      
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-8 bg-white p-1 rounded-full w-fit shadow-sm">
        {filters.map((filter) => (
          <button
            key={filter.name}
            onClick={() => setActiveFilter(filter.name)}
            className={cn(
              "px-6 py-1.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 italic",
              activeFilter === filter.name
                ? "bg-blue-50 text-blue-600"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-50",
            )}
          >
            {filter.name}
            {filter.count > 0 && (
              <span
                className={cn(
                  "text-[10px] px-1.5 py-0.5 rounded-md font-bold",
                  activeFilter === filter.name
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-600",
                )}
              >
                {filter.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-8">
        {notifications.map((group) => (
          <div key={group.group}>
            <h3 className="text-gray-700 font-medium italic mb-4">
              {group.group}
            </h3>
            <div className="space-y-3">
              {group.items.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    "bg-white rounded-xl p-4 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden border-l-4",
                    item.border, // Dynamic left border color
                  )}
                >
                  {/* Icon */}
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                      item.iconBg,
                    )}
                  >
                    <item.icon className={cn("w-5 h-5", item.iconColor)} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                      <h4 className="font-bold text-gray-900 italic text-base">
                        {item.title}
                      </h4>
                    </div>
                    <p className="text-gray-500 text-sm italic mb-2">
                      {item.description}
                    </p>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-400 italic font-medium">
                        {item.time}
                      </span>
                      {item.isNew && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-[10px] font-bold rounded-md uppercase tracking-wider">
                          New
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Status Indicator */}
                  {item.isUnread && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full shadow-sm ring-2 ring-blue-50"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;
