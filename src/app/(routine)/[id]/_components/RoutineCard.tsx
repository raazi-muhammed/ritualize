import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon-picker";
import {
  pageSlideAnimation,
  PRESSABLE_ANIMATION_CLASSES,
} from "@/lib/animations";
import { Routine } from "@prisma/client";
import { Heart } from "lucide-react";
import { useTransitionRouter } from "next-view-transitions";
import Link from "next/link";

const RoutineCard = ({
  routine,
  isList = false,
}: {
  routine: Routine;
  isList?: boolean;
}) => {
  const router = useTransitionRouter();

  return (
    <Link
      href={`/${routine.id}?name=${encodeURIComponent(routine.name)}`}
      onClick={(e) => {
        e.preventDefault();
        router.push(`/${routine.id}?name=${encodeURIComponent(routine.name)}`, {
          onTransitionReady: pageSlideAnimation,
        });
      }}
    >
      <Card
        className={`${PRESSABLE_ANIMATION_CLASSES} relative -z-0 overflow-hidden p-2 transition-transform active:scale-90 duration-200 ease-in-out ${
          routine?.id ?? "opacity-50 pointer-events-none"
        }`}
      >
        <CardHeader className="z-10 p-2 flex justify-between flex-row">
          <div
            className={`flex ${
              isList ? "flex-col" : "flex-row"
            } gap-2 align-middle`}
          >
            <div
              className={`bg-secondary shadow-inner shadow-secondary-border ${
                isList ? "size-10" : "size-8"
              } grid place-items-center rounded-full`}
            >
              <Icon
                name={routine.icon as any}
                size={isList ? "1.5rem" : "1rem"}
              />
            </div>
            <div className="flex flex-col gap-0">
              <CardTitle className="flex justify-between text-base my-auto font-medium line-clamp-1">
                {routine.name}
              </CardTitle>
              <small className="text-xs text-muted-foreground">
                {routine.type}
              </small>
            </div>
          </div>

          {routine.is_favorite ? (
            <Heart className="fill-primary text-primary" size={18} />
          ) : (
            <Heart className="text-secondary" size={18} />
          )}
        </CardHeader>
      </Card>
    </Link>
  );
};

export default RoutineCard;
