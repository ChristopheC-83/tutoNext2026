//  zod remplace les validations manuelles des inputs avant envoie au back
//  on crée des schemas de validation
//  ils sont réutilisable partout

import z from "zod";

const baseAuthSchema = z.object({
  email: z.string().email().trim().toLowerCase(),
  password: z.string().min(6),
});

export const loginSchema = baseAuthSchema;

export const registerSchema = baseAuthSchema.extend({
    //  avec preprocess on peut faire des transformations avant envoie au back
    //  ici on renvoie undefined si le name est vide
    //  il est optionnel
    //  si non vide, on valide la longueur min et max en enlevant les espaces
  name: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().min(2).max(50).trim().optional(),
  ),
});

//  il faut prévoir les types de ces schemas

export type RegisterInputsType = z.infer<typeof registerSchema>;

export type LoginInputsType = z.infer<typeof loginSchema>;
