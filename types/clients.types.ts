import { ClientDTO } from "./dto.types";

export type ClientListItem = ClientDTO & {
  invoicesCount: number;
  overdueCount: number;
  totalAmount: number;
};

// pour la pagination

export type ClientListMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type ClientListStats = {
  totalClients: number;
};

//  et un type qui les regroupe

export type ClientListResponse = {
  data: ClientListItem[];
  meta: ClientListMeta; // pour la pagination
  stats: ClientListStats; 
};
