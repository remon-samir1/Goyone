"use client";

import Table, { TableColumn } from "@/components/Table/Table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
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
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { HiViewColumns } from "react-icons/hi2";
import { Switch } from "@/components/ui/switch";
import ExportModal from "@/components/modals/ExportModal";
import ImportModal from "@/components/modals/ImportModal";
import FiltersModal from "@/components/modals/FiltersModal";
import Header from "./header";
import Link from "next/link";
import { Axios } from "@/components/Helpers/Axios";
import DeleteLeadModal from "@/components/modals/DeleteLeadModal";
import { deleteLead } from "@/lib/api";
import { toast } from "react-hot-toast";

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

const Page = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<LeadData | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // State for fetched data
  const [leads, setLeads] = useState<LeadData[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);

  const fetchLeads = async (page: number) => {
    setLoading(true);
    try {
      const response = await Axios.get(`/leads?page=${page}`);
      // Log response to debug
      console.log("Fetched leads:", response.data);

      const data = response.data.data;
      const meta = response.data.meta;

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
      setTotalResults(meta.total || 0);
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads(currentPage);
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
      sortable: false,
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
      render: (value) => (
        <Switch checked={value} className="data-[state=checked]:bg-primary" />
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
      <DropdownMenuItem className="gap-3 text-body font-medium">
        <Zap className="h-4 w-4 text-primary" />
        Convert
      </DropdownMenuItem>
      <DropdownMenuItem className="gap-3 text-body font-medium">
        <Eye className="h-4 w-4" />
        View
      </DropdownMenuItem>
      <DropdownMenuItem className="gap-3 text-body font-medium">
        <Pencil className="h-4 w-4" />
        Edit
      </DropdownMenuItem>
      <DropdownMenuItem className="gap-3 text-body font-medium">
        <Send className="h-4 w-4" />
        Send Email
      </DropdownMenuItem>
      <DropdownMenuItem className="gap-3 text-body font-medium">
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
      <DropdownMenuItem className="text-body font-medium pl-9">
        More...
      </DropdownMenuItem>
    </>
  );

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

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Fetch data for the new page from your API
    // Example: fetchLeads(page);
  };

  return (
    <>
      <Header Links={true} />
      <div className="pb-12 px-[3%]">
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
          />
          <DeleteLeadModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDeleteConfirm}
            leadName={leadToDelete?.fullName || ""}
            isLoading={isDeleting}
          />
          <div className="flex items-center justify-between">
            <h3 className="text-mainText text-[1.5rem] font-bold italic">
              Leads
            </h3>
            <div className="flex mt-5 w-[40%] items-center gap-3">
              <div className="flex items-center border border-stroke p-3 bg-white gap-2 rounded-3xl flex-1">
                <Search className="text-placeholder w-[18px] h-[18px]" />
                <input
                  type="text"
                  className="flex-1 border-none outline-none text-placeholder h-full"
                  placeholder="Serach"
                />
              </div>
              <button
                onClick={() => setIsFiltersModalOpen(true)}
                className="flex items-center text-white rounded-3xl bg-[#8CE553] py-2 px-5  gap-2 bg"
              >
                <ListFilter className="text-white w-[1.5rem] h-[1.5rem] font-semibold" />
                Filters
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="outline-none">
                    <HiViewColumns className="text-body text-[2rem] cursor-pointer" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px] p-2">
                  {columns.map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.key}
                      className="capitalize text-body"
                      checked={visibleColumns.has(column.key)}
                      onCheckedChange={() => toggleColumnVisibility(column.key)}
                    >
                      {column.label}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="mt-7 bg-white flex items-center rounded py-3 px-4 justify-between">
            <div className="flex items-center gap-2">
              <p className="text-mainText italic text-base font-bold flex items-center gap-2  p-3 bg-background/5 rounded">
                All Leads{" "}
                <span className="text-white bg-primary p-1 rounded-full">
                  {totalResults}
                </span>
              </p>
              <p className="text-mainText italic text-base font-bold  flex items-center gap-2 p-3 rounded">
                Communicationed{" "}
                <span className="text-white bg-[#8CE553] p-1 rounded-full">
                  560
                </span>
              </p>
              <p className="text-mainText italic text-base font-bold  flex items-center gap-2 p-3 rounded">
                Not Communicationed{" "}
                <span className="text-white bg-[#EDDA2E] p-1 rounded-full">
                  560
                </span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                className="flex items-center gap-2 px-4 py-3 border rounded-lg border-primary hover:bg-gray-50 transition-colors"
                onClick={() => setIsImportModalOpen(true)} // Open ImportModal
              >
                <Download className="text-primary w-[1.3rem] h-[1.3rem]" />
                <span className="text-primary text-sm font-bold ">Import</span>
              </button>
              <button
                className="flex items-center gap-2 px-4 py-3 border bg-primary rounded-lg border-primary hover:bg-primary/90 transition-colors"
                onClick={() => setIsExportModalOpen(true)}
              >
                <Upload className="text-white w-[1.3rem] h-[1.3rem] " />
                <span className="text-white text-sm font-bold ">Export</span>
              </button>
              <Link
                href="/crm/addLead"
                className="flex items-center gap-2 px-4 py-3 border bg-primary rounded-lg border-primary hover:bg-primary/90 transition-colors"
              >
                <Plus className="text-white w-[1.3rem] h-[1.3rem]" />
                <span className="text-white block text-sm font-bold">
                  Add new lead
                </span>
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
              resultsPerPage: 10, // Adjust per results per page or dynamic from API if provided
              onPageChange: handlePageChange,
            }}
            rowActions={handleRowActions}
            onRowSelect={handleRowSelect}
            loading={loading}
          />
        </div>
      </div>
    </>
  );
};

export default Page;
