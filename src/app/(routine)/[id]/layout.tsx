import DesktopPageTemplate from "@/components/layout/DesktopPageTemplate";

export default function RoutineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DesktopPageTemplate>{children}</DesktopPageTemplate>;
}
