export interface CurrentPlan {
    planKey: string;
    planTitle: string;
    price: number;
    duration: number;

    status: MemberStatus;
    paymentStatus: PaymentStatus;

    startDate: string;
    membershipExpiry: string;
}

export interface MemberTransactions {
    transactionId: string;
    reference: string;
    amount: number;
    paidAt: string;
    expiryDate: string;
    plan?: {
        planId: string;
        planKey: string;
        planTitle: string;
    };
}

export type MemberStatus =
    | "pending"
    | "active"
    | "expired"

export type PaymentStatus =
    | "pending"
    | "paid"
    | "failed"

export type MembersResponse = {
    memberId: string
    fullName: string
    email: string
    phoneNumber: string
    status: MemberStatus
    plan: string
    amountPaid: number
    createdAt: string
}


export interface MemberResponse {
    memberId: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;

    currentPlan: CurrentPlan;
    transactions: MemberTransactions[];
}