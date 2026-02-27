"use client";

import React from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

interface ScorecardProps {
  title: string;
  value: string | number;
  change: string;
  isUp: boolean;
  color: string;
  chartColor: string;
  background: string;
}

const Scorecard: React.FC<ScorecardProps> = ({
  title,
  value,
  change,
  isUp,
  color,
  chartColor,
  background,
}) => {
  return (
    <div
      style={{ backgroundImage: background }}
      className="rounded-2xl px-6 py-8 flex-1 shadow   border-[#E6E8EC] min-w-[200px]"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-[#576680] text-sm font-bold mb-1 italic">
            {title}
          </p>
          <h3 className="text-[#111827] text-2xl font-bold italic">{value}</h3>
        </div>
        <div className="w-16 h-10">
          <svg
            width="64"
            height="31"
            viewBox="0 0 64 31"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke={chartColor}
              d="M0 29.2891L8 24.2891L16 27.2891L24 17.2891L32 21.2891L40 9.28906L48 13.2891L56 1.28906L64 5.28906"
              stroke-width="2"
            />
          </svg>
        </div>
      </div>
      <div className="flex items-center gap-1">
        {isUp ? (
          <ArrowUp className={`w-3 h-3 ${color}`} />
        ) : (
          <ArrowDown className={`w-3 h-3 ${color}`} />
        )}
        <span className={`text-xs font-bold ${color}`}>{change}</span>
        <span className="text-[#94A3B8] text-[10px] font-medium ml-1">
          vs last month
        </span>
      </div>
    </div>
  );
};

interface InvoiceTotals {
  total_invoices: string;
  total_sales: string;
  total_paid_money: string;
  total_due: string;
}

const InvoiceScorecards = ({ totals }: { totals?: InvoiceTotals }) => {
  const data = [
    {
      title: "Total Invoices",
      value: totals?.total_invoices || "0",
      change: "+0%",
      isUp: true,
      color: "text-[#22C55E]",
      chartColor: "#3672EA",
      background:
        "linear-gradient(283.76deg, rgba(54, 114, 234, 0.02) -12.82%, rgba(6, 84, 239, 0.1) 115.51%)",
    },
    {
      title: "Total Sales",
      value: totals?.total_sales || "0",
      change: "+0%",
      isUp: true,
      color: "text-[#8CE553]",
      chartColor: "#8CE553",
      background:
        "linear-gradient(283.76deg, rgba(140, 229, 83, 0.02) -12.82%, rgba(69, 175, 1, 0.1) 115.51%)",
    },
    {
      title: "Total Paid Money",
      value: totals?.total_paid_money || "0",
      change: "+0%",
      isUp: true,
      color: "text-[#8CE553]",
      chartColor: "#EDDA2E",
      background:
        "linear-gradient(283.76deg, rgba(237, 218, 46, 0.02) -12.82%, rgba(223, 201, 0, 0.1) 115.51%)",
    },
    {
      title: "Total Due",
      value: totals?.total_due || "0",
      change: "-0%",
      isUp: false,
      color: "text-red-500",
      chartColor: "#EF4444",
      background:
        "linear-gradient(283.76deg, rgba(229, 72, 77, 0.02) -12.82%, rgba(229, 72, 77, 0.1) 115.51%)",
    },
  ];

  return (
    <div className="flex flex-wrap gap-5 mt-8">
      {data.map((item, index) => (
        <Scorecard key={index} {...item} />
      ))}
    </div>
  );
};

export default InvoiceScorecards;
