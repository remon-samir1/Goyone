"use client";

import React, { useState, useEffect } from "react";
import Table, { TableColumn } from "@/components/Table/Table";
import {
  ListFilter,
  Plus,
  Search,
  Calendar,
  Settings,
  User,
  FileText,
  Clock,
  ChevronDown,
  Trash2,
  MapPin,
  CircleDollarSign,
} from "lucide-react";
import { HiViewColumns } from "react-icons/hi2";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Header from "../header";
import { getMeetings, deleteMeeting } from "@/lib/api";
import { toast, Toaster } from "react-hot-toast";
import ScheduleMeetingModal from "@/components/modals/ScheduleMeetingModal";
import { cn } from "@/lib/utils";

interface MeetingData {
  id: string;
  title: string;
  value: string;
  location: string;
  from: string;
  to: string;
  host: string;
  description: string;
}

const MeetingsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [meetings, setMeetings] = useState<MeetingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isScheduleMeetingModalOpen, setIsScheduleMeetingModalOpen] =
    useState(false);

  const initialColumns: TableColumn<MeetingData>[] = [
    { key: "title", label: "Title", sortable: true },
    {
      key: "value",
      label: "Value",
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <span className="capitalize">{value}</span>
          <CircleDollarSign className="h-4 w-4 text-body opacity-50" />
        </div>
      ),
    },
    {
      key: "location",
      label: "Location",
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <span>{value}</span>
          <MapPin className="h-4 w-4 text-body opacity-50" />
        </div>
      ),
    },
    { key: "from", label: "From", sortable: true },
    { key: "to", label: "To", sortable: true },
    { key: "host", label: "Host", sortable: true },
    {
      key: "description",
      label: "Description",
      sortable: true,
      render: (value) => <p className="max-w-[200px] truncate">{value}</p>,
    },
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

  const fetchMeetings = async (
    page: number,
    search: string = "",
    status: string = "",
  ) => {
    setLoading(true);
    try {
      const response = await getMeetings({ page, search, status });

      if (!response) {
        toast.error("No response received from the server");
        setMeetings([]);
        setTotalResults(0);
        return;
      }

      const data = response.data || response || [];
      const dataArray = Array.isArray(data) ? data : [];

      const mappedData: MeetingData[] = dataArray.map((item: any) => ({
        id: item?.id?.toString() || "",
        title: item?.title || "No Title",
        value: item?.value || "Medium",
        location: item?.location || "Online",
        from: item?.from || "N/A",
        to: item?.to || "N/A",
        host: item?.user?.name || "N/A",
        description: item?.description || "N/A",
      }));

      setMeetings(mappedData);
      setTotalResults(
        response.total || response.meta?.total || mappedData.length,
      );
    } catch (error: any) {
      console.error("Error fetching meetings:", error);
      const errorMessage = error?.message || "Failed to fetch meetings";
      toast.error(errorMessage);
      setMeetings([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    } else {
      fetchMeetings(1, debouncedSearch, selectedStatus);
    }
  }, [debouncedSearch, selectedStatus]);

  useEffect(() => {
    fetchMeetings(currentPage, debouncedSearch, selectedStatus);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleBulkDelete = async (
    ids: string[],
    clearSelection: () => void,
  ) => {
    const toastId = toast.loading(`Deleting ${ids.length} meetings...`);
    try {
      await Promise.all(ids.map((id) => deleteMeeting(id)));
      toast.success(`${ids.length} meetings deleted successfully`, {
        id: toastId,
      });
      clearSelection();
      fetchMeetings(currentPage, debouncedSearch, selectedStatus);
    } catch (error: any) {
      console.error("Error bulk deleting meetings:", error);
      const errorMessage = error?.message || "Failed to delete some meetings";
      toast.error(errorMessage, { id: toastId });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight italic text-mainText">
            Meetings
          </h1>
          <p className="text-placeholder mt-1 font-medium">
            Coordinate and manage your scheduled sessions
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => setIsScheduleMeetingModalOpen(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-md border border-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all font-semibold"
          >
            <Plus className="w-4 h-4" /> <span>Create Meeting</span>
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
                placeholder="Search by title or host..."
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
                <option value="">All Meetings</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="canceled">Canceled</option>
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-placeholder pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-placeholder">
          <span className="text-mainText">{totalResults}</span> total meetings
          scheduled
        </p>
      </div>

      <Table
        data={meetings}
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
              <Calendar className="w-10 h-10 text-placeholder opacity-20" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-lg font-bold text-mainText italic">
                No Meetings Found
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

      <ScheduleMeetingModal
        isOpen={isScheduleMeetingModalOpen}
        onClose={() => {
          setIsScheduleMeetingModalOpen(false);
          fetchMeetings(currentPage, debouncedSearch, selectedStatus);
        }}
      />
    </div>
  );
};

export default MeetingsPage;
