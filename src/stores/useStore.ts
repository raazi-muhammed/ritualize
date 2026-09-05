import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface StoreState {
  selectedDate: Date | null;
  setSelectedDate: (date: Date) => void;
  rearrangeMode: boolean;
  setRearrangeMode: (value: boolean) => void;
}

export const useStore = create<StoreState>()(
  devtools(
    (set, get) => ({
      selectedDate: new Date(),
      setSelectedDate: (date: Date) => set({ selectedDate: date }),
      rearrangeMode: false,
      setRearrangeMode: (value: boolean) => set({ rearrangeMode: value }),
    }),
    {
      name: "RoutineStore",
      enabled: process.env.NODE_ENV !== "production",
    }
  )
);
