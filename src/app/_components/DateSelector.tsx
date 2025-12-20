"use client";

export const dynamic = "force-static";

import { Button } from "@/components/ui/button";
import { useStore } from "@/stores";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DateSelector() {
  const { selectedDate, setSelectedDate } = useStore();

  if (!selectedDate) return null;

  return (
    <section className="fixed bottom-12 right-12 flex mt-2 gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            size={"sm"}
            variant={"outline"}
            className={cn(
              "w-fit justify-start text-left font-normal",
              !selectedDate && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? (
              format(selectedDate, "PPP")
            ) : (
              <span>Pick a date</span>
            )}
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
