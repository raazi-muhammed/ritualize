"use client";

import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import AddTask from "../../(tasks)/add/_components/AddTask";

const page = ({ params }: { params: { id: string } }) => {
    const router = useRouter();
    return (
        <Dialog
            open={true}
            onOpenChange={(open) => {
                if (!open) router.back();
                return open;
            }}>
            <DialogContent className="p-0 m-0">
                <AddTask routineId={params.id} />
            </DialogContent>
        </Dialog>
    );
};

export default page;
