"use client";
import {
  X,
  RotateCcw,
  Filter,
  ChevronDown,
  Calendar,
  ChevronUp,
} from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface FiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FiltersModal = ({ isOpen, onClose }: FiltersModalProps) => {
  const [isFeedbackDateOpen, setIsFeedbackDateOpen] = useState(true);
  const [render, setRender] = useState(isOpen);
  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Handle mounting/unmounting for animations
  useEffect(() => {
    if (isOpen) {
      setRender(true);
    }
  }, [isOpen]);

  useGSAP(
    () => {
      if (!render) return;

      if (isOpen) {
        // Entry animation
        const tl = gsap.timeline();

        tl.set(backdropRef.current, { opacity: 0 })
          .to(backdropRef.current, { opacity: 1, duration: 0.3 })
          .fromTo(
            sidebarRef.current,
            {
              clipPath: "circle(0% at 100% 0%)", // Starting from top-right corner
              opacity: 0,
            },
            {
              clipPath: "circle(150% at 100% 0%)", // Expand to cover full height/width
              opacity: 1,
              duration: 0.5,
              ease: "power2.out",
            },
            "-=0.2",
          );
      } else {
        // Exit animation
        const tl = gsap.timeline({
          onComplete: () => setRender(false),
        });

        tl.to(sidebarRef.current, {
          clipPath: "circle(0% at 100% 0%)",
          opacity: 0,
          duration: 0.4,
          ease: "power2.in",
        }).to(
          backdropRef.current,
          {
            opacity: 0,
            duration: 0.3,
          },
          "-=0.2",
        );
      }
    },
    { dependencies: [isOpen, render], scope: modalRef },
  );

  if (!render) return null;

  return (
    <div ref={modalRef} className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-black/20 backdrop-blur-[1px]"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col"
        style={{ clipPath: "circle(0% at 100% 0%)" }} // Initial state
      >
        {/* Header */}
        <div className="p-6 pb-4 border-b border-gray-100 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
              <Filter className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 italic">
                Advanced Filters
              </h2>
              <p className="text-gray-500 text-xs italic">
                Refine results in seconds
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="px-6 py-2 border-b border-gray-50">
          <button className="flex items-center gap-1.5 text-blue-500 text-xs font-medium hover:text-blue-600 transition-colors">
            <RotateCcw className="w-3.5 h-3.5" />
            Reset all filters
          </button>
        </div>

        {/* content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Seller Name */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-900 italic">
              Seller Name
            </label>
            <div className="relative">
              <select className="w-full p-3 bg-gray-50 border-none rounded-xl text-sm text-gray-500 appearance-none outline-none focus:ring-1 focus:ring-blue-500">
                <option>Select a seller...</option>
                <option>Remon Samir</option>
                <option>John Doe</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Status */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-900 italic">
              Status
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                "New",
                "Contacted",
                "Qualified",
                "Proposal",
                "Negotiation",
                "Closed",
                "Lost",
              ].map((status) => (
                <button
                  key={status}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-xs font-medium border transition-colors italic",
                    status === "New"
                      ? "border-blue-500 text-blue-600 bg-blue-50"
                      : "border-gray-200 text-gray-500 hover:border-blue-300 hover:text-blue-500",
                  )}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Create Date */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-900 italic">
              Create Date
            </label>
            <div className="flex gap-2">
              {["Today", "Last 7 Days", "This Month", "Last Month"].map(
                (range) => (
                  <button
                    key={range}
                    className="bg-gray-50 px-3 py-1.5 rounded-lg text-xs text-gray-500 hover:bg-gray-100 transition-colors italic"
                  >
                    {range}
                  </button>
                ),
              )}
            </div>
            <div className="grid grid-cols-2 gap-4 pt-1">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 italic">
                  From
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="12/22/2025"
                    className="w-full pl-3 pr-9 py-2.5 bg-blue-50/50 border border-blue-100 rounded-lg text-xs text-gray-600 placeholder:text-gray-400 focus:outline-none focus:border-blue-300"
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 italic">
                  To
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="12/22/2025"
                    className="w-full pl-3 pr-9 py-2.5 bg-blue-50/50 border border-blue-100 rounded-lg text-xs text-gray-600 placeholder:text-gray-400 focus:outline-none focus:border-blue-300"
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Feedback Date */}
          <div className="space-y-3">
            <button
              onClick={() => setIsFeedbackDateOpen(!isFeedbackDateOpen)}
              className="w-full flex items-center justify-between group"
            >
              <label className="text-sm font-bold text-gray-900 italic cursor-pointer">
                Feedback Date
              </label>
              <ChevronUp
                className={cn(
                  "w-4 h-4 text-gray-400 transition-transform",
                  !isFeedbackDateOpen && "rotate-180",
                )}
              />
            </button>

            {isFeedbackDateOpen && (
              <div className="space-y-3 animate-in slide-in-from-top-2 duration-200">
                <div className="flex gap-2">
                  {["Today", "Last 7 Days", "This Month", "Last Month"].map(
                    (range) => (
                      <button
                        key={range}
                        className="bg-gray-50 px-3 py-1.5 rounded-lg text-xs text-gray-500 hover:bg-gray-100 transition-colors italic"
                      >
                        {range}
                      </button>
                    ),
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4 pt-1">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 italic">
                      From
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="12/22/2025"
                        className="w-full pl-3 pr-9 py-2.5 bg-blue-50/50 border border-blue-100 rounded-lg text-xs text-gray-600 placeholder:text-gray-400 focus:outline-none focus:border-blue-300"
                      />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 italic">
                      To
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="12/22/2025"
                        className="w-full pl-3 pr-9 py-2.5 bg-blue-50/50 border border-blue-100 rounded-lg text-xs text-gray-600 placeholder:text-gray-400 focus:outline-none focus:border-blue-300"
                      />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-full border border-blue-500 text-blue-500 text-sm font-medium hover:bg-blue-50 transition-colors italic"
          >
            Clear
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-full bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all italic"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FiltersModal;
