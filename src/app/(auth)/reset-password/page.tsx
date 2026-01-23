import { Suspense } from "react"
import { AuthLayout } from "../../../components/auth/AuthLayout"
import { AuthLeftPanel } from "../../../components/auth/AuthLeftPanel"
import { ResetPasswordForm } from "../../../components/auth/ResetPasswordForm"

export default function ResetPasswordPage() {
  return (
    <AuthLayout maxWidth="lg" leftPanelColor="yellow" leftPanel={<AuthLeftPanel />}>
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </AuthLayout>
  )
}
