import axios from "axios";
import { LeadFormData } from "@/types/leadTypes";

const api = axios.create({
  baseURL: "https://crm.sunmedagency.com/api",

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

export default api;
