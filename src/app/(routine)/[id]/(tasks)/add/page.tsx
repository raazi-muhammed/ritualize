import React from "react";
import AddTask from "./_components/AddTask";

const Page = ({ params }: { params: { id: string } }) => {
    return <AddTask routineId={params.id} />;
};

export default Page;
