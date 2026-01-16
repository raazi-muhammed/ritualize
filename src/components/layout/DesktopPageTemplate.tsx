import RoutineList from "@/app/(routine)/_components/RoutineList";
import React from "react";

const DesktopPageTemplate = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex">
      <div className="w-[20vw] border-2 border-red-500">
        <RoutineList />
      </div>
      <div className="w-[80vw] border-2 border-green-500">{children}</div>
    </div>
  );
};

export default DesktopPageTemplate;
