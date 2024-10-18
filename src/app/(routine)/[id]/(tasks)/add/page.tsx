"use client";

import Heading from "@/components/layout/Heading";
import { Input } from "@/components/ui/input";
import React, { useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { createTask } from "../actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormField } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import FormInput from "@/components/form/FormInput";
import FormButton from "@/components/form/FormButton";
import FormSelect from "@/components/form/FormSelect";
import { Frequency } from "@prisma/client";

const formSchema = z.object({
    name: z.string().min(1),
    duration: z.number().min(1),
    frequency: z.string().min(1),
});

function AddRoutine({ params }: { params: { id: string } }) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            duration: 2,
            frequency: Frequency.daily,
        },
        mode: "onTouched",
    });

    const { isPending, mutate } = useMutation({
        mutationFn: createTask,
        onSuccess: (task) => {
            toast({
                description: `${task?.name ?? "Task"} created`,
            });
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        mutate({
            routine_id: params.id,
            days_of_week: [],
            duration: values.duration,
            frequency: values.frequency as Frequency,
            name: values.name,
        });
    }

    const frequencyItems = useMemo(() => {
        return Object.values(Frequency).map((v) => ({
            label: v,
            value: v,
        }));
    }, [Frequency]);

    return (
        <div className="container grid gap-4 py-8">
            <Heading>Add Task</Heading>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4">
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
                    <FormButton isLoading={isPending}>Submit</FormButton>
                </form>
            </Form>
        </div>
    );
}

export default AddRoutine;
