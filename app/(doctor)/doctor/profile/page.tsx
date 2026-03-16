"use client"

import { Suspense, useEffect, useState } from "react"
import { useAppSelector, useAppDispatch } from "../../../../lib/redux/hooks"
import { useRouter } from "next/navigation"
import { DoctorHeader } from "../../../../components/common/layout/doctor/Header"
import { DoctorSidebar } from "../../../../components/common/layout/doctor/SideBar"
import { DoctorPageContainer } from "../../../../components/common/layout/doctor/PageContainer"
import { doctorApi } from "../../../../lib/api/doctor/doctor.api"
import { toast } from "sonner"
import { cn } from "@/lib/utils/utils"

// Tab Components
import { BasicDetailsTab } from "../../../../components/doctor/profile/BasicDetailsTab"
import { ExperienceTab } from "../../../../components/doctor/profile/ExperienceTab"
import { EducationTab } from "../../../../components/doctor/profile/EducationTab"
import { CertificatesTab } from "../../../../components/doctor/profile/CertificatesTab"
import { BusinessHoursTab } from "../../../../components/doctor/profile/BusinessHoursTab"
import { ClinicDetailsTab } from "../../../../components/doctor/profile/ClinicDetailsTab"

import { Shield, ShieldCheck, ShieldAlert, ShieldQuestion, Loader2 } from "lucide-react"

const tabs = ["Basic Details", "Clinic Info", "Experience", "Education", "Certificates", "Business Hours"]

