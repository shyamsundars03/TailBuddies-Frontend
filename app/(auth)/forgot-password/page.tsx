
import { Suspense } from "react"
import { AuthLayout } from "../../../components/auth/AuthLayout"
import { AuthLeftPanel } from "../../../components/auth/AuthLeftPanel"
import { ForgotPasswordForm } from "../../../components/auth/ForgotPasswordForm"

export default function ForgotPasswordPage() {
    return (
        <AuthLayout
            maxWidth="md"
            leftPanelColor="yellow"
            leftPanel={<AuthLeftPanel title="Reset Your Password" subtitle="Quick Access Recovery" />}
        >
            <Suspense fallback={<div>Loading...</div>}>
                <ForgotPasswordForm />
            </Suspense>
        </AuthLayout>
    )
}
