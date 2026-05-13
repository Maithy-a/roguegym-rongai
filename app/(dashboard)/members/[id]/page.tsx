import { notFound } from "next/navigation";
import TransactionsClient from "./TransactionsClient";
import { MemberResponse } from "@/types/member";
import MemberProfileCard from "@/components/MemberProfileCard";
import MembersMeta from "@/components/MembersMeta";
interface MemberPageProps {
    params: { id: string };
}

export default async function MemberPage({ params }: MemberPageProps) {
    const { id } = await params;

    const res = await fetch(
        `${process.env.NEXT_BASE_URL}/api/members/${id}`,
        { cache: "no-store" }
    );

    const data: MemberResponse = await res.json();

    if (!res.ok || !data.memberId) {
        return notFound();
    }

    return (
        <section className="main-container space-y-6">
            <div className="grid gap-0.5 rounded-lg bg-accent p-0.5 md:grid-cols-2">
                <MemberProfileCard
                    firstName={data.firstName}
                    lastName={data.lastName}
                    email={data.email}
                    currentPlan={data.currentPlan}
                    status={data.currentPlan.status}
                />

                <MembersMeta
                    email={data.email}
                    phoneNumber={data.phoneNumber}
                    memberId={data.memberId}
                    status={data.currentPlan.status}
                />
            </div>

            <TransactionsClient
                transactions={data.transactions}
            />
        </section>
    );
}