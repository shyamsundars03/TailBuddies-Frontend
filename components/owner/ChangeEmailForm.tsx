"use client"

import { useState } from "react"
import { Input } from "../common/forms/Input"
import { Button } from "../common/ui/Button"
import { userApi } from "../../lib/api/user"
import { toast } from "sonner"
import { useRouter, usePathname } from "next/navigation"
import { useAppDispatch, useAppSelector } from "../../lib/redux/hooks"
import { setUser } from "../../lib/redux/slices/authSlice"

type Step = "CURRENT_EMAIL" | "NEW_EMAIL"

export function ChangeEmailForm() {
    const [step, setStep] = useState<Step>("CURRENT_EMAIL")
    const [otp, setOtp] = useState("")
    const [newEmail, setNewEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isOtpSent, setIsOtpSent] = useState(false)

    const { user } = useAppSelector(state => state.auth)
    const dispatch = useAppDispatch()
    const router = useRouter()

    const handleSendCurrentOtp = async () => {
        try {
            setIsLoading(true)
            const response = await userApi.initiateEmailChange()
            if (response.success) {
                setIsOtpSent(true)
                toast.success("OTP sent to your current email")
            } else {
                toast.error(response.error || "Failed to send OTP")
            }
        } catch {
            toast.error("An error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    const handleVerifyCurrentOtp = async () => {
        try {
            setIsLoading(true)
            const response = await userApi.verifyCurrentEmail(otp)
            if (response.success) {
                setStep("NEW_EMAIL")
                setIsOtpSent(false)
                setOtp("")
                toast.success("Current email verified")
            } else {
                toast.error(response.error || "Invalid OTP")
            }
        } catch {
            toast.error("An error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    const handleSendNewOtp = async () => {
        if (!newEmail || !newEmail.includes("@")) {
            return toast.error("Please enter a valid email")
        }
        try {
            setIsLoading(true)
            const response = await userApi.sendOtpToNewEmail(newEmail)
            if (response.success) {
                setIsOtpSent(true)
                toast.success("OTP sent to your new email")
            } else {
                toast.error(response.error || "Failed to send OTP")
            }
        } catch {
            toast.error("An error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    const handleVerifyNewOtp = async () => {
        try {
            setIsLoading(true)
            const response = await userApi.verifyNewEmail(newEmail, otp)
            if (response.success) {
                const apiUser = response.data;
                const updatedUser = {
                    id: apiUser.id || apiUser._id,
                    email: apiUser.email,
                    role: apiUser.role,
                    username: apiUser.username,
                    phone: apiUser.phone,
                    gender: apiUser.gender,
                    profilePic: apiUser.profilePic
                };
                dispatch(setUser(updatedUser));
                localStorage.setItem('user', JSON.stringify(updatedUser));
                toast.success("Email updated successfully");
                router.push(isDoctor ? "/doctor/profile" : "/owner/account");
            } else {
                toast.error(response.error || "Invalid OTP")
            }
        } catch {
            toast.error("An error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    const pathname = usePathname()
    const isDoctor = pathname.startsWith("/doctor")
    const variant = isDoctor ? "doctor" : "owner"

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
