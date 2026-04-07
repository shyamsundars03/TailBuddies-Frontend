"use client"
import { AxiosError } from "axios"

import { useState, useCallback } from "react"
import type { Specialty, AdminUser } from "../../lib/types/admin/admin.types"
import { adminApi } from "../api/admin"
import { toast } from "sonner"

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
            const data = await adminApi.getSpecialties(page, limit, search)
            if (data.success) {
                const fetchedSpecialties = data.data.specialties.map((s: { _id: string;[key: string]: unknown }) => ({
                    id: s._id,
                    name: s.name,
                    description: s.description,
                    commonDesignation: s.commonDesignation,
                    typicalKeywords: s.typicalKeywords,
                    status: s.status
                }))
                setSpecialties(fetchedSpecialties)
                setStats(prev => ({ ...prev, totalSpecialties: data.data.total }))
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
            if (result.success) {
                const newSpec = {
                    ...result.data,
                    id: result.data._id
                }
                setSpecialties(prev => [newSpec, ...prev])
                return newSpec
            }
        } catch (error: unknown) {
            throw error;
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
            }
        } catch (error: unknown) {
            throw error;
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
            }
        } catch (error: unknown) {
            throw error;
        } finally {
            setIsLoading(false)
        }
    }

    const getUsers = useCallback(async (page: number = 1, limit: number = 10, role?: string, search?: string) => {
        setIsLoading(true)
        try {
            const data = await adminApi.getUsers(page, limit, role, search)
            if (data.success) {
                const fetchedUsers = data.data.users.map((u: { _id: string;[key: string]: unknown }) => ({
                    id: u._id,
                    username: u.username,
                    email: u.email,
                    phone: u.phone,
                    role: u.role,
                    isBlocked: u.isBlocked,
                    profilePic: u.profilePic
                }))
                setUsers(fetchedUsers)
                setStats(prev => ({
                    totalUsers: data.data.total,
                    ownerCount: data.data.ownerCount,
                    doctorCount: data.data.doctorCount,
                    totalSpecialties: prev.totalSpecialties
                }))
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
    }, [])

    const toggleUserBlock = async (id: string) => {
        setIsLoading(true)
        try {
            const result = await adminApi.toggleUserBlock(id)
            if (result.success) {
                setUsers(prev => prev.map(u => u.id === id ? { ...u, isBlocked: !u.isBlocked } : u))
            }
        } catch (error: unknown) {
            const err = error as AxiosError<{ message?: string }>;
            toast.error(err.response?.data?.message || "Failed to update user status")
            throw error
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
