import { z } from "zod";
import { ROUTINE_COLORS } from "@/types/entities";

export const routineSchema = z.object({
  name: z.string().min(1),
  duration: z.number().min(1),

  isFavorite: z.boolean(),
  icon: z.string(),
  color: z.enum(ROUTINE_COLORS).optional(),
});
