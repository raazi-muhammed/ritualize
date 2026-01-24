import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Doc } from "../../convex/_generated/dataModel";

export const useGetCurrentUser = () => {
  const data = useQuery(api.users.getMe);
  return {
    data: data as Doc<"users"> | null | undefined,
    isLoading: data === undefined,
  };
};

export const useUpdateProfile = (options?: { onSuccess?: () => void }) => {
  const updateName = useMutation(api.users.updateName);

  const mutate = async (name: string) => {
    await updateName({ name });
    options?.onSuccess?.();
  };

  return { mutate, mutateAsync: mutate };
};

export const useGetUploadUrl = () => {
  return useMutation(api.users.generateUploadUrl);
};

export const useUpdateImage = (options?: { onSuccess?: () => void }) => {
  const updateImage = useMutation(api.users.updateImage);

  const mutate = async (storageId: string) => {
    await updateImage({ storageId: storageId as any });
    options?.onSuccess?.();
  };

  return { mutate, mutateAsync: mutate };
};
