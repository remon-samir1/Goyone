"use client";

import React, { useState } from "react";
import {
  Phone,
  CheckSquare,
  ChevronDown,
  ChevronLeft,
  Target,
  ScrollText,
} from "lucide-react";
import Header from "../header";
import BasicInfoTab from "@/components/crm/addLead/BasicInfoTab";
import FeedbacksTab from "@/components/crm/addLead/FeedbacksTab";
import MarketingInfoTab from "@/components/crm/addLead/MarketingInfoTab";
import ActionsFollowUpTab from "@/components/crm/addLead/ActionsFollowUpTab";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Toaster, toast } from "react-hot-toast";
import {
  LeadFormData,
  initialFormData,
  Feedback,
  SocialMedia,
} from "@/types/leadTypes";
import { createLead } from "@/lib/api";

// Stepper Component
const Stepper = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(
    null,
  );
  const [stageSelections, setStageSelections] = useState<{
    [key: number]: string;
  }>({});

  const stages = [
    {
      label: "Contact Stage",
      subLabel: "Contact Stage",
      description: "Lead replied to the initial outreach.",
      icon: Phone,
      options: [
        {
          label: "Answered",
          description: "Lead replied to the initial outreach.",
          value: "answered",
        },
        {
          label: "No Answered",
          description: "No reply after outreach attempts.",
          value: "no_answered",
        },
      ],
    },
    {
      label: "Qualification Stage",
      subLabel: "Qualified",
      description: "Lead meets the criteria.",
      icon: Target,
      options: [
        {
          label: "Potential",
          description: "Early interest; needs further assessment.",
          value: "potential",
        },
        {
          label: "Qualified",
          description: "Has budget, need, and decision authority.",
          value: "qualified",
        },
        {
          label: "High Qualified",
          description: "Strong fit and ready for proposal.",
          value: "high_qualified",
        },
        {
          label: "Not Qualified",
          description: "Does not meet key criteria.",
          value: "not_qualified",
        },
      ],
    },
    {
      label: "Proposal Stage",
      subLabel: "Negotiation",
      description: "Proposal sent to lead.",
      icon: ScrollText,
      options: [
        {
          label: "Negotiation",
          description: "Discussing terms, pricing, and details.",
          value: "negotiation",
        },
        {
          label: "Accepted",
          description: "Proposal approved by the lead.",
          value: "accepted",
        },
        {
          label: "Rejected",
          description: "Proposal declined or stopped.",
          value: "rejected",
        },
      ],
    },
    {
      label: "Closing Stage",
      subLabel: "Deal Won",
      description: "Deal successfully closed.",
      icon: CheckSquare,
      options: [
        {
          label: "Deal Won",
          description: "Agreement signed and project started.",
          value: "deal_won",
        },
        {
          label: "Deal Lost",
          description: "Opportunity closed without a sale.",
          value: "deal_lost",
        },
      ],
    },
  ];

  const handleStageClick = (index: number) => {
    setOpenDropdownIndex(openDropdownIndex === index ? null : index);
  };

  const handleOptionSelect = (index: number, value: string) => {
    setStageSelections((prev) => ({ ...prev, [index]: value }));

    if (index < stages.length - 1) {
      setCurrentStep(index + 1);
    } else {
      setCurrentStep(stages.length);
    }
    setOpenDropdownIndex(null);
  };

  return (
    <div className="w-full p-8 bg-white rounded-xl">
      <h3 className="text-xl font-bold text-mainText italic mb-10">
        Lead Progress Timeline
      </h3>
      <div className="relative flex items-center justify-between w-full mx-auto">
        {/* Connecting Line */}
        <div className="absolute left-[12.5%] right-[12.5%] top-[34px] transform z-[0] -translate-y-1/4 h-[2px]">
          <div className="absolute top-0 left-0 w-full h-full bg-[#F1F5F9]" />
          <div
            className="absolute top-0 left-0 h-full bg-primary transition-all duration-500 ease-in-out"
            style={{
              width: `${Math.min(
                100,
                (currentStep / (stages.length - 1)) * 100,
              )}%`,
            }}
          />
        </div>

        {stages.map((stage, index) => {
          const isActive = index <= currentStep;
          const isCompleted = index < currentStep;

          return (
            <div
              key={index}
              className="flex flex-col items-center gap-4 relative z-10 w-1/4 cursor-pointer"
              onClick={() => handleStageClick(index)}
            >
              {/* Icon Circle */}
              <div
                className={`flex items-center justify-center p-[0.4rem] rounded-full transition-colors duration-300 ${
                  isActive || isCompleted
                    ? "bg-[linear-gradient(90deg,hsl(var(--primary)/0.47)_0%,rgba(140,229,83,0.47)_147.93%)]"
                    : "bg-[#F5F8FE] border border-[#F1F5F9]"
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center relative transition-colors duration-300 ${
                    isActive || isCompleted ? "bg-primary" : "bg-[#F5F8FE]"
                  }`}
                >
                  {isActive || isCompleted ? (
                    <div className="absolute inset-[-4px] rounded-full" />
                  ) : null}
                  <stage.icon
                    className={`w-6 h-6 z-10 ${
                      isActive || isCompleted ? "text-white" : "text-[#94A3B8]"
                    }`}
                  />
                </div>
              </div>

              {/* Text & Dropdown Label */}
              <div className="text-center z-[50] relative">
                <div className="flex items-center gap-1 justify-center mb-1">
                  <p
                    className={`text-[15px] font-bold italic ${
                      isActive || isCompleted
                        ? "text-mainText"
                        : "text-[#94A3B8]"
                    }`}
                  >
                    {stage.label}
                  </p>
                  <ChevronDown
                    className={`w-4 h-4 ${
                      isActive || isCompleted
                        ? "text-mainText"
                        : "text-[#94A3B8]"
                    }`}
                  />
                </div>
                <div
                  className={`px-10 py-2 rounded-full shadow-sm inline-block ${
                    isActive || isCompleted ? "bg-primary/5" : "bg-[#F5F8FE]"
                  }`}
                >
                  <span
                    className={`text-[13px] font-bold italic ${
                      isActive || isCompleted
                        ? "text-mainText"
                        : "text-mainText"
                    }`}
                  >
                    {stage.subLabel}
                  </span>
                </div>

                {/* Dropdown Menu */}
                {openDropdownIndex === index && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 p-2 z-[9999]">
                    {stage.options?.map((option, optIndex) => {
                      const isSelected =
                        stageSelections[index] === option.value;
                      return (
                        <div
                          key={optIndex}
                          className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors text-left ${
                            isSelected ? "bg-primary/5" : "hover:bg-gray-50"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOptionSelect(index, option.value);
                          }}
                        >
                          <div
                            className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                              isSelected ? "bg-primary" : "bg-gray-300"
                            }`}
                          />
                          <div>
                            <p
                              className={`text-sm font-bold mb-0.5 ${
                                isSelected ? "text-primary" : "text-mainText"
                              }`}
                            >
                              {option.label}
                            </p>
                            <p className="text-xs text-body">
                              {option.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const TABS = [
  "Basic Info",
  "Feed Backs",
  "Marketing Information",
  "Actions & Follow-up",
];

const AddLeadPage = () => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Centralized form state
  const [formData, setFormData] = useState<LeadFormData>(initialFormData);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [socialMediaLinks, setSocialMediaLinks] = useState<SocialMedia[]>([]);

  const activeTab = TABS[activeTabIndex];

  // Update form data helper
  const updateFormData = (updates: Partial<LeadFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  // Validate required fields
  const validateForm = (): boolean => {
    const errors: string[] = [];

    if (!formData.first_name.trim()) errors.push("First Name");
    if (!formData.last_name.trim()) errors.push("Last Name");
    if (!formData.email.trim()) errors.push("Email");
    if (!formData.phone_number.trim()) errors.push("Phone Number");
    if (!formData.company_name.trim()) errors.push("Company Name");
    if (!formData.company_field.trim()) errors.push("Company Field");

    if (errors.length > 0) {
      toast.error(
        <div>
          <p className="font-bold">Please fill in required fields:</p>
          <p className="text-sm">{errors.join(", ")}</p>
        </div>,
        {
          duration: 4000,
          style: {
            background: "#FEF2F2",
            border: "1px solid #FCA5A5",
            color: "#991B1B",
          },
        },
      );
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async (createAnother: boolean = false) => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Auto-generate UUID
      const generatedUuid = crypto.randomUUID();

      // Prepare data for API with defaults for required fields
      const submitData: LeadFormData = {
        ...formData,
        uuid: generatedUuid,
        full_name: `${formData.first_name} ${formData.last_name}`.trim(),
        customer_inquiry:
          feedbacks.length > 0
            ? feedbacks[0].content
            : formData.customer_inquiry || "",

        // Handle defaults for required fields if missing
        business_category_id: formData.business_category_id || 1, // Default to 1
        lead_source_type_id: formData.lead_source_type_id || 1, // Default to 1 (Google)
        lead_source_value: formData.lead_source_value || "Direct", // Default value
      };

      await createLead(submitData);

      toast.success(
        <div className="flex items-center gap-2">
          <CheckSquare className="w-5 h-5 text-green-600" />
          <span className="font-bold">Lead created successfully!</span>
        </div>,
        {
          duration: 3000,
          style: {
            background: "#F0FDF4",
            border: "1px solid #86EFAC",
            color: "#166534",
          },
        },
      );

      if (createAnother) {
        // Reset form for new entry
        setFormData(initialFormData);
        setFeedbacks([]);
        setSocialMediaLinks([]);
        setActiveTabIndex(0);
      } else {
        // Optionally redirect or show success state
      }
    } catch (error: any) {
      if (error?.response?.status !== 500) {
        console.error("Submission error:", error);
      }
      toast.error(
        <div>
          <p className="font-bold">Failed to create lead</p>
          <p className="text-sm">
            {error?.response?.data?.message || "Please try again later."}
          </p>
          {error?.response?.data?.errors && (
            <ul className="text-xs mt-1 list-disc pl-4">
              {Object.values(error.response.data.errors)
                .flat()
                .map((err: any, i) => (
                  <li key={i}>
                    {typeof err === "string" ? err : JSON.stringify(err)}
                  </li>
                ))}
            </ul>
          )}
        </div>,
        {
          duration: 5000,
          style: {
            background: "#FEF2F2",
            border: "1px solid #FCA5A5",
            color: "#991B1B",
          },
        },
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Tab navigation
  const handleNext = () => {
    if (activeTabIndex < TABS.length - 1) {
      setActiveTabIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (activeTabIndex > 0) {
      setActiveTabIndex((prev) => prev - 1);
    }
  };

  const handleCancel = () => {
    // Reset form
    setFormData(initialFormData);
    setFeedbacks([]);
    setSocialMediaLinks([]);
    setActiveTabIndex(0);
    toast("Form has been reset", {
      icon: "🔄",
      duration: 2000,
    });
  };

  return (
    <>
      {/* Toast Container with custom styling */}
      <Toaster
        position="top-right"
        toastOptions={{
          className: "font-sans",
          style: {
            padding: "16px",
            borderRadius: "12px",
          },
        }}
      />

      {/* Loading Overlay */}
      {isLoading && <LoadingSpinner fullScreen />}

      <div className="min-h-screen pb-20">
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
          <div className="rounded-[32px]">
            <Stepper />

            {/* Tabs */}
            <div className="bg-white rounded-xl mt-4 mb-8 px-4 py-2 inline-flex w-full">
              <div className="flex items-center w-full bg-white rounded-full h-12">
                {TABS.map((tab, index) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTabIndex(index)}
                    className={`h-full px-8 rounded-full text-sm font-bold italic transition-colors ${
                      activeTabIndex === index
                        ? "bg-primary text-white shadow-lg shadow-primary/30"
                        : "text-body hover:text-primary"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content - Pass form data as props */}
            {activeTab === "Basic Info" && (
              <BasicInfoTab
                formData={formData}
                updateFormData={updateFormData}
              />
            )}
            {activeTab === "Feed Backs" && (
              <FeedbacksTab
                formData={formData}
                updateFormData={updateFormData}
                feedbacks={feedbacks}
                setFeedbacks={setFeedbacks}
              />
            )}
            {activeTab === "Marketing Information" && (
              <MarketingInfoTab
                formData={formData}
                updateFormData={updateFormData}
                socialMediaLinks={socialMediaLinks}
                setSocialMediaLinks={setSocialMediaLinks}
              />
            )}
            {activeTab === "Actions & Follow-up" && (
              <ActionsFollowUpTab
                formData={formData}
                updateFormData={updateFormData}
              />
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between mt-12 pt-8">
              <div className="flex gap-4">
                <button
                  onClick={() => handleSubmit(false)}
                  disabled={isLoading}
                  className="px-10 py-3 rounded-full bg-primary text-white font-bold italic shadow-lg shadow-primary/30 hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  Create
                </button>
                <button
                  onClick={() => handleSubmit(true)}
                  disabled={isLoading}
                  className="px-6 py-3 rounded-full border border-primary text-primary font-bold italic hover:bg-blue-50 transition-colors disabled:opacity-50"
                >
                  Create & Create Another
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="px-10 py-3 rounded-full border border-primary text-primary font-bold italic hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>

              <div className="flex gap-4">
                {activeTabIndex > 0 && (
                  <button
                    onClick={handleBack}
                    className="px-8 py-3 rounded-full border border-stroke text-body font-bold italic hover:border-primary hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </button>
                )}
                {activeTabIndex < TABS.length - 1 && (
                  <button
                    onClick={handleNext}
                    className="px-10 py-3 rounded-full bg-primary text-white font-bold italic shadow-lg shadow-primary/30 hover:bg-primary/90 transition-colors"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddLeadPage;
