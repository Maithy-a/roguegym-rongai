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
            { error: "Invalid employee ID" },
            { status: 400 }
        );
    }

    try {
        const client = await clientPromise;
        const db = client.db("rogue-gym-rongai");

        const result = await db.collection("employees").aggregate([
            {
                $match: {
                    _id: new ObjectId(id),
                },
            },

            {
                $lookup: {
                    from: "members",
                    let: { memberIds: "$assignedMembers" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $in: [
                                        "$_id",
                                        {
                                            $map: {
                                                input: "$$memberIds",
                                                as: "id",
                                                in: { $toObjectId: "$$id" },
                                            },
                                        },
                                    ],
                                },
                            },
                        },
                        {
                            $project: {
                                _id: 1,
                                firstName: 1,
                                lastName: 1,
                                email: 1,
                            },
                        },
                    ],
                    as: "assignedMembersData",
                },
            },

            {
                $project: {
                    employeeId: { $toString: "$_id" },
                    fullName: {
                        $concat: ["$firstName", " ", "$lastName"],
                    },
                    email: 1,
                    phoneNumber: 1,
                    gender: 1,
                    role: 1,
                    branch: 1,
                    specialities: { $ifNull: ["$specialities", []] },

                    assignedMembers: {
                        $map: {
                            input: "$assignedMembersData",
                            as: "member",
                            in: {
                                id: { $toString: "$$member._id" },
                                firstName: "$$member.firstName",
                                lastName: "$$member.lastName",
                                email: "$$member.email",
                            },
                        },
                    },

                    createdAt: {
                        $cond: [
                            { $ifNull: ["$createdAt", false] },
                            { $toString: "$createdAt" },
                            null,
                        ],
                    },
                    updatedAt: {
                        $cond: [
                            { $ifNull: ["$updatedAt", false] },
                            { $toString: "$updatedAt" },
                            null,
                        ],
                    },
                },
            },
        ]).toArray();

        if (!result.length) {
            return NextResponse.json(
                { error: "Employee not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(result[0], { status: 200 });

    } catch (error) {
        console.error("Error fetching employee details:", error);

        return NextResponse.json(
            { error: "Failed to fetch employee details" },
            { status: 500 }
        );
    }
}