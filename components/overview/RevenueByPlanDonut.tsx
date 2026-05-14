"use client";
import { EvilPieChart } from "@/components/evilcharts/charts/pie-chart";
import { ChartConfig } from "@/components/evilcharts/ui/chart";

interface RevenueByPlan {
    planKey: string;
    title: string;
    revenue: number;
    transactions: number;
}

const PLAN_COLORS = [
    { light: ["#3b82f6"], dark: ["#60a5fa"] },
    { light: ["#10b981"], dark: ["#34d399"] },
    { light: ["#f59e0b"], dark: ["#fbbf24"] },
    { light: ["#8b5cf6"], dark: ["#a78bfa"] },
    { light: ["#ef4444"], dark: ["#f87171"] },
];

export default function RevenueByPlanDonut({ data }: { data: RevenueByPlan[] }) {
    const chartConfig = data.reduce((acc, item, index) => {
        acc[item.planKey] = {
            label: item.title,
            colors: PLAN_COLORS[index % PLAN_COLORS.length],
        };
        return acc;
    }, {} as ChartConfig);

    const chartData = data.map((item) => ({
        plan: item.planKey,
        revenue: item.revenue,
        label: item.title,
        transactions: item.transactions,
    }));

    return (
        <div className="group rounded-lg p-0.5 bg-muted ">
            <div className="rounded-lg bg-background p-6 w-full h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-lg font-semibold tracking-tight text-foreground">Revenue by Plan</h3>
                        <p className="text-xs text-muted-foreground">Top performing subscription plans</p>
                    </div>
                </div>
                <div className="flex-1 flex items-center justify-center">
                    <EvilPieChart
                        data={chartData}
                        chartConfig={chartConfig}
                        tooltipVariant="frosted-glass"
                        className="w-60 h-60"
                        dataKey="revenue"
                        nameKey="plan"
                        innerRadius={55}
                        paddingAngle={2}
                        cornerRadius={6}
                        hideLegend
                    />
                </div>
            </div>
        </div>
    );
}