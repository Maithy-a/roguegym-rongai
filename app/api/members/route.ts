import clientPromise from "@/lib/mongodb"
import { getPagination } from "@/lib/pagination"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
    try {
        const client = await clientPromise;
        const db = await client.db("rogue-gym-rongai")

        const { searchParams } = new URL(request.url)
        const { page, limit } = getPagination(request)

        const search = searchParams.get("search") || ""
        const status = searchParams.get("status") || "all"
        const plan = searchParams.get("plan") || "all"

        const matchStage: any = {}
        if (search) {
            matchStage.$or = [
                { firstName: { $regex: search, $options: "i" } },
                { lastName: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { phoneNumber: { $regex: search, $options: "i" } },
            ]
        }

        if (status !== "all") {
            matchStage.memberStatus = status
        }

        if (plan !== "all") {
            matchStage["plan.planKey"] = plan
        }

        const pipeline: any[] = [
            { $match: matchStage },
        ]

        const totalAgg = await db.collection("members")
            .aggregate([...pipeline, { $count: "total" }])
            .toArray()

        const totalMembers = totalAgg[0]?.total || 0;

        pipeline.push(
            { $sort: { createdAt: -1 } },
            { $skip: (page - 1) * limit },
            { $limit: limit }
        )

        const members = await db
            .collection("members")
            .aggregate(pipeline)
            .toArray()

        const membersResponse = members.map((member) => ({
            memberId: member._id.toString(),
            fullName: `${member.firstName ?? ""} ${member.lastName ?? ""}`.trim(),
            email: member.email,
            phoneNumber: member.phoneNumber,
            plan: member.plan.title,
            status: member.memberStatus,
            amountPaid: member.plan.price,
            createdAt: member.createdAt?.toISOString?.() ?? null,
        }))

        return NextResponse.json({
            page,
            limit,
            totalMembers,
            members: membersResponse,
        })

    } catch (err) {
        console.error("Error fetching members", err)

        return NextResponse.json(
            { error: "Failed to fetch Members" },
            { status: 500 }
        )
    }
}