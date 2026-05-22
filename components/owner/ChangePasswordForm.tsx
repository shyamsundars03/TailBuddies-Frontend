"use client"

import { useState } from "react"
import { PasswordInput } from "../common/forms/PasswordInput"
import { Button } from "../common/ui/Button"
import { useOwnerProfile } from "../../lib/hooks/owner/useOwnerProfile"
import { changePasswordSchema } from "../../lib/validation/owner/change-password.schema"
import { toast } from "sonner"
import { usePathname, useRouter } from "next/navigation"

export function ChangePasswordForm() {
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    })
    const { isLoading, changePassword } = useOwnerProfile()
    const router = useRouter()
    const pathname = usePathname()
    const isDoctor = pathname.startsWith("/doctor")
    const variant = isDoctor ? "doctor" : "owner"

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        const validationResult = changePasswordSchema.safeParse(formData)
        if (!validationResult.success) {
            return toast.error(validationResult.error.issues[0].message)
        }

        const success = await changePassword({
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword,
        })

        if (success) {
            const redirectPath = isDoctor ? "/doctor/profile" : "/owner/account"
            router.push(redirectPath)
        }
    }

    return (
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Change Password</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <PasswordInput
                     label="Current Password"
                     name="currentPassword"
                     value={formData.currentPassword}
                     onChange={handleChange}
                     required
                />
                <PasswordInput
                     label="New Password"
                     name="newPassword"
                     value={formData.newPassword}
                     onChange={handleChange}
                     required
                />
                <PasswordInput
                     label="Confirm New Password"
                     name="confirmPassword"
                     value={formData.confirmPassword}
                     onChange={handleChange}
                     required
                />
                <Button type="submit" variant={variant} className="w-full py-3" disabled={isLoading}>
                    {isLoading ? "Updating..." : "Update Password"}
                </Button>
            </form>
        </div>
    )
}

