"use client"

import { useState, useEffect } from "react"
import { AdminPageContainer } from "../../../../components/common/layout/admin/PageContainer"
import { Search, Calendar, Download, Filter, Loader2, User } from "lucide-react"
import { adminAnalyticsApi } from "@/lib/api/admin-analytics.api"
import { adminApi } from "@/lib/api/admin/admin.api"
import {  } from "@/lib/api/admin/admin.api"
import Image from "next/image"
import * as XLSX from 'xlsx'
import { format } from "date-fns"
import Swal from "sweetalert2"

export default function AdminReportsPage() {
    const [reports, setReports] = useState<any[]>([])
    const [specialties, setSpecialties] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [filters, setFilters] = useState({
        from: "",
        to: "",
        specialtyId: "",
        search: ""
    })

    useEffect(() => {
        fetchSpecialties()
        fetchReports()
    }, [])

    const fetchSpecialties = async () => {
        const response = await adminApi.getSpecialties()
        if (response.success) {
            setSpecialties(response.specialties || [])
        }
    }

    const fetchReports = async () => {
        setIsLoading(true)
        // Date validation
        if (filters.from && filters.to && new Date(filters.from) > new Date(filters.to)) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Date Range',
                text: 'From Date must be before To Date'
            })
            setIsLoading(false)
            return
        }

        const response = await adminAnalyticsApi.getReports(filters)
        if (response.success) {
            setReports(response.reports || [])
        }
        setIsLoading(false)
    }

    const handleFilter = () => {
        fetchReports()
    }

    const exportToExcel = () => {
        if (reports.length === 0) {
            Swal.fire('No data', 'There is no data to export', 'warning')
            return
        }

        const companyInfo = [
            ["TailBuddies Veterinary Portal"],
            ["Company Address: 123 Pet Care St, New York, NY"],
            [`Analysis Report: ${filters.from || 'Start'} to ${filters.to || 'End'}`],
            [`Specialties: ${filters.specialtyId ? specialties.find(s => s._id === filters.specialtyId)?.name : 'All'}`],
            [],
            ["S.No", "Doctor Name", "Specialty", "No. of Appointments", "Total Earned"]
        ]

        const data = reports.map((r, i) => [
            i + 1,
            r.doctorName,
            r.specialty,
            r.noOfAppointments,
            `₹${r.earned}`
        ])

        const ws = XLSX.utils.aoa_to_sheet([...companyInfo, ...data])
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, "Doctor Report")
        XLSX.writeFile(wb, `TailBuddies_Report_${format(new Date(), 'yyyy-MM-dd')}.xlsx`)
    }

    return (
        <AdminPageContainer title="Reports" activeItem="reports">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
                <div className="flex flex-wrap items-center gap-4 mb-8">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-black uppercase text-blue-600 z-10">From</span>
                            <input 
                                type="date" 
                                value={filters.from}
                                onChange={(e) => setFilters({...filters, from: e.target.value})}
                                className="pl-4 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-44" 
                            />
                        </div>
                        <div className="relative">
                            <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-black uppercase text-blue-600 z-10">To</span>
                            <input 
                                type="date" 
                                value={filters.to}
                                onChange={(e) => setFilters({...filters, to: e.target.value})}
                                className="pl-4 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-44" 
                            />
                        </div>
                    </div>

                    <div className="relative flex-1 min-w-[200px]">
                        <select 
                            value={filters.specialtyId}
                            onChange={(e) => setFilters({...filters, specialtyId: e.target.value})}
                            className="w-full pl-4 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none bg-white font-medium"
                        >
                            <option value="">Choose by Speciality</option>
                            {specialties.map(s => (
                                <option key={s._id} value={s._id}>{s.name}</option>
                            ))}
                        </select>
                        <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    </div>

                    <div className="flex items-center gap-2">
                        <button 
                            onClick={handleFilter}
                            className="px-6 py-2.5 bg-rose-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-rose-700 transition-all shadow-lg shadow-rose-200"
                        >
                            Filter
                        </button>
                        <button 
                            onClick={() => Swal.fire('PDF Export', 'PDF export will be available in the next update.', 'info')}
                            className="px-6 py-2.5 bg-rose-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-rose-700 transition-all shadow-lg shadow-rose-200"
                        >
                            Download (PDF)
                        </button>
                        <button 
                            onClick={exportToExcel}
                            className="px-6 py-2.5 bg-rose-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-rose-700 transition-all shadow-lg shadow-rose-200 flex items-center gap-2"
                        >
                            <Download size={14} />
                            Download (xlsx)
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="text-left py-4 px-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Doctor Name</th>
                                <th className="text-left py-4 px-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Speciality</th>
                                <th className="text-left py-4 px-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Member Since</th>
                                <th className="text-left py-4 px-6 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">Earned</th>
                                <th className="text-left py-4 px-6 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">No of Appointments</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center">
                                        <Loader2 className="w-8 h-8 text-rose-600 animate-spin mx-auto mb-4" />
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Fetching Report Data...</p>
                                    </td>
                                </tr>
                            ) : reports.length > 0 ? (
                                reports.map((report, idx) => (
                                    <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 border-2 border-white shadow-sm">
                                                    <Image 
                                                        src={report.profilePic || "/placeholder-doctor.png"} 
                                                        alt={report.doctorName} 
                                                        width={40} 
                                                        height={40} 
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <span className="text-sm font-bold text-blue-600 hover:underline cursor-pointer">
                                                    Dr. {report.doctorName}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-gray-600 font-medium">
                                            {report.specialty}
                                        </td>
                                        <td className="py-4 px-6 text-sm text-gray-500">
                                            {format(new Date(report.memberSince), 'dd MMM yyyy')}
                                        </td>
                                        <td className="py-4 px-6 text-sm font-black text-gray-900 text-right">
                                            ₹{report.earned}
                                        </td>
                                        <td className="py-4 px-6 text-sm font-bold text-gray-600 text-right">
                                            {report.noOfAppointments}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center">
                                        <p className="text-gray-400 italic">No reports found for the selected filters</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex items-center justify-between mt-8 text-xs font-bold text-gray-500 uppercase tracking-widest">
                    <span>Showing {reports.length} entries</span>
                    <div className="flex items-center gap-2">
                        <button className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition">Previous</button>
                        <button className="px-4 py-2 bg-rose-600 text-white rounded-lg">1</button>
                        <button className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition">Next</button>
                    </div>
                </div>
            </div>
        </AdminPageContainer>
    )
}

function AdminReportsPageContent({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
