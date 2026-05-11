"use server"

import clientPromise from "@/lib/mongodb";
import { createNewMemberSchema, NewMember } from "@/schemas/member.schema";
import { MemberStatus, PaymentStatus } from "@/types/member";

export async function createMember(data: NewMember) {
    try {
        const validatedData = createNewMemberSchema.parse(data)

        const client = await clientPromise
        const db = client.db("rogue-gym-rongai")

        const existingMember = await db
            .collection("members")
            .findOne({
                $or: [
                    { email: validatedData.email },
                    { phoneNumber: validatedData.phoneNumber }
                ]
            })

        if (existingMember) {
            throw new Error(
                "Member with this email or phone number already exists"
            )
        }

        const selectedPlan = await db
            .collection("billing-plans")
            .findOne({
                planKey: validatedData.plan,
                isActive: true,
            })

        if (!selectedPlan) throw new Error("Selected billing plan not found or inactive")

        const memberStatus: MemberStatus = "pending"
        const paymentStatus: PaymentStatus = "pending"

        const memberId = `RGR-${Date.now()}`

        const newMemberPayload = {
            memberId,

            firstName: validatedData.firstName,
            lastName: validatedData.lastName,
            email: validatedData.email,
            dob: validatedData.dob,
            phoneNumber: validatedData.phoneNumber,
            gender: validatedData.gender,
            goal: validatedData.goal,
            medicalNotes: validatedData.medicalNotes || "",

            plan: {
                planKey: selectedPlan.planKey,
                title: selectedPlan.title,
                price: selectedPlan.price,
                durationMonths: selectedPlan.durationMonths,
            },

            memberStatus,
            paymentStatus,

            currentPaymentReference: null,
            paymentAttempts: 0,

            createdAt: new Date(),
            updatedAt: new Date(),
        }

        const result = await db
            .collection("members")
            .insertOne(newMemberPayload)

        return {
            success: true,

            member: {
                id: result.insertedId.toString(),
                memberId,
                email: validatedData.email,
                phoneNumber: validatedData.phoneNumber,
            }
        }

    } catch (error) {
        console.error("Error creating member:", error)

        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Failed to create member"
        }
    }
}