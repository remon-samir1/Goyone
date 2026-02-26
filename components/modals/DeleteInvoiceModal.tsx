"use client";

import React from "react";
import { Trash2, X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";

interface DeleteInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  invoiceId: string;
}

const DeleteInvoiceModal: React.FC<DeleteInvoiceModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  invoiceId,
}) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[1000]" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl z-[1001] animate-in fade-in zoom-in duration-200">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
              <Trash2 className="w-8 h-8 text-red-500" />
            </div>

            <Dialog.Title className="text-xl font-bold italic mb-2">
              Delete Invoice
            </Dialog.Title>
            <Dialog.Description className="text-slate-500 text-sm italic mb-8">
              Are you sure you want to delete invoice {invoiceId}?
              <br />
              This action cannot be undone.
            </Dialog.Description>

            <div className="flex gap-4 w-full">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-slate-200 rounded-full font-bold italic text-slate-600 hover:bg-slate-50 transition-colors"
              >
                No, Cancel
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 px-6 py-3 bg-[#EF4444] text-white rounded-full font-bold italic hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>

          <Dialog.Close asChild>
            <button className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 outline-none">
              <X className="w-5 h-5" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default DeleteInvoiceModal;
