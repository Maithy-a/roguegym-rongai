import { z } from "zod"

export const newMemberSchema = z.object({
    firstName: z.string().min(2, "First name required"),
    lastName: z.string().min(2, "Last name required"),
    email: z.email("Invalid email address"),
    phoneNumber: z.string().min(10, "Phone number required"),
    plan: z.string().min(1, "You must select a subscription plan"),
})

export type NewMember = z.infer<typeof newMemberSchema>