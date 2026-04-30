import clientPromise from "@/lib/mongodb"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
    try {
        const client = await clientPromise
        const db = client.db("rogue-gym-rongai")

        const { searchParams } = new URL(request.url)

        const page = Number(searchParams.get("page") || 1)
        const limit = Number(searchParams.get("limit") || 10)

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
            matchStage.status = status
        }


        const pipeline: any[] = [
            { $match: matchStage },

            {
                $lookup: {
                    from: "billing-plans",
                    localField: "planId",
                    foreignField: "_id",
                    as: "planData"
                }
            },

            {
                $addFields: {
                    plan: { $arrayElemAt: ["$planData.title", 0] }
                }
            },
        ]

        if (plan !== "all") {
            pipeline.push({
                $match: { plan: plan }
            })
        }

        const totalMembersAgg = await db.collection("members")
            .aggregate([...pipeline, { $count: "total" }])
            .toArray()

        const totalMembers = totalMembersAgg[0]?.total || 0

        pipeline.push(
            { $sort: { createdAt: -1 } },
            { $skip: (page - 1) * limit },
            { $limit: limit }
        )

        const members = await db
            .collection("members")
            .aggregate(pipeline)
            .toArray()

        const formattedMembers = members.map((member) => ({
            memberId: member._id.toString(),
            fullName: `${member.firstName ?? ""} ${member.lastName ?? ""}`.trim(),
            email: member.email,
            phoneNumber: member.phoneNumber,
            totalAmount: member.totalAmount ?? 0,
            status: member.status,
            plan: member.plan ?? "Unknown",
            createdAt: member.createdAt?.toISOString?.() ?? new Date().toISOString(),
        }))

        return NextResponse.json({
            page,
            limit,
            totalMembers,
            members: formattedMembers,
        })

    } catch (error) {
        console.error("Error fetching members:", error)

        return NextResponse.json(
            { error: "Failed to fetch members" },
            { status: 500 }
        )
    }
}