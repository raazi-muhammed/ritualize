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
    checkBox = false,
}: {
    children: ReactNode;
    label: string;
    checkBox?: boolean;
}) {
    return (
        <FormItem>
            {!checkBox && <FormLabel>{label}</FormLabel>}
            <FormControl>{children}</FormControl>
            {checkBox && (
                <FormLabel className="ml-2 my-auto font-normal">
                    {label}
                </FormLabel>
            )}
            <FormMessage />
        </FormItem>
    );
}

export default FormInput;
