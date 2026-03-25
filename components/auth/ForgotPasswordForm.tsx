
"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Input } from "../../components/common/forms/Input"
import { Button } from "../../components/common/ui/Button"
import { usePasswordRecovery } from "../../lib/hooks/auth"
import { toast } from "sonner"


export function ForgotPasswordForm() {
    const searchParams = useSearchParams()
    const role = searchParams.get("role") || "owner"
    const variant = role === "doctor" ? "doctor" : "owner"



    const { forgotPassword, isLoading: isSubmitting } = usePasswordRecovery()
    const [email, setEmail] = useState("")
    const [emailError, setEmailError] = useState("")
    const [isTouched, setIsTouched] = useState(false)

    const validateEmail = (val: string) => {
        if (!val) return "Please enter your email"
        const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/
        if (!gmailRegex.test(val)) return "Please enter a valid Gmail address (@gmail.com)"
        return ""
    }

    const handleEmailChange = (val: string) => {
        setEmail(val)
        if (isTouched) {
            setEmailError(validateEmail(val))
        }
    }

    const handleBlur = () => {
        setIsTouched(true)
        setEmailError(validateEmail(email))
    }

    const handleSubmit = async () => {
        const error = validateEmail(email)
        if (error) {
            setEmailError(error)
            setIsTouched(true)
            return
        }

        try {
            await forgotPassword(email)
        } catch (error: any) {
            toast.error(error.message || "Failed to send reset OTP")
        }
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
                    onChange={(e) => handleEmailChange(e.target.value)}
                    onBlur={handleBlur}
                    error={emailError}
                    touched={isTouched}
                />

                <Button
                    onClick={handleSubmit}
                    isLoading={isSubmitting}
                    loadingText="Sending..."
                    variant={variant}
                    fullWidth
                    rounded
                    className="mt-4"
                >
                    Send Reset OTP
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
