"use client"

import { useState, useEffect } from "react"
import { User, FileText, ChevronDown, TrendingUp, PieChart as PieIcon, BarChart3, Loader2, IndianRupee } from "lucide-react"
import { adminAnalyticsApi } from "@/lib/api/admin-analytics.api"
import { Line, Bar, Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

export function AdminDashboardContent() {
    const [stats, setStats] = useState<any>(null)
    const [specialtyStats, setSpecialtyStats] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            const [statsRes, specRes] = await Promise.all([
                adminAnalyticsApi.getDashboardStats(),
                adminAnalyticsApi.getSpecialtyStats({})
            ])

            if (statsRes.success) setStats(statsRes)
            if (specRes.success) setSpecialtyStats(specRes.stats || [])
            setIsLoading(false)
        }
        fetchData()
    }, [])

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-40">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Generating Real-time Insights...</p>
            </div>
        )
    }

    const cards = stats?.cards || { totalDoctors: 0, totalPets: 0, totalOwners: 0, totalRevenue: 0 }
    const graphData = stats?.graphData || []

    const lineChartData = {
        labels: graphData.map((d: any) => d.month),
        datasets: [
            {
                label: 'Revenue (₹)',
                data: graphData.map((d: any) => d.revenue),
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true,
                tension: 0.4,
                yAxisID: 'y',
            },
            {
                label: 'Appointments',
                data: graphData.map((d: any) => d.appointments),
                borderColor: 'rgb(244, 63, 94)',
                backgroundColor: 'rgba(244, 63, 94, 0.1)',
                fill: false,
                tension: 0.4,
                yAxisID: 'y1',
            }
        ]
    }

    const lineOptions = {
        responsive: true,
        interaction: { mode: 'index' as const, intersect: false },
        scales: {
            y: { type: 'linear' as const, display: true, position: 'left' as const, title: { display: true, text: 'Revenue (₹)' } },
            y1: { type: 'linear' as const, display: true, position: 'right' as const, grid: { drawOnChartArea: false }, title: { display: true, text: 'Appointments' } },
        }
    }

    const pieData = {
        labels: ['Doctors', 'Pets', 'Pet Owners'],
        datasets: [
            {
                data: [cards.totalDoctors, cards.totalPets, cards.totalOwners],
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(244, 63, 94, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                ],
                borderColor: '#fff',
                borderWidth: 2,
            }
        ]
    }

    return (
        <div className="space-y-8 pb-10">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Total Doctors", value: cards.totalDoctors, icon: User, color: "blue", bg: "bg-blue-50" },
                    { label: "Total Pets", value: cards.totalPets, icon: BarChart3, color: "rose", bg: "bg-rose-50" },
                    { label: "Pet Owners", value: cards.totalOwners, icon: User, color: "emerald", bg: "bg-emerald-50" },
                    { label: "Total Revenue", value: `₹${cards.totalRevenue}`, icon: IndianRupee, color: "amber", bg: "bg-amber-50" },
                ].map((card, i) => (
                    <div key={i} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 ${card.bg} rounded-2xl flex items-center justify-center`}>
                                <card.icon size={24} className={`text-${card.color}-600`} />
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-black text-[#002B49]">{card.value}</div>
                            </div>
                        </div>
                        <div className="text-xs font-black text-gray-400 uppercase tracking-widest">{card.label}</div>
                        <div className={`mt-4 h-1.5 w-full bg-gray-50 rounded-full overflow-hidden`}>
                            <div className={`h-full w-2/3 bg-${card.color}-500 rounded-full`} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue & Appointments Chart */}
                <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 rounded-xl">
                                <TrendingUp className="text-blue-600" size={20} />
                            </div>
                            <h3 className="text-lg font-black text-[#002B49] uppercase tracking-widest">Platform Growth</h3>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-blue-500" />
                                <span className="text-[10px] font-black uppercase text-gray-400">Revenue</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-rose-500" />
                                <span className="text-[10px] font-black uppercase text-gray-400">Appointments</span>
                            </div>
                        </div>
                    </div>
                    <div className="h-[350px]">
                        <Line data={lineChartData} options={lineOptions as any} />
                    </div>
                </div>

                {/* User Distribution Pie Chart */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-rose-50 rounded-xl">
                            <PieIcon className="text-rose-600" size={20} />
                        </div>
                        <h3 className="text-lg font-black text-[#002B49] uppercase tracking-widest">User Base</h3>
                    </div>
                    <div className="h-[300px] flex items-center justify-center">
                        <Pie data={pieData} options={{ maintainAspectRatio: false }} />
                    </div>
                    <div className="mt-6 space-y-3">
                        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                            <span className="text-blue-600">Doctors</span>
                            <span className="text-gray-400">
                                {cards.totalDoctors + cards.totalPets + cards.totalOwners > 0 
                                    ? Math.round((cards.totalDoctors / (cards.totalDoctors + cards.totalPets + cards.totalOwners)) * 100) 
                                    : 0}%
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                            <span className="text-rose-600">Pets</span>
                            <span className="text-gray-400">
                                {cards.totalDoctors + cards.totalPets + cards.totalOwners > 0 
                                    ? Math.round((cards.totalPets / (cards.totalDoctors + cards.totalPets + cards.totalOwners)) * 100) 
                                    : 0}%
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                            <span className="text-emerald-600">Owners</span>
                            <span className="text-gray-400">
                                {cards.totalDoctors + cards.totalPets + cards.totalOwners > 0 
                                    ? Math.round((cards.totalOwners / (cards.totalDoctors + cards.totalPets + cards.totalOwners)) * 100) 
                                    : 0}%
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Specialty Stats Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-50 rounded-xl">
                            <FileText className="text-emerald-600" size={20} />
                        </div>
                        <h3 className="text-lg font-black text-[#002B49] uppercase tracking-widest">Specialty Performance</h3>
                    </div>
                    <div className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                        Updated Live
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left py-4 px-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Specialty Name</th>
                                <th className="text-center py-4 px-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">No of Doctors</th>
                                <th className="text-center py-4 px-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Appointments</th>
                                <th className="text-right py-4 px-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Revenue</th>
                            </tr>
                        </thead>
                        <tbody>
                            {specialtyStats.length > 0 ? specialtyStats.map((service, index) => (
                                <tr key={index} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                    <td className="py-5 px-4">
                                        <span className="text-sm font-black text-blue-600 uppercase tracking-tight">
                                            {service.specialtyName}
                                        </span>
                                    </td>
                                    <td className="py-5 px-4 text-center">
                                        <span className="inline-flex items-center justify-center px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-black">
                                            {service.noOfDoctors}
                                        </span>
                                    </td>
                                    <td className="py-5 px-4 text-center text-sm font-bold text-gray-600">{service.noOfAppointments}</td>
                                    <td className="py-5 px-4 text-right">
                                        <span className="text-sm font-black text-[#002B49]">₹{service.revenue}</span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={4} className="py-10 text-center text-gray-400 text-sm italic">
                                        No specialty data available yet
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
