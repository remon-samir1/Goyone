"use client";

import React, { useState } from "react";
import { Plus, Trash2, ChevronDown, Check } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa";
import CreateLeadSourceModal from "@/components/modals/CreateLeadSourceModal";
import CreateChannelModal from "@/components/modals/CreateChannelModal";
import { LeadFormData, SocialMedia } from "@/types/leadTypes";

interface SocialMediaItemProps {
  item: SocialMedia;
  onDelete: (id: number) => void;
  onUpdate: (id: number, field: keyof SocialMedia, value: any) => void;
}

const SocialMediaItem: React.FC<SocialMediaItemProps> = ({
  item,
  onDelete,
  onUpdate,
}) => {
  const platforms = [
    {
      id: "facebook",
      name: "Facebook",
      icon: FaFacebookF,
      placeholder: "https://facebook.com/yourpage",
    },
    {
      id: "instagram",
      name: "Instagram",
      icon: FaInstagram,
      placeholder: "https://instagram.com/yourpage",
    },
    {
      id: "tiktok",
      name: "TikTok",
      icon: FaTiktok,
      placeholder: "https://tiktok.com/@yourpage",
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: FaLinkedinIn,
      placeholder: "https://linkedin.com/in/yourpage",
    },
    {
      id: "twitter",
      name: "Twitter",
      icon: FaTwitter,
      placeholder: "https://twitter.com/yourpage",
    },
  ];

  const platform = platforms.find((p) => p.id === item.type);
  const SelectedIcon = platform?.icon || FaInstagram;

  return (
    <div className="pt-8 border-t border-stroke mt-8 animate-in fade-in slide-in-from-top-4 duration-300">
      {!item.isSaved ? (
        <>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-primary italic">
              Client&apos;s Social Media
            </h3>
            <button
              onClick={() => onDelete(item.id)}
              className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            <div className=" ">
              <label className="text-xs font-bold py-4 inline-block text-mainText italic">
                Social Type <span className="text-red-500">*</span>
              </label>
              <div className="space-y-4 bg-white py-3 px-4 border-b rounded-t-lg border-stroke">
                <div className="text-[10px] text-body italic">
                  Select platforms
                </div>
                <div className="flex items-center gap-4">
                  {platforms.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => onUpdate(item.id, "type", p.id)}
                      className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 border ${
                        item.type === p.id
                          ? "bg-primary text-white border-primary shadow-lg shadow-primary/30"
                          : "bg-blue-50 text-blue-500 border-transparent hover:bg-blue-100"
                      }`}
                    >
                      <p.icon className="w-5 h-5" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Detailed Input Box */}
              <div
                className={` border  border-[#F1F5F9] rounded-b-lg p-8 md:p-12 flex flex-col bg-white transition-all duration-300 ${item.type ? "items-start" : "items-center justify-center text-center"}`}
              >
                {!item.type ? (
                  <>
                    <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center mb-4">
                      <FaInstagram className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-[#94A3B8] italic">
                        No social media links added yet
                      </p>
                      <p className="text-[10px] text-body italic opacity-70">
                        Click on a platform icon above to get started
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="w-full space-y-6 ">
                    <div className="flex flex-col items-start space-y-3">
                      <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                        <SelectedIcon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-mainText italic">
                          {platform?.name}
                        </h4>
                        <p className="text-[10px] text-body italic opacity-70">
                          Enter your profile URL
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <input
                        type="text"
                        value={item.value}
                        onChange={(e) =>
                          onUpdate(item.id, "value", e.target.value)
                        }
                        placeholder={platform?.placeholder}
                        className="w-full border border-stroke rounded-xl px-4 py-3 text-[13px] text-body italic focus:outline-none focus:border-primary placeholder:text-placeholder/40 bg-white"
                      />

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => onUpdate(item.id, "isSaved", true)}
                          disabled={!item.value || !item.type}
                          className="px-8 py-2.5 rounded-xl bg-primary text-white text-[13px] font-bold italic flex items-center gap-2 hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
                        >
                          <Check className="w-4 h-4 text-white" />
                          Add
                        </button>
                        <button
                          onClick={() => onDelete(item.id)}
                          className="px-8 py-2.5 rounded-xl border border-primary text-primary text-[13px] font-bold italic hover:bg-blue-50 transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-4">
          <div className="bg-[#F8FAFC] rounded-2xl p-4 flex items-center justify-between group hover:border-primary transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                <SelectedIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-mainText italic">
                  {platform?.name}
                </h4>
                <p className="text-[12px] text-body italic truncate max-w-[200px] md:max-w-md">
                  {item.value}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => onUpdate(item.id, "isSaved", false)}
                className="p-2 hover:bg-blue-50 rounded-lg text-primary transition-colors"
                title="Edit"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5 fill-none stroke-current stroke-2"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>
              <button
                onClick={() => onDelete(item.id)}
                className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-colors"
                title="Delete"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface MarketingInfoTabProps {
  formData: LeadFormData;
  updateFormData: (updates: Partial<LeadFormData>) => void;
  socialMediaLinks: SocialMedia[];
  setSocialMediaLinks: React.Dispatch<React.SetStateAction<SocialMedia[]>>;
}

const MarketingInfoTab: React.FC<MarketingInfoTabProps> = ({
  formData,
  updateFormData,
  socialMediaLinks,
  setSocialMediaLinks,
}) => {
  const [isLeadSourceModalOpen, setIsLeadSourceModalOpen] = useState(false);
  const [isChannelModalOpen, setIsChannelModalOpen] = useState(false);

  // Dynamic Options State
  const [leadSourceOptions, setLeadSourceOptions] = useState([
    { id: 1, name: "Google" },
    { id: 2, name: "Facebook" },
    { id: 3, name: "Referral" },
  ]);

  const [channelOptions, setChannelOptions] = useState([
    { id: 1, name: "Email" },
    { id: 2, name: "Phone" },
    { id: 3, name: "SMS" },
  ]);

  // Handlers for creating new items
  const handleCreateLeadSource = (newSource: { id: number; name: string }) => {
    setLeadSourceOptions((prev) => [...prev, newSource]);
    updateFormData({ lead_source_type_id: newSource.id });
  };

  const handleCreateChannel = (newChannel: { id: number; name: string }) => {
    setChannelOptions((prev) => [...prev, newChannel]);
    updateFormData({ channels_id: newChannel.id });
  };

  const handleAddSocialMedia = () => {
    setSocialMediaLinks([
      ...socialMediaLinks,
      { id: Date.now(), value: "", type: "" },
    ]);
  };

  const handleDeleteSocialMedia = (id: number) => {
    setSocialMediaLinks(socialMediaLinks.filter((link) => link.id !== id));
  };

  const handleUpdateSocialMedia = (
    id: number,
    field: keyof SocialMedia,
    value: any,
  ) => {
    setSocialMediaLinks(
      socialMediaLinks.map((link) =>
        link.id === id ? { ...link, [field]: value } : link,
      ),
    );
  };

  return (
    <div className="space-y-10">
      <h3 className="text-xl font-bold text-primary italic mb-6">
        Marketing Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
        <div className="space-y-2">
          <label className="text-xs font-bold text-mainText italic mb-1 block">
            Lead Source <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2 bg-white rounded-xl py-0.5">
            <div className="relative flex-1">
              <select
                value={formData.lead_source_type_id || ""}
                onChange={(e) =>
                  updateFormData({
                    lead_source_type_id: Number(e.target.value),
                  })
                }
                className="w-full rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary appearance-none bg-white cursor-pointer "
              >
                <option value="" disabled>
                  Select an option
                </option>
                {leadSourceOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-3.5 w-4 h-4 text-primary pointer-events-none" />
            </div>
            <button
              onClick={() => setIsLeadSourceModalOpen(true)}
              className="w-11 h-11 flex items-center justify-center text-blue-500 transition-colors border-l border-stroke font-bold text-lg"
            >
              <Plus className="w-5 h-5 text-primary" />
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-mainText italic mb-1 block">
            Channels
          </label>
          <div className="flex gap-2 bg-white rounded-xl py-0.5">
            <div className="relative flex-1">
              <select
                value={formData.channels_id || ""}
                onChange={(e) =>
                  updateFormData({ channels_id: Number(e.target.value) })
                }
                className="w-full rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary appearance-none bg-white cursor-pointer "
              >
                <option value="" disabled>
                  Select an option
                </option>
                {channelOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-3.5 w-4 h-4 text-primary pointer-events-none" />
            </div>
            <button
              onClick={() => setIsChannelModalOpen(true)}
              className="w-11 h-11 flex items-center justify-center text-blue-500 transition-colors border-l border-stroke font-bold text-lg"
            >
              <Plus className="w-5 h-5 text-primary" />
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-mainText italic mb-1 block">
            Ad Id
          </label>
          <input
            type="text"
            value={formData.ad_id || ""}
            onChange={(e) => updateFormData({ ad_id: e.target.value })}
            placeholder="Ad identification number or code"
            className="w-full border border-stroke rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary placeholder:text-placeholder/50"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-mainText italic mb-1 block">
            Lead Source Value
          </label>
          <input
            type="text"
            value={formData.lead_source_value || ""}
            onChange={(e) =>
              updateFormData({ lead_source_value: e.target.value })
            }
            placeholder="Ad or landing page link"
            className="w-full border border-stroke rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary placeholder:text-placeholder/50"
          />
        </div>
      </div>

      {/* Dynamic Social Media Section */}
      <div className="space-y-4">
        {socialMediaLinks.some((l) => l.isSaved) && (
          <div className="pt-4">
            <p className="text-xs font-bold text-mainText italic">
              Added links ({socialMediaLinks.filter((l) => l.isSaved).length})
            </p>
          </div>
        )}
        {socialMediaLinks.map((item) => (
          <SocialMediaItem
            key={item.id}
            item={item}
            onDelete={handleDeleteSocialMedia}
            onUpdate={handleUpdateSocialMedia}
          />
        ))}
      </div>

      <div className="pt-4">
        <button
          onClick={handleAddSocialMedia}
          className="px-6 py-4   rounded-xl border border-dashed border-primary text-primary font-bold italic hover:bg-blue-50 transition-colors w-max flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5 text-primary" />
          Add to Client&apos;s Social Media
        </button>
      </div>

      <CreateLeadSourceModal
        isOpen={isLeadSourceModalOpen}
        onClose={() => setIsLeadSourceModalOpen(false)}
        onSuccess={handleCreateLeadSource}
      />
      <CreateChannelModal
        isOpen={isChannelModalOpen}
        onClose={() => setIsChannelModalOpen(false)}
        onSuccess={handleCreateChannel}
      />
    </div>
  );
};

export default MarketingInfoTab;
