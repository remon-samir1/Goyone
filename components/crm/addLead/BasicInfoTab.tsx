"use client";

import React, { useState } from "react";
import { User, ChevronDown, Plus } from "lucide-react";
import CreatePositionModal from "@/components/modals/CreatePositionModal";
import CreateServiceModal from "@/components/modals/CreateServiceModal";
import CreateLeadStatusModal from "@/components/modals/CreateLeadStatusModal";
import CreateCategoryModal from "@/components/modals/CreateCategoryModal";

const BasicInfoTab = () => {
  const [isPositionModalOpen, setIsPositionModalOpen] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  return (
    <>
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

export default BasicInfoTab;
