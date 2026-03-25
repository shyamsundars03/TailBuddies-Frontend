"use client"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { Search, Plus, } from "lucide-react"
// import { useAppSelector } from "../../../../lib/redux/hooks"
import { AddPetModal } from "../../../../components/owner/AddPetModal"
import Image from "next/image"
import Link from "next/link"
import { cn, formatDate } from "@/lib/utils/utils"

import Swal from 'sweetalert2'
import { userPetApi } from "../../../../lib/api/user/pet.api"
import { toast } from "sonner"
import { Pagination } from "../../../../components/common/ui/Pagination"

export default function MyPetsPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    const initialSearch = searchParams.get('search') || ""
    const initialPage = parseInt(searchParams.get('page') || "1")

    const [searchTerm, setSearchTerm] = useState(initialSearch)
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialSearch)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [pets, setPets] = useState<any[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(initialPage)
    const [totalPages, setTotalPages] = useState(1)
    const [totalPets, setTotalPets] = useState(0)
    const limit = 5

    const loadPetsData = useCallback(async (page: number, search: string) => {
        setIsLoading(true)
        const response = await userPetApi.getOwnerPets(page, limit, search)
        if (response.success) {
            setPets(response.data.pets || response.data)
            setTotalPages(Math.ceil((response.data.total || 0) / limit) || 1)
            setTotalPets(response.data.total || 0)
        } else {
            // toast.error(response.error || "Failed to load pets")
        }
        setIsLoading(false)
    }, [limit])

    // Update URL when state changes
    useEffect(() => {
        const params = new URLSearchParams()
        if (debouncedSearchTerm) params.set('search', debouncedSearchTerm)
        if (currentPage > 1) params.set('page', currentPage.toString())
        
        const query = params.toString()
        router.push(query ? `${pathname}?${query}` : pathname, { scroll: false })
    }, [debouncedSearchTerm, currentPage, pathname, router])

    // Load data when page/search change
    useEffect(() => {
        loadPetsData(currentPage, debouncedSearchTerm)
    }, [currentPage, debouncedSearchTerm, loadPetsData])

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm)
            setCurrentPage(1) // Reset page on new organic search
        }, 500)
        return () => clearTimeout(timer)
    }, [searchTerm])

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const togglePetStatus = async (petId: string, currentStatus: boolean, petName: string) => {
        const action = currentStatus ? "deactivate" : "activate"
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `Do you want to ${action} ${petName}? ${currentStatus ? 'This will hide the pet from normal views.' : ''}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: `Yes, ${action} it!`
        })

        if (result.isConfirmed) {
            const response = await userPetApi.togglePetStatus(petId, !currentStatus)
            if (response.success) {
                toast.success(`Pet ${action}d successfully`)
                setPets(pets.map(pet =>
                    pet._id === petId ? { ...pet, isActive: !currentStatus } : pet
                ))
            } else {
                toast.error(response.error || `Failed to ${action} pet`)
            }
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-blue-950 mb-1">My Pets</h1>
                    <nav className="flex items-center gap-2 text-sm text-gray-400">
                        <Link href="/owner/dashboard" className="hover:text-blue-600 transition">Dashboard</Link>
                        <span>/</span>
                        <span className="text-blue-600/60 font-medium">My Pets</span>
                    </nav>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h2 className="text-xl font-bold text-blue-900/80 uppercase tracking-tight">My Pets</h2>
                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700 group-focus-within:text-yellow-500 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2  text-black  bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-white transition-all text-sm w-full md:w-64"
                            />
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-6 py-2 rounded-full text-sm transition shadow-sm hover:shadow-md active:scale-95 flex items-center gap-2 whitespace-nowrap"
                        >
                            <Plus size={18} />
                            Add Pet
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-4">
                    {isLoading ? (
                        <div className="text-center py-12 text-gray-400 font-medium">Loading pets...</div>
                    ) : pets.length > 0 ? (
                        pets.map((pet) => (
                            <div key={pet._id || pet.id} className={cn(
                                "group relative flex flex-col md:flex-row md:items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl hover:shadow-md transition-all duration-300 gap-4",
                                !pet.isActive && "opacity-60"
                            )}>
                                <Link href={`/owner/pets/${pet._id || pet.id}`} className="flex items-center gap-6 flex-1">
                                    <div className="w-16 h-16 rounded-xl overflow-hidden shadow-sm shrink-0">
                                        <Image
                                            src={pet.picture || pet.image || "/favicon.ico"}
                                            alt={pet.name}
                                            width={64}
                                            height={64}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-12 w-full">
                                        <div className="space-y-0.5">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-blue-950 text-lg">{pet.name}</span>
                                                <span className="text-gray-400 text-sm font-medium">({pet.species})</span>
                                                <span className="text-gray-400 text-xs ml-2">DOB: {formatDate(pet.dob)}</span>
                                                {!pet.isActive && (
                                                    <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-600 text-xs font-bold rounded">INACTIVE</span>
                                                )}
                                            </div>
                                            <div className={cn(
                                                "text-xs font-bold uppercase tracking-wider",
                                                (pet.isVaccinated === "YES" || pet.vaccinated === true) ? "text-blue-600" : "text-gray-400"
                                            )}>
                                                {(pet.isVaccinated === "YES" || pet.vaccinated === true) ? "Vaccinated" : "Not Vaccinated"}
                                            </div>
                                        </div>
                                    </div>
                                </Link>

                                <div className="flex items-center gap-8">
                                    <div className="flex items-center gap-3">
                                        <span className={cn("text-xs font-bold uppercase tracking-widest", !pet.isActive ? "text-red-500" : "text-gray-400")}>Inactive</span>
                                        <button
                                            onClick={() => togglePetStatus(pet._id || pet.id, pet.isActive ?? true, pet.name)}
                                            className={cn(
                                                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none",
                                                (pet.isActive ?? true) ? "bg-emerald-500" : "bg-gray-300"
                                            )}
                                        >
                                            <span
                                                className={cn(
                                                    "inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 shadow-sm",
                                                    (pet.isActive ?? true) ? "translate-x-6" : "translate-x-1"
                                                )}
                                            />
                                        </button>
                                        <span className={cn("text-xs font-bold uppercase tracking-widest", (pet.isActive ?? true) ? "text-emerald-500" : "text-gray-400")}>Active</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="text-gray-300" size={24} />
                            </div>
                            <p className="text-gray-400 font-medium">No pets found</p>
                        </div>
                    )}
                </div>

                <div className="px-6 py-4 bg-gray-50/30">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        totalEntries={totalPets}
                        entriesPerPage={limit}
                    />
                </div>
            </div>

            <AddPetModal
                isOpen={isModalOpen}
                isSubmitting={isSubmitting}
                onClose={() => setIsModalOpen(false)}
                onSave={async (data, pictureFile) => {
                    setIsSubmitting(true)
                    const formData = new FormData()
                    
                    // Append all base text data
                    Object.keys(data).forEach(key => {
                        if (key !== 'vaccinations' && key !== 'picture') {
                            formData.append(key, String(data[key]))
                        }
                    });

                    // Append Picture
                    if (pictureFile) {
                        formData.append('picture', pictureFile)
                    }

                    // Append Vaccinations Stringified
                    if (data.vaccinations && data.vaccinations.length > 0) {
                        formData.append('vaccinations', JSON.stringify(data.vaccinations))
                        
                        // Append certificates
                        data.vaccinations.forEach((v: any) => {
                            if (v.certificate && v.certificate instanceof File) {
                                formData.append('certificates', v.certificate);
                            }
                        });
                    }

                    const response = await userPetApi.addPet(formData)
                    if (response.success) {
                        toast.success("Pet added successfully")
                        setIsModalOpen(false)
                        loadPetsData(1, "") // reset to first page
                        setSearchTerm("")
                    } else {
                        toast.error(response.error || "Failed to add pet")
                    }
                    setIsSubmitting(false)
                }}
            />
        </div>
    )
}
