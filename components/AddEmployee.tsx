"use client";

import { useState } from "react";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { employeeSchema, EmployeeFormValues } from "@/schemas/employee.schema";
import { createEmployee } from "@/app/actions/createEmployee";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FieldLabel } from "@/components/ui/field";

import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

import { cn } from "@/lib/utils";
import { IconChevronLeft, IconChevronRight, IconCircleCheck } from "@tabler/icons-react";

const steps = [
    { title: "Personal Info", description: "Basic employee details" },
    { title: "Role & Assignment", description: "Assign role and branch" },
    { title: "Specialities", description: "Only for trainers" },
    { title: "Review", description: "Confirm details before creating" },
] as const;

const specialityOptions = [
    "Strength Training",
    "Cardio",
    "Weight Loss",
    "CrossFit",
    "Yoga",
    "Pilates",
] as const;

type EmployeeField =
    | "firstName"
    | "lastName"
    | "email"
    | "phoneNumber"
    | "gender"
    | "role"
    | "branch"
    | "specialities";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function AddEmployee({ open, onOpenChange }: Props) {
    const router = useRouter();

    const [step, setStep] = useState(0);
    const [selectedSpecialities, setSelectedSpecialities] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const form = useForm<EmployeeFormValues>({
        resolver: zodResolver(employeeSchema),
        mode: "onChange",
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            gender: undefined,
            role: undefined,
            branch: undefined,
            specialities: [],
        },
    });

    const role = form.watch("role");
    const stepFields: EmployeeField[][] = [
        ["firstName", "lastName", "email", "phoneNumber"],
        ["gender", "role", "branch"],
        role === "trainer" ? ["specialities"] : [],
    ];

    const currentFields = stepFields[step] || [];

    const isStepValid = currentFields.every((field) => {
        const value = form.watch(field);
        return value != null && (typeof value === "string" ? value !== "" : true);
    });

    async function handleNext() {
        const valid = await form.trigger(currentFields);
        if (!valid) return;

        if (step === 2 && role !== "trainer") {
            setStep(3);
        } else {
            setStep((prev) => prev + 1);
        }
    }

    function handleBack() {
        if (step === 3 && role !== "trainer") {
            setStep(1);
        } else {
            setStep((prev) => prev - 1);
        }
    }

    function toggleSpeciality(speciality: string) {
        const updated = selectedSpecialities.includes(speciality)
            ? selectedSpecialities.filter((select) => select !== speciality)
            : [...selectedSpecialities, speciality];

        setSelectedSpecialities(updated);
        form.setValue("specialities", updated);
    }

    const personalFields = [
        { name: "firstName" as const, label: "First Name", placeholder: "employees firstname" },
        { name: "lastName" as const, label: "Last Name", placeholder: "employees lastname" },
        { name: "email" as const, label: "Email Address", placeholder: "yourmail@example.com" },
        { name: "phoneNumber" as const, label: "Phone Number", placeholder: "0712345678" },
    ] as const;

    const controlledFields = [
        {
            name: "gender" as const,
            label: "Gender",
            options: [
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
            ] as const,
        },
        {
            name: "role" as const,
            label: "Role",
            options: [
                { value: "trainer", label: "Trainer" },
                { value: "manager", label: "Manager" },
                { value: "receptionist", label: "Receptionist" },
            ] as const,
        },
        {
            name: "branch" as const,
            label: "Branch",
            options: [
                { value: "main", label: "Main" },
            ] as const,
        },
    ] as const;

    async function onSubmit(data: EmployeeFormValues) {
        try {
            setIsLoading(true);

            const res = await createEmployee(data);
            if (!res.success) throw new Error(res.message);

            setSuccess(true);

            setTimeout(() => {
                form.reset();
                setSelectedSpecialities([]);
                setStep(0);
                setSuccess(false);
                onOpenChange(false);
                router.refresh();
            }, 3600);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Error");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-4xl h-130 p-0 overflow-hidden">
                <DialogDescription className="sr-only">
                    Create Employee dialog
                </DialogDescription>

                {success ? (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                        <div className="text-5xl bg-green-50 p-4 border  rounded-full">
                            <div className="text-green-500 animate-pulse">
                                <IconCircleCheck stroke={2} />
                            </div>
                        </div>
                        <h2 className="text-xl font-semibold">Employee Created</h2>
                        <p className="text-sm text-muted-foreground">
                            The employee has been successfully added.
                        </p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 h-full">
                        <div className="hidden md:block relative bg-muted">
                            <Image
                                src="/images/gym-illustration.jpg"
                                alt="create employees dialog Illustration"
                                fill={true}
                                className="object-cover"
                            />
                        </div>

                        <div className="p-6 space-y-5 overflow-y-auto">
                            <DialogHeader className="sr-only">
                                <DialogTitle>Create Employee</DialogTitle>
                            </DialogHeader>
                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Step {step + 1} of {steps.length}
                                </p>
                                <h2 className="text-lg font-semibold">{steps[step].title}</h2>
                                <p className="text-sm text-muted-foreground">
                                    {steps[step].description}
                                </p>
                                <div className="flex gap-2 mt-3">
                                    {steps.map((_, index) => (
                                        <div
                                            key={index}
                                            className={cn(
                                                "flex-1 h-2 rounded-full",
                                                index <= step ? "bg-primary" : "bg-muted"
                                            )}
                                        />
                                    ))}
                                </div>
                            </div>

                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                {step === 0 &&
                                    personalFields.map((field) => (
                                        <div key={field.name} className="space-y-1">
                                            <FieldLabel>{field.label}</FieldLabel>
                                            <Input
                                                {...form.register(field.name)}
                                                placeholder={field.placeholder}
                                            />
                                            {form.formState.errors[field.name]?.message && (
                                                <p className="text-xs text-red-500">
                                                    {form.formState.errors[field.name]?.message}
                                                </p>
                                            )}
                                        </div>
                                    ))}

                                {step === 1 &&
                                    controlledFields.map((fieldCfg) => (
                                        <div key={fieldCfg.name} className="space-y-1">
                                            <FieldLabel>{fieldCfg.label}</FieldLabel>
                                            <Controller
                                                name={fieldCfg.name}
                                                control={form.control}
                                                render={({ field }) => (
                                                    <Select
                                                        value={field.value ?? ""}
                                                        onValueChange={field.onChange}
                                                    >
                                                        <SelectTrigger className="w-full bg-white">
                                                            <SelectValue
                                                                placeholder={`Select ${fieldCfg.label}`}
                                                            />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {fieldCfg.name === "gender" &&
                                                                fieldCfg.options.map((option) => (
                                                                    <SelectItem
                                                                        key={option.value}
                                                                        value={option.value}
                                                                    >
                                                                        {option.label}
                                                                    </SelectItem>
                                                                ))}

                                                            {fieldCfg.name === "role" &&
                                                                fieldCfg.options.map((option) => (
                                                                    <SelectItem
                                                                        key={option.value}
                                                                        value={option.value}
                                                                    >
                                                                        {option.label}
                                                                    </SelectItem>
                                                                ))}

                                                            {fieldCfg.name === "branch" &&
                                                                fieldCfg.options.map((option) => (
                                                                    <SelectItem
                                                                        key={option.value}
                                                                        value={option.value}
                                                                    >
                                                                        {option.label}
                                                                    </SelectItem>
                                                                ))}
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />

                                            {form.formState.errors[fieldCfg.name]?.message && (
                                                <p className="text-xs text-red-500">
                                                    {form.formState.errors[fieldCfg.name]?.message}
                                                </p>
                                            )}
                                        </div>
                                    ))}

                                {step === 2 &&
                                    role === "trainer" && (
                                        <div>
                                            <FieldLabel>Specialities</FieldLabel>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {specialityOptions.map((speciality) => {
                                                    const selected = selectedSpecialities.includes(speciality);
                                                    return (
                                                        <Badge
                                                            key={speciality}
                                                            variant={selected ? "default" : "outline"}
                                                            className="cursor-pointer"
                                                            onClick={() => toggleSpeciality(speciality)}
                                                        >
                                                            {speciality}
                                                        </Badge>
                                                    )
                                                })}
                                            </div>

                                            {form.formState.errors.specialities && (
                                                <p className="text-xs text-red-500 mt-1">
                                                    {form.formState.errors.specialities.message}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                {step === 3 && (
                                    <div className="space-y-3 text-sm">
                                        <p><b>Name:</b>{" "}{form.getValues("firstName")} {form.getValues("lastName")}</p>
                                        <p><b>Email:</b> {form.getValues("email")}</p>
                                        <p><b>Role:</b> {form.getValues("role")}</p>
                                        <p><b>Branch:</b> {form.getValues("branch")}</p>

                                        {role === "trainer" && (
                                            <div>
                                                <p className="font-medium">Specialities</p>
                                                <div className="flex flex-wrap gap-2 mt-1">
                                                    {selectedSpecialities.map((speciality) => (
                                                        <Badge key={speciality}>{speciality}</Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                    </div>
                                )}

                                <div className="flex justify-between pt-4">
                                    {step > 0 && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleBack}
                                        >
                                            <IconChevronLeft stroke={2} />
                                            Back
                                        </Button>
                                    )}
                                    {step < 3 ? (
                                        <Button
                                            type="button"
                                            onClick={handleNext}
                                            disabled={!isStepValid}
                                            className="disabled:opacity-50"
                                        >
                                            Next
                                            <IconChevronRight stroke={2} />
                                        </Button>
                                    ) : (
                                        <Button type="submit" disabled={isLoading}>
                                            {isLoading ? "Creating..." : "Create Employee"}
                                        </Button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}