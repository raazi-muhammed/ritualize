"use client";

import * as React from "react";
import { useState, useMemo, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import type { HugeiconsProps, IconSvgElement } from "@hugeicons/react";
import { ICON_NAMES, IconName } from "@/lib/icon-registry";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type IconsList = { icon: IconName; alias?: string[] }[];

const ICON_BUTTONS: IconsList = ICON_NAMES.map((icon) => ({
  icon,
  alias: [] as string[],
}));

// The icon set (~6,000 icons) is only ever needed once something on screen
// actually renders an icon, so load it lazily on first use instead of
// bundling it into every route eagerly. It's still one chunk (per-icon
// dynamic imports aren't viable here: webpack can't resolve a dynamic
// subpath against this package's "exports" map), but deferring it keeps it
// out of the critical initial bundle and it's fetched once and cached.
let barrelPromise: Promise<Record<string, IconSvgElement>> | null = null;

function loadIconBarrel() {
  if (!barrelPromise) {
    barrelPromise = import("@hugeicons/core-free-icons") as Promise<
      Record<string, IconSvgElement>
    >;
  }
  return barrelPromise;
}

const iconCache = new Map<IconName, IconSvgElement>();

function loadIcon(name: IconName): Promise<IconSvgElement> {
  const cached = iconCache.get(name);
  if (cached) return Promise.resolve(cached);

  return loadIconBarrel().then((mod) => {
    const icon = mod[name];
    iconCache.set(name, icon);
    return icon;
  });
}

interface IconPickerProps extends Omit<
  React.ComponentPropsWithoutRef<typeof PopoverTrigger>,
  "onSelect" | "onOpenChange"
> {
  value?: IconName;
  defaultValue?: IconName;
  onValueChange?: (value: IconName) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
  triggerPlaceholder?: string;
  iconsList?: IconsList;
}

const IconPicker = React.forwardRef<
  React.ComponentRef<typeof PopoverTrigger>,
  IconPickerProps
>(
  (
    {
      value,
      defaultValue,
      onValueChange,
      open,
      defaultOpen,
      onOpenChange,
      children,
      searchable = true,
      searchPlaceholder = "Search for an icon...",
      triggerPlaceholder = "Select an icon",
      iconsList = ICON_BUTTONS,
      ...props
    },
    ref
  ) => {
    const [selectedIcon, setSelectedIcon] = useState<IconName | undefined>(
      defaultValue
    );
    const [isOpen, setIsOpen] = useState(defaultOpen || false);

    const handleValueChange = (icon: IconName) => {
      if (value === undefined) {
        setSelectedIcon(icon);
      }
      onValueChange?.(icon);
    };

    const handleOpenChange = (newOpen: boolean) => {
      if (open === undefined) {
        setIsOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    };

    const [search, setSearch] = useState("");
    const [displayCount, setDisplayCount] = useState(36);

    const filteredIcons = useMemo(
      () =>
        search.trim() === ""
          ? iconsList
          : iconsList.filter(
              ({ icon, alias }) =>
                icon.toLowerCase().includes(search.toLowerCase().trim()) ||
                (alias || []).some((alias) =>
                  alias.toLowerCase().includes(search.toLowerCase().trim())
                )
            ),
      [search, iconsList]
    );

    useEffect(() => {
      setDisplayCount(36);
    }, [search]);

    const displayedIcons = useMemo(
      () => filteredIcons.slice(0, displayCount),
      [filteredIcons, displayCount]
    );

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      if (scrollHeight - scrollTop - clientHeight < 36) {
        setDisplayCount((prev) => Math.min(prev + 36, filteredIcons.length));
      }
    };

    return (
      <Popover
        open={open ?? isOpen}
        onOpenChange={handleOpenChange}
        modal={false}
      >
        <PopoverTrigger ref={ref} asChild {...props}>
          {children || (
            <Button variant="ghost" className="">
              {value || selectedIcon ? (
                <>
                  <Icon name={(value || selectedIcon)!} size="1.25rem" />
                </>
              ) : (
                triggerPlaceholder
              )}
            </Button>
          )}
        </PopoverTrigger>
        <PopoverContent className="w-64 p-2">
          {searchable && (
            <Input
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mb-2"
            />
          )}
          <TooltipProvider>
            <div
              className="grid grid-cols-4 gap-2 max-h-60 overflow-auto"
              onScroll={handleScroll}
            >
              {displayedIcons.map(({ icon }) => (
                <IconPickerCell
                  key={icon}
                  icon={icon}
                  onSelect={() => {
                    handleValueChange(icon);
                    setIsOpen(false);
                    setDisplayCount(36);
                    setSearch("");
                  }}
                />
              ))}
              {filteredIcons.length === 0 && (
                <div className="text-center text-gray-500 col-span-4">
                  No icon found
                </div>
              )}
            </div>
          </TooltipProvider>
        </PopoverContent>
      </Popover>
    );
  }
);
IconPicker.displayName = "IconPicker";

const IconPickerCell = React.memo(function IconPickerCell({
  icon,
  onSelect,
}: {
  icon: IconName;
  onSelect: () => void;
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        className={cn(
          "p-2 rounded-md border hover:bg-foreground/10 transition",
          "flex items-center justify-center"
        )}
        onClick={onSelect}
      >
        <Icon name={icon} />
      </TooltipTrigger>
      <TooltipContent>
        <p>{icon}</p>
      </TooltipContent>
    </Tooltip>
  );
});

interface IconProps extends Omit<HugeiconsProps, "ref" | "icon"> {
  name: IconName;
}

const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ name, ...props }, ref) => {
    const [iconData, setIconData] = useState<IconSvgElement | null>(
      iconCache.get(name) ?? null
    );

    useEffect(() => {
      const cached = iconCache.get(name);
      if (cached) {
        setIconData(cached);
        return;
      }
      let isMounted = true;
      setIconData(null);
      loadIcon(name).then((icon) => {
        if (isMounted) setIconData(icon);
      });
      return () => {
        isMounted = false;
      };
    }, [name]);

    if (!iconData) {
      return (
        <span
          aria-hidden
          className="inline-block size-[1em]"
          style={{ width: props.size, height: props.size }}
        />
      );
    }

    return <HugeiconsIcon ref={ref} icon={iconData} {...props} />;
  }
);
Icon.displayName = "Icon";

export { IconPicker, Icon, type IconsList, type IconName };
