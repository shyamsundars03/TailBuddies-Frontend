"use client"

import { DoctorHeader } from "../../../../../components/common/layout/doctor/Header"
import { ChangePasswordForm } from "../../../../../components/owner/ChangePasswordForm"

export default function DoctorChangePasswordPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <DoctorHeader />
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="mb-6">
                    <button
                        onClick={() => window.history.back()}
                        className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
                    >
                        ← Back to Profile
                    </button>
                </div>
                <ChangePasswordForm />
            </div>
        </div>
    )
}
