"use client"

import { useState } from "react"
import { Search, Plus, Edit, Trash2 } from "lucide-react"
import { AdminPageContainer } from "../../components/common/layout/admin/PageContainer"

interface Speciality {
  id: number
  name: string
  status: boolean
}

export function SpecialitiesManagement() {
  const [specialities, setSpecialities] = useState<Speciality[]>([
    { id: 1, name: "Orthopaedic", status: true },
    { id: 2, name: "Cardiology", status: true },
    { id: 3, name: "Dermatology", status: false },
    { id: 4, name: "Neurology", status: true },
    { id: 5, name: "Gastroenterology", status: true },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [newSpeciality, setNewSpeciality] = useState("")

  const toggleStatus = (id: number) => {
    setSpecialities(specialities.map((spec) => (spec.id === id ? { ...spec, status: !spec.status } : spec)))
  }

  const handleAddSpeciality = () => {
    if (newSpeciality.trim()) {
      setSpecialities([...specialities, { id: Date.now(), name: newSpeciality, status: true }])
      setNewSpeciality("")
      setShowModal(false)
    }
  }

  return (
    <AdminPageContainer title="Specialities" activeItem="specialities">
      {/* Welcome Section */}
      {/* <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Welcome Admin!</h2>
        <p className="text-gray-500 text-sm">Specialities Management</p>
      </div> */}

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
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
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition"
          >
            <Plus size={18} />
            Add Speciality
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Speciality Name</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-right py-4 px-6 text-sm font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {specialities.map((spec) => (
                <tr key={spec.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <span className="text-sm text-blue-600 font-medium hover:underline cursor-pointer">
                      {spec.name}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => toggleStatus(spec.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                        spec.status ? "bg-red-500" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          spec.status ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2">
                      <button className="px-4 py-1.5 bg-green-100 text-green-700 rounded text-sm font-medium hover:bg-green-200 transition flex items-center gap-1">
                        <Edit size={14} />
                        Edit
                      </button>
                      <button className="px-4 py-1.5 bg-red-100 text-red-700 rounded text-sm font-medium hover:bg-red-200 transition flex items-center gap-1">
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-200 flex items-center justify-between">
          <span className="text-sm text-gray-600">Showing 1 to 5 of 5 entries</span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 transition">
              Previous
            </button>
            <button className="px-3 py-1 bg-yellow-500 text-white rounded text-sm font-medium">1</button>
            <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 transition">
              Next
            </button>
            <span className="ml-2 text-sm text-gray-600">10 / page</span>
          </div>
        </div>
      </div>

      {/* Add Speciality Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Add New Speciality</h3>
            <input
              type="text"
              placeholder="Speciality Name"
              value={newSpeciality}
              onChange={(e) => setNewSpeciality(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSpeciality}
                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm font-medium transition"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminPageContainer>
  )
}
