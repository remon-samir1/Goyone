"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  Trash2,
  UploadCloud,
  X,
  Plus,
  FileText,
  Type,
  Link2,
  Calendar,
  User,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import AddNewBriefModal from "./AddNewBriefModal";

import { toast } from "react-hot-toast";
import {
  getSellers,
  createTask,
  getTaskStages,
  extractId,
  getAllLeads,
} from "@/lib/api";
import { useRef } from "react";
import { useParams } from "next/navigation";

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadId?: any;
  leadName?: string;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({
  isOpen,
  onClose,
  leadId,
  leadName,
}) => {
  const params = useParams();
  const urlId = params?.id;

  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isBriefModalOpen, setIsBriefModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sellers, setSellers] = useState<any[]>([]);
  const [taskStages, setTaskStages] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    user_id: "",
    task_stage_id: "",
    title: "",
    started_at: "",
    ended_at: "",
    description: "",
    parent: "",
  });
  const [attachments, setAttachments] = useState<File[]>([]);
  const [briefs, setBriefs] = useState<{ description: string; file: File }[]>(
    [],
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setTimeout(() => setIsAnimating(true), 10);
      fetchSellers();
      fetchTaskStages();
      fetchLeads();
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const fetchSellers = async () => {
    try {
      const data = await getSellers();
      setSellers(data);
    } catch (error) {
      console.error("Error fetching sellers:", error);
    }
  };

  const fetchTaskStages = async () => {
    try {
      const data = await getTaskStages();
      setTaskStages(data);
    } catch (error) {
      console.error("Error fetching task stages:", error);
    }
  };

  const fetchLeads = async (search?: string) => {
    setIsSearching(true);
    try {
      const data = await getAllLeads(search);
      setLeads(data);
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search
  useEffect(() => {
    if (!isOpen || urlId) return;

    const timer = setTimeout(() => {
      if (searchQuery.trim() || isDropdownOpen) {
        fetchLeads(searchQuery);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, isOpen, urlId, isDropdownOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Initialize/Update parent (lead_id) based on context
  useEffect(() => {
    if (urlId) {
      // If in Lead View/Edit page (URL has ID), set parent to that ID
      setFormData((prev) => ({ ...prev, parent: String(urlId) }));
      if (leadName) {
        setSearchQuery(leadName);
      }
    } else if (leadId) {
      // Fallback to prop if available
      const id = extractId(leadId);
      setFormData((prev) => ({ ...prev, parent: id }));
      if (leadName) {
        setSearchQuery(leadName);
      }
    }
  }, [urlId, leadId, leadName, isOpen]);

  const filteredLeads = leads;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments((prev) => [...prev, ...newFiles]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddBrief = (brief: { description: string; file: File }) => {
    setBriefs((prev) => [...prev, brief]);
  };

  const removeBrief = (index: number) => {
    setBriefs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!formData.user_id || !formData.title) {
      toast.error("Please fill in required fields");
      return;
    }
    setLoading(true);
    try {
      const data = new FormData();

      // Use URL ID (usually numeric) or form selection
      const finalLeadId = urlId || formData.parent;
      if (finalLeadId) data.append("lead_id", String(finalLeadId));

      // Select stage and user from formData
      if (formData.task_stage_id)
        data.append("task_stage_id", formData.task_stage_id);
      if (formData.user_id) {
        data.append("user_id", formData.user_id);
        // The backend expects "to[]" for sellers
        data.append("to[]", formData.user_id);
      }

      data.append("title", formData.title);
      data.append("started_at", formData.started_at);
      data.append("ended_at", formData.ended_at);
      data.append("description", formData.description);

      // Append attachments
      attachments.forEach((file) => {
        data.append("attachments[]", file);
      });

      // Append briefs: The error indicates briefs.0 must be a file
      briefs.forEach((brief, index) => {
        data.append(`briefs[${index}]`, brief.file);
      });

      // Add other fields if necessary

      await createTask(data);
      toast.success("Task created successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to create task");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!shouldRender) return null;

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-opacity duration-300 ease-in-out",
        isAnimating ? "opacity-100" : "opacity-0",
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
          "relative bg-white rounded-[32px] w-full max-w-[700px] shadow-2xl transform transition-all duration-300 ease-out flex flex-col max-h-[90vh] overflow-hidden",
          isAnimating ? "scale-100 translate-y-0" : "scale-95 translate-y-4",
        )}
      >
        {/* Header */}
        <div className="p-8 pb-4 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-mainText italic">Add Task</h2>
            <p className="text-sm text-body italic opacity-70">
              Create a new task for {leadName || "the lead"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-body" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-8 pt-0 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Select Sellers */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-mainText italic block">
                Select sellers <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={formData.user_id}
                  onChange={(e) =>
                    setFormData({ ...formData, user_id: e.target.value })
                  }
                  className="w-full border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary appearance-none bg-white cursor-pointer"
                >
                  <option value="" disabled>
                    Select an option
                  </option>
                  {sellers.map((seller) => (
                    <option key={seller.id} value={seller.id}>
                      {seller.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-3.5 w-4 h-4 text-body pointer-events-none" />
              </div>
            </div>

            {/* Task Stage */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-mainText italic block">
                Task Stage <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={formData.task_stage_id}
                  onChange={(e) =>
                    setFormData({ ...formData, task_stage_id: e.target.value })
                  }
                  className="w-full border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary appearance-none bg-white cursor-pointer"
                >
                  <option value="" disabled>
                    Select stage
                  </option>
                  {taskStages.map((stage) => (
                    <option key={stage.id} value={stage.id}>
                      {stage.title}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-3.5 w-4 h-4 text-body pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {!urlId && (
              <div className="space-y-2">
                <label className="text-sm font-bold text-mainText italic flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-body" /> Lead
                </label>
                <div className="relative" ref={dropdownRef}>
                  <input
                    type="text"
                    placeholder="Search and select lead"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setIsDropdownOpen(true);
                    }}
                    onFocus={() => setIsDropdownOpen(true)}
                    className="w-full border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary bg-white cursor-pointer"
                  />
                  <ChevronDown className="absolute right-4 top-3.5 w-4 h-4 text-body pointer-events-none" />

                  {isDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-[#F1F5F9] rounded-xl shadow-lg max-h-60 overflow-y-auto">
                      {isSearching ? (
                        <div className="px-4 py-3 flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        </div>
                      ) : leads.length > 0 ? (
                        leads.map((lead) => (
                          <div
                            key={lead.id}
                            className="px-4 py-2 text-sm text-body hover:bg-primary/5 cursor-pointer italic"
                            onClick={() => {
                              setFormData({ ...formData, parent: lead.id });
                              setSearchQuery(
                                lead.full_name ||
                                  lead.name ||
                                  `Lead #${lead.id}`,
                              );
                              setIsDropdownOpen(false);
                            }}
                          >
                            {lead.full_name || lead.name || `Lead #${lead.id}`}
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-sm text-body italic opacity-50">
                          No leads found
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-mainText italic flex items-center gap-2">
                <Type className="w-4 h-4 text-body" /> Title{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter task title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary bg-gray-50"
              />
            </div>

            {/* Started at */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-mainText italic flex items-center gap-2">
                <Calendar className="w-4 h-4 text-body" /> Started at
              </label>
              <input
                type="datetime-local"
                value={formData.started_at}
                onChange={(e) =>
                  setFormData({ ...formData, started_at: e.target.value })
                }
                className="w-full border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary bg-gray-50"
              />
            </div>

            {/* Ended at */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-mainText italic flex items-center gap-2">
                <Calendar className="w-4 h-4 text-body" /> Ended at
              </label>
              <input
                type="datetime-local"
                value={formData.ended_at}
                onChange={(e) =>
                  setFormData({ ...formData, ended_at: e.target.value })
                }
                className="w-full border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary bg-gray-50"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-mainText italic flex items-center gap-2">
              <FileText className="w-4 h-4 text-body" /> Description
            </label>
            <textarea
              placeholder="Enter task description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="w-full border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary bg-gray-50 resize-none"
            />
          </div>

          {/* To - Removed as duplicate of Select sellers if it means the same, but API shows to[] array. 
              Actually user_id is the assigning user, to[] is the target sellers. 
              Let's keep it simple for now or match the UI if it had "Assign to".
          */}

          {/* Briefs Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-mainText italic">
                <FileText className="w-4 h-4 text-body" /> Briefs
              </div>
              <button
                onClick={() => setIsBriefModalOpen(true)}
                className="text-[11px] font-bold text-primary italic flex items-center gap-1 hover:opacity-80 transition-opacity"
              >
                <Plus className="w-3 h-3" /> Add new Briefs
              </button>
            </div>

            {/* Briefs List */}
            {briefs.length > 0 && (
              <div className="space-y-3">
                {briefs.map((brief, index) => (
                  <div
                    key={`brief-${index}`}
                    className="p-4 bg-primary/5 border border-primary/10 rounded-xl space-y-2 relative group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-mainText truncate">
                          {brief.description}
                        </p>
                        <p className="text-[10px] text-body opacity-50 truncate">
                          {brief.file.name} (
                          {(brief.file.size / (1024 * 1024)).toFixed(2)} MB)
                        </p>
                      </div>
                      <button
                        onClick={() => removeBrief(index)}
                        className="p-2 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-body hover:text-red-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {attachments.length === 0 && briefs.length === 0 ? (
              <div className="bg-[#F8FAFC] border border-stroke rounded-xl p-8 text-center space-y-2">
                <p className="text-[11px] text-body italic opacity-50">
                  No briefs or attachments added yet.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {attachments.map((file, index) => (
                  <div
                    key={`attachment-${index}`}
                    className="flex items-center justify-between p-4 bg-[#F8FAFC] border border-stroke rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-body" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-mainText truncate max-w-[200px]">
                          {file.name}
                        </p>
                        <p className="text-[10px] text-body opacity-50">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeAttachment(index)}
                      className="p-2 hover:bg-red-50 rounded-full transition-colors group"
                    >
                      <Trash2 className="w-4 h-4 text-body group-hover:text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              className="hidden"
            />

            {/* Upload Area */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#F1F5F9] rounded-[24px] p-10 flex flex-col items-center justify-center gap-3 group hover:border-primary transition-all cursor-pointer bg-white"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center group-hover:bg-primary transition-all">
                <UploadCloud className="w-5 h-5 text-primary group-hover:text-white" />
              </div>
              <div className="text-center">
                <p className="text-[13px] italic font-bold text-mainText">
                  <span className="text-primary">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-[10px] text-body italic opacity-50">
                  PDF, DOC, XLS (max. 10MB)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 pt-4 flex items-center justify-center gap-4 border-t border-[#F1F5F9]">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-3 px-8 rounded-full border border-primary text-primary font-bold italic text-[15px] hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 py-3 px-8 rounded-full bg-primary text-white font-bold italic text-[15px] hover:bg-primary/90 transition-all shadow-lg shadow-primary/30 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? "Saving..." : "Save Task"}
          </button>
        </div>
      </div>

      <AddNewBriefModal
        isOpen={isBriefModalOpen}
        onClose={() => setIsBriefModalOpen(false)}
        onAdd={handleAddBrief}
      />
    </div>,
    document.body,
  );
};

export default AddTaskModal;
