import {
    IconSmartHome,
    IconCreditCard,
    // IconTags,
    IconUsers,
    IconUser,
    IconBox,
} from "@tabler/icons-react"

export const sidebarLinks = {
    navMain: [
        {
            title: "Overview",
            url: "/",
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
