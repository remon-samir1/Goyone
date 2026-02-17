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

export function extractId(id: string | number | undefined): string {
  if (!id) return "";
  const strId = String(id);
  const match = strId.match(/\d+$/);
  return match ? String(parseInt(match[0], 10)) : strId;
}

export const getLead = async (id: string | number): Promise<any> => {
  const response = await api.get(`/leads/${id}`);
  console.log(response);
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


export const convertLead = async (id: string | number, convertTo: 'contacts' | 'companyAccounts'): Promise<any> => {
  const response = await api.post(`/leads/${id}/convert`, {
    convert_to: convertTo,
  });
  return response.data;
};

export const getTaskStages = async (): Promise<any[]> => {
  const response = await api.get("/task_stages");
  return response.data.data || response.data;
};

export const getTaskStage = async (id: string | number): Promise<any> => {
  const response = await api.get(`/task_stages/${id}`);
  console.log(response);
  return response.data.data || response.data;
};

export const createTaskStage = async (data: { title: string; order?: string | number }): Promise<any> => {
  const response = await api.post("/task_stages", data);
  return response.data;
};

export const updateTaskStage = async (id: string | number, data: { title: string; order?: string | number }): Promise<any> => {
  const response = await api.put(`/task_stages/${id}`, data);
  return response.data;
};

export const deleteTaskStage = async (id: string | number): Promise<any> => {
  const response = await api.delete(`/task_stages/${id}`);
  return response.data;
};

export const getTasks = async (): Promise<any[]> => {
  const response = await api.get("/tasks");
  console.log(response)
  return response.data.data || response.data;
};

export const getTask = async (id: string | number): Promise<any> => {
  const response = await api.get(`/tasks/${id}`);
  return response.data.data || response.data;
};

export const updateTask = async (id: string | number, data: any): Promise<any> => {
  const isFormData = data instanceof FormData;
  if (isFormData) {
    data.append("_method", "PUT");
    const response = await api.post(`/tasks/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } else {
    const response = await api.put(`/tasks/${id}`, data);
    return response.data;
  }
};

export const deleteTask = async (id: string | number): Promise<any> => {
  const response = await api.delete(`/tasks/${id}`);
  return response.data;
};

// Activity API Functions

export const createTask = async (data: FormData): Promise<any> => {
  const response = await api.post("/tasks", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const createMeeting = async (data: FormData | any): Promise<any> => {
  const isFormData = data instanceof FormData;
  const response = await api.post("/meetings", data, {
    headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
  });
  return response.data;
};

export const createCall = async (data: FormData | any): Promise<any> => {
  const isFormData = data instanceof FormData;
  const response = await api.post("/calls", data, {
    headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
  });
  return response.data;
};

export const sendEmail = async (data: FormData): Promise<any> => {
  const response = await api.post("/mails", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export default api;
