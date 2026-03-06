"use client";

import React, { useState, useEffect } from "react";
import Header from "../../header";
import {
  Pencil,
  Trash2,
  Printer,
  Search,
  ChevronLeft,
  ChevronRight,
  Paperclip,
  CheckCircle2,
  Mail,
  Eye,
  Info,
  History,
  CreditCard,
} from "lucide-react";
import Link from "next/link";
import { Toaster, toast } from "react-hot-toast";
import DeleteInvoiceModal from "@/components/modals/DeleteInvoiceModal";
import { getInvoice, deleteInvoice } from "@/lib/api";
import { useRouter } from "next/navigation";
import InvoiceSkeleton from "./InvoiceSkeleton";

const InvoiceDetailPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = React.use(params);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"logs" | "payments">("logs");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  console.log(invoice);
  useEffect(() => {
    fetchInvoiceData();
  }, [id]);

  const fetchInvoiceData = async () => {
    try {
      setLoading(true);
      const data = await getInvoice(id);
      setInvoice(data);
    } catch (error) {
      console.error("Error fetching invoice:", error);
      toast.error("Failed to load invoice details");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) return <InvoiceSkeleton />;
  if (!invoice)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
        <Header Links={true} />
        <div className="text-center p-8 bg-white rounded-3xl shadow-sm border border-slate-100">
          <h2 className="text-2xl font-bold italic text-mainText mb-2">
            Invoice Not Found
          </h2>
          <p className="text-slate-400 italic mb-6">
            The invoice you're looking for doesn't exist or you don't have
            access.
          </p>
          <Link
            href="/crm/invoices"
            className="bg-blue-500 text-white px-8 py-3 rounded-xl font-bold italic shadow-md hover:bg-blue-600 transition-all"
          >
            Back to Invoices
          </Link>
        </div>
      </div>
    );

  // Handle potential nesting and ensure we have the invoice object
  const inv =
    invoice?.data && typeof invoice.data === "object"
      ? invoice.data
      : invoice?.id
        ? invoice
        : null;

  if (!inv && !loading) return null;

  const items = inv?.invoices_items || inv?.invoice_items || inv?.items || [];
  const logs = inv?.invoice_logs || inv?.logs || [];
  const payments = (inv?.invoice_metas || inv?.metas || []).filter(
    (meta: any) =>
      meta.key?.toLowerCase() === "payments" ||
      meta.key?.toLowerCase() === "payment",
  );

  const currencySymbol =
    inv?.currency?.iso || inv?.currency?.symbol || inv?.currency_symbol || "$";

  const filteredLogs = logs.filter(
    (log: any) =>
      log.log?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.type?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredPayments = payments.filter(
    (payment: any) =>
      payment.value
        ?.toString()
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      payment.amount
        ?.toString()
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      payment.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.note?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Toaster position="top-right" />
      <Header Links={true} />

      <div className="px-[3%] py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold italic text-mainText">
              View Invoice
            </h1>
            <p className="text-sm text-slate-400 italic">
              Review invoice details and history
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href={`/crm/invoices/${id}/edit`}
              className="flex items-center gap-2 px-6 py-2 bg-blue-500 text-white rounded-lg font-bold italic shadow-sm hover:bg-blue-600 transition-all cursor-pointer"
            >
              <Pencil className="w-4 h-4" />
              Edit
            </Link>
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="flex items-center gap-2 px-6 py-2 border border-red-200 text-red-500 rounded-lg font-bold italic hover:bg-red-50 transition-all"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-6 py-2 border border-slate-200 text-slate-600 rounded-lg font-bold italic hover:bg-slate-50 transition-all"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
          </div>
        </div>

        {/* Invoice Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-12 mb-8 relative">
          <div className="flex justify-between items-start mb-12">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white text-xl font-bold">
                SM
              </div>
              <div>
                <h2 className="text-xl font-bold italic text-mainText">
                  SunMed CRM
                </h2>
                <p className="text-sm text-slate-400 italic">
                  billing@sunmedcrm.com
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400 italic mb-1 uppercase tracking-wider">
                Invoice
              </p>
              <h3 className="text-2xl font-bold italic text-mainText">
                {inv.uuid}
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-24 mb-12">
            <div className="space-y-6">
              <div>
                <p className="text-[10px] text-slate-400 italic mb-1 uppercase tracking-widest">
                  Bill From
                </p>
                <h4 className="text-lg font-bold italic text-mainText">
                  SunMed CRM
                </h4>
                <p className="text-sm text-slate-400 italic mt-1">
                  billing@sunmedcrm.com
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 italic mb-1 uppercase tracking-widest">
                  Bill To
                </p>
                <h4 className="text-lg font-bold italic text-mainText">
                  {inv.name || "N/A"}
                </h4>
                <p className="text-sm text-slate-400 italic mt-1">
                  {inv.phone || "No phone provided"}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 italic mb-2 uppercase tracking-widest">
                  Signature
                </p>
                <div className="relative group">
                  <svg
                    width="60"
                    height="40"
                    viewBox="0 0 60 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 25C15 20 25 15 35 25C45 35 55 15 50 10"
                      stroke="#CC9900"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <path
                      d="M10 20C15 15 25 10 30 20"
                      stroke="#CC9900"
                      strokeWidth="2"
                      strokeLinecap="round"
                      opacity="0.5"
                    />
                  </svg>
                  <div className="absolute -bottom-2 -left-1">🖊️</div>
                </div>
              </div>
            </div>

            <div className="space-y-4 text-right">
              <div className="flex flex-col items-end">
                <p className="text-[10px] text-slate-400 italic mb-1 uppercase tracking-widest">
                  Issue Date
                </p>
                <p className="text-lg font-bold italic text-mainText">
                  {formatDate(inv.date)}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <p className="text-[10px] text-slate-400 italic mb-1 uppercase tracking-widest">
                  Due Date
                </p>
                <p className="text-lg font-bold italic text-mainText">
                  {formatDate(inv.due_date)}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <p className="text-[10px] text-slate-400 italic mb-1 uppercase tracking-widest">
                  Status
                </p>
                <span
                  className={`px-4 py-1 rounded-full text-xs font-bold italic border ${
                    inv.status?.toLowerCase() === "paid"
                      ? "bg-green-50 text-green-500 border-green-100"
                      : "bg-orange-50 text-orange-500 border-orange-100"
                  }`}
                >
                  {inv.status?.toUpperCase() || "PENDING"}
                </span>
              </div>
              <div className="flex flex-col items-end pt-2">
                <p className="text-[10px] text-slate-400 italic mb-1 uppercase tracking-widest">
                  Type
                </p>
                <span className="px-4 py-1 rounded-full text-xs font-bold italic bg-blue-50 text-blue-500 border border-blue-100">
                  {inv.type?.toUpperCase() || "SALE"}
                </span>
              </div>
            </div>
          </div>

          {items.length > 0 && (
            <div className="mb-12">
              <h4 className="text-lg font-bold italic text-mainText mb-6">
                Invoice Items
              </h4>
              <div className="w-full overflow-hidden rounded-xl border border-slate-50">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[#F8FAFC]">
                      <th className="px-6 py-4 text-left text-xs font-bold italic text-slate-500 uppercase tracking-widest">
                        Item Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold italic text-slate-500 uppercase tracking-widest">
                        Description
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold italic text-slate-500 uppercase tracking-widest">
                        Price
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold italic text-slate-500 uppercase tracking-widest">
                        VAT
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold italic text-slate-500 uppercase tracking-widest">
                        Discount
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold italic text-slate-500 uppercase tracking-widest">
                        Qty
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold italic text-slate-500 uppercase tracking-widest">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {items.map((item: any) => (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm font-bold italic text-mainText">
                          {item.item}
                        </td>
                        <td className="px-6 py-4 text-sm italic text-slate-400">
                          {item.description}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold italic text-mainText">
                          {currencySymbol}
                          {Number(item.price).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold italic text-slate-400">
                          {currencySymbol}
                          {Number(item.vat).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold italic text-slate-400">
                          {currencySymbol}
                          {Number(item.discount).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold italic text-mainText">
                          {item.qty}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold italic text-mainText">
                          {currencySymbol}
                          {Number(item.total).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="w-full ml-auto space-y-4 mx-4">
            <div className="flex justify-between items-center italic">
              <span className="text-sm font-medium text-slate-400">
                Sub Total
              </span>
              <span className="text-sm font-bold text-mainText">
                {currencySymbol}
                {(
                  Number(inv.total) -
                  Number(inv.vat) +
                  Number(inv.discount)
                ).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center italic">
              <span className="text-sm font-medium text-slate-400">
                Discount
              </span>
              <span className="text-sm font-bold text-mainText">
                -{currencySymbol}
                {Number(inv.discount).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center italic">
              <span className="text-sm font-medium text-slate-400">Tax</span>
              <span className="text-sm font-bold text-mainText">
                {currencySymbol}
                {Number(inv.vat).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center italic pt-4">
              <span className="text-sm font-medium text-slate-400">Paid</span>
              <span className="text-sm font-bold text-green-500">
                {currencySymbol}
                {Number(inv.paid).toLocaleString()}
              </span>
            </div>
            <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100 flex justify-between items-center italic">
              <span className="text-base font-bold text-mainText">
                Balance Due
              </span>
              <span className="text-xl font-bold text-mainText">
                {currencySymbol}
                {(Number(inv.total) - Number(inv.paid)).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* History Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab("logs")}
            className={`px-6 py-2 rounded-lg font-bold italic text-sm transition-all ${activeTab === "logs" ? "bg-blue-500 text-white shadow-md shadow-blue-200" : "bg-white text-slate-400 hover:bg-slate-50"}`}
          >
            Invoice Logs
          </button>
          <button
            onClick={() => setActiveTab("payments")}
            className={`px-6 py-2 rounded-lg font-bold italic text-sm transition-all ${activeTab === "payments" ? "bg-blue-500 text-white shadow-md shadow-blue-200" : "bg-white text-slate-400 hover:bg-slate-50"}`}
          >
            Payments
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden min-h-[300px]">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <div className="flex-1 max-w-md flex items-center bg-slate-50 border border-slate-100 rounded-2xl px-4 py-2 gap-2">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-sm w-full italic"
              />
            </div>
          </div>

          {activeTab === "logs" ? (
            <div className="overflow-x-auto">
              {filteredLogs.length > 0 ? (
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[#F8FAFC]">
                      <th className="px-8 py-4 text-left text-xs font-bold italic text-slate-500 uppercase tracking-widest w-1/2">
                        Log
                      </th>
                      <th className="px-8 py-4 text-left text-xs font-bold italic text-slate-500 uppercase tracking-widest text-center">
                        Type
                      </th>
                      <th className="px-8 py-4 text-left text-xs font-bold italic text-slate-500 uppercase tracking-widest text-right">
                        Created At
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredLogs.map((log: any) => (
                      <tr
                        key={log.id}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-8 py-5 text-sm font-bold italic text-mainText">
                          {log.log}
                        </td>
                        <td className="px-8 py-5 text-center">
                          <span className="px-4 py-1 rounded-full text-[10px] font-bold italic bg-blue-50 text-blue-500 border border-blue-100">
                            {log.type}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right text-xs italic text-slate-400 font-bold">
                          {formatDate(log.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-20 text-center italic text-slate-400">
                  No logs found for this inv.
                </div>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              {filteredPayments.length > 0 ? (
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[#F8FAFC]">
                      <th className="px-8 py-4 text-left text-xs font-bold italic text-slate-500 uppercase tracking-widest">
                        Amount
                      </th>
                      <th className="px-8 py-4 text-left text-xs font-bold italic text-slate-500 uppercase tracking-widest text-center">
                        Description
                      </th>
                      <th className="px-8 py-4 text-left text-xs font-bold italic text-slate-500 uppercase tracking-widest text-center">
                        Attachments
                      </th>
                      <th className="px-8 py-4 text-left text-xs font-bold italic text-slate-500 uppercase tracking-widest text-right">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredPayments.map((payment: any) => (
                      <tr
                        key={payment.id}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-8 py-5 text-sm font-bold italic text-mainText">
                          {payment.value || payment.amount || 0}
                        </td>
                        <td className="px-8 py-5 text-center text-sm italic font-bold text-mainText">
                          {payment.description || payment.note || "N/A"}
                        </td>
                        <td className="px-8 py-5 text-center text-xs italic">
                          {Array.isArray(payment.attachments)
                            ? payment.attachments.length
                            : payment.attachments || 0}
                        </td>
                        <td className="px-8 py-5 text-right text-xs italic text-slate-400 font-bold">
                          {formatDate(payment.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-20 text-center italic text-slate-400">
                  No payments recorded for this inv.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {isDeleteModalOpen && (
        <DeleteInvoiceModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          invoiceId={inv.id}
          onConfirm={async () => {
            try {
              await deleteInvoice(inv.id);
              toast.success("Invoice deleted successfully");
              router.push("/crm/invoices");
            } catch (error) {
              toast.error("Failed to delete invoice");
            }
            setIsDeleteModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default InvoiceDetailPage;
