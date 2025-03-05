import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ReactNode } from "react";

const Alert = ({
    trigger = null,
    open,
    onSubmit,
    onOpenChange,
}: {
    trigger?: ReactNode;
    open: boolean;
    onSubmit: Function;
    onOpenChange: (open: boolean) => void;
}) => {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            {trigger && <AlertDialogTrigger>{trigger}</AlertDialogTrigger>}
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you absolutely sure?
                    </AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onSubmit as any}>
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default Alert;
