import { formatCurrency } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import {
    IconCash,
    IconCreditCard,
    IconCircleCheck,
} from "@tabler/icons-react";

interface PaymentKPIProps {
    totalTransactions: number;
    totalRevenue: number;
    successfulPayments: number;
}

export default function PaymentKPI({
    totalTransactions,
    totalRevenue,
    successfulPayments,
}: PaymentKPIProps) {

    const successRate =
        totalTransactions > 0
            ? Math.round((successfulPayments / totalTransactions) * 100)
            : 0;

    const paymentKpis = [
        {
            label: "Total Revenue",
            value: formatCurrency(totalRevenue),
            icon: IconCash,
            description: "Revenue generated from payments",
        },

        {
            label: "Total Transactions",
            value: totalTransactions.toLocaleString(),
            icon: IconCreditCard,
            description: "Total processed payments",
        },

        {
            label: "Successful Payments",
            value: `${successfulPayments} (${successRate}%)`,
            icon: IconCircleCheck,
            description: "Completed successful transactions",
        },
    ];

    return (
        <div className="grid gap-0.5 overflow-hidden rounded-lg bg-muted p-0.5 md:grid-cols-3 dark:bg-muted/50">
            {paymentKpis.map((kpi) => {
                const Icon = kpi.icon;

                return (
                    <div
                        key={kpi.label}
                        className="flex flex-col gap-3 rounded-lg bg-background px-6 py-6 shadow-xs"
                    >
                        <div className="flex items-start justify-between">
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">
                                    {kpi.label}
                                </p>

                                <h2 className="text-2xl font-semibold tracking-tight">
                                    {kpi.value}
                                </h2>
                            </div>

                            <div
                                className={cn(
                                    "flex size-9 items-center justify-center rounded-xl",
                                    "bg-primary/10 text-primary"
                                )}
                            >
                                <Icon stroke={2} className="size-5" />
                            </div>
                        </div>

                        <p className="mt-4 text-xs text-muted-foreground">
                            {kpi.description}
                        </p>
                    </div>
                );
            })}
        </div>
    );
}