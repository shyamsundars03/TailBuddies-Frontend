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
    const isDoctor = pathname.startsWith("/doctor")
    const accountPrefix = isDoctor ? "/doctor/profile" : "/owner/account"
    const variant = isDoctor ? "doctor" : "owner"

    // Determine phone display value
    const phoneValue = !userData.phone && isGoogleUser && isReadOnly ? "no phone number" : userData.phone

    return (
        <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Account</h2>

            {/* Account Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Input
                    label="User Name"
                    type="text"
                    name="username"
                    value={userData?.username}
                    onChange={handleChange}
                    className="bg-gray-50"
                    disabled={isReadOnly}
                />

                <Input
                    label="Email"
                    type="email"
                    name="email"
                    value={userData.email}
                    className="bg-gray-50"
                    disabled={true}
                />

                <Input
                    label="Phone"
                    type="tel"
                    name="phone"
                    value={phoneValue}
                    onChange={handleChange}
                    className="bg-gray-50"
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
                />
            </div>

            {!isReadOnly && (
                <div className="flex flex-wrap gap-4 mb-8">
                    <Button onClick={handleSaveDetails} variant={variant}>
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

            {/* Address Section */}
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Address</h2>

            <div className="mb-6">
                <Input
                    label="Address"
                    type="text"
                    name="address"
                    value={userData.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.address}
                    disabled={isReadOnly}
                    required
                />
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
                <Input
                    label="City"
                    type="text"
                    name="city"
                    value={userData.city}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.city}
                    disabled={isReadOnly}
                    required
                />
                <Input
                    label="State"
                    type="text"
                    name="state"
                    value={userData.state}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.state}
                    disabled={isReadOnly}
                    required
                />
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
                <Input
                    label="Country"
                    type="text"
                    name="country"
                    value={userData.country}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.country}
                    disabled={isReadOnly}
                    required
                />
                <Input
                    label="Pincode"
                    type="text"
                    name="pincode"
                    value={userData.pincode}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.pincode}
                    disabled={isReadOnly}
                    required
                />
            </div>

            {!isReadOnly && (
                <div className="flex justify-end">
                    <Button onClick={handleSaveAddress} variant={variant} className="rounded-lg">
                        Save Address
                    </Button>
                </div>
            )}
        </div>
    )
}
