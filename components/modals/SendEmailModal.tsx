"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  X,
  ChevronDown,
  Mail,
  UploadCloud,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Link2,
  Heading1,
  Code,
  Quote,
  List,
  ListOrdered,
  Table,
  Image,
  Undo,
  Redo,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SendEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SendEmailModal: React.FC<SendEmailModalProps> = ({ isOpen, onClose }) => {
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

  const toolbarButtons = [
    { icon: Bold, label: "Bold" },
    { icon: Italic, label: "Italic" },
    { icon: Underline, label: "Underline" },
    { icon: Strikethrough, label: "Strikethrough" },
    { icon: Link2, label: "Link" },
    { icon: Heading1, label: "Heading" },
    { icon: Code, label: "Code" },
    { icon: Quote, label: "Quote" },
    { icon: ListOrdered, label: "Ordered List" },
    { icon: List, label: "Unordered List" },
    { icon: Table, label: "Table" },
    { icon: Image, label: "Image" },
    { icon: Undo, label: "Undo" },
    { icon: Redo, label: "Redo" },
  ];

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
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-xl font-bold text-mainText italic">
                Send Email
              </h2>
              <p className="text-sm text-body italic opacity-70">
                Compose an email to Sarah Johnson
              </p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Mail className="w-4 h-4 text-primary" />
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-body" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-8 pt-0 space-y-5">
          {/* To */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-mainText italic block">
              To
            </label>
            <div className="relative">
              <select className="w-full border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-primary italic focus:outline-none focus:border-primary appearance-none bg-white cursor-pointer">
                <option value="amr">~Amr Kamel</option>
              </select>
              <ChevronDown className="absolute right-4 top-3.5 w-4 h-4 text-body pointer-events-none" />
            </div>
          </div>

          {/* Cc */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-mainText italic block">
              Cc
            </label>
            <div className="relative">
              <select className="w-full border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary appearance-none bg-white cursor-pointer">
                <option value="" disabled selected>
                  Select an option
                </option>
              </select>
              <ChevronDown className="absolute right-4 top-3.5 w-4 h-4 text-body pointer-events-none" />
            </div>
          </div>

          {/* Bcc */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-mainText italic block">
              Bcc
            </label>
            <div className="relative">
              <select className="w-full border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-primary italic focus:outline-none focus:border-primary appearance-none bg-white cursor-pointer">
                <option value="" disabled selected>
                  Select an option
                </option>
              </select>
              <ChevronDown className="absolute right-4 top-3.5 w-4 h-4 text-body pointer-events-none" />
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-mainText italic block">
              Subject
            </label>
            <input
              type="text"
              placeholder="new mail"
              defaultValue="new mail"
              className="w-full border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-mainText italic focus:outline-none focus:border-primary bg-white"
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-mainText italic block">
              Content <span className="text-red-500">*</span>
            </label>
            <div className="border border-[#F1F5F9] rounded-xl overflow-hidden">
              {/* Toolbar */}
              <div className="flex items-center gap-1 p-2 border-b border-[#F1F5F9] flex-wrap">
                {toolbarButtons.map(({ icon: Icon, label }) => (
                  <button
                    key={label}
                    className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-body transition-colors"
                    title={label}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
              {/* Editor */}
              <textarea
                placeholder="Write your email content..."
                rows={5}
                className="w-full px-4 py-3 text-sm text-body italic focus:outline-none resize-none"
              />
            </div>
          </div>

          {/* Attachments */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-mainText italic block">
              Attachments
            </label>
            <div className="border-2 border-dashed border-[#F1F5F9] rounded-2xl p-8 flex flex-col items-center justify-center gap-3 group hover:border-primary transition-all cursor-pointer">
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
            Send Email
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default SendEmailModal;
