"use client";

import React, { useState } from "react";
import { X, Upload, FileText, Info } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";

interface PayInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: any;
}

const PayInvoiceModal: React.FC<PayInvoiceModalProps> = ({
  isOpen,
  onClose,
  invoice,
}) => {
  const [amount, setAmount] = useState("");
  const [destination, setDestination] = useState("");

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[1000]" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-3xl shadow-2xl z-[1001] animate-in fade-in zoom-in duration-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                <Info className="w-5 h-5 text-white" />
              </div>
              <Dialog.Title className="text-lg font-bold italic">
                Pay For Invoice
              </Dialog.Title>
            </div>
            <Dialog.Close asChild>
              <button className="text-slate-400 hover:text-slate-600 outline-none">
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          <div className="p-8 max-h-[80vh] overflow-y-auto scrollbar-thin">
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label className="text-sm font-bold italic text-slate-700">
                  Total
                </label>
                <input
                  type="text"
                  readOnly
                  value={`EGP ${invoice.total.toLocaleString()}`}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-500 italic outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold italic text-slate-700">
                  Paid
                </label>
                <input
                  type="text"
                  readOnly
                  value={`EGP ${invoice.paid.toLocaleString()}`}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-500 italic outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label className="text-sm font-bold italic text-slate-700 flex items-center gap-1">
                  Amount <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="3000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-600 italic focus:border-blue-500 outline-none transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold italic text-slate-700 flex items-center gap-1">
                  Cash Destination <span className="text-red-500">*</span>
                </label>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-400 italic focus:border-blue-500 outline-none transition-colors bg-white appearance-none"
                >
                  <option value="">Select an option</option>
                  <option value="bank">Bank Account</option>
                  <option value="cash">Cash</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label className="text-sm font-bold italic text-slate-700">
                  Phone
                </label>
                <input
                  type="text"
                  placeholder="010125632454"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-600 italic outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold italic text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-600 italic outline-none"
                />
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <label className="text-sm font-bold italic text-slate-700">
                Description
              </label>
              <textarea
                placeholder="Add payment notes or details..."
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-600 italic h-32 resize-none focus:border-blue-500 outline-none transition-colors"
              />
            </div>

            <div className="space-y-2 mb-8">
              <label className="text-sm font-bold italic text-slate-700">
                Attachments
              </label>
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-2">
                  <Upload className="w-5 h-5 text-blue-500" />
                </div>
                <p className="text-sm font-bold italic text-slate-700">
                  Drag & Drop files here
                </p>
                <p className="text-xs text-slate-400 italic">
                  or <span className="text-blue-500 underline">browse</span> to
                  upload
                </p>
              </div>

              <div className="mt-4 p-4 border border-slate-100 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold italic text-slate-700">
                      daily report (20) Jan.docx.pdf
                    </p>
                    <p className="text-[10px] text-slate-400 italic">
                      89.07 KB
                    </p>
                  </div>
                </div>
                <X className="w-4 h-4 text-slate-400 cursor-pointer" />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-slate-200 rounded-full font-bold italic text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-full font-bold italic hover:bg-blue-600 transition-colors">
                Confirm
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default PayInvoiceModal;
