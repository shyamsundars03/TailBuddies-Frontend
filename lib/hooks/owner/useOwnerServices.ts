"use client"
import { useState, useCallback } from "react"
import { doctorApi, DoctorFilters, DoctorResponse } from "../../api/doctor/doctor.api"
import { appointmentApi } from "../../api/appointment.api"
import { toast } from "sonner"

export const useOwnerServices = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [doctors, setDoctors] = useState<DoctorResponse[]>([])
    const [specialties, setSpecialties] = useState<Record<string, unknown>[]>([])
    const [doctor, setDoctor] = useState<DoctorResponse | null>(null)
    const [totalPages, setTotalPages] = useState(1)
    const [totalDoctors, setTotalDoctors] = useState(0)
    // const [totalOwners, setTotalOwners] = useState(0)

    const getSpecialties = useCallback(async () => {
        try {
            const response = await doctorApi.getSpecialties()
            if (response.success && response.data) {
                setSpecialties(response.data)
                return response.data
            }
            return []
        } catch (error) {
            console.error("Failed to fetch specialties:", error)
            return []
        }
    }, [])

    const getDoctorsList = useCallback(async (
        page: number, 
        limit: number = 9, 
        search: string = "", 
        activeOnly: boolean = true, 
        specialtyId?: string,
        filters?: DoctorFilters,
        _sort?: string
    ) => {
        setIsLoading(true)
        try {
            const response = await doctorApi.getAllDoctors(page, limit, search, activeOnly, specialtyId, filters, _sort)
            if (response.success && response.data) {
                setDoctors(response.data.items || [])
                setTotalDoctors(response.data.total || 0)
                setTotalPages(Math.ceil((response.data.total || 0) / limit) || 1)
                return response.data
            }
            return null
        } catch (error) {
            console.error("Failed to fetch doctors list:", error)
            return null
        } finally {
            setIsLoading(false)
        }
    }, [])



    const getDoctorById = useCallback(async (id: string, options?: { silent?: boolean }) => {
        if (!options?.silent) setIsLoading(true)
        try {
            const response = await doctorApi.getById(id)
            if (response.success && response.data) {
                setDoctor(response.data)
                return response.data
            } else {
                toast.error(response.error || "Failed to fetch doctor details")
                return null
            }
        } catch (error) {
            console.error("Failed to fetch doctor details:", error)
            return null
        } finally {
            if (!options?.silent) setIsLoading(false)
        }
    }, [])

    const getAvailableSlots = useCallback(async (doctorId: string, date: string, options?: { silent?: boolean }) => {
        if (!options?.silent) setIsLoading(true)
        try {
            const response = await appointmentApi.getAvailableSlots(doctorId, date)
            if (response.success && response.data) {
                return response.data
            }
            return []
        } catch (error) {
            console.error("Failed to fetch slots:", error)
            return []
        } finally {
            if (!options?.silent) setIsLoading(false)
        }
    }, [])

    return {
        doctors,
        specialties,
        doctor,
        totalPages,
        totalDoctors,
        isLoading,
        getSpecialties,
        getDoctorsList,
        getDoctorById,
        getAvailableSlots,
    }
}
