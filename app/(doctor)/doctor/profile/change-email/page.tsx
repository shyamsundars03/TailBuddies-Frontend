"use client"

import { DoctorHeader } from "../../../../../components/common/layout/doctor/Header"
import { ChangeEmailForm } from "../../../../../components/owner/ChangeEmailForm"

export default function DoctorChangeEmailPage() {
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
                <ChangeEmailForm />
            </div>
        </div>
    )
}
