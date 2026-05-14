"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import {
    Field,
    FieldError,
    FieldLabel
} from "@/components/ui/field"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { PlusIcon, Loader } from "lucide-react"
import { Button } from "@/components/ui/button"

import { createPlanSchema, CreatePlan } from "@/schemas/plan.schema"
import { createPlan } from "@/app/actions/plans/createPlan"
import { toast } from "react-toastify"

export function CreatePlanDialog() {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const form = useForm<CreatePlan>({
        resolver: zodResolver(createPlanSchema),
        defaultValues: {
            name: "",
            planKey: "",
            durationMonths: 1,
            price: 0,
            description: "",
        },
    })

    async function onSubmit(data: CreatePlan) {
        if (isLoading) return

        try {
            setIsLoading(true)

            const result = await createPlan(data)
            if (!result.success) {
                throw new Error(result.message)
            }

            toast.success(result.message)
            form.reset({
                name: "",
                planKey: "",
                durationMonths: 1,
                price: 0,
                description: "",
            })
            setOpen(false)
            router.refresh()

        } catch (error) {
            console.error(error)
            toast.error(error instanceof Error ? error.message : "Failed to create plan")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="flex items-center gap-2 rounded-full bg-rose-600 px-4 text-white hover:bg-rose-700">
                    <PlusIcon className="h-4 w-4" />
                    Create Plan
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Create Billing Plan</DialogTitle>
                </DialogHeader>

                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6 mt-4"
                >
                    <div className="p-3 bg-white space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Controller
                                name="name"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel>Plan Name *</FieldLabel>
                                        <Input
                                            {...field}
                                            placeholder="Monthly Plan"
                                            onChange={(e) => {
                                                field.onChange(e)

                                                form.setValue(
                                                    "planKey",
                                                    e.target.value
                                                        .toLowerCase()
                                                        .replace(/\s+/g, "-")
                                                )
                                            }}
                                        />
                                        <FieldError errors={[fieldState.error]} />
                                    </Field>
                                )}
                            />

                            <Controller
                                name="planKey"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel>Plan Key *</FieldLabel>
                                        <Input {...field} placeholder="monthly-plan" />
                                        <FieldError errors={[fieldState.error]} />
                                    </Field>
                                )}
                            />

                            <Controller
                                name="durationMonths"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel>Duration (months) *</FieldLabel>
                                        <Input
                                            type="number"
                                            {...field}
                                            onChange={(event) =>
                                                field.onChange(
                                                    event.target.value === ""
                                                        ? 0
                                                        : Number(event.target.value)
                                                )
                                            }
                                        />
                                        <FieldError errors={[fieldState.error]} />
                                    </Field>
                                )}
                            />

                            <Controller
                                name="price"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel>Price (KES) *</FieldLabel>
                                        <Input
                                            type="number"
                                            {...field}
                                            onChange={(event) =>
                                                field.onChange(
                                                    event.target.value === ""
                                                        ? 0
                                                        : Number(event.target.value)
                                                )
                                            }
                                        />
                                        <FieldError errors={[fieldState.error]} />
                                    </Field>
                                )}
                            />

                            <Controller
                                name="description"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field
                                        data-invalid={fieldState.invalid}
                                        className="sm:col-span-2"
                                    >
                                        <FieldLabel>Description</FieldLabel>
                                        <Textarea
                                            {...field}
                                            placeholder="Optional description..."
                                        />
                                        <FieldError errors={[fieldState.error]} />
                                    </Field>
                                )}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="rounded-lg bg-rose-600 hover:bg-rose-700 text-white"
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <Loader className="h-4 w-4 animate-spin" />
                                    Creating...
                                </span>
                            ) : (
                                "Create Plan"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}