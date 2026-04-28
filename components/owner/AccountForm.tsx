"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Input } from "../common/forms/Input"
import { Select } from "../common/forms/Select"
import { Button } from "../common/ui/Button"
import { usePathname } from "next/navigation"
import { userApi } from "../../lib/api/user/user.api"
import { useAppSelector, useAppDispatch } from "../../lib/redux/hooks"
import { setUser } from "../../lib/redux/slices/authSlice"
import { toast } from "sonner"
import { cn } from "@/lib/utils/utils"

export interface AccountData {
    username: string
    gender: string
    email: string
    phone: string
    address?: string
    city?: string
    state?: string
    country?: string
    pincode?: string
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
        username: initialData?.username || "",
        gender: initialData?.gender?.toLowerCase() || "female",
        email: initialData?.email || "",
        phone: initialData?.phone || "",
        address: initialData?.address || "",
        city: initialData?.city || "",
        state: initialData?.state || "",
        country: initialData?.country || "",
        pincode: initialData?.pincode || "",
    })

    const [errors, setErrors] = useState<Record<string, string>>({})

    // Fetch fresh profile data on mount to ensure database values are shown
    useEffect(() => {
        const fetchFreshProfile = async () => {
            try {
                const response = await userApi.getProfile()
                if (response.success && response.data) {
                    dispatch(setUser(response.data))
                }
            } catch (error) {
                console.error("Failed to fetch fresh profile:", error)
            }
        }
        fetchFreshProfile()
    }, [dispatch])

    const validateField = (name: string, value: string) => {
        let error = ""
        if (!value.trim()) {
            error = "Field is required"
        } else if (name === 'pincode' && !/^\d{6}$/.test(value)) {
            error = "Pincode must be exactly 6 digits"
        } else if (['city', 'state', 'country'].includes(name) && !/^[A-Za-z\s]+$/.test(value)) {
            error = "Only letters and spaces allowed"
        } else if (name === 'address' && value.trim().length < 5) {
            error = "Address is too short"
        } else if (!['pincode', 'city', 'state', 'country', 'address'].includes(name) && !/^[A-Za-z0-9\s,.-]+$/.test(value)) {
            error = "Invalid format"
        }
        
        setErrors(prev => ({ ...prev, [name]: error }))
        return !error
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        validateField(e.target.name, e.target.value)
    }

    // Sync state when initialData changes (e.g., after a successful save)
    useEffect(() => {
        if (initialData) {
            setUserData({
                username: initialData.username || "",
                gender: initialData.gender?.toLowerCase() || "female",
                email: initialData.email || "",
                phone: initialData.phone || "",
                address: initialData.address || "",
                city: initialData.city || "",
                state: initialData.state || "",
                country: initialData.country || "",
                pincode: initialData.pincode || "",
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
            const response = await userApi.updateProfile({
                username: userData.username,
                gender: userData.gender,
                phone: userData.phone
            })
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

    const handleSaveAddress = async () => {
        // Validate all fields first
        const fieldsToValidate = ['address', 'city', 'state', 'country', 'pincode']
        let isValid = true
        fieldsToValidate.forEach(field => {
            if (!validateField(field, (userData as any)[field] || "")) {
                isValid = false
            }
        })

        if (!isValid) {
            toast.error("Please fix validation errors")
            return
        }

        try {
            // Reusing updateProfile for address fields as well
            const response = await userApi.updateProfile({
                address: userData.address,
                city: userData.city,
                state: userData.state,
                country: userData.country,
                pincode: userData.pincode
            })
            if (response.success) {
                const updatedUser = { ...user, ...response.data }
                dispatch(setUser(updatedUser))
                localStorage.setItem('user', JSON.stringify(updatedUser))
                toast.success("Address updated successfully")
            } else {
                toast.error(response.error || "Failed to update address")
            }
        } catch {
            toast.error("An error occurred while saving address")
        }
    }

    const pathname = usePathname()
    const isProfilePage = pathname.endsWith("/profile")
    const isDoctor = pathname.startsWith("/doctor")
    const accountPrefix = isDoctor ? "/doctor/profile" : "/owner/account"
    const variant = isDoctor ? "doctor" : "owner"
    
    // Override isReadOnly if on profile page to ensure it stays readonly there
    const effectiveReadOnly = isProfilePage ? true : isReadOnly

    // Determine phone display value
    const phoneValue = !userData.phone && isGoogleUser && effectiveReadOnly ? "no phone number" : userData.phone

    const renderField = (label: string, value: string, name: string, type: string = "text", options?: { value: string; label: string }[]) => {
        if (effectiveReadOnly) {
            return (
                <div className="space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</span>
                    <p className="text-base font-black text-blue-950 min-h-[1.5rem]">
                        {value || "—"}
                    </p>
                </div>
            )
        }

        if (options) {
            return (
                <Select
                    label={label}
                    name={name}
                    value={value}
                    onChange={handleChange}
                    options={options}
                />
            )
        }

        return (
            <Input
                label={label}
                type={type}
                name={name}
                value={value}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors[name]}
                className="bg-gray-50/50"
                placeholder={`Enter ${label.toLowerCase()}`}
            />
        )
    }

    return (
        <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-100 border border-gray-100 p-8 md:p-10">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-blue-900/80 uppercase tracking-tight flex items-center gap-3">
                    <span className="w-1.5 h-8 bg-yellow-400 rounded-full" />
                    Account Details
                </h2>
            </div>

            {/* Account Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 mb-10">
                {renderField("User Name", userData.username, "username")}
                {renderField("Email", userData.email, "email", "email")}
                {renderField("Phone", phoneValue, "phone", "tel")}
                {renderField("Gender", userData.gender, "gender", "text", GENDER_OPTIONS)}
            </div>

            {!effectiveReadOnly && (
                <div className="flex flex-wrap gap-4 mb-12">
                    <Button onClick={handleSaveDetails} variant={variant} className="px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs">
                        Save Changes
                    </Button>
                    {!isGoogleUser && (
                        <Link href={`${accountPrefix}/change-password`}>
                            <Button variant={variant} className="px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs">Change Password</Button>
                        </Link>
                    )}
                    <Link href={`${accountPrefix}/change-email`}>
                        <Button variant={variant} className="px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs">Change Email</Button>
                    </Link>
                </div>
            )}

            {/* Address Section */}
            <div className="flex items-center justify-between mb-8 mt-4">
                <h2 className="text-xl font-bold text-blue-900/80 uppercase tracking-tight flex items-center gap-3">
                    <span className="w-1.5 h-8 bg-indigo-500 rounded-full" />
                    Address Information
                </h2>
            </div>

            <div className="space-y-8">
                <div>
                    {renderField("Street Address", userData.address || "", "address")}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                    {renderField("City", userData.city || "", "city")}
                    {renderField("State", userData.state || "", "state")}
                    {renderField("Country", userData.country || "", "country")}
                    {renderField("Pincode", userData.pincode || "", "pincode")}
                </div>
            </div>

            {!effectiveReadOnly && (
                <div className="flex justify-end mt-10">
                    <Button onClick={handleSaveAddress} variant={variant} className="px-10 py-4 rounded-xl font-black uppercase tracking-widest text-xs shadow-lg shadow-indigo-100">
                        Update Address
                    </Button>
                </div>
            )}
        </div>
    )
}
