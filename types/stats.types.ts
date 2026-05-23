import { InvoiceStatus } from "@prisma/client";

export type RevenueByMonth = { month: string; revenue: number };
export type CountByStatus = { status: InvoiceStatus; count: number };
export type RevenueByClient = { name: string; revenue: number };

export type StatsResponse = {
  totalRevenue: number;
  totalInvoices: number;
  totalClients: number;
  revenueByMonth: RevenueByMonth[];
  countByStatus: CountByStatus[];
  revenueByClient: RevenueByClient[];
  pendingRevenue: number;
};
