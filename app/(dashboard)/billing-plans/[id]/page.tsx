import { formatCurrency } from "@/lib/formatters";
import { notFound } from "next/navigation";

interface PlanPageProps {
    params: Promise<{ id: string }>
}

export default async function PlanPage({ params }: PlanPageProps) {
    const { id } = await params;

    const res = await fetch(`${process.env.NEXT_BASE_URL}/api/plans/${id}`, {
        cache: "no-store",
    })
    if (!res.ok) return notFound()

    const plan = await res.json()

    return (
        <section className="main-container">
            <h1>Membership Plan</h1>
            <p>{plan.title}</p>
            <p>{formatCurrency(plan.price)}</p>
            <p>{plan.isActive ? "Active" : "Inactive"}</p>
        </section>
    );
}