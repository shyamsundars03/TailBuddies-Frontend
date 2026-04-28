"use client"

import { useState, useEffect, useCallback } from "react"
import { SearchInput } from "../common/ui/SearchInput"
import { DataTable, Column } from "../common/ui/DataTable"
import { Pagination } from "../common/ui/Pagination"
import { Dropdown } from "../common/ui/Dropdown"
import Link from "next/link"
import type { AdminUser } from "../../lib/types/admin/admin.types"
import { cn } from "@/lib/utils/utils"
import { useAdmin } from "../../lib/hooks/useAdmin"
import { toast } from "sonner"
import { Users, UserCheck } from "lucide-react"
// import logger from "../../lib/logger/index"
interface UsersManagementProps {
    initialUsers?: AdminUser[]
}

export function UsersManagement({ initialUsers: _initialUsers = [] }: UsersManagementProps) {
    const { getUsers, toggleUserBlock, users, stats, isLoading: apiLoading } = useAdmin()
    const [currentPage, setCurrentPage] = useState(1)
    const [searchTerm, setSearchTerm] = useState("")
    const [filterRole, setFilterRole] = useState("all")

    const fetchUsers = useCallback(async (search?: string) => {
        try {
            await getUsers(currentPage, 10, filterRole, search)
        } catch {
            // Error handled in hook
        }
    }, [getUsers, filterRole, currentPage])

useEffect(() => {
  if (!searchTerm) {
    fetchUsers("");
    return;
  }

  const timer = setTimeout(() => {
    setCurrentPage(1);
    fetchUsers(searchTerm);
  }, 500);

  return () => clearTimeout(timer);
}, [searchTerm, fetchUsers, setCurrentPage]);


    const handleToggleBlock = async (id: string) => {
        try {
            await toggleUserBlock(id)
            toast.success("User status updated")
        } catch {
            // Error handled in hook
        }
    }

    const columns: Column<AdminUser>[] = [

        {
            header: "User Name",
            accessor: (user) => {
                return (
                    <span className="text-gray-900 ">
                        {user.username}
                    </span>
                )
            },
            sortable: true
        },
        // { header: "Phone", accessor: (u) => u.phone || "N/A", sortable: true },
        {
            header: "Email",
            accessor: (user) => <span className="text-gray-500 ">{user.email}</span>,
            sortable: true
        },
        {
            header: "Specialty",
            accessor: (user) => (
                user.role === "doctor" ? (
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-tighter">
                        {user.specialty || 'N/A'}
                    </span>
                ) : <span className="text-gray-300">---</span>
            ),
            sortable: true
        },
        {
            header: "Role",
            accessor: (user) => (
                <span className={cn(
                    "px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                    user.role === "doctor" ? "bg-blue-500 text-white-100" : "bg-yellow-300 text-black-700"
                )}>
                    {user.role}
                </span>
            ),
            sortable: true
        },
        {
            header: "Blocked",
            accessor: (user) => (
                <button
                    onClick={() => handleToggleBlock(user.id)}
                    className={cn(
                        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 outline-none",
                        user.isBlocked ? "bg-red-500" : "bg-gray-200"
                    )}
                >
                    <span
                        className={cn(
                            "inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 shadow-sm",
                            user.isBlocked ? "translate-x-6" : "translate-x-1"
                        )}
                    />
                </button>
            ),
            sortable: true,
            className: "text-center"
        }
    ]

    return (
        <div className="bg-gray-50/50 min-h-full">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#333333] mb-1">List of Users</h1>
                <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                    <Link href="/admin/dashboard" className="text-blue-600 hover:underline">Dashboard</Link>
                    <span>/</span>
                    <span className="text-gray-400">List of Users</span>
                </div>
            </div>

            {/* User Counts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition">
                    <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
                        <Users size={28} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Total Owners</p>
                        <h3 className="text-3xl font-black text-gray-900">{stats.ownerCount}</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition">
                    <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600">
                        <UserCheck size={28} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Total Doctors</p>
                        <h3 className="text-3xl font-black text-gray-900">{stats.doctorCount}</h3>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-blue-900/80">Users List</h2>
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        <SearchInput
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            containerClassName="w-full sm:w-64"
                        />
                        <Dropdown
                            options={[
                                { label: "All Users", value: "all" },
                                { label: "Owners", value: "owner" },
                                { label: "Doctors", value: "doctor" }
                            ]}
                            value={filterRole}
                            onChange={(val) => {
                                setFilterRole(val)
                                setCurrentPage(1)
                            }}
                            className="min-w-[140px]"
                        />
                    </div>
                </div>

                <DataTable
                    columns={columns}
                    data={users}
                    keyExtractor={(u) => u.id}
                    isLoading={apiLoading}
                    emptyMessage="No users found."
                    className="border-0 shadow-none rounded-none"

                />

                <div className="px-6 py-4 bg-gray-50/30">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={Math.ceil(stats.totalUsers / 10) || 1}
                        onPageChange={setCurrentPage}
                        totalEntries={stats.totalUsers}
                        entriesPerPage={10}
                    />
                </div>
            </div>
        </div>




















    )
}
