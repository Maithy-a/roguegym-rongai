import { cn } from "@/lib/utils";
import { Icon } from "@tabler/icons-react";

export interface StatItem {
    label: string
    value: string | number
    icon: Icon
    description: string
}

interface StatsKPIProps {
    stats: StatItem[]
}

export default function StatsKPI({ stats }: StatsKPIProps) {
    return (
        <div className={cn("grid gap-0.5 overflow-hidden rounded-lg bg-muted p-0.5 md:grid-cols-3 dark:bg-muted/50")}>
            {stats.map((stat) => {

                const Icon = stat.icon;

                return (
                    <div
                        key={stat.label}
                        className="flex flex-col gap-3 rounded-md border bg-background px-6 py-6 shadow-xs"
                    >

                        <div className="flex items-start justify-between">
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">
                                    {stat.label}
                                </p>
                                <h2 className="text-2xl font-semibold tracking-tight">
                                    {stat.value}
                                </h2>
                            </div>

                            <div className={cn("flex size-9 items-center justify-center rounded-lg bg-accent text-primary")}>
                                <Icon
                                    className="size-5 h-5 w-5"
                                    strokeWidth={2}
                                />
                            </div>
                        </div>

                        <p className="mt-4 text-xs text-muted-foreground">
                            {stat.description}
                        </p>
                    </div>
                );
            })}
        </div>
    );
}