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
  Columns3,
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
import React, { useState } from "react";
import { HiViewColumns } from "react-icons/hi2";
import { Switch } from "@/components/ui/switch";
import ExportModal from "@/components/modals/ExportModal";
import ImportModal from "@/components/modals/ImportModal";
import FiltersModal from "@/components/modals/FiltersModal";
import Header from "./header";
import Link from "next/link";

// Define your data type
interface LeadData {
  id: string;
  serialNumber: string;
  date: string;
  time: string;
  fullName: string;
  status: "No Answered" | "Not Qualified" | "Potential";
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

  // Sample data - Replace this with your API data
  const leadsData: LeadData[] = [
    {
      id: "1",
      serialNumber: "L255260",
      date: "12/15/2025",
      time: "01:53 pm",
      fullName: "Petra Hany",
      status: "No Answered",
      companyName: "TechCorp Inc.",
      leadSource: "Lorem ipsum",
      adId: "120237740620160040",
      channel: "Facebook",
      phoneNumber: "01018683449",
      moderationFeedback: "Lorem ipsum dolor sit am",
      lastFeedback: "Lorem ipsum dolor sit am",
      communicated: true,
    },
    {
      id: "2",
      serialNumber: "L255260",
      date: "12/15/2025",
      time: "01:53 pm",
      fullName: "Petra Hany",
      status: "Not Qualified",
      companyName: "TechCorp Inc.",
      leadSource: "Lorem ipsum",
      adId: "120237740620160040",
      channel: "Facebook",
      phoneNumber: "01018683449",
      moderationFeedback: "Lorem ipsum dolor sit am",
      lastFeedback: "Lorem ipsum dolor sit am",
      communicated: true,
    },
    {
      id: "3",
      serialNumber: "L255260",
      date: "12/15/2025",
      time: "01:53 pm",
      fullName: "Petra Hany",
      status: "Potential",
      companyName: "TechCorp Inc.",
      leadSource: "Lorem ipsum",
      adId: "120237740620160040",
      channel: "Facebook",
      phoneNumber: "01018683449",
      moderationFeedback: "Lorem ipsum dolor sit am",
      lastFeedback: "Lorem ipsum dolor sit am",
      communicated: true,
    },
    {
      id: "4",
      serialNumber: "L255260",
      date: "12/15/2025",
      time: "01:53 pm",
      fullName: "Petra Hany",
      status: "Not Qualified",
      companyName: "TechCorp Inc.",
      leadSource: "Lorem ipsum",
      adId: "120237740620160040",
      channel: "Facebook",
      phoneNumber: "01018683449",
      moderationFeedback: "Lorem ipsum dolor sit am",
      lastFeedback: "Lorem ipsum dolor sit am",
      communicated: true,
    },
    {
      id: "5",
      serialNumber: "L255260",
      date: "12/15/2025",
      time: "01:53 pm",
      fullName: "Petra Hany",
      status: "Not Qualified",
      companyName: "TechCorp Inc.",
      leadSource: "Lorem ipsum",
      adId: "120237740620160040",
      channel: "Facebook",
      phoneNumber: "01018683449",
      moderationFeedback: "Lorem ipsum dolor sit am",
      lastFeedback: "Lorem ipsum dolor sit am",
      communicated: true,
    },
  ];

  // Define columns with custom render functions for status
  const columns: TableColumn<LeadData>[] = [
    { key: "serialNumber", label: "S.N", sortable: true },
    { key: "date", label: "Dated", sortable: true },
    { key: "time", label: "Time", sortable: true },
    { key: "fullName", label: "Full Name", sortable: true },
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
            case "Potential":
              return "text-blue-500";
            default:
              return "text-body";
          }
        };
        return <span className={getStatusColor(value)}>{value}</span>;
      },
    },
    { key: "companyName", label: "Company Name", sortable: true },
    { key: "leadSource", label: "Lead Sourse", sortable: true },
    { key: "adId", label: "Ad Id", sortable: true },
    { key: "channel", label: "Channel", sortable: true },
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
      render: (value) => <span className="italic text-body">{value}</span>,
    },
    {
      key: "lastFeedback",
      label: "Last Feedback",
      sortable: true,
      render: (value) => <span className="italic text-body">{value}</span>,
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
      <DropdownMenuItem className="gap-3 text-red-500 focus:text-red-500 font-medium">
        <Trash2 className="h-4 w-4" />
        Delete
      </DropdownMenuItem>
      <DropdownMenuItem className="text-body font-medium pl-9">
        More...
      </DropdownMenuItem>
    </>
  );

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
      <Header Links={true}/>
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
        <h3 className="text-mainText text-[1.5rem] font-bold italic">Leads</h3>

        <div className="mt-7 bg-white flex items-center rounded py-3 px-4 justify-between">
          <div className="flex items-center gap-2">
            <p className="text-mainText italic text-base font-bold flex items-center gap-2  p-3 bg-background/5 rounded">
              All Leads{" "}
              <span className="text-white bg-primary p-1 rounded-full">
                1000
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
              <span className="text-white block text-sm font-bold">Add new lead</span>
            </Link>
          </div>
        </div>
        <div className="flex mt-5 max-w-[50%] items-center gap-3">
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
        <Table
          data={leadsData}
          columns={visibleColumnsList}
          idKey="id"
          pagination={{
            currentPage,
            totalResults: 12,
            resultsPerPage: 10,
            onPageChange: handlePageChange,
          }}
          rowActions={handleRowActions}
          onRowSelect={handleRowSelect}
        />
      </div>
    </div>
    </>

  );
};

export default Page;
