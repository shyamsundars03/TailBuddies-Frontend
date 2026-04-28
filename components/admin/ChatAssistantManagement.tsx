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
                    {["Symptoms", "Weekly Care Tasks", "Knowledge Base"].map((tab) => (
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
                            {tab === "Symptoms" ? <MessageSquare size={14} /> : tab === "Knowledge Base" ? <Search size={14} /> : <ListTodo size={14} />}
                            {tab}
                        </button>
                    ))}
                </div>

                {activeTab === "Symptoms" ? (
                    <div className="space-y-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-black text-[#002B49] uppercase tracking-tight">Symptoms Mapping</h2>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Map keywords to veterinary specialties</p>
                            </div>
                            <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all">
                                <Plus className="w-4 h-4" />
                                New Mapping
                            </button>
                        </div>

                        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50/50 border-b border-gray-100">
                                        <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Speciality</th>
                                        <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Keywords</th>
                                        <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Severity</th>
                                        <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Care Tips</th>
                                        <th className="px-6 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {symptoms.map((item, i) => (
                                        <tr key={i} className="group hover:bg-blue-50/20 transition-colors">
                                            <td className="px-6 py-5">
                                                <span className="text-[11px] font-black text-blue-900 group-hover:text-blue-600 transition-colors">
                                                    {item.speciality}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-wrap gap-1">
                                                    {item.keywords.split(',').map(kw => (
                                                        <span key={kw} className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-md text-[9px] font-bold">
                                                            {kw.trim()}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={cn(
                                                    "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                                                    item.severity === "High" ? "bg-rose-50 text-rose-600" : 
                                                    item.severity === "Medium" ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"
                                                )}>
                                                    {item.severity}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-[11px] font-medium text-gray-400 truncate max-w-xs">{item.tips}</td>
                                            <td className="px-6 py-5 text-right">
                                                <button className="p-2 hover:bg-white rounded-lg transition-all text-gray-400 hover:text-blue-600 shadow-sm border border-transparent hover:border-blue-100">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : activeTab === "Knowledge Base" ? (
                    <div className="space-y-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-black text-[#002B49] uppercase tracking-tight">AI Knowledge Base</h2>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Upload documents to enhance AI responses</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                    <input 
                                        type="text" 
                                        placeholder="Search documents..."
                                        className="pl-10 pr-4 py-2.5 bg-white border border-gray-100 rounded-xl text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-64"
                                    />
                                </div>
                                <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all">
                                    <Plus className="w-4 h-4" />
                                    Upload File
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { name: "Vaccination_Protocols.pdf", size: "2.4 MB", type: "PDF", date: "22 Apr 2024" },
                                { name: "Emergency_Care_Guide.docx", size: "1.1 MB", type: "DOCX", date: "20 Apr 2024" },
                                { name: "Common_Breed_Diseases.json", size: "450 KB", type: "DATA", date: "15 Apr 2024" }
                            ].map((file, i) => (
                                <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 hover:shadow-xl hover:shadow-blue-500/5 transition-all group">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                            <Search size={20} />
                                        </div>
                                        <button className="text-gray-300 hover:text-gray-600">
                                            <MoreVertical size={16} />
                                        </button>
                                    </div>
                                    <h3 className="text-sm font-black text-[#002B49] mb-1 truncate">{file.name}</h3>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{file.size}</span>
                                        <span className="w-1 h-1 bg-gray-200 rounded-full" />
                                        <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">{file.type}</span>
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
                                        <span className="text-[9px] font-bold text-gray-400 uppercase">{file.date}</span>
                                        <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                                            <CheckCircle2 size={10} /> Indexed
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-black text-[#002B49] uppercase tracking-tight">Care Tasks Management</h2>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Configure automated care plans for owners</p>
                            </div>
                            <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all">
                                <Plus className="w-4 h-4" />
                                New Task
                            </button>
                        </div>

                        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50/50 border-b border-gray-100">
                                        <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Task Name</th>
                                        <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Duration</th>
                                        <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Keywords</th>
                                        <th className="px-6 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {careTasks.map((item, i) => (
                                        <tr key={i} className="group hover:bg-blue-50/20 transition-colors">
                                            <td className="px-6 py-5">
                                                <span className="text-[11px] font-black text-blue-900 group-hover:text-blue-600 transition-colors">
                                                    {item.task}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-[11px] font-bold text-gray-500">{item.duration}</td>
                                            <td className="px-6 py-5 text-[11px] font-bold text-gray-400">{item.keywords}</td>
                                            <td className="px-6 py-5 text-right">
                                                <button className="p-2 hover:bg-white rounded-lg transition-all text-gray-400 hover:text-blue-600 shadow-sm border border-transparent hover:border-blue-100">
                                                    <Edit className="w-4 h-4" />
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

function CheckCircle2(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    )
}

function Edit(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
    )
}

function Search(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
        </svg>
    )
}
