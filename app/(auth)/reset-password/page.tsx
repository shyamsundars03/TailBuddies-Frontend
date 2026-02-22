// app/(auth)/reset-password/page.tsx
import { Suspense } from "react"
import { AuthLayout } from "../../../components/auth/AuthLayout"
import { AuthLeftPanel } from "../../../components/auth/AuthLeftPanel"
import { ResetPasswordForm } from "../../../components/auth/ResetPasswordForm"

export default function ResetPasswordPage() {
    return (
        <AuthLayout
            maxWidth="md"
            leftPanelColor="yellow"
            leftPanel={<AuthLeftPanel title="New Password" subtitle="Secure Your Account" />}
        >
            <Suspense fallback={<div>Loading...</div>}>
                <ResetPasswordForm />
            </Suspense>
        </AuthLayout>
    )
}
