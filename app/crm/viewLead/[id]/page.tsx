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
} from "lucide-react";
import { getLead } from "@/lib/api";
import { toast } from "react-hot-toast";
import Link from "next/link";

const Skeleton = ({ className }: { className: string }) => (
  <div className={`animate-pulse bg-white rounded ${className}`} />
);

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
              {lead.full_name}
            </h1>
            <p className="text-body italic text-base">
              {lead.company_name || "Independent Account"}
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
                          {lead.company_name || "Independent"}
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
                                value: lead.position || "CEO",
                              },
                              { label: "Phone number", value: lead.phone },
                              {
                                label: "Category",
                                value: lead.category?.name || "Partner",
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
                                value: lead.status?.name || "Open",
                              },
                              { label: "Ad Id", value: lead.ad_id || "444" },
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
                                value: lead.company_name || "TechCorp Inc.",
                              },
                              {
                                label: "Company field",
                                value: lead.company_field || "Lorem Ipsum",
                              },
                              {
                                label: "Company phone",
                                value: lead.company_phone || "01018883449",
                              },
                              {
                                label: "Company email",
                                value:
                                  lead.company_email || "nadaasaalah@gmail.com",
                              },
                              {
                                label: "Service",
                                value:
                                  lead.service?.name || "Branding & Design",
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
                              Facebook ads
                            </span>
                          </p>
                          <p className="text-sm">
                            <span className="text-body italic font-medium">
                              Channels:
                            </span>{" "}
                            <span className="text-mainText font-bold italic">
                              Instagram
                            </span>
                          </p>
                          <p className="text-sm">
                            <span className="text-body italic font-medium">
                              Ad Id:
                            </span>{" "}
                            <span className="text-mainText font-bold italic">
                              232343546565576
                            </span>
                          </p>
                          <p className="text-sm">
                            <span className="text-body italic font-medium">
                              Ad URL:
                            </span>{" "}
                            <a
                              href="#"
                              className="text-mainText font-bold italic underline"
                            >
                              https://dev-crm.sunmedagency.com/leads/create?step=
                            </a>
                          </p>
                          <p className="text-sm">
                            <span className="text-body italic font-medium">
                              socials:
                            </span>{" "}
                            <span className="text-mainText font-bold italic">
                              Facebook, Instagram
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
                              Lorem ipsum
                            </span>
                          </p>
                          <p className="text-sm">
                            <span className="text-body italic font-medium">
                              Exact request:
                            </span>{" "}
                            <span className="text-mainText font-bold italic">
                              Lorem ipsum
                            </span>
                          </p>
                          <p className="text-sm">
                            <span className="text-body italic font-medium">
                              Moderation feedback:
                            </span>{" "}
                            <span className="text-mainText font-bold italic">
                              Lorem ipsum
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
                                  Lurem
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-mainText font-bold italic">
                                  From:
                                </span>{" "}
                                <span className="text-sm text-body italic">
                                  Lurem ipsum
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-mainText font-bold italic">
                                  Value:
                                </span>{" "}
                                <span className="text-sm text-body italic">
                                  In office
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-mainText font-bold italic">
                                  To:
                                </span>{" "}
                                <span className="text-sm text-body italic">
                                  13/9/2025 8:43:20 PM
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-mainText font-bold italic">
                                  Location:
                                </span>{" "}
                                <span className="text-sm text-body italic">
                                  Lurem
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-mainText font-bold italic">
                                  Host:
                                </span>{" "}
                                <span className="text-sm text-body italic">
                                  Lurem
                                </span>
                              </div>
                              <div className="col-span-1 md:col-span-2 flex items-start gap-2">
                                <span className="text-sm text-mainText font-bold italic shrink-0">
                                  Description:
                                </span>
                                <span className="text-sm text-body italic">
                                  Lurem
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
                                  Lurem
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-mainText font-bold italic">
                                  Call Status :
                                </span>{" "}
                                <span className="text-sm text-body italic">
                                  Lurem
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-mainText font-bold italic">
                                  Contact:
                                </span>{" "}
                                <span className="text-sm text-body italic">
                                  Lurem
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-mainText font-bold italic">
                                  Phone Number:
                                </span>{" "}
                                <span className="text-sm text-body italic">
                                  01018883449
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-mainText font-bold italic">
                                  Start time:
                                </span>{" "}
                                <span className="text-sm text-body italic">
                                  Lurem
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-mainText font-bold italic">
                                  Host:
                                </span>{" "}
                                <span className="text-sm text-body italic">
                                  Lurem
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
                                Lurem:
                              </span>{" "}
                              <span className="text-sm text-body italic">
                                Lurem
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-mainText font-bold italic">
                                Lurem:
                              </span>{" "}
                              <span className="text-sm text-body italic">
                                Lurem
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-mainText font-bold italic">
                                Lurem:
                              </span>{" "}
                              <span className="text-sm text-body italic">
                                Lurem
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
                  <div className="space-y-10 relative">
                    <div className="flex gap-4 group">
                      <div className="relative">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 z-10 relative"></div>
                        {/* <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[1px] h-12 bg-stroke"></div> */}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-mainText italic">
                          Email sent
                        </p>
                        <p className="text-xs text-body italic mt-1">
                          2 hours ago
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4 group">
                      <div className="relative">
                        <div className="w-2 h-2 rounded-full bg-green-500 mt-2 z-10 relative"></div>
                        {/* <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[1px] h-12 bg-stroke"></div> */}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-mainText italic">
                          Phone call completed
                        </p>
                        <p className="text-xs text-body italic mt-1">
                          1 day ago
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4 group">
                      <div className="relative">
                        <div className="w-2 h-2 rounded-full bg-yellow-400 mt-2 z-10 relative"></div>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-mainText italic">
                          Lead created
                        </p>
                        <p className="text-xs text-body italic mt-1">
                          3 days ago
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="bg-white p-8 rounded-2xl border border-stroke shadow-sm">
                  <h2 className="text-xl font-bold text-mainText italic mb-6">
                    Notes
                  </h2>
                  <p className="text-sm text-body italic leading-relaxed">
                    Interested in enterprise plan. Follow up next week regarding
                    pricing. CEO approved budget for Q1.
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

                <div className="relative pl-16 space-y-8">
                  {/* Timeline connecting line */}
                  <div className="absolute left-[23px] top-4 bottom-8 w-[1px] bg-stroke/60 z-0"></div>

                  {[
                    {
                      title: "Status Changed",
                      desc: "Lead status updated",
                      time: "2 hours ago",
                      icon: CheckCircle2,
                      color: "text-[#6366F1]",
                      bg: "bg-[#6366F115]",
                      border: "border-[#6366F130]",
                      type: "status",
                    },
                    {
                      title: "Activity Logged",
                      desc: "Phone call completed with client",
                      time: "3 hours ago",
                      icon: Phone,
                      color: "text-[#2FBF71]",
                      bg: "bg-[#2FBF7115]",
                      border: "border-[#2FBF7130]",
                      type: "call",
                    },
                    {
                      title: "Task Created",
                      desc: "New task assigned",
                      time: "5 hours ago",
                      icon: FileText,
                      color: "text-[#9810FA]",
                      bg: "bg-[#9810FA15]",
                      border: "border-[#9810FA30]",
                      type: "task",
                    },
                    {
                      title: "Lead Updated",
                      desc: "Lead Information was modified",
                      time: "5 hours ago",
                      icon: Pencil,
                      color: "text-[#F59E0B]",
                      bg: "bg-[#F59E0B15]",
                      border: "border-[#F59E0B30]",
                      type: "update",
                    },
                    {
                      title: "Activity Logged",
                      desc: "Email sent to client regarding demo",
                      time: "6 hours ago",
                      icon: Mail,
                      color: "text-[#2FBF71]",
                      bg: "bg-[#2FBF7115]",
                      border: "border-[#2FBF7130]",
                      type: "mail",
                    },
                    {
                      title: "Status Changed",
                      desc: "Lead status updated",
                      time: "7 hours ago",
                      icon: CheckCircle2,
                      color: "text-[#6366F1]",
                      bg: "bg-[#6366F115]",
                      border: "border-[#6366F130]",
                      type: "status_alt",
                    },
                    {
                      title: "Activity Logged",
                      desc: "Initial discovery call completed",
                      time: "8 hours ago",
                      icon: Phone,
                      color: "text-[#2FBF71]",
                      bg: "bg-[#2FBF7115]",
                      border: "border-[#2FBF7130]",
                      type: "call",
                    },
                    {
                      title: "Lead Created",
                      desc: "Lead was added to the system",
                      time: "8 hours ago",
                      icon: UserPlus,
                      color: "text-[#3B82F6]",
                      bg: "bg-[#3B82F615]",
                      border: "border-[#3B82F630]",
                      type: "created",
                    },
                  ].map((item, idx) => (
                    <div key={idx} className="relative z-10 group">
                      {/* Icon Indicator */}
                      <div
                        className={`absolute -left-[56px] top-0 w-12 h-12 rounded-full bg-white border border-stroke flex items-center justify-center z-10 group-last:after:hidden`}
                      >
                        <div
                          className={`w-9 h-9 rounded-full ${item.bg} border ${item.border} flex items-center justify-center transition-transform group-hover:scale-110`}
                        >
                          <item.icon className={`w-4 h-4 ${item.color}`} />
                        </div>
                      </div>

                      {/* Card Context */}
                      <div className="bg-white border border-stroke rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="text-sm font-bold text-mainText italic">
                              {item.title}
                            </p>
                            <p className="text-xs text-body italic">
                              {item.desc}
                            </p>
                          </div>
                          <span className="text-xs text-body italic">
                            {item.time}
                          </span>
                        </div>

                        {item.type.includes("status") && (
                          <div className="flex items-center gap-3 mt-4">
                            <div className="bg-gray-50 border border-stroke px-4 py-1.5 rounded-full text-xs font-bold text-body italic">
                              {item.type === "status" ? "Contacted" : "New"}
                            </div>
                            <ChevronRight
                              size={14}
                              className="text-placeholder"
                            />
                            <div className="bg-blue-50 border border-blue-200 px-4 py-1.5 rounded-full text-xs font-bold text-blue-500 italic">
                              {item.type === "status"
                                ? "Qualified"
                                : "Contacted"}
                            </div>
                          </div>
                        )}

                        {item.type === "call" && (
                          <div className="flex items-center gap-2 text-mainText mt-4 font-bold italic text-sm">
                            <Phone size={14} className="text-[#2FBF71]" />
                            Phone Call
                          </div>
                        )}

                        {item.type === "mail" && (
                          <div className="flex items-center gap-2 text-mainText mt-4 font-bold italic text-sm">
                            <Mail size={14} className="text-[#2FBF71]" />
                            Email
                          </div>
                        )}

                        {item.type === "task" && (
                          <div className="text-sm font-bold italic text-mainText flex items-center gap-2 mt-4">
                            <FileText size={14} className="text-[#9810FA]" />
                            Follow up on pricing discussion
                          </div>
                        )}

                        <div className="mt-6 pt-6 border-t border-stroke/50 flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-[10px] text-white">
                              {item.type === "mail" ? "EC" : "JS"}
                            </div>
                            <span className="text-xs font-bold text-mainText italic">
                              {item.type === "mail"
                                ? "Emily Chen"
                                : "John Smith"}
                            </span>
                          </div>
                          <Dot size={12} className="text-placeholder" />
                          <span className="text-xs text-body italic">
                            Jan 4, 2026 - 2:30 PM
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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
                Qualified
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
                      John Smith
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
                      Website Form
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
                      Jan 15, 2026
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
                      2 hours ago
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
                    $45,000
                  </p>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs text-placeholder italic">
                      Probability
                    </p>
                    <p className="text-xs font-bold text-primary italic">75%</p>
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
