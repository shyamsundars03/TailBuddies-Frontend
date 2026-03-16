"use client"

import { Search, ChevronDown, Check } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils/utils"

export function DoctorFilters() {
    const [expandedSections, setExpandedSections] = useState<string[]>(["specialties", "gender", "pricing", "experience", "type", "ratings"])

    const toggleSection = (section: string) => {
        setExpandedSections(prev =>
            prev.includes(section)
                ? prev.filter(s => s !== section)
                : [...prev, section]
        )
    }

    return (
        <div className="space-y-6 bg-white p-6 rounded-lg border border-gray-100 shadow-md">
            <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-blue-950 uppercase tracking-widest">Filter</h2>
                <button className="text-[10px] font-bold text-gray-400 hover:text-blue-600 transition uppercase tracking-wider">Clear All</button>
            </div>

            <div className="space-y-2">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={16} />
                    <input
                        type="text"
                        placeholder="Search Specialty"
                        className="w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                </div>
            </div>

            <FilterSection
                title="Specialities"
                isOpen={expandedSections.includes("specialties")}
                onToggle={() => toggleSection("specialties")}
            >
                <div className="space-y-1 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    <FilterItem label="Urology" count={2} checked />
                    <FilterItem label="Psychiatry" count={7} />
                    <FilterItem label="Cardiology" count={4} />
                    <FilterItem label="Pediatrics" count={5} />
                    <FilterItem label="Neurology" count={3} />
                    <FilterItem label="Pulmonology" count={2} />
                </div>
                <button className="text-[10px] font-extrabold text-blue-600 hover:text-blue-700 transition uppercase tracking-widest mt-4">View More</button>
            </FilterSection>

            <FilterSection
                title="Gender"
                isOpen={expandedSections.includes("gender")}
                onToggle={() => toggleSection("gender")}
            >
                <div className="space-y-2">
                    <FilterItem label="Male" count={12} checked />
                    <FilterItem label="Female" count={18} />
                </div>
            </FilterSection>

            <FilterSection
                title="Pricing"
                isOpen={expandedSections.includes("pricing")}
                onToggle={() => toggleSection("pricing")}
            >
                <div className="space-y-4 px-1">
                    <input type="range" className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                    <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase">
                        <span>Range: $200 - $1000</span>
                    </div>
                </div>
            </FilterSection>

            <FilterSection
                title="Experience"
                isOpen={expandedSections.includes("experience")}
                onToggle={() => toggleSection("experience")}
            >
                <div className="space-y-2">
                    <FilterItem label="2+ Years" checked />
                    <FilterItem label="5+ Years" />
                </div>
            </FilterSection>

            <FilterSection
                title="Consultation type"
                isOpen={expandedSections.includes("type")}
                onToggle={() => toggleSection("type")}
            >
                <div className="space-y-2">
                    <FilterItem label="Normal" checked />
                    <FilterItem label="Emergency" />
                    <FilterItem label="Subscription" />
                </div>
            </FilterSection>

            <FilterSection
                title="Ratings"
                isOpen={expandedSections.includes("ratings")}
                onToggle={() => toggleSection("ratings")}
            >
                <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map(star => (
                        <FilterItem key={star} label={`${star} Star`} checked={star === 5} />
                    ))}
                </div>
            </FilterSection>
        </div>
    )
}

function FilterSection({ title, isOpen, onToggle, children }: { title: string, isOpen: boolean, onToggle: () => void, children: React.ReactNode }) {
    return (
        <div className="space-y-4">
            <button
                onClick={onToggle}
                className="flex items-center justify-between w-full group"
            >
                <span className="text-xs font-black text-blue-900 group-hover:text-blue-600 transition-colors uppercase tracking-wider">{title}</span>
                <ChevronDown size={14} className={cn("text-gray-400 transition-transform duration-300", isOpen && "rotate-180")} />
            </button>
            <div className={cn(
                "overflow-hidden transition-all duration-300",
                isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
            )}>
                {children}
            </div>
        </div>
    )
}

function FilterItem({ label, count, checked }: { label: string, count?: number, checked?: boolean }) {
    return (
        <label className="flex items-center justify-between group cursor-pointer py-1">
            <div className="flex items-center gap-3">
                <div className={cn(
                    "w-4 h-4 rounded-md border transition-all flex items-center justify-center",
                    checked ? "bg-blue-600 border-blue-600 shadow-sm shadow-blue-200" : "bg-white border-gray-200 group-hover:border-blue-400"
                )}>
                    {checked && <Check size={10} className="text-white stroke-[4]" />}
                </div>
                <span className={cn(
                    "text-xs font-bold transition-colors",
                    checked ? "text-blue-950" : "text-gray-500 group-hover:text-blue-600"
                )}>{label}</span>
            </div>
            {count !== undefined && (
                <span className="text-[9px] font-black text-gray-300 bg-gray-50 px-1.5 py-0.5 rounded-md group-hover:bg-blue-50 group-hover:text-blue-400 transition-colors">
                    {count}
                </span>
            )}
        </label>
    )
}
