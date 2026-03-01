"use client";

import React from "react";
import Header from "../../header";

const InvoiceDetailSkeleton = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header Links={true} />

      <div className="px-[3%] py-8 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center mb-8">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-slate-200 rounded-lg"></div>
            <div className="h-4 w-64 bg-slate-100 rounded-md"></div>
          </div>
          <div className="flex gap-3">
            <div className="h-10 w-24 bg-slate-200 rounded-lg"></div>
            <div className="h-10 w-24 bg-slate-200 rounded-lg"></div>
            <div className="h-10 w-24 bg-slate-200 rounded-lg"></div>
          </div>
        </div>

        {/* Main Card Skeleton */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-12 mb-8">
          <div className="flex justify-between items-start mb-12">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-slate-200"></div>
              <div className="space-y-2">
                <div className="h-6 w-40 bg-slate-200 rounded-md"></div>
                <div className="h-4 w-48 bg-slate-100 rounded-md"></div>
              </div>
            </div>
            <div className="space-y-2 text-right flex flex-col items-end">
              <div className="h-3 w-16 bg-slate-100 rounded-md"></div>
              <div className="h-8 w-32 bg-slate-200 rounded-md"></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-24 mb-12">
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-3 w-20 bg-slate-100 rounded-md"></div>
                  <div className="h-6 w-48 bg-slate-200 rounded-md"></div>
                  <div className="h-4 w-40 bg-slate-100 rounded-md"></div>
                </div>
              ))}
            </div>
            <div className="space-y-4 text-right flex flex-col items-end">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2 flex flex-col items-end">
                  <div className="h-3 w-20 bg-slate-100 rounded-md"></div>
                  <div className="h-6 w-32 bg-slate-200 rounded-md"></div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-12">
            <div className="h-6 w-40 bg-slate-200 rounded-md mb-6"></div>
            <div className="w-full h-48 bg-slate-50 rounded-xl"></div>
          </div>

          <div className="max-w-xs ml-auto space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="h-4 w-20 bg-slate-100 rounded-md"></div>
                <div className="h-4 w-24 bg-slate-200 rounded-md"></div>
              </div>
            ))}
            <div className="h-20 w-full bg-blue-50/50 rounded-2xl"></div>
          </div>
        </div>

        {/* Tabs Skeleton */}
        <div className="flex gap-2 mb-4">
          <div className="h-10 w-32 bg-slate-200 rounded-lg"></div>
          <div className="h-10 w-32 bg-slate-100 rounded-lg"></div>
        </div>
        <div className="bg-white rounded-3xl h-64 shadow-sm border border-slate-100"></div>
      </div>
    </div>
  );
};

export default InvoiceDetailSkeleton;
