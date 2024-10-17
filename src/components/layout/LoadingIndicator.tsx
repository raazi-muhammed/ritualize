import { Loader } from "lucide-react";
import React from "react";

function LoadingIndicator() {
    return (
        <div className="w-full h-screen grid place-items-center">
            <Loader className="animate-spin" />
        </div>
    );
}

export default LoadingIndicator;
