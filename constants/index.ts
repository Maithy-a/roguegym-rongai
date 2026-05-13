import { PlanStatus } from "@/types/billing-plan"
import { MemberStatus } from "@/types/member"

import {
    IconSmartHome,
    IconCreditCard,
    IconUsers,
    IconUser,
    IconBox,
} from "@tabler/icons-react"

export const sidebarLinks = {
    navMain: [
        {
            title: "Overview",
            url: "/overview",
            icon: IconSmartHome,
        },
        {
            title: "Members",
            url: "/members",
            icon: IconUsers,
        },
        {
            title: "Employees",
            url: "/employees",
            icon: IconUser,
        },
        {
            title: "Payments",
            url: "/payments",
            icon: IconCreditCard,
        },
        {
            title: "Billing plans",
            url: "/billing-plans",
            icon: IconBox,
        }
    ],
}

export const genderOptions = [
    {
        value: "male",
        label: "Male"
    },
    {
        value: "female",
        label: "Female"
    }, {
        value: "prefer-not-to-say",
        label: "Prefer not to say"
    }
]

export const fitnessGoal = [
    {
        value: "weight-loss",
        goal: "Weight loss"
    },
    {
        value: "strength-training",
        goal: "Strength Training"
    },
    {
        value: "muscle-gain",
        goal: "Muscle Gain"
    },
    {
        value: "general-fitness",
        goal: "General Fitness"
    },
    {
        value: "body-toning",
        goal: "Body Toning"
    }
]

export const statusStyles: Record<MemberStatus, string> = {
    pending: "bg-yellow-500",
    active: "bg-green-500",
    expired: "bg-red-500",
}

export const avatarStyles: Record<MemberStatus, string> = {
    pending: "bg-yellow-100 text-yellow-500",
    active: "bg-green-100 text-green-500",
    expired: "bg-red-100 text-red-500",
}

export const badgeStyles: Record<MemberStatus, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    active: "bg-green-100 text-green-800",
    expired: "bg-red-100 text-red-800",
}

export const statusBadgeStyles: Record<PlanStatus, string> = {
    active: "bg-green-100 text-green-800",
    inactive: "bg-gray-100 text-gray-800",
}

export const STAFF_ROLES = {
    ADMIN: "admin",
    MANAGER: "manager",
    TRAINER: "trainer",
    RECEPTIONIST: "receptionist",
} as const;

export type StaffRole = (typeof STAFF_ROLES)[keyof typeof STAFF_ROLES];
