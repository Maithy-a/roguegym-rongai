import clientPromise from "@/lib/mongodb";
import { getPagination } from "@/lib/pagination";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const client = await clientPromise;
        const db = client.db("rogue-gym-rongai");

        const { searchParams } = new URL(request.url);
        const { page, limit } = getPagination(request);

        const search = searchParams.get("search") || "";
        const role = searchParams.get("role") || "all";

        const matchStage: any = {};

        if (search) {
            matchStage.$or = [
                { firstName: { $regex: search, $options: "i" } },
                { lastName: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { role: { $regex: search, $options: "i" } },
            ];
        }

        if (role !== "all") {
            matchStage.role = role;
        }

        const pipeline: any[] = [
            { $match: matchStage },
        ];

        const totalAgg = await db.collection("employees")
            .aggregate([...pipeline, { $count: "total" }])
            .toArray();

        const totalEmployees = totalAgg[0]?.total || 0;

        pipeline.push(
            { $sort: { createdAt: -1 } },
            { $skip: (page - 1) * limit },
            { $limit: limit }
        );

        const employees = await db
            .collection("employees")
            .aggregate(pipeline)
            .toArray();

        const formattedEmployees = employees.map((employee) => ({
            employeeId: employee._id.toString(),
            fullName: `${employee.firstName ?? ""} ${employee.lastName ?? ""}`.trim(),
            email: employee.email,
            description: employee.description,
            phoneNumber: employee.phoneNumber,
            role: employee.role,
            branch: employee.branch,
            gender: employee.gender,
            createdAt: employee.createdAt?.toISOString?.() ?? new Date().toISOString(),
            updatedAt: employee.updatedAt?.toISOString?.() ?? null,
        }));

        return NextResponse.json({
            page,
            limit,
            totalEmployees,
            employees: formattedEmployees,
        });

    } catch (error) {
        console.error("Error fetching employees:", error);

        return NextResponse.json(
            { error: "Failed to fetch employees" },
            { status: 500 }
        );
    }
}