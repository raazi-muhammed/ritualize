import EditTaskPage from "@/app/(routine)/[id]/(tasks)/[taskId]/edit/page";
import ResponsiveModel from "@/components/layout/ResponsiveModel";
import React from "react";

const Page = ({ params }: { params: { id: string; taskId: string } }) => {
    return (
        <ResponsiveModel
            openKey="edit"
            openUrl={`/${params.id}/${params.taskId}/edit`}
            closeUrl={`/${params.id}`}>
            <EditTaskPage params={params} />
        </ResponsiveModel>
    );
};

export default Page;
