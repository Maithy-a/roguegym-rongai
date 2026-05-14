import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ planKey: string }> }
) {
    const { planKey } = await params;

    if (!planKey) {
        return NextResponse.json(
            { error: "Plan Key is required" },
            { status: 400 }
        );
    }

    try {
        const client = await clientPromise;
        const db = client.db("rogue-gym-rongai");

        const result = await db.collection("billing-plans")
            .aggregate([
                {
                    $match: { planKey }
                },

                {
                    $lookup: {
                        from: "members",
                        localField: "planKey",
                        foreignField: "plan.planKey",
                        as: "members"
                    }
                },

                {
                    $lookup: {
                        from: "payments",
                        localField: "planKey",
                        foreignField: "plan.planKey",
                        as: "transactions"
                    }
                },
                {
                    $addFields: {
                        totalRevenue: { $sum: "$transactions.amount" },
                        totalTransactions: { $size: "$transactions" },
                        totalMembers: { $size: "$members" }
                    }
                },

                {
                    $project: {
                        id: { $toString: "$_id" },
                        title: 1,
                        price: 1,
                        durationMonths: 1,
                        isActive: 1,

                        totalRevenue: 1,

                        totalMembers: 1,
                        members: {
                            $map: {
                                input: "$members",
                                as: "member",
                                in: {
                                    id: {
                                        $toString: "$$member._id"
                                    },
                                    firstName: "$$member.firstName",
                                    lastName: "$$member.lastName",
                                    status: "$$member.memberStatus",
                                    email: "$$member.email",
                                    phone: "$$member.phoneNumber"
                                }
                            }
                        },

                        totalTransactions: 1,
                        transactions: {
                            $map: {
                                input: { $slice: ["$transactions", 10] },
                                as: "transaction",
                                in: {
                                    transactionId: { $toString: "$$transaction._id" },
                                    reference: "$$transaction.reference",
                                    amount: "$$transaction.amount",
                                    paidAt: "$$transaction.paidAt",
                                    expiryDate: "$$transaction.expiryDate",
                                    status: "$$transaction.status"
                                }
                            }
                        }
                    }
                }
            ])
            .toArray();

        return NextResponse.json(result[0] || null);

    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { error: "Failed to fetch plan" },
            { status: 500 }
        );
    }
}