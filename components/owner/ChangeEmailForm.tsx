"use client"

import { useState } from "react"
import { Input } from "../common/forms/Input"
import { Button } from "../common/ui/Button"
import { useOwnerProfile } from "../../lib/hooks/owner/useOwnerProfile"
import { changeEmailSchema } from "../../lib/validation/owner/change-email.schema"
import { toast } from "sonner"
import { useRouter, usePathname } from "next/navigation"

type Step = "CURRENT_EMAIL" | "NEW_EMAIL"

export function ChangeEmailForm() {
    const [step, setStep] = useState<Step>("CURRENT_EMAIL")
    const [otp, setOtp] = useState("")
    const [newEmail, setNewEmail] = useState("")
    const [isOtpSent, setIsOtpSent] = useState(false)

    const { user, isLoading, initiateEmailChange, verifyCurrentEmail, sendOtpToNewEmail, verifyNewEmail } = useOwnerProfile()
    const router = useRouter()
    const pathname = usePathname()
    const isDoctor = pathname.startsWith("/doctor")
    const variant = isDoctor ? "doctor" : "owner"

    const handleSendCurrentOtp = async () => {
        const success = await initiateEmailChange()
        if (success) {
            setIsOtpSent(true)
        }
    }

    const handleVerifyCurrentOtp = async () => {
        const success = await verifyCurrentEmail(otp)
        if (success) {
            setStep("NEW_EMAIL")
            setIsOtpSent(false)
            setOtp("")
        }
    }

    const handleSendNewOtp = async () => {
        const validationResult = changeEmailSchema.safeParse({ email: newEmail })
        if (!validationResult.success) {
            return toast.error(validationResult.error.issues[0].message)
        }

        const success = await sendOtpToNewEmail(newEmail)
        if (success) {
            setIsOtpSent(true)
        }
    }

    const handleVerifyNewOtp = async () => {
        const updatedUser = await verifyNewEmail(newEmail, otp)
        if (updatedUser) {
            router.push(isDoctor ? "/doctor/profile" : "/owner/account")
        }
    }

    return (
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Change Email</h2>

            {step === "CURRENT_EMAIL" ? (
                <div className="space-y-6">
                    <p className="text-gray-600 text-center">First, we need to verify your current email: <strong>{user?.email}</strong></p>
                    {!isOtpSent ? (
                        <Button onClick={handleSendCurrentOtp} variant={variant} className="w-full" disabled={isLoading}>
                            {isLoading ? "Sending..." : "Send OTP to Current Email"}
                        </Button>
                    ) : (
                        <div className="space-y-4">
                            <Input
                                label="Enter OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="6-digit code"
                            />
                            <Button onClick={handleVerifyCurrentOtp} variant={variant} className="w-full" disabled={isLoading || otp.length < 6}>
                                {isLoading ? "Verifying..." : "Verify OTP"}
                            </Button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="space-y-6">
                    <p className="text-gray-600 text-center">Now, enter your new email address.</p>
                    {!isOtpSent ? (
                        <div className="space-y-4">
                            <Input
                                label="New Email"
                                type="email"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                placeholder="new-email@example.com"
                            />
                            <Button onClick={handleSendNewOtp} variant={variant} className="w-full" disabled={isLoading}>
                                {isLoading ? "Sending..." : "Send OTP to New Email"}
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <p className="text-sm text-center text-blue-600">Verifying: {newEmail}</p>
                            <Input
                                label="Enter OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="6-digit code"
                            />
                            <Button onClick={handleVerifyNewOtp} variant={variant} className="w-full" disabled={isLoading || otp.length < 6}>
                                {isLoading ? "Confirm Email Change" : "Confirm Email Change"}
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

