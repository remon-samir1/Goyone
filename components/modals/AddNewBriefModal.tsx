"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Trash2, UploadCloud, X, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRef } from "react";
import { toast } from "react-hot-toast";

interface AddNewBriefModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (brief: { description: string; file: File }) => void;
}

const AddNewBriefModal: React.FC<AddNewBriefModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Reset state when closing
  useEffect(() => {
    if (!isOpen) {
      setDescription("");
      setFile(null);
    }
  }, [isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleAdd = () => {
    if (!description.trim()) {
      toast.error("Please enter a description");
      return;
    }
    if (!file) {
      toast.error("Please upload a file");
      return;
    }

    onAdd({ description, file });
    onClose();
  };

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
          "relative bg-white dark:bg-gray-800 rounded-3xl w-full max-w-[500px] shadow-2xl transform transition-all duration-300 ease-out",
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
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter a brief description of the content..."
                rows={4}
                className="w-full border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary placeholder:text-placeholder/40 resize-none bg-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-mainText italic block">
                Content <span className="text-red-500">*</span>
              </label>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />

              {file ? (
                <div className="flex items-center justify-between p-4 bg-[#F8FAFC] border border-stroke rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="w-4 h-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-mainText truncate">
                        {file.name}
                      </p>
                      <p className="text-[10px] text-body opacity-50">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setFile(null)}
                    className="p-2 hover:bg-red-50 rounded-full transition-colors group"
                  >
                    <Trash2 className="w-4 h-4 text-body group-hover:text-red-500" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#F1F5F9] rounded-2xl p-8 flex flex-col items-center justify-center gap-3 group hover:border-primary transition-all cursor-pointer bg-white"
                >
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
              )}
            </div>

            <div className="flex items-center gap-4 pt-2">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl border border-primary text-primary font-bold italic text-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className="flex-1 py-3 rounded-xl bg-primary text-white font-bold italic text-sm hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
              >
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
