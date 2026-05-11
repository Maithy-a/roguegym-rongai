import { z } from "zod"

export const createNewMemberSchema = z.object({
    firstName: z
        .string()
        .min(2, "First name required"),
    lastName: z
        .string()
        .min(2, "Last name required"),
    email: z
        .email("Invalid email address"),
    dob: z
        .coerce
        .date()
        .refine((date) => date <= new Date(), {
            message: "Date of birth cannot be in the future",
        }),
    phoneNumber: z
        .string()
        .regex(/^\+?254\d{9}$|^\d{10}$/, "Invalid phone number"),
    plan: z
        .string()
        .min(1, "Please select a subscription plan"),
    gender: z
        .string()
        .min(1, "Please select a gender"),
    goal: z
        .string()
        .min(1, "Please select a goal"),
    medicalNotes: z
        .string()
        .optional()
        .transform((val) => val?.trim() || undefined),
})



export type NewMemberFormData = z.input<typeof createNewMemberSchema>

export type NewMember = z.output<typeof createNewMemberSchema>