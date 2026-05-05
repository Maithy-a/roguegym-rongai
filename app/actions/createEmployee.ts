'use server'

import clientPromise from "@/lib/mongodb";
import { EmployeeFormValues, employeeSchema } from "@/schemas/employee.schema";
import { revalidatePath } from "next/cache";

export async function createEmployee(input: EmployeeFormValues) {
    const parsed = employeeSchema.safeParse(input)

    if (!parsed.success) {
        return {
            success: false,
            message: parsed.error.issues[0]?.message ?? "Invalid employee data",
        }
    }

    const client = await clientPromise;
    const db = client.db("rogue-gym-rongai")

    const normalizedEmail = parsed.data.email.trim().toLowerCase()
    const existingStaff = await db
        .collection("employees")
        .findOne({
            email: normalizedEmail,
        })

    if (existingStaff) {
        return {
            success: false,
            message: "A employee member with this email already exists",
        }
    }

    const now = new Date()

    const insertResult = await db
        .collection("employees")
        .insertOne({
            firstName: parsed.data.firstName.trim(),
            lastName: parsed.data.lastName.trim(),
            email: normalizedEmail,
            phoneNumber: parsed.data.phoneNumber.trim(),
            gender: parsed.data.gender,
            role: parsed.data.role,
            branch: parsed.data.branch,
            specialities: parsed.data.role === "trainer" ? (parsed.data.specialities ?? []) : [],
            assignedMembers: [],
            createdAt: now,
            updatedAt: now,
        })

    revalidatePath("/employees")

    return {
        success: true,
        message: "Staff added successfully",
        employeeId: insertResult.insertedId.toString(),
    }
}
