"use client"

import { useState } from "react"
import { Search,  Grid, List, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import { DoctorFilters } from "@/components/owner/DoctorFilters"
import { DoctorCard } from "@/components/owner/DoctorCard"
import { cn } from "@/lib/utils/utils"

const DUMMY_DOCTORS = [
    {
        id: "1",
        name: "Dr. Michael Brown",
        specialty: "Psychologist",
        rating: 5.0,
        reviewsCount: 15,
        location: "Minneapolis, MN",
        duration: "30 Min",
        fee: "850",
        image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300",
        available: true
    },
    {
        id: "2",
        name: "Dr. Nicholas Tello",
        specialty: "Pediatrician",
        rating: 4.6,
        reviewsCount: 22,
        location: "Ogden, UT",
        duration: "60 Min",
        fee: "100",
        image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300&h=300",
        available: true
    },
    {
        id: "3",
        name: "Dr. Harold Bryant",
        specialty: "Neurologist",
        rating: 4.8,
        reviewsCount: 18,
        location: "Winona, NY",
        duration: "30 Min",
        fee: "500",
        image: "https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=300&h=300",
        available: true
    },
    {
        id: "4",
        name: "Dr. Sandra Jones",
        specialty: "Cardiologist",
        rating: 4.9,
        reviewsCount: 31,
        location: "Beckley, WV",
        duration: "30 Min",
        fee: "550",
        image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=300&h=300",
        available: true
    },
    {
        id: "5",
        name: "Dr. Charles Scott",
        specialty: "Neurologist",
        rating: 4.8,
        reviewsCount: 12,
        location: "Ogden, UT",
        duration: "30 Min",
        fee: "600",
        image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300&h=300",
        available: true
    },
    {
        id: "6",
        name: "Dr. Robert Thomas",
        specialty: "Cardiologist",
        rating: 4.2,
        reviewsCount: 25,
        location: "Oakland, CA",
        duration: "30 Min",
        fee: "450",
        image: "https://images.unsplash.com/photo-1550831107-1553da8c8464?auto=format&fit=crop&q=80&w=300&h=300",
        available: true
    }
]

export default function DoctorServicesPage() {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [sortBy, setSortBy] = useState('Price (Low to High)')

    return (
        <div className="min-h-screen bg-white p-4">
            {/* Search Header */}
            <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold text-gray-900">Find Doctor</h1>
                        <p className="text-gray-500 text-sm">Discover the best doctors specialized in pet care</p>
                    </div>
                </div>

                <div className="relative group max-w-2xl">
                    <div className="bg-white rounded-lg shadow-md p-1.5 flex items-center border border-gray-100 group-focus-within:border-blue-500 transition-all duration-300">
                        <div className="flex-1 flex items-center px-4">
                            <Search className="text-blue-500" size={20} />
                            <input
                                type="text"
                                placeholder="Search for Specialities , Doctors , etc..."
                                className="w-full px-4 py-3 text-sm font-medium text-gray-700 focus:outline-none bg-transparent"
                            />
                        </div>
                        <button className="bg-yellow-400 hover:bg-yellow-500 text-blue-950 font-bold px-8 py-3 rounded-md transition-all active:scale-95 text-xs uppercase tracking-wider">
                            Search
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Filters */}
                <div className="lg:col-span-1">
                    <DoctorFilters />
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Control Bar */}
                    <div className="bg-white rounded-lg border border-gray-100 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Showing</span>
                            <span className="text-sm font-bold text-blue-900">150 Doctors For You</span>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 group cursor-pointer">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Availability</span>
                                <ChevronDown size={14} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
                            </div>

                            <div className="flex items-center gap-4 border-l border-gray-100 pl-4">
                                <div className="relative">
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="appearance-none bg-transparent pr-8 text-xs font-bold text-blue-950 uppercase tracking-widest focus:outline-none cursor-pointer"
                                    >
                                        <option>Price (Low to High)</option>
                                        <option>Price (High to Low)</option>
                                        <option>Rating</option>
                                    </select>
                                    <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                </div>

                                <div className="bg-gray-50 p-1 rounded-lg flex border border-gray-100">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={cn(
                                            "p-1.5 rounded transition-all duration-300",
                                            viewMode === 'grid' ? "bg-white text-blue-600 shadow-sm border border-gray-100" : "text-gray-400 hover:text-gray-600"
                                        )}
                                    >
                                        <Grid size={16} />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={cn(
                                            "p-1.5 rounded transition-all duration-300",
                                            viewMode === 'list' ? "bg-white text-blue-600 shadow-sm border border-gray-100" : "text-gray-400 hover:text-gray-600"
                                        )}
                                    >
                                        <List size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Doctor Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {DUMMY_DOCTORS.map(doctor => (
                            <DoctorCard key={doctor.id} {...doctor} />
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between bg-white rounded-lg border border-gray-100 p-4 shadow-sm">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Showing 1 to 6 of 12 entries</span>
                        <div className="flex gap-1.5">
                            <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-100 text-gray-400 hover:bg-gray-50 transition">
                                <ChevronLeft size={16} />
                            </button>
                            {[1, 2, 3].map(page => (
                                <button
                                    key={page}
                                    className={cn(
                                        "w-8 h-8 flex items-center justify-center rounded text-xs font-bold transition-all duration-300 border",
                                        page === 2
                                            ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                            : "bg-white text-gray-400 border-gray-100 hover:border-gray-300"
                                    )}
                                >
                                    {page}
                                </button>
                            ))}
                            <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-100 text-gray-400 hover:bg-gray-50 transition">
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
