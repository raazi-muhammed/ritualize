"use client";

import React, { ReactNode } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Drawer, DrawerContent } from "@/components/ui/drawer";

const ResponsiveModel = ({
    children,
    openUrl,
    closeUrl,
    openKey = "add",
}: {
    children: ReactNode;
    openUrl: string;
    closeUrl: string;
    openKey?: string;
}) => {
    const router = useRouter();
    const pathname = usePathname();
    const [open, setOpen] = useState(true);
    const isDesktop = useMediaQuery("(min-width: 768px)");

    useEffect(() => {
        if (pathname.includes(openKey)) {
            setOpen(true);
        } else setOpen(false);
    }, [pathname]);

    useEffect(() => {
        setOpen((open) => {
            if (open) {
                router.replace(openUrl);
            } else {
                router.replace(closeUrl);
                window.location.reload();
            }
            return open;
        });
    }, [open, pathname]);

    if (isDesktop)
        return (
            <Dialog defaultOpen={true} open={open} onOpenChange={setOpen}>
                <DialogContent className="p-0 m-0">{children}</DialogContent>
            </Dialog>
        );
    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerContent className="h-[calc(100vh-4rem)]">
                {children}
            </DrawerContent>
        </Drawer>
    );
};

export default ResponsiveModel;
