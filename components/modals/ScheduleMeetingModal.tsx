"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  X,
  ChevronDown,
  Clock,
  Type,
  MapPin,
  DollarSign,
  User,
  AlignLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ScheduleMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ScheduleMeetingModal: React.FC<ScheduleMeetingModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);

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
            <h2 className="text-xl font-bold text-mainText italic">
              Schedule Meeting
            </h2>
            <p className="text-sm text-body italic opacity-70">
              Plan a meeting with Sarah Johnson
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
            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-mainText italic flex items-center gap-2">
                <Type className="w-4 h-4 text-body" /> Title{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter meeting title"
                className="w-full border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary bg-gray-50"
              />
            </div>

            {/* Value */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-mainText italic flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-body" /> Value
              </label>
              <div className="relative">
                <select className="w-full border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary appearance-none bg-gray-50 cursor-pointer">
                  <option value="" disabled selected>
                    Select Value
                  </option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <ChevronDown className="absolute right-4 top-3.5 w-4 h-4 text-body pointer-events-none" />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-mainText italic flex items-center gap-2">
                <MapPin className="w-4 h-4 text-body" /> Location
              </label>
              <input
                type="text"
                placeholder="Enter location or meeting link"
                className="w-full border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary bg-gray-50"
              />
            </div>

            {/* From */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-mainText italic flex items-center gap-2">
                <Clock className="w-4 h-4 text-body" /> From
              </label>
              <input
                type="text"
                placeholder="mm / dd / yy"
                className="w-full border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary bg-gray-50"
              />
            </div>

            {/* To */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-mainText italic flex items-center gap-2">
                <Clock className="w-4 h-4 text-body" /> To
              </label>
              <input
                type="text"
                placeholder="mm / dd / yy"
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
                    mm / dd / yy
                  </option>
                  <option value="host1">Host 1</option>
                </select>
                <ChevronDown className="absolute right-4 top-3.5 w-4 h-4 text-body pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-mainText italic flex items-center gap-2">
              <AlignLeft className="w-4 h-4 text-body" /> Description
            </label>
            <textarea
              placeholder="Add agenda or notes for this meeting..."
              rows={4}
              className="w-full border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary resize-none bg-white"
            />
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
            Schedule Meeting
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default ScheduleMeetingModal;
