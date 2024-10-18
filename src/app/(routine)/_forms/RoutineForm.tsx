"use client";

import FormButton from "@/components/form/FormButton";
import FormInput from "@/components/form/FormInput";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { DefaultValues, useForm } from "react-hook-form";
import { z } from "zod";

export const routineSchema = z.object({
    name: z.string().min(1),
    duration: z.number().min(1),
});

function RoutineForm({
    onSubmit,
    defaultValues = {
        name: "",
        duration: 2,
    },
}: {
    onSubmit: any;
    defaultValues?: DefaultValues<z.infer<typeof routineSchema>>;
}) {
    const form = useForm<z.infer<typeof routineSchema>>({
        resolver: zodResolver(routineSchema),
        defaultValues,
        mode: "onTouched",
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormInput label="Name">
                            <Input {...field} />
                        </FormInput>
                    )}
                />
                <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                        <FormInput label="Duration">
                            <Input
                                type="number"
                                {...field}
                                onChange={(e) =>
                                    field.onChange(
                                        parseFloat(e.target.value) ||
                                            e.target.value
                                    )
                                }
                            />
                        </FormInput>
                    )}
                />
                <FormButton isLoading={form.formState.isSubmitting}>
                    Submit
                </FormButton>
            </form>
        </Form>
    );
}

export default RoutineForm;
