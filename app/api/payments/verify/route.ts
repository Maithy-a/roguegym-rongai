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

        const paystackData = await paystackResponse.json()
        if (!paystackData.status) {
            return NextResponse.json(
                { error: "Payment verification failed" },
                { status: 400 }
            )
        }

        const paymentData = paystackData.data
        if (paymentData.status !== "success") {
            return NextResponse.json(
                { error: "Payment not successful" },
                { status: 400 }
            )
        }

        const client = await clientPromise
        const db = client.db("rogue-gym-rongai")

        const member = await db
            .collection("members")
            .findOne({
                currentPaymentReference: reference,
            })

        if (!member) {
            return NextResponse.json(
                { error: "Member not found!" },
                { status: 404 }
            )
        }

        const existingPayment = await db
            .collection("payments")
            .findOne({
                reference: reference
            })

        if (existingPayment) {
            return NextResponse.json(
                { success: true, message: "Payment already verified" },
                { status: 200 }
            )
        }

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
            amount: paymentData.amount / 100, // Convert back to main currency unit
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
            }
        )

        return NextResponse.json({
            success: true,

            member: {
                memberId: member.memberId,
                name: `${member.firstName} ${member.lastName}`,
                email: member.email,
            },

            payment: {
                reference,
                amount: paymentData.amount / 100,
                status: paymentData.status,
            }
        })

    } catch (error) {
        console.error("Error verifying payment:", error)

        return NextResponse.json(
            { error: "Failed to verify payment" },
            { status: 500 }
        )
    }
}