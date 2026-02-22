// components/auth/ResetPasswordForm.tsx
"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { PasswordInput } from "../../components/common/forms/PasswordInput"
import { Button } from "../../components/common/ui/Button"
import { usePasswordRecovery } from "../../lib/hooks/auth"
import logger from "../../lib/logger"

export function ResetPasswordForm() {
    const { resetPassword, isLoading: isSubmitting } = usePasswordRecovery()
    const searchParams = useSearchParams()
    const resetToken = searchParams.get("token") || ""

    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
    })

    const handleSubmit = async () => {
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        await resetPassword({ token: resetToken, password: formData.password })
    }

    return (
        <>
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">RESET PASSWORD</h2>
                <p className="text-sm text-gray-600 font-semibold">ENTER YOUR NEW PASSWORD !!</p>
            </div>

            <div className="space-y-6">
                <PasswordInput
                    name="password"
                    placeholder="New Password (min. 6 characters)"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                />

                <PasswordInput
                    name="confirmPassword"
                    placeholder="Confirm New Password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                />

                <Button
                    onClick={handleSubmit}
                    isLoading={isSubmitting}
                    loadingText="Resetting..."
                    variant="owner"
                    fullWidth
                    rounded
                    className="mt-4"
                >
                    Reset Password
                </Button>
            </div>
        </>
    )
}
