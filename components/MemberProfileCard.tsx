import { formatCurrency, formatToLongDate } from '@/lib/formatters'
import { Avatar, AvatarFallback } from './ui/avatar'
import { cn } from '@/lib/utils'
import { CurrentPlan, MemberStatus } from '@/types/member'
import { avatarStyles, statusStyles } from '@/constants'

interface MemberProfileCardProps {
    firstName: string
    lastName: string
    email: string
    status: MemberStatus
    currentPlan: CurrentPlan
}

export default function MemberProfileCard({
    firstName,
    lastName,
    email,
    status,
    currentPlan,
}: MemberProfileCardProps) {
    const fullName = `${firstName} ${lastName}`

    return (
        <div className="relative overflow-hidden bg-background rounded-lg p-6 flex flex-col justify-between shadow-xs">
            <div
                className={cn(
                    "absolute -top-10 -right-10 h-35 w-35 rounded-full blur-3xl opacity-20",
                    statusStyles[status]
                )}
            />
            <div className="flex items-center gap-4">
                <Avatar className="size-15">
                    <AvatarFallback className={cn(avatarStyles[status])} >
                        {firstName?.[0]}
                        {lastName?.[0]}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <h2 className="text-xl font-semibold">{fullName}</h2>
                    <p className="text-xs text-muted-foreground">{email}</p>
                </div>
            </div>
            <div className="space-y-3 text-sm mt-6">
                <div className="flex justify-between border-b border-dashed border-border pb-2">
                    <span className="text-gray-500">Current Plan</span>
                    <span className="font-medium">
                        {currentPlan?.planTitle ?? "No Plan"}
                    </span>
                </div>
                <div className="flex justify-between border-b border-dashed border-border pb-2">
                    <span className="text-gray-500">Plan Duration</span>
                    <span className="font-medium">
                        {currentPlan?.duration ?? 0} months
                    </span>
                </div>
                <div className="flex justify-between border-b border-dashed border-border pb-2">
                    <span className="text-gray-500">Plan Cost</span>
                    <span className="font-medium">
                        {currentPlan
                            ? formatCurrency(currentPlan.price)
                            : "—"
                        }
                    </span>
                </div>
                <div className="flex justify-between border-b border-dashed border-border pb-2">
                    <span className="text-gray-500">Expiry Date</span>
                    <span className="font-medium">
                        {currentPlan && currentPlan.membershipExpiry
                            ? formatToLongDate(currentPlan.membershipExpiry)
                            : "—"
                        }
                    </span>
                </div>
            </div>

            <div className="mt-6 space-y-2">
                {/* <ChangePlanDialog
                    isPending={isPending}
                    selectedPlan={selectedPlan}
                    onSelectPlan={setSelectedPlan}
                    onConfirm={handleChangePlan}
                    plans={plans}
                />
                <RenewPlanDialog
                    isPending={isPending}
                    onConfirm={handleRenew}
                /> */}
            </div>
        </div>
    )
}
