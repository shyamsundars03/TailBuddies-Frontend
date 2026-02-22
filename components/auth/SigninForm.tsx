// components/auth/SigninForm.tsx
"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { Input } from "../../components/common/forms/Input"
import { PasswordInput } from "../../components/common/forms/PasswordInput"
import { Button } from "../../components/common/ui/Button"
import { Badge } from "../../components/common/ui/Badge"
import { GoogleLogin } from "@react-oauth/google"
import { useSignin } from "../../lib/hooks/auth"
import { signinSchema } from "../../lib/validation/auth/signin.schema"
import logger from "../../lib/logger"

export function SignInForm() {
  const searchParams = useSearchParams()
  const { login, googleLogin, isLoading, errors: hookErrors, setErrors: setHookErrors } = useSignin()

  const urlRole = searchParams.get("role")

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: (urlRole || "owner") as "owner" | "doctor",
  })

  const [errors, setLocalErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  // Merge local errors and hook errors
  const allErrors = { ...errors, ...hookErrors };

  useEffect(() => {
    if (urlRole && (urlRole === "owner" || urlRole === "doctor")) {
      setFormData((prev) => ({ ...prev, role: urlRole as any }))
    }
  }, [urlRole])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear local error
    if (errors[name]) {
      setLocalErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }

    // Clear hook error
    if (hookErrors[name]) {
      setHookErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateField = (name: string, value: string) => {
    const schemaData = {
      ...formData,
      [name]: value,
    }
    const result = signinSchema.safeParse(schemaData)
    if (!result.success) {
      const fieldError = result.error.flatten().fieldErrors as Record<string, string[]>
      const message = fieldError[name]?.[0]
      setLocalErrors((prev) => ({ ...prev, [name]: message || "" }))
    } else {
      setLocalErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    validateField(field, (formData as any)[field])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    logger.info('Signin form submission started', { email: formData.email });

    // Mark all fields as touched to show validation errors
    setTouched({
      email: true,
      password: true,
    })

    try {
      const loginResult = await login({
        email: formData.email,
        password: formData.password,
        role: formData.role,
      })

      if (loginResult?.success) {
        logger.info('Login success, redirecting...', { email: formData.email });
      } else if (!loginResult?.success && !loginResult?.error) {
        // Validation handled by hook, but we should make sure local errors reflect it if needed
        toast.error("Please fix the validation errors");
      }
    } catch (error) {
      logger.error('Signin submit error', error);
      toast.error("An error occurred. Please try again.");
    }
  }

  const onGoogleSuccess = async (credentialResponse: any) => {
    if (credentialResponse.credential) {
      await googleLogin(credentialResponse.credential, formData.role)
    }
  }

  const onGoogleError = () => {
    logger.error('Google Sign In failed');
    toast.error("Google Sign In was unsuccessful.");
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

        <div className="mt-2">
          <Badge variant={formData.role === "doctor" ? "doctor" : "owner"}>
            {formData.role === "doctor" ? "🩺 Doctor" : "🐾 Pet Owner"}
          </Badge>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          onBlur={() => handleBlur("email")}
          error={allErrors.email}
          touched={touched.email}

        />

        <PasswordInput
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          onBlur={() => handleBlur("password")}
          error={allErrors.password}
          touched={touched.password}

        />

        <Button
          type="submit"
          isLoading={isLoading}
          loadingText="Signing In..."
          variant={formData.role === "doctor" ? "doctor" : "owner"}
          fullWidth
          rounded
          className="mt-4"
        >
          {formData.role === "doctor" ? "Doctor Sign In" : "Sign In"}
        </Button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-300"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500 font-semibold">Or continue with</span>
          </div>
        </div>

        <div className="flex justify-center">
          <GoogleLogin onSuccess={onGoogleSuccess} onError={onGoogleError} />
        </div>

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
