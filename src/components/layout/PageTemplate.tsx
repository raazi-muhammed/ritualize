"use client";

import { ReactNode, isValidElement, Fragment } from "react";
import { Button } from "../ui/button";
import { ChevronLeft, EllipsisVertical } from "lucide-react";
import Heading from "./Heading";
import { IconType } from "react-icons/lib";
import { useTransitionRouter } from "next-view-transitions";
import { pageSlideBackAnimation } from "@/lib/animations";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { cn } from "@/lib/utils";

type ActionType =
  | {
      label: string;
      icon?: IconType;
      onClick: () => void;
    }
  | ReactNode;

type BottomActionType =
  | {
      label: string;
      icon?: IconType;
      onClick: () => void;
      disabled?: boolean;
      placement?: "left" | "right";
    }
  | ReactNode;

const PageTemplate = ({
  children,
  title,
  actions,
  hideBack,
  backUrl,
  forceBack,
  bottomActions,
}: {
  children: ReactNode;
  title?: string;
  actions?: ActionType[];
  hideBack?: boolean;
  backUrl?: string;
  forceBack?: () => void;
  bottomActions?: BottomActionType[];
}) => {
  const tRouter = useTransitionRouter();
  return (
    <main className="px-5 container-xl py-4">
      <header className="flex justify-between gap-3">
        {!hideBack ? (
          <Button
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
            variant="ghost"
          >
            <ChevronLeft />
          </Button>
        ) : (
          <div />
        )}

        <div className="flex gap-2">
          {actions && actions.length > 3 ? (
            <>
              {actions.slice(0, 2).map((action, index) => {
                if (isValidElement(action)) {
                  return <Fragment key={index}>{action}</Fragment>;
                }
                if (action && typeof action === "object" && "label" in action) {
                  return (
                    <Button
                      key={action.label}
                      onClick={action.onClick}
                      size={action.icon ? "icon" : "sm"}
                      variant="secondary"
                      className="my-auto"
                    >
                      {action.icon ? (
                        <action.icon className="size-5" />
                      ) : (
                        <p> {action.label}</p>
                      )}
                    </Button>
                  );
                }
                return null;
              })}
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" size="icon" className="my-auto">
                    <EllipsisVertical className="size-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {actions.slice(2).map((action, index) => {
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
                            <action.icon className="mr-2 size-4" />
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
            actions?.map((action, index) => {
              if (isValidElement(action)) {
                return <Fragment key={index}>{action}</Fragment>;
              }
              if (action && typeof action === "object" && "label" in action) {
                return (
                  <Button
                    key={action.label}
                    onClick={action.onClick}
                    size={action.icon ? "icon" : "sm"}
                    variant="secondary"
                    className="my-auto"
                  >
                    {action.icon ? (
                      <action.icon className="size-5" />
                    ) : (
                      <p> {action.label}</p>
                    )}
                  </Button>
                );
              }
              return null;
            })
          )}
        </div>
      </header>
      {title && (
        <section className="my-4 bg-background">
          <Heading>{title}</Heading>
        </section>
      )}
      {children}
      <footer className="fixed bottom-12 left-12 right-12 justify-between flex gap-2">
        {bottomActions?.map((action, index) => {
          if (isValidElement(action)) {
            return <Fragment key={index}>{action}</Fragment>;
          }
          if (action && typeof action === "object" && "label" in action) {
            return (
              <Button
                key={action.label}
                disabled={action.disabled}
                onClick={action.onClick}
                size={action.icon ? "icon" : "sm"}
                variant="secondary"
                className={cn(
                  "my-auto",
                  action.placement === "right" && "ms-auto",
                  action.placement === "left" && "me-auto"
                )}
              >
                {action.icon ? (
                  <action.icon className="size-5" />
                ) : (
                  <p> {action.label}</p>
                )}
              </Button>
            );
          }
          return null;
        })}
      </footer>
    </main>
  );
};

export default PageTemplate;
