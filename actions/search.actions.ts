"use server";

import { requireUser } from "@/lib/auth/requireUser";
import { toClientDTO } from "@/lib/mappers/client.mapper";
import { prisma } from "@/lib/prisma";
import { SearchClient, SearchInvoice, SearchResponse } from "@/types";

export async function searchAction(
  queryParam: string, // un terme de recherche au format string
): Promise<SearchResponse> {
  // On valide l'user connecté
  const user = await requireUser();

  // On récupère le terme recherché avec nettoyage
  const query = (queryParam ?? "").trim().toLowerCase();

  //  si pas de query, on sort
  //  mais proprement, avec des clients et des factures vides
  if (!query) {
    return { clients: [], invoices: [] };
  }

  //  query est il un nombre ?
  const numberizedQuery = Number(query);
  const isQueryANumber = !isNaN(numberizedQuery);

  // on lance les recherches en parrallele dans les tables invoices et clients
  //  promise.all => effectue toutes les recherches en parallèle
  //  ça va plus vite, mais
  // si une requete échoue, l'ensemble des requetes va echouer
  const [clientsRaw, invoicesRaw] = await Promise.all([
    prisma.client.findMany({
      where: {
        userId: user.userId,
        // le OR s'applique à l'intérieur du tableau, pas entre userID et la suite !
        //    Attention, différent de SQL !
        OR: [
          { name: { contains: query, mode: "insensitive" } }, // insensitive => case insensitive
          { email: { contains: query, mode: "insensitive" } },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    }),
    prisma.invoice.findMany({
      where: {
        userId: user.userId,
        OR: [
          ...(isQueryANumber ? [{ number: numberizedQuery }] : []),
          { client: { name: { contains: query, mode: "insensitive" } } },
          { client: { email: { contains: query, mode: "insensitive" } } },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
      select: {
        id: true,
        number: true,
        client: {
          select: {
            name: true,
          },
        },
      },
    }),
  ]);

  // on compile/prépare les resultats
  const clients: SearchClient[] = clientsRaw.map((c) => toClientDTO(c));
  const invoices: SearchInvoice[] = invoicesRaw.map((i) => ({
    id: i.id,
    name: i.client.name,
    number: i.number,
  }));
  //on renvoie les resultats
  return { clients, invoices };
}
