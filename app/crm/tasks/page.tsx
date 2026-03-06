"use strict";
"use client";
import React, { useEffect, useState } from "react";
import Header from "../header";
import {
  Plus,
  GripVertical,
  Calendar,
  Clock,
  MoreHorizontal,
  User,
  Paperclip,
  MessageSquare,
  Pencil,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getTaskStages,
  getTasks,
  getTaskStage,
  deleteTaskStage,
} from "@/lib/api";
import AddTaskModal from "@/components/modals/AddTaskModal";
import TaskStageModal from "@/components/modals/TaskStageModal";
import DeleteStageModal from "@/components/modals/DeleteStageModal";
import TaskDetailsSidebar from "@/components/sidebars/TaskDetailsSidebar";
import { Toaster, toast } from "react-hot-toast";

interface Task {
  id: number;
  user_id: number;
  lead_id: number;
  task_stage_id: number;
  title: string;
  description: string;
  started_at: string;
  ended_at: string;
  created_at: string;
}

interface Stage {
  id: number;
  title: string;
}

const TasksPage = () => {
  const [stages, setStages] = useState<Stage[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isStageModalOpen, setIsStageModalOpen] = useState(false);
  const [editingStage, setEditingStage] = useState<any>(null);

  // Multi-select delete state

  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedStageIds, setSelectedStageIds] = useState<number[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Sidebar state
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [stagesData, tasksData] = await Promise.all([
        getTaskStages(),
        getTasks(),
      ]);
      setStages(stagesData as any);
      setTasks(tasksData as any);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Selection handlers
  const toggleSelectMode = () => {
    if (isSelectMode) {
      if (selectedStageIds.length > 0) {
        setIsDeleteModalOpen(true);
      } else {
        setIsSelectMode(false);
        setSelectedStageIds([]);
      }
    } else {
      setIsSelectMode(true);
    }
  };

  const toggleStageSelection = (id: number) => {
    if (selectedStageIds.includes(id)) {
      setSelectedStageIds(selectedStageIds.filter((sid) => sid !== id));
    } else {
      setSelectedStageIds([...selectedStageIds, id]);
    }
  };

  const handleDeleteStages = async () => {
    setIsDeleting(true);
    try {
      // Loop through selected IDs and delete each one
      const promises = selectedStageIds.map((id) => deleteTaskStage(id));
      await Promise.all(promises);

      toast.success(`Deleted ${selectedStageIds.length} stage(s) successfully`);
      setIsSelectMode(false);
      setSelectedStageIds([]);
      fetchData();
    } catch (error) {
      console.error("Error deleting stages:", error);
      toast.error("Failed to delete some stages");
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  const handleCreateStage = () => {
    setEditingStage(null);
    setIsStageModalOpen(true);
  };

  const handleEditStage = async (id: number) => {
    try {
      const stageData = await getTaskStage(id);
      setEditingStage(stageData);
      setIsStageModalOpen(true);
    } catch (error) {
      console.error("Error fetching stage details:", error);
    }
  };

  const handleTaskClick = (taskId: number) => {
    if (isSelectMode) return; // Don't open sidebar if selecting stages
    setSelectedTaskId(taskId);
    setIsSidebarOpen(true);
  };

  const getTasksByStage = (stageId: number) => {
    return tasks.filter((task) => task.task_stage_id === stageId);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className=" min-h-screen pb-10">
      <div className="px-[3%] pt-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold italic text-mainText">Tasks</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={handleCreateStage}
              className="px-5 py-2.5 rounded-xl border border-primary text-primary font-bold italic text-sm hover:bg-primary/5 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Create stage
            </button>
            <button
              onClick={() => setIsAddTaskModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold italic text-sm hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> New task
            </button>
            <button
              onClick={toggleSelectMode}
              className={cn(
                "px-5 py-2.5 rounded-xl font-bold italic text-sm transition-colors shadow-lg flex items-center gap-2",
                isSelectMode
                  ? "bg-[#EF4444] text-white hover:bg-[#DC2626] shadow-red-500/20"
                  : "bg-[#EF4444] text-white hover:bg-[#DC2626] shadow-red-500/20",
              )}
            >
              {isSelectMode && selectedStageIds.length > 0
                ? `Delete (${selectedStageIds.length})`
                : "Delete stage"}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="flex gap-6 overflow-x-auto py-4 scrollbar-hide px-2">
            {stages.map((stage) => {
              const stageTasks = getTasksByStage(stage.id);
              return (
                <div
                  key={stage.id}
                  className="min-w-[400px] flex-1 flex flex-col h-full relative"
                >
                  {/* Selection Overlay/Click Handler */}
                  {isSelectMode && (
                    <div
                      onClick={() => toggleStageSelection(stage.id)}
                      className={cn(
                        "absolute inset-0 z-10 rounded-2xl cursor-pointer transition-all duration-200",
                        selectedStageIds.includes(stage.id)
                          ? "ring-2 ring-[#EF4444] shadow-[0_0_15px_rgba(239,68,68,0.5)] bg-[#EF4444]/5"
                          : "hover:bg-black/5 bg-white/60",
                      )}
                    />
                  )}

                  <div
                    className={cn(
                      "bg-white rounded-2xl p-4 shadow-sm border border-[#F1F5F9] h-full flex flex-col transition-all duration-200",
                      isSelectMode && selectedStageIds.includes(stage.id)
                        ? "border-[#EF4444]"
                        : "",
                    )}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold italic text-mainText text-lg">
                          {stage.title}
                        </h3>
                        <button
                          onClick={() => handleEditStage(stage.id)}
                          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5 text-gray-400 hover:text-primary" />
                        </button>
                      </div>
                      <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2.5 py-1 rounded-full italic">
                        {stageTasks.length}
                      </span>
                    </div>

                    <div className="flex-1 space-y-3 min-h-[200px]">
                      {stageTasks.length > 0 ? (
                        stageTasks.map((task) => (
                          <div
                            key={task.id}
                            className="bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-xl hover:border-primary/50 transition-colors cursor-pointer group relative"
                          >
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleTaskClick(task.id);
                                }}
                                className="p-1 hover:bg-gray-200 rounded-full"
                              >
                                <MoreHorizontal className="w-4 h-4 text-gray-500" />
                              </button>
                            </div>

                            <div className="flex items-start justify-between mb-3 pr-6">
                              <h4 className="font-bold text-mainText text-sm line-clamp-2 italic leading-relaxed">
                                {task.title}
                              </h4>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 mb-4">
                              {/* Display specific tags or badges if data available, placeholder for now based on image */}
                              <span className="px-2 py-1 bg-[#FEF9C3] text-[#CA8A04] text-[10px] font-bold rounded-lg border border-[#FEF08A] italic">
                                Received
                              </span>
                              <span className="text-[10px] text-gray-400 italic">
                                1d
                              </span>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                              <div className="flex items-center gap-2 text-xs text-gray-500 italic">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>{formatDate(task.started_at)}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                {/* If user avatar exists */}
                                {/* <div className="w-6 h-6 rounded-full bg-gray-200 border border-white"></div> */}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="h-full min-h-[200px] flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50">
                          <p className="text-sm font-medium text-gray-400 italic">
                            No tasks yet
                          </p>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => setIsAddTaskModalOpen(true)}
                      className="w-full mt-4 py-3 border border-dashed border-gray-200 rounded-xl text-gray-400 text-sm font-bold italic hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2 bg-gray-50/50 hover:bg-primary/5"
                    >
                      <Plus className="w-4 h-4" /> Add task
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => {
          setIsAddTaskModalOpen(false);
          fetchData(); // Refresh list after adding
        }}
        leadName="" // Can be empty or general context
      />
      <TaskStageModal
        isOpen={isStageModalOpen}
        onClose={() => setIsStageModalOpen(false)}
        initialData={editingStage}
        onSuccess={fetchData}
      />
      <DeleteStageModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteStages}
        count={selectedStageIds.length}
        isLoading={isDeleting}
      />
      <TaskDetailsSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        taskId={selectedTaskId}
        onUpdate={fetchData}
      />
      <Toaster position="top-right" />
    </div>
  );
};

export default TasksPage;
