"use client";

import React, { useState } from "react";
import {
  Phone,
  CheckSquare,
  ChevronDown,
  Target,
  ScrollText,
} from "lucide-react";
import Logo from "@/components/logo/logo";
import Header from "../header";
import BasicInfoTab from "@/components/crm/addLead/BasicInfoTab";
import FeedbacksTab from "@/components/crm/addLead/FeedbacksTab";
import MarketingInfoTab from "@/components/crm/addLead/MarketingInfoTab";

// Stepper Component
const Stepper = () => {
  return (
    <div className="w-full p-8 bg-white   rounded-xl">
      <h3 className="text-xl font-bold text-mainText italic mb-10">
        Lead Progress Timeline
      </h3>
      <div className="relative flex items-center justify-between w-full mx-auto">
        {/* Connecting Line */}
        <div className="absolute left-0 top-[34px] transform z-[0] -translate-y-1/4 w-full h-[2px] flex px-10">
          <div className="w-1/4 h-full bg-primary" />
          <div className="w-full h-full bg-[#F1F5F9]" />
        </div>

        {/* Contact Stage */}
        <div className="flex flex-col items-center gap-4 relative z-10 w-1/4">
          <div className="flex items-center justify-center p-2  bg-[linear-gradient(90deg,rgba(54,114,234,0.47)_0%,rgba(140,229,83,0.47)_147.93%)] rounded-full">
            <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center  relative">
              <div className="absolute inset-[-4px] rounded-full  " />
              <Phone className="w-6 h-6 text-white z-10" />
            </div>
          </div>
          <div className="text-center z-[9999]">
            <div className="flex items-center gap-1 justify-center mb-1">
              <p className="text-[15px] font-bold text-mainText italic">
                Contact Stage
              </p>
              <ChevronDown className="w-4 h-4 text-mainText " />
            </div>
            <div className="px-10 py-2 bg-primary/5 rounded-full  shadow-sm inline-block">
              <span className="text-[13px] font-bold text-mainText italic">
                Contact Stage
              </span>
            </div>
          </div>
        </div>

        {/* Qualification Stage */}
        <div className="flex flex-col items-center gap-4 relative z-10 w-1/4 ">
          <div className="w-14 h-14 rounded-full bg-primary/5 border  border-[#F1F5F9] flex items-center justify-center shadow-sm">
            <Target className="w-6 h-6 text-[#94A3B8]" />
          </div>
          <div className="text-center">
            <div className="flex items-center gap-1 justify-center mb-1">
              <p className="text-[15px] font-bold text-[#94A3B8] italic">
                Qualification Stage
              </p>
              <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
            </div>
            <div className="px-10 py-2 bg-primary/5 rounded-full  shadow-sm inline-block">
              <span className="text-[13px] font-bold text-mainText italic">
                Qualified
              </span>
            </div>
          </div>
        </div>

        {/* Proposal Stage */}
        <div className="flex flex-col items-center gap-4 relative z-10 w-1/4">
          <div className="w-14 h-14 rounded-full bg-primary/5 border border-[#F1F5F9] flex items-center justify-center shadow-sm">
            <ScrollText className="w-6 h-6 text-[#94A3B8]" />
          </div>
          <div className="text-center">
            <div className="flex items-center gap-1 justify-center mb-1">
              <p className="text-[15px] font-bold text-[#94A3B8] italic">
                Proposal Stage
              </p>
              <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
            </div>
            <div className="px-10 py-2 bg-primary/5 rounded-full  shadow-sm inline-block">
              <span className="text-[13px] font-bold text-mainText italic">
                Negotiation
              </span>
            </div>
          </div>
        </div>

        {/* Closing Stage */}
        <div className="flex flex-col items-center gap-4 relative z-10 w-1/4">
          <div className="w-14 h-14 rounded-full bg-primary/5 border border-[#F1F5F9] flex items-center justify-center shadow-sm">
            <CheckSquare className="w-6 h-6 text-[#94A3B8]" />
          </div>
          <div className="text-center">
            <div className="flex items-center gap-1 justify-center mb-1">
              <p className="text-[15px] font-bold text-[#94A3B8] italic">
                Closing Stage
              </p>
              <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
            </div>
            <div className="px-10 py-2 bg-primary/5 rounded-full  shadow-sm inline-block">
              <span className="text-[13px] font-bold text-mainText italic">
                Deal Won
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AddLeadPage = () => {
  const [activeTab, setActiveTab] = useState("Basic Info");

  return (
    <>
      <div className="min-h-screen  pb-20">
        {/* Custom Header for CRM Section */}
        <Header Links={false} />
        <div className="px-8 mt-6">
          <h1 className="text-2xl font-bold text-mainText italic mb-1">
            Create lead
          </h1>
          <p className="text-sm text-body italic mb-8">
            Fill in the information below to create a new lead in your CRM
          </p>

          {/* White Card Container */}
          <div className=" rounded-[32px]  ">
            <Stepper />

            {/* Tabs */}
            <div className="bg-white rounded-xl mt-4 mb-8 px-4 py-2 inline-flex w-full">
              <div className="flex items-center w-full bg-white rounded-full h-12">
                <button
                  onClick={() => setActiveTab("Basic Info")}
                  className={`h-full px-8 rounded-full text-sm font-bold italic transition-colors ${
                    activeTab === "Basic Info"
                      ? "bg-primary text-white shadow-lg shadow-primary/30"
                      : "text-body hover:text-primary"
                  }`}
                >
                  Basic Info
                </button>
                <button
                  onClick={() => setActiveTab("Feed Backs")}
                  className={`h-full px-8 rounded-full text-sm font-bold italic transition-colors ${
                    activeTab === "Feed Backs"
                      ? "bg-primary text-white shadow-lg shadow-primary/30"
                      : "text-body hover:text-primary"
                  }`}
                >
                  Feed Backs
                </button>
                <button
                  onClick={() => setActiveTab("Marketing Information")}
                  className={`h-full px-8 rounded-full text-sm font-bold italic transition-colors ${
                    activeTab === "Marketing Information"
                      ? "bg-primary text-white shadow-lg shadow-primary/30"
                      : "text-body hover:text-primary"
                  }`}
                >
                  Marketing Information
                </button>
                <button
                  onClick={() => setActiveTab("Actions & Follow-up")}
                  className={`h-full px-8 rounded-full text-sm font-bold italic transition-colors ${
                    activeTab === "Actions & Follow-up"
                      ? "bg-primary text-white shadow-lg shadow-primary/30"
                      : "text-body hover:text-primary"
                  }`}
                >
                  Actions & Follow-up
                </button>
              </div>
            </div>

            {activeTab === "Basic Info" && <BasicInfoTab />}
            {activeTab === "Feed Backs" && <FeedbacksTab />}
            {activeTab === "Marketing Information" && <MarketingInfoTab />}

            <div className="flex items-center justify-between mt-12 pt-8">
              <div className="flex gap-4">
                <button className="px-10 py-3 rounded-full bg-primary text-white font-bold italic shadow-lg shadow-primary/30 hover:bg-primary/90 transition-colors">
                  Create
                </button>
                <button className="px-6 py-3 rounded-full border border-primary text-primary font-bold italic hover:bg-blue-50 transition-colors">
                  Create & Create Another
                </button>
                <button className="px-10 py-3 rounded-full border border-primary text-primary font-bold italic hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
              </div>

              <button className="px-10 py-3 rounded-full bg-primary text-white font-bold italic shadow-lg shadow-primary/30 hover:bg-primary/90 transition-colors">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddLeadPage;
