"use client"

import { useState, useEffect } from "react"
import { AdminPageContainer } from "../../../../components/common/layout/admin/PageContainer"
import { Search, Calendar, Download, Filter, Loader2, User } from "lucide-react"
import { adminAnalyticsApi } from "@/lib/api/admin-analytics.api"
import { adminApi } from "@/lib/api/admin/admin.api"
import Image from "next/image"
import * as XLSX from 'xlsx'
import { format } from "date-fns"
import Swal from "sweetalert2"
import Link from "next/link"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

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
        const response = await adminApi.getSpecialties(1, 100)
        if (response.success) {
            setSpecialties(response.data?.specialties || [])
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

    const exportToPdf = () => {
        if (reports.length === 0) {
            Swal.fire('No data', 'There is no data to export', 'warning')
            return
        }

        const doc = new jsPDF()

        // Add Header
        doc.setFontSize(22)
        doc.setTextColor(0, 43, 73) // #002B49
        doc.text('TailBuddies Veterinary Portal', 14, 22)

        doc.setFontSize(10)
        doc.setTextColor(100)
        doc.text(`Analysis Report: ${filters.from || 'Start'} to ${filters.to || 'End'}`, 14, 30)
        doc.text(`Generated on: ${format(new Date(), 'dd MMM yyyy HH:mm')}`, 14, 35)

        const tableColumn = ["S.No", "Doctor Name", "Specialty", "No. of Appointments", "Total Earned"]
        const tableRows = reports.map((r, i) => [
            i + 1,
            `Dr. ${r.doctorName}`,
            r.specialty,
            r.noOfAppointments,
            `INR ${r.earned}`
        ])

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 45,
            theme: 'grid',
            headStyles: { fillColor: [0, 43, 73], textColor: [255, 255, 255], fontSize: 10, fontStyle: 'bold' },
            styles: { fontSize: 9, cellPadding: 4 },
            alternateRowStyles: { fillColor: [245, 247, 250] }
        })

        doc.save(`TailBuddies_Report_${format(new Date(), 'yyyy-MM-dd')}.pdf`)
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
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-black text-[#002B49] mb-1 uppercase tracking-tight">Financial Reports</h1>
                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        <Link href="/admin/dashboard" className="text-blue-600 hover:underline">Dashboard</Link>
                        <span>/</span>
                        <span>Platform Analysis</span>
                        <span>/</span>
                        <span className="text-gray-300">Detailed Earnings</span>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-8">
                <div className="flex flex-wrap items-center gap-4 mb-10">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <span className="absolute -top-2 left-3 bg-white px-1 text-[9px] font-black uppercase text-blue-600 z-10">From Date</span>
                            <input
                                type="date"
                                value={filters.from}
                                onChange={(e) => setFilters({ ...filters, from: e.target.value })}
                                className="pl-4 pr-4 py-3 border border-gray-100 bg-gray-50/50 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-44 text-gray-600"
                            />
                        </div>
                        <div className="relative">
                            <span className="absolute -top-2 left-3 bg-white px-1 text-[9px] font-black uppercase text-blue-600 z-10">To Date</span>
                            <input
                                type="date"
                                value={filters.to}
                                onChange={(e) => setFilters({ ...filters, to: e.target.value })}
                                className="pl-4 pr-4 py-3 border border-gray-100 bg-gray-50/50 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-44 text-gray-600"
                            />
                        </div>
                    </div>

                    <div className="relative flex-1 min-w-[200px]">
                        <span className="absolute -top-2 left-3 bg-white px-1 text-[9px] font-black uppercase text-blue-600 z-10">Specialty</span>
                        <select
                            value={filters.specialtyId}
                            onChange={(e) => setFilters({ ...filters, specialtyId: e.target.value })}
                            className="w-full pl-4 pr-10 text-gray-600 py-3 border border-gray-100 bg-gray-50/50 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none"
                        >
                            <option value="">All Specialties</option>
                            {specialties.map(s => (
                                <option key={s._id} value={s._id}>{s.name}</option>
                            ))}
                        </select>
                        <Filter className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleFilter}
                            className="px-8 py-3 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95"
                        >
                            Filter Analysis
                        </button>
                        <button
                            onClick={exportToPdf}
                            className="px-6 py-3 bg-gray-50 text-gray-600 border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all flex items-center gap-2"
                        >
                            <Download size={14} /> PDF
                        </button>
                        <button
                            onClick={exportToExcel}
                            className="px-6 py-3 bg-gray-50 text-gray-600 border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all flex items-center gap-2"
                        >
                            <Download size={14} /> Excel
                        </button>
                    </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-gray-100">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="text-left py-5 px-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Doctor Profile</th>
                                <th className="text-left py-5 px-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Speciality</th>
                                <th className="text-left py-5 px-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Member Since</th>
                                <th className="text-right py-5 px-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Total Earned</th>
                                <th className="text-right py-5 px-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Appointments</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center">
                                        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-4" />
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Crunching Financial Data...</p>
                                    </td>
                                </tr>
                            ) : reports.length > 0 ? (
                                reports.map((report, idx) => (
                                    <tr key={idx} className="group hover:bg-blue-50/20 transition-colors">
                                        <td className="py-5 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 ring-2 ring-white shadow-sm group-hover:ring-blue-100 transition-all">
                                                    <Image
                                                        src={report.profilePic || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=150&h=150"}
                                                        alt={report.doctorName || "Doctor Profile"}
                                                        width={40}
                                                        height={40}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-black text-blue-900 group-hover:text-blue-600 transition-colors">
                                                        Dr. {report.doctorName}
                                                    </span>
                                                    <span className="text-[9px] font-black text-blue-500 uppercase tracking-tighter">ID: {report.doctorId.slice(-8).toUpperCase()}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-5 px-6">
                                            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-[9px] font-black uppercase tracking-tighter">
                                                {report.specialty}
                                            </span>
                                        </td>
                                        <td className="py-5 px-6 text-[11px] font-medium text-gray-400">
                                            {format(new Date(report.memberSince), 'dd MMM yyyy')}
                                        </td>
                                        <td className="py-5 px-6 text-right">
                                            <span className="text-xs font-black text-[#002B49]">
                                                ₹{report.earned.toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="py-5 px-6 text-right">
                                            <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-50 text-blue-600 rounded-lg text-xs font-black">
                                                {report.noOfAppointments}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center">
                                        <div className="max-w-xs mx-auto">
                                            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                                <Search size={24} className="text-gray-300" />
                                            </div>
                                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">No matching records found</p>
                                            <p className="text-[10px] text-gray-400 mt-2">Try adjusting your filters or date range</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex items-center justify-between mt-8">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Showing {reports.length} Platform Experts
                    </p>
                    <div className="flex items-center gap-2">
                        <button className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 transition">Prev</button>
                        <div className="flex gap-1">
                            {[1].map(p => (
                                <button key={p} className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-600 text-white text-[10px] font-black">{p}</button>
                            ))}
                        </div>
                        <button className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 transition">Next</button>
                    </div>
                </div>
            </div>
        </AdminPageContainer>
    )
}
