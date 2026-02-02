"use client";

import React, { useState } from "react";
import { ChevronDown, Plus } from "lucide-react";
import CreatePositionModal from "@/components/modals/CreatePositionModal";
import CreateServiceModal from "@/components/modals/CreateServiceModal";
import CreateLeadStatusModal from "@/components/modals/CreateLeadStatusModal";
import CreateCategoryModal from "@/components/modals/CreateCategoryModal";
import ImageUpload from "@/components/ui/ImageUpload";
import PhoneInput from "@/components/ui/PhoneInput";
import { LeadFormData } from "@/types/leadTypes";

interface BasicInfoTabProps {
  formData: LeadFormData;
  updateFormData: (updates: Partial<LeadFormData>) => void;
}

const BasicInfoTab: React.FC<BasicInfoTabProps> = ({
  formData,
  updateFormData,
}) => {
  const [isPositionModalOpen, setIsPositionModalOpen] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // Dynamic Options State
  const [positionOptions, setPositionOptions] = useState([
    { id: "ceo", name: "CEO" },
    { id: "manager", name: "Manager" },
    { id: "developer", name: "Developer" },
  ]);

  const [serviceOptions, setServiceOptions] = useState([
    { id: 1, name: "Development" },
    { id: 2, name: "Marketing" },
    { id: 3, name: "Design" },
  ]);

  const [categoryOptions, setCategoryOptions] = useState([
    { id: 1, name: "VIP" },
    { id: 2, name: "Partner" },
    { id: 3, name: "Distributor" },
  ]);

  // Handlers for creating new items
  const handleCreatePosition = (newPositionName: string) => {
    // For position, we use the snake_cased name as ID/value
    const newId = newPositionName.toLowerCase().replace(/\s+/g, "_");
    const newOption = { id: newId, name: newPositionName };

    setPositionOptions((prev) => [...prev, newOption]);
    updateFormData({ position: newId });
  };

  const handleCreateService = (newService: { id: number; name: string }) => {
    setServiceOptions((prev) => [...prev, newService]);
    updateFormData({ service_id: newService.id });
  };

  const handleCreateCategory = (newCategory: { id: number; name: string }) => {
    setCategoryOptions((prev) => [...prev, newCategory]);
    updateFormData({ category_id: newCategory.id });
  };

  return (
    <>
      <div className="mb-10">
        <h3 className="text-lg font-bold text-mainText italic mb-4">
          Load Image
        </h3>
        <ImageUpload
          value={formData.avatar}
          onChange={(file) => updateFormData({ avatar: file })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
        {/* Personal Info Column */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-primary italic mb-6">
            Personal info
          </h3>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-mainText italic mb-1 block">
                  First name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) =>
                    updateFormData({ first_name: e.target.value })
                  }
                  placeholder="Enter first name"
                  className="w-full border border-stroke rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary placeholder:text-placeholder/50"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-mainText italic mb-1 block">
                  Last name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) =>
                    updateFormData({ last_name: e.target.value })
                  }
                  placeholder="Enter last name"
                  className="w-full border border-stroke rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary placeholder:text-placeholder/50"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-mainText italic mb-1 block">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData({ email: e.target.value })}
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
                  <select
                    value={formData.position || ""}
                    onChange={(e) =>
                      updateFormData({ position: e.target.value })
                    }
                    className="w-full rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary appearance-none bg-white cursor-pointer"
                  >
                    <option value="" disabled>
                      Select an option
                    </option>
                    {positionOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-3.5 w-4 h-4 text-primary pointer-events-none" />
                </div>
                <button
                  onClick={() => setIsPositionModalOpen(true)}
                  className="w-11 h-11 flex items-center justify-center text-blue-500 transition-colors border-l border-stroke font-bold text-lg"
                >
                  <Plus className="w-5 h-5 text-primary" />
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-mainText italic mb-1 block">
                Phone number <span className="text-red-500">*</span>
              </label>
              <PhoneInput
                value={formData.phone_number}
                countryCode={formData.phone_country_code}
                onChange={(phone) => updateFormData({ phone_number: phone })}
                onCountryChange={(code) =>
                  updateFormData({ phone_country_code: code })
                }
                placeholder="Enter phone number"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-mainText italic mb-1 block">
                Second phone number
              </label>
              <PhoneInput
                value={formData.phone_number_two || ""}
                countryCode={formData.phone_country_code}
                onChange={(phone) =>
                  updateFormData({ phone_number_two: phone })
                }
                onCountryChange={() => {}}
                placeholder="Enter second phone number"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-mainText italic mb-1 block">
                Category <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2 bg-white rounded-lg py-1">
                <div className="relative flex-1">
                  <select
                    value={formData.category_id || ""}
                    onChange={(e) =>
                      updateFormData({ category_id: Number(e.target.value) })
                    }
                    className="w-full border-stroke rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary appearance-none bg-white cursor-pointer"
                  >
                    <option value="" disabled>
                      Select an option
                    </option>
                    {categoryOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-3.5 w-4 h-4 text-primary pointer-events-none" />
                </div>
                <button
                  onClick={() => setIsCategoryModalOpen(true)}
                  className="w-10 h-10 flex items-center justify-center text-blue-500 transition-colors border-l border-stroke font-bold text-lg"
                >
                  <Plus className="w-5 h-5 text-primary" />
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
                value={formData.company_name}
                onChange={(e) =>
                  updateFormData({ company_name: e.target.value })
                }
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
                value={formData.company_field}
                onChange={(e) =>
                  updateFormData({ company_field: e.target.value })
                }
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
                value={formData.company_phone || ""}
                onChange={(e) =>
                  updateFormData({ company_phone: e.target.value })
                }
                placeholder="Hotline Number or Main Office Number"
                className="w-full border border-stroke rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary placeholder:text-placeholder/50"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-mainText italic mb-1 block">
                Company email
              </label>
              <input
                type="text"
                value={formData.company_email || ""}
                onChange={(e) =>
                  updateFormData({ company_email: e.target.value })
                }
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
                  <select
                    value={formData.service_id || ""}
                    onChange={(e) =>
                      updateFormData({ service_id: Number(e.target.value) })
                    }
                    className="w-full rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary appearance-none bg-white cursor-pointer"
                  >
                    <option value="" disabled>
                      Select an option
                    </option>
                    {serviceOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-3.5 w-4 h-4 text-primary pointer-events-none" />
                </div>
                <button
                  onClick={() => setIsServiceModalOpen(true)}
                  className="w-11 h-11 flex items-center justify-center text-primary hover:text-white transition-colors border-l border-stroke font-bold text-lg"
                >
                  <Plus className="w-5 h-5 text-primary" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CreatePositionModal
        isOpen={isPositionModalOpen}
        onClose={() => setIsPositionModalOpen(false)}
        onSuccess={handleCreatePosition}
      />

      <CreateServiceModal
        isOpen={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
        onSuccess={handleCreateService}
      />

      <CreateLeadStatusModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
      />

      <CreateCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSuccess={handleCreateCategory}
      />
    </>
  );
};

export default BasicInfoTab;
