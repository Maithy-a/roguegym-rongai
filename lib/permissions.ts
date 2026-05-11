import { STAFF_ROLES, StaffRole } from "@/constants";

type RolePermissions = {
    manageEmployees: boolean;
    accessDashboard: boolean;
    manageBilling: boolean;
};

export const ROLE_PERMISSIONS: Record<StaffRole, RolePermissions> = {
    [STAFF_ROLES.ADMIN]: {
        manageEmployees: true,
        accessDashboard: true,
        manageBilling: true,
    },

    [STAFF_ROLES.MANAGER]: {
        manageEmployees: true,
        accessDashboard: true,
        manageBilling: true,
    },

    [STAFF_ROLES.RECEPTIONIST]: {
        manageEmployees: false,
        accessDashboard: true,
        manageBilling: false,
    },

    [STAFF_ROLES.TRAINER]: {
        manageEmployees: false,
        accessDashboard: false,
        manageBilling: false,
    },
};

export function canAccessDashboard(role: StaffRole) {
    return ROLE_PERMISSIONS[role].accessDashboard;
}

export function canManageEmployees(role: StaffRole) {
    return ROLE_PERMISSIONS[role].manageEmployees;
}

export function canManageBilling(role: StaffRole) {
    return ROLE_PERMISSIONS[role].manageBilling;
}
