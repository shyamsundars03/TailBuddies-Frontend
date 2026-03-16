"use client"

import { useState } from "react"
import { Check, Wallet, CreditCard, Banknote } from "lucide-react"
import { cn } from "@/lib/utils/utils"
import { useRouter } from "next/navigation"

export function SummaryPaymentStep({ data, doctorId }: { data: any, doctorId: string }) {
    const router = useRouter()
    const [paymentMethod, setPaymentMethod] = useState("Razerpay")

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-gray-50/50 rounded-lg border border-gray-100 shadow-sm space-y-4">
                        <h3 className="text-sm font-bold text-blue-950 uppercase tracking-widest border-b border-gray-100 pb-4">Summary</h3>
                        <div className="space-y-2 text-xs font-semibold text-gray-500">
                            <div className="flex justify-between"><span className="uppercase text-[10px]">Vet:</span> <span className="text-blue-900 font-bold">Dr. Michael Brown</span></div>
                            <div className="flex justify-between"><span className="uppercase text-[10px]">Pet:</span> <span className="text-blue-900 font-bold">Bruno</span></div>
                            <div className="flex justify-between"><span className="uppercase text-[10px]">Date:</span> <span className="text-blue-900 font-bold">{data.date}</span></div>
                            <div className="flex justify-between"><span className="uppercase text-[10px]">Time:</span> <span className="text-blue-900 font-bold">{data.time}</span></div>
                            <div className="flex justify-between"><span className="uppercase text-[10px]">Mode:</span> <span className="text-blue-900 font-bold">Offline</span></div>
                            <div className="flex justify-between"><span className="uppercase text-[10px]">Service:</span> <span className="text-blue-900 font-bold">{data.type}</span></div>
                            <div className="flex justify-between items-start gap-4">
                                <span className="uppercase text-[10px] shrink-0">Location:</span>
                                <span className="text-blue-900 font-bold text-right">5th Street - 1011 W 5th St, Suite 120, Austin, TX 78703</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="p-8 bg-white rounded-lg border border-gray-100 shadow-md space-y-6">
                        <h3 className="text-sm font-bold text-blue-950 uppercase tracking-widest border-b border-gray-100 pb-4">Price Breakdown</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Consultation Fee</span>
                                <span className="text-lg font-bold text-blue-900">₹400</span>
                            </div>
                            <div className="pt-4 border-t-2 border-dashed border-gray-100 flex justify-between items-center">
                                <span className="text-sm font-black text-blue-950 uppercase tracking-[0.2em]">Total</span>
                                <span className="text-2xl font-black text-blue-600">₹400</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-lg border border-gray-100 shadow-lg p-8 space-y-8">
                <div className="space-y-6">
                    <PaymentOption
                        id="Razerpay"
                        icon={<CreditCard className="text-blue-500" size={20} />}
                        label="Pay with Razerpay"
                        selected={paymentMethod === "Razerpay"}
                        onClick={() => setPaymentMethod("Razerpay")}
                    />
                    <PaymentOption
                        id="Wallet"
                        icon={<Wallet className="text-amber-500" size={20} />}
                        label="Wallet"
                        subLabel="Wallet amount Aplicable"
                        selected={paymentMethod === "Wallet"}
                        onClick={() => setPaymentMethod("Wallet")}
                    />
                    <PaymentOption
                        id="COD"
                        icon={<Banknote className="text-emerald-500" size={20} />}
                        label="Cash on Delivery"
                        subLabel="Not for Online"
                        selected={paymentMethod === "COD"}
                        onClick={() => setPaymentMethod("COD")}
                    />
                </div>
            </div>
        </div>
    )
}

function PaymentOption({ id, icon, label, subLabel, selected, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all duration-300",
                selected
                    ? "border-blue-500 bg-blue-50/10 shadow-sm"
                    : "border-gray-50 bg-white hover:border-blue-100"
            )}
        >
            <div className="flex items-center gap-4">
                <div className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                    selected ? "bg-blue-600 border-blue-600" : "border-gray-200"
                )}>
                    {selected && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                </div>
                <div>
                    <div className="flex items-center gap-3">
                        {icon}
                        <span className={cn(
                            "text-sm font-bold uppercase tracking-wider",
                            selected ? "text-blue-900" : "text-gray-500"
                        )}>{label}</span>
                    </div>
                    {subLabel && (
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 ml-8">{subLabel}</p>
                    )}
                </div>
            </div>
            {selected && <Check size={18} className="text-blue-600" />}
        </button>
    )
}
