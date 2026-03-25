"use client"

import { useState } from "react"
import { Plus, Minus, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils/utils"

interface Transaction {
    id: string
    type: "Cancelled" | "Booked" | "Rebooked"
    appointmentId: string
    date: string
    amount: number
}

interface WalletProps {
    balance: number
    transactions: Transaction[]
    onTopup: (amount: number) => void
}

export function Wallet({ balance, transactions, onTopup }: WalletProps) {
    const [topupAmount, setTopupAmount] = useState("")

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-8 bg-white/50 backdrop-blur-sm rounded-3xl">
            <h1 className="text-2xl font-black text-[#002B49]">Wallet Balance - ₹{balance}</h1>

            <div className="flex gap-4 items-center">
                <input
                    type="number"
                    placeholder="Enter Amount"
                    value={topupAmount}
                    onChange={(e) => setTopupAmount(e.target.value)}
                    className="flex-1 max-w-sm px-4 py-3 bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-black"
                />
                <button
                    onClick={() => {
                        onTopup(Number(topupAmount))
                        setTopupAmount("")
                    }}
                    className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-lg active:scale-95"
                >
                    Topup
                </button>
            </div>

            <div className="space-y-4">
                {transactions.map((tx) => (
                    <div 
                        key={tx.id} 
                        className="bg-white p-6 rounded-2xl border border-gray-50 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center gap-6">
                            <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center",
                                tx.amount > 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                            )}>
                                {tx.amount > 0 ? <Plus size={20} strokeWidth={3} /> : <Minus size={20} strokeWidth={3} />}
                            </div>
                            <div className="space-y-1">
                                <h3 className={cn(
                                    "text-xl font-black",
                                    tx.type === "Cancelled" && "text-emerald-500",
                                    tx.type === "Booked" && "text-red-500",
                                    tx.type === "Rebooked" && "text-red-500"
                                )}>
                                    {tx.type}
                                </h3>
                                <p className="text-gray-500 text-sm font-medium">Appointment-ID : {tx.appointmentId}</p>
                                <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">{tx.date}</p>
                            </div>
                        </div>
                        <div className={cn(
                            "text-xl font-black",
                            tx.amount > 0 ? "text-emerald-500" : "text-red-400"
                        )}>
                            {tx.amount > 0 ? "+" : ""}₹{Math.abs(tx.amount)}
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">
                    Showing 1 to 3 of 12 entries
                </p>
                <div className="flex gap-2">
                    <button className="px-4 py-2 text-gray-400 hover:text-gray-600 font-bold text-sm">Previous</button>
                    <button className="w-8 h-8 rounded-lg flex items-center justify-center bg-transparent text-gray-600 font-bold text-sm">1</button>
                    <button className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-600 text-white font-bold text-sm shadow-md">2</button>
                    <button className="w-8 h-8 rounded-lg flex items-center justify-center bg-transparent text-gray-600 font-bold text-sm">3</button>
                    <button className="px-4 py-2 text-gray-600 hover:text-gray-900 font-bold text-sm">Next</button>
                </div>
            </div>
        </div>
    )
}
