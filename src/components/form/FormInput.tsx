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
    controlClass,
}: {
    children: ReactNode;
    label: string;
    checkBox?: boolean;
    controlClass?: string;
}) {
    return (
        <FormItem>
            {!checkBox && <FormLabel>{label}</FormLabel>}
            <FormControl className={controlClass}>{children}</FormControl>
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
