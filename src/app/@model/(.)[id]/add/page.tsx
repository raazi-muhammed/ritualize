"use client";

import AddTask from "@/app/(routine)/[id]/(tasks)/add/_components/AddTask";
import ResponsiveModel from "@/components/layout/ResponsiveModel";

const Page = ({ params }: { params: { id: string } }) => {
    return (
        <ResponsiveModel
            openUrl={`/${params.id}/add`}
            closeUrl={`/${params.id}`}>
            <AddTask routineId={params.id} />
        </ResponsiveModel>
    );
};

export default Page;
