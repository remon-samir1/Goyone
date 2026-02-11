import axios from "axios";
import { LeadFormData } from "@/types/leadTypes";
import Cookies from "cookie-universal";

const cookies = Cookies();
const token = cookies.get("token");

const api = axios.create({
  baseURL: "https://crm.sunmedagency.com/api",
  headers: {
    Authorization: token ? `Bearer ${token}` : "",
  },
});

export const createLead = async (data: LeadFormData): Promise<any> => {
  const formData = new FormData();

  // Append all fields to FormData
  Object.entries(data).forEach(([key, value]) => {
    // Skip undefined or null values
    if (value === undefined || value === null) return;

    if (key === "avatar") {
      // Append avatar if it's a File or a string (e.g. empty string)
      if (value instanceof File || typeof value === "string") {
        formData.append(key, value);
      }
      return;
    }

    if (typeof value === "boolean") {
      formData.append(key, value ? "1" : "0");
      return;
    }

    // Convert everything else to string
    formData.append(key, String(value));
  });

  const response = await api.post("/leads", formData)

  return response.data;
};

export const deleteLead = async (id: string | number): Promise<any> => {
  const response = await api.delete(`/leads/${id}`);
  return response.data;
};

export const getLead = async (id: string | number): Promise<any> => {
  const response = await api.get(`/leads/${id}`);
  return response.data;
};

export const updateLead = async (id: string | number, data: LeadFormData): Promise<any> => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (key === "avatar") {
      if (value instanceof File || typeof value === "string") {
        formData.append(key, value);
      }
      return;
    }
    if (typeof value === "boolean") {
      formData.append(key, value ? "1" : "0");
      return;
    }
    // Handle arrays (like social_media or feedbacks if sent as array)
    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (typeof item === "object") {
          Object.entries(item).forEach(([subKey, subValue]) => {
            formData.append(`${key}[${index}][${subKey}]`, String(subValue));
          });
        } else {
          formData.append(`${key}[${index}]`, String(item));
        }
      });
      return;
    }
    formData.append(key, String(value));
  });

  // Adding _method="PUT" to handle Laravel's FormData PUT limitation
  formData.append("_method", "PUT");
  
  const response = await api.post(`/leads/${id}`, formData);
  return response.data;
};

export const getPositions = async (): Promise<any[]> => {
  const response = await api.get("/positions");
  return response.data;
};

export const getServices = async (): Promise<any[]> => {
  const response = await api.get("/services");
  return response.data.data || response.data;
};

export const getCategories = async (): Promise<any[]> => {
  const response = await api.get("/categories");
  return response.data.data || response.data;
};

export const getLeadSources = async (): Promise<any[]> => {
  const response = await api.get("/lead_source_types");
  return response.data.data || response.data;
};

export const getChannels = async (): Promise<any[]> => {
  const response = await api.get("/channels");
  return response.data.data || response.data;
};

export const getStatuses = async (): Promise<any[]> => {
  const response = await api.get("/statuses");
  return response.data.data || response.data;
};

export const getSellers = async (): Promise<any[]> => {
  const response = await api.get("/sellers");
  return response.data.data || response.data;
};


export default api;
