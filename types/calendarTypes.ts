export interface CalendarEvent {
  id: number;
  name: string;
  description: string | null;
  calendar_color_id: number;
  textColor: string;
  starts_at: string;
  ends_at: string;
  user_id: number;
  attachments: any[];
  created_at: string;
  updated_at: string;
}

export interface CalendarColor {
  id: number;
  name: string;
  color: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface CreateCalendarPayload {
  name: string;
  description?: string;
  calendar_color_id: number | string;
  textColor: string;
  starts_at: string;
  ends_at: string;
  user_id: number | string;
  attachments?: File[];
}
