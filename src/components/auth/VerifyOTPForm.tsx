"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Swal from "sweetalert2"
import { Input } from "../../components/common/forms/Input"
import { Button } from "../../components/common/ui/Button"
import { validateOTP } from "../../lib/utils/validators/auth.validator"
import authService from "../../lib/services/authService"

export function VerifyOTPForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""

  const [otp, setOtp] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isResending, setIsResending] = useState(false)
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
    setIsSubmitting(true)
    setTouched({ otp: true })

    const validation = validateOTP(otp)

    if (!validation.isValid) {
      setErrors(validation.errors)
      setIsSubmitting(false)
      return
    }

    try {
      const result = await authService.verifyOTP(email, otp)

      if (result.success) {
        Swal.fire({
          title: "OTP Verified!",
          text: "Please set your new password.",
          icon: "success",
          confirmButtonText: "Continue",
          confirmButtonColor: "#fbbf24",
        }).then(() => {
          router.push(`/auth/reset-password?token=${result.resetToken}`)
        })
      } else {
        Swal.fire({
          title: "Error!",
          text: result.error || "Invalid OTP.",
          icon: "error",
          confirmButtonText: "OK",
        })
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "An error occurred. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResend = async () => {
    setIsResending(true)

    try {
      const result = await authService.forgotPassword(email)

      if (result.success) {
        setTimer(75)
        Swal.fire({
          title: "OTP Resent!",
          text: "Please check your email for the new OTP.",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#fbbf24",
        })
      } else {
        Swal.fire({
          title: "Error!",
          text: result.error || "Failed to resend OTP.",
          icon: "error",
          confirmButtonText: "OK",
        })
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "An error occurred. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      })
    } finally {
      setIsResending(false)
    }
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
          <p className="text-2xl font-bold text-gray-900">{formatTime(timer)}</p>
        </div>

        {/* OTP Input */}
        <Input
          type="text"
          name="otp"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => {
            setOtp(e.target.value)
            if (errors.otp) setErrors({})
          }}
          onBlur={() => setTouched({ otp: true })}
          error={errors.otp}
          touched={touched.otp}
          maxLength={6}
        />

        {/* Verify OTP Button */}
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

        {/* OR Separator */}
        <div className="text-center pt-2">
          <p className="text-xs text-gray-600">OR</p>
        </div>

        {/* Resend OTP Button */}
        <Button
          onClick={handleResend}
          isLoading={isResending}
          loadingText="Resending..."
          variant="owner"
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
