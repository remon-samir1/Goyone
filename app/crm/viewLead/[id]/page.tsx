"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "../../header";
import {
  Mail,
  Phone,
  Building2,
  User,
  Calendar,
  Clock,
  Target,
  Database,
  Globe,
  MessageSquare,
  Pencil,
  Plus,
  Dot,
  CheckCircle2,
  FileText,
  UserPlus,
  ChevronLeft,
  ChevronRight,
  History as HistoryIcon,
  PhoneCall,
  ListTodo,
  RefreshCw,
  Inbox,
  CalendarClock,
} from "lucide-react";
import { getLead } from "@/lib/api";
import { toast } from "react-hot-toast";
import Link from "next/link";

const Skeleton = ({ className }: { className: string }) => (
  <div className={`animate-pulse bg-white rounded ${className}`} />
);

// Helper: compute relative time string
const getRelativeTime = (dateStr: string) => {
  if (!dateStr) return "";
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  const diffMonths = Math.floor(diffDays / 30);
  return `${diffMonths} month${diffMonths > 1 ? "s" : ""} ago`;
};

// Helper: format date for display
const formatDate = (dateStr: string) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return (
    date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }) +
    " · " +
    date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  );
};

// Build unified timeline items from activities and tasks
const buildTimelineItems = (lead: any) => {
  const items: any[] = [];

  // Calls
  if (lead.activities?.calls?.length) {
    lead.activities.calls.forEach((call: any) => {
      items.push({
        type: "call",
        title: "Activity Logged",
        subtitle: call.subject || call.description || "Phone call completed",
        detail: "Phone Call",
        detailIcon: "phone",
        date: call.created_at || call.start_time,
        user: call.user?.name || call.host,
        iconBg: "bg-green-50",
        iconBorder: "border-green-200",
        iconColor: "text-green-500",
        accentColor: "bg-green-500",
      });
    });
  }

  // Mails
  if (lead.activities?.mails?.length) {
    lead.activities.mails.forEach((mail: any) => {
      items.push({
        type: "mail",
        title: "Activity Logged",
        subtitle: mail.subject || "Email sent",
        detail: "Email",
        detailIcon: "mail",
        date: mail.created_at || mail.date,
        user: mail.user?.name || mail.from,
        iconBg: "bg-blue-50",
        iconBorder: "border-blue-200",
        iconColor: "text-blue-500",
        accentColor: "bg-blue-500",
      });
    });
  }

  // Meetings
  if (lead.activities?.meetings?.length) {
    lead.activities.meetings.forEach((meeting: any) => {
      items.push({
        type: "meeting",
        title: "Meeting Scheduled",
        subtitle: meeting.title || meeting.description || "Meeting with client",
        detail: meeting.location || "Meeting",
        detailIcon: "calendar",
        date: meeting.created_at || meeting.started_at,
        user: meeting.user?.name || meeting.host,
        iconBg: "bg-purple-50",
        iconBorder: "border-purple-200",
        iconColor: "text-purple-500",
        accentColor: "bg-purple-500",
      });
    });
  }

  // Tasks
  if (lead.activities?.tasks?.length) {
    lead.activities.tasks.forEach((task: any) => {
      items.push({
        type: "task",
        title: "Task Created",
        subtitle: task.description || "New task assigned",
        detail: task.title,
        detailIcon: "task",
        date: task.created_at,
        user: task.user?.name,
        iconBg: "bg-amber-50",
        iconBorder: "border-amber-200",
        iconColor: "text-amber-500",
        accentColor: "bg-amber-500",
        startedAt: task.started_at,
        endedAt: task.ended_at,
      });
    });
  }

  // Sort by date descending (most recent first)
  items.sort((a, b) => {
    const dateA = a.date ? new Date(a.date).getTime() : 0;
    const dateB = b.date ? new Date(b.date).getTime() : 0;
    return dateB - dateA;
  });

  return items;
};

const ViewLeadPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [lead, setLead] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  useEffect(() => {
    const fetchLeadData = async () => {
      setLoading(true);
      try {
        const response = await getLead(id as string);
        setLead(response.data || response);
      } catch (error) {
        console.error("Error fetching lead:", error);
        toast.error("Failed to load lead details");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchLeadData();
  }, [id]);

  if (loading) {
    return (
      <>
        <Header Links={true} />
        <div className="px-[3%] py-8 flex flex-col gap-8">
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="flex gap-4">
              <Skeleton className="h-10 w-24 rounded-lg" />
              <Skeleton className="h-10 w-32 rounded-lg" />
            </div>
          </div>

          <div className="flex gap-8">
            <div className="flex-1 flex flex-col gap-8">
              <Skeleton className="h-40 w-full rounded-2xl" />
              <div className="grid grid-cols-2 gap-8">
                <Skeleton className="h-80 rounded-2xl" />
                <Skeleton className="h-80 rounded-2xl" />
              </div>
            </div>
            <div className="w-[350px] flex flex-col gap-8">
              <Skeleton className="h-32 rounded-2xl" />
              <Skeleton className="h-96 rounded-2xl" />
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!lead) return null;

  return (
    <div className="pb-12">
      <Header Links={false} />
      <div className="px-[3%] py-8 ">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-mainText italic mb-1">
              {lead.full_name || "N/A"}
            </h1>
            <p className="text-body italic text-base">
              {lead.company_name || "N/A"}
            </p>
          </div>
          <div className="flex gap-4">
            <Link
              href={`/crm/editLead/${id}`}
              className="flex items-center gap-2 px-5 py-2.5 border border-primary text-primary rounded-lg font-bold italic hover:bg-primary/5 transition-all"
            >
              <Pencil className="w-4 h-4" />
              Edit Lead
            </Link>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg font-bold italic hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
              <Plus className="w-4 h-4" />
              Add Task
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 mb-8 bg-primary/5 w-max rounded-full p-1">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-full font-bold italic text-sm transition-all ${activeTab === "overview" ? "bg-white text-primary shadow-md border border-stroke" : "text-placeholder hover:text-primary"}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("timeline")}
            className={`px-4 py-2 rounded-full font-bold italic text-sm transition-all ${activeTab === "timeline" ? "bg-white text-primary shadow-md border border-stroke" : "text-placeholder hover:text-primary"}`}
          >
            Timeline
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content Area */}
          <div className="flex-1 space-y-8">
            {activeTab === "overview" ? (
              <>
                {/* Contact Information */}
                <div className="bg-white p-8 rounded-2xl border border-stroke shadow-sm relative overflow-hidden group">
                  {/* <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-10 -mt-10 group-hover:scale-110 transition-transform duration-500"></div> */}
                  <h2 className="text-xl font-bold text-mainText italic mb-6">
                    Contact Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-8 relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs text-body italic font-medium uppercase tracking-wider mb-1">
                          Email
                        </p>
                        <p className="text-sm font-bold text-mainText italic break-all">
                          {lead.email || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-50 text-green-500 rounded-xl flex items-center justify-center">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs text-body italic font-medium uppercase tracking-wider mb-1">
                          Phone
                        </p>
                        <p className="text-sm font-bold text-mainText italic">
                          {lead.phone || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-xl flex items-center justify-center">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs text-body italic font-medium uppercase tracking-wider mb-1">
                          Company
                        </p>
                        <p className="text-sm font-bold text-mainText italic">
                          {lead.company_name || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-2xl border border-stroke shadow-sm relative">
                  <div className="h-max">
                    {currentCardIndex === 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-left-4 duration-500">
                        {/* Basic Information */}
                        <div>
                          <h2 className="text-xl font-bold text-mainText italic mb-6">
                            Basic Information
                          </h2>
                          <div className="space-y-4">
                            {[
                              { label: "Name", value: lead.full_name },
                              { label: "Email", value: lead.email },
                              {
                                label: "Position",
                                value: lead.position,
                              },
                              { label: "Phone number", value: lead.phone },
                              {
                                label: "Category",
                                value: lead.category?.name,
                              },
                              {
                                label: "Date",
                                value: lead.created_at?.split("T")[0],
                              },
                              {
                                label: "Time",
                                value: lead.created_at
                                  ?.split("T")[1]
                                  ?.split(".")[0],
                              },
                              {
                                label: "Status",
                                value: lead.status?.name,
                              },
                              { label: "Ad Id", value: lead.ad_id },
                            ].map((item, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-2 py-1"
                              >
                                <span className="text-sm text-body italic font-medium">
                                  {item.label}:
                                </span>
                                <span className="text-sm font-bold text-mainText italic">
                                  {item.value || "N/A"}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Company Info */}
                        <div>
                          <h2 className="text-xl font-bold text-mainText italic mb-6">
                            Company info
                          </h2>
                          <div className="space-y-4">
                            {[
                              {
                                label: "Company name",
                                value: lead.company_name,
                              },
                              {
                                label: "Company field",
                                value: lead.company_field,
                              },
                              {
                                label: "Company phone",
                                value: lead.company_phone,
                              },
                              {
                                label: "Company email",
                                value: lead.company_email,
                              },
                              {
                                label: "Service",
                                value: lead.service?.name,
                              },
                            ].map((item, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-2 py-1"
                              >
                                <span className="text-sm text-body italic font-medium">
                                  {item.label}:
                                </span>
                                <span className="text-sm font-bold text-mainText italic">
                                  {item.value || "N/A"}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {currentCardIndex === 1 && (
                      <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                        <h2 className="text-xl font-bold text-mainText italic mb-6">
                          Marketing Information
                        </h2>
                        <div className="space-y-4">
                          <p className="text-sm">
                            <span className="text-body italic font-medium">
                              lead source:
                            </span>{" "}
                            <span className="text-mainText font-bold italic">
                              {lead.lead_source_type?.name || "N/A"}
                            </span>
                          </p>
                          <p className="text-sm">
                            <span className="text-body italic font-medium">
                              Channels:
                            </span>{" "}
                            <span className="text-mainText font-bold italic">
                              {lead.channels?.name || "N/A"}
                            </span>
                          </p>
                          <p className="text-sm">
                            <span className="text-body italic font-medium">
                              Ad Id:
                            </span>{" "}
                            <span className="text-mainText font-bold italic">
                              {lead.ad_id || "N/A"}
                            </span>
                          </p>
                          <p className="text-sm">
                            <span className="text-body italic font-medium">
                              Ad URL:
                            </span>{" "}
                            <span className="text-mainText font-bold italic">
                              {lead.ad_url || "N/A"}
                            </span>
                          </p>
                          <p className="text-sm">
                            <span className="text-body italic font-medium">
                              socials:
                            </span>{" "}
                            <span className="text-mainText font-bold italic">
                              {lead.socials || "N/A"}
                            </span>
                          </p>
                        </div>
                      </div>
                    )}

                    {currentCardIndex === 2 && (
                      <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                        <h2 className="text-xl font-bold text-mainText italic mb-6 underline">
                          Feed Backs
                        </h2>
                        <div className="space-y-4">
                          <p className="text-sm">
                            <span className="text-body italic font-medium">
                              Customer Inquiry:
                            </span>{" "}
                            <span className="text-mainText font-bold italic">
                              {lead.customer_inquiry || "N/A"}
                            </span>
                          </p>
                          <p className="text-sm">
                            <span className="text-body italic font-medium">
                              Exact request:
                            </span>{" "}
                            <span className="text-mainText font-bold italic">
                              {lead.exact_request || "N/A"}
                            </span>
                          </p>
                          <p className="text-sm">
                            <span className="text-body italic font-medium">
                              Moderation feedback:
                            </span>{" "}
                            <span className="text-mainText font-bold italic">
                              {lead.moderation_feedback || "N/A"}
                            </span>
                          </p>
                        </div>
                      </div>
                    )}

                    {currentCardIndex === 3 && (
                      <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                        <h2 className="text-2xl font-bold text-mainText italic mb-8">
                          Actions & Follow-up
                        </h2>

                        <div className="space-y-10">
                          {/* Meetings */}
                          <div>
                            <h3 className="text-lg font-bold text-mainText italic mb-4">
                              Meetings
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-mainText font-bold italic">
                                  Title:
                                </span>{" "}
                                <span className="text-sm text-body italic">
                                  {lead.meeting_title || "N/A"}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-mainText font-bold italic">
                                  From:
                                </span>{" "}
                                <span className="text-sm text-body italic">
                                  {lead.meeting_from || "N/A"}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-mainText font-bold italic">
                                  Value:
                                </span>{" "}
                                <span className="text-sm text-body italic">
                                  {lead.meeting_value || "N/A"}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-mainText font-bold italic">
                                  To:
                                </span>{" "}
                                <span className="text-sm text-body italic">
                                  {lead.meeting_to || "N/A"}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-mainText font-bold italic">
                                  Location:
                                </span>{" "}
                                <span className="text-sm text-body italic">
                                  {lead.meeting_location || "N/A"}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-mainText font-bold italic">
                                  Host:
                                </span>{" "}
                                <span className="text-sm text-body italic">
                                  {lead.meeting_host || "N/A"}
                                </span>
                              </div>
                              <div className="col-span-1 md:col-span-2 flex items-start gap-2">
                                <span className="text-sm text-mainText font-bold italic shrink-0">
                                  Description:
                                </span>
                                <span className="text-sm text-body italic">
                                  {lead.meeting_description || "N/A"}
                                </span>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="text-sm text-mainText font-bold italic">
                                  All day:
                                </span>
                                <div className="w-10 h-5 bg-[#F1F5F9] rounded-full relative">
                                  <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Calls */}
                          <div>
                            <h3 className="text-lg font-bold text-mainText italic mb-4">
                              Calls
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-mainText font-bold italic">
                                  Subject:
                                </span>{" "}
                                <span className="text-sm text-body italic">
                                  {lead.call_subject || "N/A"}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-mainText font-bold italic">
                                  Call Status :
                                </span>{" "}
                                <span className="text-sm text-body italic">
                                  {lead.call_status || "N/A"}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-mainText font-bold italic">
                                  Contact:
                                </span>{" "}
                                <span className="text-sm text-body italic">
                                  {lead.call_contact || "N/A"}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-mainText font-bold italic">
                                  Phone Number:
                                </span>{" "}
                                <span className="text-sm text-body italic">
                                  {lead.call_phone || "N/A"}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-mainText font-bold italic">
                                  Start time:
                                </span>{" "}
                                <span className="text-sm text-body italic">
                                  {lead.call_start_time || "N/A"}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-mainText font-bold italic">
                                  Host:
                                </span>{" "}
                                <span className="text-sm text-body italic">
                                  {lead.call_host || "N/A"}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Mail */}
                          <div className="space-y-3">
                            <h3 className="text-lg font-bold text-mainText italic mb-6">
                              Mail
                            </h3>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-mainText font-bold italic">
                                Subject:
                              </span>{" "}
                              <span className="text-sm text-body italic">
                                {lead.mail_subject || "N/A"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-mainText font-bold italic">
                                To:
                              </span>{" "}
                              <span className="text-sm text-body italic">
                                {lead.mail_to || "N/A"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-mainText font-bold italic">
                                Date:
                              </span>{" "}
                              <span className="text-sm text-body italic">
                                {lead.mail_date || "N/A"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Carousel Footer */}
                  <div className="mt-8 pt-6 border-t border-stroke flex justify-between items-center">
                    <span className="text-[12px] text-body italic">
                      Showing 1 to 5 of 5 view
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          setCurrentCardIndex((prev) => Math.max(0, prev - 1))
                        }
                        disabled={currentCardIndex === 0}
                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#F5F8FE] text-body disabled:opacity-30 hover:bg-primary/5 transition-colors"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <span className="text-sm font-bold text-mainText italic">
                        {currentCardIndex + 1} of 4
                      </span>
                      <button
                        onClick={() =>
                          setCurrentCardIndex((prev) => Math.min(3, prev + 1))
                        }
                        disabled={currentCardIndex === 3}
                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-primary text-white disabled:opacity-30 hover:bg-primary/90 transition-colors shadow-sm"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white p-8 rounded-2xl border border-stroke shadow-sm">
                  <h2 className="text-xl font-bold text-mainText italic mb-10">
                    Recent Activity
                  </h2>
                  <div className="space-y-6 relative">
                    {(() => {
                      const timelineItems = buildTimelineItems(lead);
                      if (timelineItems.length > 0) {
                        return timelineItems
                          .slice(0, 5)
                          .map((item: any, idx: number) => (
                            <div key={idx} className="flex gap-4 group">
                              <div className="relative">
                                <div
                                  className={`w-2.5 h-2.5 rounded-full mt-1.5 z-10 relative ${item.accentColor}`}
                                ></div>
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <p className="text-sm font-bold text-mainText italic">
                                    {item.title}
                                  </p>
                                  <span className="text-[11px] text-body italic shrink-0 ml-2">
                                    {getRelativeTime(item.date)}
                                  </span>
                                </div>
                                <p className="text-xs text-body italic mt-0.5">
                                  {item.subtitle}
                                </p>
                              </div>
                            </div>
                          ));
                      } else {
                        return (
                          <div className="flex flex-col items-center justify-center py-8 text-center">
                            <div className="w-14 h-14 rounded-full bg-primary/5 flex items-center justify-center mb-4">
                              <Inbox className="w-6 h-6 text-primary/40" />
                            </div>
                            <p className="text-sm font-semibold text-mainText/60 italic">
                              No recent activity
                            </p>
                            <p className="text-xs text-body/50 italic mt-1">
                              Activities will appear here once logged
                            </p>
                          </div>
                        );
                      }
                    })()}
                  </div>
                </div>

                {/* Notes */}
                <div className="bg-white p-8 rounded-2xl border border-stroke shadow-sm">
                  <h2 className="text-xl font-bold text-mainText italic mb-6">
                    Notes
                  </h2>
                  <p className="text-sm text-body italic leading-relaxed">
                    {lead.notes || "N/A"}
                  </p>
                </div>
              </>
            ) : (
              /* Timeline Tab Content */
              <div className="bg-white p-8 rounded-2xl border border-stroke shadow-sm min-h-[600px]">
                <h2 className="text-xl font-bold text-mainText italic mb-2">
                  Timeline
                </h2>
                <p className="text-xs text-body italic mb-8">
                  Activity history for {lead.full_name}
                </p>

                {(() => {
                  const timelineItems = buildTimelineItems(lead);

                  if (timelineItems.length === 0) {
                    return (
                      <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="relative mb-6">
                          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/10 to-blue-50 flex items-center justify-center animate-pulse">
                            <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center">
                              <Inbox className="w-8 h-8 text-primary/30" />
                            </div>
                          </div>
                          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-50 border-2 border-white flex items-center justify-center">
                            <Clock className="w-3 h-3 text-amber-400" />
                          </div>
                        </div>
                        <h3 className="text-lg font-bold text-mainText/70 italic mb-2">
                          No Activities Yet
                        </h3>
                        <p className="text-sm text-body/50 italic max-w-sm leading-relaxed">
                          This lead doesn't have any recorded activities. Calls,
                          emails, meetings, and tasks will appear here as they
                          are logged.
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div className="relative pl-16 space-y-6">
                      {/* Timeline connecting line — only show when more than 1 item */}
                      {timelineItems.length > 1 && (
                        <div className="absolute left-[23px] top-6 bottom-8 w-[2px] bg-gradient-to-b from-primary/20 via-stroke/40 to-transparent z-0"></div>
                      )}

                      {timelineItems.map((item: any, idx: number) => {
                        // Pick the correct icon per type
                        const IconComponent =
                          item.type === "call"
                            ? PhoneCall
                            : item.type === "mail"
                              ? Mail
                              : item.type === "meeting"
                                ? CalendarClock
                                : ListTodo;

                        return (
                          <div key={idx} className="relative z-10 group">
                            {/* Icon Indicator */}
                            <div className="absolute -left-[56px] top-0 w-12 h-12 rounded-full bg-white border border-stroke flex items-center justify-center z-10 shadow-sm">
                              <div
                                className={`w-9 h-9 rounded-full ${item.iconBg} border ${item.iconBorder} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}
                              >
                                <IconComponent
                                  className={`w-4 h-4 ${item.iconColor}`}
                                />
                              </div>
                            </div>

                            {/* Card */}
                            <div className="bg-white border border-stroke rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300">
                              {/* Header row */}
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <p className="text-sm font-bold text-mainText italic">
                                    {item.title}
                                  </p>
                                  <p className="text-xs text-body italic mt-0.5">
                                    {item.subtitle}
                                  </p>
                                </div>
                                <span className="text-xs text-body/60 italic shrink-0 ml-4 bg-gray-50 px-2.5 py-1 rounded-full">
                                  {getRelativeTime(item.date)}
                                </span>
                              </div>

                              {/* Detail chip */}
                              {item.detail && (
                                <div className="flex items-center gap-2 mb-4">
                                  <div
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${item.iconBg} border ${item.iconBorder}`}
                                  >
                                    <IconComponent
                                      className={`w-3.5 h-3.5 ${item.iconColor}`}
                                    />
                                    <span
                                      className={`text-xs font-semibold italic ${item.iconColor}`}
                                    >
                                      {item.detail}
                                    </span>
                                  </div>
                                </div>
                              )}

                              {/* Footer: user + date */}
                              <div className="flex items-center gap-2 text-xs text-body/60 italic">
                                {item.user && (
                                  <>
                                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                                      <User className="w-3 h-3 text-primary" />
                                    </div>
                                    <span className="font-medium text-mainText/70">
                                      {item.user}
                                    </span>
                                    <span className="text-body/30">·</span>
                                  </>
                                )}
                                <span>{formatDate(item.date)}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>

          {/* Sidebar */}

          <div
            className={`w-full lg:w-[350px] space-y-8 ${activeTab === "timeline" ? "hidden" : "block"}`}
          >
            {/* Status Card */}
            <div className="bg-white p-8 rounded-2xl border border-stroke shadow-sm">
              <h2 className="text-sm font-bold text-placeholder italic mb-4 uppercase tracking-widest">
                Status
              </h2>
              <div className="bg-purple-50 text-purple-500 px-4 py-1.5 rounded-full text-xs font-bold italic w-fit inline-block">
                {lead.status?.name || "N/A"}
              </div>
            </div>

            {/* Lead Details Card */}
            <div className="bg-white p-8 rounded-2xl border border-stroke shadow-sm">
              <h2 className="text-sm font-bold text-placeholder italic mb-6 uppercase tracking-widest">
                Lead Details
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <User className="w-4 h-4 text-placeholder" />
                  <div>
                    <p className="text-xs text-placeholder italic mb-1">
                      Lead Owner
                    </p>
                    <p className="text-sm font-bold text-primary italic">
                      {lead.seller?.name || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Database className="w-4 h-4 text-placeholder" />
                  <div>
                    <p className="text-xs text-placeholder italic mb-1">
                      Source
                    </p>
                    <p className="text-sm font-bold text-primary italic">
                      {lead.lead_source?.name || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Calendar className="w-4 h-4 text-placeholder" />
                  <div>
                    <p className="text-xs text-placeholder italic mb-1">
                      Created
                    </p>
                    <p className="text-sm font-bold text-primary italic">
                      {lead.created_at?.split("T")[0] || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <HistoryIcon className="w-4 h-4 text-placeholder" />
                  <div>
                    <p className="text-xs text-placeholder italic mb-1">
                      Last Contact
                    </p>
                    <p className="text-sm font-bold text-primary italic">
                      {lead.last_contact || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Deal Information Card */}
            <div className="bg-white p-8 rounded-2xl border border-stroke shadow-sm">
              <h2 className="text-sm font-bold text-placeholder italic mb-6 uppercase tracking-widest">
                Deal Information
              </h2>
              <div className="space-y-6">
                <div>
                  <p className="text-xs text-placeholder italic mb-1">
                    Estimated Value
                  </p>
                  <p className="text-2xl font-bold text-primary italic">
                    {lead.estimated_value || "N/A"}
                  </p>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs text-placeholder italic">
                      Probability
                    </p>
                    <p className="text-xs font-bold text-primary italic">
                      {lead.probability || "Empty"}
                    </p>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-1000"
                      style={{ width: "75%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewLeadPage;
