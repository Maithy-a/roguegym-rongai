import { formatCurrency } from "@/lib/formatters";
import StatsKPI from "@/components/plans/StatsKPI";
import { IconCreditCard, IconUser } from "@tabler/icons-react";

interface PlanStatsProps {
    totalMembers: number;
    totalRevenue: number;
    totalTransactions: number;
}

export default function PlanStats({ totalMembers, totalRevenue, totalTransactions }: PlanStatsProps) {
    const planStats = [
        {
            label: "Total Members",
            value: totalMembers.toLocaleString(),
            icon: IconUser,
            description: "Enrolled in this plan"
        },
        {
            label: "Total Revenue",
            value: formatCurrency(totalRevenue),
            icon: IconCreditCard,
            description: "Revenue Generated from subscriptions",
        },
        {
            label: "Total Transactions",
            value: totalTransactions.toLocaleString(),
            icon: IconCreditCard,
            description: "Sucessfull Payments processed",
        },
    ];

    return <StatsKPI stats={planStats} />;
}