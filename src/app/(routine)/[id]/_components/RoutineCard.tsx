import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Icon } from "@/components/ui/icon-picker";
import { formatDuration } from "@/lib/format";
import { Routine } from "@prisma/client";
import { Dot, Heart } from "lucide-react";

const RoutineCard = ({ routine }: { routine: Routine }) => {
    return (
        <Card className="relative -z-0 overflow-hidden p-2">
            <CardHeader className="z-10 p-4">
                <CardTitle className="flex justify-between text-lg">
                    {routine.name}
                    {routine.is_favorite ? (
                        <Heart
                            className="fill-primary text-primary"
                            size={18}
                        />
                    ) : (
                        <Heart className="text-secondary" size={18} />
                    )}
                </CardTitle>
                <Icon name={routine.icon as any} />
                <CardDescription className="flex">
                    {formatDuration(routine.duration)} <Dot />
                    {routine.type}
                </CardDescription>
            </CardHeader>
        </Card>
    );
};

export default RoutineCard;
