"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Frequency } from "@prisma/client";
import React, { useMemo } from "react";
import { DefaultValues, useForm } from "react-hook-form";
import { z } from "zod";
import FormInput from "@/components/form/FormInput";
import FormButton from "@/components/form/FormButton";
import FormSelect from "@/components/form/FormSelect";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export const taskSchema = z.object({
    name: z.string().min(1),
    duration: z.number().min(1),
    frequency: z.string().min(1),
});

function TaskForm({
    onSubmit,
    defaultValues = {
        name: "",
        duration: 2,
        frequency: Frequency.daily,
    },
}: {
    onSubmit: any;
    defaultValues?: DefaultValues<z.infer<typeof taskSchema>>;
}) {
    const form = useForm<z.infer<typeof taskSchema>>({
        resolver: zodResolver(taskSchema),
        defaultValues,
        mode: "onTouched",
    });

    const frequencyItems = useMemo(() => {
        return Object.values(Frequency).map((v) => ({
            label: v,
            value: v,
        }));
    }, [Frequency]);

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
                            <Input {...field} />
                        </FormInput>
                    )}
                />
                <FormField
                    control={form.control}
                    name="frequency"
                    render={({ field }) => (
                        <FormInput label="Frequency">
                            <FormSelect
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                items={frequencyItems}
                                {...field}
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

export default TaskForm;
