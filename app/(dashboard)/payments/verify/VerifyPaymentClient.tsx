"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import { toast } from "react-toastify";

import PaymentSuccess from "@/components/PaymentSuccess";
import PaymentFailed from "@/components/PaymentFailed";

interface PaymentData {
    reference: string
    paymentChannel: string
    paidAt: string
    amount: number
}

export default function VerifyPaymentClient() {

    const router = useRouter();
    const searchParams = useSearchParams();
    const reference = searchParams.get("reference");

    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [message, setMessage] = useState("");
    const [hasVerified, setHasVerified] = useState(false);

    const [paymentData, setPaymentData] = useState<PaymentData | null>(null);

    useEffect(() => {
        if (hasVerified) return;

        async function verifyPayment() {

            try {

                setHasVerified(true);
                if (!reference) {
                    throw new Error("Missing payment reference");
                }

                const response = await fetch(
                    `/api/payments/verify?reference=${reference}`
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.error || "Verification failed"
                    );
                }

                setPaymentData({
                    reference: data.reference,
                    paymentChannel: data.paymentChannel,
                    paidAt: data.paidAt,
                    amount: data.amount,
                });

                setSuccess(true);
                setMessage("Your payment has been verified successfully.");

                toast.success(
                    "Payment verified successfully!"
                );

            } catch (error) {
                const errorMsg =
                    error instanceof Error
                        ? error.message
                        : "Verification failed";

                setMessage(errorMsg);
                setSuccess(false);
                toast.error(errorMsg);

            } finally {
                setLoading(false);
            }
        }

        verifyPayment();

    }, [reference, hasVerified]);

    if (loading) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center px-4">
                <div className="w-full max-w-md rounded-3xl border bg-white p-8 shadow-sm">

                    <div className="flex flex-col items-center text-center">
                        <div className="h-14 w-14 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                        <h2 className="mt-6 text-xl font-semibold">
                            Verifying Payment
                        </h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Please wait while we confirm the transaction.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="main-container flex items-center justify-center">

            {success && paymentData ? (
                <PaymentSuccess
                    title="Payment Verified Successfully"
                    message={message}
                    reference={paymentData.reference}
                    paymentChannel={paymentData.paymentChannel}
                    paidAt={paymentData.paidAt}
                    amount={paymentData.amount}
                    onContinue={() => router.push("/members")}
                />
            ) : (
                <PaymentFailed
                    title="Payment Failed"
                    message={message}
                    onTryAgain={() => router.push("/members/create-member")}
                />
            )}

        </div>
    );
}