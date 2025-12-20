import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface StoreState {
  selectedDate: Date | null;
  setSelectedDate: (date: Date) => void;
}

export const useStore = create<StoreState>()(
  devtools(
    (set, get) => ({
      selectedDate: new Date(),
      setSelectedDate: (date: Date) => set({ selectedDate: date }),
    }),
    {
      name: "RoutineStore",
    }
  )
);
