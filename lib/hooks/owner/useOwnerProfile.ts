"use client"
import { useState, useCallback } from "react"
import { userApi } from "../../api/user/user.api"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { setUser } from "../../redux/slices/authSlice"
import { toast } from "sonner"


export const useOwnerProfile = () => {
    const [isLoading, setIsLoading] = useState(false)
    const { user } = useAppSelector((state) => state.auth)
    const dispatch = useAppDispatch()

    const getFreshProfile = useCallback(async () => {
        setIsLoading(true)
        try {
            const response = await userApi.getProfile()
            if (response.success && response.data) {
                dispatch(setUser(response.data))
                return response.data
            }
            return null
        } catch (error) {
            console.error("Failed to fetch fresh profile:", error)
            return null
        } finally {
            setIsLoading(false)
        }
    }, [dispatch])

    const updateProfileDetails = async (data: { username: string; gender: string; phone: string }) => {
        setIsLoading(true)
        try {
            const response = await userApi.updateProfile(data)
            if (response.success && response.data) {
                const updatedUser = { ...user, ...response.data }
                dispatch(setUser(updatedUser))
                localStorage.setItem("user", JSON.stringify(updatedUser))
                toast.success("Profile details updated successfully")
                return updatedUser
            } else {
                toast.error(response.error || "Failed to update profile")
                return null
            }
        } catch {
            toast.error("An error occurred while saving profile")
            return null
        } finally {
            setIsLoading(false)
        }
    }

    const updateProfileAddress = async (data: {
        address: string;
        city: string;
        state: string;
        country: string;
        pincode: string;
    }) => {
        setIsLoading(true)
        try {
            const response = await userApi.updateProfile(data)
            if (response.success && response.data) {
                const updatedUser = { ...user, ...response.data }
                dispatch(setUser(updatedUser))
                localStorage.setItem("user", JSON.stringify(updatedUser))
                toast.success("Address updated successfully")
                return updatedUser
            } else {
                toast.error(response.error || "Failed to update address")
                return null
            }
        } catch {
            toast.error("An error occurred while saving address")
            return null
        } finally {
            setIsLoading(false)
        }
    }

    const updateProfilePic = async (profilePicUrl: string) => {
        setIsLoading(true)
        try {
            const response = await userApi.updateProfilePic(profilePicUrl)
            if (response.success && response.data) {
                const updatedUser = { ...user, ...response.data }
                dispatch(setUser(updatedUser))
                localStorage.setItem("user", JSON.stringify(updatedUser))
                toast.success("Profile picture updated successfully")
                return updatedUser
            } else {
                toast.error(response.error || "Failed to update profile picture")
                return null
            }
        } catch {
            toast.error("An error occurred while saving profile picture")
            return null
        } finally {
            setIsLoading(false)
        }
    }

    const initiateEmailChange = async () => {
        setIsLoading(true)
        try {
            const response = await userApi.initiateEmailChange()
            if (response.success) {
                toast.success("OTP sent to your current email")
                return true
            } else {
                toast.error(response.error || "Failed to send OTP")
                return false
            }
        } catch {
            toast.error("An error occurred")
            return false
        } finally {
            setIsLoading(false)
        }
    }

    const verifyCurrentEmail = async (otp: string) => {
        setIsLoading(true)
        try {
            const response = await userApi.verifyCurrentEmail(otp)
            if (response.success) {
                toast.success("Current email verified")
                return true
            } else {
                toast.error(response.error || "Invalid OTP")
                return false
            }
        } catch {
            toast.error("An error occurred")
            return false
        } finally {
            setIsLoading(false)
        }
    }

    const sendOtpToNewEmail = async (newEmail: string) => {
        setIsLoading(true)
        try {
            const response = await userApi.sendOtpToNewEmail(newEmail)
            if (response.success) {
                toast.success("OTP sent to your new email")
                return true
            } else {
                toast.error(response.error || "Failed to send OTP")
                return false
            }
        } catch {
            toast.error("An error occurred")
            return false
        } finally {
            setIsLoading(false)
        }
    }

    const verifyNewEmail = async (newEmail: string, otp: string) => {
        setIsLoading(true)
        try {
            const response = await userApi.verifyNewEmail(newEmail, otp)
            if (response.success && response.data) {
                const apiUser = response.data
                const updatedUser = {
                    id: apiUser.id || apiUser._id,
                    email: apiUser.email,
                    role: apiUser.role,
                    username: apiUser.username,
                    phone: apiUser.phone,
                    gender: apiUser.gender,
                    profilePic: apiUser.profilePic,
                }
                dispatch(setUser(updatedUser))
                localStorage.setItem("user", JSON.stringify(updatedUser))
                toast.success("Email updated successfully")
                return updatedUser
            } else {
                toast.error(response.error || "Invalid OTP")
                return null
            }
        } catch {
            toast.error("An error occurred")
            return null
        } finally {
            setIsLoading(false)
        }
    }

    const changePassword = async (data: Record<string, unknown>) => {
        setIsLoading(true)
        try {
            const response = await userApi.changePassword(data)
            if (response.success) {
                toast.success("Password changed successfully")
                return true
            } else {
                toast.error(response.error || "Failed to change password")
                return false
            }
        } catch {
            toast.error("An error occurred")
            return false
        } finally {
            setIsLoading(false)
        }
    }

    return {
        user,
        isLoading,
        getFreshProfile,
        updateProfileDetails,
        updateProfileAddress,
        updateProfilePic,
        initiateEmailChange,
        verifyCurrentEmail,
        sendOtpToNewEmail,
        verifyNewEmail,
        changePassword,
    }
}
