import { ClientDTO, InvoiceDTO } from "./dto.types";

export type InvoiceWithClient = {
  invoiceDetails: InvoiceDTO;
  invoiceClient: Omit<ClientDTO, "createdAt" | "company" | "phone">;
};

export type InvoicesListData = InvoiceWithClient[];

export type InvoicesListStats = {
  revenue: number;
  paid: number;
  overdue: number;
  sent: number;
  draft: number;
};

export type InvoicesListMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type InvoicesList = {
  data: InvoicesListData;
  stats: InvoicesListStats;
  meta: InvoicesListMeta;
};

export type InvoiceUpdate = Omit<InvoiceDTO, "createdAt" | "clientId">;
