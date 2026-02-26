"use client";

import React, { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import {
  X,
  ChevronDown,
  Clock,
  Type,
  AlignLeft,
  UploadCloud,
  FileText,
  Trash2,
  Palette,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";
import { getSellers, createCalendar, getCalendarColors } from "@/lib/api";

interface CreateCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const CreateCalendarModal: React.FC<CreateCalendarModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sellers, setSellers] = useState<any[]>([]);
  const [colors, setColors] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    calendar_color_id: "",
    textColor: "#ffffff",
    starts_at: "",
    ends_at: "",
    user_id: "",
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
      fetchData();
      // Reset form
      setFormData({
        name: "",
        description: "",
        calendar_color_id: "",
        textColor: "#ffffff",
        starts_at: "",
        ends_at: "",
        user_id: "",
      });
      setAttachments([]);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const fetchData = async () => {
    try {
      const [sellersData, colorsData] = await Promise.all([
        getSellers(),
        getCalendarColors(),
      ]);
      setSellers(sellersData);
      setColors(colorsData);
    } catch (error) {
      console.error("Error fetching dependencies:", error);
      toast.error("Failed to load necessary form data.");
    }
  };

  const handleSubmit = async (createAnother = false) => {
    if (
      !formData.name ||
      !formData.starts_at ||
      !formData.ends_at ||
      !formData.calendar_color_id ||
      !formData.user_id ||
      !formData.textColor
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        let finalValue = String(value);
        if ((key === "starts_at" || key === "ends_at") && finalValue) {
          // Replace T with space and ensure Y-m-d H:i:s format
          finalValue = finalValue.replace("T", " ");
          if (finalValue.length === 16) {
            finalValue += ":00";
          }
        }
        data.append(key, finalValue);
      });

      attachments.forEach((file) => {
        data.append("attachments[]", file);
      });

      await createCalendar(data);
      toast.success("Calendar event created successfully");

      if (onSuccess) {
        onSuccess();
      }

      if (createAnother) {
        setFormData({
          ...formData,
          name: "",
          description: "",
          starts_at: "",
          ends_at: "",
        });
        setAttachments([]);
      } else {
        onClose();
      }
    } catch (error) {
      toast.error("Failed to create calendar event");
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
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className={cn(
          "relative bg-white dark:bg-gray-800 rounded-[32px] w-full max-w-[700px] shadow-2xl transform transition-all duration-300 ease-out flex flex-col max-h-[90vh] overflow-hidden",
          isAnimating ? "scale-100 translate-y-0" : "scale-95 translate-y-4",
        )}
      >
        <div className="p-8 pb-4 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-mainText italic">
              Create new calendar event
            </h2>
            <p className="text-sm text-body italic opacity-70">
              Add a new event to the calendar
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-body" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 pt-0 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-mainText italic block">
              User / Seller <span className="text-red-500">*</span>
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
                  Select a user
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
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-mainText italic flex items-center gap-2">
                <Type className="w-4 h-4 text-body" /> Name{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter calendar name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary bg-gray-50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-mainText italic flex items-center gap-2">
                <Palette className="w-4 h-4 text-body" /> Label{" "}
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={formData.calendar_color_id}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      calendar_color_id: e.target.value,
                    })
                  }
                  className="w-full border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary appearance-none bg-gray-50 cursor-pointer"
                >
                  <option value="" disabled>
                    Select a label
                  </option>
                  {colors.map((color) => (
                    <option key={color.id} value={color.id}>
                      {color.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-3.5 w-4 h-4 text-body pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2 flex flex-col items-start h-full">
              <label className="text-sm font-bold text-mainText italic flex items-center gap-2">
                <Palette className="w-4 h-4 text-body" /> Text Color{" "}
                <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4 items-center h-full w-full">
                <input
                  type="color"
                  value={formData.textColor}
                  onChange={(e) =>
                    setFormData({ ...formData, textColor: e.target.value })
                  }
                  className="h-10 w-12 cursor-pointer border-none bg-transparent"
                />
                <span className="text-sm text-body italic bg-gray-50 px-3 py-2 rounded-xl border border-[#F1F5F9] flex-1">
                  {formData.textColor}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-mainText italic flex items-center gap-2">
                <Clock className="w-4 h-4 text-body" /> Starts At{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={formData.starts_at}
                onChange={(e) =>
                  setFormData({ ...formData, starts_at: e.target.value })
                }
                className="w-full border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary bg-gray-50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-mainText italic flex items-center gap-2">
                <Clock className="w-4 h-4 text-body" /> Ends At{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={formData.ends_at}
                onChange={(e) =>
                  setFormData({ ...formData, ends_at: e.target.value })
                }
                className="w-full border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary bg-gray-50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-mainText italic flex items-center gap-2">
              <AlignLeft className="w-4 h-4 text-body" /> Description
            </label>
            <textarea
              placeholder="Add description..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              className="w-full border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary resize-none bg-white"
            />
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-2 text-sm font-bold text-mainText italic">
              <UploadCloud className="w-4 h-4 text-body" /> Attachments
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

        <div className="p-8 pt-4 flex items-center justify-center gap-4 border-t border-[#F1F5F9]">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-3 px-8 rounded-full border border-primary text-primary font-bold italic text-[15px] hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={() => handleSubmit(true)}
            disabled={loading}
            className="flex-1 py-3 px-8 rounded-full border border-primary bg-white text-primary font-bold italic text-[15px] hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {loading ? "Saving..." : "Create & create another"}
          </button>
          <button
            onClick={() => handleSubmit(false)}
            disabled={loading}
            className="flex-1 py-3 px-8 rounded-full bg-primary text-white font-bold italic text-[15px] hover:bg-primary/90 transition-all shadow-lg shadow-primary/30 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default CreateCalendarModal;
