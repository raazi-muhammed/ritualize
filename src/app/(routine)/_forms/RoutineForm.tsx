"use client";

import FormButton from "@/components/form/FormButton";
import FormInput from "@/components/form/FormInput";
import FormSelect from "@/components/form/FormSelect";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";

import React, { useMemo } from "react";
import { DefaultValues, useForm } from "react-hook-form";
import { z } from "zod";
import { IconPicker } from "@/components/ui/icon-picker";
import { routineSchema } from "./schema";
import { Switch } from "@/components/ui/switch";
import FormGroup from "@/components/form/FormGroup";
import { ROUTINE_COLORS } from "@/types/entities";
import { ROUTINE_COLOR_BG_CLASS } from "@/lib/routine-colors";
import { cn } from "@/lib/utils";

function RoutineForm({
  onSubmit,
  defaultValues = {
    name: "",
    duration: 2,

    isFavorite: false,
    icon: "List",
    color: "indigo",
  },
}: {
  onSubmit: any;
  defaultValues?: DefaultValues<z.infer<typeof routineSchema>>;
}) {
  const form = useForm<z.infer<typeof routineSchema>>({
    resolver: zodResolver(routineSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => (
            <FormInput label="Icon" controlClass="grid place-items-center">
              <IconPicker
                className="w-fit"
                value={field.value as any}
                onValueChange={field.onChange}
              />
            </FormInput>
          )}
        />
        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormInput label="Color">
              <div className="flex gap-2">
                {ROUTINE_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    aria-label={color}
                    onClick={() => field.onChange(color)}
                    className={cn(
                      "size-7 rounded-full transition-transform",
                      ROUTINE_COLOR_BG_CLASS[color],
                      field.value === color &&
                        "ring-2 ring-offset-2 ring-offset-background ring-foreground"
                    )}
                  />
                ))}
              </div>
            </FormInput>
          )}
        />
        <FormGroup>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormInput label="Name">
                <Input {...field} autoFocus className="text-right" />
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
                  className="w-fit text-right"
                  {...field}
                  onChange={(e) =>
                    field.onChange(parseFloat(e.target.value) || e.target.value)
                  }
                />
              </FormInput>
            )}
          />
        </FormGroup>
        <FormField
          control={form.control}
          name="isFavorite"
          render={({ field }) => (
            <FormInput label="Favorite" checkBox>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                className="me-2"
              />
            </FormInput>
          )}
        />
        <FormButton isLoading={form.formState.isSubmitting}>Submit</FormButton>
      </form>
    </Form>
  );
}

export default RoutineForm;
