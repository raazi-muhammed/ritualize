import { ReactNode } from "react";

const Layout = ({
    children,
    model,
}: {
    children: ReactNode;
    model: ReactNode;
}) => {
    return (
        <div>
            {model}
            {children}
        </div>
    );
};

export default Layout;
