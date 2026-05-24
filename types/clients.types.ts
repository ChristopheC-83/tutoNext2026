import { ClientDTO } from "./dto.types";

export type ClientListItem = ClientDTO & {
  invoicesCount: number;
  overdueCount: number;
  totalAmount: number;
};

export type ClientListMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type ClientListStats = {
  totalClients: number;
};

export type ClientListResponse = {
  data: ClientListItem[];
  meta: ClientListMeta;
  stats: ClientListStats;
};
