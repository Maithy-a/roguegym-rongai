import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/formatters";
import { notFound } from "next/navigation";

interface PlanPageProps {
    params: Promise<{ id: string }>
}

export default async function PlanPage({ params }: PlanPageProps) {
    const { id } = await params;

    const data = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/plans/${id}`)
    if (!data.ok) return notFound()

    const plan = await data.json()

    return (
        <section className="main-container">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl text-primary">
                    Subscription plans
                </h1>
                <span className="text-sm">
                    Create and manage subscription plans for your customers.
                </span>
            </div>

            <Separator className="mb-2" />

            <h1>Membership Plan</h1>
            <p>{plan.title}</p>
            <p>{formatCurrency(plan.price)}</p>
            <p>{plan.isActive ? "Active" : "Inactive"}</p>

        </section>
    );
}