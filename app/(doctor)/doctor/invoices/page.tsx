"use client"

import InvoiceList from "@/components/doctor/InvoiceList"
import Link from "next/link"

export default function DoctorInvoicesPage() {
    return (
        <div className="space-y-6">
            <div className="mb-8">
                            <h1 className="text-2xl font-black text-[#002B49]">Invoices</h1>
                <nav className="flex items-center gap-2 text-sm text-gray-400">
                    <Link href="/doctor/dashboard" className="hover:text-blue-600 transition">Dashboard</Link>
                    <span>/</span>
                    <span className="text-blue-600/60 font-medium">Invoices</span>
                </nav>
            </div>
            
            <InvoiceList />
        </div>
    )
}
