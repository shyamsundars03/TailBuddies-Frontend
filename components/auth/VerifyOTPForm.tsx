// components/auth/VerifyOTPForm.tsx
"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Input } from "../../components/common/forms/Input"
import { Button } from "../../components/common/ui/Button"
import { useOtp } from "../../lib/hooks/auth"
import logger from "../../lib/logger"

export function VerifyOTPForm() {
    const { verify, isLoading: isSubmitting } = useOtp()
    const searchParams = useSearchParams()
    const email = searchParams.get("email") || ""

    const [otp, setOtp] = useState("")
    const [timer, setTimer] = useState(75)

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer((prev) => prev - 1)
            }, 1000)
            return () => clearInterval(interval)
        }
    }, [timer])

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }

    const handleVerify = async () => {
        logger.info('VerifyOTPForm: submitting', { email, otpLength: otp.length });
        await verify(email, otp)
    }

    return (
        <>
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">OTP</h2>
                <p className="text-sm text-gray-600 font-semibold">ENTER YOUR OTP !!</p>
            </div>

            <div className="space-y-6">
                <div className="text-center pt-2">
                    <p className="text-xs text-gray-600">Timer:</p>
                    <p className="text-2xl font-bold text-gray-900">{formatTime(timer)}</p>
                </div>

                <Input
                    type="text"
                    name="otp"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                />

                <Button
                    onClick={handleVerify}
                    isLoading={isSubmitting}
                    loadingText="Verifying..."
                    variant="owner"
                    fullWidth
                    rounded
                    className="mt-4"
                >
                    Verify OTP
                </Button>
            </div>
        </>
    )
}
