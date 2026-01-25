"use client";

import React, { useState, useRef } from "react";
import {
  Target,
  CheckSquare,
  Clock,
  Trash2,
  Calendar,
  Plus,
} from "lucide-react";

interface Feedback {
  id: number;
  content: string;
  time: string;
}

const FeedbackItem = ({
  feedback,
  onDelete,
  onUpdate,
}: {
  feedback: Feedback;
  onDelete: (id: number) => void;
  onUpdate: (id: number, field: keyof Feedback, value: string) => void;
}) => {
  const dateInputRef = useRef<HTMLInputElement>(null);

  const handleDateClick = () => {
    dateInputRef.current?.showPicker();
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    // Format: "Dec 31, 2025, 03:27 PM"
    const formattedDate = date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    onUpdate(feedback.id, "time", formattedDate);
  };

  return (
    <div className="pt-4 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold text-primary italic">MoreFeedbacks</h3>
        <button
          onClick={() => onDelete(feedback.id)}
          className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="text-xs font-bold text-mainText italic">
            Content <span className="text-red-500">*</span>
          </label>
          <textarea
            value={feedback.content}
            onChange={(e) => onUpdate(feedback.id, "content", e.target.value)}
            placeholder="Brief overview of the customer's question or request"
            className="w-full h-32 border border-stroke rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary placeholder:text-placeholder/50 resize-none bg-white"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-mainText italic">
            Time <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="w-full h-32 border border-stroke rounded-xl px-4 py-3 text-sm text-body italic bg-white flex items-start pt-3">
              <div className="flex items-center gap-2 text-body/70 w-full">
                <Clock className="w-4 h-4" />
                <span>{feedback.time || "Select Date & Time"}</span>
                <Calendar
                  onClick={handleDateClick}
                  className="w-4 h-4 text-primary ml-auto cursor-pointer hover:text-primary/80"
                />
                <input
                  ref={dateInputRef}
                  type="datetime-local"
                  onChange={handleDateChange}
                  className="invisible absolute inset-0 w-0 h-0"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeedbacksTab = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  const handleAddFeedback = () => {
    setFeedbacks([...feedbacks, { id: Date.now(), content: "", time: "" }]);
  };

  const handleDeleteFeedback = (id: number) => {
    setFeedbacks(feedbacks.filter((f) => f.id !== id));
  };

  const handleUpdateFeedback = (
    id: number,
    field: keyof Feedback,
    value: string,
  ) => {
    setFeedbacks(
      feedbacks.map((f) => (f.id === id ? { ...f, [field]: value } : f)),
    );
  };

  return (
    <div className="space-y-8">
      <h3 className="text-xl font-bold text-primary italic mb-6">Feed Backs</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="text-xs font-bold text-mainText italic flex items-center gap-1">
            <div className="w-3 h-3 border border-mainText flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-transparent" />
            </div>
            Customer Inquiry <span className="text-red-500">*</span>
          </label>
          <textarea
            placeholder="Brief overview of the customer's question or request"
            className="w-full h-32 border border-stroke rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary placeholder:text-placeholder/50 resize-none bg-white"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-mainText italic flex items-center gap-1">
            <Target className="w-3 h-3" />
            Exact request
          </label>
          <textarea
            placeholder="Verbatim details of what the customer asked"
            className="w-full h-32 border border-stroke rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary placeholder:text-placeholder/50 resize-none bg-white"
          />
        </div>
      </div>

      <div className="space-y-2 relative">
        <div className="flex justify-between items-center">
          <label className="text-xs font-bold text-mainText italic flex items-center gap-1">
            <CheckSquare className="w-3 h-3" />
            Moderation feedback
          </label>
          <div className="flex items-center gap-1 text-xs text-body italic opacity-70">
            <Clock className="w-3 h-3" />
            <span>Dec 31, 2025, 03:27 PM</span>
          </div>
        </div>
        <textarea
          placeholder="Notes or feedback from the moderation"
          className="w-full h-24 border border-stroke rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary placeholder:text-placeholder/50 resize-none bg-white"
        />
      </div>

      {/* Dynamic Feedbacks */}
      {feedbacks.map((feedback) => (
        <FeedbackItem
          key={feedback.id}
          feedback={feedback}
          onDelete={handleDeleteFeedback}
          onUpdate={handleUpdateFeedback}
        />
      ))}

      <div className="pt-4">
        <button
          onClick={handleAddFeedback}
          className="px-6 py-3 rounded-lg border border-dashed border-primary text-primary font-bold italic hover:bg-blue-50 transition-colors w-auto flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add new feedback
        </button>
      </div>
    </div>
  );
};

export default FeedbacksTab;
