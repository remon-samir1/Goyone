"use client";

import Table, { TableColumn } from "@/components/Table/Table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import {
  Download,
  ListFilter,
  Plus,
  Search,
  Upload,
  Zap,
  Eye,
  Pencil,
  Send,
  User,
  Trash2,
  Phone,
  Link2,
  Users,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { HiViewColumns } from "react-icons/hi2";
import { Switch } from "@/components/ui/switch";
import ExportModal from "@/components/modals/ExportModal";
import ImportModal from "@/components/modals/ImportModal";
import FiltersModal from "@/components/modals/FiltersModal";
import Header from "../header";
import Link from "next/link";
import { Axios } from "@/components/Helpers/Axios";
import DeleteLeadModal from "@/components/modals/DeleteLeadModal";
import ConvertLeadModal from "@/components/modals/ConvertLeadModal";
import LogCallModal from "@/components/modals/LogCallModal";
import ScheduleMeetingModal from "@/components/modals/ScheduleMeetingModal";
import ChangeOwnerModal from "@/components/modals/ChangeOwnerModal";
import { deleteLead, getLead, updateLead } from "@/lib/api";
import { toast, Toaster } from "react-hot-toast";
import { LeadFormData } from "@/types/leadTypes";
import CreativeFilter from "@/components/crm/CreativeFilter";

// Define your data type
interface LeadData {
  id: string;
  serialNumber: string;
  date: string;
  time: string;
  fullName: string;
  status: string;
  companyName: string;
  leadSource: string;
  adId: string;
  channel: string;
  phoneNumber: string;
  phoneNumbers?: string;
  moderationFeedback: string;
  lastFeedback: string;
  communicated: boolean;
}

const IndividualAccountsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);
  const [selectedLeadForConversion, setSelectedLeadForConversion] =
    useState<LeadData | null>(null);
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<LeadData | null>(null);
  const [isLogCallModalOpen, setIsLogCallModalOpen] = useState(false);
  const [isScheduleMeetingModalOpen, setIsScheduleMeetingModalOpen] =
    useState(false);
  const [isChangeOwnerModalOpen, setIsChangeOwnerModalOpen] = useState(false);
  const [selectedLeadForActions, setSelectedLeadForActions] =
    useState<LeadData | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // State for fetched data
  const [leads, setLeads] = useState<LeadData[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const [communicationed, setCommunicationed] = useState(0);
  const [notcommunicationed, setNotcommunicationed] = useState(0);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Filters state
  const [filters, setFilters] = useState({
    seller_id: "",
    status_id: "",
    communicationed: "" as string | boolean,
    created_from: "",
    created_to: "",
    feedback_from: "",
    feedback_to: "",
  });

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchLeads = async (
    page: number,
    search: string = "",
    currentFilters = filters,
    currentSort = sortConfig,
  ) => {
    setLoading(true);
    try {
      let queryParams = `?page=${page}&get_converted=contacts`;
      if (search) queryParams += `&search=${encodeURIComponent(search)}`;

      if (currentSort) {
        queryParams += `&sort_by=${currentSort.key}&sort_order=${currentSort.direction}`;
      }

      if (currentFilters.seller_id)
        queryParams += `&seller_id=${currentFilters.seller_id}`;
      if (currentFilters.status_id)
        queryParams += `&status_id=${currentFilters.status_id}`;

      if (currentFilters.communicationed !== "") {
        const commValue =
          currentFilters.communicationed === true ||
          currentFilters.communicationed === "1"
            ? "1"
            : "0";
        queryParams += `&communicationed=${commValue}`;
      }

      if (currentFilters.created_from)
        queryParams += `&created_from=${currentFilters.created_from}`;
      if (currentFilters.created_to)
        queryParams += `&created_to=${currentFilters.created_to}`;
      if (currentFilters.feedback_from)
        queryParams += `&feedback_from=${currentFilters.feedback_from}`;
      if (currentFilters.feedback_to)
        queryParams += `&feedback_to=${currentFilters.feedback_to}`;

      const response = await Axios.get(`/leads${queryParams}`);

      // Log response to debug
      console.log("Fetched leads:", response.data);

      const data = response.data.data;
      const meta = response.data;
      console.log("Meta data:", meta);

      const mappedData: LeadData[] = data.map((item: any) => ({
        id: item.id.toString(),
        serialNumber: item.id.toString(),
        date: item.lead_source_type.created_at
          ? item.lead_source_type.created_at.split("T")[0]
          : "",
        time: item.lead_source_type.created_at
          ? item.lead_source_type.created_at.split("T")[1].split(".")[0]
          : "",
        fullName: item.full_name || "N/A",
        status: item.status?.name || "Potentiel",
        companyName: item.company_name || "",
        leadSource: item.lead_source_value || "",
        adId: item.ad_id || "",
        channel: item.channels?.name || item.channel || "",
        phoneNumber: item.phone || item.phone_number || "",
        moderationFeedback: item.moderation_feedback || "",
        lastFeedback: item.feedbacks[0]?.content || "",
        communicated: Boolean(item.communicated),
      }));

      setLeads(mappedData);
      setTotalResults(meta.all_count || 0);
      setCommunicationed(meta.communicationed_count || 0);
      setNotcommunicationed(meta.not_communicationed_count || 0);
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Reset to page 1 when search or filters change
    if (currentPage !== 1) {
      setCurrentPage(1);
    } else {
      fetchLeads(1, debouncedSearch, filters, sortConfig);
    }
  }, [debouncedSearch, filters, sortConfig]);

  useEffect(() => {
    fetchLeads(currentPage, debouncedSearch, filters, sortConfig);
  }, [currentPage]);

  // Define columns with custom render functions for status
  const columns: TableColumn<LeadData>[] = [
    { key: "serialNumber", label: "S.N", sortable: true },
    { key: "date", label: "Dated", sortable: true },
    { key: "time", label: "Time", sortable: true },
    {
      key: "fullName",
      label: "Full Name",
      sortable: true,
      render: (value) => {
        if (!value) return <span>-</span>;
        const displayValue =
          value.length > 20 ? `${value.slice(0, 20)}...` : value;
        return <span title={value}>{displayValue}</span>;
      },
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (value) => {
        const getStatusColor = (status: string) => {
          switch (status) {
            case "No Answered":
              return "text-red-500";
            case "Not Qualified":
              return "text-[#F59E0B]";
            case "Potentiel":
              return "text-blue-500";
            default:
              return "text-body";
          }
        };
        return <span className={getStatusColor(value)}>{value}</span>;
      },
    },
    {
      key: "companyName",
      label: "Company Name",
      sortable: true,
      render: (value) => {
        if (!value) return <span>-</span>;
        const displayValue =
          value.length > 20 ? `${value.slice(0, 20)}...` : value;
        return <span title={value}>{displayValue}</span>;
      },
    },
    {
      key: "leadSource",
      label: "Lead Sourse",
      sortable: true,
      render: (value) => {
        if (!value) return <span>-</span>;
        const displayValue =
          value.length > 20 ? `${value.slice(0, 20)}...` : value;
        return (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
            title={value}
          >
            {displayValue}
          </a>
        );
      },
    },
    {
      key: "adId",
      label: "Ad Id",
      sortable: true,
      render: (value) => {
        if (!value) return <span>-</span>;
        const displayValue =
          value.length > 20 ? `${value.slice(0, 20)}...` : value;
        return <span title={value}>{displayValue}</span>;
      },
    },
    {
      key: "channel",
      label: "Channel",
      sortable: true,
      render: (value) => {
        if (!value) return <span>-</span>;
        const displayValue =
          value.length > 20 ? `${value.slice(0, 20)}...` : value;
        return <span title={value}>{displayValue}</span>;
      },
    },
    {
      key: "phoneNumber",
      label: "Phone Number",
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <span>{value}</span>
          <Phone className="h-4 w-4 text-body" />
        </div>
      ),
    },
    {
      key: "moderationFeedback",
      label: "Moderation Feedback",
      sortable: true,
      render: (value) => {
        if (!value) return <span>-</span>;
        const displayValue =
          value.length > 20 ? `${value.slice(0, 20)}...` : value;
        return (
          <span className="italic text-body" title={value}>
            {displayValue}
          </span>
        );
      },
    },
    {
      key: "lastFeedback",
      label: "Last Feedback",
      sortable: true,
      render: (value) => {
        if (!value) return <span>-</span>;
        const displayValue =
          value.length > 20 ? `${value.slice(0, 20)}...` : value;
        return (
          <span className="italic text-body" title={value}>
            {displayValue}
          </span>
        );
      },
    },
    {
      key: "communicated",
      label: "Communicated",
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <Switch
            checked={Boolean(value)}
            onChange={() => handleCommunicationToggle(row)}
          />
          <span
            className={`text-[11px] font-bold italic min-w-[100px] ${
              value ? "text-primary" : "text-placeholder"
            }`}
          >
            {value ? "Communicated" : "Not Communicationed"}
          </span>
        </div>
      ),
    },
  ];

  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(columns.map((col) => col.key)),
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

  const visibleColumnsList = columns.filter((col) =>
    visibleColumns.has(col.key),
  );

  // Handle row actions
  const handleRowActions = (row: LeadData) => (
    <>
      <DropdownMenuItem
        className="gap-3 text-body font-medium cursor-pointer"
        onClick={() => {
          setSelectedLeadForConversion(row);
          setIsConvertModalOpen(true);
        }}
      >
        <Zap className="h-4 w-4 text-primary" />
        Convert
      </DropdownMenuItem>
      <DropdownMenuItem className="p-0">
        <Link
          href={`/crm/viewLead/${row.id}`}
          className="flex w-full items-center gap-3 px-2 py-1.5 text-body font-medium"
        >
          <Eye className="h-4 w-4" />
          View
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem className="p-0">
        <Link
          href={`/crm/editLead/${row.id}`}
          className="flex w-full items-center gap-3 px-2 py-1.5 text-body font-medium"
        >
          <Pencil className="h-4 w-4" />
          Edit
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem className="gap-3 text-body font-medium">
        <Send className="h-4 w-4" />
        Send Email
      </DropdownMenuItem>
      <DropdownMenuItem
        className="gap-3 text-body font-medium cursor-pointer"
        onClick={() => {
          setSelectedLeadForActions(row);
          setIsChangeOwnerModalOpen(true);
        }}
      >
        <User className="h-4 w-4" />
        Change Owner
      </DropdownMenuItem>
      <DropdownMenuItem className="gap-3 text-body font-medium">
        <Link2 className="h-4 w-4" />
        Copy URL
      </DropdownMenuItem>
      <DropdownMenuItem
        className="gap-3 text-red-500 focus:text-red-500 font-medium cursor-pointer"
        onClick={() => {
          setLeadToDelete(row);
          setIsDeleteModalOpen(true);
        }}
      >
        <Trash2 className="h-4 w-4" />
        Delete
      </DropdownMenuItem>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger className="gap-3 text-body font-medium pl-9 italic">
          More...
        </DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent className="p-2 min-w-[180px]">
            <DropdownMenuItem
              className="gap-3 text-body font-medium cursor-pointer"
              onClick={() => {
                setSelectedLeadForActions(row);
                setIsLogCallModalOpen(true);
              }}
            >
              <Phone className="h-4 w-4" />
              Create Call
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-3 text-body font-medium cursor-pointer"
              onClick={() => {
                setSelectedLeadForActions(row);
                setIsScheduleMeetingModalOpen(true);
              }}
            >
              <Users className="h-4 w-4" />
              Create Meeting
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
    </>
  );

  const handleCommunicationToggle = async (row: LeadData) => {
    const newStatus = !row.communicated;

    // Optimistically update UI
    setLeads((prev) =>
      prev.map((l) =>
        l.id === row.id ? { ...l, communicated: newStatus } : l,
      ),
    );

    try {
      // 1. Fetch full lead data to satisfy update API
      const response = await getLead(row.id);
      if (!response) {
        throw new Error("Failed to fetch lead data");
      }

      const lead = response.data || response;
      // 2. Prepare update data - Mirroring EditLeadPage mapping logic
      const updateData: LeadFormData = {
        first_name: lead.first_name || lead.full_name?.split(" ")[0] || "",
        last_name:
          lead.last_name || lead.full_name?.split(" ").slice(1).join(" ") || "",
        email: lead.email || "",
        phone_number: lead.phone_number || lead.phone || "",
        phone_country_code: lead.phone_country_code || "+20",
        company_name: lead.company_name || "",
        company_field: lead.company_field || "",
        company_phone: lead.company_phone || "",
        company_email: lead.company_email || "",
        communicationed: newStatus,
        converted: Boolean(lead.converted),
        is_active: Boolean(lead.is_active),
        uuid: lead.uuid || "",

        // Map nested objects to IDs
        status_id: lead.status_id
          ? Number(lead.status_id)
          : lead.status?.id
            ? Number(lead.status.id)
            : undefined,
        category_id: lead.category_id
          ? Number(lead.category_id)
          : lead.category?.id
            ? Number(lead.category.id)
            : undefined,
        service_id: lead.service_id
          ? Number(lead.service_id)
          : lead.service?.id
            ? Number(lead.service.id)
            : undefined,
        lead_source_type_id: lead.lead_source_type_id
          ? Number(lead.lead_source_type_id)
          : lead.lead_source_type?.id
            ? Number(lead.lead_source_type.id)
            : undefined,
        channels_id: lead.channels_id
          ? Number(lead.channels_id)
          : lead.channels?.id
            ? Number(lead.channels.id)
            : undefined,
        business_category_id: lead.business_category_id
          ? Number(lead.business_category_id)
          : 1,
        lead_source_value: lead.lead_source_value || "Direct",
        social_media: lead.social_media || [],
        avatar: lead.avatar || null,
      };

      // 3. Send update
      await updateLead(row.id, updateData);

      toast.success(`Communicated status updated for ${row.fullName}`);

      // Refresh totals if needed
      if (newStatus) {
        setCommunicationed((prev) => prev + 1);
        setNotcommunicationed((prev) => prev - 1);
      } else {
        setCommunicationed((prev) => prev - 1);
        setNotcommunicationed((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error updating communicated status:", error);
      toast.error("Failed to update communication status");
      // Rollback UI
      setLeads((prev) =>
        prev.map((l) =>
          l.id === row.id ? { ...l, communicated: !newStatus } : l,
        ),
      );
    }
  };

  const handleDeleteConfirm = async () => {
    if (!leadToDelete) return;

    setIsDeleting(true);
    try {
      await deleteLead(leadToDelete.id);
      toast.success("Lead deleted successfully");
      setIsDeleteModalOpen(false);
      setLeadToDelete(null);
      // Refresh the list
      fetchLeads(currentPage);
    } catch (error) {
      console.error("Error deleting lead:", error);
      toast.error("Failed to delete lead");
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle row selection
  const handleRowSelect = (selectedIds: string[]) => {
    console.log("Selected rows:", selectedIds);
    // You can handle selected rows here
  };

  const handleSort = (key: string, direction: "asc" | "desc") => {
    console.log(`Sorting ${key} ${direction}`);
    setSortConfig({ key, direction });
    // Sorting state change will trigger the useEffect to refetch data
  };

  const handlePin = (key: string) => {
    console.log(`Pinning column ${key}`);
    // Pinning implementation: move to front
    const column = columns.find((col) => col.key === key);
    if (column) {
      const otherColumns = columns.filter((col) => col.key !== key);
      toast.success(`Pinned column: ${column.label}`);
    }
  };

  const handleFilter = (key: string) => {
    console.log(`Filtering by ${key}`);
    setIsFiltersModalOpen(true);
  };

  const handleHide = (key: string) => {
    console.log(`Hiding column ${key}`);
    toggleColumnVisibility(key);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleBulkDelete = async (
    ids: string[],
    clearSelection: () => void,
  ) => {
    const toastId = toast.loading(`Deleting ${ids.length} accounts...`);
    try {
      await Promise.all(ids.map((id) => deleteLead(id)));
      toast.success(`${ids.length} accounts deleted successfully`, {
        id: toastId,
      });
      clearSelection();
      fetchLeads(currentPage);
    } catch (error) {
      console.error("Error bulk deleting accounts:", error);
      toast.error("Failed to delete some accounts", { id: toastId });
    }
  };

  return (
    <>
      <Toaster
        position="top-right"
        containerStyle={{
          zIndex: 100000,
        }}
        toastOptions={{
          className: "font-sans",
          style: {
            padding: "16px",
            borderRadius: "12px",
          },
        }}
      />
      <div className="space-y-8">
        <div className="mt-7">
          <ExportModal
            isOpen={isExportModalOpen}
            onClose={() => setIsExportModalOpen(false)}
          />
          <ImportModal
            isOpen={isImportModalOpen}
            onClose={() => setIsImportModalOpen(false)}
          />
          <FiltersModal
            isOpen={isFiltersModalOpen}
            onClose={() => setIsFiltersModalOpen(false)}
            filters={filters}
            onApply={(newFilters: any) => {
              setFilters(newFilters);
              setIsFiltersModalOpen(false);
            }}
          />

          <DeleteLeadModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDeleteConfirm}
            leadName={leadToDelete?.fullName || ""}
            isLoading={isDeleting}
          />
          {/* Removed title and search row as requested */}
          {/* Action Bar */}
          <div className="bg-white flex flex-col md:flex-row md:items-center gap-6 p-6 rounded-xl shadow-sm border border-stroke/20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 flex-1">
              <CreativeFilter
                total={totalResults}
                communicated={communicationed}
                notCommunicated={notcommunicationed}
                currentFilter={filters.communicationed}
                onFilterChange={(val) =>
                  setFilters({ ...filters, communicationed: val })
                }
              />

              <div className="flex items-center border border-stroke/50 px-4 py-3 bg-background gap-3 rounded-md w-full sm:w-[320px] transition-all focus-within:border-primary group">
                <Search className="text-placeholder w-4 h-4 group-focus-within:text-primary" />
                <input
                  type="text"
                  className="flex-1 border-none outline-none text-mainText h-full text-base bg-transparent placeholder:text-placeholder"
                  placeholder="Search accounts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setIsFiltersModalOpen(true)}
                  className="flex-1 sm:flex-none flex items-center justify-center text-body rounded-md border border-stroke/50 p-3 hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all"
                  title="Filters"
                >
                  <ListFilter className="w-5 h-5 font-semibold" />
                </button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex-1 sm:flex-none flex items-center justify-center text-body rounded-md border border-stroke/50 p-3 hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all outline-none">
                      <HiViewColumns className="text-xl" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px] p-2">
                    {columns.map((column) => (
                      <DropdownMenuCheckboxItem
                        key={column.key}
                        className="capitalize text-body"
                        checked={visibleColumns.has(column.key)}
                        onCheckedChange={() =>
                          toggleColumnVisibility(column.key)
                        }
                      >
                        {column.label}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 border rounded-md border-primary text-primary hover:bg-primary/5 transition-all font-semibold"
                onClick={() => setIsImportModalOpen(true)}
              >
                <Download className="w-4 h-4" />
                <span>Import</span>
              </button>
              <button
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-md border border-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all font-semibold"
                onClick={() => setIsExportModalOpen(true)}
              >
                <Upload className="w-4 h-4" />
                <span>Export</span>
              </button>
              <Link
                href="/crm/addLead"
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-md border border-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all font-semibold"
              >
                <Plus className="w-5 h-5" />
                <span>Add New</span>
              </Link>
            </div>
          </div>

          <Table
            data={leads}
            columns={visibleColumnsList}
            idKey="id"
            pagination={{
              currentPage,
              totalResults: totalResults,
              resultsPerPage: 10,
              onPageChange: handlePageChange,
            }}
            rowActions={handleRowActions}
            onRowSelect={handleRowSelect}
            onSort={handleSort}
            onPin={handlePin}
            onFilter={handleFilter}
            onHide={handleHide}
            loading={loading}
            bulkActions={(selectedIds, clearSelection) => (
              <button
                onClick={() => handleBulkDelete(selectedIds, clearSelection)}
                className="flex items-center gap-2 px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-xs font-bold italic"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete Selected
              </button>
            )}
          />
          <ConvertLeadModal
            isOpen={isConvertModalOpen}
            onClose={() => setIsConvertModalOpen(false)}
            leadId={selectedLeadForConversion?.id || null}
            onSuccess={() => fetchLeads(currentPage)}
          />
          <LogCallModal
            isOpen={isLogCallModalOpen}
            onClose={() => setIsLogCallModalOpen(false)}
            leadId={selectedLeadForActions?.id}
            leadName={selectedLeadForActions?.fullName}
          />
          <ScheduleMeetingModal
            isOpen={isScheduleMeetingModalOpen}
            onClose={() => setIsScheduleMeetingModalOpen(false)}
            leadId={selectedLeadForActions?.id}
            leadName={selectedLeadForActions?.fullName}
          />
          <ChangeOwnerModal
            isOpen={isChangeOwnerModalOpen}
            onClose={() => setIsChangeOwnerModalOpen(false)}
            leadId={selectedLeadForActions?.id || null}
            leadName={selectedLeadForActions?.fullName}
            onSuccess={() => fetchLeads(currentPage)}
          />
        </div>
      </div>
    </>
  );
};

export default IndividualAccountsPage;
