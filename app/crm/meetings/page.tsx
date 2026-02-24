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
    <>
      <Toaster position="top-right" />
      <Header Links={true} />
      <div className="pb-12 px-[3%] pt-8">
        <div className="mb-6">
          <h2 className="text-[1.5rem] font-bold text-mainText italic mb-6">
            Meetings
          </h2>
          <div className="bg-white rounded-[24px] p-6 flex items-center justify-between border border-[#F1F5F9]">
            <div className="flex items-center gap-4 flex-1 max-w-[500px]">
              <div className="flex items-center border border-[#F1F5F9] p-3 bg-white gap-2 rounded-2xl flex-1 focus-within:border-primary transition-colors">
                <Search className="text-placeholder w-[18px] h-[18px]" />
                <input
                  type="text"
                  className="flex-1 border-none outline-none text-placeholder h-full bg-transparent text-sm italic"
                  placeholder="Search Meetings.."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="outline-none hover:opacity-80 transition-opacity">
                    <HiViewColumns className="text-body text-[2rem] cursor-pointer" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-[200px] p-2 bg-white rounded-xl shadow-xl border border-stroke"
                >
                  {initialColumns.map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.key}
                      className="capitalize text-body italic text-sm rounded-lg"
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
              <div className="relative min-w-[160px]">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full bg-white border border-[#F1F5F9] rounded-2xl px-5 py-3 text-sm text-body italic outline-none focus:border-primary cursor-pointer appearance-none"
                >
                  <option value="">All Meetings</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="canceled">Canceled</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-body pointer-events-none" />
              </div>

              <button
                onClick={() => setIsScheduleMeetingModalOpen(true)}
                className="flex items-center text-white rounded-2xl bg-primary py-3 px-8 gap-2 hover:bg-primary/90 transition-all font-bold italic shadow-lg shadow-primary/30 text-sm"
              >
                <Plus className="w-4 h-4" />
                Create Meetings
              </button>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-body italic opacity-60">
            Total Records {totalResults}
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
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-stroke border-dashed">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Calendar className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-body italic font-medium">No Meetings Yet</p>
            </div>
          }
          bulkActions={(selectedIds, clearSelection) => (
            <button
              onClick={() => handleBulkDelete(selectedIds, clearSelection)}
              className="flex items-center gap-2 px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-xs font-bold italic"
            >
              <Trash2 className="w-3.5 h-3.5 text-white" />
              Delete Selected
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
    </>
  );
};

export default MeetingsPage;
