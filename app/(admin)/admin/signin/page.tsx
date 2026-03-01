
import { Suspense } from "react"
import { AdminLoginForm } from "../../../../components/auth/AdminLoginForm"

export default function AdminSignInPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AdminLoginForm />
        </Suspense>
    )
}
