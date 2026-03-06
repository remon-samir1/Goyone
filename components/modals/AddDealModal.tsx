"use client";

import React, { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import {
  X,
  ChevronDown,
  Plus,
  Upload,
  Calendar as CalendarIcon,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";
import {
  getSellers,
  getDealStages,
  getServices,
  getAllLeads,
  createDeal,
  extractId,
} from "@/lib/api";

interface AddDealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialStageId?: number;
}

const AddDealModal: React.FC<AddDealModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialStageId,
}) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);
  const [loading, setLoading] = useState(false);

  // Dropdown data
  const [sellers, setSellers] = useState<any[]>([]);
  const [stages, setStages] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);

  // Search state for Company Account
  const [companyLeads, setCompanyLeads] = useState<any[]>([]);
  const [companySearchQuery, setCompanySearchQuery] = useState("");
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const [isSearchingCompany, setIsSearchingCompany] = useState(false);
  const companyDropdownRef = useRef<HTMLDivElement>(null);

  // Search state for Individual Account
  const [individualLeads, setIndividualLeads] = useState<any[]>([]);
  const [individualSearchQuery, setIndividualSearchQuery] = useState("");
  const [isIndividualDropdownOpen, setIsIndividualDropdownOpen] =
    useState(false);
  const [isSearchingIndividual, setIsSearchingIndividual] = useState(false);
  const individualDropdownRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    owner_id: "",
    account_manager_id: "",
    manager_id: "",
    date_time: "",
    company_account_id: "",
    phone: "",
    email: "",
    reason_for_cancellation: "",
    lead_id: "",
    name: "",
    other_phone: "",
    amount: "",
    deal_stage_id: "",
    service_id: "",
    additional_notes: "",
    order: "1", // Default order
  });

  const [files, setFiles] = useState<FileList | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setTimeout(() => setIsAnimating(true), 10);
      fetchInitialData();
      if (initialStageId) {
        setFormData((prev) => ({
          ...prev,
          deal_stage_id: String(initialStageId),
        }));
      }
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, initialStageId]);

  const fetchInitialData = async () => {
    try {
      const [sellersData, stagesData, servicesData] = await Promise.all([
        getSellers(),
        getDealStages(),
        getServices(),
      ]);
      setSellers(sellersData);
      setStages(stagesData);
      setServices(servicesData);

      // Fetch initial leads for both with correct filters
      const [companyData, individualData] = await Promise.all([
        getAllLeads("", "companyAccounts"),
        getAllLeads("", "contacts"),
      ]);
      setCompanyLeads(companyData);
      setIndividualLeads(individualData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Debounced search for Company
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      fetchLeads(
        companySearchQuery,
        setCompanyLeads,
        setIsSearchingCompany,
        "companyAccounts",
      );
    }, 500);
    return () => clearTimeout(timer);
  }, [companySearchQuery]);

  // Debounced search for Individual
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      fetchLeads(
        individualSearchQuery,
        setIndividualLeads,
        setIsSearchingIndividual,
        "contacts",
      );
    }, 500);
    return () => clearTimeout(timer);
  }, [individualSearchQuery]);

  const fetchLeads = async (
    query: string,
    setLeads: React.Dispatch<React.SetStateAction<any[]>>,
    setSearching: React.Dispatch<React.SetStateAction<boolean>>,
    type?: string,
  ) => {
    setSearching(true);
    try {
      const data = await getAllLeads(query, type);
      setLeads(data);
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setSearching(false);
    }
  };

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        companyDropdownRef.current &&
        !companyDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCompanyDropdownOpen(false);
      }
      if (
        individualDropdownRef.current &&
        !individualDropdownRef.current.contains(event.target as Node)
      ) {
        setIsIndividualDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSave = async () => {
    const requiredFields = [
      "owner_id",
      "company_account_id",
      "service_id",
      "lead_id",
      "name",
      "other_phone",
      "amount",
      "deal_stage_id",
    ];

    const missingFields = requiredFields.filter(
      (field) => !formData[field as keyof typeof formData],
    );

    if (missingFields.length > 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) {
          // Ensure IDs are pure numbers
          if (key.endsWith("_id") || key === "company_account_id") {
            submitData.append(key, extractId(value));
          } else {
            submitData.append(key, value);
          }
        }
      });

      if (files) {
        for (let i = 0; i < files.length; i++) {
          submitData.append("files[]", files[i]);
        }
      }

      await createDeal(submitData);
      toast.success("Deal created successfully");
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create deal");
    } finally {
      setLoading(false);
    }
  };

  if (!shouldRender) return null;
  console.log(formData.company_account_id);
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
          "relative bg-white dark:bg-gray-800 rounded-[32px] w-full max-w-[800px] shadow-2xl transform transition-all duration-300 ease-out flex flex-col max-h-[90vh] overflow-hidden",
          isAnimating ? "scale-100 translate-y-0" : "scale-95 translate-y-4",
        )}
      >
        <div className="p-6 pb-4 flex items-center justify-between border-b border-[#F1F5F9]">
          <h2 className="text-xl font-bold text-mainText italic">
            Create New Deal
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-body" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          {/* Section: Deal Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-primary italic">
              Deal Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Deal Owner */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-mainText italic">
                  Deal Owner <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={formData.owner_id}
                    onChange={(e) =>
                      setFormData({ ...formData, owner_id: e.target.value })
                    }
                    className="w-full border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary appearance-none bg-[#F8FAFC]"
                  >
                    <option value="">Select owner</option>
                    {sellers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-3.5 w-4 h-4 text-body pointer-events-none" />
                </div>
              </div>

              {/* Manager */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-mainText italic">
                  Manager
                </label>
                <div className="relative">
                  <select
                    value={formData.manager_id}
                    onChange={(e) =>
                      setFormData({ ...formData, manager_id: e.target.value })
                    }
                    className="w-full border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary appearance-none bg-[#F8FAFC]"
                  >
                    <option value="">Select an option</option>
                    {sellers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-3.5 w-4 h-4 text-body pointer-events-none" />
                </div>
              </div>

              {/* Date / Time */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-mainText italic">
                  Date / Time
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.date_time}
                    onChange={(e) =>
                      setFormData({ ...formData, date_time: e.target.value })
                    }
                    className="w-full border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary bg-[#F8FAFC]"
                  />
                  <CalendarIcon className="absolute right-4 top-3.5 w-4 h-4 text-body pointer-events-none" />
                </div>
              </div>

              {/* Company Account (Searchable) */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-mainText italic">
                  Company Account <span className="text-red-500">*</span>
                </label>
                <div className="relative" ref={companyDropdownRef}>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search company account"
                      value={companySearchQuery}
                      onChange={(e) => {
                        setCompanySearchQuery(e.target.value);
                        setIsCompanyDropdownOpen(true);
                      }}
                      onFocus={() => setIsCompanyDropdownOpen(true)}
                      className="w-full border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary bg-[#F8FAFC]"
                    />
                    {isSearchingCompany ? (
                      <div className="absolute right-4 top-3.5">
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : (
                      <Search className="absolute right-4 top-3.5 w-4 h-4 text-body opacity-50" />
                    )}
                  </div>

                  {isCompanyDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-[#F1F5F9] rounded-xl shadow-lg max-h-60 overflow-y-auto custom-scrollbar">
                      {companyLeads.length > 0 ? (
                        companyLeads.map((l) => (
                          <div
                            key={l.id}
                            className="px-4 py-2 text-sm text-body hover:bg-primary/5 cursor-pointer italic transition-colors"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                company_account_id: String(l.id),
                              });
                              setCompanySearchQuery(
                                l.company_name || l.full_name || l.name,
                              );
                              setIsCompanyDropdownOpen(false);
                            }}
                          >
                            {l.company_name || l.full_name || l.name}
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-sm text-body italic opacity-50 text-center">
                          No accounts found
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-mainText italic">
                  Phone
                </label>
                <input
                  type="text"
                  placeholder="010125632454"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary bg-[#F8FAFC]"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-mainText italic">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary bg-[#F8FAFC]"
                />
              </div>

              {/* Reason for cancellation */}
              <div className="space-y-2 col-span-1 md:col-span-2">
                <label className="text-sm font-bold text-mainText italic">
                  Reason for cancellation
                </label>
                <input
                  type="text"
                  placeholder="Enter reason"
                  value={formData.reason_for_cancellation}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      reason_for_cancellation: e.target.value,
                    })
                  }
                  className="w-full border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary bg-[#F8FAFC]"
                />
              </div>

              {/* Account Manager */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-mainText italic">
                  Account Manager
                </label>
                <div className="relative">
                  <select
                    value={formData.account_manager_id}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        account_manager_id: e.target.value,
                      })
                    }
                    className="w-full border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary appearance-none bg-[#F8FAFC]"
                  >
                    <option value="">Select an option</option>
                    {sellers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-3.5 w-4 h-4 text-body pointer-events-none" />
                </div>
              </div>

              {/* Individual Account (Searchable) */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-mainText italic">
                  Individual Account <span className="text-red-500">*</span>
                </label>
                <div className="relative" ref={individualDropdownRef}>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search individual account"
                      value={individualSearchQuery}
                      onChange={(e) => {
                        setIndividualSearchQuery(e.target.value);
                        setIsIndividualDropdownOpen(true);
                      }}
                      onFocus={() => setIsIndividualDropdownOpen(true)}
                      className="w-full border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary bg-[#F8FAFC]"
                    />
                    {isSearchingIndividual ? (
                      <div className="absolute right-4 top-3.5">
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : (
                      <Search className="absolute right-4 top-3.5 w-4 h-4 text-body opacity-50" />
                    )}
                  </div>

                  {isIndividualDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-[#F1F5F9] rounded-xl shadow-lg max-h-60 overflow-y-auto custom-scrollbar">
                      {individualLeads.length > 0 ? (
                        individualLeads.map((l) => (
                          <div
                            key={l.id}
                            className="px-4 py-2 text-sm text-body hover:bg-primary/5 cursor-pointer italic transition-colors"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                lead_id: String(l.id),
                              });
                              setIndividualSearchQuery(l.full_name || l.name);
                              setIsIndividualDropdownOpen(false);
                            }}
                          >
                            {l.full_name || l.name}
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

              {/* Deal Name */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-mainText italic">
                  Deal Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter deal name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary bg-[#F8FAFC]"
                />
              </div>

              {/* Other Phone */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-mainText italic">
                  Other Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="212002145525666"
                  value={formData.other_phone}
                  onChange={(e) =>
                    setFormData({ ...formData, other_phone: e.target.value })
                  }
                  className="w-full border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary bg-[#F8FAFC]"
                />
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-mainText italic">
                  Amount <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="EGP"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    className="w-full border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary bg-[#F8FAFC] pr-12"
                  />
                  <span className="absolute right-10 top-3.5 text-body opacity-50 italic">
                    EGP
                  </span>
                </div>
              </div>

              {/* Stage */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-mainText italic">
                  Stage <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={formData.deal_stage_id}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        deal_stage_id: e.target.value,
                      })
                    }
                    className="w-full border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary appearance-none bg-[#F8FAFC]"
                  >
                    <option value="">Select stage</option>
                    {stages.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-3.5 w-4 h-4 text-body pointer-events-none" />
                </div>
              </div>

              {/* Service */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-mainText italic">
                  Service <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <select
                      value={formData.service_id}
                      onChange={(e) =>
                        setFormData({ ...formData, service_id: e.target.value })
                      }
                      className="w-full border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary appearance-none bg-[#F8FAFC]"
                    >
                      <option value="">Select service</option>
                      {services.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-3.5 w-4 h-4 text-body pointer-events-none" />
                  </div>
                  <button className="p-3 bg-[#F8FAFC] border border-[#F1F5F9] rounded-xl text-body hover:text-primary transition-colors">
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Description Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-primary italic">
              Description Information
            </h3>

            <div className="space-y-2">
              <label className="text-sm font-bold text-mainText italic">
                Additional notes
              </label>
              <textarea
                rows={4}
                value={formData.additional_notes}
                onChange={(e) =>
                  setFormData({ ...formData, additional_notes: e.target.value })
                }
                className="w-full border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary bg-[#F8FAFC] resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-mainText italic">
                Attachments
              </label>
              <div
                className="border-2 border-dashed border-[#F1F5F9] rounded-[32px] p-8 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Upload className="w-6 h-6 text-primary" />
                </div>
                <div className="text-center">
                  <p className="text-[15px] font-bold text-primary italic">
                    Click to upload{" "}
                    <span className="text-mainText">or drag and drop</span>
                  </p>
                  <p className="text-xs text-body opacity-50 italic uppercase mt-1">
                    PDF, DOC, XLS (MAX. 10MB)
                  </p>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  multiple
                  onChange={(e) => setFiles(e.target.files)}
                />
              </div>
              {files && files.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {Array.from(files).map((f, i) => (
                    <div
                      key={i}
                      className="bg-primary/5 text-primary text-xs font-bold px-3 py-1.5 rounded-lg italic flex items-center gap-2"
                    >
                      {f.name}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle removal if needed
                          const dt = new DataTransfer();
                          Array.from(files)
                            .filter((_, index) => index !== i)
                            .forEach((file) => dt.items.add(file));
                          setFiles(dt.files);
                        }}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-8 pt-4 flex items-center justify-center gap-4 border-t border-[#F1F5F9] bg-[#F8FAFC]/50">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-3 px-8 rounded-full border border-primary text-primary font-bold italic text-[15px] hover:bg-white transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 py-3 px-8 rounded-full bg-primary text-white font-bold italic text-[15px] hover:bg-primary/90 transition-all shadow-lg shadow-primary/30 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? "Creating..." : "Create Deal"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default AddDealModal;
