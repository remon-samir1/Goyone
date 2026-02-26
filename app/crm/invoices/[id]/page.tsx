"use client";

import React, { useState } from "react";
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

const InvoiceDetailPage = ({ params }: { params: { id: string } }) => {
  const [activeTab, setActiveTab] = useState<"logs" | "payments">("logs");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Mock data to match Image 1
  const invoice = {
    id: params.id,
    invoice_id: "INV-2024-001",
    bill_from: {
      name: "SunMed CRM",
      email: "billing@sunmedcrm.com",
    },
    bill_to: {
      name: "Ahmed Hassan",
      email: "ahmed.hassan@healthcare.com",
    },
    issue_date: "2024-01-15",
    due_date: "2024-02-15",
    status: "Paid",
    type: "Sale Invoice",
    sub_total: 1340.0,
    discount: 15.0,
    tax: 72.0,
    paid: 1397.0,
    balance_due: 0.0,
    items: [
      {
        id: 1,
        name: "Lorem ipsum",
        description: "Heart medications - Premium quality",
        price: 250.0,
        vat: 37.5,
        discount: 10.0,
        qty: 2,
        total: 527.5,
      },
      {
        id: 2,
        name: "Lorem ipsum",
        description: "Medical supplies - Sterile equipment",
        price: 250.0,
        vat: 37.5,
        discount: 10.0,
        qty: 2,
        total: 527.5,
      },
      {
        id: 3,
        name: "Lorem ipsum",
        description: "Measuring devices - Digital thermometers",
        price: 250.0,
        vat: 37.5,
        discount: 10.0,
        qty: 2,
        total: 527.5,
      },
    ],
  };

  const logs = [
    {
      id: 1,
      log: "Invoice created",
      type: "Created",
      created_at: "2024-01-15 10:30 AM",
    },
    {
      id: 2,
      log: "Invoice sent to client via email",
      type: "Sent",
      created_at: "2024-01-15 11:00 AM",
    },
    {
      id: 3,
      log: "Invoice viewed by client",
      type: "Viewed",
      created_at: "2024-01-16 09:15 AM",
    },
    {
      id: 4,
      log: "Payment received - Full amount",
      type: "Payment",
      created_at: "2024-01-18 02:30 PM",
    },
    {
      id: 5,
      log: "Invoice marked as paid",
      type: "Updated",
      created_at: "2024-01-18 02:35 PM",
    },
  ];

  const payments = [
    {
      id: 1,
      amount: "55,000 EGP",
      description: "ماركتينج حساب شهر يناير",
      attachments: 1,
      created_at: "Jan 11, 2026 14:13:58",
    },
    {
      id: 2,
      amount: "55,000 EGP",
      description: "ماركتينج حساب شهر يناير",
      attachments: 1,
      created_at: "Jan 11, 2026 14:13:58",
    },
    {
      id: 3,
      amount: "55,000 EGP",
      description: "ماركتينج حساب شهر يناير",
      attachments: 1,
      created_at: "Jan 11, 2026 14:13:58",
    },
    {
      id: 4,
      amount: "55,000 EGP",
      description: "ماركتينج حساب شهر يناير",
      attachments: 1,
      created_at: "Jan 11, 2026 14:13:58",
    },
    {
      id: 5,
      amount: "55,000 EGP",
      description: "ماركتينج حساب شهر يناير",
      attachments: 1,
      created_at: "Jan 11, 2026 14:13:58",
    },
  ];

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
            <button className="flex items-center gap-2 px-6 py-2 bg-blue-500 text-white rounded-lg font-bold italic shadow-sm hover:bg-blue-600 transition-all">
              <Pencil className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="flex items-center gap-2 px-6 py-2 border border-red-200 text-red-500 rounded-lg font-bold italic hover:bg-red-50 transition-all"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
            <button className="flex items-center gap-2 px-6 py-2 border border-slate-200 text-slate-600 rounded-lg font-bold italic hover:bg-slate-50 transition-all">
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
                {invoice.invoice_id}
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
                  {invoice.bill_from.name}
                </h4>
                <p className="text-sm text-slate-400 italic mt-1">
                  {invoice.bill_from.email}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 italic mb-1 uppercase tracking-widest">
                  Bill To
                </p>
                <h4 className="text-lg font-bold italic text-mainText">
                  {invoice.bill_to.name}
                </h4>
                <p className="text-sm text-slate-400 italic mt-1">
                  {invoice.bill_to.email}
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
                  {invoice.issue_date}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <p className="text-[10px] text-slate-400 italic mb-1 uppercase tracking-widest">
                  Due Date
                </p>
                <p className="text-lg font-bold italic text-mainText">
                  {invoice.due_date}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <p className="text-[10px] text-slate-400 italic mb-1 uppercase tracking-widest">
                  Status
                </p>
                <span
                  className={`px-4 py-1 rounded-full text-xs font-bold italic bg-green-50 text-green-500 border border-green-100`}
                >
                  {invoice.status}
                </span>
              </div>
              <div className="flex flex-col items-end pt-2">
                <p className="text-[10px] text-slate-400 italic mb-1 uppercase tracking-widest">
                  Type
                </p>
                <span className="px-4 py-1 rounded-full text-xs font-bold italic bg-blue-50 text-blue-500 border border-blue-100">
                  {invoice.type}
                </span>
              </div>
            </div>
          </div>

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
                  {invoice.items.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-bold italic text-mainText">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 text-sm italic text-slate-400">
                        {item.description}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold italic text-mainText">
                        ${item.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold italic text-slate-400">
                        ${item.vat.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold italic text-slate-400">
                        ${item.discount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold italic text-mainText">
                        {item.qty}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold italic text-mainText">
                        ${item.total.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="max-w-xs ml-auto space-y-4">
            <div className="flex justify-between items-center italic">
              <span className="text-sm font-medium text-slate-400">
                Sub Total
              </span>
              <span className="text-sm font-bold text-mainText">
                ${invoice.sub_total.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center italic">
              <span className="text-sm font-medium text-slate-400">
                Discount
              </span>
              <span className="text-sm font-bold text-mainText">
                -${invoice.discount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center italic">
              <span className="text-sm font-medium text-slate-400">Tax</span>
              <span className="text-sm font-bold text-mainText">
                ${invoice.tax.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center italic pt-4">
              <span className="text-sm font-medium text-slate-400">Paid</span>
              <span className="text-sm font-bold text-green-500">
                ${invoice.paid.toLocaleString()}
              </span>
            </div>
            <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100 flex justify-between items-center italic">
              <span className="text-base font-bold text-mainText">
                Balance Due
              </span>
              <span className="text-xl font-bold text-mainText">
                ${invoice.balance_due.toLocaleString()}
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

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <div className="flex-1 max-w-md flex items-center bg-slate-50 border border-slate-100 rounded-2xl px-4 py-2 gap-2">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search logs..."
                className="bg-transparent border-none outline-none text-sm w-full italic"
              />
            </div>
            <span className="text-xs text-slate-400 italic">
              Showing 1-5 of 6 results
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC]">
                  {activeTab === "logs" ? (
                    <>
                      <th className="px-8 py-4 text-left text-xs font-bold italic text-slate-500 uppercase tracking-widest w-1/2">
                        Log
                      </th>
                      <th className="px-8 py-4 text-left text-xs font-bold italic text-slate-500 uppercase tracking-widest text-center">
                        Type
                      </th>
                      <th className="px-8 py-4 text-left text-xs font-bold italic text-slate-500 uppercase tracking-widest text-right">
                        Created At
                      </th>
                    </>
                  ) : (
                    <>
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
                        Created at
                      </th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {activeTab === "logs"
                  ? logs.map((log) => (
                      <tr
                        key={log.id}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-8 py-5 text-sm font-bold italic text-mainText">
                          {log.log}
                        </td>
                        <td className="px-8 py-5 text-center">
                          <span
                            className={`px-4 py-1 rounded-full text-[10px] font-bold italic inline-block
                           ${
                             log.type === "Created"
                               ? "bg-blue-50 text-blue-500 border border-blue-100"
                               : log.type === "Sent"
                                 ? "bg-purple-50 text-purple-500 border border-purple-100"
                                 : log.type === "Viewed"
                                   ? "bg-cyan-50 text-cyan-500 border border-cyan-100"
                                   : log.type === "Payment"
                                     ? "bg-green-50 text-green-500 border border-green-100"
                                     : "bg-yellow-50 text-yellow-500 border border-yellow-100"
                           }
                         `}
                          >
                            {log.type}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right text-xs italic text-slate-400 font-bold">
                          {log.created_at}
                        </td>
                      </tr>
                    ))
                  : payments.map((payment) => (
                      <tr
                        key={payment.id}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-8 py-5 text-sm font-bold italic text-mainText">
                          {payment.amount}
                        </td>
                        <td className="px-8 py-5 text-center text-sm italic font-bold text-mainText">
                          {payment.description}
                        </td>
                        <td className="px-8 py-5 text-center">
                          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-lg px-2 py-1">
                            <Paperclip className="w-3 h-3 text-blue-500" />
                            <span className="text-[10px] font-bold text-white bg-blue-500 w-4 h-4 rounded-full flex items-center justify-center">
                              {payment.attachments}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-right text-xs italic text-slate-400 font-bold">
                          {payment.created_at}
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>

          <div className="p-6 border-t border-slate-50 flex items-center justify-between">
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold italic text-slate-400 hover:bg-slate-50 transition-all">
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            <div className="flex gap-2">
              <button className="w-8 h-8 rounded-lg bg-blue-500 text-white flex items-center justify-center text-xs font-bold italic shadow-md shadow-blue-200">
                1
              </button>
              <button className="w-8 h-8 rounded-lg border border-slate-200 text-slate-400 flex items-center justify-center text-xs font-bold italic hover:bg-slate-50 transition-all">
                2
              </button>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-500 border border-blue-100 rounded-xl text-xs font-bold italic hover:bg-blue-100 transition-all">
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {isDeleteModalOpen && (
        <DeleteInvoiceModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          invoiceId={invoice.invoice_id}
          onConfirm={() => {
            toast.success("Invoice deleted");
            setIsDeleteModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default InvoiceDetailPage;
