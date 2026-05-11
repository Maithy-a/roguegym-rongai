export type PlanStatus =
    | "active"
    | "inactive"

export interface BillingPlan {
    id: string
    planKey: string
    planTitle: string
    price: number
    duration: number
    description: string
    status: PlanStatus
}