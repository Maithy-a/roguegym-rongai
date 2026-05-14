import AssignedMembersList from "@/components/employees/AssignedMemberList";
import { Badge } from "@/components/ui/badge";
import { formatToShortDate } from "@/lib/formatters";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { IconPlus, IconCloudUpload, IconUserEdit } from "@tabler/icons-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import Image from "next/image";
import { STAFF_ROLES } from "@/constants";

interface EmployeeDetailsPageProps {
    params: Promise<{ id: string }>
}

export default async function EmployeeDetailsPage({ params }: EmployeeDetailsPageProps) {
    const { id } = await params;

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/employees/${id}`, {
        cache: "no-store",
    });

    if (!res.ok) return notFound();

    const {
        fullName,
        email,
        phoneNumber,
        gender,
        role,
        branch,
        assignedMembers,
        specialities,
        createdAt,
        updatedAt
    } = await res.json();

    return (
        <section className="main-container">
            <header className="relative overflow-hidden rounded-3xl bg-linear-to-r from-background to-blue-100 p-6 ring-4 ring-background">
                <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 hidden md:block">
                    <div className="h-full w-full relative">
                        <Image
                            src="/images/arm-illustration.png"
                            alt="Arm illustration"
                            fill={true}
                            className="object-contain object-right opacity-60"
                        />
                    </div>
                </div>

                <div className="relative z-10 flex flex-col gap-6">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-wrap">
                                <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 tracking-tight capitalize">
                                    {fullName}
                                </h1>

                                <Badge className="text-xs bg-blue-100 text-blue-700 capitalize px-2 py-1">
                                    {role}
                                </Badge>
                            </div>

                            <div className="flex gap-3">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span>
                                            <Button
                                                className="text-xs px-3 py-1.5 h-8"
                                                disabled={role !== "trainer"}
                                            >
                                                <IconPlus size={14} />
                                                Assign Member
                                            </Button>
                                        </span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {role !== "trainer"
                                            ? "Only trainers can assign members"
                                            : "Assign member"
                                        }
                                    </TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            className="h-8 w-8 rounded-full"
                                        >
                                            <IconUserEdit stroke={2} />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Edit employee</p>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                        </div>

                        <div className="flex gap-8 text-sm font-mono">
                            <div>
                                <p className="text-gray-500">Branch</p>
                                <p className="font-semibold text-gray-900 capitalize">
                                    {branch} Branch
                                </p>
                            </div>

                            {role === STAFF_ROLES.TRAINER && (
                                <div>
                                    <p className="text-gray-500">Assigned to</p>
                                    <p className="font-semibold text-gray-900 ">
                                        {assignedMembers?.length ?? 0}{" "}
                                        {assignedMembers?.length === 1
                                            ? "Member"
                                            : "Members"
                                        }
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 w-full">
                        <div className="flex flex-wrap gap-6 text-sm font-mono">
                            <div>
                                <p className="text-gray-500">Email</p>
                                <p className="text-gray-900 font-medium">{email}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Phone</p>
                                <p className="text-gray-900 font-medium">{phoneNumber}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Gender</p>
                                <p className="text-gray-900 capitalize font-medium">{gender}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <article className="grid grid-cols-4 gap-6">
                <div className="col-span-3 space-y-6">
                    <div className="rounded-2xl bg-muted p-1.5">
                        <div className="flex justify-between font-semibold text-gray-700 my-2 px-2">
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg">
                                    Assigned Members
                                </h2>

                                <span className="flex items-center justify-center w-6 h-6 text-xs font-medium bg-yellow-400 rounded-full">
                                    {assignedMembers?.length ?? 0}
                                </span>
                            </div>

                            <div className="flex items-center gap-1">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            size="icon"
                                            className="h-8 w-8 rounded-full"
                                            disabled={role !== STAFF_ROLES.TRAINER}
                                        >
                                            <IconPlus size={16} />
                                        </Button>
                                    </TooltipTrigger>

                                    <TooltipContent>
                                        {role !== STAFF_ROLES.TRAINER ? "Only trainers can assign members" : "Assign member"}
                                    </TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span>
                                            <Button
                                                size="icon"
                                                variant="outline"
                                                className="h-8 w-8 rounded-full"
                                                disabled={role !== STAFF_ROLES.TRAINER}
                                            >
                                                <IconCloudUpload stroke={2} />
                                            </Button>
                                        </span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        Export Records
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                        </div>

                        <AssignedMembersList
                            members={assignedMembers}
                            role={role}
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    {role === STAFF_ROLES.TRAINER && specialities?.length > 0 && (
                        <div className="rounded-lg bg-muted p-0.5">
                            <h3 className="rounded-lg bg-background border px-2 py-1 text-sm font-medium text-gray-900">
                                Specialities
                            </h3>
                            <div className="flex flex-wrap gap-2 border bg-background p-3 py-3 rounded-lg">
                                {specialities.map((speciality: string) => (
                                    <Badge
                                        key={speciality}
                                        className="px-3 py-1 text-xs rounded-full bg-purple-100 text-purple-700"
                                    >
                                        {speciality}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="rounded-lg bg-muted p-0.5">
                        <h3 className="rounded-lg bg-background border px-2 py-1 text-sm font-medium text-gray-900">
                            Staff updates
                        </h3>
                        <div className="border bg-background p-3 rounded-lg">
                            <p className="text-xs text-gray-600">
                                Joined: {formatToShortDate(createdAt)}
                            </p>
                        </div>
                        <div className="border bg-background p-3 rounded-lg">
                            <p className="text-xs text-gray-600">
                                Updated: {formatToShortDate(updatedAt)}
                            </p>
                        </div>
                    </div>
                </div>
            </article>
        </section>
    );
}