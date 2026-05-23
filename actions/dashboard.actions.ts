//  use server car toutes les fonctions ici sont des servers actions
"use server";

import { requireUser } from "@/lib/auth/requireUser";
import { prisma } from "@/lib/prisma";
import { DashboardResponse } from "@/types/dashboard.types";
import { InvoiceWithClient } from "@/types/invoices.types";

export async function dashboardAction(): Promise<DashboardResponse> {
  // on valide et récupére le user qui appelle l'action
  const user = await requireUser();

  // requetes en parrallele à prisma
  //  Agg pour aggregate de données 
  const [
    totalInvoices,
    clientsCount,
    revenueAgg,
    pendingAgg,
    overdueAgg,
    latestInvoicesRaw,
  ] = await Promise.all([
    //    totalInvoices
    //    on compte les invoices qui ont le userId de l'user connecté
    prisma.invoice.count({ where: { userId: user.userId } }),
    //    clientsCount
    //    on compte les clients qui ont le userId de l'user connecté
    prisma.client.count({ where: { userId: user.userId } }),
    //    revenueAgg
    //    on calcule la somme des totaux descommandes qui ont le userId de l'user connecté
    //    avec le satus PAID
    prisma.invoice.aggregate({
      where: { userId: user.userId, status: "PAID" },
      _sum: { amount: true }, // permet de faire une somme sur la colonne amount
    }),
    //    overdueAgg
    //    avec le satus SENT
    prisma.invoice.aggregate({
      where: { userId: user.userId, status: "SENT" },
      _sum: { amount: true },
    }),
    //    overdueAgg
    //    avec le satus OVERDUE
    prisma.invoice.aggregate({
      where: { userId: user.userId, status: "OVERDUE" },
      _sum: { amount: true },
    }),
    //  latestInvoicesRaw
    //  on trie les invoices par date de création
    //  on prend 5 dernieres invoices, les plus recentes

    prisma.invoice.findMany({
      where: { userId: user.userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        number: true,
        amount: true,
        status: true,
        clientId: true,
        dueDate: true,
        createdAt: true,
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
  ]);

  //Transform data
  const latestInvoices: InvoiceWithClient[] = latestInvoicesRaw.map((item) => ({
    invoiceDetails: {
      id: item.id,
      number: item.number,
      amount: item.amount,
      dueDate: item.dueDate,
      status: item.status,
      clientId: item.clientId,
      createdAt: item.createdAt,
    },
    invoiceClient: {
      id: item.client.id,
      name: item.client.name,
      email: item.client.email,
      avatarUrl: item.client.avatarUrl,
    },
  }));

  //Return
  return {
    totalInvoices,
    clientsCount,
    revenue: revenueAgg._sum.amount ?? 0,
    pending: pendingAgg._sum.amount ?? 0,
    overdue: overdueAgg._sum.amount ?? 0,
    latestInvoices,
  };
}
