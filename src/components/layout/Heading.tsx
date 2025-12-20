import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  variant?: "default";
};

export default function Heading({
  children,
  className,
  variant = "default",
}: Props) {
  let options = "text-5xl font-bold";

  switch (variant) {
    case "default":

    default:
  }

  return (
    <h3
      style={{ fontFamily: "Funnel Display" }}
      className={cn(options, className)}
    >
      {children}
    </h3>
  );
}
