// components/auth/ForgotPasswordForm.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { Input } from "../../components/common/forms/Input"
import { Button } from "../../components/common/ui/Button"
import { usePasswordRecovery } from "../../lib/hooks/auth"
import logger from "../../lib/logger"

export function ForgotPasswordForm() {
    const { forgotPassword, isLoading: isSubmitting } = usePasswordRecovery()
    const [email, setEmail] = useState("")

    const handleSubmit = async () => {
        await forgotPassword(email)
    }

    return (
        <>
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">RETRIEVE PASSWORD</h2>
                <p className="text-sm text-gray-600 font-semibold">ENTER EMAIL TO RETRIEVE !!</p>
            </div>

            <div className="space-y-6">
                <Input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <Button
                    onClick={handleSubmit}
                    isLoading={isSubmitting}
                    loadingText="Sending..."
                    variant="owner"
                    fullWidth
                    rounded
                    className="mt-4"
                >
                    Send Reset Link
                </Button>

                <div className="text-center pt-2">
                    <Link href="/signin" className="text-gray-900 font-semibold hover:text-yellow-600 text-sm">
                        ← Back to Sign In
                    </Link>
                </div>
            </div>
        </>
    )
}
