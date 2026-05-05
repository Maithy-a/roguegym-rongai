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

        const result = await db.collection("members")
            .aggregate([
                {
                    $match: { _id: new ObjectId(id) }
                },
                {
                    $lookup: {
                        from: "billing-plans",
                        localField: "planId",
                        foreignField: "_id",
                        as: "plan"
                    }
                },
                {
                    $unwind: {
                        path: "$plan",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $project: {
                        memberId: { $toString: "$_id" },
                        firstName: 1,
                        lastName: 1,
                        email: 1,
                        phoneNumber: 1,
                        status: 1,
                        totalAmount: 1,

                        createdAt: {
                            $cond: {
                                if: "$createdAt",
                                then: { $toString: "$createdAt" },
                                else: null
                            }
                        },

                        dueDate: {
                            $cond: {
                                if: "$dueDate",
                                then: { $toString: "$dueDate" },
                                else: null
                            }
                        },

                        recentPaymentId: {
                            $cond: {
                                if: "$paymentId",
                                then: { $toString: "$paymentId" },
                                else: null
                            }
                        },

                        plan: {
                            $cond: {
                                if: "$plan",
                                then: {
                                    planId: { $toString: "$plan._id" },
                                    planKey: "$plan.planKey",
                                    planTitle: "$plan.title",
                                    price: "$plan.price",
                                    duration: "$plan.durationMonths",
                                    description: "$plan.description"
                                },
                                else: null
                            }
                        }
                    }
                }
            ])
            .toArray();

        if (!result.length) {
            return NextResponse.json(
                { error: "Member not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(result[0]);

    } catch (error) {
        console.error("GET member error:", error);

        return NextResponse.json(
            { error: "Failed to fetch member" },
            { status: 500 }
        );
    }
}