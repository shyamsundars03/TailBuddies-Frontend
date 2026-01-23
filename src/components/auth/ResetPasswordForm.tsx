"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Swal from "sweetalert2"
import { PasswordInput } from "../../components/common/forms/PasswordInput"
import { Button } from "../../components/common/ui/Button"
import { validateResetPassword } from "../../lib/utils/validators/auth.validator"
import authService from "../../lib/services/authService"

export function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const resetToken = searchParams.get("token") || ""

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setTouched({ password: true, confirmPassword: true })

    const validation = validateResetPassword(formData.password, formData.confirmPassword)

    if (!validation.isValid) {
      setErrors(validation.errors)
      setIsSubmitting(false)
      return
    }

    try {
      const result = await authService.resetPassword(resetToken, formData.password)

      if (result.success) {
        Swal.fire({
          title: "Password Reset!",
          text: "Your password has been reset successfully.",
          icon: "success",
          confirmButtonText: "Go to Sign In",
          confirmButtonColor: "#fbbf24",
        }).then(() => {
          router.push("/auth/signin")
        })
      } else {
        Swal.fire({
          title: "Error!",
          text: result.error || "Failed to reset password.",
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
        <h2 className="text-2xl font-bold text-gray-900 mb-1">RESET PASSWORD</h2>
        <p className="text-sm text-gray-600 font-semibold">ENTER YOUR NEW PASSWORD !!</p>
      </div>

      <div className="space-y-6">
        {/* New Password Input */}
        <PasswordInput
          name="password"
          placeholder="New Password (min. 6 characters)"
          value={formData.password}
          onChange={handleChange}
          onBlur={() => handleBlur("password")}
          error={errors.password}
          touched={touched.password}
        />

        {/* Confirm Password Input */}
        <PasswordInput
          name="confirmPassword"
          placeholder="Confirm New Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          onBlur={() => handleBlur("confirmPassword")}
          error={errors.confirmPassword}
          touched={touched.confirmPassword}
        />

        {/* Submit Button */}
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
