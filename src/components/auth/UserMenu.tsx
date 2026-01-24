"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetCurrentUser } from "@/queries/user.query";
import { useModal } from "@/providers/ModelProvider";
import { ProfileForm } from "./ProfileForm";

export function UserMenu() {
  const { signOut } = useAuthActions();
  const { data: user } = useGetCurrentUser();
  const { openModal, closeModal } = useModal();

  const handleOpenProfile = () => {
    openModal({
      title: "Profile",
      content: (
        <ProfileForm
          defaultValues={{
            name: user?.name || "",
            image: user?.image || undefined,
          }}
          onSuccess={closeModal}
        />
      ),
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium overflow-hidden">
            {user?.image ? (
              <img
                src={user.image}
                alt={user.name || "User"}
                className="h-full w-full object-cover"
              />
            ) : (
              user?.name?.[0]?.toUpperCase() || "U"
            )}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleOpenProfile}>Profile</DropdownMenuItem>
        <DropdownMenuItem onClick={() => signOut()}>Sign Out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
