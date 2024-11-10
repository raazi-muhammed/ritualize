"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import AddTask from "../../(tasks)/add/_components/AddTask";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

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
                <AddTask routineId={params.id} />
            </DialogContent>
        </Dialog>
    );
};

export default Page;
