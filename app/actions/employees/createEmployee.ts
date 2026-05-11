'use server'

import { STAFF_ROLES } from "@/constants";
import clientPromise from "@/lib/mongodb";
import { canAccessDashboard } from "@/lib/permissions";
import { EmployeeFormValues, employeeSchema } from "@/schemas/employee.schema";
import { clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createEmployee(input: EmployeeFormValues) {
    const parsed = employeeSchema.safeParse(input);

    if (!parsed.success) {
        return {
            success: false,
            message:
                parsed.error.issues[0]?.message ?? "Invalid employee data",
        };
    }

    const client = await clientPromise;
    const db = client.db("rogue-gym-rongai");

    const normalizedEmail = parsed.data.email.trim().toLowerCase();

    const existingStaff = await db.collection("employees").findOne({
        email: normalizedEmail,
    });

    if (existingStaff) {
        return {
            success: false,
            message: "An employee with this email already exists",
        };
    }

    const now = new Date();

    const insertResult = await db.collection("employees").insertOne({
        clerkId: null,
        firstName: parsed.data.firstName.trim(),
        lastName: parsed.data.lastName.trim(),
        email: normalizedEmail,
        phoneNumber: parsed.data.phoneNumber.trim(),
        gender: parsed.data.gender,
        role: parsed.data.role,
        branch: parsed.data.branch,

        specialities:
            parsed.data.role === STAFF_ROLES.TRAINER
                ? parsed.data.specialities ?? []
                : [],

        assignedMembers: [],
        authEnabled: canAccessDashboard(parsed.data.role),
        employmentStatus: "active",

        createdAt: now,
        updatedAt: now,
    });

    if (canAccessDashboard(parsed.data.role)) {
        try {
            const createClerkUser = await clerkClient();

            await createClerkUser.invitations.createInvitation({
                emailAddress: normalizedEmail,
                redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/sign-up`,
                publicMetadata: {
                    phoneNumber: parsed.data.phoneNumber.trim(),
                    firstName: parsed.data.firstName.trim(),
                    lastName: parsed.data.lastName.trim(),
                    role: parsed.data.role,
                },
            });
        } catch (error) {
            console.error("Failed to send Clerk invitation:", error);
        }
    }

    revalidatePath("/employees");

    return {
        success: true,
        message: "Employee created successfully",
        employeeId: insertResult.insertedId.toString(),
    };
}