export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  classification: "Hardware" | "Components" | "Labor";
}

export interface Invoice {
  id: string;
  number: string;
  workOrderId: string;
  bookingId: string;
  customerName: string;
  technicianName: string;
  date: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  txHash?: string;
  escrowReleased: boolean;
}
