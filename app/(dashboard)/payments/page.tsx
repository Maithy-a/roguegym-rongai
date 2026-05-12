import PaymentDonut from "@/components/PaymentDonut";
import PaymentKPI from "@/components/PaymentKPI";

export default async function PaymentsPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/payments`, { cache: "no-store" })
  const data = await res.json()

  return (
    <section className="main-container space-y-4">
      <PaymentKPI
        totalTransactions={data.totalTransactions}
        totalRevenue={data.totalRevenue}
        successfulPayments={data.successfulPayments}
      />

      <PaymentDonut data={data.revenueByPlan} />
    </section>
  )
}
