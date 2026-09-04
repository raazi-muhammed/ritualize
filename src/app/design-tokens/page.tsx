"use client";

import { useState, type CSSProperties } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// The app forces dark theme globally (see ThemeProvider in layout.tsx), so this
// page can't rely on next-themes or the ambient `.dark` class to preview light
// mode — it declares both full token sets itself and swaps them via inline vars.
const LIGHT_VARS = {
  "--background": "240 15% 92%",
  "--foreground": "0 0% 4%",
  "--card": "0 0% 100%",
  "--card-foreground": "0 0% 4%",
  "--popover": "0 0% 100%",
  "--popover-foreground": "0 0% 4%",
  "--primary": "239 83% 67%",
  "--primary-foreground": "0 0% 98%",
  "--secondary": "240 15% 94%",
  "--secondary-foreground": "0 0% 4%",
  "--muted": "0 0% 96%",
  "--muted-foreground": "0 0% 45%",
  "--accent": "239 58% 85%",
  "--accent-foreground": "0 0% 9%",
  "--destructive": "357 100% 45%",
  "--destructive-foreground": "0 0% 98%",
  "--border": "0 0% 90%",
  "--input": "0 0% 90%",
  "--ring": "0 0% 63%",
  "--chart-1": "244 49% 90%",
  "--chart-2": "227 49% 90%",
  "--chart-3": "263 69% 89%",
  "--chart-4": "0 0% 25%",
  "--chart-5": "0 0% 15%",
  "--sidebar": "240 15% 94%",
  "--sidebar-foreground": "0 0% 4%",
  "--sidebar-primary": "239 83% 67%",
  "--sidebar-primary-foreground": "0 0% 98%",
  "--sidebar-accent": "239 58% 85%",
  "--sidebar-accent-foreground": "0 0% 9%",
  "--sidebar-border": "0 0% 90%",
  "--sidebar-ring": "0 0% 63%",
} as CSSProperties;

const DARK_VARS = {
  "--background": "240 4% 5%",
  "--foreground": "0 0% 98%",
  "--card": "240 9% 9%",
  "--card-foreground": "0 0% 98%",
  "--popover": "240 9% 9%",
  "--popover-foreground": "0 0% 98%",
  "--primary": "239 83% 67%",
  "--primary-foreground": "0 0% 98%",
  "--secondary": "240 6% 6%",
  "--secondary-foreground": "0 0% 98%",
  "--muted": "0 0% 15%",
  "--muted-foreground": "0 0% 63%",
  "--accent": "239 35% 24%",
  "--accent-foreground": "0 0% 98%",
  "--destructive": "359 100% 70%",
  "--destructive-foreground": "0 0% 98%",
  "--border": "240 1% 15%",
  "--input": "240 1% 19%",
  "--ring": "0 0% 45%",
  "--chart-1": "244 39% 10%",
  "--chart-2": "227 49% 10%",
  "--chart-3": "263 69% 11%",
  "--chart-4": "0 0% 25%",
  "--chart-5": "0 0% 15%",
  "--sidebar": "240 6% 6%",
  "--sidebar-foreground": "0 0% 98%",
  "--sidebar-primary": "239 83% 67%",
  "--sidebar-primary-foreground": "0 0% 98%",
  "--sidebar-accent": "239 35% 24%",
  "--sidebar-accent-foreground": "0 0% 98%",
  "--sidebar-border": "240 1% 15%",
  "--sidebar-ring": "0 0% 45%",
} as CSSProperties;

const COLOR_GROUPS: { title: string; tokens: [string, string][] }[] = [
  {
    title: "Base",
    tokens: [
      ["background", "bg-background"],
      ["foreground", "bg-foreground"],
      ["border", "bg-border"],
      ["input", "bg-input"],
      ["ring", "bg-ring"],
    ],
  },
  {
    title: "Surfaces",
    tokens: [
      ["card", "bg-card"],
      ["card-foreground", "bg-card-foreground"],
      ["popover", "bg-popover"],
      ["popover-foreground", "bg-popover-foreground"],
    ],
  },
  {
    title: "Brand",
    tokens: [
      ["primary", "bg-primary"],
      ["primary-foreground", "bg-primary-foreground"],
      ["secondary", "bg-secondary"],
      ["secondary-foreground", "bg-secondary-foreground"],
      ["accent", "bg-accent"],
      ["accent-foreground", "bg-accent-foreground"],
    ],
  },
  {
    title: "Utility",
    tokens: [
      ["muted", "bg-muted"],
      ["muted-foreground", "bg-muted-foreground"],
      ["destructive", "bg-destructive"],
      ["destructive-foreground", "bg-destructive-foreground"],
    ],
  },
  {
    title: "Chart",
    tokens: [
      ["chart-1", "bg-chart-1"],
      ["chart-2", "bg-chart-2"],
      ["chart-3", "bg-chart-3"],
      ["chart-4", "bg-chart-4"],
      ["chart-5", "bg-chart-5"],
    ],
  },
  {
    title: "Sidebar",
    tokens: [
      ["sidebar", "bg-sidebar"],
      ["sidebar-foreground", "bg-sidebar-foreground"],
      ["sidebar-primary", "bg-sidebar-primary"],
      ["sidebar-accent", "bg-sidebar-accent"],
      ["sidebar-border", "bg-sidebar-border"],
      ["sidebar-ring", "bg-sidebar-ring"],
    ],
  },
];

