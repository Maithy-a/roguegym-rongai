import { formatCurrency, formatToLongDate } from "@/lib/formatters";
import Image from "next/image";
import { MemberTransactions } from "@/types/member";
import { Table, TableBody, TableCell, TableRow } from "./ui/table";

interface TransactionHistoryProps {
    transactions: MemberTransactions[];
    onSelect: (transaction: MemberTransactions) => void;
}

export default function RecentMemberTransactions({
    transactions,
    onSelect,
}: TransactionHistoryProps) {

    return (
        <>
            <div className="bg-accent rounded-3xl p-1.5">
                <div className="flex items-center justify-between px-2 py-1.5">
                    <h3 className="text-lg font-semibold">
                        Transaction History
                    </h3>

                    <p className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="rounded-full bg-primary text-white font-medium h-5 w-5 flex items-center justify-center">
                            {transactions.length}
                        </span>
                        <span className="text-sm">
                            Transaction{transactions.length !== 1 && "s"}
                        </span>
                    </p>
                </div>

                {transactions.length ? (
                    <div className="bg-white rounded-2xl border overflow-hidden">
                        <Table className="w-full text-sm">
                            <TableBody>
                                {transactions.map((transaction) => (
                                    <TableRow
                                        key={transaction.transactionId}
                                        onClick={() => onSelect(transaction)}
                                        className="group cursor-pointer border-t transition-all first:border-t-0  "
                                    >
                                        <TableCell className="px-4 py-3">
                                            <p className="text-xs text-muted-foreground">
                                                Reference
                                            </p>
                                            <p className="text-sm font-medium uppercase tracking-wide">
                                                {transaction.reference}
                                            </p>
                                        </TableCell>

                                        <TableCell className="px-4 py-3">
                                            <p className="text-sm font-medium">
                                                {transaction.plan?.planTitle || "N/A"}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Expires: {" "}
                                                {formatToLongDate(transaction.expiryDate)}
                                            </p>
                                        </TableCell>

                                        <TableCell className="px-4 py-3">
                                            <p className="text-xs text-muted-foreground">
                                                Paid On
                                            </p>
                                            <p className="text-sm font-medium">
                                                {formatToLongDate(transaction.paidAt)}
                                            </p>
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
                    <TableRow>
                        <TableCell className="text-center py-10 text-sm text-muted-foreground">
                            <Image
                                src="/images/empty-table.svg"
                                alt="No transactions"
                                width={150}
                                height={150}
                                className="mx-auto mb-4"
                            />
                            <p>No transactions yet.</p>
                        </TableCell>
                    </TableRow>
                )}
            </div>


        </>
    );
}