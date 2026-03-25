"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "../../../lib/utils/utils"

interface PaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
    totalEntries?: number
    entriesPerPage?: number
    className?: string
}

export function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    totalEntries,
    entriesPerPage = 10,
    className,
}: PaginationProps) {
    const startEntry = totalEntries === 0 ? 0 : (currentPage - 1) * entriesPerPage + 1
    const endEntry = Math.min(currentPage * entriesPerPage, totalEntries || 0)

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

    return (
        <div className={cn("flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-6 bg-gray-50/30 rounded-b-xl border-t border-gray-100", className)}>
            {totalEntries !== undefined && (
                <div className="text-sm font-medium text-gray-500">
                    Showing <span className="text-blue-900 font-bold">{startEntry}</span> to{" "}
                    <span className="text-blue-900 font-bold">{endEntry}</span> of{" "}
                    <span className="text-blue-900 font-bold">{totalEntries}</span> entries
                </div>
            )}

            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 border border-gray-200 rounded-lg text-gray-400 hover:bg-white hover:text-blue-600 hover:border-blue-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-90"
                    aria-label="Previous page"
                >
                    <ChevronLeft size={18} />
                </button>

                <div className="flex items-center gap-1">
                    {pages.map((page) => (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={cn(
                                "min-w-[40px] h-10 text-sm font-bold rounded-lg transition-all active:scale-95",
                                currentPage === page
                                    ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                                    : "text-gray-500 hover:bg-white hover:text-blue-600 border border-transparent hover:border-blue-100"
                            )}
                        >
                            {page}
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 border border-gray-200 rounded-lg text-gray-400 hover:bg-white hover:text-blue-600 hover:border-blue-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-90"
                    aria-label="Next page"
                >
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
    )
}
