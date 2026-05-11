import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
        return NextResponse.json(
            { error: "Invalid member ID" },
            { status: 400 }
        );
    }

    try {
        const client = await clientPromise;
        const db = client.db("rogue-gym-rongai");

        const member = await db.collection("members").aggregate([
            {
                $match: {
                    _id: new ObjectId(id),
                },
            },

            {
                $lookup: {
                    from: "payments",
                    localField: "_id",
                    foreignField: "memberId",
                    as: "transactions",
                },
            },

            {
                $project: {
                    _id: 0,

                    memberId: {
                        $toString: "$_id",
                    },

                    firstName: 1,
                    lastName: 1,
                    email: 1,
                    phoneNumber: 1,
                    gender: 1,
                    goal: 1,
                    medicalNotes: 1,
                    dob: 1,

                    currentPlan: {
                        planKey: "$plan.planKey",
                        planTitle: "$plan.title",
                        price: "$plan.price",
                        duration: "$plan.durationMonths",
                        status: "$memberStatus",
                        paymentStatus: "$paymentStatus",
                        startDate: "$membershipStartDate",
                        membershipExpiry: "$membershipEndDate",
                    },

                    transactions: {
                        $map: {
                            input: "$transactions",
                            as: "transaction",
                            in: {
                                transactionId: {
                                    $toString: "$$transaction._id",
                                },

                                reference: "$$transaction.reference",
                                paymentChannel: "$$transaction.paymentChannel",
                                status: "$$transaction.status",
                                amount: "$$transaction.amount",
                                gatewayResponse: "$$transaction.gatewayResponse",
                                paidAt: "$$transaction.paidAt",
                                createdAt: "$$transaction.createdAt",
                                expiryDate: "$membershipEndDate",

                                plan: {
                                    planKey: "$$transaction.plan.planKey",
                                    planTitle: "$$transaction.plan.title",
                                    price: "$$transaction.plan.price",
                                    durationMonths: "$$transaction.plan.durationMonths",
                                },
                            },
                        },
                    },
                },
            },
        ]).toArray();

        if (!member.length) {
            return NextResponse.json(
                { error: "Member not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(member[0], {
            status: 200,
        });

    } catch (error) {
        console.error("Error fetching member details:", error);

        return NextResponse.json(
            { error: "Failed to fetch member" },
            { status: 500 }
        );
    }
}