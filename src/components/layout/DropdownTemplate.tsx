import { HugeiconsIcon } from "@hugeicons/react";
import { MoreVerticalIcon } from "@hugeicons/core-free-icons";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { isValidElement } from "react";
import { Icon } from "../ui/icon-picker";
import { ActionType } from "./PageTemplate";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

const DropdownTemplate = ({ actions }: { actions: ActionType[] }) => {
  return (
    <DropdownMenu modal={false}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant="card-outline" size="icon" className="my-auto">
                <HugeiconsIcon icon={MoreVerticalIcon} className="size-5" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>More options</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DropdownMenuContent align="end">
        {actions.map((action, index) => {
          if (isValidElement(action)) {
            return (
              <DropdownMenuItem asChild key={index}>
                {action}
              </DropdownMenuItem>
            );
          }
          if (action && typeof action === "object" && "label" in action) {
            return (
              <DropdownMenuItem
                key={action.label}
                onClick={action.onClick}
                className={cn(
                  action.variant === "destructive" && "text-destructive"
                )}
              >
                {action.icon && (
                  <Icon name={action.icon} className="mr-2 size-4" />
                )}
                <span>{action.label}</span>
              </DropdownMenuItem>
            );
          }
          return null;
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownTemplate;
