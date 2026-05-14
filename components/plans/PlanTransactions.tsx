import { formatCurrency, formatToLongDate } from "@/lib/formatters";
import Image from "next/image";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

interface PlanTransaction {
    transactionId: string;
    reference: string;
    amount: number;
    paidAt: string;
    expiryDate: string;
    status: string;
    member?: { firstName: string; lastName: string };
}

interface PlanTransactionsProps {
    transactions: PlanTransaction[];
    // onSelect?: (transaction: PlanTransaction) => void;
}

export default function PlanTransactions({
    transactions,
    // onSelect,
}: PlanTransactionsProps) {
    return (
        <div className="bg-accent rounded-lg p-0.5">
            <div className="flex items-center justify-between px-2 py-1">
                <h3 className="text-lg font-semibold">Transaction History</h3>
            </div>

            {transactions.length ? (
                <div className="bg-white rounded-lg border overflow-hidden">
                    <Table className="w-full text-sm">
                        <TableBody>
                            {transactions.map((transaction) => (
                                <TableRow
                                    key={transaction.transactionId}
                                    // onClick={() => onSelect?.(transaction)}
                                    className="group cursor-pointer border-t transition-all first:border-t-0 hover:bg-accent/50"
                                >
                                    <TableCell className="px-4 py-3">
                                        <p className="text-xs text-muted-foreground">Reference</p>
                                        <p className="text-sm font-medium uppercase tracking-wide">{transaction.reference}</p>
                                    </TableCell>
                                    <TableCell className="px-4 py-3">
                                        <p className="text-xs text-muted-foreground">Paid On</p>
                                        <p className="text-sm font-medium">{formatToLongDate(transaction.paidAt)}</p>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-right">
                                        <span className="text-sm font-semibold text-primary">
                                            {formatCurrency(transaction.amount)}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            ) : (
                <div className="bg-white rounded-lg border p-10 text-center">
                    <Image
                        src="/images/empty-table.svg"
                        alt="No transactions"
                        width={150}
                        height={150}
                        className="mx-auto mb-4"
                    />
                    <p className="text-sm text-muted-foreground">No transactions for this plan yet.</p>
                </div>
            )}
        </div>
    );
}