"use client"

import { Video, MessageSquare, Calendar, Users, Clock, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { appointmentApi } from "../../lib/api/appointment.api"
import { toast } from "sonner"
import Image from "next/image"
import Link from "next/link"
import { cn, formatDate } from "@/lib/utils/utils"

const DoctorDashboardContent = () => {
    const [stats, setStats] = useState({
        totalPatients: 0,
        appointmentsToday: 0,
        avgConsultation: "30 min" // Constant for now
    })
    const [appointments, setAppointments] = useState<any[]>([])
    const [upcomingAppointment, setUpcomingAppointment] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchDashboardData()
    }, [])

    const fetchDashboardData = async () => {
        setIsLoading(true)
        try {
            // Fetch both Booked and Confirmed for the dashboard to get a full view
            const [bookedRes, confirmedRes] = await Promise.all([
                appointmentApi.getDoctorAppointments("booked", 1, 100),
                appointmentApi.getDoctorAppointments("confirmed", 1, 100)
            ])

            const allApts = [
                ...(bookedRes.success ? bookedRes.data : []),
                ...(confirmedRes.success ? confirmedRes.data : [])
            ]

            // Calculate Stats
            const uniquePets = new Set(allApts.map((a: any) => a.petId?._id)).size
            
            const today = new Date().toISOString().split('T')[0]
            const todayApts = allApts.filter((a: any) => 
                a.appointmentDate?.split('T')[0] === today
            ).length

            setStats({
                totalPatients: uniquePets,
                appointmentsToday: todayApts,
                avgConsultation: "30 min"
            })

            // Sort by date and time
            const sorted = allApts.sort((a, b) => {
                const dateA = new Date(a.appointmentDate + 'T' + a.appointmentStartTime).getTime()
                const dateB = new Date(b.appointmentDate + 'T' + b.appointmentStartTime).getTime()
                return dateA - dateB
            })

            setAppointments(sorted.slice(0, 3))

            // Find the VERY NEXT appointment (Confirmed or Booked, closest to now)
            const now = new Date().getTime()
            const next = sorted.find(a => {
                const aptTime = new Date(a.appointmentDate + 'T' + a.appointmentStartTime).getTime()
                return aptTime > now
            })
            setUpcomingAppointment(next || sorted[0]) // fallback to first sorted if all in past? or null.

        } catch (error) {
            console.error("Dashboard data fetch error", error)
            toast.error("Failed to load dashboard data")
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-40">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                <p className="mt-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Loading Dashboard...</p>
            </div>
        )
    }

    return (
        <div className="w-full space-y-8">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Patients</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalPatients}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                        <Calendar size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Appointments Today</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.appointmentsToday}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                        <Clock size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Avg. Consultation</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.avgConsultation}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-gray-900">Recent Appointments</h2>
                        <Link href="/doctor/appointments" className="text-sm font-bold text-blue-600 hover:underline">View All</Link>
                    </div>
                    <div className="space-y-4">
                        {appointments.length > 0 ? (
                            appointments.map((apt: any, i) => (
                                <Link href={`/doctor/appointments/${apt._id}`} key={apt._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center font-bold text-gray-400 border border-gray-100 overflow-hidden relative">
                                            {apt.petId?.picture ? (
                                                <Image src={apt.petId.picture} alt={apt.petId.name} fill className="object-cover" />
                                            ) : (
                                                apt.petId?.name?.charAt(0) || "P"
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition">{apt.petId?.name || "Unknown Pet"}</p>
                                            <p className="text-xs text-gray-500">{apt.serviceType} • {apt.appointmentStartTime}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <span className={cn(
                                            "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                            apt.status === "booked" ? "bg-amber-100 text-amber-700" :
                                            apt.status === "confirmed" ? "bg-blue-100 text-blue-700" :
                                            "bg-green-100 text-green-700"
                                        )}>
                                            {apt.status}
                                        </span>
                                        <span className="text-[10px] text-gray-400 font-medium">{formatDate(apt.appointmentDate)}</span>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="text-center py-10 text-gray-400 font-medium border border-dashed border-gray-200 rounded-xl">
                                No upcoming appointments found
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-[#002B49] rounded-2xl p-8 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-xl font-bold mb-2">Upcoming Appointment</h2>
                        {upcomingAppointment ? (
                            <>
                                <p className="text-blue-100 text-sm mb-6">You have an appointment on {formatDate(upcomingAppointment.appointmentDate)} at {upcomingAppointment.appointmentStartTime}</p>
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-2xl border border-white/10 overflow-hidden relative">
                                        {upcomingAppointment.petId?.picture ? (
                                            <Image src={upcomingAppointment.petId.picture} alt={upcomingAppointment.petId.name} fill className="object-cover" />
                                        ) : (
                                            "🐶"
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg">{upcomingAppointment.petId?.name} ({upcomingAppointment.petId?.breed})</p>
                                        <p className="text-blue-200 text-sm">Owner: {upcomingAppointment.ownerId?.username}</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <Link 
                                        href={`/doctor/appointments/${upcomingAppointment._id}`}
                                        className="flex-1 bg-white text-[#002B49] font-bold py-3 rounded-xl transition hover:bg-blue-50 text-center"
                                    >
                                        Start Consultation
                                    </Link>
                                    <Link 
                                        href={`/doctor/appointments`}
                                        className="flex-1 bg-white/10 text-white font-bold py-3 rounded-xl border border-white/20 transition hover:bg-white/20 text-center"
                                    >
                                        View All
                                    </Link>
                                </div>
                            </>
                        ) : (
                            <div className="py-10 text-center text-blue-200/50 italic border border-white/10 rounded-xl">
                                No upcoming appointments scheduled
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DoctorDashboardContent
