import { CSSProperties } from "react";
import { Button } from "../ui/button";
import { Icon, IconName } from "../ui/icon-picker";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface ActionType {
  label?: string;
  icon?: IconName;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
  variant?:
    | "default"
    | "secondary"
    | "destructive"
    | "card"
    | "card-outline"
    | "ghost";
  iconOnly?: boolean;
}

function ButtonTemplate({
  label,
  icon,
  onClick,
  disabled,
  variant,
  iconOnly,
  style,
}: ActionType) {
  const isIconOnly = Boolean(icon) && (iconOnly || !label);

  const button = (
    <Button
      key={label}
      disabled={disabled}
      onClick={onClick}
      size={isIconOnly ? "icon" : "default"}
      variant={variant || (isIconOnly ? "ghost" : "secondary")}
      style={style}
      className={cn("my-auto gap-2", icon && label && !isIconOnly && "ps-3")}
    >
      {icon && <Icon name={icon} className="size-5" />}{" "}
      {!isIconOnly && label && <p>{label}</p>}
    </Button>
  );

  if (isIconOnly && label) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent>{label}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return button;
}

export default ButtonTemplate;
