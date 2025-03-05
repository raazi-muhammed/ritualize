import Heading from "@/components/layout/Heading";
import { prisma } from "@/lib/prisma";
import React from "react";
import EditRoutine from "./_component/EditRoutine";

async function getRoutine(id: string) {
    return await prisma.routine.findFirstOrThrow({
        where: {
            id,
        },
    });
}

async function EditRoutinePage({ params }: { params: { id: string } }) {
    const routine = await getRoutine(params.id);

    return (
        <div className="container grid gap-4 py-8">
            <Heading>Edit Routine</Heading>
            <EditRoutine routine={routine} />
        </div>
    );
}

export default EditRoutinePage;
