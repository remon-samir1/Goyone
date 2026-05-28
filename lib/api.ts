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

export interface BaseEntity {
  id: number | string;
  name?: string;
  full_name?: string;
  company_name?: string;
  uuid?: string;
  title?: string;
  [key: string]: any;
}

export interface TaskStage extends BaseEntity {
  color?: string;
  order?: number;
}

export interface Task extends BaseEntity {
  task_stage_id: number | string;
  due_date?: string;
  priority?: string;
  description?: string;
}

export interface PaginatedData<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  [key: string]: any;
}

export interface ApiResponse<T> {
  data: T;
  total?: number;
  total_invoices?: number | string;
  total_sales?: number | string;
  total_paid_money?: number | string;
  total_due?: number | string;
  all_count?: number;
  communicationed_count?: number;
  not_communicationed_count?: number;
  message?: string;
  status?: string | number;
}

export const createLead = async (data: LeadFormData): Promise<any> => {
  const formData = new FormData();

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

  const response = await api.post("/leads", formData);

  return response.data;
};

export const deleteLead = async (id: string | number): Promise<{ message: string }> => {
  const response = await api.delete(`/leads/${id}`);
  return response.data;
};

export function extractId(id: string | number | undefined): string {
  if (!id) return "";
  const strId = String(id);
  const match = strId.match(/\d+$/);
  return match ? String(parseInt(match[0], 10)) : strId;
}

export const getLead = async (id: string | number): Promise<ApiResponse<any>> => {
  const response = await api.get(`/leads/${id}`);
  console.log(response);
  return response.data;
};

