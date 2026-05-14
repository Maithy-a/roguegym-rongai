import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatMonths } from "@/lib/formatters";

interface PlanHeaderProps {
    title: string;
    price: number;
    isActive: boolean;
    duration: number;
}

export function PlanHeader({ title, price, isActive, duration }: PlanHeaderProps) {
    return (
        <div className="grid p-0.5 bg-accent rounded-lg">
            <Card className="rounded-lg border-0 shadow-none">
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold">{formatCurrency(price)}</span>
                        <span className="text-lg text-muted-foreground">
                            /{duration} {formatMonths(duration)}
                        </span>
                    </div>
                </CardHeader>
                <CardContent>
                    <Badge variant={isActive ? "default" : "secondary"}>{isActive ? "Active" : "Inactive"}</Badge>
                </CardContent>
            </Card>
        </div>
    );
}