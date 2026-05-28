import { InvoiceStatus } from "@prisma/client";
import z from "zod";

const baseInvoiceSchema = z.object({
  status: z.nativeEnum(InvoiceStatus),
  amount: z.coerce.number().positive(),
  dueDate: z.coerce.date(),
});

export const createInvoiceSchema = baseInvoiceSchema.extend({
  clientId: z.string().cuid(),
});

export const updateInvoiceSchema = baseInvoiceSchema;

export type CreateInvoiceInputsType = z.infer<typeof createInvoiceSchema>;

export type UpdateInvoiceInputsType = z.infer<typeof updateInvoiceSchema>;
