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

//  on pourrait se passer des mappers et faire des requetes plus précises sur la DB
//  ok pour petit projet, mais pas pour grand projet
//  les DTO permettent de se concentrer sur les données qu'on veut transmettre au front
//  de centraliser les transformations de données
//  et de centraliser les validations
