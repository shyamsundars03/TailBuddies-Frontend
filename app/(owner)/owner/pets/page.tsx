"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { Plus, Search } from "lucide-react"
import { AddPetModal } from "../../../../components/owner/AddPetModal"
import Image from "next/image"
import Link from "next/link"
import { cn, formatDate } from "@/lib/utils/utils"
import { SearchInput } from "../../../../components/common/ui/SearchInput"
import { OWNER_ROUTES } from "@/lib/constants/routes"
import { useOwnerPets } from "@/lib/hooks/owner/useOwnerPets"
import { useDebounce } from "@/lib/hooks/useDebounce"
import Swal from 'sweetalert2'
import { Pagination } from "../../../../components/common/ui/Pagination"

export default function MyPetsPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    const initialSearch = searchParams.get('search') || ""
    const initialPage = parseInt(searchParams.get('page') || "1")

    const [searchTerm, setSearchTerm] = useState(initialSearch)
    const debouncedSearchTerm = useDebounce(searchTerm, 1000)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [currentPage, setCurrentPage] = useState(initialPage)
    const limit = 5

    const { 
        pets, 
        totalPages, 
        totalPets, 
        isLoading, 
        isSubmitting, 
        loadPetsData, 
        togglePetStatus, 
        addPet 
    } = useOwnerPets()

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
        loadPetsData(currentPage, limit, debouncedSearchTerm)
    }, [currentPage, debouncedSearchTerm, loadPetsData])

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleToggleStatus = async (petId: string, currentStatus: boolean, petName: string) => {
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
            await togglePetStatus(petId, currentStatus)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-blue-950 mb-1">My Pets</h1>
                    <nav className="flex items-center gap-2 text-sm text-gray-400">
                        <Link href={OWNER_ROUTES.PROFILE} className="hover:text-blue-600 transition">Dashboard</Link>
                        <span>/</span>
                        <span className="text-blue-600/60 font-medium">My Pets</span>
                    </nav>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h2 className="text-xl font-bold text-blue-900/80 uppercase tracking-tight">My Pets</h2>
                    <div className="flex items-center gap-4">
                        <SearchInput
                            placeholder="Search pets..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value)
                                setCurrentPage(1)
                            }}
                            className="focus:ring-yellow-400 focus:bg-white bg-gray-50 border-gray-200 text-black w-full md:w-64"
                            containerClassName="group"
                        />
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
                            <div key={pet._id} className={cn(
                                "group relative flex flex-col md:flex-row md:items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl hover:shadow-md transition-all duration-300 gap-4",
                                !pet.isActive && "opacity-60"
                            )}>
                                <Link href={OWNER_ROUTES.PET_DETAILS(pet._id)} className="flex items-center gap-6 flex-1">
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
                                                pet.vaccinated === "YES" ? "text-blue-600" : "text-gray-400"
                                            )}>
                                                {pet.vaccinated === "YES" ? "Vaccinated" : "Not Vaccinated"}
                                            </div>
                                        </div>
                                    </div>
                                </Link>

                                <div className="flex items-center gap-8">
                                    <div className="flex items-center gap-3">
                                        <span className={cn("text-xs font-bold uppercase tracking-widest", !pet.isActive ? "text-red-500" : "text-gray-400")}>Inactive</span>
                                        <button
                                            onClick={() => handleToggleStatus(pet._id, pet.isActive ?? true, pet.name)}
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
                    const success = await addPet(data, pictureFile)
                    if (success) {
                        setIsModalOpen(false)
                        loadPetsData(1, limit, "") // reset to first page
                        setSearchTerm("")
                    }
                }}
            />
        </div>
    )
}

