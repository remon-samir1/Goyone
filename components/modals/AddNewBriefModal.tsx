"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddNewBriefModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddNewBriefModal: React.FC<AddNewBriefModalProps> = ({
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
        "fixed inset-0 z-[10000] flex items-center justify-center p-4 transition-opacity duration-300 ease-in-out",
        isAnimating ? "opacity-100" : "opacity-0",
      )}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className={cn(
          "relative bg-white rounded-3xl w-full max-w-[500px] shadow-2xl transform transition-all duration-300 ease-out",
          isAnimating ? "scale-100 translate-y-0" : "scale-95 translate-y-4",
        )}
      >
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-mainText italic">
              Add New Brief
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-body" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-mainText italic block">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder="Enter a brief description of the content..."
                rows={4}
                className="w-full border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary placeholder:text-placeholder/40 resize-none bg-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-mainText italic block">
                Content <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed border-[#F1F5F9] rounded-2xl p-8 flex flex-col items-center justify-center gap-3 group hover:border-primary transition-all cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center group-hover:bg-primary transition-all">
                  <UploadCloud className="w-5 h-5 text-primary group-hover:text-white" />
                </div>
                <div className="text-center">
                  <p className="text-[13px] italic font-bold text-mainText">
                    <span className="text-primary">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-[10px] text-body italic opacity-50">
                    PDF, DOC, XLS (max. 10MB)
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl border border-primary text-primary font-bold italic text-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button className="flex-1 py-3 rounded-xl bg-primary text-white font-bold italic text-sm hover:bg-primary/90 transition-all shadow-md shadow-primary/20">
                Add to Briefs
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default AddNewBriefModal;
