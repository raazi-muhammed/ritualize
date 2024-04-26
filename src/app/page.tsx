import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { AddRoutine } from "./_components/AddRoutine";

export default function Home() {
    return (
        <main className="container">
            <section className="mt-4 flex justify-end">
                <AddRoutine />
            </section>
            <h1 style={{ fontFamily: "Bodoni" }} className="text-3xl">
                Routine
            </h1>
            <Card>
                <CardHeader>
                    <CardTitle>Morning routine</CardTitle>
                    <CardDescription>10 min</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-end">
                    <Button size="sm">Start</Button>
                </CardContent>
            </Card>
        </main>
    );
}
