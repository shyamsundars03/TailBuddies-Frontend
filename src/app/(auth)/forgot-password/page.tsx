import { Suspense } from "react"
// import { AuthLayout } from "../../../../components/auth/AuthLayout"
import { AuthLayout } from "../../../components/auth/AuthLayout"
import { AuthLeftPanel } from "../../../components/auth/AuthLeftPanel"
// import { ForgotPasswordForm } from "../../../components/auth/ForgotPasswordForm"
import { ForgotPasswordForm } from "../../../components/auth/ForgetPasswordForm"

export default function ForgotPasswordPage() {
  return (
    <AuthLayout maxWidth="lg" leftPanelColor="yellow" leftPanel={<AuthLeftPanel />}>
      <Suspense fallback={<div>Loading...</div>}>
        <ForgotPasswordForm />
      </Suspense>
    </AuthLayout>
  )
}
