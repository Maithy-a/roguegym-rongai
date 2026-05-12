export type PaymentStatus = "pending" | "success" | "failed"

export interface PaymentResponse {
    id: string
    reference: string
    amount: string
    currency: string
    member: string
    memberEmail: string
    plan: string
    planKey: string
    status: PaymentStatus
    paymentChannel: string
    gatewayResponse: string
    paidAt: string
}
