import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    if (!id) {
        return NextResponse.json(
            { error: "Plan id is required" },
            { status: 400 }
        );
    }

    try {
        const client = await clientPromise;
        const db = client.db("rogue-gym-rongai");

        const result = await db.collection("billing-plans")
            .aggregate([
                {
                    $match: { _id: new ObjectId(id) }
                },
                {
                    $lookup: {
                        from: "members",
                        localField: "_id",
                        foreignField: "planId",
                        as: "members"
                    }
                },
                {
                    $lookup: {
                        from: "payments",
                        localField: "members.paymentId",
                        foreignField: "_id",
                        as: "memberPayments"
                    }
                },
                {
                    $addFields: {
                        totalMembers: { $size: "$members" },

                        totalRevenue: {
                            $sum: {
                                $map: {
                                    input: {
                                        $filter: {
                                            input: "$memberPayments",
                                            as: "payment",
                                            cond: { $eq: ["$$payment.status", "success"] }
                                        }
                                    },
                                    as: "p",
                                    in: "$$p.amount"
                                }
                            }
                        }
                    }
                },

                {
                    $project: {
                        id: { $toString: "$_id" },
                        title: 1,
                        price: 1,
                        durationMonths: 1,
                        isActive: 1,
                        totalMembers: 1,
                        totalRevenue: 1,

                        members: {
                            _id: 1,
                            firstName: 1,
                            lastName: 1,
                            status: 1
                        }
                    }
                }
            ])
            .toArray();

        return NextResponse.json(result[0] || null, { status: 200 });

    } catch (error) {
        console.error("Error fetching plan:", error);

        return NextResponse.json(
            { error: "Failed to fetch plan" },
            { status: 500 }
        );
    }
}