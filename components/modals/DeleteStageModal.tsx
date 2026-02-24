"use client";

import React, { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface DeleteStageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  count: number;
  isLoading?: boolean;
}

const DeleteStageModal: React.FC<DeleteStageModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  count,
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
          "relative bg-white dark:bg-gray-800 rounded-[32px] w-full max-w-[500px] shadow-2xl transform transition-all duration-300 ease-out p-10 text-center flex flex-col items-center",
          isAnimating ? "scale-100 translate-y-0" : "scale-95 translate-y-4",
        )}
      >
        {/* Icon */}
        <div className="w-20 h-20 bg-[#FEF2F2] rounded-full flex items-center justify-center mb-6">
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm">
            <Trash2 className="w-7 h-7 text-[#EF4444]" />
          </div>
        </div>

        {/* Text */}
        <h2 className="text-xl font-bold text-mainText italic mb-2">
          Are you sure you want to delete {count} stage{count !== 1 ? "s" : ""}?
        </h2>
        <p className="text-body text-sm italic mb-10 opacity-70">
          This action cannot be undone. All tasks in these stages will also be
          deleted.
        </p>

        {/* Actions */}
        <div className="flex items-center justify-center gap-4 w-full">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-3 rounded-full border border-[#CBD5E1] text-[#64748B] font-bold italic hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            No, Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 py-3 rounded-full bg-[#EF4444] text-white font-bold italic hover:bg-[#DC2626] transition-colors shadow-lg shadow-red-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteStageModal;
