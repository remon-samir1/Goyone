// Lead Form Data Types - Matching API Schema
// POST https://crm.sunmedagency.com/api/leads

export interface LeadFormData {
  // Basic Info - Personal
  uuid?: string;
  avatar?: string | File;
  first_name: string;
  last_name: string;
  full_name?: string; // Can be computed from first + last
  email: string;
  phone_number: string;
  phone_country_code: string;
  phone_number_two?: string;
  position?: string;
  category_id?: number;

  // Basic Info - Company
  company_name: string;
  company_field: string;
  company_phone?: string;
  company_email?: string;
  service_id?: number;
  business_category_id?: number;

  // Marketing Info
  lead_source_type_id?: number;
  lead_source_value?: string;
  channels_id?: number;
  ad_id?: string;

  // Feedbacks
  customer_inquiry?: string;
  exact_request?: string;
  feedback_id?: number;
  moderation_feedback?: string;

  // Actions & Follow-up
  to?: number; // Assigned seller
  status_id?: number;

  // Approval fields
  finance_approved?: number;
  finance_who_approved?: number;
  department_approved?: number;
  account_manager_approved?: number;

  // Other
  converted?: boolean;
  communicationed?: boolean;
  is_active?: boolean;
  social_media?: SocialMedia[];
}

export interface Feedback {
  id: number;
  content: string;
  time: string;
}

export interface SocialMedia {
  id: number;
  value: string;
  type: string;
  isSaved?: boolean;
}

export interface Country {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
}

export const COUNTRIES: Country[] = [
  { code: "EG", name: "Egypt", dialCode: "+20", flag: "🇪🇬" },
  { code: "SA", name: "Saudi Arabia", dialCode: "+966", flag: "🇸🇦" },
  { code: "AE", name: "UAE", dialCode: "+971", flag: "🇦🇪" },
  { code: "US", name: "United States", dialCode: "+1", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", dialCode: "+44", flag: "🇬🇧" },
  { code: "DE", name: "Germany", dialCode: "+49", flag: "🇩🇪" },
  { code: "FR", name: "France", dialCode: "+33", flag: "🇫🇷" },
  { code: "IT", name: "Italy", dialCode: "+39", flag: "🇮🇹" },
  { code: "ES", name: "Spain", dialCode: "+34", flag: "🇪🇸" },
  { code: "QA", name: "Qatar", dialCode: "+974", flag: "🇶🇦" },
  { code: "KW", name: "Kuwait", dialCode: "+965", flag: "🇰🇼" },
  { code: "BH", name: "Bahrain", dialCode: "+973", flag: "🇧🇭" },
  { code: "OM", name: "Oman", dialCode: "+968", flag: "🇴🇲" },
  { code: "JO", name: "Jordan", dialCode: "+962", flag: "🇯🇴" },
  { code: "LB", name: "Lebanon", dialCode: "+961", flag: "🇱🇧" },
];

export const initialFormData: LeadFormData = {
  first_name: "",
  last_name: "",
  email: "",
  phone_number: "",
  phone_country_code: "+20",
  company_name: "",
  company_field: "",
  converted: false,
  communicationed: true,
  is_active: true,
};
