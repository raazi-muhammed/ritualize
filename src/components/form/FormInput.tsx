import React, { ReactNode } from "react";
import {
    FormControl,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

function FormInput({
    children,
    label,
}: {
    children: ReactNode;
    label: string;
}) {
    return (
        <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>{children}</FormControl>
            <FormMessage />
        </FormItem>
    );
}

export default FormInput;
