import EditRoutinePage from "@/app/(routine)/[id]/edit/page";
import ResponsiveModel from "@/components/layout/ResponsiveModel";

const Page = ({ params }: { params: { id: string } }) => {
    return (
        <ResponsiveModel
            openKey="edit"
            openUrl={`/${params.id}/edit`}
            closeUrl={`/${params.id}`}>
            <EditRoutinePage params={params} />
        </ResponsiveModel>
    );
};

export default Page;
