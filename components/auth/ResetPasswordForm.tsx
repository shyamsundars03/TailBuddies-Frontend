
"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { PasswordInput } from "../../components/common/forms/PasswordInput"
import { Button } from "../../components/common/ui/Button"
import { resetPasswordSchema, type ResetPasswordFormData } from "../../lib/validation/auth"
import { usePasswordRecovery } from "../../lib/hooks/auth"

export function ResetPasswordForm() {
    const searchParams = useSearchParams()
    const role = searchParams.get("role") || "owner"
    const variant = role === "doctor" ? "doctor" : "owner"

    const { resetPassword, isLoading: isSubmitting, errors: hookErrors } = usePasswordRecovery()
    const email = searchParams.get("email") || ""
    const otp = searchParams.get("otp") || ""

    const [formData, setFormData] = useState<Pick<ResetPasswordFormData, 'password' | 'confirmPassword'>>({
        password: "",
        confirmPassword: "",
    })

    const [localErrors, setLocalErrors] = useState<Record<string, string>>({})
    const [touched, setTouched] = useState<Record<string, boolean>>({})

    const allErrors = { ...localErrors, ...hookErrors }

    const validateField = (name: string, value: string) => {
        const schemaData = { ...formData, [name]: value, email, otp }
        const result = resetPasswordSchema.safeParse(schemaData)

        if (!result.success) {
            const fieldError = result.error.flatten().fieldErrors as Record<string, string[]>
            const message = fieldError[name]?.[0]
            setLocalErrors((prev) => ({ ...prev, [name]: message || "" }))
        } else {
            setLocalErrors((prev) => {
                const newErrors = { ...prev }
                delete newErrors[name]
                return newErrors
            })
        }
    }

    const handleBlur = (field: string) => {
        setTouched((prev) => ({ ...prev, [field]: true }))
        validateField(field, formData[field as keyof typeof formData])
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
        if (touched[name]) {
            validateField(name, value)
        }
    }

    const handleSubmit = async () => {
        setTouched({ password: true, confirmPassword: true })
        await resetPassword({ ...formData, email, otp })
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
                    placeholder="New Password (min. 8 characters)"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={() => handleBlur("password")}
                    error={allErrors.password}
                    touched={touched.password}
                />

                <PasswordInput
                    name="confirmPassword"
                    placeholder="Confirm New Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={() => handleBlur("confirmPassword")}
                    error={allErrors.confirmPassword}
                    touched={touched.confirmPassword}
                />

                <Button
                    onClick={handleSubmit}
                    isLoading={isSubmitting}
                    loadingText="Resetting..."
                    variant={variant}
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
