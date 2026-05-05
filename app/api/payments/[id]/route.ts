import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {

    const { id } = await params;

    if (!ObjectId.isValid(id)) {
        return NextResponse.json(
            { error: "Invalid payment ID" },
            { status: 400 }
        );
    }

    try {

        const client = await clientPromise;
        const db = client.db("rogue-gym-rongai");

        const payment = await db.collection("payments").findOne({
            _id: new ObjectId(id)
        });

        if (!payment) {
            return NextResponse.json(
                { error: "Payment not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            paymentId: payment._id.toString(),
            amount: payment.amount,
            status: payment.status,
            paidAt: payment.paidAt?.toISOString() ?? null,
            memberId: payment.memberId?.toString(),
            planId: payment.planId?.toString(),
        }, { status: 200 })

    } catch (error) {
        console.log("Error fetching payment details:", error);

        return NextResponse.json(
            { error: "Failed to fetch payment details" },
            { status: 500 }
        )
    }
}