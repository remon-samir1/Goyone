"use client";

import React, { useState, useEffect } from "react";
import {
  Phone,
  CheckSquare,
  ChevronDown,
  ChevronLeft,
  Target,
  ScrollText,
} from "lucide-react";
import Header from "../../header";
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
import {
  getLead,
  updateLead,
  getPositions,
  getServices,
  getCategories,
  getLeadSources,
  getChannels,
  getStatuses,
} from "@/lib/api";
import { useParams, useRouter } from "next/navigation";

// Stepper Component
interface StepperProps {
  statuses: any[];
  currentStatusId: number | undefined;
  onStatusSelect: (statusId: number) => void;
}

const Stepper: React.FC<StepperProps> = ({
  statuses,
  currentStatusId,
  onStatusSelect,
}) => {
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(
    null,
  );

  // Group statuses by stage
  const stagesData = [
    { label: "Contact Stage", icon: Phone, stageNum: 1 },
    { label: "Qualification Stage", icon: Target, stageNum: 2 },
    { label: "Proposal Stage", icon: ScrollText, stageNum: 3 },
    { label: "Closing Stage", icon: CheckSquare, stageNum: 4 },
  ];

  const stages = stagesData.map((s) => {
    const stageStatuses = statuses.filter((st) => st.stage === s.stageNum);
    const selectedInStage = stageStatuses.find(
      (st) => st.id === currentStatusId,
    );

    return {
      ...s,
      subLabel: selectedInStage ? selectedInStage.name : s.label,
      options: stageStatuses.map((st) => ({
        id: st.id,
        label: st.name,
        description: st.description,
      })),
      isSelected: !!selectedInStage,
    };
  });

  // Calculate current step based on the highest stage with a selection
  const currentStep =
    statuses.find((st) => st.id === currentStatusId)?.stage || 0;

  const handleStageClick = (index: number) => {
    setOpenDropdownIndex(openDropdownIndex === index ? null : index);
  };

  const handleOptionSelect = (optionId: number) => {
    onStatusSelect(optionId);
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
              width: `${Math.max(0, Math.min(100, ((currentStep - 1) / (stages.length - 1)) * 100))}%`,
            }}
          />
        </div>

        {stages.map((stage, index) => {
          const isActive = stage.stageNum <= currentStep;
          const isCompleted = stage.stageNum < currentStep;

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
                    isActive ? "bg-primary" : "bg-[#F5F8FE]"
                  }`}
                >
                  <stage.icon
                    className={`w-6 h-6 z-10 ${
                      isActive ? "text-white" : "text-[#94A3B8]"
                    }`}
                  />
                </div>
              </div>

              {/* Text & Dropdown Label */}
              <div className="text-center z-[50] relative">
                <div className="flex items-center gap-1 justify-center mb-1">
                  <p
                    className={`text-[15px] font-bold italic ${
                      isActive ? "text-mainText" : "text-[#94A3B8]"
                    }`}
                  >
                    {stage.label}
                  </p>
                  <ChevronDown
                    className={`w-4 h-4 ${
                      isActive ? "text-mainText" : "text-[#94A3B8]"
                    }`}
                  />
                </div>
                <div
                  className={`px-10 py-2 rounded-full shadow-sm inline-block ${
                    isActive ? "bg-primary/5" : "bg-[#F5F8FE]"
                  }`}
                >
                  <span
                    className={`text-[13px] font-bold italic text-mainText`}
                  >
                    {stage.subLabel}
                  </span>
                </div>

                {/* Dropdown Menu */}
                {openDropdownIndex === index && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 p-2 z-[9999]">
                    {stage.options?.map((option, optIndex) => {
                      const isSelected = currentStatusId === option.id;
                      return (
                        <div
                          key={optIndex}
                          className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors text-left ${
                            isSelected ? "bg-primary/5" : "hover:bg-gray-50"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOptionSelect(option.id);
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

const EditLeadPage = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Dropdown options state
  const [options, setOptions] = useState({
    positions: [] as any[],
    services: [] as any[],
    categories: [] as any[],
    leadSources: [] as any[],
    channels: [] as any[],
    statuses: [] as any[],
  });

  const addOption = (key: keyof typeof options, newOption: any) => {
    setOptions((prev) => ({
      ...prev,
      [key]: [...prev[key], newOption],
    }));
  };

  // Centralized form state
  const [formData, setFormData] = useState<LeadFormData>(initialFormData);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [socialMediaLinks, setSocialMediaLinks] = useState<SocialMedia[]>([]);

  const activeTab = TABS[activeTabIndex];

  // Fetch lead data
  useEffect(() => {
    if (id) {
      const fetchLeadData = async () => {
        setIsLoading(true);
        try {
          const response = await getLead(id);
          const lead = response.data;

          // Map API data to LeadFormData
          setFormData({
            ...initialFormData,
            ...lead,
            // Ensure first name and last name are set if they came as full_name
            first_name: lead.first_name || lead.full_name?.split(" ")[0] || "",
            last_name:
              lead.last_name ||
              lead.full_name?.split(" ").slice(1).join(" ") ||
              "",
            phone_number: lead.phone_number || lead.phone || "",

            // Map nested objects to IDs for select inputs
            position:
              lead.position ||
              lead.position?.id ||
              lead.position?.name?.toLowerCase().replace(/\s+/g, "_") ||
              "",
            category_id:
              lead.category_id ||
              (lead.category?.id ? Number(lead.category.id) : ""),
            service_id:
              lead.service_id ||
              (lead.service?.id ? Number(lead.service.id) : ""),
            lead_source_type_id:
              lead.lead_source_type_id ||
              (lead.lead_source_type?.id
                ? Number(lead.lead_source_type.id)
                : ""),
            channels_id:
              lead.channels_id ||
              (lead.channels?.id ? Number(lead.channels.id) : ""),
            status_id:
              lead.status_id || (lead.status?.id ? Number(lead.status.id) : ""),

            business_category_id: lead.business_category_id || 1, // Default to 1
            lead_source_value: lead.lead_source_value || "Direct", // Default value
          });

          if (lead.feedbacks) {
            setFeedbacks(lead.feedbacks);
          }

          if (lead.social_media) {
            setSocialMediaLinks(
              lead.social_media.map((sm: any) => ({
                id: sm.id,
                type: sm.type,
                value: sm.value,
                isSaved: true,
              })),
            );
          }
        } catch (error) {
          console.error("Error fetching lead:", error);
          toast.error("Failed to load lead data");
        } finally {
          setIsLoading(false);
        }
      };
      fetchLeadData();

      // Fetch dropdown options
      const fetchOptions = async () => {
        try {
          const [
            positionsData,
            servicesData,
            categoriesData,
            leadSourcesData,
            channelsData,
            statusesData,
          ] = await Promise.all([
            getPositions(),
            getServices(),
            getCategories(),
            getLeadSources(),
            getChannels(),
            getStatuses(),
          ]);

          setOptions({
            positions: positionsData,
            services: servicesData,
            categories: categoriesData,
            leadSources: leadSourcesData,
            channels: channelsData,
            statuses: statusesData,
          });
        } catch (error) {
          console.error("Error fetching dropdown options:", error);
        }
      };

      fetchOptions();
    }
  }, [id]);

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
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Prepare data for API with defaults for required fields
      const submitData: LeadFormData = {
        ...formData,
        full_name: `${formData.first_name} ${formData.last_name}`.trim(),
        customer_inquiry:
          feedbacks.length > 0
            ? feedbacks[0].content
            : formData.customer_inquiry || "",
        // Add social media if your API expects them in this format
        social_media: socialMediaLinks.filter((l) => l.isSaved),
      };

      await updateLead(id, submitData);

      toast.success(
        <div className="flex items-center gap-2">
          <CheckSquare className="w-5 h-5 text-green-600" />
          <span className="font-bold">Lead updated successfully!</span>
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

      // Redirect back to CRM list
      router.push("/crm");
    } catch (error: any) {
      if (error?.response?.status !== 500) {
        console.error("Submission error:", error);
      }
      toast.error(
        <div>
          <p className="font-bold">Failed to update lead</p>
          <p className="text-sm">
            {error?.response?.data?.message || "Please try again later."}
          </p>
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
    router.push("/crm");
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
            Update lead
          </h1>
          <p className="text-sm text-body italic mb-8">
            Edit the information below to update the lead in your CRM
          </p>

          {/* White Card Container */}
          <div className="rounded-[32px]">
            <Stepper
              statuses={options.statuses}
              currentStatusId={formData.status_id}
              onStatusSelect={(id) => updateFormData({ status_id: id })}
            />

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
                positionOptions={options?.positions}
                serviceOptions={options.services}
                categoryOptions={options.categories}
                onAddPosition={(opt) => addOption("positions", opt)}
                onAddService={(opt) => addOption("services", opt)}
                onAddCategory={(opt) => addOption("categories", opt)}
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
                leadSourceOptions={options.leadSources}
                channelOptions={options.channels}
                onAddLeadSource={(opt) => addOption("leadSources", opt)}
                onAddChannel={(opt) => addOption("channels", opt)}
              />
            )}
            {activeTab === "Actions & Follow-up" && (
              <ActionsFollowUpTab
                formData={formData}
                updateFormData={updateFormData}
                mode="edit"
              />
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between mt-12 pt-8">
              <div className="flex gap-4">
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="px-10 py-3 rounded-full bg-primary text-white font-bold italic shadow-lg shadow-primary/30 hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  Update
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

export default EditLeadPage;
