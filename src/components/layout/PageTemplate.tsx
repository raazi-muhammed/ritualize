"use client";

import { ReactNode, isValidElement, Fragment } from "react";
import { Button } from "../ui/button";
import { EllipsisVertical } from "lucide-react";
import Heading from "./Heading";
import { useTransitionRouter } from "next-view-transitions";
import { pageSlideBackAnimation } from "@/lib/animations";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Icon, IconName } from "../ui/icon-picker";

type ActionType =
  | {
      label?: string;
      icon?: IconName;
      onClick: () => void;
      placement?: "left" | "right";
      disabled?: boolean;
      className?: string;
    }
  | ReactNode;

import ButtonTemplate from "./ButtonTemplate";
import { SIDEBAR_WIDTH } from "../ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

function ActionButton({ action }: { action: ActionType }) {
  if (isValidElement(action)) {
    return <Fragment key={action.key}>{action}</Fragment>;
  }
  if (action && typeof action === "object" && "onClick" in action) {
    return (
      <ButtonTemplate
        label={action.label}
        icon={action.icon}
        onClick={action.onClick}
        disabled={action.disabled}
        className={cn(
          action.placement === "right" && "ms-auto",
          action.placement === "left" && "me-auto",
          action.className
        )}
      />
    );
  }
  return null;
}

const PageTemplate = ({
  children,
  title,
  actions,
  hideBack,
  backUrl,
  forceBack,
  bottomActions,
  isOnSidebar = false,
}: {
  children: ReactNode;
  title?: string;
  actions?: ActionType[];
  hideBack?: boolean;
  backUrl?: string;
  forceBack?: () => void;
  bottomActions?: ActionType[];
  isOnSidebar?: boolean;
}) => {
  const tRouter = useTransitionRouter();
  const isMobile = useIsMobile();
  return (
    <main className="px-5 container-xl py-4">
      <header className={cn(`flex justify-between gap-3 sticky top-5 pb-4`)}>
        {!hideBack ? (
          <ButtonTemplate
            onClick={() => {
              if (forceBack) {
                forceBack();
              } else if (backUrl) {
                tRouter.push(backUrl, {
                  onTransitionReady: pageSlideBackAnimation,
                });
              } else {
                tRouter.back();
              }
            }}
            className="ps-0 pe-12"
            icon="ChevronLeft"
          />
        ) : (
          <div />
        )}

        <div className="flex gap-2">
          {actions && actions.length > 2 ? (
            <>
              {actions.slice(0, 1).map((action, index) => (
                <ActionButton action={action} key={index} />
              ))}
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" size="icon" className="my-auto">
                    <EllipsisVertical className="size-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {actions.slice(1).map((action, index) => {
                    if (isValidElement(action)) {
                      return (
                        <DropdownMenuItem asChild key={index}>
                          {action}
                        </DropdownMenuItem>
                      );
                    }
                    if (
                      action &&
                      typeof action === "object" &&
                      "label" in action
                    ) {
                      return (
                        <DropdownMenuItem
                          key={action.label}
                          onClick={action.onClick}
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
            </>
          ) : (
            actions?.map((action, index) => (
              <ActionButton action={action} key={index} />
            ))
          )}
        </div>
      </header>
      {title && (
        <section className="bg-background">
          <Heading>{title}</Heading>
        </section>
      )}
      {children}
      {bottomActions?.length ? (
        <footer
          className={cn(
            `fixed bottom-5 right-5 justify-between flex gap-2`,
            isMobile ? "left-5" : "left-[calc(22rem+1.25rem)]",
            isOnSidebar && "left-5 right-[calc(100vw-calc(22rem-1.25rem))]"
          )}
        >
          <div className="flex gap-2">
            {bottomActions
              ?.filter(
                (a) =>
                  a &&
                  typeof a === "object" &&
                  "placement" in a &&
                  a.placement === "left"
              )
              ?.map((action, index) => (
                <ActionButton action={action} key={index} />
              ))}
          </div>
          <div className="flex gap-2">
            {bottomActions
              ?.filter((a) => a && typeof a === "object" && !("placement" in a))
              ?.map((action, index) => (
                <ActionButton action={action} key={index} />
              ))}
          </div>
          <div className="flex gap-2">
            {bottomActions
              ?.filter(
                (a) =>
                  a &&
                  typeof a === "object" &&
                  "placement" in a &&
                  a.placement === "right"
              )
              ?.map((action, index) => (
                <ActionButton action={action} key={index} />
              ))}
          </div>
        </footer>
      ) : null}
    </main>
  );
};

export default PageTemplate;
