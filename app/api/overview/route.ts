import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const client = await clientPromise;
        const db = client.db("rogue-gym-rongai");

        const overview = await db.collection("payments").aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$amount" },
                    totalTransactions: { $sum: 1 }
                }
            },

            {
                $lookup: {
                    from: "members",
                    pipeline: [
                        {
                            $group: {
                                _id: "$memberStatus",
                                count: { $sum: 1 }
                            }
                        },
                        { $sort: { _id: 1 } }
                    ],
                    as: "memberStatusBreakdown"
                }
            },

            {
                $lookup: {
                    from: "members",
                    pipeline: [{ $count: "totalMembers" }],
                    as: "memberTotals"
                }
            },

            {
                $lookup: {
                    from: "payments",
                    pipeline: [
                        { $match: { status: "success" } },
                        {
                            $group: {
                                _id: "$plan.planKey",
                                revenue: { $sum: "$amount" },
                                transactions: { $sum: 1 },
                                titles: { $first: "$plan.title" }
                            }
                        },
                        { $limit: 6 }
                    ],
                    as: "revenueByPlanRaw"
                }
            },

            {
                $lookup: {
                    from: "employees",
                    pipeline: [{ $count: "totalEmployees" }],
                    as: "employeeTotals"
                }
            },

            {
                $lookup: {
                    from: "payments",
                    pipeline: [
                        { $match: { status: "success" } },
                        { $sort: { paidAt: -1 } },
                        { $limit: 6 },
                        {
                            $lookup: {
                                from: "members",
                                localField: "memberId",
                                foreignField: "_id",
                                pipeline: [{ $project: { firstName: 1, lastName: 1 } }],
                                as: "member"
                            }
                        },
                        {
                            $project: {
                                id: { $toString: "$_id" },
                                reference: 1,
                                amount: 1,
                                paidAt: 1,
                                plan: { $ifNull: ["$plan", {}] },
                                member: { $arrayElemAt: ["$member", 0] }
                            }
                        }
                    ],
                    as: "recentTransactions"
                }
            },

            {
                $project: {
                    _id: 0,
                    totalRevenue: 1,
                    totalTransactions: 1,
                    totalMembers: { $arrayElemAt: ["$memberTotals.totalMembers", 0] },
                    totalEmployees: { $arrayElemAt: ["$employeeTotals.totalEmployees", 0] },
                    revenueByPlan: {
                        $map: {
                            input: "$revenueByPlanRaw",
                            as: "plan",
                            in: {
                                planKey: "$$plan._id",
                                title: "$$plan.titles",
                                revenue: "$$plan.revenue",
                                transactions: "$$plan.transactions"
                            }
                        }
                    },
                    memberStatusBreakdown: 1,
                    recentTransactions: 1
                }
            }
        ]).toArray();

        return NextResponse.json(overview[0] || {
            totalRevenue: 0, totalTransactions: 0, totalMembers: 0, totalEmployees: 0,
            revenueByPlan: [], memberStatusBreakdown: [], recentTransactions: []
        });

    } catch (error) {
        console.error("Overview API error:", error);
        return NextResponse.json({ error: "Failed to fetch overview" }, { status: 500 });
    }
}