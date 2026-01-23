import { Suspense } from "react"
import { AuthLayout } from "../../../components/auth/AuthLayout"
import { AuthLeftPanel } from "../../../components/auth/AuthLeftPanel"
// import { SignInForm } from "../../../components/auth/SignInForm"
import { SignInForm } from "../../../components/auth/SigninForm"

export default function SignInPage() {
  return (
    <AuthLayout
      maxWidth="lg"
      leftPanelColor="yellow"
      leftPanel={<AuthLeftPanel title="Pet Owner Portal" subtitle="Pet Parent Access" />}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <SignInForm />
      </Suspense>
    </AuthLayout>
  )
}
