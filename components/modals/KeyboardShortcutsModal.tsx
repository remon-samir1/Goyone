"use client";

import React, { useEffect } from "react";
import { X, Command, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const shortcuts = [
    { label: "Create New Lead", keys: "Ctrl + M" },
    { label: "Quick Search", keys: "Ctrl + K" },
    { label: "Save Changes", keys: "Ctrl + S" },
    { label: "Export Data", keys: "Ctrl + E" },
    { label: "Close Modal", keys: "Esc" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0  bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="bg-white rounded-[24px] shadow-xl w-full max-w-sm overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 pb-2">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                <Command className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold text-gray-900 italic">
                Keyboard Shortcuts
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* Shortcuts List */}
          <div className="space-y-6">
            {shortcuts.map((shortcut, index) => (
              <div
                key={index}
                className="flex items-center justify-between group"
              >
                <span className="text-[15px] font-medium text-gray-600 italic group-hover:text-gray-900 transition-colors">
                  {shortcut.label}
                </span>
                <div className="px-3 py-1.5 bg-white border border-gray-200 rounded-md shadow-sm">
                  <span className="text-xs font-semibold text-gray-500 italic">
                    {shortcut.keys}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Footer - Show All Shortcuts */}
          <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
            <span className="text-[15px] font-medium text-gray-600 italic">
              Show All Shortcuts
            </span>
            <div className="w-8 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-sm font-bold text-gray-500">?</span>
            </div>
          </div>
        </div>
        <div className="h-6"></div>
      </div>
    </div>
  );
};

export default KeyboardShortcutsModal;
