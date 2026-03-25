"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "../../../lib/redux/hooks"
import { doctorApi } from "../../../lib/api/doctor/doctor.api"
import { setDoctorProfile, setDoctorStats, setDoctorLoading, updateDoctorAvailability } from "../../../lib/redux/slices/doctorSlice"
import { DoctorHeader } from "../../../components/common/layout/doctor/Header"
import { DoctorSidebar } from "../../../components/common/layout/doctor/SideBar"
import { DoctorFooter } from "../../../components/common/layout/doctor/Footer"
import { toast } from "sonner"

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
    const dispatch = useAppDispatch()
    const { user } = useAppSelector((state) => state.auth)
    const { profile, stats, isLoading } = useAppSelector((state) => state.doctor)
    const pathname = usePathname()
    const router = useRouter()
    const [isInitialLoad, setIsInitialLoad] = useState(true)

    useEffect(() => {
        const fetchDoctorData = async () => {
            dispatch(setDoctorLoading(true))
            const [profileRes, statsRes] = await Promise.all([
                doctorApi.getProfile(),
                // Assuming there's a stats endpoint or we extract it from profile
                // For now, let's just use profile and dummy stats if not exists
                Promise.resolve({ success: true, data: { totalPatients: 125, patientsToday: 12, appointmentsToday: 5 } })
            ])

            if (profileRes.success) {
                const doc = profileRes.data
                dispatch(setDoctorProfile({
                    qualification: doc.profile?.designation || "MBBS, MD",
                    specialty: doc.profile?.specialtyId?.name || "General Physician",
                    isActive: doc.isActive,
                    verificationStatus: doc.verificationStatus,
                    appointmentDuration: doc.appointmentDuration || 30
                }))
            } else {
                toast.error(profileRes.error || "Failed to load doctor profile")
            }

            if (statsRes.success) {
                dispatch(setDoctorStats(statsRes.data))
            }
            
            dispatch(setDoctorLoading(false))
            setIsInitialLoad(false)
        }

        if (user && user.role === 'doctor') {
            fetchDoctorData()
        }
    }, [dispatch, user])

    const handleAvailabilityChange = async (value: string) => {
        const isNowAvailable = value === "I am Available Now"
        const response = await doctorApi.updateProfile({ isActive: isNowAvailable })
        if (response.success) {
            dispatch(updateDoctorAvailability(isNowAvailable))
            toast.success(`Status updated to ${value}`)
        } else {
            toast.error(response.error || "Failed to update status")
        }
    }

    const getActiveSection = () => {
        const segments = pathname.split('/')
        return segments[segments.length - 1] || 'dashboard'
    }

    if (isLoading && isInitialLoad) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Loading Workspace...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <DoctorHeader />
            <div className="flex max-w-7xl mx-auto px-6 py-8 gap-12 w-full">
                <DoctorSidebar
                    userName={user?.userName || "Doctor"}
                    email={user?.email || ""}
                    qualification={profile?.qualification || "MBBS, MD"}
                    specialty={profile?.specialty}
                    totalPatients={stats.totalPatients}
                    patientsToday={stats.patientsToday}
                    appointmentsToday={stats.appointmentsToday}
                    availability={profile?.isActive ? "I am Available Now" : "Not Available"}
                    onAvailabilityChange={handleAvailabilityChange}
                    activeSection={getActiveSection()}
                    onSectionChange={(id) => router.push(`/doctor/${id}`)}
                />
                <main className="flex-1 min-w-0">
                    
                    {children}
                </main>
            </div>
            <DoctorFooter />
        </div>
    )
}
