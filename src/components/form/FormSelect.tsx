import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectProps } from "@radix-ui/react-select";

import React from "react";

function FormSelect({
  items,
  ...props
}: {
  items: { label: string; value: string }[];
} & SelectProps) {
  return (
    <Select {...props}>
      <SelectTrigger className="bg-input-background w-fit border-none focus:ring-0 ring-ring-0">
        <SelectValue placeholder="Frequency" />
      </SelectTrigger>
      <SelectContent>
        {items.map((itm) => (
          <SelectItem key={itm.value} value={itm.value}>
            {itm.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default FormSelect;
