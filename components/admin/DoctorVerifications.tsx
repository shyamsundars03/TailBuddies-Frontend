import React, { useState, useEffect, useCallback } from 'react'
import { DataTable, Column } from '../common/ui/DataTable'
import { SearchInput } from '../common/ui/SearchInput'
import { Pagination } from '../common/ui/Pagination'
import { ADMIN_ROUTES } from '@/lib/constants'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils/utils'
import { doctorApi, DoctorResponse } from '@/lib/api/doctor/doctor.api'
import { toast } from 'sonner'
import { DoctorVerificationItem } from '@/lib/types/admin/admin.types'

export function DoctorVerifications() {
    const [doctors, setDoctors] = useState<DoctorVerificationItem[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('verified')
    const [totalEntries, setTotalEntries] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const router = useRouter()



    const fetchDoctors = useCallback(async (search = debouncedSearchTerm) => {
        setLoading(true)
        try {
            const response = await doctorApi.getAllDoctors(currentPage, 5, search, undefined, statusFilter)
            if (response.success && response.data) {
                const items = response.data.items || []
                const mapped = items.map((doc: DoctorResponse) => {
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
                setTotalEntries(response.data.total || 0)
            } else {
                setDoctors([])
                setTotalEntries(0)
                if (response.error) toast.error(response.error)
            }
        } catch (err) {
            console.error("Fetch doctors error:", err)
            toast.error("An error occurred while fetching doctors")
        } finally {
            setLoading(false)
        }
    }, [currentPage, debouncedSearchTerm, statusFilter])

    useEffect(() => {
        fetchDoctors(debouncedSearchTerm)
    }, [fetchDoctors, debouncedSearchTerm])

    // Debounce search term only
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm)
            setCurrentPage(1)
        }, 1000)
        return () => clearTimeout(timer)
    }, [searchTerm])


    const getStatusColor = (status: string) => {
        switch (status) {
            case 'verified': return 'text-green-600 bg-green-50 border-green-200';
            case 'under_review': return 'text-amber-600 bg-amber-50 border-amber-200';
            case 'rejected': return 'text-red-600 bg-red-50 border-red-200';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    }

    const columns: Column<DoctorVerificationItem>[] = [
        {
            header: "Doctor Name",
            accessor: (doc) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                        <Image src={doc.image} alt={doc.name} width={40} height={40} className="w-full h-full object-cover" />
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
        <div className="bg-gray-50/50 min-h-full">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#333333] mb-1">List of Doctors</h1>
                <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                    <Link href={ADMIN_ROUTES.DASHBOARD} className="text-blue-600 hover:underline">Dashboard</Link>
                    <span>/</span>
                    <span className="text-gray-400">Doctor Verifications</span>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex bg-gray-100 p-1 rounded-xl">
                        {['under_review', 'verified', 'rejected', 'all'].map((status) => (
                            <button
                                key={status}
                                onClick={() => {
                                    setStatusFilter(status === 'all' ? '' : status);
                                    setCurrentPage(1);
                                }}
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
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
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

                <div className="px-6 py-4 bg-gray-50/30">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={Math.ceil(totalEntries / 5) || 1}
                        onPageChange={setCurrentPage}
                        totalEntries={totalEntries}
                        entriesPerPage={5}
                    />
                </div>
            </div>
        </div>
    )
}
