"use client";

import { useStore } from "@/stores";
import StartComponent from "./_components/StartComponent";
import { useGetRoutine } from "@/queries/routine.query";
import ContentStateTemplate from "@/components/layout/ContentStateTemplate";
import RoutineSkeleton from "../../_components/RoutineSkeleton";
import { useTransitionRouter } from "next-view-transitions";
import { pageSlideBackAnimation } from "@/lib/animations";
import { EmptyTemplate } from "@/components/layout/EmptyTemplate";

export default function Page({ params }: { params: { id: string } }) {
  const { selectedDate } = useStore();
  const { data: routine, isLoading } = useGetRoutine(
    params.id,
    selectedDate || undefined
  );
  const router = useTransitionRouter();

  if (!selectedDate)
    return (
      <EmptyTemplate
        title="Date not selected"
        description="Select a date for get start"
        actions={[
          {
            label: "Back",
            onClick: () => {
              router.push(`/${params.id}`, {
                onTransitionReady: pageSlideBackAnimation,
              });
            },
            icon: "ChevronLeft",
          },
        ]}
      />
    );

  return (
    <ContentStateTemplate isLoading={isLoading} skeleton={<RoutineSkeleton />}>
      {routine && <StartComponent routine={routine} date={selectedDate} />}
    </ContentStateTemplate>
  );
}
