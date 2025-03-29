import { InfoIcon } from "lucide-react";
import React from "react";

const InfoMessage = ({
    message,
    actions,
}: {
    message: string;
    actions?: React.ReactNode[];
}) => {
    return (
        <div className="w-full p-8 gap-2 grid">
            <InfoIcon className="w-10 h-10 mx-auto text-muted-foreground" />
            <p className="text-center text-muted-foreground">{message}</p>
            <div className="flex flex-col w-fit mx-auto gap-2">
                {actions?.map((action) => action)}
            </div>
        </div>
    );
};

export default InfoMessage;
