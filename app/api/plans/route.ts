import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db("rogue-gym-rongai");

        const results = await db
            .collection("billing-plans")
            .find({})
            .sort({ createdAt: -1 })
            .toArray();

        return NextResponse.json(
            results.map((plan) => ({
                planId: plan._id.toString(),
                planKey: plan.planKey,
                planTitle: plan.title,
                price: plan.price,
                duration: plan.durationMonths,

                isActive: plan.isActive,
                createdAt: plan.createdAt.toISOString(),
                updatedAt: plan.updatedAt.toISOString()
            }))
        );

    } catch (error) {
        console.error("Error fetching plans:", error);

        return NextResponse.json(
            { error: "Failed to fetch plans" },
            { status: 500 }
        );
    }
}