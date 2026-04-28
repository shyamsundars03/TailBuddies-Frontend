"use client"

import { AccountForm } from "../../../../components/owner/AccountForm"
import { useAppSelector } from "../../../../lib/redux/hooks"
import Link from "next/link"

export default function OwnerAccountPage() {
    const { user } = useAppSelector((state) => state.auth)

    const userData = {
        username: user?.username || "",
        email: user?.email || "",
        gender: user?.gender || "Female",
        phone: user?.phone || "",
        address: user?.address || "",
        city: user?.city || "",
        state: user?.state || "",
        country: user?.country || "",
        pincode: user?.pincode || "",
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-blue-950 mb-1">Account</h1>
                    <nav className="flex items-center gap-2 text-sm text-gray-400">
                        <Link href="/owner/dashboard" className="hover:text-blue-600 transition">Dashboard</Link>
                        <span>/</span>
                        <span className="text-blue-600/60 font-medium">Account Details</span>
                    </nav>
                </div>
            </div>
            <AccountForm initialData={userData} />
        </div>
    )
}
