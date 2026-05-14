import MembersList from "@/components/plans/MemberList";
// import { PlanHeader } from "@/components/plans/PlanHeader";
import PlanStats from "@/components/plans/PlanStats";
import PlanTransactions from "@/components/plans/PlanTransactions";
import { notFound } from "next/navigation";

interface PlanPageProps {
    params: Promise<{ planKey: string }>
}

export default async function PlanPage({ params }: PlanPageProps) {
    const { planKey } = await params;

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/plans/${planKey}`, {
        cache: "no-store",
    })
    if (!res.ok) return notFound()

    const plan = await res.json()

    return (
        <section className="main-container">
            {/* 
            <PlanHeader
                title={plan.title}
                price={plan.price}
                isActive={plan.isActive}
                duration={plan.durationMonths}
            /> */}

            <PlanStats
                totalMembers={plan.totalMembers}
                totalRevenue={plan.totalRevenue || 0}
                totalTransactions={plan.totalTransactions || 0}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="col-span-2">
                    <PlanTransactions
                        transactions={plan.transactions || []}
                    />
                </div>

                <div className="col-span-1">
                    <MembersList
                        members={plan.members}
                        emptyTitle="No Members Subscribed"
                        emptylabel="Members subscribed to this plan will appear here."
                    />
                </div>
            </div>

        </section>
    );
}