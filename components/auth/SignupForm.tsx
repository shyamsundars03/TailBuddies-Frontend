
"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { Input } from "../../components/common/forms/Input"
import { PasswordInput } from "../../components/common/forms/PasswordInput"
import { RadioGroup } from "../../components/common/forms/RadioGroup"
import { RoleSelector } from "../../components/common/forms/RoleSelector"
import { Button } from "../../components/common/ui/Button"
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google"
import { useSearchParams } from "next/navigation"
import { signupSchema, type SignupFormData } from "../../lib/validation/auth"
import { useSignup, useSignin } from "../../lib/hooks/auth"
import { AUTH_ROUTES } from "../../lib/constants/routes"

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
    const searchParams = useSearchParams()
    const urlRole = searchParams.get("role")
    const { handleSubmit: submitHookForm, isLoading: hookLoading, errors: hookErrors } = useSignup()
    const { googleLogin } = useSignin()

    const [formData, setFormData] = useState<SignupFormData>({
        username: "",
        email: "",
        gender: "Male" as "Male" | "Female",
        role: (urlRole === "doctor" ? "doctor" : "owner") as "owner" | "doctor",
        password: "",
        confirmPassword: "",
        phone: "",
    })

    const [localErrors, setLocalErrors] = useState<Record<string, string>>({})
    const [touched, setTouched] = useState<Record<string, boolean>>({})

    const allErrors = { ...localErrors, ...hookErrors }

    useEffect(() => {
        const targetRole = urlRole === "doctor" ? "doctor" : "owner";
        setFormData((prev) => (prev.role === targetRole ? prev : { ...prev, role: targetRole }));
    }, [urlRole]);

    const validateField = (name: string, value: string) => {
        const schemaData = { ...formData, [name]: value }
        const result = signupSchema.safeParse(schemaData)

        if (!result.success) {
            const fieldErrors = result.error.flatten().fieldErrors as Record<string, string[]>
            const message = fieldErrors[name]?.[0]
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
        validateField(field, formData[field as keyof SignupFormData] as string)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
        if (touched[name]) {
            validateField(name, value)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setTouched({
            username: true,
            email: true,
            phone: true,
            password: true,
            confirmPassword: true,
        })
        await submitHookForm(formData)
    }

    const onGoogleSuccess = async (credentialResponse: CredentialResponse) => {
        if (credentialResponse.credential) {
            await googleLogin({ idToken: credentialResponse.credential, role: formData.role })
        }
    }

    const onGoogleError = () => {
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
                    onChange={(value) => setFormData((prev) => ({ ...prev, role: value as "owner" | "doctor" }))}
                />

                <Input
                    type="text"
                    name="username"
                    placeholder="Full Name"
                    value={formData.username}
                    onChange={handleChange}
                    onBlur={() => handleBlur("username")}
                    error={allErrors.username}
                    touched={touched.username}
                />

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

                <RadioGroup
                    name="gender"
                    label="Gender"
                    options={genderOptions}
                    value={formData.gender}
                    onChange={(value) => setFormData((prev) => ({ ...prev, gender: value as "Male" | "Female" }))}
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
                    error={allErrors.phone}
                    touched={touched.phone}
                />

                <PasswordInput
                    name="password"
                    placeholder="Password (min. 8 characters)"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={() => handleBlur("password")}
                    error={allErrors.password}
                    touched={touched.password}
                />

                <PasswordInput
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={() => handleBlur("confirmPassword")}
                    error={allErrors.confirmPassword}
                    touched={touched.confirmPassword}
                />

                <Button
                    onClick={handleSubmit}
                    isLoading={hookLoading}
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
                        <Link href={AUTH_ROUTES.SIGNIN} className="text-gray-900 font-semibold hover:text-yellow-600">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </>
    )
}