const RADIUS_SCALE: [string, string][] = [
  ["xs", "rounded-xs"],
  ["sm", "rounded-sm"],
  ["md", "rounded-md"],
  ["lg (default)", "rounded-lg"],
  ["xl", "rounded-xl"],
  ["2xl", "rounded-2xl"],
  ["3xl", "rounded-3xl"],
  ["4xl", "rounded-4xl"],
];

const BUTTON_VARIANTS = [
  "default",
  "outline",
  "secondary",
  "card",
  "ghost",
  "destructive",
  "link",
] as const;

const BUTTON_SIZES = ["xs", "sm", "default", "lg"] as const;
const ICON_SIZES = ["icon-xs", "icon-sm", "icon", "icon-lg"] as const;

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold font-mono">{title}</h2>
      {children}
    </section>
  );
}

function Swatch({ name, className }: { name: string; className: string }) {
  return (
    <div className="space-y-1.5">
      <div
        className={cn(
          "h-16 w-full rounded-lg border border-border",
          className
        )}
      />
      <p className="text-xs text-muted-foreground font-mono truncate">
        {name}
      </p>
    </div>
  );
}

export default function DesignTokensPage() {
  const [dark, setDark] = useState(true);

  return (
    <div style={dark ? DARK_VARS : LIGHT_VARS}>
      <div className="min-h-screen bg-background text-foreground">
        <div className="mx-auto max-w-5xl px-6 py-12 space-y-14">
          <header className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold font-mono">Design Tokens</h1>
              <p className="text-muted-foreground mt-1">
                Colors, fonts, radius, and buttons at a glance.
              </p>
            </div>
            <Button variant="secondary" onClick={() => setDark((d) => !d)}>
              {dark ? "Switch to light" : "Switch to dark"}
            </Button>
          </header>

          <Separator />

          <Section title="Fonts">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-lg border border-border p-6 space-y-3">
                <p className="text-xs text-muted-foreground font-mono">
                  font-sans — Inter
                </p>
                <p className="text-3xl font-sans font-bold">
                  Aa Bb Cc 0123
                </p>
                <p className="font-sans text-sm">
                  The quick brown fox jumps over the lazy dog.
                </p>
              </div>
              <div className="rounded-lg border border-border p-6 space-y-3">
                <p className="text-xs text-muted-foreground font-mono">
                  font-mono — Fira Code (display / headings)
                </p>
                <p className="text-3xl font-mono font-bold">Aa Bb Cc 0123</p>
                <p className="font-mono text-sm">
                  The quick brown fox jumps over the lazy dog.
                </p>
              </div>
            </div>
          </Section>

          <Separator />

          <Section title="Colors">
            <div className="space-y-8">
              {COLOR_GROUPS.map((group) => (
                <div key={group.title} className="space-y-3">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    {group.title}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {group.tokens.map(([name, className]) => (
                      <Swatch key={name} name={name} className={className} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Separator />

          <Section title="Border Radius">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {RADIUS_SCALE.map(([name, className]) => (
                <div key={name} className="space-y-1.5">
                  <div
                    className={cn(
                      "h-16 w-full bg-secondary border border-border",
                      className
                    )}
                  />
                  <p className="text-xs text-muted-foreground font-mono">
                    {name}
                  </p>
                </div>
              ))}
            </div>
          </Section>

          <Separator />

          <Section title="Buttons">
            <div className="space-y-4">
              {BUTTON_VARIANTS.map((variant) => (
                <div
                  key={variant}
                  className="flex flex-wrap items-center gap-3"
                >
                  <span className="w-24 text-xs text-muted-foreground font-mono">
                    {variant}
                  </span>
                  {BUTTON_SIZES.map((size) => (
                    <Button key={size} variant={variant} size={size}>
                      {size}
                    </Button>
                  ))}
                  {ICON_SIZES.map((size) => (
                    <Button key={size} variant={variant} size={size}>
                      *
                    </Button>
                  ))}
                </div>
              ))}
            </div>
          </Section>

          <Separator />

          <Section title="Surface Layering">
            <div className="rounded-3xl bg-background border border-border p-8">
              <p className="text-xs text-muted-foreground font-mono mb-4">
                background
              </p>
              <div className="rounded-2xl bg-card border border-border p-8">
                <p className="text-xs text-muted-foreground font-mono mb-4">
                  card
                </p>
                <div className="rounded-xl bg-secondary p-8">
                  <p className="text-xs text-muted-foreground font-mono">
                    secondary
                  </p>
                </div>
              </div>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}
