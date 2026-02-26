"use client";
import React from "react";
import { User, Briefcase, Calculator } from "lucide-react";
import { cn } from "@/lib/utils";

interface DealCardProps {
  deal: {
    id: number;
    name: string;
    amount: number | string;
    owner?: {
      name: string;
    };
    service?: {
      name: string;
    };
    deal_stage?: {
      title: string;
      color: string;
    };
  };
  onClick?: (id: number) => void;
}

const DealCard = ({ deal, onClick }: DealCardProps) => {
  return (
    <div
      onClick={() => onClick?.(deal.id)}
      className="bg-white rounded-2xl p-5 shadow-sm border border-[#F1F5F9] hover:border-primary/50 transition-all cursor-pointer group mb-4 relative z-[1]"
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-bold text-mainText text-sm italic">
          #{deal.id} {deal.name}
        </h4>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        {deal.deal_stage && (
          <span
            className={cn(
              "px-3 py-0.5 text-[11px] font-bold rounded-full italic tracking-wide",
              deal.deal_stage.color === "white"
                ? "bg-[#E6F0FF] text-[#3B82F6]"
                : deal.deal_stage.color === "red"
                  ? "bg-[#FEE2E2] text-[#EF4444]"
                  : deal.deal_stage.color === "lime" ||
                      deal.deal_stage.color === "yellow"
                    ? "bg-[#FEFCE8] text-[#EAB308]"
                    : "bg-primary/10 text-primary",
            )}
            style={
              deal.deal_stage.color &&
              !["white", "red", "lime", "yellow"].includes(
                deal.deal_stage.color,
              )
                ? {
                    backgroundColor: `${deal.deal_stage.color}15`,
                    color: deal.deal_stage.color,
                  }
                : {}
            }
          >
            {deal.deal_stage.title}
          </span>
        )}
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between text-xs text-gray-500 italic">
          <span className="font-medium">Deal Owner:</span>
          <span className="text-mainText">{deal.owner?.name || "N/A"}</span>
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500 italic">
          <span className="font-medium">Service:</span>
          <span className="text-mainText">{deal.service?.name || "N/A"}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex items-center justify-between w-full  text-xs text-gray-500 italic">
          <span className="font-medium">Amount:</span>
          <span className="text-mainText font-black text-sm">
            EGP {Number(deal.amount).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DealCard;
