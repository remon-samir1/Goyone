"use client";

import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  ListFilter,
  Upload,
  Users,
  Mail,
  DollarSign,
  Phone,
  CheckCircle2,
  Search,
  Check,
  ChevronsRight,
  CheckCheck,
} from "lucide-react";
import Header from "../header";
import Logo from "@/components/logo/logo";

// Activity type definition
type ActivityType = "lead" | "email" | "deal" | "call" | "task";

interface Activity {
  id: string;
  type: ActivityType;
  user: {
    name: string;
    initials: string;
    color: string;
  };
  action: string;
  badge?: {
    text: string;
    color: string;
  };
  description: string;
  metadata: {
    icon: "user" | "company";
    primary: string;
    secondary?: string;
    amount?: string;
  };
  timeAgo: string;
  timestamp: string;
}

const Page = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Sample activity data
  const activities: Activity[] = [
    {
      id: "1",
      type: "lead",
      user: {
        name: "Emma Wilson",
        initials: "EW",
        color: "bg-primary",
      },
      action: "created a new lead",
      badge: {
        text: "New Lead",
        color: "bg-[#8CE553]",
      },
      description: "Sarah Johnson from TechCorp added to pipeline",
      metadata: {
        icon: "user",
        primary: "Sarah Johnson",
        secondary: "TechCorp",
      },
      timeAgo: "15 minutes ago",
      timestamp: "10:30 AM",
    },
    {
      id: "2",
      type: "email",
      user: {
        name: "John Davis",
        initials: "JD",
        color: "bg-primary",
      },
      action: "sent an email",
      description: "Follow-up email sent to Michael Brown",
      metadata: {
        icon: "user",
        primary: "Michael Brown",
      },
      timeAgo: "30 minutes ago",
      timestamp: "10:15 AM",
    },
    {
      id: "3",
      type: "deal",
      user: {
        name: "Emma Wilson",
        initials: "EW",
        color: "bg-primary",
      },
      action: "updated deal value",
      description: "Global Ventures deal increased to $75,000",
      metadata: {
        icon: "company",
        primary: "Global Ventures",
        amount: "$75,000",
      },
      timeAgo: "15 minutes ago",
      timestamp: "10:30 AM",
    },
    {
      id: "4",
      type: "call",
      user: {
        name: "Sarah Miller",
        initials: "SM",
        color: "bg-primary",
      },
      action: "logged a call",
      description: "30-minute discovery call with Acme Inc",
      metadata: {
        icon: "company",
        primary: "Acme Inc",
      },
      timeAgo: "15 minutes ago",
      timestamp: "10:30 AM",
    },
    {
      id: "5",
      type: "task",
      user: {
        name: "John Davis",
        initials: "JD",
        color: "bg-primary",
      },
      action: "completed a task",
      badge: {
        text: "Completed",
        color: "bg-[#8CE553]",
      },
      description: "Proposal document for DataFlow Systems",
      metadata: {
        icon: "company",
        primary: "DataFlow Systems",
      },
      timeAgo: "15 minutes ago",
      timestamp: "10:30 AM",
    },
  ];

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case "lead":
        return (
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
            <Users className="w-5 h-5 text-primary" />
          </div>
        );
      case "email":
        return (
          <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
            <Mail className="w-5 h-5 text-purple-500" />
          </div>
        );
      case "deal":
        return (
          <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-[#8CE553]" />
          </div>
        );
      case "call":
        return (
          <div className="w-10 h-10 rounded-full bg-cyan-50 flex items-center justify-center">
            <Phone className="w-5 h-5 text-cyan-500" />
          </div>
        );
      case "task":
        return (
          <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-indigo-500" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="pb-14">
      {/* Custom Header Extension - Mark all as read and Search */}
      <div className="z-10 justify-between flex items-center gap-4">
        <div className="flex items-center gap-1">
          <Logo />
          <ChevronsRight className="text-[#8CE553] w-[18px] h-[18px]" />
          <p className="text-primary text-sm font-semibold">CRM</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2  bg-white px-4 py-2 rounded-full border border-stroke  text-primary hover:text-primary/80 transition-colors">
            <CheckCheck className="w-4 h-4" />
            <span className="text-sm font-medium italic ">
              Mark all as read
            </span>
          </button>
          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-stroke rounded-3xl w-[250px]">
            <Search className="text-placeholder w-4 h-4" />
            <input
              type="text"
              className="flex-1 border-none outline-none text-placeholder text-sm"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="mt-7">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-mainText text-[1.5rem] font-bold italic">
            Activity
          </h1>
          <p className="text-body text-sm italic mt-1">
            Everything happening across your system
          </p>
        </div>

        {/* Top Action Bar */}
        <div className="flex items-center gap-3 mb-6">
          {/* Filters Toggle Button */}
          <button
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className={`flex items-center gap-2 px-6 py-2.5 border rounded-3xl transition-colors ${
              isFiltersOpen
                ? "bg-primary border-primary text-white"
                : "bg-white border-stroke text-primary hover:bg-gray-50"
            }`}
          >
            <ListFilter className="w-4 h-4" />
            <span className="text-sm font-bold italic">Filters</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                isFiltersOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Export Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-stroke rounded-3xl hover:bg-gray-50 transition-colors">
                <Upload className="w-4 h-4 text-primary" />
                <span className="text-primary text-sm font-bold italic">
                  Export
                </span>
                <ChevronDown className="w-4 h-4 text-primary" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[150px]">
              <DropdownMenuItem>Export as CSV</DropdownMenuItem>
              <DropdownMenuItem>Export as PDF</DropdownMenuItem>
              <DropdownMenuItem>Export as Excel</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Expandable Filters Section */}
        {isFiltersOpen && (
          <div className="bg-white p-6 rounded-2xl border border-stroke mb-8 animate-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Activity Type */}
              <div className="space-y-2">
                <label className="text-mainText font-bold text-sm italic">
                  Activity Type
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="w-full flex items-center justify-between px-4 py-3 bg-[#F8FAFC] rounded-xl text-body text-sm hover:bg-gray-50 transition-colors">
                      <span className="italic">All Activities</span>
                      <ChevronDown className="w-4 h-4 text-placeholder" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    <DropdownMenuItem>All Activities</DropdownMenuItem>
                    <DropdownMenuItem>Leads</DropdownMenuItem>
                    <DropdownMenuItem>Emails</DropdownMenuItem>
                    <DropdownMenuItem>Deals</DropdownMenuItem>
                    <DropdownMenuItem>Calls</DropdownMenuItem>
                    <DropdownMenuItem>Tasks</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Date Range */}
              <div className="space-y-2">
                <label className="text-mainText font-bold text-sm italic">
                  Date Range
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="w-full flex items-center justify-between px-4 py-3 bg-[#F8FAFC] rounded-xl text-body text-sm hover:bg-gray-50 transition-colors">
                      <span className="italic">Last 7 days</span>
                      <ChevronDown className="w-4 h-4 text-placeholder" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    <DropdownMenuItem>Today</DropdownMenuItem>
                    <DropdownMenuItem>Yesterday</DropdownMenuItem>
                    <DropdownMenuItem>Last 7 days</DropdownMenuItem>
                    <DropdownMenuItem>Last 30 days</DropdownMenuItem>
                    <DropdownMenuItem>Custom Range</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* User */}
              <div className="space-y-2">
                <label className="text-mainText font-bold text-sm italic">
                  User
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="w-full flex items-center justify-between px-4 py-3 bg-[#F8FAFC] rounded-xl text-body text-sm hover:bg-gray-50 transition-colors">
                      <span className="italic">All Users</span>
                      <ChevronDown className="w-4 h-4 text-placeholder" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    <DropdownMenuItem>All Users</DropdownMenuItem>
                    <DropdownMenuItem>Emma Wilson</DropdownMenuItem>
                    <DropdownMenuItem>John Davis</DropdownMenuItem>
                    <DropdownMenuItem>Sarah Miller</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        )}

        {/* Timeline Container */}
        <div className="relative pl-14">
          {/* Vertical Line */}
          <div className="absolute left-[19px] top-2 bottom-0 w-[2px] bg-stroke"></div>

          {/* Today Label */}
          <div className="flex items-center gap-2 mb-8 relative">
            <div className="absolute -left-[42px] w-3 h-3 rounded-full bg-primary border-4 border-[#EFF4FF]"></div>
            <span className="text-mainText text-sm font-semibold ml-2">
              Today
            </span>
          </div>

          {/* Activities List */}
          <div className="space-y-6">
            {activities.map((activity) => (
              <div key={activity.id} className="relative flex items-start">
                {/* Activity Type Icon on Timeline */}
                <div className="absolute -left-14 top-0 z-10">
                  {getActivityIcon(activity.type)}
                </div>

                {/* Content Card */}
                <div className="flex-1 min-w-0 bg-white rounded-2xl p-5 border border-stroke hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      {/* User Avatar */}
                      <div
                        className={`w-10 h-10 rounded-full ${activity.user.color} flex items-center justify-center shrink-0`}
                      >
                        <span className="text-white text-sm font-bold">
                          {activity.user.initials}
                        </span>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center flex-wrap gap-2">
                          <span className="text-mainText font-bold text-base italic">
                            {activity.user.name}
                          </span>
                          <span className="text-body text-base italic">
                            {activity.action}
                          </span>
                          {/* Badge */}
                          {activity.badge && (
                            <span
                              className={`${activity.badge.color} text-mainText text-[10px] px-2 py-0.5 rounded-full font-medium border border-white/20`}
                            >
                              {activity.badge.text}
                            </span>
                          )}
                        </div>
                        {/* Description */}
                        <p className="text-mainText text-base mt-1 italic font-semibold">
                          {activity.description}
                        </p>

                        {/* Metadata */}
                        <div className="flex items-center gap-4 mt-2 text-body text-sm font-light italic">
                          {activity.metadata.icon === "user" ? (
                            <div className="flex items-center gap-1.5">
                              <Users className="w-4 h-4" />
                              <span>{activity.metadata.primary}</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <svg
                                className="w-4 h-4"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <rect
                                  x="3"
                                  y="3"
                                  width="18"
                                  height="18"
                                  rx="2"
                                />
                                <path d="M3 9h18" />
                                <path d="M9 21V9" />
                              </svg>
                              <span>{activity.metadata.primary}</span>
                            </div>
                          )}

                          {activity.metadata.secondary && (
                            <div className="flex items-center gap-2.5">
                              <svg
                                className="w-4 h-4"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <rect
                                  x="3"
                                  y="3"
                                  width="18"
                                  height="18"
                                  rx="2"
                                />
                                <path d="M3 9h18" />
                                <path d="M9 21V9" />
                              </svg>
                              <span>{activity.metadata.secondary}</span>
                            </div>
                          )}

                          {activity.metadata.amount && (
                            <div className="flex items-center gap-1.5">
                              <DollarSign className="w-4 h-4" />
                              <span>{activity.metadata.amount}</span>
                            </div>
                          )}
                        </div>
                        {/* Action Links */}
                        <div className="flex items-center gap-2 mt-4">
                          <button className="text-primary text-sm font-bold italic hover:underline">
                            View details
                          </button>
                          <span className="text-placeholder">•</span>
                          <button className="text-body text-sm italic font-medium hover:text-primary transition-colors">
                            Go to item
                          </button>
                        </div>
                      </div>
                    </div>
                    {/* Timestamp - Top Right */}
                    <div className="flex flex-col items-end gap-4 text-right">
                      <span className="text-body text-sm italic font-medium">
                        {activity.timeAgo}
                      </span>
                      <span className="text-placeholder text-xs italic">
                        {activity.timestamp}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
