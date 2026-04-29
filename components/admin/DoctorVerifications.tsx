import React, { useState, useEffect } from 'react'
import { DataTable, Column } from '../common/ui/DataTable'
import { SearchInput } from '../common/ui/SearchInput'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils/utils'
import { doctorApi } from '@/lib/api/doctor/doctor.api'
import { toast } from 'sonner'

interface Doctor {
    id: string
    name: string
    speciality: string
    memberSince: string
    memberSinceTime: string
    earned: string
    isBlocked: boolean
    image: string
    status: string
}

export function DoctorVerifications() {
    const [doctors, setDoctors] = useState<Doctor[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('under_review')
    const [totalEntries, setTotalEntries] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const router = useRouter()



    const fetchDoctors = async () => {
        setLoading(true)
        const response = await doctorApi.getAllDoctors(currentPage, 10, searchTerm, undefined, statusFilter)
        if (response.success) {
            const mapped = response.data.map((doc: any) => {
                const date = new Date(doc.createdAt);
                return {
                    id: doc._id,
                    name: doc.userId?.username || 'Unknown',
                    speciality: doc.profile?.designation || 'General',
                    memberSince: new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(date),
                    memberSinceTime: new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).format(date),
                    earned: '$0.00',
                    isBlocked: doc.userId?.isBlocked || false,
                    image: doc.userId?.profilePic || doc.clinicInfo?.clinicPic || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b1f8?auto=format&fit=crop&q=80&w=150&h=150',
                    status: doc.profileStatus || 'incomplete'
                };
            })
            setDoctors(mapped)
            setTotalEntries(response.total || mapped.length)
        } else {
            toast.error(response.error || "Failed to fetch doctors")
        }
        setLoading(false)
    }
    useEffect(() => {
        fetchDoctors()
    }, [currentPage, searchTerm, statusFilter])

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'verified': return 'text-green-600 bg-green-50 border-green-200';
            case 'under_review': return 'text-amber-600 bg-amber-50 border-amber-200';
            case 'rejected': return 'text-red-600 bg-red-50 border-red-200';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    }

    const columns: Column<Doctor>[] = [
        {
            header: "Doctor Name",
            accessor: (doc) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                        <img src={doc.image} alt={doc.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-blue-600 font-semibold hover:underline cursor-pointer">
                        {doc.name}
                    </span>
                </div>
            )
        },
        { header: "Speciality", accessor: "speciality" },
        {
            header: "Member Since",
            accessor: (doc) => (
                <div className="flex flex-col">
                    <span className="text-gray-700 font-medium">{doc.memberSince}</span>
                    <span className="text-blue-500 text-xs font-bold">{doc.memberSinceTime}</span>
                </div>
            )
        },
        {
            header: "Status",
            accessor: (doc) => (
                <span className={cn("px-3 py-1 rounded-full border text-[10px] font-bold uppercase", getStatusColor(doc.status))}>
                    {doc.status.replace('_', ' ')}
                </span>
            )
        },
        { header: "Earned", accessor: "earned" }
    ]

    return (
        <div className="bg-gray-50/50 min-h-screen">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">List of Doctors</h1>
                <div className="flex items-center gap-2 text-sm text-gray-400 font-medium">
                    <span className="cursor-pointer hover:text-blue-600" onClick={() => router.push('/admin/dashboard')}>Dashboard</span>
                    <span>/</span>
                    <span className="text-gray-400">List of Doctors</span>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex bg-gray-100 p-1 rounded-xl">
                        {['under_review', 'verified', 'rejected', 'all'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status === 'all' ? '' : status)}
                                className={cn(
                                    "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                                    (statusFilter === status || (status === 'all' && !statusFilter))
                                        ? "bg-white text-blue-600 shadow-sm"
                                        : "text-gray-500 hover:text-gray-700"
                                )}
                            >
                                {status.toUpperCase().replace('_', ' ')}
                            </button>
                        ))}
                    </div>
                    <SearchInput
                        placeholder="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        containerClassName="w-64"
                    />
                </div>

                {loading ? (
                    <div className="p-20 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="mt-4 text-gray-500 font-medium">Loading doctors...</p>
                    </div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={doctors}
                        keyExtractor={(doc) => doc.id}
                        className="border-0 shadow-none rounded-none"
                        onRowClick={(doc) => router.push(`/admin/doctorVerifications/${doc.id}`)}
                    />
                )}

                <div className="p-6 flex items-center justify-between border-t border-gray-100">
                    <span className="text-sm text-gray-500">
                        Showing {(currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, totalEntries)} of {totalEntries} entries
                    </span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-400 disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-bold shadow-md">{currentPage}</button>
                        <button
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            disabled={currentPage * 10 >= totalEntries}
                            className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
