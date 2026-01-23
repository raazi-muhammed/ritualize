"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { TaskType } from "@/types/entities";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Switch } from "@/components/ui/switch";
import FormGroup from "@/components/form/FormGroup";

export const DEFAULT_TASK_VALUES = {
  name: "",
  duration: 2,

  createNew: false,
  startDate: formatDateForInput(new Date()),

  type: TaskType.task,
};

export const taskSchema = z.object({
  name: z.string().min(1),
  duration: z.number().min(1),
  createNew: z.boolean().optional().default(false),
  startDate: z.string(),
  type: z.enum(["task", "checkpoint"]),
});

function TaskForm({
  onSubmit,
  defaultValues = {
    name: "",
    duration: 2,

    createNew: false,
    startDate: formatDateForInput(new Date()),

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
  });

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
        className={cn("space-y-4", className)}
      >
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
                  {...field}
                  onChange={(e) =>
                    field.onChange(parseFloat(e.target.value) || e.target.value)
                  }
                  className="text-right w-fit"
                />
              </FormInput>
            )}
          />
        </FormGroup>
        <FormGroup>
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormInput label="Start date">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      size={"sm"}
                      variant={"outline"}
                      className={cn(
                        "w-fit h-12 rounded-sm justify-start text-left font-normal bg-input-background border-none hover:bg-input-background",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={new Date(field.value)}
                      onSelect={(date) => {
                        if (date) field.onChange(new Date(date));
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
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
        </FormGroup>
        {!hideCreateNew && (
          <FormField
            control={form.control}
            name="createNew"
            render={({ field }) => (
              <FormInput label="Add and create new" checkBox>
                <Switch
                  className="me-4"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormInput>
            )}
          />
        )}
        <FormButton isLoading={form.formState.isSubmitting}>Add</FormButton>
      </form>
    </Form>
  );
}

export default TaskForm;
