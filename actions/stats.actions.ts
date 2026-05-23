import { requireUser } from "@/lib/auth/requireUser";
import { prisma } from "@/lib/prisma";
import {
  CountByStatus,
  RevenueByClient,
  RevenueByMonth,
  StatsResponse,
} from "@/types";

//  récupération de toutes les stats
//  équilibre entre une grosse fonction monolithique ou plusieurs petites fonctions

export async function statsAction(): Promise<StatsResponse> {
  // On récupére le user qui appelle l'action
  const user = await requireUser();

  // Calcul sur les 30 derniers jours
  const thirstyDaysAgo = new Date();
  thirstyDaysAgo.setDate(thirstyDaysAgo.getDate() - 30);

  // on récupère les totaux avec appels en parallèle
  //  nous utilisons du destructuring de tableau
  //  les appels en parallèle sont plus rapides
  //  le temps total est le temps de l'appel le plus long
  //  en séquentiel, le temps total est le cumul de tous les appels
  const [totalRevenueAgg, totalInvoices, totalClients, pendingRevenueAgg] =
    await Promise.all([
      prisma.invoice.aggregate({
        where: { userId: user.userId, status: "PAID" },
        _sum: { amount: true },
      }),
      prisma.invoice.count({ where: { userId: user.userId } }),
      prisma.client.count({ where: { userId: user.userId } }),
      prisma.invoice.aggregate({
        where: { userId: user.userId, status: { in: ["SENT", "OVERDUE"] } },
        _sum: { amount: true },
      }),
    ]);

  // On récupère les revenus / mois
  const invoices = await prisma.invoice.findMany({
    where: { userId: user.userId, status: "PAID" },
    select: { amount: true, createdAt: true },
  });

  //  un record est un objet qui permet de stocker des paires clé-valeur
  const revenueByMonthMap: Record<string, number> = {};
  //  on fait une boucle, on incremente la valeur à chaque tour de boucle.
  invoices.forEach((invoice) => {
    const month = new Date(invoice.createdAt).toLocaleString("en-US", {
      month: "short",
    });
    revenueByMonthMap[month] = (revenueByMonthMap[month] || 0) + invoice.amount;
  });

  const revenueByMonth: RevenueByMonth[] = Object.entries(
    revenueByMonthMap,
  ).map(([month, revenue]) => ({ month, revenue: Number(revenue.toFixed(2)) }));

  // On decompte les factures par statut
  const invoicesByStatusRaw = await prisma.invoice.groupBy({
    by: ["status"],
    where: { userId: user.userId },
    _count: { status: true },
  });
  const invoicesByStatus: CountByStatus[] = invoicesByStatusRaw.map((item) => ({
    status: item.status,
    count: item._count.status,
  }));

  // Top clients
  const topClientsRaw = await prisma.invoice.groupBy({
    where: { userId: user.userId, status: "PAID" },
    by: ["clientId"],
    _sum: { amount: true },
    orderBy: {
      _sum: { amount: "desc" },
    },
    take: 5,
  });
  const clientsIds = topClientsRaw.map((item) => item.clientId);
  const clients = await prisma.client.findMany({
    where: { id: { in: clientsIds } },
    select: { id: true, name: true },
  });
  const topClients: RevenueByClient[] = topClientsRaw.map((client) => {
    const fullClient = clients.find((item) => item.id === client.clientId);
    return {
      name: fullClient?.name ?? "Unknown",
      revenue: client._sum.amount ?? 0,
    };
  });

  // On renvoie la grosse réponse de notre grosse fonction !
  return {
    totalRevenue: totalRevenueAgg._sum.amount ?? 0,
    totalInvoices,
    totalClients,
    revenueByMonth,
    countByStatus: invoicesByStatus,
    revenueByClient: topClients,
    pendingRevenue: pendingRevenueAgg._sum.amount ?? 0,
  };
}
