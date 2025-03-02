"use client";

import AddRoutine from "@/app/(routine)/add/page";
import ResponsiveModel from "@/components/layout/ResponsiveModel";

const Page = () => {
    return (
        <ResponsiveModel openUrl="/add" closeUrl="/">
            <AddRoutine />
        </ResponsiveModel>
    );
};

export default Page;
