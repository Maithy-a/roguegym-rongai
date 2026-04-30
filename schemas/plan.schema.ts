import { z } from "zod"

export const createPlanSchema = z.object({
    name: z
        .string()
        .min(2, "Plan name is required"),

    planKey: z
        .string()
        .min(2, "Plan key is required")
        .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and hyphens"),

    durationMonths: z.number().min(1, "Must be at least 1 month"),

    price: z.number().min(0, "Price must be positive"),

    description: z.string().optional(),
})

export type CreatePlan = z.infer<typeof createPlanSchema>