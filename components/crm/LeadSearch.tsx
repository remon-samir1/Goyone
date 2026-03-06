"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, Loader2, User, Phone } from "lucide-react";
import { getAllLeads } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";

const LeadSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const debouncedSearch = useDebounce(searchTerm, 300);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedSearch.length < 2) {
        setSuggestions([]);
        setIsOpen(false);
        return;
      }

      setIsLoading(true);
      try {
        const leads = await getAllLeads(debouncedSearch);
        setSuggestions(leads || []);
        setIsOpen(true);
      } catch (error) {
        console.error("Failed to fetch suggestions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedSearch]);

  const handleSelect = (id: string | number) => {
    router.push(`/crm/viewLead/${id}`);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div ref={containerRef} className="relative flex-1 group">
      <div className="flex items-center border border-stroke p-3 bg-white gap-2 rounded-3xl transition-all focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary">
        <Search className="text-placeholder w-[18px] h-[18px] group-focus-within:text-primary transition-colors" />
        <input
          type="text"
          className="flex-1 border-none outline-none text-sm text-mainText placeholder:text-placeholder h-full bg-transparent"
          placeholder="Search ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
        />
        {isLoading && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-stroke overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
          {suggestions.length > 0 ? (
            <div className="max-h-[300px] overflow-y-auto p-2">
              <div className="px-3 py-2 text-[10px] font-bold text-placeholder uppercase tracking-wider">
                Lead Results
              </div>
              {suggestions.map((lead) => (
                <button
                  key={lead.id}
                  onClick={() => handleSelect(lead.id)}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-background/5 transition-colors text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-mainText italic">
                        {lead.full_Name || lead.name || "Unknown Lead"}
                      </div>
                      <div className="text-[11px] text-body flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {lead.phone || "No phone"}
                      </div>
                    </div>
                  </div>
                  <div className="text-[10px] font-semibold text-placeholder bg-background/10 px-2 py-1 rounded-full">
                    #{lead.id}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            searchTerm.length >= 2 &&
            !isLoading && (
              <div className="p-8 text-center">
                <div className="text-body text-sm italic">
                  No leads found matching "{searchTerm}"
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default LeadSearch;
