"use client";
import React, { useState, useRef } from "react";
import {
  Search,
  MessageCircle,
  Mail,
  Phone,
  Send,
  Zap,
  Clock,
  X,
  Headphones,
} from "lucide-react";
import HelpSidebar from "@/components/help/HelpSidebar";
import { cn } from "@/lib/utils";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const ContactPage = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      type: "agent",
      text: "Hello! How can I help you today?",
      time: "2:30 PM",
    },
    { type: "user", text: "hi", time: "4:12 PM" },
    {
      type: "agent",
      text: "Thank you for your message. Let me help you with that.",
      time: "4:12 PM",
    },
    { type: "user", text: "I need articles", time: "4:12 PM" },
  ]);
  const modalRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Animation for chat modal
  useGSAP(
    () => {
      if (isChatOpen && modalRef.current) {
        gsap.fromTo(
          modalRef.current,
          { opacity: 0, scale: 0.9, y: 20 },
          { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "back.out(1.2)" },
        );
      }
    },
    { dependencies: [isChatOpen], scope: containerRef },
  );

  const closeChat = () => {
    if (modalRef.current) {
      gsap.to(modalRef.current, {
        opacity: 0,
        scale: 0.9,
        y: 20,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => setIsChatOpen(false),
      });
    }
  };

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      const now = new Date();
      const time = now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      });
      setMessages([...messages, { type: "user", text: chatMessage, time }]);
      setChatMessage("");

      // Simulate agent response
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            type: "agent",
            text: "Thanks for your message! Our team will assist you shortly.",
            time: new Date().toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
            }),
          },
        ]);
      }, 1000);
    }
  };

  return (
    <div
      ref={containerRef}
      className="px-[%] pb-[50px] mx-auto min-h-[calc(100vh-100px)]"
    >
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
                <button
                  onClick={() => setIsChatOpen(true)}
                  className="w-full py-2.5 bg-[#8CE553] text-white rounded-xl text-xs font-bold italic hover:bg-[#7cd442] transition-colors mt-auto"
                >
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

      {/* Chat Modal */}
      {isChatOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeChat}
          />

          {/* Chat Window */}
          <div
            ref={modalRef}
            className="relative z-10 w-full max-w-[400px] mx-4 bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-primary px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Headphones className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">
                    Support Agent
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-[#8CE553] rounded-full" />
                    <span className="text-white/80 text-[10px] font-medium">
                      Online
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={closeChat}
                className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Messages */}
            <div className="h-[350px] overflow-y-auto p-6 space-y-4 bg-gray-50/30">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex flex-col",
                    msg.type === "user" ? "items-end" : "items-start",
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[80%] px-4 py-3 rounded-2xl text-sm",
                      msg.type === "user"
                        ? "bg-primary text-white rounded-br-md"
                        : "bg-white border border-gray-100 text-gray-700 rounded-bl-md shadow-sm",
                    )}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1.5 px-1">
                    {msg.time}
                  </span>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-100">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
                />
                <button
                  onClick={handleSendMessage}
                  className="w-11 h-11 bg-primary rounded-xl flex items-center justify-center text-white hover:bg-primary/90 transition-colors flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactPage;
