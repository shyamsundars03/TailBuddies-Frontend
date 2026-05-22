
"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Input } from "../../components/common/forms/Input"
import { Button } from "../../components/common/ui/Button"
import { useOtp, getOtpTimeRemaining, setOtpTimer } from "../../lib/hooks/auth/useOtp"
import { toast } from "sonner"
import { AUTH_ROUTES } from "../../lib/constants/routes";

const OTP_DURATION = Number(process.env.NEXT_PUBLIC_OTP_DURATION) || 75

export function VerifyOTPForm() {
    const searchParams = useSearchParams()
    const role = searchParams.get("role") || "owner"
    const variant = role === "doctor" ? "doctor" : "owner"

    const { verify, resend, verifyAction, isLoading: isSubmitting, errors } = useOtp()
    const router = useRouter()
    const email = searchParams.get("email") || ""

    const [otp, setOtp] = useState("")
    const [otpTouched, setOtpTouched] = useState(false)
    const [isValidated, setIsValidated] = useState(false)
    const [timer, setTimer] = useState(() => {
        if (typeof window === 'undefined' || !email) return 0;
        const remaining = getOtpTimeRemaining(email);
        if (remaining <= 0) {
            setOtpTimer(email);
            return OTP_DURATION;
        }
        return remaining;
    });
    const [isResending, setIsResending] = useState(false)

    useEffect(() => {
        if (email && !isValidated) {
            const canVerify = verifyAction(email);
            if (!canVerify) {
                toast.error('Session expired. Please sign up again.');
                router.push(AUTH_ROUTES.SIGNUP);
            }
        }
    }, [email, verifyAction, router, isValidated])

    const isTimerActive = timer > 0;

    useEffect(() => {
        if (!isTimerActive) return;
        const intervalId = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(intervalId);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(intervalId);
    }, [isTimerActive])

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }

    const handleVerify = async () => {
        if (timer <= 0) {
            toast.error("OTP expired. Please click Resend OTP.")
            return
        }
        setOtpTouched(true)
        if (otp.length !== 6) {
            toast.error("OTP must be exactly 6 digits")
            return
        }
        const result = await verify(email, otp);
        if (result?.success) {
            setIsValidated(true)
            if (result.purpose === 'reset') {
                toast.success('OTP verified! Please set your new password.');
                router.push(`${AUTH_ROUTES.RESET_PASSWORD}?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}&role=${role}`);
            }
        }
    }

    const handleResend = async () => {
        setIsResending(true)
        const result = await resend(email)
        if (result.success) {
            setTimer(OTP_DURATION)
            setOtp("")
        }
        setIsResending(false)
    }

    return (
        <>
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">OTP</h2>
                <p className="text-sm text-gray-600 font-semibold">ENTER YOUR OTP !!</p>
            </div>

            <div className="space-y-6">
                {/* Timer */}
                <div className="text-center pt-2">
                    <p className="text-xs text-gray-600">Timer:</p>
                    <p className={`text-2xl font-bold ${timer > 0 ? 'text-gray-900' : 'text-red-600'}`}>
                        {timer > 0 ? formatTime(timer) : "Expired"}
                    </p>
                </div>

                {/* OTP Input */}
                <Input
                    type="text"
                    name="otp"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    onBlur={() => setOtpTouched(true)}
                    maxLength={6}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    error={errors.otp}
                    touched={otpTouched}
                />

                {/* Verify OTP Button */}
                <Button
                    type="button"
                    onClick={handleVerify}
                    isLoading={isSubmitting}
                    loadingText="Verifying..."
                    variant={variant}
                    fullWidth
                    rounded
                    className="mt-4"
                >
                    Verify OTP
                </Button>

                {/* OR Separator */}
                <div className="text-center pt-2">
                    <p className="text-xs text-gray-600">OR</p>
                </div>

                {/* Resend OTP Button */}
                <Button
                    onClick={handleResend}
                    isLoading={isResending}
                    loadingText="Resending..."
                    variant={variant}
                    fullWidth
                    rounded
                    disabled={timer > 0}
                >
                    Resend OTP {timer > 0 && `(${formatTime(timer)})`}
                </Button>
            </div>
        </>
    )
}
