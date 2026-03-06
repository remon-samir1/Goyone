"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Filter,
  RotateCcw,
  ChevronDown,
  Loader2,
  Search,
} from "lucide-react";
import { getUsers, getDeals, getAllLeads } from "@/lib/api";

interface InvoiceFilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
  onReset: () => void;
  currentFilters: any;
}

const InvoiceFilterSidebar: React.FC<InvoiceFilterSidebarProps> = ({
  isOpen,
  onClose,
  onApply,
  onReset,
  currentFilters,
}) => {
  const [filters, setFilters] = useState(currentFilters);

  // Entity Search States
  const [forEntities, setForEntities] = useState<any[]>([]);
  const [forSearchQuery, setForSearchQuery] = useState("");
  const [isForDropdownOpen, setIsForDropdownOpen] = useState(false);
  const [isSearchingFor, setIsSearchingFor] = useState(false);
  const forDropdownRef = useRef<HTMLDivElement>(null);

  const [fromEntities, setFromEntities] = useState<any[]>([]);
  const [fromSearchQuery, setFromSearchQuery] = useState("");
  const [isFromDropdownOpen, setIsFromDropdownOpen] = useState(false);
  const [isSearchingFrom, setIsSearchingFrom] = useState(false);
  const fromDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFilters(currentFilters);
  }, [currentFilters]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        forDropdownRef.current &&
        !forDropdownRef.current.contains(event.target as Node)
      ) {
        setIsForDropdownOpen(false);
      }
      if (
        fromDropdownRef.current &&
        !fromDropdownRef.current.contains(event.target as Node)
      ) {
        setIsFromDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch functions
  const fetchForEntities = async (query: string, type: string) => {
    setIsSearchingFor(true);
    try {
      let data: any[] = [];
      if (type === "Deals") {
        const response = await getDeals({ search: query });
        data = response.data;
      } else if (type === "Individual") {
        data = await getAllLeads(query, "contacts");
      } else if (type === "Company") {
        data = await getAllLeads(query, "companyAccounts");
      }
      setForEntities(data);
    } catch (error) {
      console.error("Error fetching for entities:", error);
    } finally {
      setIsSearchingFor(false);
    }
  };

  const fetchFromEntities = async (query: string) => {
    setIsSearchingFrom(true);
    try {
      const data = await getUsers(query);
      setFromEntities(data);
    } catch (error) {
      console.error("Error fetching from entities:", error);
    } finally {
      setIsSearchingFrom(false);
    }
  };

  // Debounced search
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        fetchForEntities(forSearchQuery, filters.for_type || "Deals");
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [forSearchQuery, filters.for_type, isOpen]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        fetchFromEntities(fromSearchQuery);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [fromSearchQuery, isOpen]);

  const handleStatusToggle = (status: string) => {
    const newStatus = filters.status === status ? "" : status;
    setFilters({ ...filters, status: newStatus });
  };

  const statusOptions = ["Draft", "Sent", "Cancelled", "Overdue", "Paid"];

  const handleReset = () => {
    const resetValues = {
      status: "",
      type: "",
      for_type: "Deals",
      user_id: "",
      for_id: "",
      only_trashed: false,
      with_trashed: false,
      over_due: false,
      today: false,
      date_from: "",
      date_to: "",
      due_from: "",
      due_to: "",
      min_total: "",
      max_total: "",
      is_offer: false,
      is_activated: false,
    };
    setFilters(resetValues);
    setForSearchQuery("");
    setFromSearchQuery("");
    onReset();
  };

  const handleClear = () => {
    setFilters({
      status: "",
      type: "",
      for_type: "Deals",
      user_id: "",
      for_id: "",
      only_trashed: false,
      with_trashed: false,
      over_due: false,
      today: false,
      date_from: "",
      date_to: "",
      due_from: "",
      due_to: "",
      min_total: "",
      max_total: "",
      is_offer: false,
      is_activated: false,
    });
    setForSearchQuery("");
    setFromSearchQuery("");
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed top-0 right-0 h-full w-[450px] bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } overflow-y-auto no-scrollbar`}
      >
        <div className="p-8 flex flex-col min-h-full">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#3672EA] rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-100">
                <Filter className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold italic text-mainText">
                  Advanced Filters
                </h2>
                <p className="text-xs text-slate-400 italic">
                  Refine results in seconds
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-slate-400" />
            </button>
          </div>

          <button
            onClick={handleReset}
            className="flex items-center gap-2 text-[#3672EA] text-sm font-bold italic hover:underline mb-8"
          >
            <RotateCcw className="w-4 h-4" />
            Reset all filters
          </button>

          {/* Form Content */}
          <div className="space-y-6 flex-grow pb-10">
            {/* Deleted Records */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-mainText italic">
                Deleted records
              </label>
              <div className="relative">
                <select
                  value={
                    filters.with_trashed
                      ? "with"
                      : filters.only_trashed
                        ? "only"
                        : "without"
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    setFilters({
                      ...filters,
                      with_trashed: val === "with",
                      only_trashed: val === "only",
                    });
                  }}
                  className="w-full appearance-none border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-[#3672EA] bg-[#F8FAFC]"
                >
                  <option value="without">Without deleted records</option>
                  <option value="with">With deleted records</option>
                  <option value="only">Only deleted records</option>
                </select>
                <ChevronDown className="absolute right-4 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Type */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-mainText italic">
                Type
              </label>
              <div className="relative">
                <select
                  value={filters.type || ""}
                  onChange={(e) =>
                    setFilters({ ...filters, type: e.target.value })
                  }
                  className="w-full appearance-none border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-[#3672EA] bg-[#F8FAFC]"
                >
                  <option value="">Select an option</option>
                  <option value="sale">Sale</option>
                  <option value="push">Push</option>
                  <option value="estimate">Estimate</option>
                  <option value="saleorder">Sales Order</option>
                </select>
                <ChevronDown className="absolute right-4 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* For Type */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-mainText italic">
                For Type
              </label>
              <div className="relative">
                <select
                  value={filters.for_type || "Deals"}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      for_type: e.target.value,
                      for_id: "",
                    })
                  }
                  className="w-full appearance-none border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-[#3672EA] bg-[#F8FAFC]"
                >
                  <option value="Deals">Deals</option>
                  <option value="Individual">Individual Account</option>
                  <option value="Company">Company Account</option>
                </select>
                <ChevronDown className="absolute right-4 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* For Name */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-mainText italic">
                For name
              </label>
              <div className="relative" ref={forDropdownRef}>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Select an option"
                    value={forSearchQuery}
                    onChange={(e) => {
                      setForSearchQuery(e.target.value);
                      setIsForDropdownOpen(true);
                    }}
                    onFocus={() => setIsForDropdownOpen(true)}
                    className="w-full border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-[#3672EA] bg-[#F8FAFC]"
                  />
                  {isSearchingFor ? (
                    <div className="absolute right-4 top-3.5">
                      <Loader2 className="w-4 h-4 animate-spin text-[#3672EA]" />
                    </div>
                  ) : (
                    <ChevronDown className="absolute right-4 top-3.5 w-4 h-4 text-slate-400" />
                  )}
                </div>

                {isForDropdownOpen && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-[#F1F5F9] rounded-xl shadow-lg max-h-60 overflow-y-auto no-scrollbar">
                    {forEntities.length > 0 ? (
                      forEntities.map((item) => (
                        <div
                          key={item.id}
                          className="px-4 py-2 text-sm text-body hover:bg-blue-50 cursor-pointer italic transition-colors"
                          onClick={() => {
                            setFilters({ ...filters, for_id: item.id });
                            setForSearchQuery(
                              item.name || item.full_name || item.company_name,
                            );
                            setIsForDropdownOpen(false);
                          }}
                        >
                          {item.name || item.full_name || item.company_name}
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-body italic opacity-50 text-center">
                        No results found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* From Type */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-mainText italic">
                From Type
              </label>
              <div className="relative">
                <select
                  value={filters.from_type || "default"}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      from_type: e.target.value,
                      user_id: "",
                    })
                  }
                  className="w-full appearance-none border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-[#3672EA] bg-[#F8FAFC]"
                >
                  <option value="default">Default</option>
                  <option value="user">User</option>
                </select>
                <ChevronDown className="absolute right-4 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* From Name */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-mainText italic">
                From Name
              </label>
              <div className="relative" ref={fromDropdownRef}>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Select an option"
                    value={fromSearchQuery}
                    onChange={(e) => {
                      setFromSearchQuery(e.target.value);
                      setIsFromDropdownOpen(true);
                    }}
                    onFocus={() => setIsFromDropdownOpen(true)}
                    className="w-full border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-[#3672EA] bg-[#F8FAFC]"
                  />
                  {isSearchingFrom ? (
                    <div className="absolute right-4 top-3.5">
                      <Loader2 className="w-4 h-4 animate-spin text-[#3672EA]" />
                    </div>
                  ) : (
                    <ChevronDown className="absolute right-4 top-3.5 w-4 h-4 text-slate-400" />
                  )}
                </div>

                {isFromDropdownOpen && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-[#F1F5F9] rounded-xl shadow-lg max-h-60 overflow-y-auto no-scrollbar">
                    {fromEntities.length > 0 ? (
                      fromEntities.map((item) => (
                        <div
                          key={item.id}
                          className="px-4 py-2 text-sm text-body hover:bg-blue-50 cursor-pointer italic transition-colors"
                          onClick={() => {
                            setFilters({ ...filters, user_id: item.id });
                            setFromSearchQuery(item.name || item.full_name);
                            setIsFromDropdownOpen(false);
                          }}
                        >
                          {item.name || item.full_name}
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-body italic opacity-50 text-center">
                        No results found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Status Pills */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-mainText italic block">
                Status
              </label>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => handleStatusToggle(status.toLowerCase())}
                    className={`px-4 py-1.5 rounded-full border text-xs font-bold italic transition-all ${
                      filters.status === status.toLowerCase()
                        ? "bg-[#3672EA] border-[#3672EA] text-white shadow-md shadow-blue-100"
                        : "border-[#3672EA] text-[#3672EA] hover:bg-blue-50"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Date Range Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-mainText italic">
                  Date From
                </label>
                <input
                  type="date"
                  value={filters.date_from || ""}
                  onChange={(e) =>
                    setFilters({ ...filters, date_from: e.target.value })
                  }
                  className="w-full border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-[#3672EA] bg-[#F8FAFC]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-mainText italic">
                  Date To
                </label>
                <input
                  type="date"
                  value={filters.date_to || ""}
                  onChange={(e) =>
                    setFilters({ ...filters, date_to: e.target.value })
                  }
                  className="w-full border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-[#3672EA] bg-[#F8FAFC]"
                />
              </div>
            </div>

            {/* Amount Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-mainText italic">
                  Min Total
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={filters.min_total || ""}
                  onChange={(e) =>
                    setFilters({ ...filters, min_total: e.target.value })
                  }
                  className="w-full border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-[#3672EA] bg-[#F8FAFC]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-mainText italic">
                  Max Total
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={filters.max_total || ""}
                  onChange={(e) =>
                    setFilters({ ...filters, max_total: e.target.value })
                  }
                  className="w-full border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-[#3672EA] bg-[#F8FAFC]"
                />
              </div>
            </div>

            {/* Toggles */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <label className="flex items-center justify-between p-4 bg-[#F8FAFC] rounded-2xl border border-[#F1F5F9] cursor-pointer hover:bg-slate-50 transition-colors">
                <span className="text-sm font-bold text-mainText italic">
                  Over Due
                </span>
                <div className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.over_due || false}
                    onChange={(e) =>
                      setFilters({ ...filters, over_due: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3672EA]"></div>
                </div>
              </label>
              <label className="flex items-center justify-between p-4 bg-[#F8FAFC] rounded-2xl border border-[#F1F5F9] cursor-pointer hover:bg-slate-50 transition-colors">
                <span className="text-sm font-bold text-mainText italic">
                  Today
                </span>
                <div className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.today || false}
                    onChange={(e) =>
                      setFilters({ ...filters, today: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3672EA]"></div>
                </div>
              </label>
            </div>

            {/* Additional Booleans */}
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center justify-between p-4 bg-[#F8FAFC] rounded-2xl border border-[#F1F5F9] cursor-pointer hover:bg-slate-50 transition-colors">
                <span className="text-sm font-bold text-mainText italic">
                  Is Offer
                </span>
                <div className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.is_offer || false}
                    onChange={(e) =>
                      setFilters({ ...filters, is_offer: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3672EA]"></div>
                </div>
              </label>
              <label className="flex items-center justify-between p-4 bg-[#F8FAFC] rounded-2xl border border-[#F1F5F9] cursor-pointer hover:bg-slate-50 transition-colors">
                <span className="text-sm font-bold text-mainText italic">
                  Is Activated
                </span>
                <div className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.is_activated || false}
                    onChange={(e) =>
                      setFilters({ ...filters, is_activated: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3672EA]"></div>
                </div>
              </label>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex gap-4 pt-6 mt-auto sticky bottom-0 bg-white border-t border-slate-100 pb-2">
            <button
              onClick={handleClear}
              className="flex-1 py-3.5 border border-[#3672EA] text-[#3672EA] rounded-[18px] font-bold italic hover:bg-blue-50 transition-all text-sm"
            >
              Clear
            </button>
            <button
              onClick={() => onApply(filters)}
              className="flex-1 py-3.5 bg-[#3672EA] text-white rounded-[18px] font-bold italic shadow-lg shadow-blue-200 hover:opacity-95 transition-all text-sm"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvoiceFilterSidebar;
