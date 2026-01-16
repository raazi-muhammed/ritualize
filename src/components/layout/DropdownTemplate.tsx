import { EllipsisVertical } from "lucide-react";
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

const DropdownTemplate = ({ actions }: { actions: ActionType[] }) => {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon" className="my-auto">
          <EllipsisVertical className="size-5" />
        </Button>
      </DropdownMenuTrigger>
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
              <DropdownMenuItem key={action.label} onClick={action.onClick}>
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
