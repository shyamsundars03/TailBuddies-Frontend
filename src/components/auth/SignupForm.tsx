"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Swal from "sweetalert2"
import { Input } from "../../components/common/forms/Input"
import { PasswordInput } from "../../components/common/forms/PasswordInput"
import { RadioGroup } from "../../components/common/forms/RadioGroup"
import { RoleSelector } from "../../components/common/forms/RoleSelector"
import { Button } from "../../components/common/ui/Button"
import { validateSignUp } from "../../lib/utils/validators/auth.validator"
import authService from "../../lib/services/authService"

const roleOptions = [
  {
    value: "owner",
    label: "Pet Owner",
    description: "For pet parents",
    icon: "🐾",
    activeColor: "bg-yellow-100",
    ringColor: "ring-yellow-400",
  },
  {
    value: "doctor",
    label: "Veterinarian",
    description: "For doctors",
    icon: "🩺",
    activeColor: "bg-blue-100",
    ringColor: "ring-blue-400",
  },
]

const genderOptions = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
]

export function SignUpForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    gender: "Male",
    role: "owner",
    password: "",
    confirmPassword: "",
    phone: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

    const validation = validateSignUp(formData)
    if (validation.errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: validation.errors[field] }))
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    const validation = validateSignUp(formData)

    if (!validation.isValid) {
      setErrors(validation.errors)
      setTouched({
        name: true,
        email: true,
        phone: true,
        password: true,
        confirmPassword: true,
      })
      setIsSubmitting(false)
      return
    }

    try {
      const result = await authService.signup({
        username: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
        gender: formData.gender,
      })

      if (result.success) {
        Swal.fire({
          title: "Success!",
          text: "Account created successfully! Please sign in.",
          icon: "success",
          confirmButtonText: "Go to Sign In",
          confirmButtonColor: "#fbbf24",
        }).then((result) => {
          if (result.isConfirmed) {
            router.push("/signin")
          }
        })
      } else {
        Swal.fire({
          title: "Error!",
          text: result.error || "Failed to create account. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        })
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed. Please try again.",
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
        <h2 className="text-2xl font-bold text-gray-900 mb-1">CREATE ACCOUNT</h2>
        <p className="text-sm text-gray-600 font-semibold">Register NOW !!</p>
      </div>

      <div className="space-y-4">
        {/* Role Selection */}
        <RoleSelector
          options={roleOptions}
          value={formData.role}
          onChange={(value) => setFormData((prev) => ({ ...prev, role: value }))}
        />

        {/* Name Input */}
        <Input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          onBlur={() => handleBlur("name")}
          error={errors.name}
          touched={touched.name}
        />

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
        />

        {/* Gender Selection */}
        <RadioGroup
          name="gender"
          label="Gender"
          options={genderOptions}
          value={formData.gender}
          onChange={(value) => setFormData((prev) => ({ ...prev, gender: value }))}
        />

        {/* Phone Input */}
        <Input
          type="tel"
          name="phone"
          placeholder="Phone Number (10 digits)"
          value={formData.phone}
          onChange={handleChange}
          onBlur={() => handleBlur("phone")}
          error={errors.phone}
          touched={touched.phone}
        />

        {/* Password Input */}
        <PasswordInput
          name="password"
          placeholder="Password (min. 6 characters)"
          value={formData.password}
          onChange={handleChange}
          onBlur={() => handleBlur("password")}
          error={errors.password}
          touched={touched.password}
        />

        {/* Confirm Password Input */}
        <PasswordInput
          name="confirmPassword"
          placeholder="Confirm Password"
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
          loadingText="Creating Account..."
          variant={formData.role === "doctor" ? "doctor" : "owner"}
          fullWidth
          rounded
          className="mt-4"
        >
          Sign Up as {formData.role === "doctor" ? "Doctor" : "Pet Owner"}
        </Button>

        {/* Sign In Link */}
        <div className="text-center pt-2">
          <p className="text-xs text-gray-600">
            Already have an account?{" "}
            <Link href="/signin" className="text-gray-900 font-semibold hover:text-yellow-600">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}
