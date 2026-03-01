"use client";

import React, { useState, useEffect } from "react";
import Table, { TableColumn } from "@/components/Table/Table";
import Header from "../header";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  ListFilter,
  Plus,
  Eye,
  Pencil,
  Trash2,
  CreditCard,
  Download,
  Upload,
  ChevronLeft,
  ChevronRight,
  Settings,
} from "lucide-react";
import { HiViewColumns } from "react-icons/hi2";
import InvoiceScorecards from "@/components/crm/InvoiceScorecards";
import InvoiceFilterSidebar from "@/components/crm/InvoiceFilterSidebar";
import Link from "next/link";
import { Toaster, toast } from "react-hot-toast";
import DeleteInvoiceModal from "@/components/modals/DeleteInvoiceModal";
import PayInvoiceModal from "@/components/modals/PayInvoiceModal";
import { getInvoices, deleteInvoice } from "@/lib/api";

interface InvoiceData {
  id: number;
  uuid: string;
  name: string;
  phone: string;
  status: string;
  total: number;
  discount: number;
  shipping: number;
  vat: number;
  paid: number;
  date: string;
  due_date: string;
  created_at: string;
}

const InvoicesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceData | null>(
    null,
  );
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    type: "",
    only_trashed: false,
    with_trashed: false,
    over_due: false,
    today: false,
  });
  const [invoiceTotals, setInvoiceTotals] = useState({
    total_invoices: "0",
    total_sales: "0",
    total_paid_money: "0",
    total_due: "0",
  });

  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    "uuid",
    "name",
    "date",
    "due_date",
    "status",
    "total",
    "paid",
    "actions",
  ]);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const todayDate = new Date().toISOString().split("T")[0];
      const apiParams: any = {
        page: currentPage,
        search: searchTerm,
        ...filters,
        only_trashed: filters.only_trashed ? 1 : 0,
        with_trashed: filters.with_trashed ? 1 : 0,
      };

      if (filters.today) {
        apiParams.date_from = todayDate;
        apiParams.date_to = todayDate;
      }

      if (filters.over_due) {
        apiParams.status = "overdue";
      }

      const response = await getInvoices(apiParams);
      if (response) {
        // Based on the API screenshot, the structure is { total_invoices, ..., data: { data: [...] } }
        // or sometimes simplified. Let's handle the structure from the screenshot.
        const data = response.data?.data || response.data || response || [];
        setInvoices(Array.isArray(data) ? data : []);
        setTotalResults(
          response.data?.total ||
            response.total ||
            (Array.isArray(data) ? data.length : 0),
        );

        // Extract totals for scorecards
        if (response.total_invoices !== undefined) {
          setInvoiceTotals({
            total_invoices: String(response.total_invoices),
            total_sales: String(response.total_sales || "0"),
            total_paid_money: String(response.total_paid_money || "0"),
            total_due: String(response.total_due || "0"),
          });
        }
      } else {
        setInvoices([]);
        setTotalResults(0);
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
      toast.error("Failed to fetch invoices");
      setInvoices([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [currentPage, searchTerm, filters]);

  const handleDelete = async (id: number | string) => {
    try {
      await deleteInvoice(id);
      toast.success("Invoice deleted successfully");
      fetchInvoices();
    } catch (error) {
      toast.error("Failed to delete invoice");
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    const toastId = toast.loading("Deleting selected invoices...");
    try {
      for (const id of selectedIds) {
        await deleteInvoice(id);
      }
      toast.success("Selected invoices deleted", { id: toastId });
      setSelectedIds([]);
      fetchInvoices();
    } catch (error) {
      toast.error("Failed to delete some invoices", { id: toastId });
    }
  };

  const allColumns: TableColumn<InvoiceData>[] = [
    {
      key: "uuid",
      label: "Invoice ID",
      render: (val) => (
        <div className="flex flex-col">
          <span className="font-bold italic text-[#111827]">{val}</span>
          <span className="text-[10px] text-[#9CA3AF] italic">
            Sale by menna drayes
          </span>
        </div>
      ),
    },
    {
      key: "name",
      label: "Account",
      render: (val, row) => (
        <div className="flex items-center gap-2">
          <div className="flex flex-col">
            <span className="font-bold italic text-[#111827]">{val}</span>
            <span className="text-[10px] text-[#9CA3AF] italic">
              {row.phone}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "date",
      label: "Invoice Date",
      render: (val) => (
        <span className="italic font-bold text-[11px] text-[#111827]">
          {val ? new Date(val).toLocaleDateString() : "-"}
        </span>
      ),
    },
    {
      key: "due_date",
      label: "Due Date",
      render: (val) => (
        <span className="italic font-bold text-[11px] text-[#111827]">
          {val ? new Date(val).toLocaleDateString() : "-"}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (val) => {
        const statusColors: Record<string, string> = {
          paid: "text-[#8CE553]",
          sent: "text-[#3672EA]",
          draft: "text-[#EDDA2E]",
        };
        const color = statusColors[val?.toLowerCase()] || "text-gray-500";
        return (
          <span className={`font-bold italic  ${color}`}>
            {val?.charAt(0).toUpperCase() + val?.slice(1)}
          </span>
        );
      },
    },
    {
      key: "shipping",
      label: "Shipping",
      render: (val) => (
        <span className="italic font-bold text-[11px] text-[#111827]">
          EGP {Number(val || 0).toFixed(2)}
        </span>
      ),
    },
    {
      key: "vat",
      label: "VAT",
      render: (val) => (
        <span className="italic font-bold text-[11px] text-[#111827]">
          {val}%
        </span>
      ),
    },
    {
      key: "discount",
      label: "Discount",
      render: (val) => (
        <span className="italic font-bold text-[11px] text-[#111827]">
          {val}%
        </span>
      ),
    },
    {
      key: "total",
      label: "Total",
      render: (val) => (
        <span className="italic font-bold text-[11px] text-[#111827]">
          EGP {Number(val || 0).toLocaleString()}
        </span>
      ),
    },
    {
      key: "paid",
      label: "Paid",
      render: (val) => (
        <span className="italic font-bold text-[11px] text-[#111827]">
          EGP {Number(val || 0).toLocaleString()}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <Link href={`/crm/invoices/${row.id}`}>
            <Eye className="w-4 h-4 text-[#3672EA] cursor-pointer hover:scale-110 transition-transform" />
          </Link>
          <Link href={`/crm/invoices/${row.id}/edit`}>
            <Pencil className="w-4 h-4 text-[#EDDA2E] cursor-pointer hover:scale-110 transition-transform" />
          </Link>
          <Trash2
            className="w-4 h-4 text-red-500 cursor-pointer hover:scale-110 transition-transform"
            onClick={() => {
              setSelectedInvoice(row);
              setIsDeleteModalOpen(true);
            }}
          />
          <CreditCard
            className="w-4 h-4 text-[#3672EA]/60 cursor-pointer hover:scale-110 transition-transform"
            onClick={() => {
              setSelectedInvoice(row);
              setIsPayModalOpen(true);
            }}
          />
        </div>
      ),
    },
  ];

  const columns = allColumns.filter((col) => visibleColumns.includes(col.key));

  return (
    <div className="min-h-screen bg-[#F6F8FC]">
      <Toaster position="top-right" />
      <Header Links={true} />

      <div className="px-[3%] py-8">
        <div className="flex justify-between gap-3 items-center mb-8">
          <h1 className="text-2xl font-bold italic text-mainText">Invoices</h1>
          <div className="flex items-center gap-4 w-3/4">
            <div className="flex-1 flex items-center bg-white border border-[#E6E8EC] rounded-full px-5 py-2.5 gap-3 ">
              <Search className="w-5 h-5 text-[#9CA3AF]" />
              <input
                type="text"
                placeholder="Search Invoices.."
                className="bg-transparent border-none outline-none text-sm w-full italic text-[#111827] placeholder-[#9CA3AF]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={() => setIsFilterSidebarOpen(true)}
              className="bg-[#8CE553] text-white px-8 py-2.5 rounded-full flex items-center gap-2 font-bold italic shadow-lg hover:opacity-90 transition-all active:scale-95 whitespace-nowrap"
            >
              <ListFilter className="w-5 h-5" />
              Filters
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="outline-none">
                  <HiViewColumns className="text-3xl text-slate-400 cursor-pointer hover:text-primary transition-colors" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {allColumns.map((col) => (
                  <DropdownMenuCheckboxItem
                    key={col.key}
                    checked={visibleColumns.includes(col.key)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setVisibleColumns((prev) => [...prev, col.key]);
                      } else {
                        setVisibleColumns((prev) =>
                          prev.filter((c) => c !== col.key),
                        );
                      }
                    }}
                  >
                    {col.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <button className="border border-primary hidden text-primary  items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm italic shadow-sm">
              <Settings />
              Settings
            </button>
            <Link
              href="/crm/invoices/create"
              className="bg-primary text-white px-6 py-2.5 rounded-lg flex items-center gap-2 font-bold italic shadow-sm hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              New Invoices
            </Link>
          </div>
        </div>

        <InvoiceScorecards totals={invoiceTotals} />

        <div className="relative mb-4"></div>

        <Table
          data={invoices}
          columns={columns}
          idKey="id"
          loading={loading}
          onRowSelect={(ids) => setSelectedIds(ids)}
          bulkActions={() => (
            <button
              onClick={handleBulkDelete}
              className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-red-600 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete Selected
            </button>
          )}
          pagination={{
            currentPage: currentPage,
            totalResults: totalResults,
            onPageChange: (p) => setCurrentPage(p),
          }}
        />

        <div className="mt-4 text-[10px] text-slate-400 italic">
          Showing {invoices.length > 0 ? (currentPage - 1) * 10 + 1 : 0} to{" "}
          {Math.min(currentPage * 10, totalResults)} of {totalResults} results
        </div>
      </div>

      {isDeleteModalOpen && selectedInvoice && (
        <DeleteInvoiceModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          invoiceId={selectedInvoice.uuid}
          onConfirm={() => handleDelete(selectedInvoice.id)}
        />
      )}

      {isPayModalOpen && selectedInvoice && (
        <PayInvoiceModal
          isOpen={isPayModalOpen}
          onClose={() => setIsPayModalOpen(false)}
          invoice={selectedInvoice}
        />
      )}

      <InvoiceFilterSidebar
        isOpen={isFilterSidebarOpen}
        onClose={() => setIsFilterSidebarOpen(false)}
        currentFilters={filters}
        onApply={(newFilters) => {
          setFilters(newFilters);
          setCurrentPage(1);
          setIsFilterSidebarOpen(false);
        }}
        onReset={() => {
          setFilters({
            status: "",
            type: "",
            only_trashed: false,
            with_trashed: false,
            over_due: false,
            today: false,
          });
          setCurrentPage(1);
          setIsFilterSidebarOpen(false);
        }}
      />
    </div>
  );
};

export default InvoicesPage;
