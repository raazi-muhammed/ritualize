"use client";

import { ReactNode, isValidElement, Fragment } from "react";
import { Button } from "../ui/button";
import { ChevronLeft } from "lucide-react";
import Heading from "./Heading";
import { IconType } from "react-icons/lib";
import { useTransitionRouter } from "next-view-transitions";
import { pageSlideBackAnimation } from "@/lib/animations";

type ActionType =
  | {
      label: string;
      icon?: IconType;
      onClick: () => void;
    }
  | ReactNode;

const PageTemplate = ({
  children,
  title,
  actions,
  hideBack,
  backUrl,
}: {
  children: ReactNode;
  title: string;
  actions?: ActionType[];
  hideBack?: boolean;
  backUrl?: string;
}) => {
  const tRouter = useTransitionRouter();
  return (
    <main className="px-5 container-xl py-4">
      <header className="flex justify-between gap-3">
        {!hideBack ? (
          <Button
            onClick={() => {
              if (backUrl) {
                tRouter.push(backUrl, {
                  onTransitionReady: pageSlideBackAnimation,
                });
              } else {
                tRouter.back();
              }
            }}
            variant="ghost"
          >
            <ChevronLeft />
          </Button>
        ) : (
          <div />
        )}

        <div className="flex gap-2">
          {actions?.map((action, index) => {
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
        </div>
      </header>
      <section className="my-4 bg-background">
        <Heading>{title}</Heading>
      </section>
      {children}
    </main>
  );
};

export default PageTemplate;
