"use client";

import { ReactNode } from "react";
import RoutineProvider from "./_provider/RoutineProvider";

const Layout = ({ children }: { children: ReactNode }) => {
    return <RoutineProvider>{children}</RoutineProvider>;
};

export default Layout;
