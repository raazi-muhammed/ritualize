import { RoutineColor } from "@/types/entities";

export const ROUTINE_COLOR_BG_CLASS: Record<RoutineColor, string> = {
  indigo: "bg-routine-indigo",
  violet: "bg-routine-violet",
  rose: "bg-routine-rose",
  amber: "bg-routine-amber",
  emerald: "bg-routine-emerald",
  cyan: "bg-routine-cyan",
};

export function getRoutineColorClass(color: string | undefined) {
  if (color && color in ROUTINE_COLOR_BG_CLASS) {
    return ROUTINE_COLOR_BG_CLASS[color as RoutineColor];
  }
  return ROUTINE_COLOR_BG_CLASS.indigo;
}
