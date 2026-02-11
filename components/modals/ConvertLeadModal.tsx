"use client";

import React, { useEffect, useState } from "react";
import { User, Building2, Loader2, Zap, X } from "lucide-react";
import { convertLead } from "@/lib/api";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";

interface ConvertLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadId: string | number | null;
  onSuccess?: () => void;
}

const ConvertLeadModal = ({
  isOpen,
  onClose,
  leadId,
  onSuccess,
}: ConvertLeadModalProps) => {
  const [loading, setLoading] = useState(false);
  const [convertingTo, setConvertingTo] = useState<
    "contacts" | "companyAccounts" | null
  >(null);
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

  const handleConvert = async (convertTo: "contacts" | "companyAccounts") => {
    if (!leadId) return;
    setLoading(true);
    setConvertingTo(convertTo);
    try {
      await convertLead(leadId, convertTo);
      toast.success(
        `Lead converted successfully to ${
          convertTo === "contacts" ? "Individual" : "Company"
        } Account`,
      );
      if (onSuccess) onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Error converting lead:", error);
      toast.error(error.response?.data?.message || "Failed to convert lead");
    } finally {
      setLoading(false);
      setConvertingTo(null);
    }
  };

  if (!shouldRender) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-300 ease-in-out",
        isAnimating ? "opacity-100" : "opacity-0",
      )}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={loading ? undefined : onClose}
      />

      {/* Modal Content */}
      <div
        className={cn(
          "relative bg-white rounded-3xl w-full max-w-[600px] shadow-2xl transform transition-all duration-300 ease-out flex flex-col overflow-hidden",
          isAnimating ? "scale-100 translate-y-0" : "scale-95 translate-y-4",
        )}
      >
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-6 right-6 text-placeholder hover:text-mainText transition-colors p-1"
        >
          <X size={20} />
        </button>

        <div className="p-10 pb-4">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-primary fill-primary/20" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-mainText italic">
                Convert Lead
              </h2>
              <p className="text-body italic text-sm mt-1">
                Choose the account type for this conversion
              </p>
            </div>
          </div>
        </div>

        <div className="px-10 py-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Individual Account Option */}
          <button
            onClick={() => handleConvert("contacts")}
            disabled={loading}
            className={`group text-left p-8 rounded-3xl border-2 transition-all duration-300 flex flex-col items-center gap-5 ${
              convertingTo === "contacts"
                ? "border-primary bg-primary/5 shadow-inner"
                : "border-stroke hover:border-primary/40 hover:bg-gray-50 active:scale-[0.98]"
            }`}
          >
            <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-3xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm">
              {loading && convertingTo === "contacts" ? (
                <Loader2 className="w-9 h-9 animate-spin" />
              ) : (
                <User className="w-9 h-9" />
              )}
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-mainText italic">
                Individual Account
              </p>
              <p className="text-xs text-body italic mt-2 leading-relaxed">
                Convert this lead into a private customer contact
              </p>
            </div>
          </button>

          {/* Company Account Option */}
          <button
            onClick={() => handleConvert("companyAccounts")}
            disabled={loading}
            className={`group text-left p-8 rounded-3xl border-2 transition-all duration-300 flex flex-col items-center gap-5 ${
              convertingTo === "companyAccounts"
                ? "border-primary bg-primary/5 shadow-inner"
                : "border-stroke hover:border-primary/40 hover:bg-gray-50 active:scale-[0.98]"
            }`}
          >
            <div className="w-20 h-20 bg-purple-50 text-purple-500 rounded-3xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm">
              {loading && convertingTo === "companyAccounts" ? (
                <Loader2 className="w-9 h-9 animate-spin" />
              ) : (
                <Building2 className="w-9 h-9" />
              )}
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-mainText italic">
                Company Account
              </p>
              <p className="text-xs text-body italic mt-2 leading-relaxed">
                Convert this lead into a business organization entity
              </p>
            </div>
          </button>
        </div>

        <div className="p-10 pt-4 flex justify-end items-center gap-6">
          <button
            onClick={onClose}
            disabled={loading}
            className="text-placeholder font-bold italic text-base hover:text-mainText transition-colors px-4"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConvertLeadModal;
