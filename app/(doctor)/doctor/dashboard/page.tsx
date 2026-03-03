"use client"

import { DoctorHeader } from "../../../../components/common/layout/doctor/Header"
import { DoctorSidebar } from "../../../../components/common/layout/doctor/SideBar"
import { DoctorFooter } from "../../../../components/common/layout/doctor/Footer"
// import { DoctorPageContainer } from "../../../../components/common/layout/doctor/PageContainer"
import { DoctorDashboardContent } from "../../../../components/doctor/DoctorDashboardContent"

export default function DoctorDashboard() {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <DoctorHeader />
                        <div className="flex max-w-6xl mx-32.5 px-2 py-8 gap-12">
                <DoctorSidebar
                    userName="Doctor"
                    email="doctor@example.com"
                    qualification="MBBS, MD"
                    specialty="General Physician"
                    totalPatients={125}
                    patientsToday={12}
                    appointmentsToday={5}
                    availability="I am Available Now"
                    activeSection="dashboard"
                    onSectionChange={() => { }}
                />
                {/* <DoctorPageContainer title="Dashboard"> */}
                    <DoctorDashboardContent />
                {/* </DoctorPageContainer> */}
            </div>
            <DoctorFooter />
        </div>
    )
}
