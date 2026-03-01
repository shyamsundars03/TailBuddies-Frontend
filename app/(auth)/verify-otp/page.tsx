
import { Suspense } from "react"
import { AuthLayout } from "../../../components/auth/AuthLayout"
import { AuthLeftPanel } from "../../../components/auth/AuthLeftPanel"
import { VerifyOTPForm } from "../../../components/auth/VerifyOTPForm"

export default function VerifyOTPPage() {
    return (
        <AuthLayout
            maxWidth="md"
            leftPanelColor="yellow"
            leftPanel={<AuthLeftPanel title="Verify OTP" subtitle="Security Check" />}
        >
            <Suspense fallback={<div>Loading...</div>}>
                <VerifyOTPForm />
            </Suspense>
        </AuthLayout>
    )
}
