"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useAppDispatch } from "@/hooks/redux";
import { addRoutine } from "@/redux/features/routineSlice";

const FormSchema = z.object({
    name: z.string().min(2),
    duration: z.number(),
    cover: z.string().url(),
});

export function AddRoutineForm() {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "",
            duration: 2,
        },
    });
    const dispatch = useAppDispatch();

    function onSubmit(data: z.infer<typeof FormSchema>) {
        console.log(data);

        dispatch(addRoutine(data));
        toast({
            title: "You submitted the following values:",
            description: "hi",
        });
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
                            <FormDescription>
                                This is a estimated duration it will be
                                recalculate based on habits
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="cover"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>cover</FormLabel>
                            <FormControl>
                                <Input {...field} />
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
