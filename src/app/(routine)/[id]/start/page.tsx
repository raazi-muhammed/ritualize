"use client";

import { useStore } from "@/stores";
import StartComponent from "./_components/StartComponent";
import { useGetRoutine } from "@/queries/routine.query";
import ContentStateTemplate from "@/components/layout/ContentStateTemplate";
import RoutineSkeleton from "../../_components/RoutineSkeleton";
import InfoMessage from "@/components/message/InfoMessage";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useTransitionRouter } from "next-view-transitions";
import { pageSlideBackAnimation } from "@/lib/animations";

export default function Page({ params }: { params: { id: string } }) {
  const { selectedDate } = useStore();
  const { data: routine, isLoading } = useGetRoutine(
    params.id,
    selectedDate || undefined
  );
  const router = useTransitionRouter();

  if (!selectedDate)
    return (
      <InfoMessage
        message="Please select a date first"
        actions={[
          <Button
            key="back"
            onClick={() => {
              router.push(`/${params.id}`, {
                onTransitionReady: pageSlideBackAnimation,
              });
            }}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>,
        ]}
      />
    );

  return (
    <ContentStateTemplate isLoading={isLoading} skeleton={<RoutineSkeleton />}>
      {routine && <StartComponent routine={routine} date={selectedDate} />}
    </ContentStateTemplate>
  );
}
