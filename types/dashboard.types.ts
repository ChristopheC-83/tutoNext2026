import { InvoiceWithClient } from "./invoices.types";

// KPI = Key Performance Indicator
// une métrique qui permet de mesurer la performance d’un système

export enum KpiTitle {
  INVOICES = "INVOICES",
  REVENUE = "REVENUE",
  PENDING = "PENDING",
  OVERDUE = "OVERDUE",
  CLIENTS = "CLIENTS",
  PAID = "PAID",
  SENT = "SENT",
  DRAFT = "DRAFT",
}

export type DashboardResponse = {
  totalInvoices: number;
  clientsCount: number;
  revenue: number;
  pending: number;
  overdue: number;
  latestInvoices: InvoiceWithClient[];
};
