"use client"
import { useState, useCallback } from "react"
import type { Specialty, AdminUser } from "@/lib/types/admin/admin.types"
import { adminApi } from "../api/admin"
import { toast } from "sonner"
import { AxiosError } from "axios"

export const useAdmin = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [specialties, setSpecialties] = useState<Specialty[]>([])
    const [users, setUsers] = useState<AdminUser[]>([])
    const [stats, setStats] = useState({
        totalUsers: 0,
        ownerCount: 0,
        doctorCount: 0,
        totalSpecialties: 0
    })

    const getSpecialties = useCallback(async (page: number = 1, limit: number = 10, search?: string) => {
        setIsLoading(true)
        try {
            const data = await adminApi.getSpecialties({ page, limit, search })
            if (data.success && data.data) {
                const fetchedSpecialties = data.data.items.map((s) => ({
                    id: s.id || s._id || '',
                    name: s.name,
                    description: s.description,
                    commonDesignation: s.commonDesignation,
                    typicalKeywords: s.typicalKeywords,
                    status: s.status
                } as Specialty))
                setSpecialties(fetchedSpecialties)
                setStats(prev => ({ ...prev, totalSpecialties: data.data?.total || 0 }))
                return fetchedSpecialties
            }
            return []
        } catch (error: unknown) {
            const err = error as AxiosError<{ message?: string }>;
            toast.error(err.response?.data?.message || "Failed to fetch specialties")
            return []
        } finally {
            setIsLoading(false)
        }
    }, [])

    const addSpecialty = async (data: Omit<Specialty, "id">) => {
        setIsLoading(true)
        try {
            const result = await adminApi.addSpecialty(data)
            if (result.success && result.data) {
                const newSpec = {
                    ...result.data,
                    id: result.data._id!
                } as Specialty
                setSpecialties(prev => [newSpec, ...prev])
                toast.success("Specialty added successfully")
                return newSpec
            } else {
                toast.error(result.message || "Failed to add specialty")
                return null
            }
        } catch (error: unknown) {
            const err = error as AxiosError<{ message?: string }>;
            toast.error(err.response?.data?.message || "Failed to add specialty")
            return null
        } finally {
            setIsLoading(false)
        }
    }

    const editSpecialty = async (id: string, data: Partial<Specialty>) => {
        setIsLoading(true)
        try {
            const result = await adminApi.editSpecialty(id, data)
            if (result.success) {
                setSpecialties(prev => prev.map(s => s.id === id ? { ...s, ...data } : s))
                toast.success("Specialty updated successfully")
                return true
            } else {
                toast.error(result.message || "Failed to update specialty")
                return false
            }
        } catch (error: unknown) {
            const err = error as AxiosError<{ message?: string }>;
            toast.error(err.response?.data?.message || "Failed to update specialty")
            return false
        } finally {
            setIsLoading(false)
        }
    }

    const removeSpecialty = async (id: string) => {
        setIsLoading(true)
        try {
            const result = await adminApi.removeSpecialty(id)
            if (result.success) {
                setSpecialties(prev => prev.filter(s => s.id !== id))
                toast.success("Specialty removed successfully")
                return true
            } else {
                toast.error(result.message || "Failed to remove specialty")
                return false
            }
        } catch (error: unknown) {
            const err = error as AxiosError<{ message?: string }>;
            toast.error(err.response?.data?.message || "Failed to remove specialty")
            return false
        } finally {
            setIsLoading(false)
        }
    }

    const getUsers = useCallback(async (page: number = 1, limit: number = 10, role?: string, search?: string) => {
        setIsLoading(true)
        try {
            const data = await adminApi.getUsers({ page, limit, role, search })
            if (data.success && data.data) {
                const fetchedUsers = data.data.items.map((u) => ({
                    id: u.id || u._id || '',
                    username: u.username,
                    email: u.email,
                    phone: u.phone,
                    role: u.role,
                    isBlocked: u.isBlocked,
                    profilePic: u.profilePic
                } as AdminUser))
                setUsers(fetchedUsers)
                setStats({
                    totalUsers: data.data.total,
                    ownerCount: data.data.ownerCount,
                    doctorCount: data.data.doctorCount,
                    totalSpecialties: stats.totalSpecialties
                })
                return {
                    users: fetchedUsers,
                    total: data.data.total,
                    ownerCount: data.data.ownerCount,
                    doctorCount: data.data.doctorCount
                }
            }
            return { users: [], total: 0, ownerCount: 0, doctorCount: 0 }
        } catch (error: unknown) {
            const err = error as AxiosError<{ message?: string }>;
            toast.error(err.response?.data?.message || "Failed to fetch users")
            return { users: [], total: 0, ownerCount: 0, doctorCount: 0 }
        } finally {
            setIsLoading(false)
        }
    }, [stats.totalSpecialties])

    const toggleUserBlock = async (id: string) => {
        setIsLoading(true)
        try {
            const result = await adminApi.toggleUserBlock(id)
            if (result.success) {
                setUsers(prev => prev.map(u => u.id === id ? { ...u, isBlocked: !u.isBlocked } : u))
                toast.success(result.message || "User status updated")
                return true
            } else {
                toast.error(result.message || "Failed to update user status")
                return false
            }
        } catch (error: unknown) {
            const err = error as AxiosError<{ message?: string }>;
            toast.error(err.response?.data?.message || "Failed to update user status")
            return false
        } finally {
            setIsLoading(false)
        }
    }

    return {
        specialties,
        users,
        stats,
        isLoading,
        getSpecialties,
        addSpecialty,
        editSpecialty,
        removeSpecialty,
        getUsers,
        toggleUserBlock,
    }
}
