"use client";

import React, { useState, useEffect } from "react";
import { getSellers } from "@/lib/api";
import {
  User,
  ChevronDown,
  CheckSquare,
  Calendar,
  Phone,
  Mail,
  Plus,
} from "lucide-react";
import AddTaskModal from "@/components/modals/AddTaskModal";
import ScheduleMeetingModal from "@/components/modals/ScheduleMeetingModal";
import LogCallModal from "@/components/modals/LogCallModal";
import SendEmailModal from "@/components/modals/SendEmailModal";
import ImageUpload from "@/components/ui/ImageUpload";
import { LeadFormData } from "@/types/leadTypes";

interface ActionsFollowUpTabProps {
  formData: LeadFormData;
  updateFormData: (updates: Partial<LeadFormData>) => void;
  mode?: "add" | "edit";
}

const ActionsFollowUpTab: React.FC<ActionsFollowUpTabProps> = ({
  formData,
  updateFormData,
  mode = "edit",
}) => {
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = React.useState(false);
  const [isScheduleMeetingModalOpen, setIsScheduleMeetingModalOpen] =
    React.useState(false);
  const [isLogCallModalOpen, setIsLogCallModalOpen] = React.useState(false);
  const [isSendEmailModalOpen, setIsSendEmailModalOpen] = React.useState(false);
  const [sellers, setSellers] = useState<any[]>([]);

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const data = await getSellers();
        setSellers(data);
      } catch (error) {
        console.error("Error fetching sellers:", error);
      }
    };
    fetchSellers();
  }, []);

  return (
    <div className="space-y-10">
      {/* Load Image Section */}
      {mode === "edit" && (
        <div className="mb-10">
          <h3 className="text-lg font-bold text-mainText italic mb-4">
            Load Image
          </h3>
          <ImageUpload
            value={formData.avatar}
            onChange={(file) => updateFormData({ avatar: file })}
          />
        </div>
      )}

      {/* Actions & Follow-up Section */}
      <div>
        <h3 className="text-xl font-bold text-primary italic mb-6">
          Actions & Follow-up
        </h3>

        <div className="space-y-8">
          {/* Select Sellers */}
          <div className="max-w-full">
            <label className="text-xs font-bold text-mainText italic mb-1 block">
              Select sellers <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={formData.to || ""}
                onChange={(e) => updateFormData({ to: Number(e.target.value) })}
                className="w-full border border-stroke rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary appearance-none bg-white cursor-pointer"
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

          {mode === "edit" && (
            <>
              {/* Action Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div
                  onClick={() => setIsAddTaskModalOpen(true)}
                  className="bg-white border-2 border-[#F1F5F9] rounded-[24px] p-8 flex items-start flex-col gap-6 cursor-pointer hover:border-primary transition-all group"
                >
                  <div className="w-14 h-14 rounded-full bg-primary/5 flex items-center justify-center group-hover:bg-primary transition-all">
                    <CheckSquare className="w-6 h-6 text-primary group-hover:text-white" />
                  </div>
                  <div>
                    <h4 className="text-[15px] font-bold text-mainText italic">
                      Add Task
                    </h4>
                    <p className="text-[11px] text-body italic mt-1opacity-70">
                      Create and assign a task
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => setIsScheduleMeetingModalOpen(true)}
                  className="bg-white border-2 border-[#F1F5F9] rounded-[24px] p-8 flex items-start flex-col gap-6 cursor-pointer hover:border-[#8CE553] transition-all group"
                >
                  <div className="w-14 h-14 rounded-full bg-[#8CE5530F]/10 flex items-center justify-center group-hover:bg-[#8CE553] transition-all">
                    <Calendar className="w-6 h-6 text-[#8CE553] group-hover:text-white" />
                  </div>
                  <div>
                    <h4 className="text-[15px] font-bold text-mainText italic">
                      Schedule Meeting
                    </h4>
                    <p className="text-[11px] text-body italic mt-1 opacity-70">
                      Plan a meeting with the lead
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => setIsLogCallModalOpen(true)}
                  className="bg-white border-2 border-[#F1F5F9] rounded-[24px] p-8 flex items-start flex-col gap-6 cursor-pointer hover:border-[#2FBF71] transition-all group"
                >
                  <div className="w-14 h-14 rounded-full bg-[#EAF8F1] flex items-center justify-center group-hover:bg-[#2FBF71] transition-all">
                    <Phone className="w-6 h-6 text-[#2FBF71] group-hover:text-white" />
                  </div>
                  <div>
                    <h4 className="text-[15px] font-bold text-mainText italic">
                      Log Call
                    </h4>
                    <p className="text-[11px] text-body italic mt-1 opacity-70">
                      Record a call activity
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => setIsSendEmailModalOpen(true)}
                  className="bg-white border-2 border-[#F1F5F9] rounded-[24px] p-8 flex items-start flex-col gap-6 cursor-pointer hover:border-[#EDDA2E] transition-all group"
                >
                  <div className="w-14 h-14 rounded-full bg-[#FFFBEB] flex items-center justify-center group-hover:bg-[#EDDA2E] transition-all">
                    <Mail className="w-6 h-6 text-[#EDDA2E] group-hover:text-white" />
                  </div>
                  <div>
                    <h4 className="text-[15px] font-bold text-mainText italic">
                      Send Email
                    </h4>
                    <p className="text-[11px] text-body italic mt-1 opacity-70">
                      Send an email to the lead
                    </p>
                  </div>
                </div>
              </div>

              {/* Plan Activities Section */}
              <div className="pt-4">
                <h3 className="text-xl font-bold text-primary italic mb-6">
                  Plan activities for this lead
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white border border-stroke rounded-lg p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span className="text-[13px] font-bold text-body italic">
                        Meetings
                      </span>
                    </div>
                    <p className="text-xl font-bold text-mainText italic">0</p>
                  </div>

                  <div className="bg-white border border-stroke rounded-lg p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckSquare className="w-4 h-4 text-[#00A63E]" />
                      <span className="text-[13px] font-bold text-body italic">
                        Tasks
                      </span>
                    </div>
                    <p className="text-xl font-bold text-mainText italic">0</p>
                  </div>

                  <div className="bg-white border border-stroke rounded-lg p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-[#9810FA]" />
                      <span className="text-[13px] font-bold text-body italic">
                        Calls
                      </span>
                    </div>
                    <p className="text-xl font-bold text-mainText italic">0</p>
                  </div>

                  <div className="bg-white border border-stroke rounded-lg p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[#EDDA2E]" />
                      <span className="text-[13px] font-bold text-body italic">
                        Emails
                      </span>
                    </div>
                    <p className="text-xl font-bold text-mainText italic">0</p>
                  </div>
                </div>

                {/* Dash buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                  <button className="w-full py-3 border border-dashed border-primary rounded-xl text-primary font-bold italic text-sm flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors">
                    <Plus className="w-4 h-4" /> New Meeting
                  </button>
                  <button className="w-full py-3 border border-dashed border-primary rounded-xl text-primary font-bold italic text-sm flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors">
                    <Plus className="w-4 h-4" /> New Log Call
                  </button>
                  <button className="w-full py-3 border border-dashed border-primary rounded-xl text-primary font-bold italic text-sm flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors">
                    <Plus className="w-4 h-4" /> New Task
                  </button>
                  <button className="w-full py-3 border border-dashed border-primary rounded-xl text-primary font-bold italic text-sm flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors">
                    <Plus className="w-4 h-4" /> New Mails
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
      />

      <ScheduleMeetingModal
        isOpen={isScheduleMeetingModalOpen}
        onClose={() => setIsScheduleMeetingModalOpen(false)}
      />

      <LogCallModal
        isOpen={isLogCallModalOpen}
        onClose={() => setIsLogCallModalOpen(false)}
      />

      <SendEmailModal
        isOpen={isSendEmailModalOpen}
        onClose={() => setIsSendEmailModalOpen(false)}
      />
    </div>
  );
};

export default ActionsFollowUpTab;
