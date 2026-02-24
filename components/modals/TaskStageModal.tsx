"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Type, ListOrdered } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";
import { createTaskStage, updateTaskStage } from "@/lib/api";

interface TaskStageModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: {
    id: number;
    title: string;
    order?: string | number;
  } | null;
  onSuccess: () => void;
}

const TaskStageModal: React.FC<TaskStageModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onSuccess,
}) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    order: "",
  });

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setTimeout(() => setIsAnimating(true), 10);
      if (initialData) {
        setFormData({
          title: initialData.title,
          order: initialData.order ? String(initialData.order) : "",
        });
      } else {
        setFormData({
          title: "",
          order: "",
        });
      }
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, initialData]);

  const handleSave = async () => {
    if (!formData.title) {
      toast.error("Please enter a title");
      return;
    }

    setLoading(true);
    try {
      const data = {
        title: formData.title,
        order: formData.order,
      };

      if (initialData) {
        await updateTaskStage(initialData.id, data);
        toast.success("Stage updated successfully");
      } else {
        await createTaskStage(data);
        toast.success("Stage created successfully");
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(
        initialData ? "Failed to update stage" : "Failed to create stage",
      );
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
          "relative bg-white dark:bg-gray-800 rounded-[32px] w-full max-w-[500px] shadow-2xl transform transition-all duration-300 ease-out flex flex-col overflow-hidden",
          isAnimating ? "scale-100 translate-y-0" : "scale-95 translate-y-4",
        )}
      >
        {/* Header */}
        <div className="p-8 pb-4 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-mainText italic">
              {initialData ? "Update Stage" : "Create Stage"}
            </h2>
            <p className="text-sm text-body italic opacity-70">
              {initialData
                ? "Update the details of the task stage"
                : "Add a new stage to your task board"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-body" />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 pt-0 space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-mainText italic flex items-center gap-2">
              <Type className="w-4 h-4 text-body" /> Title{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter stage title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary bg-gray-50"
            />
          </div>

          {/* Order */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-mainText italic flex items-center gap-2">
              <ListOrdered className="w-4 h-4 text-body" /> Order
            </label>
            <input
              type="number"
              placeholder="Enter order (optional)"
              value={formData.order}
              onChange={(e) =>
                setFormData({ ...formData, order: e.target.value })
              }
              className="w-full border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary bg-gray-50"
            />
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
            onClick={handleSave}
            disabled={loading}
            className="flex-1 py-3 px-8 rounded-full bg-primary text-white font-bold italic text-[15px] hover:bg-primary/90 transition-all shadow-lg shadow-primary/30 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading
              ? "Saving..."
              : initialData
                ? "Update Stage"
                : "Create Stage"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default TaskStageModal;
