import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

interface CreateLeadSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (source: { id: number; name: string }) => void;
}

const CreateLeadSourceModal: React.FC<CreateLeadSourceModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);
  const [name, setName] = useState("");

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

  const handleCreate = () => {
    if (name.trim()) {
      onSuccess({ id: Date.now(), name });
      setName("");
      onClose();
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
          "relative bg-white rounded-3xl w-full max-w-[600px] shadow-2xl transform transition-all duration-300 ease-out",
          isAnimating ? "scale-100 translate-y-0" : "scale-95 translate-y-4",
        )}
      >
        <div className="p-8">
          <h2 className="text-2xl font-bold text-primary italic mb-6">
            Create lead source
          </h2>

          <div className="space-y-6">
            <div>
              <label className="text-base font-bold text-mainText italic mb-2 block">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-stroke rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-body italic"
                placeholder="Enter lead source name"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleCreate}
                className="px-8 py-2.5 rounded-full bg-primary text-white text-sm font-bold italic hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30"
              >
                Create
              </button>
              <button
                onClick={onClose}
                className="px-8 py-2.5 rounded-full border border-stroke text-primary text-sm font-bold italic hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default CreateLeadSourceModal;
