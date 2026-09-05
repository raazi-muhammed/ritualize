"use client";

import { Button } from "@/components/ui/button";
import { useStore } from "@/stores";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, isToday } from "date-fns";
import { Icon } from "@/components/ui/icon-picker";
import { cn } from "@/lib/utils";

export default function DateSelector() {
  const { selectedDate, setSelectedDate } = useStore();

  if (!selectedDate) return null;

  const dateIsToday = isToday(selectedDate);

  return (
    <section className="flex gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={dateIsToday ? "ghost" : "card"}
            size={dateIsToday ? "icon" : "default"}
            className={cn("gap-2", !dateIsToday && "ps-3")}
          >
            <Icon name="Calendar01Icon" className="size-5" />
            {!dateIsToday && <p>{format(selectedDate, "MMM d")}</p>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              if (date) setSelectedDate(new Date(date));
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </section>
  );
}
