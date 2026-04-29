import clientPromise from "@/lib/mongodb";
import { getPagination } from "@/lib/pagination";
import { employees } from "@/types";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const client = await clientPromise;
        const db = client.db("rogue-gym-rongai");
        const { page, limit, skip } = getPagination(request);

        const [employees, totalEmployees] = await Promise.all([
            db.collection("employees")
                .find({})
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .toArray(),
            db.collection("employees").countDocuments()
        ]);

        const response: employees[] = employees.map((employee) => ({
            employeeId: employee._id.toString(),
            firstName: employee.firstName,
            lastName: employee.lastName,
            email: employee.email,
            description: employee.description,
            phoneNumber: employee.phoneNumber,
            position: employee.position,
            specalities: employee.specalities || [],
            assignedMembers: employee.assignedMembers || [],
            createdAt: employee.createdAt.toISOString(),
            updatedAt: employee.updatedAt ? employee.updatedAt.toISOString() : null,
        }));

        return NextResponse.json(
            {
                page,
                limit,
                totalEmployees,
                employees: response,
            },
            { status: 200 }
        );


    } catch (error) {
        console.error("Error fetching employees:", error);
        return NextResponse.json(
            { error: "Failed to fetch employees" },
            { status: 500 }
        );
    }
}