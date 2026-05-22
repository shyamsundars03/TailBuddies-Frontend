"use client"
import { useState, useCallback } from "react"
import { userPetApi } from "../../api/user/pet.api"
import { toast } from "sonner"
import type { OwnerPet } from "@/lib/types/owner/owner.types"

interface PetSubmitData {
    vaccinated?: string;
    vaccinations?: Array<{ certificate?: File; name?: string; date?: string }>;
    [key: string]: unknown;
}

export const useOwnerPets = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [pets, setPets] = useState<OwnerPet[]>([])
    const [pet, setPet] = useState<OwnerPet | null>(null)
    const [totalPages, setTotalPages] = useState(1)
    const [totalPets, setTotalPets] = useState(0)

    const loadPetsData = useCallback(async (page: number, limit: number = 5, search: string = "") => {
        setIsLoading(true)
        try {
            const response = await userPetApi.getOwnerPets(page, limit, search)
            if (response.success && response.data) {
                setPets(response.data.items || [])
                setTotalPages(Math.ceil((response.data.total || 0) / limit) || 1)
                setTotalPets(response.data.total || 0)
                return response.data.items || []
            }
            return []
        } catch (error) {
            console.error("Failed to load pets data:", error)
            return []
        } finally {
            setIsLoading(false)
        }
    }, [])

    const getPetDetails = useCallback(async (id: string) => {
        setIsLoading(true)
        try {
            const response = await userPetApi.getPetById(id)
            if (response.success && response.data) {
                setPet(response.data)
                return response.data
            } else {
                toast.error(response.error || "Failed to load pet details")
                return null
            }
        } catch (error) {
            console.error("Failed to load pet details:", error)
            return null
        } finally {
            setIsLoading(false)
        }
    }, [])

    const addPet = async (data: PetSubmitData, pictureFile?: File | null): Promise<OwnerPet | null> => {
        setIsSubmitting(true)
        try {
            const formData = new FormData()
            
            Object.keys(data).forEach(key => {
                if (key !== "vaccinations" && key !== "picture" && key !== "vaccinated") {
                    formData.append(key, String(data[key]));
                }
            })

            formData.append("isVaccinated", data.vaccinated || "NO")

            if (pictureFile) {
                formData.append("picture", pictureFile)
            }

            if (data.vaccinations && data.vaccinations.length > 0) {
                formData.append("vaccinations", JSON.stringify(data.vaccinations))
                data.vaccinations.forEach((v) => {
                    if (v.certificate && v.certificate instanceof File) {
                        formData.append("certificates", v.certificate)
                    }
                })
            }

            const response = await userPetApi.addPet(formData)
            if (response.success && response.data) {
                toast.success("Pet added successfully")
                return response.data as OwnerPet
            } else {
                toast.error(response.error || "Failed to add pet")
                return null
            }
        } catch (error) {
            console.error("Failed to add pet:", error)
            toast.error("An error occurred while adding pet")
            return null
        } finally {
            setIsSubmitting(false)
        }
    }

    const updatePet = async (id: string, data: PetSubmitData, pictureFile?: File | null) => {
        setIsSubmitting(true)
        try {
            const formData = new FormData()
            
            Object.keys(data).forEach(key => {
                if (key !== "vaccinations" && key !== "picture" && key !== "vaccinated") {
                    formData.append(key, String(data[key]))
                }
            })

            formData.append("isVaccinated", data.vaccinated || "NO")

            if (pictureFile) {
                formData.append("picture", pictureFile)
            }

            if (data.vaccinations && data.vaccinations.length > 0) {
                formData.append("vaccinations", JSON.stringify(data.vaccinations))
                data.vaccinations.forEach((v) => {
                    if (v.certificate && v.certificate instanceof File) {
                        formData.append("certificates", v.certificate)
                    }
                })
            }

            const response = await userPetApi.updatePet(id, formData)
            if (response.success) {
                toast.success("Pet updated successfully")
                return true
            } else {
                toast.error(response.error || "Failed to update pet")
                return false
            }
        } catch (error) {
            console.error("Failed to update pet:", error)
            toast.error("An error occurred while updating pet")
            return false
        } finally {
            setIsSubmitting(false)
        }
    }

    const togglePetStatus = async (id: string, currentStatus: boolean) => {
        try {
            const response = await userPetApi.togglePetStatus(id, !currentStatus)
            if (response.success) {
                const action = currentStatus ? "deactivated" : "activated"
                toast.success(`Pet ${action} successfully`)
                setPets(prev => prev.map(p => p._id === id ? { ...p, isActive: !currentStatus } : p))
                if (pet && pet._id === id) {
                    setPet({ ...pet, isActive: !currentStatus })
                }
                return true
            } else {
                toast.error(response.error || "Failed to change pet status")
                return false
            }
        } catch (error) {
            console.error("Failed to change pet status:", error)
            return false
        }
    }

    const deletePet = async (id: string) => {
        try {
            const response = await userPetApi.deletePet(id)
            if (response.success) {
                toast.success("Pet deleted successfully")
                setPets(prev => prev.filter(p => p._id !== id))
                return true
            } else {
                toast.error(response.error || "Failed to delete pet")
                return false
            }
        } catch (error) {
            console.error("Failed to delete pet:", error)
            return false
        }
    }

    return {
        pets,
        pet,
        totalPages,
        totalPets,
        isLoading,
        isSubmitting,
        loadPetsData,
        getPetDetails,
        addPet,
        updatePet,
        togglePetStatus,
        deletePet,
    }
}
