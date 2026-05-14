export type PaymentStatus =
    | "pending"
    | "success"
    | "failed"

export interface PaymentResponse {
    id: string
    reference: string
    amount: number
    currency: string
    member: string
    memberEmail?: string
    plan: string
    planKey: string
    status: string
    paymentChannel: string
    gatewayResponse: string
    paidAt: string
}