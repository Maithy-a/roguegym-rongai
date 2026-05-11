"use client";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatToLongDate } from "@/lib/formatters";
import { MemberTransactions } from "@/types/member";

interface ViewMemberTransactionProps {
    transaction: MemberTransactions | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function ViewMemberTransaction({
    transaction,
    open,
    onOpenChange,
}: ViewMemberTransactionProps) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-md p-2.5">
                {transaction && (
                    <>
                        <SheetHeader>
                            <SheetTitle>Transaction Details</SheetTitle>
                            <SheetDescription>
                                View receipt and transaction info
                            </SheetDescription>
                        </SheetHeader>

                        <div className="mt-6 space-y-4 px-4">
                            <div>
                                <p className="text-xs text-muted-foreground">Amount</p>
                                <p className="text-2xl font-bold text-primary font-mono">
                                    {formatCurrency(transaction.amount)}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-muted-foreground">Reference</p>
                                <p className="font-medium font-mono">{transaction.reference}</p>
                            </div>

                            <div>
                                <p className="text-xs text-muted-foreground">Plan</p>
                                <p className="font-medium">
                                    {transaction.plan?.planTitle || "N/A"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-muted-foreground">Paid On</p>
                                <p className="font-medium">
                                    {formatToLongDate(transaction.paidAt)}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Expiry Date
                                </p>
                                <p className="font-medium">
                                    {formatToLongDate(transaction.expiryDate)}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-6">
                                <Button>Export Receipt</Button>
                                <Button variant="outline" >Share</Button>
                            </div>
                        </div>
                    </>
                )}
            </SheetContent>
        </Sheet>
    );
}