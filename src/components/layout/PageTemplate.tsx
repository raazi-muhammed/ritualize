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

const StickyTitle = ({
  title,
  triggerRef,
}: {
  title: string;
  triggerRef: React.RefObject<HTMLDivElement>;
}) => {
  const [showSmallTitle, setShowSmallTitle] = useState(false);

  useEffect(() => {
    if (!triggerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowSmallTitle(!entry.isIntersecting);
      },
      {
        threshold: 0,
        rootMargin: "-60px 0px 0px 0px",
      }
    );

    observer.observe(triggerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [triggerRef]);

  return (
    <div
      className={cn(
        "absolute left-1/2 -translate-x-1/2 transition-all duration-300 pointer-events-none will-change-[opacity,transform]",
        showSmallTitle ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      )}
    >
      <h3
        style={{ fontFamily: "Funnel Display" }}
        className="font-bold text-lg"
      >
        {title}
      </h3>
    </div>
  );
};

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
  const [isHeaderElevated, setIsHeaderElevated] = useState(false);
  const allowHeaderFx = !isOnSidebar;

  useEffect(() => {
    if (!allowHeaderFx) {
      setIsHeaderElevated(false);
      return;
    }

    const onScroll = () => {
      setIsHeaderElevated(window.scrollY > 4);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [allowHeaderFx, isMobile]);

  return (
    <main className="px-5 container-xl py-4">
      <header
        className={cn(
          "relative flex justify-between items-center gap-3 sticky pb-4 z-50 transition-colors transition-shadow duration-200",
          isMobile ? "top-0 pt-4 rounded-2xl -mx-2 px-2" : "top-0 pt-4",
          allowHeaderFx &&
            isHeaderElevated &&
            "overflow-hidden before:content-[''] before:absolute before:inset-0 before:-z-20 before:backdrop-blur-sm before:[mask-image:linear-gradient(to_bottom,rgba(0,0,0,1),rgba(0,0,0,0))] after:content-[''] after:absolute after:inset-0 after:-z-10 after:bg-gradient-to-b after:from-background/90 after:via-background/50 after:to-transparent"
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
            className="ps-0 pe-12 transition-all"
            icon="ChevronLeft"
          />
        ) : (
          <div />
        )}

        {/* Small Sticky Title */}
        {title && <StickyTitle title={title} triggerRef={titleRef} />}

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