export const updateLead = async (
  id: string | number,
  data: LeadFormData,
): Promise<any> => {
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

export const getPositions = async (): Promise<BaseEntity[]> => {
  const response = await api.get("/positions");
  return response.data;
};

export const getServices = async (): Promise<BaseEntity[]> => {
  const response = await api.get("/services");
  return response.data.data || response.data;
};

export const getCategories = async (): Promise<BaseEntity[]> => {
  const response = await api.get("/categories");
  return response.data.data || response.data;
};

export const getLeadSources = async (): Promise<BaseEntity[]> => {
  const response = await api.get("/lead_source_types");
  return response.data.data || response.data;
};

export const getChannels = async (): Promise<BaseEntity[]> => {
  const response = await api.get("/channels");
  return response.data.data || response.data;
};

export const getStatuses = async (): Promise<BaseEntity[]> => {
  const response = await api.get("/statuses");
  return response.data.data || response.data;
};

export const getSellers = async (search?: string): Promise<BaseEntity[]> => {
  const response = await api.get("/users", { params: { search } });
  return response.data.data || response.data;
};

export const getUsers = async (search?: string): Promise<BaseEntity[]> => {
  const response = await api.get("/users", { params: { search } });
  return response.data.data || response.data;
};

export const convertLead = async (
  id: string | number,
  convertTo: "contacts" | "companyAccounts",
): Promise<any> => {
  const response = await api.post(`/leads/${id}/convert`, {
    convert_to: convertTo,
  });
  return response.data;
};

export const changeOwner = async (
  leadId: string | number,
  sellerTo: string | number,
): Promise<any> => {
  const response = await api.post("/leads/change_owners", {
    lead_id: leadId,
    seller_to: sellerTo,
  });
  return response.data;
};

export const getTaskStages = async (): Promise<TaskStage[]> => {
  const response = await api.get("/task_stages");
  return response.data.data || response.data;
};

export const getTaskStage = async (id: string | number): Promise<BaseEntity> => {
  const response = await api.get(`/task_stages/${id}`);
  return response.data.data || response.data;
};

export const createTaskStage = async (data: {
  title: string;
  order?: string | number;
}): Promise<any> => {
  const response = await api.post("/task_stages", data);
  return response.data;
};

export const updateTaskStage = async (
  id: string | number,
  data: { title: string; order?: string | number },
): Promise<any> => {
  const response = await api.put(`/task_stages/${id}`, data);
  return response.data;
};

export const deleteTaskStage = async (id: string | number): Promise<any> => {
  const response = await api.delete(`/task_stages/${id}`);
  return response.data;
};

export const getTasks = async (): Promise<Task[]> => {
  const response = await api.get("/tasks");
  return response.data.data || response.data;
};

export const getTask = async (id: string | number): Promise<BaseEntity> => {
  const response = await api.get(`/tasks/${id}`);
  return response.data.data || response.data;
};

export const updateTask = async (
  id: string | number,
  data: any,
): Promise<any> => {
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

export const getCalls = async (params: {
  page?: number;
  search?: string;
  status?: string;
}): Promise<any> => {
  const response = await api.get("/calls", { params });
  return response.data;
};

export const deleteCall = async (id: string | number): Promise<any> => {
  const response = await api.delete(`/calls/${id}`);
  return response.data;
};

export const getMeetings = async (params: {
  page?: number;
  search?: string;
  status?: string;
}): Promise<any> => {
  try {
    // Filter out empty string params to avoid Laravel 422 validation errors
    const cleanParams: Record<string, any> = {};
    if (params.page) cleanParams.page = params.page;
    if (params.search) cleanParams.search = params.search;
    if (params.status) cleanParams.status = params.status;

    const response = await api.get("/meetings", { params: cleanParams });
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch meetings";
    const status = error.response?.status;
    console.error(
      `getMeetings error (${status}):`,
      error.response?.data || error,
    );
    throw new Error(message);
  }
};

export const deleteMeeting = async (id: string | number): Promise<any> => {
  try {
    const response = await api.delete(`/meetings/${id}`);
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to delete meeting";
    const status = error.response?.status;
    console.error(
      `deleteMeeting error (${status}):`,
      error.response?.data || error,
    );
    throw new Error(message);
  }
};

export const getAllLeads = async (
  search?: string,
  getConverted?: string,
): Promise<any[]> => {
  const response = await api.get("/leads", {
    params: {
      per_page: 100,
      search: search || undefined,
      get_converted: getConverted || undefined,
    },
  });
  return response.data.data || response.data;
};

export const exportLeads = async (params: {
  date_from?: string;
  date_to?: string;
  status_id?: number | string;
}): Promise<any> => {
  const response = await api.get("/leads/export", {
    params,
    responseType: "blob",
  });
  return response;
};

export const getCalendars = async (params?: {
  only?: string;
}): Promise<any> => {
  try {
    const response = await api.get("/calendars", { params });
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch calendars";
    console.error("getCalendars error:", error.response?.data || error);
    throw new Error(message);
  }
};

export const createCalendar = async (data: FormData): Promise<any> => {
  try {
    const response = await api.post("/calendars", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to create calendar event";
    console.error("createCalendar error:", error.response?.data || error);
    throw new Error(message);
  }
};

export const createCalendarColor = async (data: any): Promise<any> => {
  try {
    const response = await api.post("/calendar_colors", data);
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to create calendar color";
    console.error("createCalendarColor error:", error.response?.data || error);
    throw new Error(message);
  }
};

export const getCalendarColors = async (): Promise<any[]> => {
  try {
    const response = await api.get("/calendar_colors");
    return response.data.data || response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch calendar colors";
    console.error("getCalendarColors error:", error.response?.data || error);
    throw new Error(message);
  }
};

export const getCalendarColor = async (id: string | number): Promise<any> => {
  try {
    const response = await api.get(`/calendar_colors/${id}`);
    return response.data.data || response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch calendar color";
    console.error("getCalendarColor error:", error.response?.data || error);
    throw new Error(message);
  }
};

export const updateCalendarColor = async (
  id: string | number,
  data: any,
): Promise<any> => {
  try {
    const isFormData = data instanceof FormData;
    if (isFormData) {
      data.append("_method", "PUT");
      const response = await api.post(`/calendar_colors/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } else {
      const response = await api.put(`/calendar_colors/${id}`, data);
      return response.data;
    }
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to update calendar color";
    console.error("updateCalendarColor error:", error.response?.data || error);
    throw new Error(message);
  }
};

export const deleteCalendarColor = async (
  id: string | number,
): Promise<any> => {
  try {
    const response = await api.delete(`/calendar_colors/${id}`);
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to delete calendar color";
    console.error("deleteCalendarColor error:", error.response?.data || error);
    throw new Error(message);
  }
};

export const updateCalendar = async (
  id: string | number,
  data: FormData,
): Promise<any> => {
  try {
    data.append("_method", "PUT");
    const response = await api.post(`/calendars/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to update calendar event";
    console.error("updateCalendar error:", error.response?.data || error);
    throw new Error(message);
  }
};

export const deleteCalendar = async (id: string | number): Promise<any> => {
  try {
    const response = await api.delete(`/calendars/${id}`);
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to delete calendar event";
    console.error("deleteCalendar error:", error.response?.data || error);
    throw new Error(message);
  }
};

// Deal API Functions

export const getDealStages = async (): Promise<BaseEntity[]> => {
  const response = await api.get("/deal_stages");
  return response.data.data || response.data;
};

export const getDealStage = async (id: string | number): Promise<BaseEntity> => {
  const response = await api.get(`/deal_stages/${id}`);
  return response.data.data || response.data;
};

export const createDealStage = async (data: {
  title: string;
  order?: string | number;
  color?: string;
  percentage?: number;
}): Promise<any> => {
  const response = await api.post("/deal_stages", data);
  return response.data;
};

export const updateDealStage = async (
  id: string | number,
  data: {
    title: string;
    order?: string | number;
    color?: string;
    percentage?: number;
  },
): Promise<any> => {
  const response = await api.put(`/deal_stages/${id}`, data);
  return response.data;
};

export const deleteDealStage = async (id: string | number): Promise<any> => {
  const response = await api.delete(`/deal_stages/${id}`);
  return response.data;
};

export const getDeals = async (params?: {
  page?: number;
  search?: string;
}): Promise<ApiResponse<PaginatedData<BaseEntity> | BaseEntity[]>> => {
  const response = await api.get("/deals", { params });
  return response.data;
};

export const getDeal = async (id: string | number): Promise<any> => {
  const response = await api.get(`/deals/${id}`);
  return response.data.data || response.data;
};

export const createDeal = async (data: any): Promise<any> => {
  const response = await api.post("/deals", data);
  return response.data;
};

export const updateDeal = async (
  id: string | number,
  data: any,
): Promise<any> => {
  const isFormData = data instanceof FormData;
  if (isFormData) {
    data.append("_method", "PUT");
    const response = await api.post(`/deals/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } else {
    const response = await api.put(`/deals/${id}`, data);
    return response.data;
  }
};

export const deleteDeal = async (id: string | number): Promise<any> => {
  const response = await api.delete(`/deals/${id}`);
  return response.data;
};

export const getCurrencies = async (): Promise<any[]> => {
  const response = await api.get("/currency");
  return response.data
};

// Invoice API Functions

export const getInvoices = async (params?: {
  page?: number;
  search?: string;
  status?: string;
  type?: string;
  category_id?: number | string;
  currency_id?: number | string;
  date_from?: string;
  date_to?: string;
  due_from?: string;
  due_to?: string;
  is_activated?: boolean | number;
  is_offer?: boolean | number;
  max_paid?: number;
  max_total?: number;
  min_paid?: number;
  min_total?: number;
  only_trashed?: boolean | number;
  with_trashed?: boolean | number;
  user_id?: number | string;
  per_page?: number;
}): Promise<ApiResponse<PaginatedData<BaseEntity> | BaseEntity[]>> => {
  const response = await api.get("/invoices", { params });
  return response.data;
};

export const getInvoice = async (id: string | number): Promise<any> => {
  const response = await api.get(`/invoices/${id}`);
  console.log(response.data);
  return response.data.data || response.data;
};

export const createInvoice = async (data: any): Promise<any> => {
  const response = await api.post("/invoices", data);
  return response.data;
};

export const updateInvoice = async (
  id: string | number,
  data: any,
): Promise<any> => {
  const isFormData = data instanceof FormData;
  if (isFormData) {
    data.append("_method", "PUT");
    const response = await api.post(`/invoices/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } else {
    const response = await api.put(`/invoices/${id}`, data);
    return response.data;
  }
};

export const deleteInvoice = async (id: string | number): Promise<any> => {
  const response = await api.delete(`/invoices/${id}`);
  return response.data;
};

export const payInvoice = async (id: string | number, data: any): Promise<any> => {
  const isFormData = data instanceof FormData;
  const response = await api.post(`/invoices/${id}/pay`, data, {
    headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
  });
  return response.data;
};

export const exportInvoices = async (params: {
  date_from?: string;
  date_to?: string;
  status?: string;
}): Promise<any> => {
  const response = await api.get("/invoices/export", {
    params,
    responseType: "blob",
  });
  return response;
};

export const getActivities = async (params?: {
  event?: string;
  subject_id?: string | number;
  subject_type?: string;
  page?: number;
}): Promise<any> => {
  const response = await api.get("/activitie_logs", { params });
  return response.data;
};

export default api;
