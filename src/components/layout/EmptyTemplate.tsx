import { CircleOff } from "lucide-react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import ButtonTemplate from "./ButtonTemplate";
import { IconName } from "../ui/icon-picker";

export function EmptyTemplate({
  title,
  description,
  actions,
}: {
  title: string;
  description: string;
  actions?: {
    label: string;
    onClick: () => void;
    icon: IconName;
  }[];
}) {
  return (
    <Empty className="min-h-[calc(80vh)]">
      <EmptyHeader>
        <EmptyMedia variant="icon" className="size-12">
          <CircleOff />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      {actions?.length && (
        <EmptyContent>
          <div className="flex gap-2">
            {actions.map((action, index) => (
              <ButtonTemplate
                key={index}
                onClick={action.onClick}
                label={action.label}
                icon={action.icon}
              />
            ))}
          </div>
        </EmptyContent>
      )}
    </Empty>
  );
}
