"use client"

import React, { useState } from 'react'
import { Plus, MoreVertical, MessageSquare, ListTodo } from "lucide-react"
import { cn } from "@/lib/utils/utils"
import Link from 'next/link'

export function ChatAssistantManagement() {
    const [activeTab, setActiveTab] = useState("Symptoms")

    const symptoms = [
        { speciality: "Dermatology", keywords: "Itching, Skin, Redness", severity: "Medium", tips: "Use soothing creams" },
        { speciality: "Orthopedics", keywords: "Limping, Bone, Fracture", severity: "High", tips: "Rest and avoid movement" },
        { speciality: "Dentistry", keywords: "Bad breath, Gum swelling", severity: "Low", tips: "Regular brushing" },
    ]

    const careTasks = [
        { task: "Weekly Grooming", duration: "1 Hour", keywords: "Brush, Fur, Nails" },
        { task: "Exercise Routine", duration: "30 Mins", keywords: "Walk, Run, Play" },
        { task: "Dental Checkup", duration: "15 Mins", keywords: "Teeth, Gums, Breath" },
    ]

    return (
        <div className="space-y-8 font-inter">
            {/* Header / Breadcrumb */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#333333] mb-1">Ai Assistant</h1>
                <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                    <Link href="/admin/dashboard" className="text-blue-600 hover:underline">Dashboard</Link>
                    <span>/</span>
                    <span className="text-gray-400">Ai Assistant</span>
                </div>
            </div>

            <div className="space-y-8">
                {/* Tabs */}
                <div className="flex bg-gray-50/50 p-1.5 rounded-2xl w-fit">
                    {["Symptoms", "Weekly Care Tasks"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                "px-8 py-2.5 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest flex items-center gap-2 whitespace-nowrap",
                                activeTab === tab 
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" 
                                    : "text-gray-400 hover:text-gray-600"
                            )}
                        >
                            {tab === "Symptoms" ? <MessageSquare size={14} /> : <ListTodo size={14} />}
                            {tab}
                        </button>
                    ))}
                </div>

                {activeTab === "Symptoms" ? (
                    <div className="space-y-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-black text-[#002B49] uppercase tracking-tight">Symptoms Mapping</h2>
                            <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all">
                                <Plus className="w-4 h-4" />
                                Add Mapping
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-50">
                                        <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Speciality</th>
                                        <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Keywords</th>
                                        <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Severity</th>
                                        <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Care Tips</th>
                                        <th className="px-6 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {symptoms.map((item, i) => (
                                        <tr key={i} className="hover:bg-blue-50/20 transition-colors">
                                            <td className="px-6 py-5">
                                                <span className="text-[13px] font-black text-blue-500 hover:underline cursor-pointer">
                                                    {item.speciality}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-[13px] font-bold text-gray-500">{item.keywords}</td>
                                            <td className="px-6 py-5">
                                                <span className={cn(
                                                    "px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm",
                                                    item.severity === "High" ? "bg-red-500 text-white" : 
                                                    item.severity === "Medium" ? "bg-yellow-400 text-gray-900" : "bg-emerald-500 text-white"
                                                )}>
                                                    {item.severity}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-[13px] font-bold text-gray-500">{item.tips}</td>
                                            <td className="px-6 py-5 text-right">
                                                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-blue-600">
                                                    <MoreVertical className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-black text-[#002B49] uppercase tracking-tight">Care Tasks Management</h2>
                            <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all">
                                <Plus className="w-4 h-4" />
                                Add Task
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-50">
                                        <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Task Name</th>
                                        <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Duration</th>
                                        <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Keywords</th>
                                        <th className="px-6 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {careTasks.map((item, i) => (
                                        <tr key={i} className="hover:bg-blue-50/20 transition-colors">
                                            <td className="px-6 py-5">
                                                <span className="text-[13px] font-black text-blue-500 hover:underline cursor-pointer">
                                                    {item.task}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-[13px] font-bold text-gray-500">{item.duration}</td>
                                            <td className="px-6 py-5 text-[13px] font-bold text-gray-500">{item.keywords}</td>
                                            <td className="px-6 py-5 text-right">
                                                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-blue-600">
                                                    <MoreVertical className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
