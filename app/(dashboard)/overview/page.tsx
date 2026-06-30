import MemberStatusDonut from "@/components/overview/MemberStatusDonut";
import RecentTransactionWidget, { RecentTransaction } from "@/components/overview/RecentTransactionWidget";
import RevenueByPlanDonut from "@/components/overview/RevenueByPlanDonut";
import StatsKPI from "@/components/plans/StatsKPI";
import { formatCurrency } from "@/lib/formatters";
import { IconMoneybag, IconUser, IconUsersGroup } from "@tabler/icons-react";
import { notFound } from "next/navigation";

interface OverviewData {
  totalRevenue: number;
  totalTransactions: number;
  totalMembers: number;
  totalEmployees: number;

  revenueByPlan: Array<{
    planKey: string;
    title: string;
    revenue: number;
    transactions: number
  }>;

  memberStatusBreakdown: Array<{
    _id: string;
    count: number
  }>;

  recentTransactions: Array<RecentTransaction>;
}

export default async function OverviewPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/overview`, { cache: "no-store" });
  if (!res.ok) return notFound();

  const data: OverviewData = await res.json();

  const stats = [
    {
      label: "Total Revenue",
      value: formatCurrency(data.totalRevenue),
      icon: IconMoneybag,
      description: "Lifetime gym revenue (KES)"
    },
    {
      label: "Total Members",
      value: data.totalMembers.toLocaleString(),
      icon: IconUsersGroup,
      description: `${data.memberStatusBreakdown.find(s => s._id === 'active')?.count || 0} active`
    },
    {
      label: "Total Employees",
      value: data.totalEmployees.toLocaleString(),
      icon: IconUser,
      description: "Gym staff members"
    }
  ];

  return (
    <section className="main-container space-y-6">
      <StatsKPI stats={stats} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentTransactionWidget
            transactions={data.recentTransactions}
          />
        </div>

        <div className="flex flex-col gap-4">
          <MemberStatusDonut
            data={data.memberStatusBreakdown}
          />

          <RevenueByPlanDonut
            data={data.revenueByPlan}
          />
        </div>
      </div>
    </section>
  );
}