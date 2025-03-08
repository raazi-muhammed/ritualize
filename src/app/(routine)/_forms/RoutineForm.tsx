"use client";

import FormButton from "@/components/form/FormButton";
import FormInput from "@/components/form/FormInput";
import FormSelect from "@/components/form/FormSelect";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { RoutineTypes } from "@prisma/client";
import React, { useMemo, useState } from "react";
import { DefaultValues, useForm } from "react-hook-form";
import { z } from "zod";
import { IconPicker } from "@/components/ui/icon-picker";

export const routineSchema = z.object({
    name: z.string().min(1),
    duration: z.number().min(1),
    type: z.enum([RoutineTypes.sop, RoutineTypes.recurring]),
    is_favorite: z.boolean(),
    icon: z.string(),
});

function RoutineForm({
    onSubmit,
    defaultValues = {
        name: "",
        duration: 2,
        type: RoutineTypes.recurring,
        is_favorite: false,
        icon: "List",
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

    const typeItems = useMemo(() => {
        return Object.values(RoutineTypes).map((v) => ({
            label: v,
            value: v,
        }));
    }, []);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="icon"
                    render={({ field }) => (
                        <FormInput label="Icon">
                            <IconPicker
                                className="w-full"
                                value={field.value as any}
                                onValueChange={field.onChange}
                            />
                        </FormInput>
                    )}
                />
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormInput label="Name">
                            <Input {...field} autoFocus />
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
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormInput label="Type">
                            <FormSelect
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                items={typeItems}
                                {...field}
                            />
                        </FormInput>
                    )}
                />
                <FormField
                    control={form.control}
                    name="is_favorite"
                    render={({ field }) => (
                        <FormInput label="Favorite" checkBox>
                            <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
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
