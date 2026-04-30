'use server'

import clientPromise from "@/lib/mongodb";
import { CreatePlan, createPlanSchema } from "@/schemas/plan.schema";
import { revalidatePath } from "next/cache";

export async function createPlan(input: CreatePlan) {
    const validatedInput = createPlanSchema.safeParse(input)

    if (!validatedInput.success) {
        return {
            success: false,
            message: validatedInput.error.issues[0]?.message ?? "Invalid plan data",
        }
    }

    const { name, planKey, durationMonths, price, description } = validatedInput.data

    const client = await clientPromise;
    const db = client.db("rogue-gym-rongai")

    const existingPlan = await db.collection("plans").findOne({
        planKey: planKey,
    })

    if (existingPlan) {
        return {
            success: false,
            message: "A plan with this key already exists",
        }
    }

    const now = new Date()

    const result = await db.collection("plans").insertOne({
        title: name.trim(),
        planKey: planKey,
        description: description?.trim() ?? "",
        price,
        durationMonths,
        isActive: true,
        createdAt: now,
        updatedAt: now,
    })

    revalidatePath("/billing-plans")

    return {
        success: true,
        message: "Plan created successfully",
        planId: result.insertedId.toString(),
    }
}