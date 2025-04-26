"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Frequency, TaskType } from "@prisma/client";
import React, { useEffect, useMemo, useState } from "react";
import { DefaultValues, useForm } from "react-hook-form";
import { z } from "zod";
import FormInput from "@/components/form/FormInput";
import FormButton from "@/components/form/FormButton";
import FormSelect from "@/components/form/FormSelect";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { formatDateForInput } from "@/lib/format";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export const taskSchema = z
    .object({
        name: z.string().min(1),
        duration: z.number().min(1),
        frequency: z.string().min(1),
        createNew: z.boolean().optional().default(false),
        everyFrequency: z.number().min(1),
        daysInFrequency: z.array(z.number()).optional(),
        startDate: z.string(),
        type: z.nativeEnum(TaskType),
    })
    .refine(
        (data) =>
            !data.daysInFrequency ||
            data.daysInFrequency.every((day) => day >= 0 && day <= 6),
        {
            message:
                "daysInFrequency must only contain numbers between 0 (Sunday) and 6 (Saturday).",
            path: ["daysInFrequency"],
        }
    );

function TaskForm({
    onSubmit,
    defaultValues = {
        name: "",
        duration: 2,
        frequency: Frequency.daily,
        createNew: false,
        startDate: formatDateForInput(new Date()),
        everyFrequency: 1,
        daysInFrequency: [new Date().getDay()],
        type: TaskType.task,
    },
    hideCreateNew = false,
    className,
}: {
    onSubmit: any;
    defaultValues?: DefaultValues<z.infer<typeof taskSchema>>;
    hideCreateNew?: boolean;
    className?: string;
}) {
    const form = useForm<z.infer<typeof taskSchema>>({
        resolver: zodResolver(taskSchema),
        defaultValues,
        mode: "onTouched",
    });

    const [frequency, setFrequency] = useState(form.getValues("frequency"));

    useEffect(() => {
        // Update frequency state when the form value changes
        const subscription = form.watch((value) => {
            if (value.frequency) setFrequency(value.frequency);
        });

        // Cleanup subscription on unmount
        return () => subscription.unsubscribe();
    }, [form]);

    const frequencyItems = useMemo(() => {
        return Object.values(Frequency).map((v) => ({
            label: v,
            value: v,
        }));
    }, []);

    const days = [
        {
            value: "0",
            label: "S",
        },
        {
            value: "1",
            label: "M",
        },
        {
            value: "2",
            label: "T",
        },
        {
            value: "3",
            label: "W",
        },
        {
            value: "4",
            label: "T",
        },
        {
            value: "5",
            label: "F",
        },
        {
            value: "6",
            label: "S",
        },
    ];

    const typeItems = [
        {
            value: TaskType.task,
            label: "Task",
        },
        {
            value: TaskType.checkpoint,
            label: "Checkpoint",
        },
    ];
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={cn("space-y-4", className)}>
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
                <FormField
                    control={form.control}
                    name="everyFrequency"
                    render={({ field }) => (
                        <FormInput label="Every">
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
                    name="startDate"
                    render={({ field }) => (
                        <FormInput label="Start date">
                            <Input
                                type="date"
                                {...field}
                                onChange={(e) => {
                                    field.onChange(e.target.value);
                                    const val = new Date(
                                        e.target.value
                                    ).getDay();

                                    form.setValue("daysInFrequency", [val]);
                                }}
                            />
                        </FormInput>
                    )}
                />
                {frequency === Frequency.weekly && (
                    <FormField
                        control={form.control}
                        name="daysInFrequency"
                        render={({ field }) => (
                            <FormInput label="Days in frequency">
                                <ToggleGroup
                                    type="multiple"
                                    value={
                                        field.value?.map((a) => String(a)) || []
                                    }
                                    onValueChange={(value) => {
                                        form.setValue(
                                            "daysInFrequency",
                                            value.map((a) => parseInt(a))
                                        );
                                    }}>
                                    {days.map((day) => (
                                        <ToggleGroupItem
                                            key={day.value}
                                            value={day.value}
                                            aria-label="Toggle bold">
                                            {day.label}
                                        </ToggleGroupItem>
                                    ))}
                                </ToggleGroup>
                            </FormInput>
                        )}
                    />
                )}
                {!hideCreateNew && (
                    <FormField
                        control={form.control}
                        name="createNew"
                        render={({ field }) => (
                            <FormInput label="Add and create new" checkBox>
                                <Checkbox
                                    className="mt-4"
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormInput>
                        )}
                    />
                )}
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
                <FormButton isLoading={form.formState.isSubmitting}>
                    Add
                </FormButton>
            </form>
        </Form>
    );
}

export default TaskForm;
