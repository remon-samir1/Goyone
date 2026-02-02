"use client";

import React, { useEffect, useState } from "react";
import { Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DeleteLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  leadName: string;
  isLoading?: boolean;
}

const DeleteLeadModal: React.FC<DeleteLeadModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  leadName,
  isLoading = false,
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

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-300 ease-in-out",
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
          "relative bg-white rounded-[8px] w-full max-w-[700px] shadow-2xl transform transition-all duration-300 ease-out p-10 text-center",
          isAnimating ? "scale-100 translate-y-0" : "scale-95 translate-y-4",
        )}
      >
        {/* Icon */}
        <div className="mx-auto w-20 h-20 bg-[#FEF2F2] rounded-full flex items-center justify-center mb-6">
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm">
            <Trash2 className="w-7 h-7 text-[#EF4444]" />
          </div>
        </div>

        {/* Text */}
        <h2 className="text-xl font-bold text-mainText italic mb-2">
          Are you sure you want to delete "{leadName}"?
        </h2>
        <p className="text-body text-sm italic mb-10">
          Are you sure you want to delete this Lead?
        </p>

        {/* Actions */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-10 py-3 rounded-full border border-[#CBD5E1] text-[#64748B] font-bold italic hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            No, Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-10 py-3 rounded-full bg-[#EF4444] text-white font-bold italic hover:bg-[#DC2626] transition-colors shadow-lg shadow-red-200 disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteLeadModal;
