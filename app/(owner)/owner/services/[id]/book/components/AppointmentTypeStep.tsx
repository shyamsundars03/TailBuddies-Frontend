"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils/utils"

export function AppointmentTypeStep({ data, setData }: { data: any, setData: any }) {
    const types = [
        { id: "Normal", name: "Normal", description: "Standard physical consultation" },
        { id: "Emergency", name: "Emergency", description: "Urgent medical attention needed" },
        { id: "Subscription", name: "Subscription", description: "Covered by your monthly plan" }
    ]

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
                <h2 className="text-lg font-bold text-blue-950">Appointment Type</h2>
                <p className="text-xs text-gray-500 font-medium">Please select the type of consultation you need for your pet.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {types.map((type) => (
                    <button
                        key={type.id}
                        onClick={() => setData({ ...data, type: type.id })}
                        className={cn(
                            "relative flex flex-col items-start p-6 rounded-lg border-2 text-left transition-all duration-300 group hover:shadow-md",
                            data.type === type.id
                                ? "border-blue-500 bg-blue-50/20 shadow-blue-100"
                                : "border-gray-100 bg-white hover:border-blue-200"
                        )}
                    >
                        <div className="flex justify-between items-start w-full mb-4">
                            <span className={cn(
                                "text-sm font-bold uppercase tracking-wider",
                                data.type === type.id ? "text-blue-600" : "text-gray-400 group-hover:text-blue-500"
                            )}>
                                {type.name}
                            </span>
                            <div className={cn(
                                "w-5 h-5 rounded-md border flex items-center justify-center transition-all",
                                data.type === type.id
                                    ? "bg-blue-600 border-blue-600 shadow-sm"
                                    : "bg-white border-gray-200"
                            )}>
                                {data.type === type.id && <Check size={12} className="text-white stroke-[4]" />}
                            </div>
                        </div>
                        <p className="text-[10px] font-bold text-gray-400 group-hover:text-gray-500 uppercase tracking-widest leading-relaxed">
                            {type.description}
                        </p>
                    </button>
                ))}
            </div>
        </div>
    )
}
