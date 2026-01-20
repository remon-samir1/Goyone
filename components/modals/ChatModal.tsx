"use client";
import React, { useRef, useState } from "react";
import { X, Send, Headphones } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  type: string;
  text: string;
  time: string;
}

const ChatModal = ({ isOpen, onClose }: ChatModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [chatMessage, setChatMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
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

  useGSAP(
    () => {
      if (isOpen && modalRef.current) {
        gsap.fromTo(
          modalRef.current,
          { opacity: 0, scale: 0.9, y: 20 },
          { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "back.out(1.2)" },
        );
      }
    },
    { dependencies: [isOpen], scope: containerRef },
  );

  const handleClose = () => {
    if (modalRef.current) {
      gsap.to(modalRef.current, {
        opacity: 0,
        scale: 0.9,
        y: 20,
        duration: 0.3,
        ease: "power2.in",
        onComplete: onClose,
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

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
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
              <h3 className="text-white font-bold text-sm">Support Agent</h3>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-[#8CE553] rounded-full" />
                <span className="text-white/80 text-[10px] font-medium">
                  Online
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={handleClose}
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
  );
};

export default ChatModal;
