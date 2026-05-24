import { ClientDTO } from "@/types";
import { Client } from "@prisma/client";

// on transforme un client de la DB en client DTO
export function toClientDTO(client: Client): ClientDTO {
  return {
    id: client.id,
    name: client.name,
    email: client.email,
    avatarUrl: client.avatarUrl,
    createdAt: client.createdAt,
    company: client.company,
    phone: client.phone,
  };
}
