
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Building2 } from "lucide-react"
import { BillingDataTable } from "./data-table"
import { columns, BillingPlan } from "./columns"
import { CreatePlanDialog } from "@/components/CreatePlanDialog"

export default async function BillingPlansPage() {

  const res = await fetch(`${process.env.NEXT_BASE_URL}/api/plans`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  })

  const data = await res.json()
  const totalPlans = data.length

  return (
    <section className="main-container">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-bold"> Subscription plans</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Create and manage subscription plans for your customers.
        </p>
      </div>
      
      <Separator className="mb-2" />

      <div className="mb-6 rounded-3xl border p-6 bg-linear-to-tr to-[#222223] from-[#47484a] text-white">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center justify-center gap-3">
            <Button variant="ghost" size="icon" className="rounded-lg bg-red-50 text-red-600">
              <Building2 />
            </Button>
            <div>
              <h2 className="text-lg font-semibold text-gray-100">
                Create your own plans
              </h2>
              <p className="text-sm text-gray-200">
                Set up pricing plans and start onboarding users.
              </p>
            </div>
          </div>

          <Badge
            variant="outline"
            className="bg-white text-gray-800"
          >
            {totalPlans} {totalPlans === 1 ? "Plan" : "Plans"} Created
          </Badge>
        </div>

        <div className="my-4 h-px w-full bg-gray-600" />

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-200">
            Plans help you organize subscriptions and billing.
          </p>

          <CreatePlanDialog />
        </div>
      </div>

      <BillingDataTable
        columns={columns}
        data={data}
      />

    </section>
  )
}
