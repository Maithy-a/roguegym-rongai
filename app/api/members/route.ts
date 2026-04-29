import clientPromise from "@/lib/mongodb";
import { getPagination } from "@/lib/pagination";
import { Member } from "@/types";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const client = await clientPromise;
        const db = client.db("rogue-gym-rongai");

        const { page, limit, skip } = getPagination(request);

        const [members, totalMembers] = await Promise.all([
            db.collection("members")
                .find({})
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .toArray(),
            db.collection("members").countDocuments()
        ]);

        const response: Member[] = members.map((member) => ({
            memberId: member._id.toString(),
            firstName: member.firstName,
            lastName: member.lastName,
            fullName: `${member.firstName} ${member.lastName}`,
            email: member.email,
            phoneNumber: member.phoneNumber,
            totalAmount: member.totalAmount,
            status: member.status === "active" ? "Active" : "Inactive",

            recentPaymentId: member.paymentId?.toString() ?? null,
            planId: member.planId?.toString() ?? null,
            dueDate: member.dueDate?.toISOString() ?? null,
            createdAt: member.createdAt?.toISOString() ?? null,
        }))

        return NextResponse.json({
            page,
            limit,
            totalMembers,
            members: response,
        });

    } catch (error) {
        console.error("Error fetching members:", error);

        return NextResponse.json(
            { error: "Failed to fetch members" },
            { status: 500 }
        );
    }
}