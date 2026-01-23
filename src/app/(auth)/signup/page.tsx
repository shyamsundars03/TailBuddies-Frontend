import { Suspense } from "react"
import { AuthLayout } from "../../../components/auth/AuthLayout"
import { AuthLeftPanel } from "../../../components/auth/AuthLeftPanel"
import { SignUpForm } from "../../../components/auth/SignupForm"

export default function SignupPage() {
  return (
    <AuthLayout
      maxWidth="xl"
      leftPanelColor="yellow"
      leftPanel={
        <AuthLeftPanel
          title="Join TailBuddies"
          subtitle="Connect with expert veterinarians or provide care as a professional"
        />
      }
    >
      <Suspense fallback={<div>Loading...</div>}>
        <SignUpForm />
      </Suspense>
    </AuthLayout>
  )
}
