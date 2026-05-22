"use client"

import { useState, useEffect, useCallback } from "react"
import { Download, Loader2, X } from "lucide-react"
import { adminAnalyticsApi } from "@/lib/api/admin/admin-analytics.api"
import { adminApi } from "@/lib/api/admin"
import { toast } from "sonner"
import { AdminPageContainer } from "../../../../components/common/layout/admin/PageContainer"
import { Pagination } from "../../../../components/common/ui/Pagination"
import { SearchInput } from "../../../../components/common/ui/SearchInput"
import { DataTable, Column } from "../../../../components/common/ui/DataTable"
import { useDebounce } from "@/lib/hooks/useDebounce"
import Link from "next/link"
import * as XLSX from 'xlsx'
import { format } from "date-fns"
import Swal from "sweetalert2"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { ReportItem, Specialty } from "@/lib/types/admin/admin.types"
import type { ReportFilters } from "@/lib/types/api.types"

export default function AdminReportsPage() {
    const [reports, setReports] = useState<ReportItem[]>([])
    const [specialties, setSpecialties] = useState<Specialty[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isDataLoading, setIsDataLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalEntries, setTotalEntries] = useState(0)
    const [filters, setFilters] = useState({
        from: "",
        to: "",
        specialtyId: "",
        search: ""
    })
    const debouncedFilters = useDebounce(filters, 500)
    const limit = 10
    const emptyFilters = { from: "", to: "", specialtyId: "", search: "" }
    const hasActiveFilters = Boolean(filters.from || filters.to || filters.specialtyId || filters.search)

    const fetchSpecialties = async () => {
        try {
            const response = await adminApi.getSpecialties({ page: 1, limit: 100 })
            if (response.success && response.data) {
                setSpecialties(response.data.items || [])
            }
        } catch (error) {
            console.error("Failed to fetch specialties", error)
        }
    }

    const fetchReports = useCallback(async (page: number, filters: ReportFilters) => {
        setIsDataLoading(true)
        try {
            const response = await adminAnalyticsApi.getReports({
                ...filters,
                page,
                limit
            })
            if (response.success && response.data) {
                setReports(response.data.reports || [])
                setTotalEntries(response.data.total || 0)
            } else {
                toast.error(response.message || "Failed to fetch reports")
            }
        } catch {
            toast.error("An error occurred while fetching reports")
        } finally {
            setIsDataLoading(false)
            setIsLoading(false)
        }
    }, [limit])

    useEffect(() => {
        fetchSpecialties()
    }, [])

    useEffect(() => {
        fetchReports(currentPage, debouncedFilters)
    }, [currentPage, debouncedFilters, fetchReports])

    const exportToPdf = () => {
        if (reports.length === 0) {
            Swal.fire('No data', 'There is no data to export', 'warning')
            return
        }

        const doc = new jsPDF()
        doc.text('Doctor Performance Reports', 14, 15)

        const tableColumn = ["S.No", "Doctor", "Specialty", "Join Date", "Appointments", "Revenue"]
        const tableRows = reports.map((r) => [
            r.sNo,
            r.doctorName,
            r.specialty,
            r.memberSince ? format(new Date(r.memberSince), 'dd/MM/yyyy') : 'N/A',
            r.noOfAppointments,
            `INR ${r.earned || 0}`
        ])

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 20,
        })

        doc.save(`doctor_reports_${format(new Date(), 'yyyyMMdd')}.pdf`)
    }

    const exportToExcel = () => {
        if (reports.length === 0) {
            Swal.fire('No data', 'There is no data to export', 'warning')
            return
        }

        const data = reports.map((r) => ({
            "S.No": r.sNo,
            "Doctor": r.doctorName,
            "Specialty": r.specialty,
            "Join Date": r.memberSince ? format(new Date(r.memberSince), 'dd/MM/yyyy') : 'N/A',
            "Appointments": r.noOfAppointments,
            "Revenue": r.earned
        }))

        const ws = XLSX.utils.json_to_sheet(data)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, "Doctor Reports")
        XLSX.writeFile(wb, `doctor_reports_${format(new Date(), 'yyyyMMdd')}.xlsx`)
    }

    const columns: Column<ReportItem>[] = [
        { header: "S.No", accessor: "sNo", className: "w-16" },
        { 
            header: "Doctor", 
            accessor: (item) => (
                <span className="font-medium text-gray-800">Dr. {item.doctorName}</span>
            )
        },
        { 
            header: "Specialty", 
            accessor: (item) => (
                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
                    {item.specialty}
                </span>
            )
        },
        { 
            header: "Join Date", 
            accessor: (item) => (
                <span className="text-gray-600">
                    {item.memberSince ? (
                        (() => {
                            const date = new Date(item.memberSince);
                            return isNaN(date.getTime()) ? 'N/A' : format(date, 'dd MMM yyyy');
                        })()
                    ) : 'N/A'}
                </span>
            )
        },
        { 
            header: "Appointments", 
            accessor: "noOfAppointments",
            className: "font-medium text-gray-700"
        },
        { 
            header: "Revenue", 
            accessor: (item) => (
                <span className="font-bold text-gray-900">₹{(item.earned || 0).toLocaleString('en-IN')}</span>
            ),
            className: "text-right"
        }
    ]

    if (isLoading) {
        return (
            <AdminPageContainer title="Reports" activeItem="reports">
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
            </AdminPageContainer>
        )
    }

    return (
        <AdminPageContainer title="Reports" activeItem="reports">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-[#333333] mb-1">Financial Analysis</h1>
                    <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                        <Link href="/admin/dashboard" className="text-blue-600 hover:underline">Dashboard</Link>
                        <span>/</span>
                        <span className="text-gray-400">Reports</span>
                    </div>
                </div>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <h1 className="text-xl font-bold text-gray-800">Doctor Earnings Report</h1>
                    <div className="flex gap-2">
                        <button
                            onClick={exportToPdf}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                        >
                            <Download size={16} /> PDF
                        </button>
                        <button
                            onClick={exportToExcel}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                        >
                            <Download size={16} /> Excel
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex items-center justify-between gap-4 mb-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Filter reports</p>
                    {hasActiveFilters && (
                        <button
                            type="button"
                            onClick={() => setFilters(emptyFilters)}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                        >
                            <X size={16} /> Clear filters
                        </button>
                    )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">From Date</label>
                        <input
                            type="date"
                            value={filters.from}
                            onChange={(e) => {
                                setFilters({ ...filters, from: e.target.value })
                                setCurrentPage(1)
                            }}
                            className="w-full p-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">To Date</label>
                        <input
                            type="date"
                            value={filters.to}
                            onChange={(e) => {
                                setFilters({ ...filters, to: e.target.value })
                                setCurrentPage(1)
                            }}
                            className="w-full p-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Specialty</label>
                        <select
                            value={filters.specialtyId}
                            onChange={(e) => {
                                setFilters({ ...filters, specialtyId: e.target.value })
                                setCurrentPage(1)
                            }}
                            className="w-full p-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none"
                        >
                            <option value="">All Specialties</option>
                            {specialties.map(spec => (
                                <option key={spec._id} value={spec._id}>{spec.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Search Doctor</label>
                        <SearchInput
                            placeholder="Doctor name..."
                            value={filters.search}
                            onChange={(e) => {
                                setFilters({ ...filters, search: e.target.value })
                                setCurrentPage(1)
                            }}
                            containerClassName="w-full"
                            className="h-9 text-sm"
                        />
                    </div>
                </div>

                <DataTable 
                    columns={columns}
                    data={reports}
                    isLoading={isDataLoading}
                    keyExtractor={(item) => item.doctorId || `rep-${item.sNo}`}
                    emptyMessage="No reports found matching the criteria."
                />

                <div className="mt-6 flex justify-between items-center">
                    <p className="text-sm text-gray-500">
                        Total Records: <span className="font-bold">{totalEntries}</span>
                    </p>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={Math.ceil(totalEntries / limit) || 1}
                        onPageChange={setCurrentPage}
                        totalEntries={totalEntries}
                        entriesPerPage={limit}
                    />
                </div>
            </div>
        </AdminPageContainer>
    );
}
