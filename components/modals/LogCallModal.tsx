"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  X,
  ChevronDown,
  Clock,
  Phone,
  User,
  FileText,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LogCallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LogCallModal: React.FC<LogCallModalProps> = ({ isOpen, onClose }) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);
  const [recordCall, setRecordCall] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-opacity duration-300 ease-in-out",
        isAnimating ? "opacity-100" : "opacity-0",
      )}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className={cn(
          "relative bg-white rounded-[32px] w-full max-w-[700px] shadow-2xl transform transition-all duration-300 ease-out flex flex-col max-h-[90vh] overflow-hidden",
          isAnimating ? "scale-100 translate-y-0" : "scale-95 translate-y-4",
        )}
      >
        {/* Header */}
        <div className="p-8 pb-4 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-mainText italic">Log Call</h2>
            <p className="text-sm text-body italic opacity-70">
              Record a call with Sarah Johnson
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-body" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-8 pt-0 space-y-6">
          {/* Select Sellers */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-mainText italic block">
              Select sellers <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select className="w-full border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary appearance-none bg-white cursor-pointer">
                <option value="" disabled selected>
                  Select an option
                </option>
                <option value="seller1">Seller 1</option>
                <option value="seller2">Seller 2</option>
              </select>
              <ChevronDown className="absolute right-4 top-3.5 w-4 h-4 text-body pointer-events-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Subject */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-mainText italic flex items-center gap-2">
                <FileText className="w-4 h-4 text-body" /> Subject{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter call subject"
                className="w-full border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary bg-gray-50"
              />
            </div>

            {/* Contact */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-mainText italic flex items-center gap-2">
                <User className="w-4 h-4 text-body" /> Contact
              </label>
              <div className="relative">
                <select className="w-full border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary appearance-none bg-gray-50 cursor-pointer">
                  <option value="" disabled selected>
                    Select Contact
                  </option>
                  <option value="contact1">Contact 1</option>
                </select>
                <ChevronDown className="absolute right-4 top-3.5 w-4 h-4 text-body pointer-events-none" />
              </div>
            </div>

            {/* Start time */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-mainText italic flex items-center gap-2">
                <Clock className="w-4 h-4 text-body" /> Start time
              </label>
              <input
                type="text"
                placeholder="mm / dd / yy"
                className="w-full border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary bg-gray-50"
              />
            </div>

            {/* Call Status */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-mainText italic flex items-center gap-2">
                <Settings className="w-4 h-4 text-body" /> Call Status
              </label>
              <div className="relative">
                <select className="w-full border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary appearance-none bg-gray-50 cursor-pointer">
                  <option value="" disabled selected>
                    Select Status
                  </option>
                  <option value="completed">Completed</option>
                  <option value="missed">Missed</option>
                  <option value="scheduled">Scheduled</option>
                </select>
                <ChevronDown className="absolute right-4 top-3.5 w-4 h-4 text-body pointer-events-none" />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-mainText italic flex items-center gap-2">
                <Phone className="w-4 h-4 text-body" /> Phone Number
              </label>
              <input
                type="text"
                placeholder="01018883449"
                className="w-full border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary bg-gray-50"
              />
            </div>

            {/* Host */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-mainText italic flex items-center gap-2">
                <User className="w-4 h-4 text-body" /> Host
              </label>
              <div className="relative">
                <select className="w-full border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary appearance-none bg-gray-50 cursor-pointer">
                  <option value="" disabled selected>
                    Select host
                  </option>
                  <option value="host1">Host 1</option>
                </select>
                <ChevronDown className="absolute right-4 top-3.5 w-4 h-4 text-body pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Record Call Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setRecordCall(!recordCall)}
              className={cn(
                "w-12 h-6 rounded-full transition-colors relative",
                recordCall ? "bg-primary" : "bg-gray-200",
              )}
            >
              <div
                className={cn(
                  "w-5 h-5 rounded-full bg-white shadow-md absolute top-0.5 transition-transform",
                  recordCall ? "translate-x-6" : "translate-x-0.5",
                )}
              />
            </button>
            <div className="flex items-center gap-2 text-sm text-body italic">
              <Settings className="w-4 h-4" /> Record call
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 pt-4 flex items-center justify-center gap-4 border-t border-[#F1F5F9]">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-8 rounded-full border border-primary text-primary font-bold italic text-[15px] hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button className="flex-1 py-3 px-8 rounded-full bg-primary text-white font-bold italic text-[15px] hover:bg-primary/90 transition-all shadow-lg shadow-primary/30">
            Log Call
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default LogCallModal;
