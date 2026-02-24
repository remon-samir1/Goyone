"use client";

import React, { useState, useEffect } from "react";
import Header from "../header";
import { getCalendars, getCalendarColors } from "@/lib/api";
import { toast, Toaster } from "react-hot-toast";
import CreateCalendarModal from "@/components/modals/CreateCalendarModal";
import {
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Plus,
  Filter,
  MonitorPlay,
  Video,
  User,
  Search,
  Edit2,
  Trash2,
  Calendar as CalendarIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const TAILWIND_COLOR_MAP: Record<string, string> = {
  stone: "#78716c",
  zinc: "#71717a",
  rose: "#f43f5e",
  pink: "#ec4899",
  fuchsia: "#d946ef",
  purple: "#a855f7",
  violet: "#8b5cf6",
  indigo: "#6366f1",
  blue: "#3b82f6",
  sky: "#0ea5e9",
  cyan: "#06b6d4",
  teal: "#14b8a6",
  emerald: "#10b981",
  green: "#22c55e",
  lime: "#84cc16",
  yellow: "#eab308",
  amber: "#f59e0b",
  orange: "#f97316",
  red: "#ef4444",
  slate: "#64748b",
  gray: "#6b7280",
  neutral: "#737373",
  white: "#ffffff",
  black: "#000000",
};

const resolveColor = (color: string) => {
  if (!color) return "#3B82F6";
  if (color.startsWith("#")) return color;
  return TAILWIND_COLOR_MAP[color.toLowerCase()] || color;
};

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1)); // Default to Jan 2026 as per screenshot
  const [viewMode, setViewMode] = useState<"Month" | "Week" | "Day">("Month");
  const [events, setEvents] = useState<any[]>([]);
  const [colors, setColors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterMode, setFilterMode] = useState<string | undefined>(undefined);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [colorSearch, setColorSearch] = useState("");

  useEffect(() => {
    // Override default to current date when component mounts, but let's keep it dynamic based on real date
    setCurrentDate(new Date());
    fetchData();
  }, [filterMode]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [eventsRes, colorsRes] = await Promise.all([
        getCalendars(filterMode ? { only: filterMode } : undefined),
        getCalendarColors(),
      ]);
      setEvents(eventsRes?.data || eventsRes || []);
      setColors(colorsRes || []);
    } catch (error) {
      console.error("Failed to fetch calendar data:", error);
      toast.error("Failed to fetch calendar data");
    } finally {
      setLoading(false);
    }
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );
  };

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const generateMonthGrid = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = getDaysInMonth(year, month);

    const days = [];

    // Previous month padding
    const prevMonthDays = getDaysInMonth(year, month - 1);
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthDays - i),
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
      });
    }

    // Next month padding to fill a 6-row grid (42 days)
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
      });
    }

    return days;
  };

  const getEventsForDay = (date: Date) => {
    if (!date) return [];
    return events.filter((e) => {
      const start = new Date(e.starts_at);
      return (
        start.getDate() === date.getDate() &&
        start.getMonth() === date.getMonth() &&
        start.getFullYear() === date.getFullYear()
      );
    });
  };

  const getColorDetails = (colorId: number | string) => {
    const colorObj = colors.find((c) => String(c.id) === String(colorId)) || {
      color: "#3B82F6",
      name: "Default",
    };
    return {
      ...colorObj,
      color: resolveColor(colorObj.color),
    };
  };

  const filteredColors = colors.filter((c) =>
    c.name.toLowerCase().includes(colorSearch.toLowerCase()),
  );

  return (
    <>
      <Toaster position="top-right" />
      <Header Links={true} />

      <div className="pb-12 px-[3%] pt-8 min-h-screen bg-[#F8FAFC]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[1.5rem] font-bold text-mainText italic">
            Calendar
          </h2>
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <button
            onClick={() => fetchData()}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[#F1F5F9] rounded-xl hover:bg-gray-50 transition-colors text-sm font-bold italic text-body shadow-sm"
          >
            <RefreshCw
              className={cn(
                "w-4 h-4 text-[#3B82F6]",
                loading && "animate-spin",
              )}
            />{" "}
            Refresh
          </button>

          <button
            onClick={() =>
              setFilterMode(
                filterMode === "meeting_rooms" ? undefined : "meeting_rooms",
              )
            }
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-xl border transition-colors text-sm font-bold italic shadow-sm",
              filterMode === "meeting_rooms"
                ? "bg-[#10B981]/10 border-[#10B981] text-[#10B981]"
                : "bg-white border-[#F1F5F9] text-body hover:bg-gray-50",
            )}
          >
            <MonitorPlay className="w-4 h-4 text-[#10B981]" /> Meeting rooms
          </button>

          <button
            onClick={() =>
              setFilterMode(filterMode === "studio" ? undefined : "studio")
            }
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-xl border transition-colors text-sm font-bold italic shadow-sm",
              filterMode === "studio"
                ? "bg-[#F59E0B]/10 border-[#F59E0B] text-[#F59E0B]"
                : "bg-white border-[#F1F5F9] text-body hover:bg-gray-50",
            )}
          >
            <Video className="w-4 h-4 text-[#F59E0B]" /> Studio
          </button>

          <button
            onClick={() =>
              setFilterMode(
                filterMode === "my_calendar" ? undefined : "my_calendar",
              )
            }
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-xl border transition-colors text-sm font-bold italic shadow-sm",
              filterMode === "my_calendar"
                ? "bg-[#10B981]/10 border-[#10B981] text-[#10B981]"
                : "bg-white border-[#F1F5F9] text-body hover:bg-gray-50",
            )}
          >
            <CalendarIcon className="w-4 h-4 text-[#10B981]" /> My Calendar
          </button>

          <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[#F1F5F9] rounded-xl hover:bg-gray-50 transition-colors text-sm font-bold italic text-body shadow-sm">
            <Filter className="w-4 h-4 text-[#EF4444]" /> Filter
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center bg-[#3B82F6] text-white py-2.5 px-6 rounded-xl hover:bg-blue-600 transition-colors font-bold italic text-sm shadow-sm shadow-blue-500/20 ml-2"
          >
            <Plus className="w-4 h-4 mr-1" />
            New Calendar
          </button>
        </div>

        {/* Calendar Nav & Grid Container */}
        <div className="bg-white rounded-[24px] border border-[#F1F5F9] overflow-hidden shadow-sm mb-8">
          {/* Calendar Nav */}
          <div className="p-5 flex flex-wrap items-center justify-between border-b border-[#F1F5F9]">
            <div className="flex items-center gap-4">
              <button
                onClick={goToToday}
                className="px-5 py-2 rounded-xl bg-[#F8FAFC] border border-[#F1F5F9] text-body font-bold italic hover:bg-gray-100 transition-colors text-sm"
              >
                Today
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={prevMonth}
                  className="p-1.5 hover:bg-gray-100 rounded-lg text-body transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-[#3B82F6]" />
                </button>
                <button
                  onClick={nextMonth}
                  className="p-1.5 hover:bg-gray-100 rounded-lg text-body transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-[#3B82F6]" />
                </button>
              </div>
              <h3 className="text-xl font-bold text-mainText ml-2 italic">
                {currentDate.toLocaleString("default", { month: "long" })}{" "}
                {currentDate.getFullYear()}
              </h3>
            </div>

            <div className="flex bg-[#F8FAFC] p-1 rounded-xl border border-[#F1F5F9]">
              {["Month", "Week", "Day"].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode as any)}
                  className={cn(
                    "px-6 py-2 rounded-lg text-sm font-bold italic transition-all",
                    viewMode === mode
                      ? "bg-[#3B82F6] text-white shadow-sm"
                      : "text-body hover:text-mainText",
                  )}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="w-full">
            <div className="grid grid-cols-7 border-b border-[#F1F5F9]">
              {DAYS_OF_WEEK.map((day) => (
                <div
                  key={day}
                  className="py-4 text-center text-sm font-bold text-[#8A92A6] italic"
                >
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 auto-rows-[minmax(140px,auto)] bg-[#F1F5F9] gap-[1px]">
              {generateMonthGrid().map((dayObj, idx) => {
                const date = dayObj.date;
                const isCurrentMonth = dayObj.isCurrentMonth;
                const dayEvents = getEventsForDay(date);
                const isToday =
                  date.getDate() === new Date().getDate() &&
                  date.getMonth() === new Date().getMonth() &&
                  date.getFullYear() === new Date().getFullYear();

                return (
                  <div
                    key={idx}
                    className={cn(
                      "bg-white p-3 flex flex-col transition-colors hover:bg-[#F8FAFC]",
                      !isCurrentMonth && "opacity-40",
                    )}
                  >
                    <div className="flex justify-start mb-2">
                      <span
                        className={cn(
                          "w-7 h-7 flex items-center justify-center rounded-full text-[13px] font-bold italic",
                          isToday ? "bg-[#3B82F6] text-white" : "text-mainText",
                        )}
                      >
                        {date.getDate()}
                      </span>
                    </div>

                    <div className="flex-1 flex flex-col gap-2 overflow-y-auto max-h-[120px] custom-scrollbar">
                      {dayEvents.map((evt) => {
                        const colorObj = getColorDetails(evt.calendar_color_id);
                        const bgHex = colorObj.color || "#3B82F6";
                        const darkTextHex = bgHex; // Keep text same color as border/indicator

                        return (
                          <div
                            key={evt.id}
                            className="px-2.5 py-2.5  shrink-0 rounded-lg text-xs font-bold flex flex-col justify-center cursor-pointer transition-opacity relative overflow-hidden"
                            style={{
                              color: darkTextHex,
                            }}
                            title={evt.name}
                          >
                            {/* Background layer with correct opacity */}
                            <div
                              className="absolute inset-0 opacity-[0.19]"
                              style={{ backgroundColor: bgHex }}
                            ></div>

                            {/* Left border indicator */}
                            <div
                              className="absolute left-0 top-0 bottom-0 w-[5px] rounded-r-lg z-10"
                              style={{ backgroundColor: bgHex }}
                            ></div>

                            <div className="relative z-10 flex items-center gap-1.5 pl-3">
                              <span
                                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                style={{ backgroundColor: bgHex }}
                              ></span>
                              <span className="truncate leading-tight text-mainText  italic text-[12px]">
                                {evt.name}
                              </span>
                            </div>
                            <span className="relative z-10 text-[12px] pl-6  font-medium text-body italic mt-0.5">
                              {new Date(evt.starts_at).toLocaleTimeString([], {
                                hour: "numeric",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Colors Section */}
        <div className="bg-white rounded-[24px] border border-[#F1F5F9] overflow-hidden shadow-sm">
          <div className="p-6 border-b border-[#F1F5F9] flex flex-wrap justify-between items-center gap-4">
            <h2 className="text-[1.25rem] font-bold text-mainText italic">
              Calendar Colors
            </h2>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-placeholder" />
                <input
                  type="text"
                  placeholder="Search calendars..."
                  value={colorSearch}
                  onChange={(e) => setColorSearch(e.target.value)}
                  className="pl-9 pr-4 py-2.5 rounded-xl border border-[#F1F5F9] bg-[#F8FAFC] text-sm text-body italic focus:outline-none focus:border-[#3B82F6] w-[250px]"
                />
              </div>
              <button className="flex items-center bg-[#3B82F6] text-white py-2.5 px-5 rounded-xl hover:bg-blue-600 transition-colors font-bold italic text-sm shadow-sm shadow-blue-500/20">
                <Plus className="w-4 h-4 mr-1" /> Add New Color
              </button>
            </div>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-[#F1F5F9]">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-mainText italic uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-mainText italic uppercase tracking-wider">
                    Color
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-mainText italic uppercase tracking-wider text-right w-[120px]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredColors.length > 0 ? (
                  filteredColors.map((c) => (
                    <tr
                      key={c.id}
                      className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors last:border-0"
                    >
                      <td className="px-6 py-4 text-sm text-body font-bold italic">
                        {c.name}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3 text-sm text-placeholder italic">
                          <span
                            className="w-6 h-6 rounded flex-shrink-0"
                            style={{ backgroundColor: resolveColor(c.color) }}
                          ></span>
                          {c.color}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 hover:bg-blue-50 rounded-lg group transition-colors">
                            <Edit2 className="w-4 h-4 text-[#3B82F6] opacity-70 group-hover:opacity-100" />
                          </button>
                          <button className="p-2 hover:bg-red-50 rounded-lg group transition-colors">
                            <Trash2 className="w-4 h-4 text-[#EF4444] opacity-70 group-hover:opacity-100" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-8 text-center text-body italic"
                    >
                      No colors found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-[#F1F5F9] flex flex-wrap items-center justify-between text-sm text-placeholder italic gap-4">
            <div className="flex items-center gap-2">
              <span>Per page:</span>
              <div className="flex items-center gap-1 bg-[#F8FAFC] px-2 py-1 rounded-lg border border-[#F1F5F9]">
                <span className="text-body font-bold">5</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span>Page 1 of 1</span>
              <div className="flex items-center gap-1">
                <button
                  className="p-1 text-placeholder hover:text-body"
                  disabled
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  className="p-1 text-placeholder hover:text-body"
                  disabled
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <CreateCalendarModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={() => fetchData()}
        />
      </div>
    </>
  );
};

export default CalendarPage;
