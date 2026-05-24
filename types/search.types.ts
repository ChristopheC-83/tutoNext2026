import { ClientDTO } from "./dto.types";

export type SearchClient = ClientDTO;
export type SearchInvoice = { id: string; name: string; number: number };

export type SearchResponse = {
  clients: SearchClient[];
  invoices: SearchInvoice[];
};

export type SearchResult =
  | (SearchClient & { type: "client" })
  | (SearchInvoice & { type: "invoice" });
