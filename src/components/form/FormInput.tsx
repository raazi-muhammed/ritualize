import React, { ReactNode } from "react";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";

function FormInput({
  children,
  label,
  checkBox = false,
  controlClass,
}: {
  children: ReactNode;
  label: string;
  checkBox?: boolean;
  controlClass?: string;
}) {
  return (
    <FormItem className="flex flex-col">
      <div className="flex flex-row rounded-xl bg-input-background justify-between min-h-12">
        <FormLabel className="my-auto ps-4 text-nowrap">{label}</FormLabel>
        <FormControl className={cn(controlClass, "my-auto")}>
          {children}
        </FormControl>
      </div>
      <FormMessage />
    </FormItem>
  );
}

export default FormInput;
