"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  X,
  User,
  ChevronDown,
  Calendar,
  Type,
  Link2,
  FileText,
  Plus,
  UploadCloud,
} from "lucide-react";
import { cn } from "@/lib/utils";
import AddNewBriefModal from "./AddNewBriefModal";

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose }) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isBriefModalOpen, setIsBriefModalOpen] = useState(false);

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
            <h2 className="text-xl font-bold text-mainText italic">Add Task</h2>
            <p className="text-sm text-body italic opacity-70">
              Create a new task for Sarah Johnson
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
            {/* Parent */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-mainText italic flex items-center gap-2">
                <Link2 className="w-4 h-4 text-body" /> Parent
              </label>
              <div className="relative">
                <select className="w-full border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary appearance-none bg-gray-50 cursor-pointer">
                  <option value="" disabled selected>
                    Select parent
                  </option>
                </select>
                <ChevronDown className="absolute right-4 top-3.5 w-4 h-4 text-body pointer-events-none" />
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-mainText italic flex items-center gap-2">
                <Type className="w-4 h-4 text-body" /> Title{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter task title"
                className="w-full border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary bg-gray-50"
              />
            </div>

            {/* Started at */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-mainText italic flex items-center gap-2">
                <Calendar className="w-4 h-4 text-body" /> Started at
              </label>
              <input
                type="text"
                placeholder="13/9/2023 8:43:20 PM"
                className="w-full border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary bg-gray-50"
              />
            </div>

            {/* Ended at */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-mainText italic flex items-center gap-2">
                <Calendar className="w-4 h-4 text-body" /> Ended at
              </label>
              <input
                type="text"
                placeholder="13/9/2023 8:43:20 PM"
                className="w-full border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary bg-gray-50"
              />
            </div>
          </div>

          {/* To */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-mainText italic flex items-center gap-2">
              <User className="w-4 h-4 text-body" /> To
            </label>
            <div className="relative">
              <select className="w-full border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary appearance-none bg-gray-50 cursor-pointer">
                <option value="" disabled selected>
                  Assign to
                </option>
                <option value="user1">User 1</option>
              </select>
              <ChevronDown className="absolute right-4 top-3.5 w-4 h-4 text-body pointer-events-none" />
            </div>
          </div>

          {/* Briefs Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-mainText italic">
                <FileText className="w-4 h-4 text-body" /> Briefs
              </div>
              <button
                onClick={() => setIsBriefModalOpen(true)}
                className="text-[11px] font-bold text-primary italic flex items-center gap-1 hover:opacity-80 transition-opacity"
              >
                <Plus className="w-3 h-3" /> Add new Briefs
              </button>
            </div>

            <div className="bg-[#F8FAFC] border border-stroke rounded-xl p-8 text-center space-y-2">
              <p className="text-[11px] text-body italic opacity-50">
                No briefs added yet. Click "Add New Brief" to get started.
              </p>
            </div>

            {/* Upload Area */}
            <div className="border-2 border-dashed border-[#F1F5F9] rounded-[24px] p-10 flex flex-col items-center justify-center gap-3 group hover:border-primary transition-all cursor-pointer bg-white">
              <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center group-hover:bg-primary transition-all">
                <UploadCloud className="w-5 h-5 text-primary group-hover:text-white" />
              </div>
              <div className="text-center">
                <p className="text-[13px] italic font-bold text-mainText">
                  <span className="text-primary">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-[10px] text-body italic opacity-50">
                  PDF, DOC, XLS (max. 10MB)
                </p>
              </div>
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
            Save Task
          </button>
        </div>
      </div>

      <AddNewBriefModal
        isOpen={isBriefModalOpen}
        onClose={() => setIsBriefModalOpen(false)}
      />
    </div>,
    document.body,
  );
};

export default AddTaskModal;
