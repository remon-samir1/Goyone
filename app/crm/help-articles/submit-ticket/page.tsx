"use client";
import React from "react";
import {
  Search,
  Upload,
  Info,
  Calendar,
  Send,
  ChevronDown,
} from "lucide-react";
import HelpSidebar from "@/components/help/HelpSidebar";
import { cn } from "@/lib/utils";

const SubmitTicketPage = () => {
  return (
    <div className="px-[%] pb-[50px] mx-auto min-h-[calc(100vh-100px)]">
      {/* Header Title Section */}
      <div className="flex justify-between items-end mb-8 ">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 italic leading-tight">
            Submit Ticket
          </h1>
          <p className="text-gray-500 text-sm mt-1 italic font-medium leading-tight">
            How can we help you today?
          </p>
        </div>
        <div className="relative w-[320px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search articles..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
          />
        </div>
      </div>

      <div className="flex gap-8">
        <HelpSidebar />

        {/* Main Content */}
        <div className="flex-1">
          <section className="bg-white p-10 rounded-[2.5rem] border border-gray-50 shadow-sm">
            <form className="space-y-8">
              {/* Row 1: Priority & Category */}
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-900 italic ml-1">
                    Priority Level <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl text-sm text-gray-500 italic appearance-none focus:bg-white focus:border-primary/10 transition-all outline-none">
                      <option>Select priority</option>
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                      <option>Urgent</option>
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-900 italic ml-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl text-sm text-gray-500 italic appearance-none focus:bg-white focus:border-primary/10 transition-all outline-none">
                      <option>Select category</option>
                      <option>Billing</option>
                      <option>Technical</option>
                      <option>Feature Request</option>
                      <option>Account</option>
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Row 2: Name & Email */}
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-900 italic ml-1">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl text-sm focus:bg-white focus:border-primary/10 transition-all italic outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-900 italic ml-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="john.doe@company.com"
                    className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl text-sm focus:bg-white focus:border-primary/10 transition-all italic outline-none"
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-900 italic ml-1">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Brief description of the issue"
                  className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl text-sm focus:bg-white focus:border-primary/10 transition-all italic outline-none"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-900 italic ml-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={6}
                  placeholder="Please provide detailed information about your issue or request..."
                  className="w-full px-6 py-5 bg-gray-50 border border-transparent rounded-[2rem] text-sm focus:bg-white focus:border-primary/10 transition-all italic outline-none resize-none"
                />
                <p className="text-[10px] text-gray-400 font-medium italic ml-1">
                  Include any relevant details, steps to reproduce, or
                  screenshots
                </p>
              </div>

              {/* Attachments */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-gray-900 italic ml-1">
                  Attachments (Optional)
                </label>
                <div className="w-full border-2 border-dashed border-gray-100 rounded-[2rem] p-10 flex flex-col items-center justify-center bg-gray-50/30 hover:bg-gray-50/50 hover:border-primary/20 transition-all cursor-pointer group">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
                    <Upload className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-sm font-bold text-gray-900 italic mb-1">
                    Click to upload files
                  </p>
                  <p className="text-[10px] text-gray-400 font-medium italic">
                    PNG, JPG, PDF up to 10MB
                  </p>
                </div>
              </div>

              {/* Response Time Info */}
              <div className="bg-primary/5 border border-primary/10 p-6 rounded-[2rem] flex gap-4">
                <div className="w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Info className="w-4 h-4 text-primary" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-gray-900 italic leading-tight">
                    Response Time
                  </h4>
                  <p className="text-xs text-primary font-medium italic leading-relaxed">
                    Most tickets are responded to within 24 hours. Urgent
                    tickets are prioritized and typically receive a response
                    within 2-4 hours during business hours.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4 pt-4">
                <button
                  type="button"
                  className="px-10 py-3 bg-white border border-gray-100 rounded-full text-sm font-bold italic text-gray-400 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-10 py-3 bg-primary text-white rounded-full text-sm font-bold italic hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:scale-[1.02]"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SubmitTicketPage;
