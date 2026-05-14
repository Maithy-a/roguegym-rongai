import { formatCurrency } from "@/lib/formatters";
import {
    IconCash,
    IconCreditCard,
    IconCircleCheck,
} from "@tabler/icons-react";

import StatsKPI, { StatItem } from "../StatsKPI";

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

    const paymentKpis: StatItem[] = [
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

    return <StatsKPI stats={paymentKpis} />;

}