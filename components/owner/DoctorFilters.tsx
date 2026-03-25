"use client"

import { Search, ChevronDown, Check } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils/utils"

interface DoctorFiltersProps {
    activeFilters: {
        specialty: string;
        gender: string;
        experienceYears: string;
    };
    onFilterChange: (key: string, value: string) => void;
    onClear: () => void;
    specialties: any[];
}

export function DoctorFilters({ activeFilters, onFilterChange, onClear, specialties }: DoctorFiltersProps) {
    const [expandedSections, setExpandedSections] = useState<string[]>(["specialties", "gender", "experience"])

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
                <button 
                    onClick={onClear}
                    className="text-[10px] font-bold text-gray-400 hover:text-blue-600 transition uppercase tracking-wider"
                >
                    Clear All
                </button>
            </div>

            <FilterSection
                title="Specialities"
                isOpen={expandedSections.includes("specialties")}
                onToggle={() => toggleSection("specialties")}
            >
                <div className="space-y-1 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                    {specialties.map((spec) => (
                        <div key={spec._id} onClick={() => onFilterChange('specialty', activeFilters.specialty === spec._id ? '' : spec._id)}>
                            <FilterItem 
                                label={spec.name} 
                                checked={activeFilters.specialty === spec._id} 
                            />
                        </div>
                    ))}
                    {specialties.length === 0 && <p className="text-[10px] text-gray-400 italic">No specialties found</p>}
                </div>
            </FilterSection>

            <FilterSection
                title="Gender"
                isOpen={expandedSections.includes("gender")}
                onToggle={() => toggleSection("gender")}
            >
                <div className="space-y-2">
                    <div onClick={() => onFilterChange('gender', activeFilters.gender === 'male' ? '' : 'male')}>
                        <FilterItem label="Male" checked={activeFilters.gender === 'male'} />
                    </div>
                    <div onClick={() => onFilterChange('gender', activeFilters.gender === 'female' ? '' : 'female')}>
                        <FilterItem label="Female" checked={activeFilters.gender === 'female'} />
                    </div>
                </div>
            </FilterSection>

            <FilterSection
                title="Experience"
                isOpen={expandedSections.includes("experience")}
                onToggle={() => toggleSection("experience")}
            >
                <div className="space-y-2">
                    <div onClick={() => onFilterChange('experienceYears', activeFilters.experienceYears === '2' ? '' : '2')}>
                        <FilterItem label="2+ Years" checked={activeFilters.experienceYears === '2'} />
                    </div>
                    <div onClick={() => onFilterChange('experienceYears', activeFilters.experienceYears === '5' ? '' : '5')}>
                        <FilterItem label="5+ Years" checked={activeFilters.experienceYears === '5'} />
                    </div>
                    <div onClick={() => onFilterChange('experienceYears', activeFilters.experienceYears === '10' ? '' : '10')}>
                        <FilterItem label="10+ Years" checked={activeFilters.experienceYears === '10'} />
                    </div>
                </div>
            </FilterSection>

            {/* Hidden sections as per requirements */}
            <div className="pt-4 border-t border-gray-50 opacity-40 grayscale pointer-events-none">
                <p className="text-[9px] font-bold text-gray-400 uppercase mb-4 tracking-tighter">Planned Filters:</p>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-gray-400 uppercase">Consultation type</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-gray-400 uppercase">Ratings</span>
                    </div>
                </div>
            </div>
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
