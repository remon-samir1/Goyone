"use client";

import React, { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreativeFilterProps {
  total: number;
  communicated: number;
  notCommunicated: number;
  currentFilter: string | boolean;
  onFilterChange: (filter: string | boolean) => void;
}

const CreativeFilter: React.FC<CreativeFilterProps> = ({
  total,
  communicated,
  notCommunicated,
  currentFilter,
  onFilterChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);

  const options = [
    { label: "All Accounts", value: "", count: total, color: "bg-primary" },
    {
      label: "Communicated",
      value: true,
      count: communicated,
      color: "bg-[#8CE553]",
    },
    {
      label: "Not Communicated",
      value: false,
      count: notCommunicated,
      color: "bg-[#EDDA2E]",
    },
  ];

  const activeOption =
    options.find((opt) => opt.value === currentFilter) || options[0];

  useEffect(() => {
    if (isOpen) {
      gsap.to(optionsRef.current, {
        height: "auto",
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
      });
      gsap.to(arrowRef.current, {
        rotate: 180,
        duration: 0.3,
      });
    } else {
      gsap.to(optionsRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
      });
      gsap.to(arrowRef.current, {
        rotate: 0,
        duration: 0.3,
      });
    }
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      className="relative  min-w-[220px]"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div
        className="flex items-center justify-between gap-3 bg-background/5 hover:bg-background/10 p-3 rounded-xl cursor-pointer transition-colors border border-stroke/50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <div className={cn("w-2 h-2 rounded-full", activeOption.color)} />
          <span className="text-mainText italic text-sm font-bold truncate">
            {activeOption.label}
          </span>
          <span
            className={cn(
              "text-white px-2 py-0.5 rounded-full text-[10px] font-bold min-w-[20px] text-center",
              activeOption.color,
            )}
          >
            {activeOption.count}
          </span>
        </div>
        <div ref={arrowRef}>
          <ChevronDown className="w-4 h-4 text-body" />
        </div>
      </div>

      <div
        ref={optionsRef}
        className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-xl border border-stroke/30 overflow-hidden h-0 opacity-0"
      >
        <div className="p-2 flex flex-col gap-1">
          {options.map((opt) => (
            <button
              key={String(opt.value)}
              onClick={() => {
                onFilterChange(opt.value);
                setIsOpen(false);
              }}
              className={cn(
                "flex items-center justify-between w-full p-2.5 rounded-lg transition-all hover:bg-background/5 text-left group",
                currentFilter === opt.value ? "bg-background/5" : "",
              )}
            >
              <div className="flex items-center gap-2">
                <div className={cn("w-1.5 h-1.5 rounded-full", opt.color)} />
                <span className="text-body text-xs font-semibold italic group-hover:text-mainText">
                  {opt.label}
                </span>
              </div>
              <span
                className={cn(
                  "text-white px-2 py-0.5 rounded-full text-[10px] font-bold min-w-[18px] text-center",
                  opt.color,
                )}
              >
                {opt.count}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreativeFilter;
