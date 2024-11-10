"use client";

import { ReactNode } from "react";
import RoutineProvider from "./_provider/RoutineProvider";

const Layout = ({
    children,
    model,
}: {
    children: ReactNode;
    model: ReactNode;
}) => {
    return (
        <RoutineProvider>
            {model}
            {children}
        </RoutineProvider>
    );
};

export default Layout;
