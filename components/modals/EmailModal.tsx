"use client";
import React, { useRef, useState } from "react";
import { X, Send } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EmailModal = ({ isOpen, onClose }: EmailModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [emailForm, setEmailForm] = useState({
    yourEmail: "",
    subject: "",
    message: "",
  });

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

  const handleSendEmail = () => {
    // Handle email send logic here
    handleClose();
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

      {/* Email Modal Window */}
      <div
        ref={modalRef}
        className="relative z-10 w-full max-w-[450px] mx-4 bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-5 flex items-start justify-between border-b border-gray-100 flex-shrink-0">
          <div>
            <h3 className="text-primary font-bold text-lg italic">
              Send Email
            </h3>
            <p className="text-gray-400 text-xs font-medium mt-0.5">
              We'll respond within 24 hours
            </p>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Form - Scrollable */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-900 italic">To</label>
            <input
              type="text"
              value="support@company.com"
              disabled
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-500 italic"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-900 italic">
              Your Email
            </label>
            <input
              type="email"
              value={emailForm.yourEmail}
              onChange={(e) =>
                setEmailForm({ ...emailForm, yourEmail: e.target.value })
              }
              placeholder="you@company.com"
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all placeholder:text-primary/40 placeholder:italic"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-900 italic">
              Subject
            </label>
            <input
              type="text"
              value={emailForm.subject}
              onChange={(e) =>
                setEmailForm({ ...emailForm, subject: e.target.value })
              }
              placeholder="Brief description of your issue"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 focus:bg-white transition-all placeholder:text-gray-400 placeholder:italic"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-900 italic">
              Message
            </label>
            <textarea
              rows={3}
              value={emailForm.message}
              onChange={(e) =>
                setEmailForm({ ...emailForm, message: e.target.value })
              }
              placeholder="Describe your question or issue in detail..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 focus:bg-white transition-all resize-none placeholder:text-gray-400 placeholder:italic"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 pt-2 flex items-center justify-center gap-3 flex-shrink-0 border-t border-gray-50">
          <button
            onClick={handleClose}
            className="px-8 py-2.5 border border-primary text-primary rounded-full text-sm font-bold italic hover:bg-primary/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSendEmail}
            className="flex items-center gap-2 px-8 py-2.5 bg-primary text-white rounded-full text-sm font-bold italic hover:bg-primary/90 transition-colors"
          >
            <Send className="w-4 h-4" />
            Send Email
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailModal;
