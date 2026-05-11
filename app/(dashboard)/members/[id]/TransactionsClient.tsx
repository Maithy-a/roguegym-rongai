"use client";

import RecentMemberTransactions from "@/components/RecentMemberTransactions";
import ViewMemberTransaction from "@/components/ViewMemberTransaction";
import { useState } from "react";

export default function TransactionsClient({ transactions }: any) {
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [open, setOpen] = useState(false);

    const handleSelect = (transaction: any) => {
        setSelectedTransaction(transaction);
        setOpen(true);
    };

    return (
        <>
            <RecentMemberTransactions
                transactions={transactions}
                onSelect={handleSelect}
            />

            <ViewMemberTransaction
                transaction={selectedTransaction}
                open={open}
                onOpenChange={(value) => {
                    setOpen(value)
                    if (!value) setSelectedTransaction(null)
                }}
            />
        </>
    );
}