"use client"

import {
    Field,
    FieldContent,
    FieldDescription,
    FieldError,
    FieldLabel,
    FieldLegend,
    FieldSet,
    FieldTitle,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"

import { genderOptions, fitnessGoal } from "@/constants"
import { createNewMemberSchema, NewMemberFormData } from "@/schemas/member.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { formatCurrency } from "@/lib/formatters"

import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { BillingPlan } from "@/types/billing-plan"
import { createMember } from "@/app/actions/members/createMember"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"

export default function CreateMember() {
    const form = useForm<NewMemberFormData>({
        resolver: zodResolver(createNewMemberSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            dob: undefined,
            phoneNumber: "",
            gender: "",
            goal: "",
            medicalNotes: undefined,
            plan: "",
        },
    })

    const [plans, setPlans] = useState<BillingPlan[]>([])
    const [plansLoading, setPlansLoading] = useState(true)
    const [isLoading, setIsLoading] = useState(false)

    const router = useRouter()

    useEffect(() => {
        async function fetchPlans() {
            try {
                setPlansLoading(true)

                const response = await fetch('/api/plans')
                if (!response.ok) {
                    throw new Error("Failed to fetch plans")
                }

                const data = await response.json()
                const activePlans = data.filter((plan: BillingPlan) => plan.status === "active")

                setPlans(activePlans)

            } catch (error) {
                console.error(error)
                toast.error("Failed to load membership plans")
            } finally {
                setPlansLoading(false)
            }
        }

        fetchPlans()
    }, [])

    async function onSubmit(data: NewMemberFormData) {
        try {
            setIsLoading(true);
            const parsedData = createNewMemberSchema.parse(data);
            const memberResponse = await createMember(parsedData);

            if (!memberResponse.success) {
                throw new Error(memberResponse.error || "Failed to create member");
            }

            const paymentResponse = await fetch("/api/payments/initiate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    memberId: memberResponse.member?.memberId,
                    email: parsedData.email,
                    planKey: parsedData.plan,
                }),
            });

            const paymentData = await paymentResponse.json();

            if (!paymentResponse.ok) {
                throw new Error(paymentData.error || "Failed to initialize payment");
            }

            toast.success("Opening payment window...");

            const PaystackPop = window.PaystackPop
            const popup = PaystackPop.setup({
                key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
                email: parsedData.email,
                amount: paymentData.amount * 100,
                ref: paymentData.reference,

                access_code: paymentData.accessCode,

                onClose: () => { toast.warn("Payment cancelled") },

                callback: (response: { reference: string }) => {
                    toast.success("Payment successful!");
                    router.push(`/payments/verify?reference=${response.reference}`);
                },
            });

            popup.openIframe();

        } catch (error) {
            console.error(error);
            toast.error(error instanceof Error ? error.message : "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <section className="main-container">
            <div className="grid grid-cols-1 gap-6 items-start">
                <form onSubmit={form.handleSubmit(onSubmit)} className="xl:col-span-2">
                    <div className="p-0.5 bg-muted rounded-xl space-y-1">
                        <div className="rounded-lg border bg-white p-6">
                            <div className="mb-6">
                                <h2 className="text-base font-semibold">
                                    Personal Information
                                </h2>

                                <p className="text-sm text-muted-foreground">
                                    Enter the member&apos;s personal details.
                                </p>
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <Controller
                                    name="firstName"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel>First Name</FieldLabel>
                                            <Input {...field} placeholder="William" />
                                            <FieldError errors={[fieldState.error]} />
                                        </Field>
                                    )}
                                />

                                <Controller
                                    name="lastName"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel>Last Name</FieldLabel>
                                            <Input {...field} placeholder="Butcher" />
                                            <FieldError errors={[fieldState.error]} />
                                        </Field>
                                    )}
                                />

                                <Controller
                                    name="gender"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel>Gender</FieldLabel>

                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select gender" />
                                                </SelectTrigger>

                                                <SelectContent>
                                                    {genderOptions.map((gender) => (
                                                        <SelectItem key={gender.value} value={gender.value}>
                                                            {gender.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>

                                            <FieldError errors={[fieldState.error]} />
                                        </Field>
                                    )}
                                />

                                <Controller
                                    name="dob"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel>Date of Birth</FieldLabel>

                                            <Input
                                                {...field}
                                                type="date"
                                                value={
                                                    field.value instanceof Date
                                                        ? field.value.toISOString().split("T")[0]
                                                        : typeof field.value === "string"
                                                            ? field.value
                                                            : ""
                                                }
                                                onChange={(e) => field.onChange(e.target.value)}
                                            />

                                            <FieldError errors={[fieldState.error]} />
                                        </Field>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="rounded-lg border bg-white p-6">
                            <div className="mb-6">
                                <h2 className="text-base font-semibold">
                                    Contact Information
                                </h2>

                                <p className="text-sm text-muted-foreground">
                                    Primary contact details for the member.
                                </p>
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <Controller
                                    name="email"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel> Email Address </FieldLabel>
                                            <Input
                                                {...field}
                                                type="email"
                                                placeholder="james@example.com"
                                            />
                                            <FieldError errors={[fieldState.error]} />
                                        </Field>
                                    )}
                                />

                                <Controller
                                    name="phoneNumber"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel> Phone Number</FieldLabel>
                                            <Input
                                                {...field}
                                                type="tel"
                                                placeholder="+254700560560"
                                            />
                                            <FieldError errors={[fieldState.error]} />
                                        </Field>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="rounded-lg border bg-white p-6">
                            <div className="mb-6">
                                <h2 className="text-base font-semibold">
                                    Fitness Information
                                </h2>

                                <p className="text-sm text-muted-foreground">
                                    Member fitness goals and medical notes.
                                </p>
                            </div>

                            <div className="space-y-5">
                                <Controller
                                    name="goal"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel>
                                                Fitness Goal
                                            </FieldLabel>

                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select fitness goal" />
                                                </SelectTrigger>

                                                <SelectContent>
                                                    {fitnessGoal.map((goal) => (
                                                        <SelectItem key={goal.value} value={goal.value} >
                                                            {goal.goal}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>

                                            <FieldError errors={[fieldState.error]} />
                                        </Field>
                                    )}
                                />

                                <Controller
                                    name="medicalNotes"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel> Medical Notes </FieldLabel>

                                            <Textarea
                                                {...field}
                                                placeholder="Any injuries, allergies, medical conditions, or important notes..."
                                                className="min-h-28 resize-none"
                                            />

                                            <FieldDescription>
                                                Optional but recommended for trainer awareness and safety.
                                            </FieldDescription>

                                            <FieldError errors={[fieldState.error]} />
                                        </Field>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="rounded-lg border bg-white p-6">
                            <div className="mb-6">
                                <h2 className="text-base font-semibold">
                                    Membership Plan
                                </h2>

                                <p className="text-sm text-muted-foreground">
                                    Choose a subscription plan for this member.
                                </p>
                            </div>

                            <Controller
                                name="plan"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <FieldSet>
                                        <FieldLegend>Available Plans </FieldLegend>
                                        {plansLoading ? (
                                            <div className="text-sm text-muted-foreground">
                                                Loading membership plans...
                                            </div>
                                        ) : (
                                            <RadioGroup
                                                name={field.name}
                                                value={field.value}
                                                onValueChange={field.onChange}
                                                defaultValue=""
                                                className="grid gap-3 md:grid-cols-2 xl:grid-cols-3"
                                            >
                                                {plans.map((plan) => (
                                                    <FieldLabel
                                                        key={plan.planKey}
                                                        htmlFor={plan.planKey}
                                                        className={cn(
                                                            "rounded-xl border p-2 cursor-pointer transition-all",
                                                            field.value === plan.planKey
                                                                ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                                                                : "hover:border-muted-foreground/40"
                                                        )}
                                                    >
                                                        <Field
                                                            orientation="horizontal"
                                                            data-invalid={fieldState.invalid}
                                                        >
                                                            <FieldContent  >
                                                                <FieldTitle>{plan.planTitle}</FieldTitle>
                                                                <FieldDescription>{plan.description}</FieldDescription>

                                                                <p className="mt-2 text-sm font-medium">
                                                                    {formatCurrency(plan.price)} /{" "}
                                                                    {plan.duration === 12 ? "year" : "month"}
                                                                </p>
                                                            </FieldContent>

                                                            <RadioGroupItem
                                                                value={plan.planKey}
                                                                id={plan.planKey}
                                                                aria-invalid={fieldState.invalid}
                                                            />
                                                        </Field>
                                                    </FieldLabel>
                                                ))}
                                            </RadioGroup>
                                        )}
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </FieldSet>
                                )}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 md:mt-2">
                        <Button type="button" variant="outline" onClick={() => form.reset()} >
                            Reset
                        </Button>

                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Creating..." : "Create Member"}
                        </Button>
                    </div>
                </form>
            </div>
        </section>
    )
}