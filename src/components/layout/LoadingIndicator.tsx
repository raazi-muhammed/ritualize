import { HugeiconsIcon } from "@hugeicons/react";
import { Loading01Icon } from "@hugeicons/core-free-icons";
import React from "react";

function LoadingIndicator() {
  return (
    <div className="w-full h-screen grid place-items-center">
      <HugeiconsIcon icon={Loading01Icon} className="animate-spin" />
    </div>
  );
}

export default LoadingIndicator;
