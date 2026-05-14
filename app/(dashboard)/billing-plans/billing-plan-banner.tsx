import { CreatePlanDialog } from '@/components/plans/CreatePlanDialog'
import { Badge } from '@/components/ui/badge'
import { Building2 } from 'lucide-react'

interface BillingPlanBannerProps {
    totalPlans: number
}

export default function BillingPlanBanner({ totalPlans }: BillingPlanBannerProps) {
    return (
        <div className="p-0.5 bg-muted rounded-xl">
            <div className="relative overflow-hidden rounded-xl border bg-white p-6 py-8">
                <div className="flex flex-col gap-6">
                    <div className="flex justify-between">
                        <div className="flex items-center gap-3">
                            <div className="rounded-full bg-primary/10 p-3">
                                <Building2 className="text-primary" />
                            </div>

                            <div>
                                <h2 className="text-lg font-semibold">
                                    Billing Plans
                                </h2>
                                <p className="text-xs text-muted-foreground">
                                    Organize your subscriptions and pricing structure.
                                </p>
                            </div>
                        </div>

                        <Badge>
                            {totalPlans} {" "}
                            {totalPlans === 1
                                ? "Plan"
                                : "Plans"
                            }
                        </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Plans define how members subscribe and pay for services.
                        </p>

                        <CreatePlanDialog />
                    </div>
                </div>
            </div>
        </div>
    )
}
