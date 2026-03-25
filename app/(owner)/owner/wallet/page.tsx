"use client"

import { Wallet } from "@/components/common/Wallet"
import Link from "next/link"

export default function OwnerWalletPage() {
    const transactions = [
        {
            id: "1",
            type: "Cancelled" as const,
            appointmentId: "Apt5091",
            date: "23 Oct 18, 03:00 PM",
            amount: 7500
        },
        {
            id: "2",
            type: "Booked" as const,
            appointmentId: "Apt5091",
            date: "23 Oct 18, 03:13 PM",
            amount: -750
        },
        {
            id: "3",
            type: "Rebooked" as const,
            appointmentId: "Apt5091",
            date: "23 Oct 18, 03:13 PM",
            amount: -750
        }
    ]

    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-blue-950 mb-1">My Wallet</h1>
                <nav className="flex items-center gap-2 text-sm text-gray-400">
                    <Link href="/owner/dashboard" className="hover:text-blue-600 transition">Dashboard</Link>
                    <span>/</span>
                    <span className="text-blue-600/60 font-medium">Wallet</span>
                </nav>
            </div>
            
            <Wallet 
                balance={5000} 
                transactions={transactions} 
                onTopup={(amt) => console.log("Topup", amt)} 
            />
        </div>
    )
}
