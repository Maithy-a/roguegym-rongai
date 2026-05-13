import clientPromise from "@/lib/mongodb";
import { MemberStatus, PaymentStatus } from "@/types/member";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const reference = request.nextUrl.searchParams.get("reference")

        if (!reference) {
            return NextResponse.json(
                { error: "Missing payment reference" },
                { status: 400 }
            )
        }

        const paystackResponse = await fetch(
            `https://api.paystack.co/transaction/verify/${reference}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                }
            }
        )

        const paystackResult = await paystackResponse.json()

        if (!paystackResult.status || paystackResult.data.status !== "success") {
            return NextResponse.json(
                { error: "Payment verification failed" },
                { status: 400 }
            )
        }

        const paymentData = paystackResult.data;
        const client = await clientPromise;
        const db = client.db("rogue-gym-rongai");

        const existingPayment = await db
            .collection("payments")
            .findOne({ reference })

        if (existingPayment) {
            return NextResponse.json({
                success: true,
                message: "Payment already verified",

                reference: existingPayment.reference,
                paymentChannel: existingPayment.paymentChannel,
                paidAt: existingPayment.paidAt,
                amount: existingPayment.amount,
            });
        }

        const member = await db
            .collection("members")
            .findOne({
                currentPaymentReference: reference,
            })

        if (!member) {
            return NextResponse.json(
                { error: "Member not found" },
                { status: 404 }
            )
        }

        const amount = paymentData.amount / 100

        const startDate = new Date()
        const endDate = new Date()
        endDate.setMonth(
            endDate.getMonth() +
            member.plan.durationMonths
        )

        const memberStatus: MemberStatus = "active"
        const paymentStatus: PaymentStatus = "paid"

        await db.collection("payments").insertOne({
            memberId: member._id,
            reference,
            amount,

            currency: paymentData.currency,
            paymentChannel: paymentData.channel,
            paidAt: paymentData.paid_at,
            status: paymentData.status,
            gatewayResponse: paymentData.gateway_response,
            plan: member.plan,
            createdAt: new Date(),
        })

        await db.collection("members").updateOne(
            { _id: member._id },
            {
                $set: {
                    memberStatus,
                    paymentStatus,
                    membershipStartDate: startDate,
                    membershipEndDate: endDate,
                    updatedAt: new Date(),
                },

                $unset: {
                    currentPaymentReference: "",
                },
            }
        )

        return NextResponse.json({
            success: true,
            message: "Payment verified successfully",

            member: {
                memberId: member.memberId,
                name: `${member.firstName} ${member.lastName}`,
                email: member.email,
            },

            payment: {
                reference,
                amount,
                status: paymentData.status,
            },

            reference,
            paymentChannel: paymentData.channel,
            paidAt: paymentData.paid_at,
            amount,
        })

    } catch (error) {
        console.error("Error verifying payment:", error)

        return NextResponse.json(
            { error: "Failed to verify payment" },
            { status: 500 }
        )
    }
}