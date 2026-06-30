"use server";

import { STAFF_ROLES } from "@/constants";
import clientPromise from "@/lib/mongodb";
import { canAccessDashboard } from "@/lib/permissions";
import { EmployeeFormValues, employeeSchema } from "@/schemas/employee.schema";
import { clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createEmployee(input: EmployeeFormValues) {
    try {
        const parsed = employeeSchema.safeParse(input);

        if (!parsed.success) {
            return {
                success: false,
                message:
                    parsed.error.issues[0]?.message ??
                    "Invalid employee data",
            };
        }

        const firstName = parsed.data.firstName.trim();
        const lastName = parsed.data.lastName.trim();
        const phoneNumber = parsed.data.phoneNumber.trim();

        const normalizedEmail = parsed.data.email
            .trim()
            .toLowerCase();

        const role = parsed.data.role;
        const authEnabled = canAccessDashboard(role);

        const dbClient = await clientPromise;
        const db = dbClient.db("rogue-gym-rongai");

        const existingEmployee = await db.collection("employees").findOne({
            email: normalizedEmail,
        });

        if (existingEmployee) {
            return {
                success: false,
                message: "An employee with this email already exists",
            };
        }

        let invitation = null;

        if (authEnabled) {
            const client = await clerkClient();

            invitation = await client.invitations.createInvitation({
                emailAddress: normalizedEmail,
                redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/sign-up`,

                publicMetadata: {
                    firstName,
                    lastName,
                    phoneNumber,
                    role,
                },
            });
        }

        const now = new Date();

        const insertResult = await db.collection("employees").insertOne({
            clerkId: null,

            firstName,
            lastName,
            email: normalizedEmail,
            phoneNumber,
            gender: parsed.data.gender,
            role,
            branch: parsed.data.branch,
            specialities:
                role === STAFF_ROLES.TRAINER
                    ? parsed.data.specialities ?? []
                    : [],
            assignedMembers: [],

            authEnabled,
            employmentStatus: "active",
            authInvitationStatus: authEnabled
                ? "pending"
                : null,

            clerkInvitationId: invitation?.id ?? null,
            invitedAt: invitation ? now : null,

            createdAt: now,
            updatedAt: now,
        });

        revalidatePath("/employees");

        return {
            success: true,
            message: authEnabled
                ? "Employee created and invitation sent"
                : "Employee created successfully",

            employeeId: insertResult.insertedId.toString(),
            invitationId: invitation?.id ?? null,
        };

    } catch (error) {
        console.error("Create employee error:", error);

        return {
            success: false,
            message: "Something went wrong while creating employee",
        };
    }
}