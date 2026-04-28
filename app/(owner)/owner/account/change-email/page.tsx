"use client"

import { ChangeEmailForm } from "../../../../../components/owner/ChangeEmailForm"
import Link from "next/link"

export default function ChangeEmailPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-blue-950 mb-1">Account Security</h1>
                    <nav className="flex items-center gap-2 text-sm text-gray-400">
                        <Link href="/owner/dashboard" className="hover:text-blue-600 transition">Dashboard</Link>
                        <span>/</span>
                        <Link href="/owner/account" className="hover:text-blue-600 transition">Account</Link>
                        <span>/</span>
                        <span className="text-blue-600/60 font-medium">Change Email</span>
                    </nav>
                </div>
            </div>

            <div className="max-w-3xl">
                <ChangeEmailForm />
            </div>
        </div>
    )
}
