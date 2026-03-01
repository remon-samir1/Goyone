"use client";

import React, { useState, useEffect } from "react";
import { X, Palette } from "lucide-react";
import { toast } from "react-hot-toast";
import { updateCalendarColor } from "@/lib/api";

interface EditCalendarColorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  colorData: any;
}

const PRESET_COLORS = [
  "#3B82F6", // Blue
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#A855F7", // Purple
  "#EF4444", // Red
  "#EC4899", // Pink
  "#06B6D4", // Cyan
  "#F97316", // Orange
  "#6366F1", // Indigo
  "#84CC16", // Lime
];

const EditCalendarColorModal: React.FC<EditCalendarColorModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  colorData,
}) => {
  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState("#3B82F6");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (colorData) {
      setName(colorData.name || "");
      setSelectedColor(colorData.color || "#3B82F6");
    }
  }, [colorData, isOpen]);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Please enter a name");
      return;
    }

    setLoading(true);
    try {
      await updateCalendarColor(colorData.id, {
        name,
        color: selectedColor,
      });
      toast.success("Calendar color updated successfully");
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to update calendar color");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-[500px] rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 flex items-center justify-between border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#3B82F6] rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-100">
              <Palette className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-mainText italic">
              Edit calendar color
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 space-y-6">
          {/* Name Field */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-mainText italic flex items-center gap-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Lorem Ipsum"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-slate-100 rounded-xl px-4 py-3.5 text-sm text-body italic focus:outline-none focus:border-[#3B82F6] bg-[#F8FAFC] transition-colors"
            />
          </div>

          {/* Color Picker Header/Preview */}
          <div className="space-y-4">
            <label className="text-sm font-bold text-mainText italic">
              Color
            </label>
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#F8FAFC] border border-slate-100">
              <div
                className="w-14 h-14 rounded-xl shadow-lg shadow-black/5"
                style={{ backgroundColor: selectedColor }}
              ></div>
              <div>
                <p className="text-sm font-bold text-mainText italic">
                  Preview
                </p>
                <p className="text-xs text-slate-400 font-mono uppercase">
                  {selectedColor}
                </p>
              </div>
            </div>

            {/* Grid of colors */}
            <div className="grid grid-cols-5 gap-3">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`aspect-video rounded-xl transition-all hover:scale-105 active:scale-95 shadow-sm ${
                    selectedColor.toLowerCase() === color.toLowerCase()
                      ? "ring-4 ring-blue-500/20 scale-105"
                      : ""
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>

            {/* Custom color input */}
            <div className="space-y-2 pt-2">
              <label className="text-sm font-bold text-mainText italic">
                Custom color
              </label>
              <div className="relative h-10 w-full rounded-2xl overflow-hidden shadow-sm border border-slate-100">
                <input
                  type="color"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="absolute inset-x-0 -inset-y-full w-full h-[300%] cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-end gap-4">
          <button
            onClick={onClose}
            className="px-8 py-3 rounded-full border border-slate-200 text-sm font-bold text-[#3B82F6] hover:bg-slate-100 transition-all italic"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-8 py-3 rounded-full bg-[#3B82F6] text-white text-sm font-bold hover:bg-blue-600 transition-all disabled:opacity-50 italic shadow-lg shadow-blue-500/20"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCalendarColorModal;
