import { Button } from "@/components/ui/button";
import { IconCloudUp } from "@tabler/icons-react";
import { Link } from "lucide-react";

export default function PaymentsPage() {
  return (
    <section className="main-container">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Payments</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your gym payments, view transaction history and generate reports
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link href="/payments/export" className="flex items-center gap-2">
              <IconCloudUp size={18} />
              Export
            </Link>
          </Button>
        </div>
      </div>


      PaymentsPage

    </section>
  )
}
