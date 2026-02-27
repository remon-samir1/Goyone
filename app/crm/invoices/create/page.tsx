"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Pencil,
  FileText,
  User,
  Building2,
  Calendar,
  DollarSign,
  Tag,
  Loader2,
} from "lucide-react";
import Header from "../../header";
import { toast, Toaster } from "react-hot-toast";
import AddInvoiceItemModal, {
  InvoiceItem,
} from "@/components/modals/AddInvoiceItemModal";
import {
  getSellers,
  getAllLeads,
  getDeals,
  getCurrencies,
  createInvoice,
  getUsers,
} from "@/lib/api";
import { Search } from "lucide-react"; // Import Search icon

const CreateInvoicePage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);

  // Dropdown data
  const [sellers, setSellers] = useState<any[]>([]);
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
    date: new Date().toISOString().split("T")[0],
    due_date: "",
    type: "sale",
    status: "sent",
    currency_id: "",
    notes: "",
    is_activated: true,
    is_offer: false,
    send_email: false,
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
  }, []);

  const fetchInitialData = async () => {
    try {
      const [ usersData, currenciesData] = await Promise.all([
        // getSellers(),
        getUsers(),
        getCurrencies(),
      ]);
      // setSellers(sellersData);
      setUsers(usersData);
      setCurrencies(currenciesData);

      // Set fallback defaults if data exists
      if (currenciesData.length > 0) {
        setFormData((prev) => ({
          ...prev,
          currency_id: String(currenciesData[0].id),
        }));
      }

      if (usersData.length > 0) {
        const defaultUser = usersData[0];
        setFormData((prev) => ({
          ...prev,
          from_id: String(defaultUser.id),
        }));
        setFromSearchQuery(defaultUser.name || defaultUser.full_name);
      }

      // Initial fetch for the default for_type (Deal)
      fetchForEntities("", "App\\Models\\Deal");
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load some form data");
    }
  };

  // Fetch functions for searchable inputs
  const fetchFromEntities = async (query: string, type: string) => {
    setIsSearchingFrom(true);
    try {
      let data: any[] = [];
      data = await getUsers(query);

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
    const timer = setTimeout(() => {
      fetchFromEntities(fromSearchQuery, formData.from_type);
    }, 500);
    return () => clearTimeout(timer);
  }, [fromSearchQuery, formData.from_type]);

  // Debounced search for For Entity
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchForEntities(forSearchQuery, formData.for_type);
    }, 500);
    return () => clearTimeout(timer);
  }, [forSearchQuery, formData.for_type]);

  // Reset From Entity when From Type changes
  useEffect(() => {
    setFromSearchQuery("");
    setFormData((prev) => ({ ...prev, from_id: "" }));
  }, [formData.from_type]);

  // Reset For Entity when For Type changes
  useEffect(() => {
    setForSearchQuery("");
    setFormData((prev) => ({ ...prev, for_id: "" }));
  }, [formData.for_type]);

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

  const handleSubmit = async (e: React.FormEvent, stay = false) => {
    e.preventDefault();

    if (!formData.name || !formData.date || !formData.currency_id) {
      toast.error("Please fill in required fields");
      return;
    }

    setLoading(true);
    try {
      // Map back to App\Models\Lead for submission if Individual or Company was selected
      const submissionType =
        formData.for_type === "Individual" || formData.for_type === "Company"
          ? "App\\Models\\Lead"
          : formData.for_type;

      const payload = {
        ...formData,
        for_type: submissionType,
        total: grandTotal,
        discount: totalDiscount,
        vat: totalVAT,
        shipping: 0, // Not explicitly in UI but in API
        paid: 0,
        insert_in_to_inventory: 0,
        is_updated: 0,
        // Items would typically be sent too if the API supports it
        // items: items
      };

      await createInvoice(payload);
      toast.success("Invoice created successfully");

      if (stay) {
        setFormData({
          ...formData,
          uuid: "",
          name: "",
          phone: "",
          address: "",
          notes: "",
        });
        setItems([]);
      } else {
        router.push("/crm/invoices");
      }
    } catch (error: any) {
      console.error("Submission error:", error);
      toast.error(error.response?.data?.message || "Failed to create invoice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F8FC]">
      <Toaster position="top-right" />
      <Header Links={true} />

      <main className="px-[3%] py-8">
        <div className="flex items-center gap-2 mb-8 text-sm italic font-bold text-slate-400">
          <Link
            href="/crm/invoices"
            className="hover:text-primary transition-colors"
          >
            Invoices
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-mainText">Create Invoice</span>
        </div>

        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-2xl font-bold italic text-mainText">
              Create Invoice
            </h1>
            <p className="text-sm italic text-slate-400 mt-1">
              Generate a new invoice for your customer
            </p>
          </div>
        </div>

        <form className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-8">
            {/* Invoice Details */}
            <section className="bg-white rounded-[32px] p-8 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-lg font-bold text-mainText italic">
                  Invoice Details
                </h2>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-mainText italic">
                  Invoice ID
                </label>
                <input
                  type="text"
                  placeholder="INV-7856"
                  value={formData.uuid}
                  onChange={(e) =>
                    setFormData({ ...formData, uuid: e.target.value })
                  }
                  className="w-full border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary bg-[#F8FAFC]"
                />
              </div>
            </section>

            {/* From Information */}
            <section className="bg-white rounded-[32px] p-8 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-lg font-bold text-mainText italic">
                  From Information
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-mainText italic">
                    From Type
                  </label>
                  <select
                    value={formData.from_type}
                    onChange={(e) =>
                      setFormData({ ...formData, from_type: e.target.value })
                    }
                    className="w-full border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary bg-[#F8FAFC]"
                  >
                    <option value="default">Default</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-mainText italic">
                    From Entity
                  </label>
                  <div className="relative" ref={fromDropdownRef}>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search from entity"
                        value={fromSearchQuery}
                        onChange={(e) => {
                          setFromSearchQuery(e.target.value);
                          setIsFromDropdownOpen(true);
                        }}
                        onFocus={() => setIsFromDropdownOpen(true)}
                        className="w-full border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary bg-[#F8FAFC]"
                      />
                      {isSearchingFrom ? (
                        <div className="absolute right-4 top-3.5">
                          <Loader2 className="w-4 h-4 animate-spin text-primary" />
                        </div>
                      ) : (
                        <Search className="absolute right-4 top-3.5 w-4 h-4 text-body opacity-50" />
                      )}
                    </div>

                    {isFromDropdownOpen && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-[#F1F5F9] rounded-xl shadow-lg max-h-60 overflow-y-auto custom-scrollbar">
                        {fromEntities.length > 0 ? (
                          fromEntities.map((item) => (
                            <div
                              key={item.id}
                              className="px-4 py-2 text-sm text-body hover:bg-primary/5 cursor-pointer italic transition-colors"
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  from_id: String(item.id),
                                });
                                setFromSearchQuery(item.name || item.full_name);
                                setIsFromDropdownOpen(false);
                              }}
                            >
                              {item.name || item.full_name}
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-sm text-body italic opacity-50 text-center">
                            No results found
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Billed For */}
            <section className="bg-white rounded-[32px] p-8 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-lg font-bold text-mainText italic">
                  Billed For
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-mainText italic">
                    For Type
                  </label>
                  <select
                    value={formData.for_type}
                    onChange={(e) =>
                      setFormData({ ...formData, for_type: e.target.value })
                    }
                    className="w-full border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary bg-[#F8FAFC]"
                  >
                    <option value="Deals">Deals</option>
                    <option value="Individual">Individual Account</option>
                    <option value="Company">Company Account</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-mainText italic">
                    For Entity
                  </label>
                  <div className="relative" ref={forDropdownRef}>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search for entity"
                        value={forSearchQuery}
                        onChange={(e) => {
                          setForSearchQuery(e.target.value);
                          setIsForDropdownOpen(true);
                        }}
                        onFocus={() => setIsForDropdownOpen(true)}
                        className="w-full border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary bg-[#F8FAFC]"
                      />
                      {isSearchingFor ? (
                        <div className="absolute right-4 top-3.5">
                          <Loader2 className="w-4 h-4 animate-spin text-primary" />
                        </div>
                      ) : (
                        <Search className="absolute right-4 top-3.5 w-4 h-4 text-body opacity-50" />
                      )}
                    </div>

                    {isForDropdownOpen && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-[#F1F5F9] rounded-xl shadow-lg max-h-60 overflow-y-auto custom-scrollbar">
                        {forEntities.length > 0 ? (
                          forEntities.map((item) => (
                            <div
                              key={item.id}
                              className="px-4 py-2 text-sm text-body hover:bg-primary/5 cursor-pointer italic transition-colors"
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  for_id: String(item.id),
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
                          ))
                        ) : (
                          <div className="px-4 py-3 text-sm text-body italic opacity-50 text-center">
                            No results found
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Customer Information */}
            <section className="bg-white rounded-[32px] p-8 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-lg font-bold text-mainText italic">
                  Customer Information
                </h2>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-mainText italic">
                  Customer Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary bg-[#F8FAFC]"
                />
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
                    className="w-full border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary bg-[#F8FAFC]"
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
                    className="w-full border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary bg-[#F8FAFC]"
                  />
                </div>
              </div>
            </section>

            {/* Invoice Items */}
            <section className="bg-white rounded-[32px] p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-bold text-mainText italic">
                    Invoice Items
                  </h2>
                  <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-full">
                    {items.length} items
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsItemModalOpen(true)}
                  className="bg-primary text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold italic hover:bg-primary/90 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Add item
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-bold italic uppercase tracking-wider">
                      <th className="px-4 py-3 text-left">Item</th>
                      <th className="px-4 py-3 text-center">Qty</th>
                      <th className="px-4 py-3 text-right">Price</th>
                      <th className="px-4 py-3 text-right">Discount</th>
                      <th className="px-4 py-3 text-right">VAT</th>
                      <th className="px-4 py-3 text-right">Total</th>
                      <th className="px-4 py-3 text-center">Actions</th>
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
                          className="text-sm text-body italic group hover:bg-slate-50 transition-colors"
                        >
                          <td className="px-4 py-4 min-w-[200px]">
                            <div className="font-bold text-mainText">
                              {item.name}
                            </div>
                            <div className="text-xs text-slate-400 line-clamp-1">
                              {item.description}
                            </div>
                          </td>
                          <td className="px-4 py-4 text-center">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-4 text-right">
                            EGP{item.price.toFixed(2)}
                          </td>
                          <td className="px-4 py-4 text-right text-red-500">
                            -EGP{item.discount.toFixed(2)}
                          </td>
                          <td className="px-4 py-4 text-right text-green-500">
                            +EGP{item.vat.toFixed(2)}
                          </td>
                          <td className="px-4 py-4 text-right font-bold text-mainText">
                            EGP{item.total.toFixed(2)}
                          </td>
                          <td className="px-4 py-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                type="button"
                                className="p-1.5 text-slate-400 hover:text-primary transition-colors"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(item.id)}
                                className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
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
              <h2 className="text-lg font-bold text-mainText italic">Notes</h2>
              <textarea
                rows={4}
                placeholder="Add any additional notes or terms..."
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                className="w-full border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary bg-[#F8FAFC] resize-none"
              />
            </section>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4 space-y-8">
            {/* Invoice Metadata */}
            <section className="bg-white rounded-[32px] p-8 shadow-sm space-y-6">
              <h2 className="text-lg font-bold text-mainText italic tracking-tight">
                Invoice Metadata
              </h2>
              <div className="space-y-4">
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
                      className="w-full border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary bg-[#F8FAFC]"
                    />
                    <Calendar className="absolute right-4 top-3.5 w-4 h-4 text-body pointer-events-none opacity-50" />
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
                      className="w-full border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary bg-[#F8FAFC]"
                    />
                    <Calendar className="absolute right-4 top-3.5 w-4 h-4 text-body pointer-events-none opacity-50" />
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
                    className="w-full border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary bg-[#F8FAFC]"
                  >
                    <option value="push">Push invoice</option>
                    <option value="sale">Sale invoice</option>
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
                    className="w-full border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary bg-[#F8FAFC]"
                  >
                    <option value="sent">Sent</option>
                    <option value="paid">Paid</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="overdue">Overdue</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-mainText italic">
                    Currency <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.currency_id}
                    onChange={(e) =>
                      setFormData({ ...formData, currency_id: e.target.value })
                    }
                    className="w-full border border-[#F1F5F9] rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary bg-[#F8FAFC]"
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

            {/* Totals */}
            <section className="bg-white rounded-[32px] p-8 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Tag className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-lg font-bold text-mainText italic">
                  Totals
                </h2>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between text-sm italic py-2 border-b border-slate-50">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="font-bold text-mainText">
                    EGP{subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm italic py-2 border-b border-slate-50 text-red-500">
                  <span>Discount</span>
                  <span className="font-bold">
                    -EGP{totalDiscount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm italic py-2 border-b border-slate-50 text-green-500">
                  <span>VAT</span>
                  <span className="font-bold">+EGP{totalVAT.toFixed(2)}</span>
                </div>
                <div className="bg-green-50/50 p-4 rounded-2xl flex justify-between items-center italic">
                  <span className="font-bold text-mainText">Grand Total</span>
                  <span className="text-2xl font-bold text-primary">
                    EGP{grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </section>

            {/* Actions */}
            <div className="space-y-4">
              <button
                type="button"
                onClick={(e) => handleSubmit(e, false)}
                disabled={loading}
                className="w-full bg-primary text-white py-4 rounded-xl font-bold italic shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Create Invoice"
                )}
              </button>
              <button
                type="button"
                onClick={(e) => handleSubmit(e, true)}
                disabled={loading}
                className="w-full py-4 rounded-xl border border-primary text-primary font-bold italic hover:bg-white transition-all flex items-center justify-center"
              >
                Create & Create Another
              </button>
              <button
                type="button"
                onClick={() => router.push("/crm/invoices")}
                className="w-full py-4 rounded-xl border border-slate-200 text-slate-400 font-bold italic hover:bg-white transition-all flex items-center justify-center"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </main>

      <AddInvoiceItemModal
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        onAdd={handleAddItem}
      />
    </div>
  );
};

export default CreateInvoicePage;
