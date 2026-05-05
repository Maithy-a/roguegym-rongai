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
            { error: "Invalid member ID" },
            { status: 400 }
        );
    }

    try {
        const client = await clientPromise;
        const db = client.db("rogue-gym-rongai");

        const transactions = await db
            .collection("payments")
            .aggregate([
                {
                    $match: { memberId: new ObjectId(id) }
                },
                {
                    $lookup: {
                        from: "billing-plans",
                        localField: "planId",
                        foreignField: "_id",
                        as: "plan",
                    },
                },
                {
                    $unwind: {
                        path: "$plan",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $sort: { paidAt: -1 }
                },
                {
                    $project: {
                        transactionId: { $toString: "$_id" },
                        reference: "$reference",

                        amount: 1,

                        paidAt: {
                            $cond: {
                                if: "$paidAt",
                                then: { $toString: "$paidAt" },
                                else: null
                            }
                        },

                        expiryDate: {
                            $cond: {
                                if: "$expiryDate",
                                then: { $toString: "$expiryDate" },
                                else: null
                            }
                        },

                        plan: {
                            $cond: {
                                if: "$plan",
                                then: {
                                    planId: { $toString: "$plan._id" },
                                    planTitle: "$plan.title",
                                    planKey: "$plan.planKey",
                                },
                                else: null
                            }
                        }
                    }
                }
            ])
            .toArray();

        const totalAmount = transactions.reduce((sum, transaction) => sum + (transaction.amount || 0), 0);

        return NextResponse.json({
            count: transactions.length,
            totalAmount,
            transactions,
        });

    } catch (error) {
        console.error("Error fetching user transactions:", error);

        return NextResponse.json(
            { error: "Failed fetching user transactions" },
            { status: 500 }
        );
    }
}