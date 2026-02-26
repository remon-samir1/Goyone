"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InvoiceItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
  discount: number;
  vat: number;
  total: number;
}

interface AddInvoiceItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: InvoiceItem) => void;
}

const AddInvoiceItemModal: React.FC<AddInvoiceItemModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    quantity: 1,
    price: 0,
    discount: 0,
    vat: 0,
  });

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const subtotal = formData.quantity * formData.price;
  const discountAmount = formData.discount;
  const vatAmount = formData.vat;
  const itemTotal = subtotal - discountAmount + vatAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    onAdd({
      id: Math.random().toString(36).substr(2, 9),
      ...formData,
      total: itemTotal,
    });
    setFormData({
      name: "",
      description: "",
      quantity: 1,
      price: 0,
      discount: 0,
      vat: 0,
    });
    onClose();
  };

  if (!shouldRender) return null;

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-opacity duration-300 ease-in-out",
        isAnimating ? "opacity-100" : "opacity-0",
      )}
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className={cn(
          "relative bg-white rounded-3xl w-full max-w-md shadow-2xl transform transition-all duration-300 ease-out flex flex-col",
          isAnimating ? "scale-100 translate-y-0" : "scale-95 translate-y-4",
        )}
      >
        <div className="p-6 flex items-center justify-between border-b border-[#F1F5F9]">
          <h2 className="text-xl font-bold text-mainText italic">
            Add Invoice Item
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-body" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-bold text-mainText italic">
              Item Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Web Design Service, Product Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full border border-[#F1F5F9] rounded-xl px-4 py-2 text-sm text-body focus:outline-none focus:border-primary bg-[#F8FAFC]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-mainText italic">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Add item description or details..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full border border-[#F1F5F9] rounded-xl px-4 py-2 text-sm text-body focus:outline-none focus:border-primary bg-[#F8FAFC] resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-bold text-mainText italic">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quantity: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full border border-[#F1F5F9] rounded-xl px-4 py-2 text-sm text-body focus:outline-none focus:border-primary bg-[#F8FAFC]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-mainText italic">
                Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-body opacity-50">
                  $
                </span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full border border-[#F1F5F9] rounded-xl pl-7 pr-4 py-2 text-sm text-body focus:outline-none focus:border-primary bg-[#F8FAFC]"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-bold text-mainText italic">
                Discount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-body opacity-50">
                  $
                </span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.discount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      discount: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full border border-[#F1F5F9] rounded-xl pl-7 pr-4 py-2 text-sm text-body focus:outline-none focus:border-primary bg-[#F8FAFC]"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-mainText italic">
                VAT (Tax)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-body opacity-50">
                  $
                </span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.vat}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      vat: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full border border-[#F1F5F9] rounded-xl pl-7 pr-4 py-2 text-sm text-body focus:outline-none focus:border-primary bg-[#F8FAFC]"
                />
              </div>
            </div>
          </div>

          <div className="bg-[#F8FAFC] rounded-2xl p-4 border border-[#F1F5F9] space-y-2">
            <div className="flex items-center justify-between text-xs italic font-bold text-body">
              <span>Calculation Summary</span>
            </div>
            <div className="flex justify-between text-sm italic">
              <span className="text-slate-500">
                Subtotal ({formData.quantity} × ${formData.price})
              </span>
              <span className="font-bold text-mainText">
                ${subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm italic text-red-500">
              <span>Discount</span>
              <span className="font-bold">-${discountAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm italic text-green-500">
              <span>VAT</span>
              <span className="font-bold">+${vatAmount.toFixed(2)}</span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between items-center italic">
              <span className="font-bold text-mainText">Item Total</span>
              <span className="text-lg font-bold text-primary">
                ${itemTotal.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-6 rounded-full border border-slate-200 font-bold italic text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-6 rounded-full bg-primary text-white font-bold italic hover:bg-primary/90 transition-all shadow-lg shadow-primary/30"
            >
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
};

export default AddInvoiceItemModal;
