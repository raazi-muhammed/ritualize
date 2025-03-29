import { Ban, InfoIcon, XIcon } from "lucide-react";
import React from "react";

const InfoMessage = ({
    message,
    actions,
    type = "info",
}: {
    message: string;
    actions?: React.ReactNode[];
    type?: "info" | "error";
}) => {
    return (
        <div className="w-full h-max p-8 gap-2 grid">
            {type === "info" ? (
                <InfoIcon className="w-10 h-10 mx-auto text-muted-foreground" />
            ) : (
                <Ban className="w-10 h-10 mx-auto text-muted-foreground" />
            )}
            <p className="text-center text-muted-foreground">{message}</p>
            <div className="flex flex-col w-fit mx-auto gap-2">
                {actions?.map((action) => action)}
            </div>
        </div>
    );
};

export default InfoMessage;
