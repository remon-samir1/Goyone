"use client";

import React, { useState, useEffect } from "react";
import Table, { TableColumn } from "@/components/Table/Table";
import {
  ListFilter,
  Plus,
  Search,
  Phone,
  Settings,
  User,
  FileText,
  Clock,
  ChevronDown,
  Trash2,
} from "lucide-react";
import { HiViewColumns } from "react-icons/hi2";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Header from "../header";
import { getCalls } from "@/lib/api";
import { toast, Toaster } from "react-hot-toast";
import LogCallModal from "@/components/modals/LogCallModal";
import { cn } from "@/lib/utils";

interface CallData {
  id: string;
  subject: string;
  contact: string;
  startTime: string;
  status: string;
  phoneNumber: string;
  host: string;
}

const CallsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [calls, setCalls] = useState<CallData[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isLogCallModalOpen, setIsLogCallModalOpen] = useState(false);

  const initialColumns: TableColumn<CallData>[] = [
    { key: "subject", label: "Subject", sortable: true },
    { key: "contact", label: "Contact", sortable: true },
    { key: "startTime", label: "Start time", sortable: true },
    {
      key: "status",
      label: "Call Status",
      sortable: true,
      render: (value) => (
        <span
          className={cn(
            "capitalize",
            value === "completed"
              ? "text-green-500"
              : value === "missed"
                ? "text-red-500"
                : "text-blue-500",
          )}
        >
          {value}
        </span>
      ),
    },
    {
      key: "phoneNumber",
      label: "Phone Number",
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <span>{value}</span>
          <Phone className="h-4 w-4 text-body opacity-50" />
        </div>
      ),
    },
    { key: "host", label: "Host", sortable: true },
  ];

  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(initialColumns.map((col) => col.key)),
  );

  const toggleColumnVisibility = (key: string) => {
    const newVisible = new Set(visibleColumns);
    if (newVisible.has(key)) {
      newVisible.delete(key);
    } else {
      newVisible.add(key);
    }
    setVisibleColumns(newVisible);
  };

  const columns = initialColumns.filter((col) => visibleColumns.has(col.key));

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchCalls = async (
    page: number,
    search: string = "",
    status: string = "",
  ) => {
    setLoading(true);
    try {
      const response = await getCalls({ page, search, status });
      const data = response?.data || [];
      const total = response?.total || 0;

      const mappedData: CallData[] = data.map((item: any) => ({
        id: item?.id?.toString() || "",
        subject: item?.subject || "No Subject",
        contact: item?.lead?.full_name || item?.lead?.name || "N/A",
        startTime: item?.start_time || "N/A",
        status: item?.status || "Completed",
        phoneNumber: item?.phone_number || "N/A",
        host: item?.user?.name || "N/A",
      }));

      setCalls(mappedData);
      setTotalResults(total || mappedData.length);
    } catch (error) {
      console.error("Error fetching calls:", error);
      toast.error("Failed to fetch calls");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    } else {
      fetchCalls(1, debouncedSearch, selectedStatus);
    }
  }, [debouncedSearch, selectedStatus]);

  useEffect(() => {
    fetchCalls(currentPage, debouncedSearch, selectedStatus);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleBulkDelete = async (
    ids: string[],
    clearSelection: () => void,
  ) => {
    const toastId = toast.loading(`Deleting ${ids.length} calls...`);
    try {
      const { deleteCall } = await import("@/lib/api");
      await Promise.all(ids.map((id) => deleteCall(id)));
      toast.success(`${ids.length} calls deleted successfully`, {
        id: toastId,
      });
      clearSelection();
      fetchCalls(currentPage, debouncedSearch);
    } catch (error) {
      console.error("Error bulk deleting calls:", error);
      toast.error("Failed to delete some calls", { id: toastId });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight italic text-mainText">
            Calls
          </h1>
          <p className="text-placeholder mt-1 font-medium">
            Track and manage your communication history
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => setIsLogCallModalOpen(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-md border border-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all font-semibold"
          >
            <Plus className="w-4 h-4" /> <span>Create Call</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-stroke/20">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4 flex-1 max-w-2xl">
            <div className="flex items-center border border-stroke/30 p-2.5 bg-background/30 gap-3 rounded-lg flex-1 focus-within:border-primary/50 focus-within:bg-white transition-all group">
              <Search className="text-placeholder w-4 h-4 group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                className="flex-1 border-none outline-none text-mainText bg-transparent text-sm font-medium placeholder:text-placeholder"
                placeholder="Search by subject or contact..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center justify-center w-11 h-11 rounded-lg border border-stroke/30 hover:bg-gray-50 transition-all group">
                  <HiViewColumns className="text-placeholder text-xl group-hover:text-mainText" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-52 p-2 bg-white rounded-xl shadow-2xl border border-stroke/20"
              >
                <div className="px-2 py-1.5 text-xs font-bold text-placeholder uppercase tracking-wider">
                  Visible Columns
                </div>
                {initialColumns.map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.key}
                    className="capitalize text-sm font-medium rounded-lg py-2 cursor-pointer"
                    checked={visibleColumns.has(column.key)}
                    onCheckedChange={() => toggleColumnVisibility(column.key)}
                  >
                    {column.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative min-w-[180px]">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full bg-background/30 border border-stroke/30 rounded-lg px-4 py-2.5 text-sm font-semibold text-mainText outline-none focus:border-primary/50 cursor-pointer appearance-none hover:bg-white transition-all shadow-sm"
              >
                <option value="">All Statuses</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Completed">Completed</option>
                <option value="Canceled">Canceled</option>
                <option value="Missed">Missed</option>
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-placeholder pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-placeholder">
          <span className="text-mainText">{totalResults}</span> total calls
          recorded
        </p>
      </div>

      <Table
        data={calls}
        columns={columns}
        idKey="id"
        loading={loading}
        pagination={{
          currentPage,
          totalResults,
          resultsPerPage: 10,
          onPageChange: handlePageChange,
        }}
        emptyState={
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-20 h-20 bg-background/50 rounded-full flex items-center justify-center border border-stroke/10 shadow-inner">
              <Phone className="w-10 h-10 text-placeholder opacity-20" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-lg font-bold text-mainText italic">
                No Calls Found
              </p>
              <p className="text-sm text-placeholder font-medium">
                Try adjusting your search or filters
              </p>
            </div>
          </div>
        }
        bulkActions={(selectedIds, clearSelection) => (
          <button
            onClick={() => handleBulkDelete(selectedIds, clearSelection)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all text-xs font-bold shadow-lg shadow-red-500/20"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete {selectedIds.length} Selected</span>
          </button>
        )}
      />

      <LogCallModal
        isOpen={isLogCallModalOpen}
        onClose={() => {
          setIsLogCallModalOpen(false);
          fetchCalls(currentPage, debouncedSearch, selectedStatus);
        }}
      />
    </div>
  );
};

// Helper function found in other files (not needed if using cn from lib/utils)
// const cn = (...classes: any[]) => classes.filter(Boolean).join(" ");

export default CallsPage;
