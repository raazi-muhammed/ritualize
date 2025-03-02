"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import AddRoutine from "@/app/(routine)/add/page";

const Page = ({ params }: { params: { id: string } }) => {
    const router = useRouter();
    const pathname = usePathname();
    const [open, setOpen] = useState(true);

    useEffect(() => {
        if (pathname.includes("add")) {
            setOpen(true);
        } else setOpen(false);
    }, [pathname]);

    return (
        <Dialog
            defaultOpen={true}
            open={open}
            onOpenChange={() => {
                router.push(`/${[params.id]}`);
            }}>
            <DialogContent className="p-0 m-0">
                <AddRoutine />
            </DialogContent>
        </Dialog>
    );
};

export default Page;
