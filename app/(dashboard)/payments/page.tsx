import PaymentKPI from "@/components/PaymentKPI";
import { columns } from "./columns";
import { PaymentDataTable } from "./data-table";
import PaymentDonut from "@/components/PaymentDonut";

export default async function PaymentsPage({
  searchParams,
}: {
  searchParams: {
    page?: string
    limit?: string
    search?: string

    reference?: string
    status?: string
    plan?: string
    paymentChannel?: string
  }
}) {

  const params = await searchParams

  const page = params.page
  const limit = params.limit
  const search = params.search

  const reference = params.reference
  const status = params.status
  const plan = params.plan
  const paymentChannel = params.paymentChannel


  const query = new URLSearchParams({
    page: page ?? "1",
    limit: limit ?? "10",
    search: search ?? "",

    reference: reference ?? "all",
    status: status ?? "all",
    plan: plan ?? "all",
    paymentChannel: paymentChannel ?? "all",
  })

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/payments?${query.toString()}`,
    { cache: "no-store" }
  )
  const data = await res.json()

  return (
    <section className="main-container space-y-4">
      <PaymentKPI
        totalTransactions={data.totalTransactions}
        totalRevenue={data.totalRevenue}
        successfulPayments={data.successfulPayments}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 min-w-0">
          <PaymentDataTable
            columns={columns}
            data={data.payments}
            page={data.page}
            limit={data.limit}
            total={data.totalTransactions}
          />
        </div>

        <div className="lg:col-span-1 mt-12">
          <PaymentDonut data={data.revenueByPlan} />
        </div>
      </div>

    </section>
  )
}