function DoctorProfileInner() {
    const { user } = useAppSelector((state) => state.auth)
    const router = useRouter()
    const [activeTab, setActiveTab] = useState("Basic Details")
    const [doctorData, setDoctorData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [verifying, setVerifying] = useState(false)

    useEffect(() => {
        if (user) {
            if (user.role?.toLowerCase() !== "doctor") {
                router.replace("/signin")
                return
            }
            fetchDoctorProfile()
        }
    }, [user, router])

    const fetchDoctorProfile = async () => {
        setLoading(true)
        const response = await doctorApi.getProfile()
        if (response.success) {
            setDoctorData(response.data)
        } else {
            toast.error("Failed to load doctor profile")
        }
        setLoading(false)
    }

    const handleUpdate = (updatedData: any) => {
        setDoctorData(updatedData)
    }

    const validateProfileCompletion = () => {
        const errors = [];
        
        if (!doctorData?.experience || doctorData.experience.length === 0) {
            errors.push("At least one experience record is required");
        }
        
        if (!doctorData?.education || doctorData.education.length === 0) {
            errors.push("At least one education record is required");
        }
        
        if (!doctorData?.certificates || doctorData.certificates.length === 0) {
            errors.push("At least one certificate record is required");
        }
        
        if (!doctorData?.clinicInfo?.clinicName || !doctorData?.clinicInfo?.address || !doctorData?.clinicInfo?.clinicPic) {
            errors.push("Clinic name, address, and image are required");
        }
        
        // Note: Business hours are intentionally excluded as per user request
        
        return errors;
    };

    const handleRequestVerification = async () => {
        const validationErrors = validateProfileCompletion();
        
        if (validationErrors.length > 0) {
            validationErrors.forEach(err => toast.error(err));
            return;
        }

        setVerifying(true)
        const response = await doctorApi.requestVerification()
        if (response.success) {
            toast.success("Verification request submitted successfully")
            setDoctorData(response.data)
        } else {
            toast.error(response.error || "Failed to submit verification request")
        }
        setVerifying(false)
    }

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'verified':
                return { 
                    label: 'Verified Doctor', 
                    color: 'text-green-600 bg-green-50 border-green-200', 
                    icon: <ShieldCheck size={16} />,
                    canVerify: false
                }
            case 'under_review':
                return { 
                    label: 'Verification in Progress', 
                    color: 'text-amber-600 bg-amber-50 border-amber-200', 
                    icon: <Loader2 size={16} className="animate-spin" />,
                    canVerify: false
                }
            case 'rejected':
                return { 
                    label: 'Verification Rejected', 
                    color: 'text-red-600 bg-red-50 border-red-200', 
                    icon: <ShieldAlert size={16} />,
                    canVerify: true
                }
            default:
                return { 
                    label: 'Profile Incomplete', 
                    color: 'text-gray-600 bg-gray-50 border-gray-200', 
                    icon: <ShieldQuestion size={16} />,
                    canVerify: true
                }
        }
    }

    const isEditable = true; // Always allow editing, backend will handle status resets

    const renderTabContent = () => {
        if (loading) return (
            <div className="flex justify-center items-center py-5">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
        
        const commonProps = {
            doctor: doctorData,
            onUpdate: handleUpdate,
            isEditable: isEditable
        }

        switch (activeTab) {
            case "Basic Details":
                return <BasicDetailsTab user={user} {...commonProps} />
            case "Clinic Info":
                return <ClinicDetailsTab {...commonProps} />
            case "Experience":
                return <ExperienceTab {...commonProps} />
            case "Education":
                return <EducationTab {...commonProps} />
            case "Certificates":
                return <CertificatesTab {...commonProps} />
            case "Business Hours":
                return <BusinessHoursTab {...commonProps} />
            default:
                return null
        }
    }

    const statusConfig = getStatusConfig(doctorData?.profileStatus || 'incomplete')

    return (
        <div className="min-h-screen bg-white">
            <DoctorHeader />
            <DoctorPageContainer title="PROFILE SETTINGS">
                <DoctorSidebar
                    userName={user?.username || ""}
                    email={user?.email || ""}
                    qualification={doctorData?.education?.[0]?.degree || "N/A"}
                    specialty={doctorData?.profile?.designation || "N/A"}
                    totalPatients={842}
                    patientsToday={12}
                    appointmentsToday={5}
                    availability="Available"
                    activeSection="Profile"
                />

                <div className="flex-1 bg-white shadow-md border border-gray-200 rounded-2xl ">
                    <div className="w-full max-w-5xl mx-auto px-2 sm:px-6 lg:px-2 py-2">
                        {/* Status Section */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 p-6 bg-gray-50/50 border border-gray-100 rounded-3xl">
                            <div className="flex items-center gap-4">
                                <div className={cn("flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold", statusConfig.color)}>
                                    {statusConfig.icon}
                                    {statusConfig.label.toUpperCase()}
                                </div>
                                {doctorData?.profileStatus === 'rejected' && doctorData?.rejectionReason && (
                                    <p className="text-xs text-red-500 font-bold max-w-xs line-clamp-2">
                                        Reason: {doctorData.rejectionReason}
                                    </p>
                                )}
                            </div>
                            {statusConfig.canVerify && (
                                <button
                                    onClick={handleRequestVerification}
                                    disabled={verifying}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {verifying ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            SUBMITTING...
                                        </>
                                    ) : (
                                        <>
                                            <Shield size={18} />
                                            GET VERIFIED
                                        </>
                                    )}
                                </button>
                            )}
                        </div>

                        {/* Tab Navigation */}
                        <div className="flex overflow-x-auto gap-1 mb-8 bg-gray-200/50 p-1.5 rounded-2xl no-scrollbar">
                            {tabs.map((tab) => {
                                const sectionKey = tab.toLowerCase().replace(" ", "") === "clinicinfo" ? "clinic" : tab.toLowerCase().replace(" ", "")
                                const isSectionVerified = doctorData?.verificationStatus?.[sectionKey]
                                
                                return (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={cn(
                                            "relative px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex-1 flex items-center justify-center gap-2",
                                            activeTab === tab
                                                ? "bg-white text-blue-600 shadow-sm"
                                                : "text-gray-500 hover:text-gray-900"
                                        )}
                                    >
                                        {tab}
                                        {isSectionVerified && (
                                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                                        )}
                                    </button>
                                )
                            })}
                        </div>

                        {/* Content Card */}
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-10">
                            <Suspense fallback={<div className="py-10 text-center text-gray-400">Loading Tab...</div>}>
                                {renderTabContent()}
                            </Suspense>
                        </div>
                    </div>
                </div>
            </DoctorPageContainer>
        </div>
    )
}

export default function DoctorProfilePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DoctorProfileInner />
        </Suspense>
    )
}
