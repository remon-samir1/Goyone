"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  Plus,
  Trash2,
  Pencil,
  FileText,
  User,
  Building2,
  Calendar,
  Loader2,
  Search,
  CheckCircle2,
  Eye,
} from "lucide-react";
import Header from "../../../header";
import { toast, Toaster } from "react-hot-toast";
import AddInvoiceItemModal, {
  InvoiceItem,
} from "@/components/modals/AddInvoiceItemModal";
import {
  getSellers,
  getAllLeads,
  getDeals,
  getCurrencies,
  updateInvoice,
  getUsers,
  getInvoice,
  deleteInvoice,
} from "@/lib/api";
import InvoiceSkeleton from "../InvoiceSkeleton";
import DeleteInvoiceModal from "@/components/modals/DeleteInvoiceModal";

const EditInvoicePage = ({ params }: { params: Promise<{ id: string }> }) => {
  const router = useRouter();
  const { id } = React.use(params);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Dropdown data
  const [users, setUsers] = useState<any[]>([]);
  const [currencies, setCurrencies] = useState<any[]>([]);

  // Search state for From Entity
  const [fromEntities, setFromEntities] = useState<any[]>([]);
  const [fromSearchQuery, setFromSearchQuery] = useState("");
  const [isFromDropdownOpen, setIsFromDropdownOpen] = useState(false);
  const [isSearchingFrom, setIsSearchingFrom] = useState(false);
  const fromDropdownRef = React.useRef<HTMLDivElement>(null);

  // Search state for For Entity
  const [forEntities, setForEntities] = useState<any[]>([]);
  const [forSearchQuery, setForSearchQuery] = useState("");
  const [isForDropdownOpen, setIsForDropdownOpen] = useState(false);
  const [isSearchingFor, setIsSearchingFor] = useState(false);
  const forDropdownRef = React.useRef<HTMLDivElement>(null);

  // Bottom table search state
  const [activeTab, setActiveTab] = useState<"logs" | "payments">("logs");
  const [searchQuery, setSearchQuery] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    uuid: "",
    from_type: "default",
    from_id: "",
    for_type: "Deals",
    for_id: "",
    name: "",
    phone: "",
    address: "",
    date: "",
    due_date: "",
    type: "sale",
    status: "sent",
    currency_id: "",
    user_id: "",
    notes: "",
    is_bank_transfer: false,
    is_activated: 0,
    is_offer: false,
    send_email: false,
    invoice_data: null as any, // Store raw response for logs/payments
  });

  const [items, setItems] = useState<InvoiceItem[]>([]);

  // Totals Calculation
  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0,
  );
  const totalDiscount = items.reduce((sum, item) => sum + item.discount, 0);
  const totalVAT = items.reduce((sum, item) => sum + item.vat, 0);
  const grandTotal = subtotal - totalDiscount + totalVAT;

  useEffect(() => {
    fetchInitialData();
  }, [id]);

  const formatDateForInput = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "";
    return date.toISOString().split("T")[0];
  };

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [usersData, currenciesData, invoiceData] = await Promise.all([
        getUsers(),
        getCurrencies(),
        getInvoice(id),
      ]);

      setUsers(usersData);
      setCurrencies(currenciesData);

      // Handle potential nesting and ensure we have the invoice object
      const inv =
        invoiceData?.data && typeof invoiceData.data === "object"
          ? invoiceData.data
          : invoiceData?.id
            ? invoiceData
            : null;

      // Map invoice data to form
      if (inv) {
        setFormData({
          uuid: inv.uuid || "",
          from_type: "default",
          from_id: String(inv.user_id || ""),
          for_type:
            inv.for_type === "App\\Models\\Deal"
              ? "Deals"
              : inv.for_type === "App\\Models\\Lead"
                ? "Individual"
                : "Deals",
          for_id: String(inv.for_id || ""),
          name: inv.name || "",
          phone: inv.phone || "",
          address: inv.address || "",
          date: formatDateForInput(inv.date),
          due_date: formatDateForInput(inv.due_date),
          type: inv.type?.toLowerCase() || "sale",
          status: inv.status?.toLowerCase() || "sent",
          currency_id: String(inv.currency_id || ""),
          user_id: String(inv.user_id || ""),
          notes: inv.notes || "",
          is_bank_transfer: !!inv.is_bank_transfer,
          is_activated: inv.is_activated || 0,
          is_offer: !!inv.is_offer,
          send_email: false,
          invoice_data: inv, // Store for tables
        });

        // Map items
        const invoiceItems =
          inv.invoices_items || inv.invoice_items || inv.items || [];
        if (Array.isArray(invoiceItems)) {
          setItems(
            invoiceItems.map((item: any) => ({
              id: String(item.id),
              name: item.item || item.name || "",
              description: item.description || "",
              price: Number(item.price),
              quantity: Number(item.qty),
              vat: Number(item.vat),
              discount: Number(item.discount),
              total: Number(item.total),
            })),
          );
        }

        // Set search queries for UI
        const fromUser = usersData.find(
          (u) => String(u.id) === String(inv.user_id),
        );
        if (fromUser) setFromSearchQuery(fromUser.name || fromUser.full_name);

        setForSearchQuery(inv.name || "");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load invoice data");
    } finally {
      setLoading(false);
    }
  };

  // Fetch functions for searchable inputs
  const fetchFromEntities = async (query: string) => {
    setIsSearchingFrom(true);
    try {
      const data = await getUsers(query);
      setFromEntities(data);
    } catch (error) {
      console.error("Error fetching from entities:", error);
    } finally {
      setIsSearchingFrom(false);
    }
  };

  const fetchForEntities = async (query: string, type: string) => {
    setIsSearchingFor(true);
    try {
      let data: any[] = [];
      if (type === "Deals") {
        data = await getDeals({ search: query });
      } else if (type === "Individual") {
        data = await getAllLeads(query, "contacts");
      } else if (type === "Company") {
        data = await getAllLeads(query, "companyAccounts");
      }
      setForEntities(data);
    } catch (error) {
      console.error("Error fetching for entities:", error);
    } finally {
      setIsSearchingFor(false);
    }
  };

  // Debounced search for From Entity
  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        fetchFromEntities(fromSearchQuery);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [fromSearchQuery, loading]);

  // Debounced search for For Entity
  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        fetchForEntities(forSearchQuery, formData.for_type);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [forSearchQuery, formData.for_type, loading]);

  // Click outside handler for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        forDropdownRef.current &&
        !forDropdownRef.current.contains(event.target as Node)
      ) {
        setIsForDropdownOpen(false);
      }
      if (
        fromDropdownRef.current &&
        !fromDropdownRef.current.contains(event.target as Node)
      ) {
        setIsFromDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddItem = (item: InvoiceItem) => {
    setItems([...items, item]);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.date || !formData.currency_id) {
      toast.error("Please fill in required fields");
      return;
    }

    setSaving(true);
    try {
      const submissionType =
        formData.for_type === "Individual" || formData.for_type === "Company"
          ? "App\\Models\\Lead"
          : "App\\Models\\Deal";

      const payload = {
        ...formData,
        due_date: formData.due_date || formData.date,
        user_id: formData.user_id || formData.from_id,
        for_type: submissionType,
        total: grandTotal,
        discount: totalDiscount,
        vat: totalVAT,
        items: items.map((item) => ({
          item: item.name,
          description: item.description,
          price: item.price,
          qty: item.quantity,
          vat: item.vat,
          discount: item.discount,
          total: item.total,
        })),
      };

      await updateInvoice(id, payload);
      toast.success("Invoice updated successfully");
      router.push(`/crm/invoices/${id}`);
    } catch (error: any) {
      console.error("Update error:", error);
      toast.error(error.response?.data?.message || "Failed to update invoice");
    } finally {
      setSaving(false);
    }
  };

  const currencySymbol =
    currencies?.find((c) => String(c.id) === String(formData.currency_id))
      ?.iso || "EGP";

  const inv = formData.invoice_data;
  const logs = inv?.invoice_logs || inv?.logs || [];
  const payments = (inv?.invoice_metas || inv?.metas || []).filter(
    (meta: any) =>
      meta.key?.toLowerCase() === "payments" ||
      meta.key?.toLowerCase() === "payment",
  );

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

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) return <InvoiceSkeleton />;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Toaster position="top-right" />
      <Header Links={true} />

      <main className="px-[3%] py-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 mb-8 text-sm italic font-bold text-slate-400">
          <Link
            href="/crm/invoices"
            className="hover:text-primary transition-colors"
          >
            Invoices
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link
            href={`/crm/invoices/${id}`}
            className="hover:text-primary transition-colors"
          >
            View Invoice
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-mainText">Edit Invoice</span>
        </div>

        {/* Top Header & Action Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold italic text-mainText">
              Edit Invoice
            </h1>
            <p className="text-sm italic text-slate-400 mt-1">
              Lorem ipsum dolor sit amet consectetur.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-bold italic text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
              <CheckCircle2 className="w-4 h-4" />
              Approve
            </button>
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(true)}
              className="flex items-center gap-2 bg-white text-red-500 border border-red-100 px-6 py-2.5 rounded-xl font-bold italic text-sm hover:bg-red-50 transition-all"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
            <Link
              href={`/crm/invoices/${id}`}
              className="flex items-center gap-2 bg-white text-slate-400 border border-slate-100 px-6 py-2.5 rounded-xl font-bold italic text-sm hover:bg-slate-50 transition-all"
            >
              <Eye className="w-4 h-4" />
              View
            </Link>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-8 space-y-8">
              {/* Invoice Details */}
              <section className="bg-white rounded-[32px] p-8 shadow-sm space-y-6">
                <h2 className="text-lg font-bold text-primary italic">
                  Invoice Details
                </h2>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-mainText italic">
                    Invoice ID
                  </label>
                  <input
                    disabled
                    type="text"
                    value={formData.uuid}
                    className="w-full border border-slate-100 rounded-2xl px-5 py-4 text-sm text-body italic focus:outline-none focus:border-primary bg-[#F8FAFC]"
                  />
                </div>
              </section>

              {/* From Information */}
              <section className="bg-white rounded-[32px] p-8 shadow-sm space-y-6">
                <h2 className="text-lg font-bold text-primary italic">
                  From Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-mainText italic">
                      From Type
                    </label>
                    <select
                      value={formData.from_type}
                      onChange={(e) =>
                        setFormData({ ...formData, from_type: e.target.value })
                      }
                      className="w-full border border-slate-100 rounded-2xl px-5 py-4 text-sm text-body italic focus:outline-none focus:border-primary bg-[#F8FAFC]"
                    >
                      <option value="default">Company</option>
                    </select>
                  </div>
                  <div className="space-y-2 md:col-span-1">
                    <label className="text-sm font-bold text-mainText italic">
                      From
                    </label>
                    <div className="relative" ref={fromDropdownRef}>
                      <input
                        type="text"
                        placeholder="Company name"
                        value={fromSearchQuery}
                        onChange={(e) => {
                          setFromSearchQuery(e.target.value);
                          setIsFromDropdownOpen(true);
                        }}
                        onFocus={() => setIsFromDropdownOpen(true)}
                        className="w-full border border-slate-100 rounded-2xl px-5 py-4 text-sm text-body italic focus:outline-none focus:border-primary bg-[#F8FAFC]"
                      />
                      {isSearchingFrom && (
                        <div className="absolute right-4 top-4">
                          <Loader2 className="w-4 h-4 animate-spin text-primary" />
                        </div>
                      )}
                      {isFromDropdownOpen && (
                        <div className="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl max-h-60 overflow-y-auto custom-scrollbar">
                          {fromEntities.map((item) => (
                            <div
                              key={item.id}
                              className="px-5 py-3 text-sm text-body hover:bg-primary/5 cursor-pointer italic transition-colors"
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  from_id: String(item.id),
                                  user_id: String(item.id),
                                });
                                setFromSearchQuery(item.name || item.full_name);
                                setIsFromDropdownOpen(false);
                              }}
                            >
                              {item.name || item.full_name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-mainText italic">
                      Branch
                    </label>
                    <input
                      type="text"
                      placeholder="Branch location"
                      className="w-full border border-slate-100 rounded-2xl px-5 py-4 text-sm text-body italic focus:outline-none focus:border-primary bg-[#F8FAFC]"
                    />
                  </div>
                </div>
              </section>

              {/* Billing Information */}
              <section className="bg-white rounded-[32px] p-8 shadow-sm space-y-6">
                <h2 className="text-lg font-bold text-primary italic">
                  Billing Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-mainText italic">
                      Billed From
                    </label>
                    <input
                      type="text"
                      placeholder="Lorem"
                      className="w-full border border-slate-100 rounded-2xl px-5 py-4 text-sm text-body italic focus:outline-none focus:border-primary bg-[#F8FAFC]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-mainText italic">
                      Contact Type
                    </label>
                    <input
                      type="text"
                      placeholder="Lorem"
                      className="w-full border border-slate-100 rounded-2xl px-5 py-4 text-sm text-body italic focus:outline-none focus:border-primary bg-[#F8FAFC]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-mainText italic">
                      Contact
                    </label>
                    <input
                      type="text"
                      placeholder="Lorem"
                      className="w-full border border-slate-100 rounded-2xl px-5 py-4 text-sm text-body italic focus:outline-none focus:border-primary bg-[#F8FAFC]"
                    />
                  </div>
                </div>
              </section>

              {/* Customer Information */}
              <section className="bg-white rounded-[32px] p-8 shadow-sm space-y-6">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-bold text-primary italic">
                    Customer Information
                  </h2>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-mainText italic">
                    Customer Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative" ref={forDropdownRef}>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={forSearchQuery}
                      onChange={(e) => {
                        setForSearchQuery(e.target.value);
                        setFormData({ ...formData, name: e.target.value });
                        setIsForDropdownOpen(true);
                      }}
                      onFocus={() => setIsForDropdownOpen(true)}
                      className="w-full border border-slate-100 rounded-2xl px-5 py-4 text-sm text-body italic focus:outline-none focus:border-primary bg-[#F8FAFC]"
                    />
                    {isSearchingFor && (
                      <div className="absolute right-4 top-4">
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      </div>
                    )}
                    {isForDropdownOpen && (
                      <div className="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl max-h-60 overflow-y-auto custom-scrollbar">
                        {forEntities.map((item) => (
                          <div
                            key={item.id}
                            className="px-5 py-3 text-sm text-body hover:bg-primary/5 cursor-pointer italic transition-colors"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                for_id: String(item.id),
                                name:
                                  item.name ||
                                  item.full_name ||
                                  item.company_name,
                              });
                              setForSearchQuery(
                                item.name ||
                                  item.full_name ||
                                  item.company_name,
                              );
                              setIsForDropdownOpen(false);
                            }}
                          >
                            {item.name || item.full_name || item.company_name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-mainText italic">
                      Phone
                    </label>
                    <input
                      type="text"
                      placeholder="+1234567890"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full border border-slate-100 rounded-2xl px-5 py-4 text-sm text-body italic focus:outline-none focus:border-primary bg-[#F8FAFC]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-mainText italic">
                      Address
                    </label>
                    <input
                      type="text"
                      placeholder="Customer address"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      className="w-full border border-slate-100 rounded-2xl px-5 py-4 text-sm text-body italic focus:outline-none focus:border-primary bg-[#F8FAFC]"
                    />
                  </div>
                </div>
              </section>

              {/* Invoice Items */}
              <section className="bg-white rounded-[32px] p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-bold text-primary italic">
                      Invoice Items
                    </h2>
                    <span className="bg-primary/10 text-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                      {items.length} items
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsItemModalOpen(true)}
                    className="bg-primary text-white px-6 py-2.5 rounded-xl flex items-center gap-2 text-sm font-bold italic hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                  >
                    <Plus className="w-4 h-4" />
                    Add item
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-slate-50 text-[10px] text-slate-400 font-bold italic uppercase tracking-wider">
                        <th className="px-4 py-4 text-left">Item</th>
                        <th className="px-4 py-4 text-center">Qty</th>
                        <th className="px-4 py-4 text-center">Price</th>
                        <th className="px-4 py-4 text-center">Discount</th>
                        <th className="px-4 py-4 text-center">VAT</th>
                        <th className="px-4 py-4 text-center">Total</th>
                        <th className="px-4 py-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {items.length === 0 ? (
                        <tr>
                          <td
                            colSpan={7}
                            className="px-4 py-12 text-center text-slate-400 italic"
                          >
                            No items added yet. Click &quot;Add item&quot; to
                            start.
                          </td>
                        </tr>
                      ) : (
                        items.map((item) => (
                          <tr
                            key={item.id}
                            className="text-sm text-body italic group hover:bg-slate-50/50 transition-colors"
                          >
                            <td className="px-4 py-6 min-w-[200px]">
                              <div className="font-bold text-mainText">
                                {item.name}
                              </div>
                              <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                                {item.description}
                              </div>
                            </td>
                            <td className="px-4 py-6 text-center font-medium">
                              {item.quantity}
                            </td>
                            <td className="px-4 py-6 text-center font-medium">
                              {currencySymbol}
                              {item.price.toFixed(2)}
                            </td>
                            <td className="px-4 py-6 text-center font-medium text-red-400">
                              {currencySymbol}
                              {item.discount.toFixed(2)}
                            </td>
                            <td className="px-4 py-6 text-center font-medium">
                              {currencySymbol}
                              {item.vat.toFixed(2)}
                            </td>
                            <td className="px-4 py-6 text-center font-bold text-mainText">
                              {currencySymbol}
                              {item.total.toFixed(2)}
                            </td>
                            <td className="px-4 py-6 text-center">
                              <div className="flex items-center justify-center gap-3">
                                <button
                                  type="button"
                                  className="p-1.5 text-slate-300 hover:text-primary transition-colors"
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveItem(item.id)}
                                  className="p-1.5 text-slate-300 hover:text-red-500 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Notes */}
              <section className="bg-white rounded-[32px] p-8 shadow-sm space-y-6">
                <h2 className="text-lg font-bold text-primary italic">Notes</h2>
                <textarea
                  rows={4}
                  placeholder="Lorem ipsum dolor sit amet consectetur. Dolor eget sit faucibus non mattis tristique neque mauris."
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="w-full border border-slate-100 rounded-2xl px-5 py-4 text-sm text-body italic focus:outline-none focus:border-primary bg-[#F8FAFC] resize-none"
                />
              </section>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-4 space-y-8">
              {/* Invoice Metadata */}
              <section className="bg-white rounded-[32px] p-8 shadow-sm space-y-6">
                <h2 className="text-lg font-bold text-primary italic">
                  Invoice Metadata
                </h2>
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-mainText italic">
                      Date <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) =>
                          setFormData({ ...formData, date: e.target.value })
                        }
                        className="w-full border border-slate-100 rounded-2xl px-5 py-4 text-sm text-body italic focus:outline-none focus:border-primary bg-[#F8FAFC]"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-mainText italic">
                      Due Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={formData.due_date}
                        onChange={(e) =>
                          setFormData({ ...formData, due_date: e.target.value })
                        }
                        className="w-full border border-slate-100 rounded-2xl px-5 py-4 text-sm text-body italic focus:outline-none focus:border-primary bg-[#F8FAFC]"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-mainText italic">
                      Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value })
                      }
                      className="w-full border border-slate-100 rounded-2xl px-5 py-4 text-sm text-body italic focus:outline-none focus:border-primary bg-[#F8FAFC]"
                    >
                      <option value="sale">Sale invoice</option>
                      <option value="push">Push invoice</option>
                      <option value="estimate">Estimate</option>
                      <option value="saleorder">Sales Order</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-mainText italic">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      className="w-full border border-slate-100 rounded-2xl px-5 py-4 text-sm text-body italic focus:outline-none focus:border-primary bg-[#F8FAFC]"
                    >
                      <option value="draft">Draft</option>
                      <option value="sent">Sent</option>
                      <option value="paid">Paid</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="overdue">Overdue</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-mainText italic">
                      Currency
                    </label>
                    <select
                      value={formData.currency_id}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          currency_id: e.target.value,
                        })
                      }
                      className="w-full border border-slate-100 rounded-2xl px-5 py-4 text-sm text-body italic focus:outline-none focus:border-primary bg-[#F8FAFC]"
                    >
                      <option value="">Select currency</option>
                      {currencies?.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.iso})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </section>

              {/* Totals Section */}
              <section className="bg-white rounded-[32px] p-8 shadow-sm space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-primary" />
                  </div>
                  <h2 className="text-lg font-bold text-primary italic">
                    Totals
                  </h2>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm italic">
                    <span className="font-bold text-slate-400">Subtotal</span>
                    <span className="font-bold text-mainText">
                      {currencySymbol}
                      {subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm italic border-b border-slate-50 pb-4">
                    <span className="font-bold text-slate-400">Discount</span>
                    <span className="font-bold text-red-400">
                      -{currencySymbol}
                      {totalDiscount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm italic">
                    <span className="font-bold text-slate-400">VAT</span>
                    <span className="font-bold text-mainText">
                      {currencySymbol}
                      {totalVAT.toLocaleString()}
                    </span>
                  </div>
                  <div className="pt-2">
                    <div className="bg-green-50/50 rounded-2xl p-4 flex justify-between items-center">
                      <span className="text-sm font-bold text-mainText italic">
                        Grand Total
                      </span>
                      <span className="text-xl font-bold text-green-500 italic">
                        {currencySymbol}
                        {grandTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Bottom Tabs & Searchable Tables */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setActiveTab("logs")}
                className={`px-6 py-2 rounded-xl text-sm font-bold italic transition-all ${
                  activeTab === "logs"
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "bg-white text-slate-400 hover:bg-slate-50"
                }`}
              >
                Invoice Logs
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("payments")}
                className={`px-6 py-2 rounded-xl text-sm font-bold italic transition-all ${
                  activeTab === "payments"
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "bg-white text-slate-400 hover:bg-slate-50"
                }`}
              >
                Payments
              </button>
            </div>

            <div className="bg-white rounded-[32px] p-8 shadow-sm space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder={`Search ${activeTab}...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#F8FAFC] border-none rounded-2xl pl-11 pr-4 py-3.5 text-sm text-body italic focus:outline-none focus:ring-1 focus:ring-primary/20"
                  />
                </div>
                <div className="flex items-center gap-4 text-xs italic font-bold text-slate-400">
                  <button
                    type="button"
                    className="text-primary hover:underline"
                  >
                    Select all
                  </button>
                  <span>
                    Showing 1-
                    {activeTab === "logs"
                      ? filteredLogs.length
                      : filteredPayments.length}{" "}
                    of {activeTab === "logs" ? logs.length : payments.length}{" "}
                    results
                  </span>
                </div>
              </div>

              {activeTab === "logs" ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-slate-50 text-[10px] text-slate-400 font-bold italic uppercase tracking-wider">
                        <th className="w-12 px-4 py-4">
                          <input type="checkbox" className="rounded-md" />
                        </th>
                        <th className="px-4 py-4 text-left">Log</th>
                        <th className="px-4 py-4 text-center">Type</th>
                        <th className="px-4 py-4 text-right">Created At</th>
                        <th className="w-12 px-4 py-4"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredLogs.length > 0 ? (
                        filteredLogs.map((log: any) => (
                          <tr
                            key={log.id}
                            className="text-sm text-body italic hover:bg-slate-50/50 transition-colors"
                          >
                            <td className="px-4 py-6 text-center">
                              <input type="checkbox" className="rounded-md" />
                            </td>
                            <td className="px-4 py-6 font-bold text-mainText">
                              {log.log}
                            </td>
                            <td className="px-4 py-6 text-center">
                              <span
                                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                                  log.type === "Created"
                                    ? "bg-blue-50 text-blue-500"
                                    : log.type === "Sent"
                                      ? "bg-purple-50 text-purple-500"
                                      : log.type === "Viewed"
                                        ? "bg-cyan-50 text-cyan-500"
                                        : log.type === "Payment"
                                          ? "bg-green-50 text-green-500"
                                          : "bg-orange-50 text-orange-500"
                                }`}
                              >
                                {log.type}
                              </span>
                            </td>
                            <td className="px-4 py-6 text-right text-slate-400 font-medium">
                              {formatDate(log.created_at)} 10:30 AM
                            </td>
                            <td className="px-4 py-6 text-center">
                              <button
                                type="button"
                                className="text-slate-300 hover:text-red-500"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-4 py-12 text-center text-slate-400 italic"
                          >
                            No logs found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-slate-50 text-[10px] text-slate-400 font-bold italic uppercase tracking-wider">
                        <th className="w-12 px-4 py-4">
                          <input type="checkbox" className="rounded-md" />
                        </th>
                        <th className="px-4 py-4 text-left">Amount</th>
                        <th className="px-4 py-4 text-left">Description</th>
                        <th className="px-4 py-4 text-center">Attachments</th>
                        <th className="px-4 py-4 text-right">Date</th>
                        <th className="w-12 px-4 py-4"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredPayments.length > 0 ? (
                        filteredPayments.map((payment: any) => (
                          <tr
                            key={payment.id}
                            className="text-sm text-body italic hover:bg-slate-50/50 transition-colors"
                          >
                            <td className="px-4 py-6 text-center">
                              <input type="checkbox" className="rounded-md" />
                            </td>
                            <td className="px-4 py-6 font-bold text-mainText">
                              {currencySymbol}
                              {(
                                payment.value ||
                                payment.amount ||
                                0
                              ).toLocaleString()}
                            </td>
                            <td className="px-4 py-6 text-slate-400 font-medium">
                              {payment.description || payment.note || "N/A"}
                            </td>
                            <td className="px-4 py-6 text-center font-bold text-primary">
                              {payment.attachments?.length || 0}
                            </td>
                            <td className="px-4 py-6 text-right text-slate-400 font-medium">
                              {formatDate(payment.created_at)}
                            </td>
                            <td className="px-4 py-6 text-center">
                              <button
                                type="button"
                                className="text-slate-300 hover:text-red-500"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-4 py-12 text-center text-slate-400 italic"
                          >
                            No payments recorded
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination Placeholder */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-50">
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-bold italic text-slate-400 hover:text-primary transition-colors flex items-center gap-2"
                >
                  <ChevronRight className="w-4 h-4 rotate-180" /> Previous
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="w-8 h-8 rounded-lg bg-primary text-white text-xs font-bold italic"
                  >
                    1
                  </button>
                  <button
                    type="button"
                    className="w-8 h-8 rounded-lg bg-white border border-slate-100 text-slate-400 text-xs font-bold italic hover:bg-slate-50"
                  >
                    2
                  </button>
                </div>
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-bold italic text-slate-400 hover:text-primary transition-colors flex items-center gap-2"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center gap-4 pt-8">
            <button
              type="submit"
              disabled={saving}
              className="bg-primary text-white px-10 py-3.5 rounded-2xl font-bold italic shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 min-w-[200px]"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
            <Link
              href={`/crm/invoices/${id}`}
              className="bg-white text-slate-400 px-10 py-3.5 rounded-2xl font-bold italic border border-slate-100 hover:bg-slate-50 transition-all min-w-[200px] text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </main>

      <AddInvoiceItemModal
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        onAdd={handleAddItem}
      />

      <DeleteInvoiceModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        invoiceId={inv?.id}
        onConfirm={async () => {
          try {
            await deleteInvoice(id);
            toast.success("Invoice deleted successfully");
            router.push("/crm/invoices");
          } catch (error) {
            toast.error("Failed to delete invoice");
          }
          setIsDeleteModalOpen(false);
        }}
      />
    </div>
  );
};

export default EditInvoicePage;
