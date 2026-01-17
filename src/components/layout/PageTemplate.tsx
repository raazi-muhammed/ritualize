"use client";

import {
  ReactNode,
  isValidElement,
  Fragment,
  useRef,
  useState,
  useEffect,
} from "react";
import Heading from "./Heading";
import { useTransitionRouter } from "next-view-transitions";
import { pageSlideBackAnimation } from "@/lib/animations";
import { cn } from "@/lib/utils";
import { IconName } from "../ui/icon-picker";
import ButtonTemplate from "./ButtonTemplate";
import { useIsMobile } from "@/hooks/use-mobile";
import DropdownTemplate from "./DropdownTemplate";

export type ActionType =
  | {
      label?: string;
      icon?: IconName;
      onClick: () => void;
      placement?: "left" | "right";
      disabled?: boolean;
      className?: string;
      variant?: "default" | "destructive";
    }
  | ReactNode;

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
  const titleRef = useRef<HTMLDivElement>(null);
  const [showSmallTitle, setShowSmallTitle] = useState(false);

  useEffect(() => {
    if (!titleRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowSmallTitle(!entry.isIntersecting);
      },
      {
        threshold: 0,
        rootMargin: "-60px 0px 0px 0px", // Adjust based on header height to trigger slightly before/after
      }
    );

    observer.observe(titleRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <main className="px-5 container-xl py-4">
      <header
        className={cn(
          `flex justify-between items-center gap-3 sticky top-5 pb-4 z-50`
        )}
      >
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
            className="ps-0 pe-12 transition-all" // Added transition-all to ensure smooth layout if needed, though z-index handles overlap
            icon="ChevronLeft"
          />
        ) : (
          <div />
        )}

        {/* Small Sticky Title */}
        <div
          className={cn(
            "absolute left-1/2 -translate-x-1/2 transition-all duration-300 pointer-events-none",
            showSmallTitle
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2"
          )}
        >
          <h3
            style={{ fontFamily: "Funnel Display" }}
            className="font-bold text-lg"
          >
            {title}
          </h3>
        </div>

        <div className="flex gap-2 relative z-10">
          {" "}
          {/* z-10 to stay above centered title if overlap */}
          {actions && actions.length > 2 ? (
            <>
              {actions.slice(0, 1).map((action, index) => (
                <ActionButton action={action} key={index} />
              ))}
              <DropdownTemplate actions={actions.slice(1)} />
            </>
          ) : (
            actions?.map((action, index) => (
              <ActionButton action={action} key={index} />
            ))
          )}
        </div>
      </header>
      {title && (
        <section ref={titleRef} className="bg-background scroll-mt-24">
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
