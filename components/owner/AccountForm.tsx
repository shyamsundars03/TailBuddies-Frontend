import { useEffect, useState } from "react"
import Link from "next/link"
import { Input } from "../common/forms/Input"
import { Select } from "../common/forms/Select"
import { Button } from "../common/ui/Button"
import { usePathname } from "next/navigation"
import { userApi } from "../../lib/api/user"
import { useAppSelector, useAppDispatch } from "../../lib/redux/hooks"
import { setUser } from "../../lib/redux/slices/authSlice"
import { toast } from "sonner"

export interface AccountData {
    userName: string
    gender: string
    email: string
    phone: string
}

export interface AccountFormProps {
    initialData?: Partial<AccountData>
    isReadOnly?: boolean
}

const GENDER_OPTIONS = [
    { value: "female", label: "Female" },
    { value: "male", label: "Male" },
    { value: "other", label: "Other" },
]

export function AccountForm({ initialData, isReadOnly = false }: AccountFormProps) {
    const dispatch = useAppDispatch()
    const { user } = useAppSelector((state) => state.auth)
    const isGoogleUser = !!user?.googleId

    const [userData, setUserData] = useState<AccountData>({
        userName: initialData?.userName || "",
        gender: initialData?.gender?.toLowerCase() || "female",
        email: initialData?.email || "",
        phone: initialData?.phone || "",
    })

    // Sync state when initialData changes (e.g., after a successful save)
    useEffect(() => {
        if (initialData) {
            setUserData({
                userName: initialData.userName || "",
                gender: initialData.gender?.toLowerCase() || "female",
                email: initialData.email || "",
                phone: initialData.phone || "",
            })
        }
    }, [initialData])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setUserData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSaveDetails = async () => {
        try {
            const response = await userApi.updateProfile(userData as unknown as Record<string, unknown>)
            if (response.success) {
                // Merge new data with existing user object to preserve other fields (like role, googleId, etc)
                const updatedUser = { ...user, ...response.data }
                dispatch(setUser(updatedUser))
                // Sync to localStorage
                localStorage.setItem('user', JSON.stringify(updatedUser))
                toast.success("Profile details updated successfully")
            } else {
                toast.error(response.error || "Failed to update profile")
            }
        } catch {
            toast.error("An error occurred while saving profile")
        }
    }

    const pathname = usePathname()
    const isDoctor = pathname.startsWith("/doctor")
    const accountPrefix = isDoctor ? "/doctor/profile" : "/owner/account"
    const variant = isDoctor ? "doctor" : "owner"

    const pageTitle = isDoctor ? "Personal Information" : (pathname === "/owner/profile" ? "Profile" : "Account")

    // Determine phone display value
    const phoneValue = !userData.phone && isGoogleUser && isReadOnly ? "no phone number" : userData.phone

    return (
        <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">
                {pageTitle}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Input
                    label="User Name"
                    type="text"
                    name="userName"
                    value={userData.userName}
                    onChange={handleChange}
                    className="bg-gray-50 text-gray-700"
                    disabled={isReadOnly}
                    placeholder="Enter username"
                />

                <Input
                    label="Email"
                    type="email"
                    name="email"
                    value={userData.email}
                    className="bg-gray-50 text-gray-500"
                    disabled={true}
                />

                <Input
                    label="Phone"
                    type="tel"
                    name="phone"
                    value={phoneValue}
                    onChange={handleChange}
                    onFocus={(e) => {
                        if (isGoogleUser && !userData.phone) {
                            // Clear virtual placeholder on focus
                        }
                    }}
                    className="bg-gray-50 text-gray-700"
                    disabled={isReadOnly}
                    placeholder={isGoogleUser ? "no phone number" : "Enter phone number"}
                />

                <Select
                    label="Gender"
                    name="gender"
                    value={userData.gender}
                    onChange={handleChange}
                    options={GENDER_OPTIONS}
                    disabled={isReadOnly}
                    className="bg-gray-50 text-gray-700"
                />
            </div>

            {!isReadOnly && (
                <div className="flex flex-wrap gap-4">
                    <Button onClick={handleSaveDetails} variant={variant} className="px-8">
                        Save Details
                    </Button>

                    {!isGoogleUser && (
                        <Link href={`${accountPrefix}/change-password`}>
                            <Button variant={variant}>Change Password</Button>
                        </Link>
                    )}

                    <Link href={`${accountPrefix}/change-email`}>
                        <Button variant={variant}>Change Email</Button>
                    </Link>
                </div>
            )}
        </div>
    )
}
