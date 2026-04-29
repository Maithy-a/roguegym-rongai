import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ planKey: string }> }
) {
    const { planKey } = await params;

    if (!planKey) {
        return NextResponse.json(
            { error: "Plan key is required" },
            { status: 400 }
        );
    }

    try {
        const client = await clientPromise;
        const db = client.db("rogue-gym-rongai");

        const plan = await db.collection("billing-plans").findOne({
            planKey: planKey,
        });

        if (!plan) {
            return NextResponse.json(
                { error: "Plan not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            planId: plan._id.toString(),
            planKey: plan.planKey,
            planTitle: plan.title,
            price: plan.price,
            duration: plan.durationMonths,
            description: plan.description
        });

    } catch (error) {
        console.error("Error fetching plan:", error);

        return NextResponse.json(
            { error: "Failed to fetch plan" },
            { status: 500 }
        );
    }
}