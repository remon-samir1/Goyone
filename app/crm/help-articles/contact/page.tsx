"use client";
import React from "react";
import {
  Search,
  MessageCircle,
  Mail,
  Phone,
  Send,
  Zap,
  Clock,
} from "lucide-react";
import HelpSidebar from "@/components/help/HelpSidebar";
import { cn } from "@/lib/utils";

const ContactPage = () => {
  return (
    <div className="px-[%] pb-[50px] mx-auto min-h-[calc(100vh-100px)]">
      {/* Header Title Section */}
      <div className="flex justify-between items-end mb-8 ">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 italic leading-tight">
            Contact Support
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
        <div className="flex-1 space-y-8">
          {/* Choose How to Reach Us */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 italic mb-5 leading-tight">
              Choose How to Reach Us
            </h2>
            <div className="grid grid-cols-3 gap-5">
              {/* Live Chat */}
              <div className="bg-white p-6 rounded-[2rem] border border-[#8CE553]/20 shadow-sm hover:shadow-md transition-all flex flex-col items-start">
                <div className="w-10 h-10 bg-[#E8FAD8] rounded-full flex items-center justify-center mb-4">
                  <MessageCircle className="w-5 h-5 text-[#8CE553]" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-1 italic leading-tight">
                  Live Chat
                </h3>
                <p className="text-xs text-gray-500 font-medium leading-relaxed mb-4">
                  Chat with our support team in real-time
                </p>
                <p className="text-[11px] text-[#8CE553] font-bold italic mb-6">
                  Available now
                </p>
                <button className="w-full py-2.5 bg-[#8CE553] text-white rounded-xl text-xs font-bold italic hover:bg-[#7cd442] transition-colors mt-auto">
                  Start Chat
                </button>
              </div>

              {/* Email Support */}
              <div className="bg-white p-6 rounded-[2rem] border border-primary/20 shadow-sm hover:shadow-md transition-all flex flex-col items-start">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-1 italic leading-tight">
                  Email Support
                </h3>
                <p className="text-xs text-gray-500 font-medium leading-relaxed mb-4">
                  Send us an email and we'll respond within 24 hours
                </p>
                <p className="text-[11px] text-gray-400 font-medium italic mb-6">
                  support@crm.com
                </p>
                <button className="w-full py-2.5 bg-primary text-white rounded-xl text-xs font-bold italic hover:bg-primary/90 transition-colors mt-auto">
                  Send Email
                </button>
              </div>

              {/* Phone Support */}
              <div className="bg-white p-6 rounded-[2rem] border border-yellow-100 shadow-sm hover:shadow-md transition-all flex flex-col items-start">
                <div className="w-10 h-10 bg-yellow-50 rounded-full flex items-center justify-center mb-4">
                  <Phone className="w-5 h-5 text-yellow-500" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-1 italic leading-tight">
                  Phone Support
                </h3>
                <p className="text-xs text-gray-500 font-medium leading-relaxed mb-4">
                  Speak directly with our support team
                </p>
                <p className="text-[11px] text-gray-400 font-medium italic mb-6">
                  1-800-CRM-HELP
                </p>
                <button className="w-full py-2.5 bg-yellow-500 text-white rounded-xl text-xs font-bold italic hover:bg-yellow-600 transition-colors mt-auto">
                  Call Now
                </button>
              </div>
            </div>
          </section>

          {/* Send Us a Quick Message */}
          <section className="bg-white p-8 rounded-[2rem] border border-gray-50 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-2 italic leading-tight">
              Send Us a Quick Message
            </h2>
            <p className="text-xs text-gray-500 font-medium mb-6 italic leading-tight">
              Common topics:
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              {[
                "I need help with lead management",
                "Question about billing",
                "Technical issue or bug",
                "Feature request",
                "Account settings help",
              ].map((topic) => (
                <button
                  key={topic}
                  className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-[11px] text-gray-600 font-medium italic hover:bg-gray-100 transition-colors"
                >
                  {topic}
                </button>
              ))}
            </div>

            <form className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-900 italic leading-tight ml-1">
                  Your Email
                </label>
                <input
                  type="email"
                  placeholder="your.email@company.com"
                  className="w-full px-5 py-3.5 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 focus:bg-white transition-all italic"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-900 italic leading-tight ml-1">
                  Message
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe how we can help you..."
                  className="w-full px-5 py-3.5 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 focus:bg-white transition-all italic resize-none"
                />
              </div>

              <button
                type="button"
                className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl text-sm font-bold italic hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Send className="w-4 h-4" />
                Send Message
              </button>
            </form>
          </section>

          {/* Support Hours & Fast Response */}
          <div className="grid grid-cols-2 gap-6">
            <section className="bg-white p-8 rounded-[2rem] border border-gray-50 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <Clock className="w-5 h-5 text-primary" />
                <h2 className="text-base font-bold text-gray-900 italic leading-tight">
                  Support Hours
                </h2>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium italic">
                    Monday - Friday
                  </span>
                  <span className="text-gray-900 font-bold italic">
                    9:00 AM - 6:00 PM EST
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium italic">
                    Saturday
                  </span>
                  <span className="text-gray-900 font-bold italic">
                    10:00 AM - 4:00 PM EST
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm pt-2">
                  <span className="text-gray-500 font-medium italic">
                    Closed
                  </span>
                  <span className="text-gray-400 font-bold italic">Sunday</span>
                </div>
              </div>
            </section>

            <section className="bg-primary/5 p-8 rounded-[2rem] border border-primary/10">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                  <Zap className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-gray-900 italic leading-tight">
                  Fast Response Times
                </h2>
              </div>
              <p className="text-xs text-gray-500 font-medium italic leading-relaxed mb-6">
                Our average response time is under 2 hours for live chat and 24
                hours for email. We're committed to providing you with quick and
                helpful support.
              </p>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <p className="text-[10px] text-gray-400 font-bold italic leading-tight mb-1">
                    {"<2hrs"}
                  </p>
                  <p className="text-xs text-gray-900 font-bold italic leading-tight">
                    Live Chat
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold italic leading-tight mb-1">
                    {"<24hrs"}
                  </p>
                  <p className="text-xs text-gray-900 font-bold italic leading-tight">
                    Email
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold italic leading-tight mb-1">
                    Immediate
                  </p>
                  <p className="text-xs text-gray-900 font-bold italic leading-tight">
                    Phone
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
