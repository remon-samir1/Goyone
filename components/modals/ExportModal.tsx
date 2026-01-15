
import React, { useEffect, useState } from "react";
import { Download, Users, X, Calendar, ChevronDown, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);
  const [exportScope, setExportScope] = useState<"all" | "filtered">("all");

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // Small timeout to allow render before animating in
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      // Wait for animation to finish before unmounting
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ease-in-out",
        isAnimating ? "opacity-100" : "opacity-0"
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
          "relative bg-white rounded-3xl w-full max-w-[600px] shadow-2xl transform transition-all duration-300 ease-out max-h-[90vh] overflow-y-auto",
          isAnimating ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        )}
      >
        <div className="p-8">
          {/* Header */}
          <div className="flex items-start gap-4 mb-6">
            <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
               <div className="bg-primary rounded-full p-1.5">
                  <Download className="h-4 w-4 text-white font-bold" />
               </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-mainText italic">Export</h2>
              <p className="text-body text-sm mt-1">Choose what data you want to export</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Export Scope Section */}
            <div>
              <h3 className="text-sm font-bold text-mainText italic mb-3">Export scope</h3>
              <div className="space-y-3">
                {/* All Leads Option */}
                <div
                  className={cn(
                    "flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors",
                    exportScope === "all"
                      ? "border-primary bg-blue-50/10"
                      : "border-stroke hover:border-primary/50"
                  )}
                  onClick={() => setExportScope("all")}
                >
                  <div className={cn(
                    "mt-0.5 h-4 w-4 rounded-full border flex items-center justify-center shrink-0",
                    exportScope === "all" ? "border-primary" : "border-gray-300"
                  )}>
                    {exportScope === "all" && (
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-mainText italic">All leads</h4>
                    <p className="text-sm text-body italic">Export all leads in your database</p>
                  </div>
                </div>

                {/* Filtered Leads Option */}
                <div
                  className={cn(
                    "flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors",
                    exportScope === "filtered"
                      ? "border-primary bg-blue-50/10"
                      : "border-stroke hover:border-primary/50"
                  )}
                  onClick={() => setExportScope("filtered")}
                >
                  <div className={cn(
                    "mt-0.5 h-4 w-4 rounded-full border flex items-center justify-center shrink-0",
                    exportScope === "filtered" ? "border-primary" : "border-gray-300"
                  )}>
                    {exportScope === "filtered" && (
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-mainText italic">Filtered leads</h4>
                    <p className="text-sm text-body italic">Apply filters to narrow down your export</p>
                  </div>
                </div>

                {/* Filters Section */}
                {exportScope === "filtered" && (
                  <div className="bg-[#F8FAFC] rounded-xl p-5 border border-stroke space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center gap-2 text-primary">
                      <Filter className="h-4 w-4" />
                      <h4 className="font-bold italic text-sm">Filters</h4>
                    </div>
                    
                    <div>
                        <h5 className="text-sm font-bold text-mainText italic mb-2">Date range</h5>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-mainText italic mb-1 block">From</label>
                                <div className="relative">
                                    <input 
                                      type="date" 
                                      className="w-full border border-stroke rounded-lg py-2 pl-10 pr-3 focus:outline-none focus:border-primary text-sm bg-white text-body italic" 
                                      style={{ colorScheme: "light" }}
                                    />
                                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-placeholder pointer-events-none" />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-mainText italic mb-1 block">To</label>
                                <div className="relative">
                                     <input 
                                       type="date" 
                                       className="w-full border border-stroke rounded-lg py-2 pl-10 pr-3 focus:outline-none focus:border-primary text-sm bg-white text-body italic"
                                       style={{ colorScheme: "light" }}
                                     />
                                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-placeholder pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h5 className="text-sm font-bold text-mainText italic mb-2">Lead status</h5>
                        <div className="relative">
                             <select className="w-full bg-white border border-stroke rounded-lg py-2 pl-3 pr-10 appearance-none focus:outline-none focus:border-primary text-sm text-body italic cursor-pointer">
                                <option value="" disabled selected>Select statuses...</option>
                                <option value="no-answer">No Answered</option>
                                <option value="not-qualified">Not Qualified</option>
                                <option value="potential">Potential</option>
                                <option value="contacted">Contacted</option>
                             </select>
                             <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-placeholder pointer-events-none" />
                        </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Export Summary */}
            <div className="bg-[#F8FAFC] rounded-xl p-4 flex items-center gap-4">
              <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                <div className="bg-primary rounded-full p-1.5">
                   <Users className="h-4 w-4 text-white" />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-bold text-mainText italic">Export summary</h4>
                <p className="text-sm text-body italic">
                  Leads to export: <span className="text-primary font-bold">1,247</span>
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={onClose}
                className="px-8 py-2.5 rounded-full border border-stroke text-body text-sm font-bold italic hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                className="px-8 py-2.5 rounded-full bg-primary text-white text-sm font-bold italic hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30"
              >
                Export
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
