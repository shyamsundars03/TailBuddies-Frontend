// components/auth/SignupForm.tsx
"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { Input } from "../../components/common/forms/Input"
import { PasswordInput } from "../../components/common/forms/PasswordInput"
import { RadioGroup } from "../../components/common/forms/RadioGroup"
import { RoleSelector } from "../../components/common/forms/RoleSelector"
import { Button } from "../../components/common/ui/Button"
import { GoogleLogin } from "@react-oauth/google"
import { signupSchema } from "../../lib/validation/auth/signup.schema"
import { useSignup, useSignin } from "../../lib/hooks/auth"
import logger from "../../lib/logger"

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
    const { handleSubmit: submitSignup } = useSignup()
    const { googleLogin } = useSignin()
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        gender: "Male" as "Male" | "Female" | "Other",
        role: "owner" as "owner" | "doctor",
        password: "",
        confirmPassword: "",
        phone: "",
    })

    const [errors, setErrors] = useState<Record<string, string>>({})
    const [touched, setTouched] = useState<Record<string, boolean>>({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

    const validateField = (name: string, value: string) => {
        const schemaData = {
            ...formData,
            [name]: value,
        }
        const result = signupSchema.safeParse(schemaData)
        if (!result.success) {
            const fieldError = result.error.format() as any
            const message = fieldError[name]?._errors?.[0]
            setErrors((prev) => ({ ...prev, [name]: message || "" }))
        } else {
            setErrors((prev) => {
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
        setIsSubmitting(true)
        logger.info('Signup form submission started', { email: formData.email });

        if (formData.password !== formData.confirmPassword) {
            setErrors((prev) => ({ ...prev, confirmPassword: "Passwords do not match" }))
            setTouched((prev) => ({ ...prev, confirmPassword: true }))
            setIsSubmitting(false)
            logger.warn('Signup failed: passwords do not match');
            return
        }

        const result = signupSchema.safeParse(formData)

        if (!result.success) {
            const fieldErrors: Record<string, string> = {}
            result.error.issues.forEach((issue) => {
                const key = issue.path[0] as string
                fieldErrors[key] = issue.message
            })
            setErrors(fieldErrors)
            setTouched({
                username: true,
                email: true,
                phone: true,
                password: true,
                confirmPassword: true,
            })
            setIsSubmitting(false)
            logger.warn('Signup failed: validation errors', fieldErrors);
            toast.error('Please fix the errors in the form');
            return
        }

        try {
            const signupResult = await submitSignup(formData)

            if (signupResult.success) {
                // Success is handled by the hook (redirect, toast)
                // We could add extra logic here if needed
            }
        } catch (error) {
            logger.error('Signup general error', error);
            toast.error("Failed. Please try again.");
        } finally {
            setIsSubmitting(false)
        }
    }

    const onGoogleSuccess = async (credentialResponse: any) => {
        if (credentialResponse.credential) {
            const result = await googleLogin(credentialResponse.credential, formData.role)
            if (result.success) {
                toast.success(`Welcome to TailBuddies!`);
            }
        }
    }

    const onGoogleError = () => {
        logger.error('Google Sign Up failed');
        toast.error("Google Sign Up was unsuccessful.");
    }

    return (
        <>
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">CREATE ACCOUNT</h2>
                <p className="text-sm text-gray-600 font-semibold">Register NOW !!</p>
            </div>

            <div className="space-y-4">
                <RoleSelector
                    options={roleOptions}
                    value={formData.role}
                    onChange={(value) => setFormData((prev) => ({ ...prev, role: value as any }))}
                />

                <Input
                    type="text"
                    name="username"
                    placeholder="Full Name"
                    value={formData.username}
                    onChange={handleChange}
                    onBlur={() => handleBlur("username")}
                    error={errors.username}
                    touched={touched.username}
                />

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

                <RadioGroup
                    name="gender"
                    label="Gender"
                    options={genderOptions}
                    value={formData.gender}
                    onChange={(value) => setFormData((prev) => ({ ...prev, gender: value as any }))}
                />

                <Input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number (10 digits)"
                    value={formData.phone}
                    maxLength={10}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    onChange={handleChange}
                    onBlur={() => handleBlur("phone")}
                    error={errors.phone}
                    touched={touched.phone}
                />

                <PasswordInput
                    name="password"
                    placeholder="Password (min. 6 characters)"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={() => handleBlur("password")}
                    error={errors.password}
                    touched={touched.password}
                />

                <PasswordInput
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={() => handleBlur("confirmPassword")}
                    error={errors.confirmPassword}
                    touched={touched.confirmPassword}
                />

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
