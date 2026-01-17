"use client";

import FormButton from "@/components/form/FormButton";
import FormInput from "@/components/form/FormInput";
import { Input } from "@/components/ui/input";
import React from "react";
import { useImportRoutine } from "@/queries/routine.query";
import { toast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormField } from "@/components/ui/form";

const importSchema = z.object({
  file: z.any().refine((file) => file instanceof File, "File is required"),
});

function ImportRoutineForm({ onSubmit }: { onSubmit: () => void }) {
  const { mutateAsync: importRoutine, isPending } = useImportRoutine();

  const form = useForm<z.infer<typeof importSchema>>({
    resolver: zodResolver(importSchema),
  });

  const handleSubmit = async (values: z.infer<typeof importSchema>) => {
    const formData = new FormData();
    formData.append("file", values.file);

    try {
      await importRoutine(formData);
      toast({
        title: "Success",
        description: "Routines imported successfully",
      });
      onSubmit();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to import routines. Please check the file format.",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="file"
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormInput label="CSV File">
              <Input
                {...fieldProps}
                type="file"
                accept=".csv"
                onChange={(event) => {
                  onChange(event.target.files && event.target.files[0]);
                }}
                className="cursor-pointer"
              />
            </FormInput>
          )}
        />

        <FormButton isLoading={isPending}>Import Routine</FormButton>
      </form>
    </Form>
  );
}

export default ImportRoutineForm;
