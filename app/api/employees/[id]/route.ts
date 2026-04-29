import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
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

        const employee = await db.collection("employees").findOne({
            _id: new ObjectId(id)
        });

        if (!employee) {
            return NextResponse.json(
                { error: "Employee not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(employee, { status: 200 });
    } catch (error) {
        console.error("Error fetching employee details:", error);

        return NextResponse.json(
            { error: "Failed to fetch employee details" },
            { status: 500 }
        )
    }
}