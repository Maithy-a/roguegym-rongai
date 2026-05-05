import clientPromise from "@/lib/mongodb";
import { getPagination } from "@/lib/pagination";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const client = await clientPromise;
        const db = client.db("rogue-gym-rongai");

        const { page, limit, skip } = getPagination(request);

        const [payments, totalTransactions] = await Promise.all([
            db.collection("payments")
                .aggregate([
                    {
                        $lookup: {
                            from: "members",
                            localField: "memberId",
                            foreignField: "_id",
                            as: "member"
                        }
                    },
                    {
                        $unwind: {
                            path: "$member",
                            preserveNullAndEmptyArrays: true
                        }
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
                        $sort: { paidAt: -1 }
                    },
                    {
                        $skip: skip
                    },
                    {
                        $limit: limit
                    }
                ])
                .toArray(),

            db.collection("payments").countDocuments()
        ]);

        const transactions = payments.map((payment) => ({
            paymentId: payment._id.toString(),
            reference: payment.reference,
            member: payment.member
                ? `${payment.member.firstName} ${payment.member.lastName}`
                : "Unknown Member",

            plan: payment.plan?.title ?? "Unknown Plan",

            amount: payment.amount,
            status: payment.status,

            paidAt: payment.paidAt ? payment.paidAt.toISOString() : null,
        }));

        return NextResponse.json(
            {
                page,
                limit,
                totalTransactions,
                payments: transactions
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