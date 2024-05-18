"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAppDispatch } from "@/hooks/redux";
import { addTask } from "@/redux/features/routineSlice";
import { Routine } from "@/types/entities";

const FormSchema = z.object({
    name: z.string().min(2),
    duration: z.number(),
});

export function AddTaskForm({
    routine,
    closeForm,
}: {
    routine: Routine;
    closeForm: () => void;
}) {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "",
            duration: 2,
        },
    });
    const dispatch = useAppDispatch();

    function onSubmit(data: z.infer<typeof FormSchema>) {
        dispatch(addTask({ routine: routine.name, task: data }));
        closeForm();
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>name</FormLabel>
                            <FormControl>
                                <Input placeholder="name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>duration</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    onChange={(e) => {
                                        const input = e.target.value;
                                        field.onChange(
                                            isNaN(Number(input)) || input == ""
                                                ? input
                                                : Number(input)
                                        );
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="mt-auto w-full">
                    Submit
                </Button>
            </form>
        </Form>
    );
}
