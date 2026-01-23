"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Swal from "sweetalert2"
import { Input } from "../../components/common/forms/Input"
import { Button } from "../../components/common/ui/Button"
import { validateForgotPassword } from "../../lib/utils/validators/auth.validator"
import authService from "../../lib/services/authService"

export function ForgotPasswordForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setTouched({ email: true })

    const validation = validateForgotPassword(email)

    if (!validation.isValid) {
      setErrors(validation.errors)
      setIsSubmitting(false)
      return
    }

    try {
      const result = await authService.forgotPassword(email)

      if (result.success) {
        Swal.fire({
          title: "Email Sent!",
          text: "Please check your email for the OTP.",
          icon: "success",
          confirmButtonText: "Continue",
          confirmButtonColor: "#fbbf24",
        }).then(() => {
          router.push(`/auth/verify-otp?email=${encodeURIComponent(email)}`)
        })
      } else {
        Swal.fire({
          title: "Error!",
          text: result.error || "Failed to send reset link.",
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

  return (
    <>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">RETRIEVE PASSWORD</h2>
        <p className="text-sm text-gray-600 font-semibold">ENTER EMAIL TO RETRIEVE !!</p>
      </div>

      <div className="space-y-6">
        {/* Email Input */}
        <Input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (errors.email) setErrors({})
          }}
          onBlur={() => setTouched({ email: true })}
          error={errors.email}
          touched={touched.email}
        />

        {/* Submit Button */}
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

        {/* Back to Sign In */}
        <div className="text-center pt-2">
          <Link href="/signin" className="text-gray-900 font-semibold hover:text-yellow-600 text-sm">
            ← Back to Sign In
          </Link>
        </div>
      </div>
    </>
  )
}
