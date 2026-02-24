"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, ChevronDown, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";
import { getSellers, changeOwner } from "@/lib/api";

interface ChangeOwnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadId: string | number | null;
  leadName?: string;
  onSuccess?: () => void;
}

const ChangeOwnerModal: React.FC<ChangeOwnerModalProps> = ({
  isOpen,
  onClose,
  leadId,
  leadName,
  onSuccess,
}) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sellers, setSellers] = useState<any[]>([]);
  const [selectedSellerId, setSelectedSellerId] = useState<string>("");

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
      toast.error("Failed to load sellers");
    }
  };

  const handleChangeOwner = async () => {
    if (!selectedSellerId) {
      toast.error("Please select a seller");
      return;
    }

    if (!leadId) {
      toast.error("Invalid Lead ID");
      return;
    }

    setLoading(true);
    try {
      await changeOwner(leadId, selectedSellerId);
      toast.success("Owner changed successfully");
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      toast.error("Failed to change owner");
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
          "relative bg-white dark:bg-gray-800 rounded-[32px] w-full max-w-[500px] shadow-2xl transform transition-all duration-300 ease-out flex flex-col max-h-[90vh] overflow-hidden",
          isAnimating ? "scale-100 translate-y-0" : "scale-95 translate-y-4",
        )}
      >
        <div className="p-8 pb-4 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-mainText italic">
              Change Owner
            </h2>
            <p className="text-sm text-body italic opacity-70">
              Assign {leadName || "the lead"} to a different seller
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-body" />
          </button>
        </div>

        <div className="p-8 pt-0 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-mainText italic block">
              <User className="w-4 h-4 inline-block mr-2 text-body" />
              Select New Owner <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={selectedSellerId}
                onChange={(e) => setSelectedSellerId(e.target.value)}
                className="w-full border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary appearance-none bg-white cursor-pointer"
              >
                <option value="" disabled>
                  Select a seller
                </option>
                {sellers.map((seller) => (
                  <option key={seller.id} value={seller.id}>
                    {seller.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-4.5 w-4 h-4 text-body pointer-events-none" />
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
            onClick={handleChangeOwner}
            disabled={loading}
            className="flex-1 py-3 px-8 rounded-full bg-primary text-white font-bold italic text-[15px] hover:bg-primary/90 transition-all shadow-lg shadow-primary/30 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? "Changing..." : "Change Owner"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default ChangeOwnerModal;
