"use strict";
"use client";
import React, { useEffect, useState } from "react";
import Header from "../header";
import { Plus, Trash2, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getDealStages,
  getDeals,
  deleteDealStage,
  getDealStage,
} from "@/lib/api";
import DealCard from "@/components/crm/DealCard";
import DealStageModal from "@/components/modals/DealStageModal";
import AddDealModal from "@/components/modals/AddDealModal";
import DeleteStageModal from "@/components/modals/DeleteStageModal";
import DealDetailsSidebar from "@/components/crm/DealDetailsSidebar";
import { Toaster, toast } from "react-hot-toast";

interface Deal {
  id: number;
  name: string;
  amount: number | string;
  deal_stage_id: number;
  owner?: { name: string };
  service?: { name: string };
  deal_stage?: { title: string; color: string };
}

interface Stage {
  id: number;
  title: string;
  percentage: number;
  color: string;
}

const DealsPage = () => {
  const [stages, setStages] = useState<Stage[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isAddDealModalOpen, setIsAddDealModalOpen] = useState(false);
  const [isStageModalOpen, setIsStageModalOpen] = useState(false);
  const [editingStage, setEditingStage] = useState<any>(null);
  const [selectedStageForDeal, setSelectedStageForDeal] = useState<
    number | undefined
  >(undefined);

  // Multi-select delete state
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedStageIds, setSelectedStageIds] = useState<number[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedDealId, setSelectedDealId] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [stagesData, dealsData] = await Promise.all([
        getDealStages(),
        getDeals(),
      ]);
      setStages(stagesData);
      // Ensure deals is an array
      setDeals(Array.isArray(dealsData) ? dealsData : dealsData.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load deals data");
    } finally {
      setLoading(false);
    }
  };

  const getDealsByStage = (stageId: number) => {
    return deals.filter((deal) => deal.deal_stage_id === stageId);
  };

  const calculateTotalAmount = (stageDeals: Deal[]) => {
    return stageDeals.reduce((sum, deal) => sum + Number(deal.amount || 0), 0);
  };

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

  const handleCreateStage = () => {
    setEditingStage(null);
    setIsStageModalOpen(true);
  };

  const handleEditStage = async (id: number) => {
    try {
      const stageData = await getDealStage(id);
      setEditingStage(stageData);
      setIsStageModalOpen(true);
    } catch (error) {
      console.error("Error fetching stage details:", error);
    }
  };

  const handleAddNewDeal = (stageId?: number) => {
    setSelectedStageForDeal(stageId);
    setIsAddDealModalOpen(true);
  };

  const handleDealClick = (id: number) => {
    setSelectedDealId(id);
    setIsSidebarOpen(true);
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
      const promises = selectedStageIds.map((id) => deleteDealStage(id));
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
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-10">
      <Header Links={true} />
      <div className="px-[3%] pt-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold italic text-mainText">Deals</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={handleCreateStage}
              className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold italic text-sm hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> New stage
            </button>
            <button
              onClick={toggleSelectMode}
              className={cn(
                "px-5 py-2.5 rounded-xl font-bold italic text-sm transition-colors shadow-lg flex items-center gap-2",
                "bg-[#EF4444] text-white hover:bg-[#DC2626] shadow-red-500/20",
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
              const stageDeals = getDealsByStage(stage.id);
              const totalAmount = calculateTotalAmount(stageDeals);

              // Map color names to Tailwind colors or hex
              const colorMap: Record<string, string> = {
                white: "#3B82F6", // defaulting white from API to blue for the circle/bar if it's "new deal"
                red: "#ff0000",
                lime: "#EDDA2E",
                yellow: "#EDDA2E",
              };

              const stageColor =
                colorMap[stage.color] || stage.color || "#3B82F6";

              return (
                <div
                  key={stage.id}
                  className="min-w-[350px] flex-1 flex flex-col h-full relative"
                >
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
                      "bg-white/40 rounded-2xl p-6 shadow-sm border border-transparent h-full flex flex-col transition-all duration-200",
                      isSelectMode && selectedStageIds.includes(stage.id)
                        ? "border-[#EF4444]"
                        : "",
                    )}
                    style={{ backgroundColor: `${stageColor}15` }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: stageColor }}
                        />
                        <h3 className="font-bold italic text-mainText text-lg">
                          {stage.title}
                        </h3>
                        <span
                          className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold italic"
                          style={{
                            backgroundColor: `${stageColor}30`,
                            color: stageColor,
                          }}
                        >
                          {stageDeals.length}
                        </span>
                        <button
                          onClick={() => handleEditStage(stage.id)}
                          className="p-1 hover:bg-black/5 rounded-full transition-colors ml-1"
                        >
                          <MoreHorizontal className="w-3.5 h-3.5 text-gray-400 hover:text-primary" />
                        </button>
                      </div>

                      <button
                        onClick={() => handleAddNewDeal(stage.id)}
                        className="w-6 h-6 rounded flex items-center justify-center text-white transition-colors hover:opacity-90 shadow-sm"
                        style={{ backgroundColor: stageColor }}
                      >
                        <Plus className="w-4 h-4 text-white" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2 w-1/3">
                        <span className="text-[12px] text-gray-500 font-bold italic">
                          {stage.percentage}%
                        </span>
                        <div className="w-full bg-gray-300/40 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${stage.percentage}%`,
                              backgroundColor: stageColor,
                            }}
                          />
                        </div>
                      </div>
                      <span className="text-[12px] text-mainText font-black italic">
                        EGP {totalAmount.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex-1 space-y-4 min-h-[300px]">
                      {stageDeals.length > 0 ? (
                        stageDeals.map((deal) => (
                          <DealCard
                            key={deal.id}
                            deal={{
                              ...deal,
                              deal_stage: {
                                title: stage.title,
                                color: stage.color,
                              },
                            }}
                            onClick={handleDealClick}
                          />
                        ))
                      ) : (
                        <div className="h-full min-h-[200px] flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/30">
                          <p className="text-sm font-medium text-gray-400 italic">
                            No deals in this stage
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <AddDealModal
        isOpen={isAddDealModalOpen}
        onClose={() => setIsAddDealModalOpen(false)}
        onSuccess={fetchData}
        initialStageId={selectedStageForDeal}
      />
      <DealStageModal
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

      <DealDetailsSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        dealId={selectedDealId}
        onSuccess={fetchData}
      />

      <Toaster position="top-right" />
    </div>
  );
};

export default DealsPage;
