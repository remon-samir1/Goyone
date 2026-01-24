"use client";

import React, { useState } from "react";
import {
  User,
  Mail,
  Briefcase,
  Phone,
  LayoutDashboard,
  FileText,
  CheckSquare,
  ChevronDown,
  Plus,
  Search,
  Bell,
  Clock,
  Target,
  ScrollText,
} from "lucide-react";
import CreatePositionModal from "@/components/modals/CreatePositionModal";
import CreateServiceModal from "@/components/modals/CreateServiceModal";
import CreateLeadStatusModal from "@/components/modals/CreateLeadStatusModal";
import CreateCategoryModal from "@/components/modals/CreateCategoryModal";
import { Link } from "lucide-react";
import { ChevronsRight } from "lucide-react";
import Logo from "@/components/logo/logo";
import Header from "../header";

// Stepper Component
const Stepper = () => {
  return (
    <div className="w-full p-8 bg-white   rounded-xl">
      <h3 className="text-xl font-bold text-mainText italic mb-10">
        Lead Progress Timeline
      </h3>
      <div className="relative flex items-center justify-between w-full mx-auto">
        {/* Connecting Line */}
        <div className="absolute left-0 top-[28px] transform -translate-y-1/2 w-full h-[2px] flex px-10">
          <div className="w-1/5 h-full bg-primary" />
          <div className="w-2/3 h-full bg-[#F1F5F9]" />
        </div>

        {/* Contact Stage */}
        <div className="flex flex-col items-center gap-4 relative z-10 w-1/4">
            <div className="flex items-center justify-center p-2  bg-[linear-gradient(90deg,rgba(54,114,234,0.47)_0%,rgba(140,229,83,0.47)_147.93%)] rounded-full">
          <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center  relative">

            <div className="absolute inset-[-4px] rounded-full  " />
            <Phone className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center gap-1 justify-center mb-1">
              <p className="text-[15px] font-bold text-mainText italic">
                Contact Stage
              </p>
              <ChevronDown className="w-4 h-4 text-mainText" />
            </div>
            <div className="px-10 py-2 bg-primary/5 rounded-full  shadow-sm inline-block">
              <span className="text-[13px] font-bold text-mainText italic">
                Contact Stage
              </span>
            </div>
          </div>
        </div>

        {/* Qualification Stage */}
        <div className="flex flex-col items-center gap-4 relative z-10 w-1/4">
          <div className="w-14 h-14 rounded-full bg-primary/5 border border-[#F1F5F9] flex items-center justify-center shadow-sm">
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
  const [isPositionModalOpen, setIsPositionModalOpen] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

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
              {/* Actually the design has tabs full width with white bg? No, seemed transparent. Let's match the ref */}
              <div className="flex items-center w-full bg-white rounded-full h-12">
                <button className="h-full px-8 rounded-full bg-primary text-white text-sm font-bold italic shadow-lg shadow-primary/30">
                  Basic Info
                </button>
                <button className="h-full px-8 text-sm text-body italic hover:text-primary transition-colors">
                  Feed Backs
                </button>
                <button className="h-full px-8 text-sm text-body italic hover:text-primary transition-colors">
                  Marketing Information
                </button>
                <button className="h-full px-8 text-sm text-body italic hover:text-primary transition-colors">
                  Actions & Follow-up
                </button>
              </div>
            </div>

            {/* Load Image Section */}
            <div className="mb-10">
              <h3 className="text-lg font-bold text-mainText italic mb-4">
                Load Image
              </h3>
              <div className="w-24 h-24 rounded-full bg-[#CCCCCC] flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors">
                <User className="w-12 h-12 text-white" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              {/* Personal Info Column */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-primary italic mb-6">
                  Personal info
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-mainText italic mb-1 block">
                      Full name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      className="w-full border border-stroke rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary placeholder:text-placeholder/50"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-mainText italic mb-1 block">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="Personal Email"
                      className="w-full border border-stroke rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary placeholder:text-placeholder/50"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-mainText italic mb-1 block">
                      Position
                    </label>
                    <div className="flex gap-2 bg-white rounded-xl py-1">
                      <div className="relative flex-1">
                        <select className="w-full  rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary appearance-none bg-white cursor-pointer">
                          <option value="" disabled selected>
                            Select an option
                          </option>
                          <option value="ceo">CEO</option>
                          <option value="manager">Manager</option>
                          <option value="developer">Developer</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-3.5 w-4 h-4 text-primary pointer-events-none" />
                      </div>
                      <button
                        onClick={() => setIsPositionModalOpen(true)}
                        className="w-11 h-11 flex items-center justify-center   text-blue-500  transition-colors border-l border-stroke font-bold text-lg"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-mainText italic mb-1 block">
                      Phone number <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      <div className="relative w-28">
                        <div className="w-full border border-stroke rounded-xl px-3 py-3 text-sm text-body italic flex items-center gap-2 bg-white">
                          {/* Flag Icon mock */}
                          <span className="text-lg">🇬🇧</span>
                          <ChevronDown className="w-3 h-3 ml-auto opacity-50" />
                        </div>
                      </div>
                      <input
                        type="text"
                        placeholder="( 201 ) 55456445"
                        className="flex-1 border border-stroke rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary placeholder:text-placeholder/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-mainText italic mb-1 block">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2 bg-white rounded-lg py-1">
                      <div className="relative flex-1">
                        <select className="w-full  border-stroke rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary appearance-none bg-white cursor-pointer">
                          <option value="" disabled selected>
                            Select an option
                          </option>
                          <option value="vip">VIP</option>
                          <option value="partner">Partner</option>
                          <option value="distributor">Distributor</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-3.5 w-4 h-4 text-primary pointer-events-none" />
                      </div>
                      <button
                        onClick={() => setIsCategoryModalOpen(true)}
                        className="w-10 h-10 flex items-center justify-center  text-blue-500   transition-colors border-l border-stroke font-bold text-lg"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Company Info Column */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-primary italic mb-6">
                  Company info
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-mainText italic mb-1 block">
                      Company name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Legal or Trade Name of the Company"
                      className="w-full border border-stroke rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary placeholder:text-placeholder/50"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-mainText italic mb-1 block">
                      Company field <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Company's Field or Sector"
                      className="w-full border border-stroke rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary placeholder:text-placeholder/50"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-mainText italic mb-1 block">
                      Company phone
                    </label>
                    <input
                      type="text"
                      placeholder="Hotline Number or Main Office Number"
                      className="w-full border border-stroke rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary placeholder:text-placeholder/50"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-mainText italic mb-1 block">
                      Company email
                    </label>
                    <input
                      type="email"
                      placeholder="Official Company Email"
                      className="w-full border border-stroke rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary placeholder:text-placeholder/50"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-mainText italic mb-1 block">
                      Service <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2 bg-white rounded-xl py-1">
                      <div className="relative flex-1">
                        <select className="w-full  rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary appearance-none bg-white cursor-pointer">
                          <option value="" disabled selected>
                            Select an option
                          </option>
                          <option value="development">Development</option>
                          <option value="marketing">Marketing</option>
                          <option value="design">Design</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-3.5 w-4 h-4 text-primary pointer-events-none" />
                      </div>
                      <button
                        onClick={() => setIsServiceModalOpen(true)}
                        className="w-11 h-11 flex items-center justify-center text-primary  hover:text-white transition-colors border-l border-stroke font-bold text-lg"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

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

      <CreatePositionModal
        isOpen={isPositionModalOpen}
        onClose={() => setIsPositionModalOpen(false)}
      />

      <CreateServiceModal
        isOpen={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
      />

      <CreateLeadStatusModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
      />

      <CreateCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
      />
    </>
  );
};

export default AddLeadPage;
