"use client";

import { EvilPieChart } from "@/components/evilcharts/charts/pie-chart";
import { ChartConfig } from "@/components/evilcharts/ui/chart";

interface RevenueByPlan {
    planKey: string;
    title: string;
    revenue: number;
    transactions: number;
}

interface PaymentDonutProps {
    data: RevenueByPlan[];
}

const COLORS = [
    { light: ["#3b82f6"], dark: ["#60a5fa"] },
    { light: ["#10b981"], dark: ["#34d399"] },
    { light: ["#f59e0b"], dark: ["#fbbf24"] },
    { light: ["#8b5cf6"], dark: ["#a78bfa"] },
    { light: ["#ef4444"], dark: ["#f87171"] },
];

export default function PaymentDonut({
    data,
}: PaymentDonutProps) {

    const chartConfig = data.reduce((accumulator, item, index) => {
        accumulator[item.planKey] = {
            label: item.title,
            colors: COLORS[index % COLORS.length],
        };

        return accumulator;
    }, {} as ChartConfig);

    const revenueByPlan = data.map((item) => ({
        plan: item.planKey,
        revenue: item.revenue,
        label: item.title,
        transactions: item.transactions,
    }));

    return (
        <div className="rounded-lg max-w-xs bg-background p-6 border">
            <h2 className="text-lg font-semibold tracking-tight">
                Revenue by Plan
            </h2>

            <p className="text-xs text-muted-foreground">
                Compare revenue generated across billing plans
            </p>

            <div className="flex items-center justify-center">
                <div className="w-full max-w-xl">
                    <EvilPieChart
                        data={revenueByPlan}
                        className="aspect-square"
                        dataKey="revenue"
                        nameKey="plan"
                        chartConfig={chartConfig}
                        innerRadius={55}
                        paddingAngle={2}
                        cornerRadius={4}
                        tooltipVariant="frosted-glass"
                    />
                </div>
            </div>
        </div>
    );
}