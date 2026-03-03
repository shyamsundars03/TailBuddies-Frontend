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
    const startEntry = (currentPage - 1) * entriesPerPage + 1
    const endEntry = Math.min(currentPage * entriesPerPage, totalEntries || 0)

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

    return (
        <div className={cn("flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2", className)}>
            {totalEntries !== undefined && (
                <div className="text-sm text-gray-600">
                    Showing <span className="font-medium text-gray-900">{startEntry}</span> to{" "}
                    <span className="font-medium text-gray-900">{endEntry}</span> of{" "}
                    <span className="font-medium text-gray-900">{totalEntries}</span> entries
                </div>
            )}

            <div className="flex items-center gap-1">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 border border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    aria-label="Previous page"
                >
                    <ChevronLeft size={18} />
                </button>

                {pages.map((page) => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={cn(
                            "px-4 py-2 text-sm font-medium rounded-lg transition",
                            currentPage === page
                                ? "bg-yellow-400 text-white shadow-sm"
                                : "text-gray-600 hover:bg-gray-50 border border-transparent"
                        )}
                    >
                        {page}
                    </button>
                ))}

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 border border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    aria-label="Next page"
                >
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
    )
}
