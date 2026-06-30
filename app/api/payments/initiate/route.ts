import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { memberId, email, planKey } = await request.json()

        if (!memberId || !email || !planKey) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            )
        }

        const client = await clientPromise
        const db = client.db("rogue-gym-rongai")
        const member = await db
            .collection("members")
            .findOne({
                memberId: memberId,
            })

        if (!member) {
            return NextResponse.json(
                { error: "Member not found" },
                { status: 404 }
            )
        }

        const plan = await db
            .collection("billing-plans")
            .findOne({
                planKey,
                isActive: true,
            })

        if (!plan) {
            return NextResponse.json(
                { error: "Plan not found" },
                { status: 404 }
            )
        }

        const reference = `CUST-${crypto.randomUUID()}`

        const paystackResponse = await fetch(
            "https://api.paystack.co/transaction/initialize",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    amount: plan.price * 100,
                    reference,
                    callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payments/verify`,
                    metadata: { memberId, planKey },
                }),
            }
        )

        const paystackData = await paystackResponse.json()

        if (!paystackData.status) {
            return NextResponse.json(
                { error: "Failed to initialize payment" },
                { status: 500 }
            )
        }

        await db.collection("members").updateOne(
            { _id: member._id },
            {
                $set: {
                    currentPaymentReference: reference,
                    updatedAt: new Date(),
                },

                $inc: {
                    paymentAttempts: 1,
                }
            }
        )

        return NextResponse.json({
            success: true,
            reference,
            amount: plan.price,
            accessCode: paystackData.data.access_code,
        });

    } catch (error) {
        console.error("Payment initialization error:", error)

        return NextResponse.json(
            { error: "Failed to initialize payment" },
            { status: 500 }
        )
    }
}