export type Member = {
    memberId: any;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    totalAmount: number;
    status: "Active" | "Inactive";
    createdAt?: Date;
    dueDate?: Date;
    paymentId?: any;
    planId?: any;
};

export type Payment = {
    paymentId: string;
    paymentReference: string;
    memberId: string;
    planId: string;
    amount: number;
    status: 'success' | 'pending' | 'failed';
    paidAt: Date | null;
}

export type Plan = {
    planId: string;
    planKey: string;
    planTitle: string;
    price: number;
    duration: number; // in months
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date | null;
}

export type employees = {
    employeeId: string;
    firstName: string;
    lastName: string;
    email: string;
    description: string;
    phoneNumber: string;
    position: string;
    specalities?: string[];
    assignedMembers?: string[]; // Array of member IDs
    createdAt: Date;
    updatedAt: Date | null;
}