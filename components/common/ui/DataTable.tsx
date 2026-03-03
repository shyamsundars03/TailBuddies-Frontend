"use client"

import { cn } from "../../../lib/utils/utils"

export interface Column<T> {
    header: string
    accessor: keyof T | ((item: T) => React.ReactNode)
    className?: string
    sortable?: boolean
}

interface DataTableProps<T> {
    columns: Column<T>[]
    data: T[]
    keyExtractor: (item: T) => string
    onRowClick?: (item: T) => void
    isLoading?: boolean
    emptyMessage?: string
    className?: string
}

export function DataTable<T>({
    columns,
    data,
    keyExtractor,
    onRowClick,
    isLoading,
    emptyMessage = "No data found.",
    className,
}: DataTableProps<T>) {
    return (
        <div className={cn("overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100", className)}>
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                        {columns.map((column, index) => (
                            <th
                                key={index}
                                className={cn(
                                    "py-4 px-6 text-sm font-bold text-gray-800 uppercase tracking-wider",
                                    column.className
                                )}
                            >
                                <div className="flex items-center gap-2">
                                    {column.header}
                                    {column.sortable && (
                                        <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                                        </svg>
                                    )}
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        <tr>
                            <td colSpan={columns.length} className="py-20 text-center">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            </td>
                        </tr>
                    ) : data.length > 0 ? (
                        data.map((item) => (
                            <tr
                                key={keyExtractor(item)}
                                onClick={() => onRowClick?.(item)}
                                className={cn(
                                    "border-b border-gray-100 last:border-0 hover:bg-blue-50 transition-colors",
                                    onRowClick && "cursor-pointer"
                                )}
                            >
                                {columns.map((column, index) => (
                                    <td key={index} className={cn("py-5 px-6 text-sm text-gray-700 font-medium", column.className)}>
                                        {typeof column.accessor === "function"
                                            ? column.accessor(item)
                                            : (item[column.accessor] as React.ReactNode)}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length} className="py-20 text-center text-gray-400">
                                <div className="flex flex-col items-center gap-2">
                                    <span className="text-4xl text-gray-200">📭</span>
                                    <p className="text-sm font-medium">{emptyMessage}</p>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}
