"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ChevronLeft, CircleEllipsis } from "lucide-react";
import { IoAddCircle as AddIcon } from "react-icons/io5";
import { Frequency } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import TaskForm, {
  DEFAULT_TASK_VALUES,
  taskSchema,
} from "../(tasks)/_forms/TaskForm";
import { z } from "zod";
import RoutineForm, { routineSchema } from "../../_forms/RoutineForm";
import { useRouter } from "next/navigation";
import { useModal } from "@/providers/ModelProvider";
import AllTasks from "./AllTasks";
import { formatDateForInput } from "@/lib/format";
import { RoutineWithTasks } from "@/types/entities";
import { useStore } from "@/stores";
import { useTransitionRouter } from "next-view-transitions";
import { pageSlideAnimation, pageSlideBackAnimation } from "@/lib/animations";

const RoutineHeader = ({
  date,
  routine,
}: {
  date: Date;
  routine: RoutineWithTasks;
}) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const tRouter = useTransitionRouter();
  const { openModal, closeModal } = useModal();
  const {
    updateRoutine,
    deleteRoutine,
    addTaskToRoutine,
    handleUncheckAllTasks,
  } = useStore();

  function handleAddTaskSubmit(values: z.infer<typeof taskSchema>) {
    if (!values.createNew) closeModal();
    addTaskToRoutine(routine.id, {
      name: values.name,
      duration: values.duration,
      frequency: values.frequency as Frequency,
      every_frequency: values.everyFrequency,
      days_in_frequency: values.daysInFrequency || [0],
      start_date: new Date(values.startDate),
      end_date: null,
      type: values.type,
    });
  }

  const { mutateAsync: handleDeleteRoutine } = useMutation({
    mutationFn: () => deleteRoutine(routine.id),
    onSuccess: () => {
      toast({
        description: `${routine?.name ?? "Routine"} deleted`,
      });
      queryClient.invalidateQueries({
        queryKey: ["routines"],
      });
      router.push("/");
    },
  });

  function handleEditRoutineSubmit(values: z.infer<typeof routineSchema>) {
    closeModal();
    updateRoutine(routine.id, values);
  }

  return (
    <header className="flex justify-between gap-3">
      <Link
        href="/"
        onClick={(e) => {
          e.preventDefault();
          tRouter.push("/", {
            onTransitionReady: pageSlideBackAnimation,
          });
        }}
      >
        <ChevronLeft />
      </Link>
      <div className="flex gap-3">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            openModal({
              title: "Add Task",
              content: (
                <TaskForm
                  onSubmit={handleAddTaskSubmit}
                  defaultValues={{
                    ...DEFAULT_TASK_VALUES,
                    startDate: formatDateForInput(date),
                  }}
                />
              ),
            });
          }}
        >
          <AddIcon />
          Add
        </Button>
        <AlertDialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="secondary">
                <CircleEllipsis size="1.3em" className="-mx-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onSelect={() => {
                  openModal({
                    title: "All tasks",
                    content: <AllTasks showStartDate routine={routine} />,
                  });
                }}
              >
                All tasks
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  openModal({
                    title: "Edit Routine",
                    content: (
                      <RoutineForm
                        onSubmit={handleEditRoutineSubmit}
                        defaultValues={{
                          name: routine.name,
                          icon: routine.icon || "List",
                          duration: routine.duration || undefined,
                          is_favorite: routine.is_favorite,
                          type: routine.type,
                        }}
                      />
                    ),
                  });
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  handleUncheckAllTasks(routine.id);
                }}
              >
                Uncheck all
              </DropdownMenuItem>
              <AlertDialogTrigger className="w-full">
                <DropdownMenuItem>Delete</DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  handleDeleteRoutine();
                }}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </header>
  );
};

export default RoutineHeader;
