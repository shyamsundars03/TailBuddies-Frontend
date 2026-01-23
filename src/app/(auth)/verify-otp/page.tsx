import { Suspense } from "react"
import { AuthLayout } from "../../../components/auth/AuthLayout"
import { AuthLeftPanel } from "../../../components/auth/AuthLeftPanel"
import { VerifyOTPForm } from "../../../components/auth/VerifyOTPForm"

export default function VerifyOTPPage() {
  return (
    <AuthLayout maxWidth="lg" leftPanelColor="yellow" leftPanel={<AuthLeftPanel />}>
      <Suspense fallback={<div>Loading...</div>}>
        <VerifyOTPForm />
      </Suspense>
    </AuthLayout>
  )
}
