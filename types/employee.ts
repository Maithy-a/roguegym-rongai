export type EmployeeRole =
    | "trainer"
    | "receptionist"
    | "manager"
    | "admin";

export type Employees = {
    employeeId: string
    fullName: string
    phoneNumber: string
    email: string
    gender: string
    role: EmployeeRole
    createdAt: string

    membersAssigned?: {
        memberId: string
        fullName: string
    }
}