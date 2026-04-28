"use client"

import { useState } from "react"
import { PasswordInput } from "../common/forms/PasswordInput"
import { Button } from "../common/ui/Button"
import { userApi } from "../../lib/api/user"
import { toast } from "sonner"
import { usePathname } from "next/navigation"
import { useRouter } from "next/navigation"

export function ChangePasswordForm() {
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    })
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const pathname = usePathname()
    const isDoctor = pathname.startsWith("/doctor")
    const variant = isDoctor ? "doctor" : "owner"

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const validatePassword = (password: string) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
        return regex.test(password);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!validatePassword(formData.newPassword)) {
            return toast.error("Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.");
        }

        if (formData.newPassword !== formData.confirmPassword) {
            return toast.error("Passwords do not match")
        }

        try {
            setIsLoading(true)
            const response = await userApi.changePassword({
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
            })

            if (response.success) {
                toast.success("Password changed successfully")
                const redirectPath = isDoctor ? "/doctor/profile" : "/owner/account";
                router.push(redirectPath)
            } else {
                toast.error(response.error || "Failed to change password")
            }
        } catch {
            toast.error("An error occurred")
        } finally {
            setIsLoading(false)
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
