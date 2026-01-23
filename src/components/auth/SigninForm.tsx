"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Swal from "sweetalert2"
import { Input } from "../../components/common/forms/Input"
import { PasswordInput } from "../../components/common/forms/PasswordInput"
import { Button } from "../../components/common/ui/Button"
import { Badge } from "../../components/common/ui/Badge"
import { validateSignIn } from "../../lib/utils/validators/auth.validator"
import authService from "../../lib/services/authService"

export function SignInForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const urlRole = searchParams.get("role")

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: urlRole || "owner",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (urlRole && (urlRole === "owner" || urlRole === "doctor")) {
      setFormData((prev) => ({ ...prev, role: urlRole }))
    }
  }, [urlRole])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

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

    const validation = validateSignIn(formData)
    if (validation.errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: validation.errors[field] }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const validation = validateSignIn(formData)

    if (!validation.isValid) {
      setErrors(validation.errors)
      setTouched({
        email: true,
        password: true,
      })
      setIsSubmitting(false)
      return
    }

    try {
      const result = await authService.login(formData)

      if (result.success && result.data) {
        const user = result.data.user
        authService.saveUser(user)

        Swal.fire({
          title: "Success!",
          text: `Welcome back, ${user.role === "doctor" ? "Doctor" : ""} ${user.username}!`,
          icon: "success",
          confirmButtonText: "Go to Dashboard",
          confirmButtonColor: formData.role === "doctor" ? "#3b82f6" : "#fbbf24",
          timer: 2000,
          timerProgressBar: true,
        }).then(() => {
          if (user.role === "owner") {
            router.push("/owner/dashboard")
          } else if (user.role === "doctor") {
            router.push("/doctor/dashboard")
          }
        })
      } else {
        Swal.fire({
          title: "Error!",
          text: result.error || "Login failed. Please try again.",
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
        <h2 className="text-2xl font-bold text-gray-900 mb-1">
          {formData.role === "doctor" ? "DOCTOR SIGN IN" : "SIGN IN"}
        </h2>
        <p className="text-sm text-gray-600 font-semibold">
          {formData.role === "doctor" ? "VETERINARY ACCESS" : "ACCESS YOUR DASHBOARD"}
        </p>

        {/* Role indicator */}
        <div className="mt-2">
          <Badge variant={formData.role === "doctor" ? "doctor" : "owner"}>
            {formData.role === "doctor" ? "🩺 Doctor" : "🐾 Pet Owner"}
          </Badge>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Input */}
        <Input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          onBlur={() => handleBlur("email")}
          error={errors.email}
          touched={touched.email}
          required
        />

        {/* Password Input */}
        <PasswordInput
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          onBlur={() => handleBlur("password")}
          error={errors.password}
          touched={touched.password}
          required
        />

        {/* Submit Button */}
        <Button
          type="submit"
          isLoading={isSubmitting}
          loadingText="Signing In..."
          variant={formData.role === "doctor" ? "doctor" : "owner"}
          fullWidth
          rounded
          className="mt-4"
        >
          {formData.role === "doctor" ? "Doctor Sign In" : "Sign In"}
        </Button>

        {/* Links */}
        <div className="space-y-3">
          <div className="text-center">
            <p className="text-xs text-gray-600">
              Forgot Password?{" "}
              <Link href="/forgot-password" className="text-gray-900 font-semibold hover:text-yellow-600">
                Reset
              </Link>
            </p>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-600">
              Don't have an account?{" "}
              <Link href="/signup" className="text-gray-900 font-semibold hover:text-yellow-600">
                Sign Up
              </Link>
            </p>
          </div>

          {/* Switch role links */}
          <div className="text-center pt-2">
            {formData.role === "doctor" ? (
              <p className="text-xs text-gray-600">
                Are you a pet owner?{" "}
                <Link href="/signin" className="text-yellow-600 font-semibold hover:text-yellow-800">
                  Sign In as Owner
                </Link>
              </p>
            ) : (
              <p className="text-xs text-gray-600">
                Are you a doctor?{" "}
                <Link href="/signin?role=doctor" className="text-blue-600 font-semibold hover:text-blue-800">
                  Doctor Sign In
                </Link>
              </p>
            )}
          </div>
        </div>
      </form>
    </>
  )
}
