"use client";

import React, { useEffect, useState } from "react";
import { X, Calendar, Edit2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getTask,
  updateTask,
  deleteTask,
  getTaskStages,
  getStatuses,
} from "@/lib/api";
import { toast } from "react-hot-toast";

interface TaskDetailsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: number | null;
  onUpdate: () => void;
}

const TaskDetailsSidebar: React.FC<TaskDetailsSidebarProps> = ({
  isOpen,
  onClose,
  taskId,
  onUpdate,
}) => {
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    task_stage_id: "",
    status: "",
    started_at: "",
    description: "",
  });
  const [stages, setStages] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [stagesData, statusesData] = await Promise.all([
          getTaskStages(),
          getStatuses(),
        ]);
        setStages(stagesData);
        setStatuses(statusesData);
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };
    fetchOptions();
  }, []);

  useEffect(() => {
    if (isOpen && taskId) {
      fetchTaskDetails(taskId);
      setIsEditing(false); // Reset to view mode when opening
    } else {
      setTask(null);
      setFormData({
        title: "",
        task_stage_id: "",
        status: "",
        started_at: "",
        description: "",
      });
      setIsEditing(false);
    }
  }, [isOpen, taskId]);

  const fetchTaskDetails = async (id: number) => {
    setLoading(true);
    try {
      const data = await getTask(id);
      setTask(data);
      setFormData({
        title: data.title || "",
        task_stage_id: data.task_stage_id || "",
        status: data.status?.id || data.status || "", // Handle object or value
        started_at: data.started_at
          ? new Date(data.started_at).toISOString().split("T")[0]
          : "",
        description: data.description || "",
      });
    } catch (error) {
      console.error("Error fetching task:", error);
      toast.error("Failed to load task details");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!taskId) return;
    setIsSaving(true);
    try {
      await updateTask(taskId, formData);
      toast.success("Task updated successfully");
      onUpdate();
      setIsEditing(false); // Switch back to view mode after save
      // Refresh local task data to reflect changes in view mode
      fetchTaskDetails(taskId);
    } catch (error: any) {
      console.error("Error updating task:", error);
      toast.error(error.response?.data?.message || "Failed to update task");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!taskId) return;
    if (!confirm("Are you sure you want to delete this task?")) return;

    setIsDeleting(true);
    try {
      await deleteTask(taskId);
      toast.success("Task deleted successfully");
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/20 backdrop-blur-sm z-[9998] transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-full max-w-[500px] bg-white z-[9999] shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold italic text-mainText">
            Task Details
          </h2>
          <div className="flex items-center gap-2">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Edit Task"
              >
                <Edit2 className="w-5 h-5 text-gray-400 hover:text-primary" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              {/* Task Title */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-500 italic">
                  Task Title
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[#F8FAFC] rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-mainText font-medium"
                    placeholder="Task title"
                  />
                ) : (
                  <p className="text-lg font-medium text-mainText px-1">
                    {task?.title}
                  </p>
                )}
              </div>

              {/* Stage */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-500 italic">
                  Stage
                </label>
                {isEditing ? (
                  <select
                    name="task_stage_id"
                    value={formData.task_stage_id}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[#F8FAFC] rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-mainText font-medium appearance-none"
                  >
                    <option value="">Select Stage</option>
                    {stages.map((stage) => (
                      <option key={stage.id} value={stage.id}>
                        {stage.title}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-mainText font-medium px-1">
                    {stages.find((s) => s.id == task?.task_stage_id)?.title ||
                      "Unknown Stage"}
                  </p>
                )}
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-500 italic">
                  Status
                </label>
                {isEditing ? (
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[#F8FAFC] rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-mainText font-medium appearance-none"
                  >
                    <option value="">Select Status</option>
                    {statuses.length > 0 ? (
                      statuses.map((status: any) => (
                        <option
                          key={status.id || status}
                          value={status.id || status}
                        >
                          {status.name || status}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="received">Received</option>
                      </>
                    )}
                  </select>
                ) : (
                  <div className="px-1">
                    <span className="inline-block px-3 py-1 bg-[#FEF9C3] text-[#CA8A04] text-xs font-bold rounded-lg border border-[#FEF08A] italic">
                      {statuses.find((s) => (s.id || s) == task?.status)
                        ?.name ||
                        task?.status?.name ||
                        task?.status ||
                        "Pending"}
                    </span>
                  </div>
                )}
              </div>

              {/* Due Date */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-500 italic">
                  Due Date
                </label>
                {isEditing ? (
                  <div className="relative">
                    <input
                      type="date"
                      name="started_at"
                      value={formData.started_at}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[#F8FAFC] rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-mainText font-medium"
                    />
                    <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                ) : (
                  <p className="text-mainText font-medium px-1 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {task?.started_at
                      ? new Date(task.started_at).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "No due date"}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-500 italic">
                  Description
                </label>
                {isEditing ? (
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-[#F8FAFC] rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-mainText font-medium resize-none"
                    placeholder="Add a description..."
                  />
                ) : (
                  <p className="text-mainText font-medium px-1 whitespace-pre-wrap">
                    {task?.description || "No description provided."}
                  </p>
                )}
              </div>

              {/* Created info */}
              {task && !isEditing && (
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-400 italic">
                    Created {new Date(task.created_at).toLocaleDateString()}
                  </p>
                </div>
              )}

              {/* Delete Button */}
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="w-full mt-8 py-3 rounded-xl bg-[#EF4444] text-white font-bold italic hover:bg-[#DC2626] transition-colors shadow-lg shadow-red-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDeleting ? "Deleting..." : "Delete Task"}
              </button>
            </>
          )}
        </div>

        <div className="p-6 border-t border-gray-100 bg-white flex items-center gap-4">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 py-3 rounded-full border border-gray-200 text-gray-600 font-bold italic hover:bg-gray-50 transition-colors"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 py-3 rounded-full bg-primary text-white font-bold italic hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="w-full py-3 rounded-full border border-gray-200 text-gray-600 font-bold italic hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default TaskDetailsSidebar;
