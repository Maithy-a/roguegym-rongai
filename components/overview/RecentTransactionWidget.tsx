import { formatToLongDate, formatCurrency } from "@/lib/formatters";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Clock } from "lucide-react";

export interface RecentTransaction {
    id: string;
    reference: string;
    amount: number;
    paidAt: string;
    plan: {
        title: string
    };
    member: {
        firstName: string;
        lastName: string
    };
}

interface RecentTransactionsWidgetProps {
    transactions: RecentTransaction[];
}

export default function RecentTransactionWidget({ transactions }: RecentTransactionsWidgetProps) {
    if (!transactions.length) {
        return (
            <div className="rounded-lg p-8 text-center border border-dashed border-muted-foreground/50">
                <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-1">No recent transactions</h3>
                <p className="text-sm text-muted-foreground">Payments will appear here</p>
            </div>
        );
    }

    return (
        <div className="rounded-lg p-0.5 bg-accent">
            <div className="bg-background rounded-lg p-6 h-full w-full flex flex-col">
                <div className="flex items-center justify-between mb-2">
                    <div>
                        <h3 className="text-xl font-bold tracking-tight">Recent Transactions</h3>
                        <p className="text-xs text-muted-foreground italic">Latest 6 payments</p>
                    </div>
                </div>

                <Table className="w-full text-sm">
                    <TableBody>
                        {transactions.slice(0, 5).map((transaction) => (
                            <TableRow key={transaction.id} className="border-b last:border-b-0 hover:bg-accent/70 group">
                                <TableCell>
                                    <p className="text-xs text-muted-foreground mb-1">
                                        Reference
                                    </p>
                                    <p className="truncate text-sm font-medium">
                                        {transaction.reference}
                                    </p>
                                </TableCell>
                                <TableCell>
                                    <p className="text-xs text-muted-foreground mb-1">
                                        Member
                                    </p>
                                    <p className="truncate text-sm font-medium">
                                        {transaction.member.firstName} {transaction.member.lastName}
                                    </p>
                                </TableCell>
                                <TableCell>
                                    <p className="text-xs text-muted-foreground mb-1">Paid At</p>
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-medium">
                                            {formatToLongDate(transaction.paidAt)}
                                        </p>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <p className="text-xs text-muted-foreground mb-1">Amount</p>
                                    <span className="truncate text-sm font-medium">
                                        {formatCurrency(transaction.amount)}
                                    </span>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}