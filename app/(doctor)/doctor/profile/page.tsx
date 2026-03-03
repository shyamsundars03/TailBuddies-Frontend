"use client"

import { Suspense, useEffect, useState } from "react"
import { useAppSelector } from "../../../../lib/redux/hooks"
import { useRouter } from "next/navigation"
import { DoctorHeader } from "../../../../components/common/layout/doctor/Header"
import { DoctorSidebar } from "../../../../components/common/layout/doctor/SideBar"
import { Input } from "../../../../components/common/forms/Input"
import { AccountForm } from "../../../../components/owner/AccountForm"

function DoctorProfileInner() {
    const { user } = useAppSelector((state) => state.auth)
    const router = useRouter()
    const [activeSection, setActiveSection] = useState("profile")

    useEffect(() => {
        if (user && user.role?.toLowerCase() !== "doctor") {
            router.replace("/signin")
        }
    }, [user, router])

    const userData = {
        userName: user?.username || "",
        email: user?.email || "",
        gender: user?.gender || "Female",
        phone: user?.phone || "",
    }

    const doctorData = {
        qualification: "B.V.Sc & A.H",
        specialty: "Veterinary Surgeon",
        experience: "8 Years",
        clinicAddress: "456 Vet Clinic Rd, Animalia",
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <DoctorHeader />
            <div className="flex max-w-7xl mx-auto px-6 py-8 gap-8">
                <DoctorSidebar
                    userName={userData.userName}
                    email={userData.email}
                    qualification={doctorData.qualification}
                    specialty={doctorData.specialty}
                    totalPatients={842}
                    patientsToday={12}
                    appointmentsToday={5}
                    availability="I am Available Now"
                    activeSection={activeSection}
                    onSectionChange={setActiveSection}
                />
                <div className="flex-1 space-y-8">
                    <AccountForm initialData={userData} />

                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-8 border-b pb-4">Professional Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input label="Qualification" value={doctorData.qualification} disabled={true} />
                            <Input label="Specialty" value={doctorData.specialty} disabled={true} />
                            <div className="md:col-span-2">
                                <Input label="Clinic Address" value={doctorData.clinicAddress} disabled={true} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function DoctorProfilePage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div></div>}>
            <DoctorProfileInner />
        </Suspense>
    )
}
