"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { AdminPageContainer } from "../../components/common/layout/admin/PageContainer"

interface User {
  id: number
  name: string
  phone: string
  email: string
  blocked: boolean
  image: string
}

export function UsersManagement() {
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: "Charlene Reed", phone: "8208329170", email: "charlenereed@gmail.com", blocked: false, image: "👤" },
    {
      id: 2,
      name: "Travis Trimble",
      phone: "2077269974",
      email: "travistrimble@gmail.com",
      blocked: false,
      image: "👤",
    },
    { id: 3, name: "Carl Kelly", phone: "2607247769", email: "carlkelly@gmail.com", blocked: false, image: "👤" },
    { id: 4, name: "Michelle Fairfax", phone: "5043868473", email: "michellef@gmail.com", blocked: false, image: "👤" },
    { id: 5, name: "Gina Moore", phone: "9508297887", email: "moore@gmail.com", blocked: false, image: "👤" },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [filterOwners, setFilterOwners] = useState("Owners")

  const toggleBlocked = (id: number) => {
    setUsers(users.map((user) => (user.id === id ? { ...user, blocked: !user.blocked } : user)))
  }

  return (
    <AdminPageContainer title="User Management" activeItem="users">
      {/* Welcome Section */}
      {/* <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Welcome Admin!</h2>
        <p className="text-gray-500 text-sm">User Management</p>
      </div> */}

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={filterOwners}
              onChange={(e) => setFilterOwners(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Owners</option>
              <option>Doctors</option>
              <option>All Users</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Name</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Phone</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Email</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Block</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-lg">
                        {user.image}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{user.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-700">{user.phone}</td>
                  <td className="py-4 px-6 text-sm text-gray-700">{user.email}</td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => toggleBlocked(user.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                        user.blocked ? "bg-red-500" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          user.blocked ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </td>
                  <td className="py-4 px-6">
                    <button className="px-4 py-1.5 bg-blue-100 text-blue-700 rounded text-sm font-medium hover:bg-blue-200 transition">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-200 flex items-center justify-between">
          <span className="text-sm text-gray-600">Showing 1 to 5 of 50 entries</span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 transition">
              Previous
            </button>
            <button className="px-3 py-1 bg-yellow-500 text-white rounded text-sm font-medium">1</button>
            <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 transition">
              2
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 transition">
              Next
            </button>
            <span className="ml-2 text-sm text-gray-600">10 / page</span>
          </div>
        </div>
      </div>
    </AdminPageContainer>
  )
}
