import React, { ReactNode } from "react";
import { Button } from "../ui/button";

function FormButton({
    isLoading,
    children,
}: {
    isLoading: boolean;
    children: ReactNode | string;
}) {
    return (
        <Button className="w-full" disabled={isLoading} type="submit">
            {isLoading ? "Loading..." : children}
        </Button>
    );
}

export default FormButton;
