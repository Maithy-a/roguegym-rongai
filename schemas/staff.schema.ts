import { z } from "zod"

export const staffSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.email("Enter a valid email"),
    phoneNumber: z
        .string()
        .min(10, "Phone number must be at least 10 digits")
        .max(15, "Phone number must be at most 15 digits")
        .regex(/^[0-9+]+$/, "Phone number can only contain digits and +"),
    gender: z.enum(["male", "female"], "Select an option"),
    role: z.enum(["trainer", "manager", "receptionist"], "Select a role for new staff"),
    branch: z.enum(["main"], "Assign a branch to new staff"),
    specialities: z.array(z.string()).optional(),
}).superRefine((value, ctx) => {
    if (value.role === "trainer" && (!value.specialities || value.specialities.length === 0)) {
        ctx.addIssue({
            code: "custom",
            path: ["specialities"],
            message: "Select at least one speciality for trainers",
        })
    }
})

export type StaffFormValues = z.infer<typeof staffSchema>