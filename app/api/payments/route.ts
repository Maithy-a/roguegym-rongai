import clientPromise from "@/lib/mongodb";
import { getPagination } from "@/lib/pagination";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const client = await clientPromise;
        const db = client.db("rogue-gym-rongai");

        const { searchParams } = new URL(request.url);

        const { page, limit, skip } = getPagination(request);

        const search = searchParams.get("search") || "";
        const status = searchParams.get("status") || "all";

        const plan = searchParams.get("plan") || "all";
        const reference = searchParams.get("reference") || "all";
        const paymentChannel = searchParams.get("paymentChannel") || "all";

        const matchStage: Record<string, any> = {};

        if (status !== "all") {
            matchStage.status = status;
        }

        if (reference !== "all") {
            matchStage.reference = reference;
        }

        if (plan !== "all") {
            matchStage["plan.planKey"] = plan;
        }

        if (paymentChannel !== "all") {
            matchStage.paymentChannel = paymentChannel;
        }

        const basePipeline: any[] = [
            {
                $lookup: {
                    from: "members",
                    localField: "memberId",
                    foreignField: "_id",
                    as: "member",
                },
            },

            {
                $unwind: {
                    path: "$member",
                    preserveNullAndEmptyArrays: true,
                },
            },
        ];

        if (search) {
            basePipeline.push({
                $match: {
                    $or: [
                        {
                            reference: {
                                $regex: search,
                                $options: "i",
                            },
                        },

                        {
                            "member.firstName": {
                                $regex: search,
                                $options: "i",
                            },
                        },

                        {
                            "member.lastName": {
                                $regex: search,
                                $options: "i",
                            },
                        },

                        {
                            "member.email": {
                                $regex: search,
                                $options: "i",
                            },
                        },
                    ],
                },
            });
        }

        basePipeline.push({
            $match: matchStage,
        });

        const totalAgg = await db
            .collection("payments")
            .aggregate([
                ...basePipeline,
                { $count: "total" },
            ])
            .toArray();

        const totalTransactions = totalAgg[0]?.total || 0;

        const analyticsAgg = await db
            .collection("payments")
            .aggregate([
                ...basePipeline,

                {
                    $group: {
                        _id: null,
                        totalRevenue: {
                            $sum: "$amount",
                        },

                        successfulPayments: {
                            $sum: {
                                $cond: [
                                    { $eq: ["$status", "success"] },
                                    1, 0,
                                ],
                            },
                        },
                    },
                },
            ])
            .toArray();

        const analytics = analyticsAgg[0] || {
            totalRevenue: 0,
            successfulPayments: 0,
        };


        const revenueByPlanAgg = await db
            .collection("payments")
            .aggregate([
                ...basePipeline,

                {
                    $group: {
                        _id: {
                            planKey: "$plan.planKey",
                            title: "$plan.title",
                        },

                        revenue: { $sum: "$amount" },
                        transactions: { $sum: 1 },
                    },
                },

                { $sort: { revenue: -1 } },
            ])
            .toArray();

        const revenueByPlan = revenueByPlanAgg.map((item) => ({
            planKey: item._id.planKey,
            title: item._id.title,
            revenue: item.revenue,
            transactions: item.transactions,
        }));

        const payments = await db
            .collection("payments")
            .aggregate([
                ...basePipeline,

                { $sort: { paidAt: -1 } },
                { $skip: skip },
                { $limit: limit },
            ])
            .toArray();

        const transactions = payments.map((payment) => ({
            id: payment._id.toString(),
            reference: payment.reference,
            amount: payment.amount,
            currency: payment.currency,
            member: payment.member
                ? `${payment.member.firstName} ${payment.member.lastName}`
                : "Unknown Member",

            memberEmail: payment.member?.email ?? null,
            plan: payment.plan?.title ?? "Unknown Plan",
            planKey: payment.plan?.planKey ?? null,
            status: payment.status,
            paymentChannel: payment.paymentChannel,
            gatewayResponse: payment.gatewayResponse,
            paidAt: payment.paidAt ?? null,
        }));

        return NextResponse.json(
            {
                page,
                limit,
                totalTransactions,
                totalRevenue: analytics.totalRevenue,
                successfulPayments: analytics.successfulPayments,
                revenueByPlan,
                payments: transactions,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching payments:", error);

        return NextResponse.json(
            { error: "Failed to fetch payments" },
            { status: 500 }
        );
    }
}