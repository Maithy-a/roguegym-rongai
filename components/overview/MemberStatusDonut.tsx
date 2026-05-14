"use client";

import { EvilPieChart } from "@/components/evilcharts/charts/pie-chart";
import { ChartConfig } from "@/components/evilcharts/ui/chart";

interface MemberStatusData {
    _id: string;
    count: number;
}

const STATUS_COLORS: ChartConfig = {
    active: {
        label: "Active Members",
        colors: {
            light: ["#10b981"],
            dark: ["#34d399"],
        },
    },

    pending: {
        label: "Pending",
        colors: {
            light: ["#f59e0b"],
            dark: ["#fbbf24"],
        },
    },

    inactive: {
        label: "Inactive",
        colors: {
            light: ["#ef4444"],
            dark: ["#f87171"],
        },
    },

    cancelled: {
        label: "Cancelled",
        colors: {
            light: ["#6b7280"],
            dark: ["#9ca3af"],
        },
    },
}

export default function MemberStatusDonut({ data }: { data: MemberStatusData[] }) {
    const chartData = data.map((item) => ({
        status: item._id,
        count: item.count,
        label: STATUS_COLORS[item._id as keyof typeof STATUS_COLORS]?.label || item._id
    }));

    return (
        <div className="group rounded-lg p-0.5 bg-muted">
            <div className="rounded-lg bg-background p-6 w-full h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-lg font-semibold tracking-tight text-foreground">Member Status</h3>
                        <p className="text-xs text-muted-foreground">Membership breakdown</p>
                    </div>
                </div>
                <div className="flex items-center justify-center">
                    <EvilPieChart
                        data={chartData}
                        className="w-60 h-60"
                        dataKey="count"
                        nameKey="status"
                        chartConfig={STATUS_COLORS}
                        innerRadius={55}
                        paddingAngle={2}
                        cornerRadius={6}
                    />
                </div>
            </div>
        </div>
    );
}