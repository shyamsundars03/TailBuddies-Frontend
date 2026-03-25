"use client"

import { CheckCircle2 } from "lucide-react"

export function Overview({ doctor }: { doctor: any }) {
    const specializations = doctor.profile?.specializations || []
    const education = doctor.education || []
    const experience = doctor.experience || []
    
    return (
        <div className="space-y-12 animate-in fade-in duration-500">
            <section className="space-y-4">
                <h3 className="text-lg font-black text-blue-950 uppercase tracking-tight">About Me</h3>
                <p className="text-gray-500 font-medium leading-relaxed text-sm">
                    {doctor.profile?.about || doctor.profile?.bio || "No biography provided yet."}
                </p>
            </section>

            <section className="space-y-6">
                <h3 className="text-lg font-black text-blue-950 uppercase tracking-tight">Education</h3>
                <div className="space-y-6">
                    {education.length > 0 ? (
                        education.map((edu: any, idx: number) => (
                            <EducationItem 
                                key={idx}
                                university={edu.institute}
                                degree={edu.degree}
                                period={`${new Date(edu.startDate).getFullYear()} - ${new Date(edu.endDate).getFullYear()}`}
                            />
                        ))
                    ) : (
                        <p className="text-xs text-gray-400 italic">No education history listed</p>
                    )}
                </div>
            </section>

            <section className="space-y-6">
                <h3 className="text-lg font-black text-blue-950 uppercase tracking-tight">Work Experience</h3>
                <div className="space-y-6">
                    {experience.length > 0 ? (
                        experience.map((exp: any, idx: number) => (
                            <ExperienceItem 
                                key={idx}
                                place={exp.organization}
                                period={`${new Date(exp.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })} - ${exp.isCurrent ? "Present" : new Date(exp.endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}`}
                            />
                        ))
                    ) : (
                        <p className="text-xs text-gray-400 italic">No professional experience listed</p>
                    )}
                </div>
            </section>

            <section className="space-y-6">
                <h3 className="text-lg font-black text-blue-950 uppercase tracking-tight">Specializations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-12">
                    {specializations.length > 0 ? (
                        specializations.map((spec: string) => (
                            <div key={spec} className="flex items-center gap-3 group">
                                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full group-hover:bg-blue-600 transition-colors"></div>
                                <span className="text-xs font-bold text-gray-500 group-hover:text-blue-950 transition-colors uppercase tracking-wider">{spec}</span>
                            </div>
                        ))
                    ) : doctor.profile?.keywords?.length > 0 ? (
                        doctor.profile.keywords.map((spec: string) => (
                            <div key={spec} className="flex items-center gap-3 group">
                                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full group-hover:bg-blue-600 transition-colors"></div>
                                <span className="text-xs font-bold text-gray-500 group-hover:text-blue-950 transition-colors uppercase tracking-wider">{spec}</span>
                            </div>
                        ))
                    ) : (
                        <p className="text-xs text-gray-400 italic">No specific specializations listed</p>
                    )}
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
