"use server";

import { requireUser } from "@/lib/auth/requireUser";
import { processAvatarFile } from "@/lib/filesystem/img-processor";
import { toClientDTO } from "@/lib/mappers/client.mapper";
import { normalizePagination } from "@/lib/pagination/pagination";
import { prisma } from "@/lib/prisma";

import {
  clientSchema,
  clientUpdateSchema,
  CreateClientInputsType,
  UpdateClientInputsType,
} from "@/lib/validations/clients.schemas";
import { ClientDTO, ClientListItem, ClientListResponse } from "@/types";
import { revalidatePath } from "next/cache";

export async function getOneClientAction({
  id,
}: {
  id: string;
}): Promise<ClientDTO> {
  // on valide le user connecté
  const user = await requireUser();

  // on appelle le client en DB avec l'id récupéré en parametre de la fonction
  const clientDB = await prisma.client.findFirst({
    where: { id: id, userId: user.userId },
  });

  // si pas de client <=> id
  if (!clientDB) {
    throw new Error("No matching client");
  }
  // on mappe le client avec le mapperDTO pour sécuriser les données envoyées au front
  const client = toClientDTO(clientDB);

  //Return
  return client;
}



export async function createClientAction(
  payload: CreateClientInputsType,
): Promise<ClientDTO> {
  //User guard
  const user = await requireUser();
  //Valid with zod
  const parsed = clientSchema.safeParse(payload);
  if (!parsed.success) {
    console.log(parsed);
    throw new Error("Invalid data");
  }
  const { file, ...data } = parsed.data;
  //Save avatar image
  const avatarUrl = await processAvatarFile("client", file);
  // on envoie à la DB
  const client = await prisma.client.create({
    data: { ...data, userId: user.userId, avatarUrl },
  });
  //Buffer
    const createdClient = toClientDTO(client);
    
  // on refraichit la page avec des données fraiches, ici le nouveau client
  revalidatePath("/clients");
  //Return
  return createdClient;
}




export async function patchOneClientAction({
  id,
  payload,
}: {
  id: string;
  payload: UpdateClientInputsType;
}): Promise<ClientDTO> {
  //User guard
  const user = await requireUser();
  //Fetch client
  const existingClient = await prisma.client.findFirst({
    where: { id: id, userId: user.userId },
  });
  //If no client
  if (!existingClient) {
    throw new Error("No matching client");
  }
  //Valid with zod
  const parsed = clientUpdateSchema.safeParse(payload);
  if (!parsed.success) {
    console.log(parsed);
    throw new Error("Invalid data");
  }
  const { file, ...data } = parsed.data;
  //Save avatar image
  const avatarUrl = await processAvatarFile("client", file);
  //Call DB
  const updatedClient = await prisma.client.update({
    where: { id: id },
    data: { ...data, ...(avatarUrl ? { avatarUrl } : {}) },
  });
  //Buffer
  const updatedClientMapped = toClientDTO(updatedClient);
  //Revalidate path
  revalidatePath("/clients");
  //Return
  return updatedClientMapped;
}



//  récupérer tous les clients en version paginée
export async function getAllClientsAction({
  page = 1,
  limit = 10,
}: {
  page?: number | string | null;
  limit?: number | string | null;
}): Promise<ClientListResponse> {
  //User guard
  const user = await requireUser();
  //Inputs
  const { safePage, safeLimit } = normalizePagination(page, limit);
  const skip = (safePage - 1) * safeLimit;
  //Fetch raw data
  const [clientsRaw, total] = await Promise.all([
    prisma.client.findMany({
      where: { userId: user.userId },
      orderBy: { createdAt: "desc" }, // createdArt et desc pourraient etre des parametres variables
      skip,
      take: safeLimit,
      include: { invoices: true },
    }),
    prisma.client.count({ where: { userId: user.userId } }),
  ]);
  //Refine data
  const clients: ClientListItem[] = clientsRaw.map(
    (client: (typeof clientsRaw)[number]) => {
      const mappedClient: ClientDTO = toClientDTO(client);
      const invoicesCount = client.invoices.length;
      const overdueCount = client.invoices.filter(
        (inv) => inv.status === "OVERDUE",
      ).length;
      const totalAmount = client.invoices.reduce(
        (sum, inv) => sum + inv.amount,
        0,
      );
      return {
        ...mappedClient,
        invoicesCount,
        overdueCount,
        totalAmount,
      };
    },
  );
  //Return
  return {
    data: clients,
    meta: {
      total,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.ceil(total / safeLimit),
    },
    stats: { totalClients: total },
  };
}
