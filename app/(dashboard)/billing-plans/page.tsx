import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Building2 } from "lucide-react"
import { BillingDataTable } from "./data-table"
import { columns } from "./columns"
import { CreatePlanDialog } from "@/components/CreatePlanDialog"

export default async function BillingPlansPage() {

  const res = await fetch(`${process.env.NEXT_BASE_URL}/api/plans`, {
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

      <div className="mb-6 rounded-3xl border p-6 bg-linear-to-tr to-[#201d1d] from-[#47484a] text-white py-4 space-y-6">
        <div className="flex justify-between pb-6">
          <div className="flex items-center gap-2">
            <Button
              size="icon-lg"
              className="rounded-full"
            >
              <Building2 />
            </Button>

            <div>
              <h2 className="text-lg font-semibold text-gray-100">
                Create Billing Plans
              </h2>
              <p className="text-xs text-gray-200">
                Set up pricing plans and start onboarding users.
              </p>
            </div>
          </div>

          <CreatePlanDialog />
        </div>

        <div className="my-4 h-px w-full bg-muted/50" />

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted">
            Plans help you organize subscriptions and billing.
          </p>

          <span className="bg-yellow-500 text-sm px-2.5 rounded-full" >
            {totalPlans} {totalPlans === 1 ? "Plan" : "Plans"} created
          </span>
        </div>
      </div>

      <BillingDataTable
        columns={columns}
        data={data}
      />
      
    </section>
  )
}
