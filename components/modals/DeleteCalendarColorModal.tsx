"use client";

import React, { useState } from "react";
import { X, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { deleteCalendarColor } from "@/lib/api";

interface DeleteCalendarColorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  colorId: string | number;
}

const DeleteCalendarColorModal: React.FC<DeleteCalendarColorModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  colorId,
}) => {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteCalendarColor(colorId);
      toast.success("Calendar color deleted successfully");
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete calendar color");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-[450px] rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="p-10 flex flex-col items-center text-center space-y-6">
          {/* Icon */}
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-[#EF4444] shadow-inner">
            <Trash2 className="w-10 h-10" />
          </div>

          {/* Text */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-mainText italic">
              Delete calendar color
            </h2>
            <p className="text-slate-400 text-sm italic">
              Are you sure you would like to do this?
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 w-full pt-4">
            <button
              onClick={onClose}
              className="flex-1 py-4 px-6 rounded-full border border-slate-200 text-sm font-bold text-slate-500 hover:bg-slate-50 transition-all italic"
            >
              No, Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="flex-1 py-4 px-6 rounded-full bg-[#EF4444] text-white text-sm font-bold hover:bg-red-600 transition-all disabled:opacity-50 italic shadow-lg shadow-red-500/20"
            >
              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteCalendarColorModal;
