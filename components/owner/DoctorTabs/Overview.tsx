"use client"

import { CheckCircle2 } from "lucide-react"

export function Overview() {
    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            <section className="space-y-4">
                <h3 className="text-lg font-black text-blue-950 uppercase tracking-tight">About Me</h3>
                <p className="text-gray-500 font-medium leading-relaxed text-sm">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
            </section>

            <section className="space-y-6">
                <h3 className="text-lg font-black text-blue-950 uppercase tracking-tight">Education</h3>
                <div className="space-y-8 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100">
                    <EducationItem
                        university="American Dental Medical University"
                        degree="BDS"
                        period="1998 - 2003"
                    />
                    <EducationItem
                        university="American Dental Medical University"
                        degree="MDS"
                        period="2003 - 2005"
                    />
                </div>
            </section>

            <section className="space-y-6">
                <h3 className="text-lg font-black text-blue-950 uppercase tracking-tight">Work & Experience</h3>
                <div className="space-y-8 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100">
                    <ExperienceItem
                        place="Glowing Smiles Family Dental Clinic"
                        period="2010 - Present (5 years)"
                    />
                    <ExperienceItem
                        place="Comfort Care Dental Clinic"
                        period="2007 - 2010 (3 years)"
                    />
                    <ExperienceItem
                        place="Dream Smile Dental Practice"
                        period="2005 - 2007 (2 years)"
                    />
                </div>
            </section>

            <section className="space-y-6">
                <h3 className="text-lg font-black text-blue-950 uppercase tracking-tight">Specializations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-12">
                    {["Children Care", "Dental Care", "Oral and Maxillofacial Surgery", "Orthodontist", "Periodontist", "Prosthodontics"].map((spec) => (
                        <div key={spec} className="flex items-center gap-3 group">
                            <div className="w-1.5 h-1.5 bg-gray-300 rounded-full group-hover:bg-blue-600 transition-colors"></div>
                            <span className="text-xs font-bold text-gray-500 group-hover:text-blue-950 transition-colors uppercase tracking-wider">{spec}</span>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}

function EducationItem({ university, degree, period }: { university: string, degree: string, period: string }) {
    return (
        <div className="relative pl-8 group">
            <div className="absolute left-0 top-1 w-4 h-4 rounded-full border-2 border-gray-100 bg-white group-hover:border-blue-600 group-hover:scale-110 transition-all z-10"></div>
            <div className="space-y-1">
                <h4 className="text-sm font-black text-blue-900 uppercase tracking-tight">{university}</h4>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{degree}</p>
                <p className="text-[10px] font-black text-blue-500 bg-blue-50 inline-block px-2 py-0.5 rounded-full uppercase tracking-widest">{period}</p>
            </div>
        </div>
    )
}

function ExperienceItem({ place, period }: { place: string, period: string }) {
    return (
        <div className="relative pl-8 group">
            <div className="absolute left-0 top-1 w-4 h-4 rounded-full border-2 border-gray-100 bg-white group-hover:border-blue-600 group-hover:scale-110 transition-all z-10"></div>
            <div className="space-y-1">
                <h4 className="text-sm font-black text-blue-900 uppercase tracking-tight">{place}</h4>
                <p className="text-[10px] font-black text-blue-500 bg-blue-50 inline-block px-2 py-0.5 rounded-full uppercase tracking-widest">{period}</p>
            </div>
        </div>
    )
}
