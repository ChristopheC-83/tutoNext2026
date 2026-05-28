"use server";

import { requireUser } from "@/lib/auth/requireUser";
import { normalizePagination } from "@/lib/pagination/pagination";
import { prisma } from "@/lib/prisma";
import {
  CreateInvoiceInputsType,
  createInvoiceSchema,
  UpdateInvoiceInputsType,
  updateInvoiceSchema,
} from "@/lib/validations/invoices.schemas";
import { InvoicesList, InvoiceWithClient } from "@/types";
import { revalidatePath } from "next/cache";

export async function getOneInvoiceAction({
  id,
}: {
  id: string;
}): Promise<InvoiceWithClient | null> {
  // comme d'habitude , on Checke user
  const user = await requireUser();
  // Call DB// pour ma part, j'aurais préféré tout récupérer
  // et mapper grace à un DTO, c'est un peu long là...
  const invoiceDB = await prisma.invoice.findFirst({
    where: { id: id, userId: user.userId },
    select: {
      id: true,
      number: true,
      status: true,
      amount: true,
      dueDate: true,
      createdAt: true,
      clientId: true,
      client: {
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
        },
      },
    },
  });
  //If not found
  if (!invoiceDB) {
    return null;
    // throw new Error("No matching invoice");
  }
  //Rearrange data
  const invoice: InvoiceWithClient = {
    invoiceDetails: {
      id: invoiceDB.id,
      number: invoiceDB.number,
      amount: invoiceDB.amount,
      status: invoiceDB.status,
      dueDate: invoiceDB.dueDate,
      clientId: invoiceDB.clientId,
      createdAt: invoiceDB.createdAt,
    },
    invoiceClient: {
      id: invoiceDB.client.id,
      name: invoiceDB.client.name,
      email: invoiceDB.client.email,
      avatarUrl: invoiceDB.client.avatarUrl,
    },
  };
  //Return
  return invoice;
}

export async function patchOneInvoiceAction({
  id,
  payload,
}: {
  id: string;
  payload: UpdateInvoiceInputsType;
}) {
  //Check user
  const user = await requireUser();
  //Check inputs
  const parsed = updateInvoiceSchema.safeParse(payload);
  //  si echec parsing
  if (!parsed.success) {
    throw new Error("Invalid inputs");
  }

  //  si parsing ok
  const { status, dueDate, amount } = parsed.data;
  //Check if invoice with id exists
  const invoiceDB = await prisma.invoice.findFirst({
    where: { id: id, userId: user.userId },
  });
  //  si pas de invoice, on lance une erreur
  if (!invoiceDB) {
    throw new Error("No matching invoice");
  }
  //on fait la mise à jour
  await prisma.invoice.update({
    where: { id: id },
    data: { status, amount, dueDate },
  });
  //Revalidate path
  revalidatePath("/invoices");
}

export async function deleteOneInvoiceAction({ id }: { id: string }) {
  //Check user
  const user = await requireUser();
  //Check if invoice with id exists
  const invoiceDB = await prisma.invoice.findFirst({
    where: { id: id, userId: user.userId },
  });
  if (!invoiceDB) {
    throw new Error("No matching invoice");
  }
  //Delete invoice
  await prisma.invoice.delete({
    where: { id: id, userId: user.userId },
  });
  //Revalidate path
  revalidatePath("/invoices");
}

export async function createInvoiceAction(payload: CreateInvoiceInputsType) {
  //Check user
  const user = await requireUser();
  //Check inputs
  const parsed = createInvoiceSchema.safeParse(payload);
  if (!parsed.success) {
    throw new Error("Invalid inputs");
  }
  const { clientId, status, amount, dueDate } = parsed.data;
  //Retrieve and check the client concerned
  const client = await prisma.client.findFirst({
    where: {
      id: clientId,
      userId: user.userId,
    },
  });
  if (!client) {
    throw new Error("Client not found");
  }
  //Check last invoice number
  const latestInvoice = await prisma.invoice.findFirst({
    where: { userId: user.userId },
    orderBy: { number: "desc" },
    select: { number: true }, // on ne prend que les number, c'est seulement ce qui nous interesse ici
  });
    //  s'il y a au moins un number, on fait +1, si non , on donne la valeur de 1
  const nextNumber = latestInvoice ? latestInvoice.number + 1 : 1;
  //Create in db invoice
  await prisma.invoice.create({
    data: {
      number: nextNumber,
      amount: amount,
      dueDate: dueDate,
      userId: user.userId,
      clientId: clientId,
      status: status,
    },
  });
  //Revalidate path
  revalidatePath("/invoices");
}

export async function getAllInvoicesAction({ // avec pagination
  page = 1,
  limit = 10,
}: {
  page?: number;
  limit?: number;
}): Promise<InvoicesList> {
  //Check user
  const user = await requireUser();
  //Extract search params page and limit and status and check and format them
  const { safePage, safeLimit } = normalizePagination(page, limit);
  const skip = (safePage - 1) * safeLimit;
  //Call to DB
  const [
    invoicesRaw,
    total,
    revenueAgg,
    paidAgg,
    overdueAgg,
    sentAgg,
    draftAgg,
  ] = await Promise.all([
    prisma.invoice.findMany({
      where: { userId: user.userId },
      orderBy: { createdAt: "desc" },
      skip,
      take: safeLimit,
      select: {
        id: true,
        number: true,
        amount: true,
        status: true,
        dueDate: true,
        createdAt: true,
        clientId: true,
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    }),
    prisma.invoice.count({ where: { userId: user.userId } }),
    prisma.invoice.aggregate({
      where: { userId: user.userId },
      _sum: { amount: true },
    }),
    prisma.invoice.aggregate({
      where: { userId: user.userId, status: "PAID" },
      _sum: { amount: true },
    }),
    prisma.invoice.aggregate({
      where: { userId: user.userId, status: "OVERDUE" },
      _sum: { amount: true },
    }),
    prisma.invoice.aggregate({
      where: { userId: user.userId, status: "SENT" },
      _sum: { amount: true },
    }),
    prisma.invoice.aggregate({
      where: { userId: user.userId, status: "DRAFT" },
      _sum: { amount: true },
    }),
  ]);
  //Refine data
  const data: InvoiceWithClient[] = invoicesRaw.map((item) => ({
    invoiceDetails: {
      id: item.id,
      number: item.number,
      amount: item.amount,
      status: item.status,
      dueDate: item.dueDate,
      createdAt: item.createdAt,
      clientId: item.clientId,
    },
    invoiceClient: item.client,
  }));
  //Return
  return {
    data,
    stats: {
      revenue: revenueAgg._sum.amount ?? 0,
      paid: paidAgg._sum.amount ?? 0,
      overdue: overdueAgg._sum.amount ?? 0,
      sent: sentAgg._sum.amount ?? 0,
      draft: draftAgg._sum.amount ?? 0,
    },
    meta: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages: Math.ceil(total / safeLimit),
    },
  };
}
