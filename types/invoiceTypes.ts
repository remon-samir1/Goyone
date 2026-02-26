export interface InvoiceItem {
  id: number;
  item_name: string;
  description: string;
  price: number;
  vat: number;
  discount: number;
  qty: number;
  total: number;
}

export interface InvoiceLog {
  id: number;
  log: string;
  type: string;
  created_at: string;
}

export interface InvoicePayment {
  id: number;
  amount: number;
  description: string;
  attachments: number;
  created_at: string;
}

export interface Invoice {
  id: number;
  invoice_id: string;
  bill_from_name: string;
  bill_from_email: string;
  bill_to_name: string;
  bill_to_email: string;
  issue_date: string;
  due_date: string;
  status: string;
  type: string;
  sub_total: number;
  discount: number;
  tax: number;
  total: number;
  paid: number;
  balance_due: number;
  items: InvoiceItem[];
  logs?: InvoiceLog[];
  payments?: InvoicePayment[];
}
