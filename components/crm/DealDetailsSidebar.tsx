"use client";
import React, { useState, useEffect } from "react";
import {
  X,
  Edit3,
  Tag,
  Hash,
  Layers,
  User,
  Briefcase,
  CreditCard,
  Calendar,
  Phone,
  Mail,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getDeal,
  updateDeal,
  deleteDeal,
  getSellers,
  getServices,
  getDealStages,
  getAllLeads,
} from "@/lib/api";
import { toast } from "react-hot-toast";

interface DealDetailsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  dealId: number | null;
  onSuccess: () => void;
}

const DealDetailsSidebar = ({
  isOpen,
  onClose,
  dealId,
  onSuccess,
}: DealDetailsSidebarProps) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [deal, setDeal] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Dropdown data
  const [sellers, setSellers] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [stages, setStages] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);

  // Form state
  const [formData, setFormData] = useState<any>({
    name: "",
    deal_owner_id: "",
    manager: "",
    date_time: "",
    lead_id: "",
    phone: "",
    email: "",
    reason_for_cancellation: "",
    service_id: "",
    deal_stage_id: "",
    amount: "",
  });

  useEffect(() => {
    if (dealId && isOpen) {
      fetchDealDetails();
      fetchDropdownData();
    } else {
      setIsEditMode(false);
    }
  }, [dealId, isOpen]);

  const fetchDealDetails = async () => {
    if (!dealId) return;
    setLoading(true);
    try {
      const data = await getDeal(dealId);
      setDeal(data);
      setFormData({
        name: data.name || "",
        deal_owner_id: data.deal_owner_id || "",
        manager: data.manager || "",
        date_time: data.date_time || "",
        lead_id: data.lead_id || "",
        phone: data.phone || "",
        email: data.email || "",
        reason_for_cancellation: data.reason_for_cancellation || "",
        service_id: data.service_id || "",
        deal_stage_id: data.deal_stage_id || "",
        amount: data.amount || "",
      });
    } catch (error) {
      console.error("Error fetching deal details:", error);
      toast.error("Failed to load deal details");
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdownData = async () => {
    try {
      const [sellersData, servicesData, stagesData, leadsData] =
        await Promise.all([
          getSellers(),
          getServices(),
          getDealStages(),
          getAllLeads(),
        ]);
      setSellers(sellersData);
      setServices(servicesData);
      setStages(stagesData);
      setLeads(leadsData);
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
    }
  };

  const handleUpdate = async () => {
    if (!dealId) return;
    setSaving(true);
    try {
      await updateDeal(dealId, formData);
      toast.success("Deal updated successfully");
      setIsEditMode(false);
      fetchDealDetails();
      onSuccess();
    } catch (error) {
      console.error("Error updating deal:", error);
      toast.error("Failed to update deal");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (
      !dealId ||
      !window.confirm("Are you sure you want to delete this deal?")
    )
      return;
    setDeleting(true);
    try {
      await deleteDeal(dealId);
      toast.success("Deal deleted successfully");
      onClose();
      onSuccess();
    } catch (error) {
      console.error("Error deleting deal:", error);
      toast.error("Failed to delete deal");
    } finally {
      setDeleting(false);
    }
  };

  if (!isOpen && !deal) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/20 backdrop-blur-sm z-[100] transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-[450px] bg-white shadow-2xl z-[101] transform transition-transform duration-300 ease-in-out flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Header */}
        <div className="p-6 flex items-center justify-between border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-mainText flex items-center gap-2">
              {isEditMode ? "Edit Details" : "Deals Details"}
            </h2>
            <p className="text-sm text-gray-400 font-medium italic">
              #{deal?.id || dealId}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {!isEditMode && (
              <button
                onClick={() => setIsEditMode(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-primary"
              >
                <Edit3 className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors bg-white shadow-md border border-gray-100 -ml-12 absolute left-0"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="space-y-8">
              {!isEditMode ? (
                // View Mode
                <div className="space-y-6">
                  <div className="space-y-4">
                    <DetailItem
                      icon={<Tag className="w-4 h-4" />}
                      label="Deal Title"
                      value={deal?.name}
                    />
                    <DetailItem
                      icon={<Hash className="w-4 h-4" />}
                      label="Deal Number"
                      value={`#${deal?.id}`}
                      isBadge
                    />
                    <DetailItem
                      icon={<Layers className="w-4 h-4" />}
                      label="Stage"
                      value={deal?.deal_stage?.title}
                      isStagePill
                      color={deal?.deal_stage?.color}
                    />
                    <DetailItem
                      icon={<User className="w-4 h-4" />}
                      label="Deal Owner"
                      value={deal?.owner?.name}
                    />
                    <DetailItem
                      icon={<Briefcase className="w-4 h-4" />}
                      label="Service Type"
                      value={deal?.service?.name}
                    />
                    <DetailItem
                      icon={<CreditCard className="w-4 h-4" />}
                      label="Deal Amount"
                      value={`EGP ${Number(deal?.amount || 0).toLocaleString()}`}
                      isAmountPill
                    />
                  </div>
                </div>
              ) : (
                // Edit Mode
                <div className="space-y-5">
                  <FormInput
                    label="Deal Owner"
                    type="select"
                    required
                    value={formData.deal_owner_id}
                    onChange={(val) =>
                      setFormData({ ...formData, deal_owner_id: val })
                    }
                    options={sellers.map((s) => ({
                      label: s.name,
                      value: s.id,
                    }))}
                  />
                  <FormInput
                    label="Manager"
                    placeholder="Lorem ipsum dolor"
                    value={formData.manager}
                    onChange={(val) =>
                      setFormData({ ...formData, manager: val })
                    }
                  />
                  <FormInput
                    label="Date / Time"
                    type="date"
                    value={formData.date_time}
                    onChange={(val) =>
                      setFormData({ ...formData, date_time: val })
                    }
                  />
                  <FormInput
                    label="Company Account"
                    type="select"
                    required
                    value={formData.lead_id}
                    onChange={(val) =>
                      setFormData({ ...formData, lead_id: val })
                    }
                    options={leads.map((l) => ({
                      label: l.name || l.company_name,
                      value: l.id,
                    }))}
                  />
                  <FormInput
                    label="Phone"
                    placeholder="010125632454"
                    value={formData.phone}
                    onChange={(val) => setFormData({ ...formData, phone: val })}
                  />
                  <FormInput
                    label="Email"
                    type="email"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={(val) => setFormData({ ...formData, email: val })}
                  />
                  <FormInput
                    label="Reason for cancellation"
                    placeholder="Brief description"
                    value={formData.reason_for_cancellation}
                    onChange={(val) =>
                      setFormData({ ...formData, reason_for_cancellation: val })
                    }
                  />
                  <FormInput
                    label="Reason for cancellation"
                    type="select"
                    options={[
                      {
                        label: "Lorem ipsum dolor sit amet consectetur.",
                        value: "lorem",
                      },
                    ]}
                  />
                </div>
              )}

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="w-full py-4 bg-[#EF4444] text-white font-bold italic rounded-2xl hover:bg-[#DC2626] transition-colors shadow-lg shadow-red-200 mt-10"
              >
                {deleting ? "Deleting..." : "Delete Deal"}
              </button>
            </div>
          )}
        </div>

        {/* Footer (only in Edit Mode) */}
        {isEditMode && (
          <div className="p-6 border-t border-gray-100 flex items-center gap-3 bg-gray-50/50">
            <button
              onClick={() => setIsEditMode(false)}
              className="flex-1 py-3 border border-primary text-primary font-bold italic rounded-xl hover:bg-primary/5 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              disabled={saving}
              className="flex-1 py-3 bg-primary text-white font-bold italic rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
  isBadge?: boolean;
  isStagePill?: boolean;
  isAmountPill?: boolean;
  color?: string;
}

const DetailItem = ({
  icon,
  label,
  value,
  isBadge,
  isStagePill,
  isAmountPill,
  color,
}: DetailItemProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-gray-400">
        {icon}
        <span className="text-[13px] font-medium italic">{label}</span>
      </div>
      <div className="pl-6">
        {isBadge ? (
          <span className="bg-[#E6F0FF] text-[#3B82F6] text-xs font-bold px-4 py-1.5 rounded-lg italic border border-[#3B82F6]/10">
            {value}
          </span>
        ) : isStagePill ? (
          <span
            className="text-xs font-bold px-4 py-1.5 rounded-full italic"
            style={{
              backgroundColor: `${color || "#3B82F6"}15`,
              color: color || "#3B82F6",
            }}
          >
            {value}
          </span>
        ) : isAmountPill ? (
          <span className="bg-[#F0FDF4] text-[#22C55E] text-sm font-black px-4 py-1 rounde-lg italic">
            {value}
          </span>
        ) : (
          <p className="text-base font-bold text-mainText italic">
            {value || "N/A"}
          </p>
        )}
      </div>
    </div>
  );
};

interface FormInputProps {
  label: string;
  type?: "text" | "select" | "email" | "date";
  required?: boolean;
  placeholder?: string;
  options?: { label: string; value: any }[];
  value?: any;
  onChange?: (val: any) => void;
}

const FormInput = ({
  label,
  type = "text",
  required,
  placeholder,
  options,
  value,
  onChange,
}: FormInputProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-bold text-mainText italic">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {type === "select" ? (
        <select
          className="w-full bg-[#F8FAFC] border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all italic text-gray-600 appearance-none"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
        >
          <option value="">Select {label}</option>
          {options?.map((opt, i) => (
            <option key={i} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          className="w-full bg-[#F8FAFC] border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all italic text-gray-600"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
        />
      )}
    </div>
  );
};

export default DealDetailsSidebar;
