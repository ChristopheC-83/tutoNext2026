import z from "zod";

export const clientSchema = z
  .object({
    name: z.string().min(1).trim(),
    email: z.preprocess(
      (val) => (val === "" ? undefined : val),
      z.string().email().optional(),
    ),
    company: z.string().trim().optional().nullable(),
    phone: z.string().trim().optional().nullable(),
    file: z.instanceof(File).optional().nullable(),
  })
  .strict();

//    paartial rend tout optionnel
export const clientUpdateSchema = clientSchema.partial();

//  on fabrique des types à partir des schemas
//  l'interet est que les types sont de la documentations, de la vérification des données
//  alors que les schemas sont utiles pour la validation à la volée

export type CreateClientInputsType = z.infer<typeof clientSchema>;

export type UpdateClientInputsType = z.infer<typeof clientUpdateSchema>;
