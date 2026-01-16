import { z } from "zod";

export const routineSchema = z.object({
  name: z.string().min(1),
  duration: z.number().min(1),

  is_favorite: z.boolean(),
  icon: z.string(),
});
