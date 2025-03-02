"use client";

import AddTaskPage from "@/app/(routine)/[id]/(tasks)/add/page";
import ResponsiveModel from "@/components/layout/ResponsiveModel";

const Page = ({ params }: { params: { id: string } }) => {
    return (
        <ResponsiveModel
            openUrl={`/${params.id}/add`}
            closeUrl={`/${params.id}`}>
            <AddTaskPage params={params} />
        </ResponsiveModel>
    );
};

export default Page;
