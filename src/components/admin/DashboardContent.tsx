"use client"

import { User, FileText, ChevronDown } from "lucide-react"

const revenueData = [
  { month: "Jan 23", value: 60 },
  { month: "July", value: 80 },
  { month: "April", value: 100 },
  { month: "Sep", value: 65 },
  { month: "Oct", value: 50 },
  { month: "Nov", value: 90 },
  { month: "Jan 24", value: 120 },
]

const statusData = [
  { month: "Jan", active: 70, inactive: 40 },
  { month: "Feb", active: 50, inactive: 60 },
  { month: "Mar", active: 80, inactive: 30 },
  { month: "Apr", active: 65, inactive: 45 },
]

const serviceData = [
  { name: "Grooming", appointments: 90, earned: 107, earnings: "₹4560" },
  { name: "Gastrointestional", appointments: 78, earned: 139, earnings: "₹4660" },
  { name: "Orthopaedic", appointments: 77, earned: 171, earnings: "₹9800" },
  { name: "Dermatologist", appointments: 8, earned: 28, earnings: "₹1490" },
]

export function AdminDashboardContent() {
  const maxRevenue = Math.max(...revenueData.map((d) => d.value))
  const maxStatus = 100

  return (
    <>
      {/* Welcome Section */}
      {/* <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Welcome Admin!</h2>
        <p className="text-gray-500 text-sm">Dashboard</p>
      </div> */}

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {/* Doctors */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <User size={24} className="text-blue-600" />
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-800">168</div>
            </div>
          </div>
          <div className="text-sm font-medium text-gray-600">Doctors</div>
          <div className="mt-2 h-1 bg-blue-600 rounded"></div>
        </div>

        {/* Patients */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <User size={24} className="text-yellow-600" />
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-800">562323</div>
            </div>
          </div>
          <div className="text-sm font-medium text-gray-600">Patients</div>
          <div className="mt-2 h-1 bg-yellow-500 rounded"></div>
        </div>

        {/* Clinics */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <FileText size={24} className="text-green-600" />
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-800">487</div>
            </div>
          </div>
          <div className="text-sm font-medium text-gray-600">Clinics</div>
          <div className="mt-2 h-1 bg-green-600 rounded"></div>
        </div>

        {/* Appointment */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <User size={24} className="text-red-600" />
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-800">485</div>
            </div>
          </div>
          <div className="text-sm font-medium text-gray-600">Appointment</div>
          <div className="mt-2 h-1 bg-red-600 rounded"></div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Revenue</h3>
        <div className="relative h-64">
          <svg className="w-full h-full" viewBox="0 0 700 200" preserveAspectRatio="none">
            <defs>
              <linearGradient id="revenueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#93C5FD" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#93C5FD" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <path
              d={`M 0,${200 - (revenueData[0].value / maxRevenue) * 160} ${revenueData.map((d, i) => `L ${(i * 700) / (revenueData.length - 1)},${200 - (d.value / maxRevenue) * 160}`).join(" ")} L 700,200 L 0,200 Z`}
              fill="url(#revenueGradient)"
              stroke="#3B82F6"
              strokeWidth="2"
            />
          </svg>
          <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4 text-xs text-gray-500">
            {revenueData.map((d, i) => (
              <span key={i}>{d.month}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Status Chart */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Status</h3>
        <div className="relative h-64">
          <svg className="w-full h-full" viewBox="0 0 700 200" preserveAspectRatio="none">
            {/* Active line */}
            <polyline
              points={statusData
                .map((d, i) => `${(i * 700) / (statusData.length - 1)},${200 - (d.active / maxStatus) * 160}`)
                .join(" ")}
              fill="none"
              stroke="#3B82F6"
              strokeWidth="2"
            />
            {/* Inactive line */}
            <polyline
              points={statusData
                .map((d, i) => `${(i * 700) / (statusData.length - 1)},${200 - (d.inactive / maxStatus) * 160}`)
                .join(" ")}
              fill="none"
              stroke="#F59E0B"
              strokeWidth="2"
            />
          </svg>
          <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4 text-xs text-gray-500">
            {statusData.map((d, i) => (
              <span key={i}>{d.month}</span>
            ))}
          </div>
        </div>
        <div className="flex justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            <span className="text-sm text-gray-600">Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Inactive</span>
          </div>
        </div>
      </div>

      {/* Based on Service Table */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Based on Service</h3>

        {/* Filters */}
        <div className="flex gap-3 mb-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition flex items-center gap-2">
            Skin and Grooming
            <ChevronDown size={16} />
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded text-sm font-medium hover:bg-gray-200 transition">
            Emergency
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded text-sm font-medium hover:bg-gray-200 transition">
            Subscription
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded text-sm font-medium hover:bg-gray-200 transition flex items-center gap-2">
            By Schedule - 14/1/2020
            <ChevronDown size={16} />
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded text-sm font-medium hover:bg-gray-200 transition flex items-center gap-2">
            Filter by
            <ChevronDown size={16} />
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Specialty Name</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">No of Appointment</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Earning</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Total Earning</th>
              </tr>
            </thead>
            <tbody>
              {serviceData.map((service, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <span className="text-sm text-blue-600 font-medium hover:underline cursor-pointer">
                      {service.name}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">{service.appointments}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{service.earned}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{service.earnings}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
          <span className="text-sm text-gray-600">Showing 1 to 4 of 10 entries</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50">
              Previous
            </button>
            <button className="px-3 py-1 bg-red-600 text-white rounded text-sm font-medium">1</button>
            <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50">
              2
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  )
}