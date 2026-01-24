"use client";

import FormButton from "@/components/form/FormButton";
import FormInput from "@/components/form/FormInput";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  useUpdateProfile,
  useGetUploadUrl,
  useUpdateImage,
} from "@/queries/user.query";
import { ImagePlus } from "lucide-react";

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  defaultValues?: ProfileFormValues & { image?: string };
  onSuccess?: () => void;
}

export function ProfileForm({ defaultValues, onSuccess }: ProfileFormProps) {
  const { mutateAsync: updateProfile } = useUpdateProfile();
  const getUploadUrl = useGetUploadUrl();
  const { mutateAsync: updateImage } = useUpdateImage();

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    defaultValues?.image || null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: defaultValues?.name || "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (values: ProfileFormValues) => {
    // Update name if changed
    if (values.name !== defaultValues?.name) {
      await updateProfile(values.name);
    }

    // Update image if selected
    if (selectedImage) {
      const postUrl = await getUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": selectedImage.type },
        body: selectedImage,
      });
      const { storageId } = await result.json();
      await updateImage(storageId);
    }

    onSuccess?.();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col items-center gap-4">
          <div
            className="relative group cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-primary/20 bg-primary/5 flex items-center justify-center">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="text-2xl font-bold uppercase tracking-widest text-primary/40">
                  {form.watch("name")?.[0] || "?"}
                </div>
              )}
            </div>
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <ImagePlus className="h-8 w-8 text-white" />
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Click to change profile picture
          </p>
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormInput label="Display Name">
              <Input {...field} autoFocus className="text-right" />
            </FormInput>
          )}
        />
        <FormButton isLoading={form.formState.isSubmitting}>
          Save Changes
        </FormButton>
      </form>
    </Form>
  );
}
