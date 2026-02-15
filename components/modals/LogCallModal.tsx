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
  Trash2,
  UploadCloud,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { toast } from "react-hot-toast";
import { getSellers, createCall, extractId } from "@/lib/api";
import { useRef } from "react";
import { useParams } from "next/navigation";

interface LogCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadId?: string | number;
  leadName?: string;
}

const LogCallModal: React.FC<LogCallModalProps> = ({
  isOpen,
  onClose,
  leadId,
  leadName,
}) => {
  const params = useParams();
  const urlId = params?.id;

  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);
  const [recordCall, setRecordCall] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sellers, setSellers] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    user_id: "",
    subject: "",
    status: "completed",
    start_time: "",
    feedback: "",
    phone_number: "",
  });

  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setTimeout(() => setIsAnimating(true), 10);
      fetchSellers();
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const fetchSellers = async () => {
    try {
      const data = await getSellers();
      setSellers(data);
    } catch (error) {
      console.error("Error fetching sellers:", error);
    }
  };

  const handleLogCall = async () => {
    if (!formData.subject || !formData.user_id) {
      toast.error("Please fill in required fields");
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();

      // Use URL ID (usually numeric) or extract from prop (e.g. L240004 -> 4)
      const finalLeadId = urlId || (leadId ? extractId(leadId) : null);
      if (finalLeadId) data.append("lead_id", String(finalLeadId));

      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, String(value));
      });

      if (recordCall) data.append("record_call", "1");

      attachments.forEach((file) => {
        data.append("attachments[]", file);
      });

      await createCall(data);
      toast.success("Call logged successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to log call");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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
              Record a call with {leadName || "the lead"}
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
              <select
                value={formData.user_id}
                onChange={(e) =>
                  setFormData({ ...formData, user_id: e.target.value })
                }
                className="w-full border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary appearance-none bg-white cursor-pointer"
              >
                <option value="" disabled>
                  Select an option
                </option>
                {sellers.map((seller) => (
                  <option key={seller.id} value={seller.id}>
                    {seller.name}
                  </option>
                ))}
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
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                className="w-full border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary bg-gray-50"
              />
            </div>

            {/* Contact - Omitting or mapping to a field if needed */}

            {/* Start time */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-mainText italic flex items-center gap-2">
                <Clock className="w-4 h-4 text-body" /> Start time
              </label>
              <input
                type="datetime-local"
                value={formData.start_time}
                onChange={(e) =>
                  setFormData({ ...formData, start_time: e.target.value })
                }
                className="w-full border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary bg-gray-50"
              />
            </div>

            {/* Call Status */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-mainText italic flex items-center gap-2">
                <Settings className="w-4 h-4 text-body" /> Call Status
              </label>
              <div className="relative">
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary appearance-none bg-gray-50 cursor-pointer"
                >
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
                value={formData.phone_number}
                onChange={(e) =>
                  setFormData({ ...formData, phone_number: e.target.value })
                }
                className="w-full border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary bg-gray-50"
              />
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

          {/* Feedback */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-mainText italic flex items-center gap-2">
              <FileText className="w-4 h-4 text-body" /> Feedback
            </label>
            <textarea
              placeholder="Enter call feedback..."
              value={formData.feedback}
              onChange={(e) =>
                setFormData({ ...formData, feedback: e.target.value })
              }
              rows={3}
              className="w-full border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary bg-white resize-none"
            />
          </div>

          {/* Attachments Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-mainText italic">
              <FileText className="w-4 h-4 text-body" /> Attachments
            </div>

            {attachments.length > 0 && (
              <div className="space-y-3">
                {attachments.map((file, index) => (
                  <div
                    key={`attachment-${index}`}
                    className="flex items-center justify-between p-4 bg-[#F8FAFC] border border-stroke rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-body" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-mainText truncate max-w-[200px]">
                          {file.name}
                        </p>
                        <p className="text-[10px] text-body opacity-50">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeAttachment(index)}
                      className="p-2 hover:bg-red-50 rounded-full transition-colors group"
                      type="button"
                    >
                      <Trash2 className="w-4 h-4 text-body group-hover:text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              className="hidden"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#F1F5F9] rounded-[24px] p-6 flex flex-col items-center justify-center gap-3 group hover:border-primary transition-all cursor-pointer bg-white"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center group-hover:bg-primary transition-all">
                <UploadCloud className="w-4 h-4 text-primary group-hover:text-white" />
              </div>
              <div className="text-center">
                <p className="text-[12px] italic font-bold text-mainText">
                  <span className="text-primary">Click to upload</span> or drag
                  and drop
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 pt-4 flex items-center justify-center gap-4 border-t border-[#F1F5F9]">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-3 px-8 rounded-full border border-primary text-primary font-bold italic text-[15px] hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleLogCall}
            disabled={loading}
            className="flex-1 py-3 px-8 rounded-full bg-primary text-white font-bold italic text-[15px] hover:bg-primary/90 transition-all shadow-lg shadow-primary/30 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? "Logging..." : "Log Call"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default LogCallModal;
