import { Suspense } from "react"
import VerifyPaymentClient from "./VerifyPaymentClient"

export default function VerifyPaymentPage() {
    return (
        <Suspense
            fallback={
                <div className="p-10">
                    Loading payment verification...
                </div>
            }
        >
            <VerifyPaymentClient />
        </Suspense>
    )
}