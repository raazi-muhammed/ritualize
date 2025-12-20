import React from "react";
import { Skeleton } from "../ui/skeleton";
import LoadingIndicator from "./LoadingIndicator";

const ContentStateTemplate = ({
  isLoading,
  children,
  skeleton,
}: {
  isLoading: boolean;
  children: React.ReactNode;
  skeleton?: React.ReactNode;
}) => {
  if (isLoading) {
    return skeleton || <LoadingIndicator />;
  }
  return children;
};

export default ContentStateTemplate;
