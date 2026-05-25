import z from "zod";

export const profileSchema = z.object({
  name: z.preprocess((val) => val ?? "", z.string().min(1)),
  password: z.preprocess((val) => {
    if (val === null || val === undefined || val === "") {
      return undefined;
    }
    return val;
  }, z.string().min(6).optional()),
});

// "" -> ignoré
// null -> ignoré
// undefined -> ignoré
// "newpassword" -> validé
