// Data Transfer Objects =>
// on type les données qu'on va transmettre du back au front

//  par exemple, on appelle un User de la db,
// on ne veut pas les infos de password, on veut juste l'id, l'email, le name, et l'avatarUrl

//  on sécurise les infos que l'on veut récuperer

// fonctionne aussi du front vers le back

import { InvoiceStatus } from "@prisma/client";

export type UserDTO = {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
};

export type InvoiceDTO = {
  id: string;
  number: number;
  amount: number;
  status: InvoiceStatus;
  dueDate: Date;
  clientId: string;
  createdAt: Date;
};

export type ClientDTO = {
  id: string;
  name: string;
  email: string | null;
  avatarUrl: string | null;
  createdAt: Date;
  company: string | null;
  phone: string | null;
};
