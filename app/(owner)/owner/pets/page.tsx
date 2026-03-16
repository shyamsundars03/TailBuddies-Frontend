"use client"

import { useState } from "react"
import { Search, Plus, } from "lucide-react"
// import { useAppSelector } from "../../../../lib/redux/hooks"
import { AddPetModal } from "../../../../components/owner/AddPetModal"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils/utils"

// Dummy data for pets based on Image 1
const DUMMY_PETS = [
    {
        id: "1",
        name: "MAX",
        species: "Dog",
        vaccinated: true,
        status: "active",
        image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=150&h=150"
    },
    {
        id: "2",
        name: "BRUNO",
        species: "Dog",
        vaccinated: false,
        status: "active",
        image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150&h=150"
    }
]

export default function MyPetsPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [pets, setPets] = useState(DUMMY_PETS)

    const filteredPets = pets.filter(pet =>
        pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.species.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const togglePetStatus = (id: string) => {
        setPets(pets.map(pet =>
            pet.id === id ? { ...pet, status: pet.status === 'active' ? 'inactive' : 'active' } : pet
        ))
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
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-yellow-500 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-white transition-all text-sm w-full md:w-64"
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
                    {filteredPets.length > 0 ? (
                        filteredPets.map((pet) => (
                            <div key={pet.id} className="group relative flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl hover:shadow-md transition-all duration-300">
                                <Link href={`/owner/pets/${pet.id}`} className="flex items-center gap-6 flex-1">
                                    <div className="w-16 h-16 rounded-xl overflow-hidden shadow-sm">
                                        <Image
                                            src={pet.image || "/favicon.ico"}
                                            alt={pet.name}
                                            width={64}
                                            height={64}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center md:gap-12">
                                        <div className="space-y-0.5">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-blue-950 text-lg">{pet.name}</span>
                                                <span className="text-gray-400 text-sm font-medium">({pet.species})</span>
                                            </div>
                                            <div className={cn(
                                                "text-xs font-bold uppercase tracking-wider",
                                                pet.vaccinated ? "text-blue-600" : "text-gray-400"
                                            )}>
                                                {pet.vaccinated ? "Vaccinated" : "Not Vaccinated"}
                                            </div>
                                        </div>
                                    </div>
                                </Link>

                                <div className="flex items-center gap-8">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Deactivate</span>
                                        <button
                                            onClick={() => togglePetStatus(pet.id)}
                                            className={cn(
                                                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none",
                                                pet.status === 'active' ? "bg-emerald-500" : "bg-gray-300"
                                            )}
                                        >
                                            <span
                                                className={cn(
                                                    "inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 shadow-sm",
                                                    pet.status === 'active' ? "translate-x-6" : "translate-x-1"
                                                )}
                                            />
                                        </button>
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Activate</span>
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
            </div>

            <AddPetModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={(data) => {
                    console.log("Saving pet:", data)
                    // TODO: Implement save logic
                }}
            />
        </div>
    )
}
