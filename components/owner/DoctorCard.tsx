"use client"

import { Star, MapPin, Clock, } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils/utils"

export interface DoctorCardProps {
    id: string;
    name: string;
    specialty: string;
    rating: number;
    reviewsCount: number;
    location: string;
    duration: string;
    fee: string;
    image: string;
    available: boolean;
    isVerified?: boolean;
}

export function DoctorCard({
    id,
    name,
    specialty,
    rating,
    reviewsCount,
    location,
    duration,
    fee,
    image,
    available,
    isVerified
}: DoctorCardProps) {
    return (
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
            <div className="relative h-56 overflow-hidden">
                <Image
                    src={image}
                    alt={name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {rating > 0 && (
                    <div className="absolute top-4 left-4 flex gap-2">
                        <div className="bg-orange-500 text-white px-3 py-1 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1">
                            <Star size={12} className="fill-white" />
                            {rating.toFixed(1)}
                        </div>
                    </div>
                )}
                {isVerified && (
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-sm">
                        <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                    </div>
                )}
            </div>

            <div className="p-6 space-y-4">
                <div className="space-y-1">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-rose-500 font-bold text-[10px] uppercase tracking-widest">{specialty}</span>
                            {rating === 0 && (
                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter italic">Yet to be rated</span>
                            )}
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className={cn(
                                "w-1.5 h-1.5 rounded-full",
                                available ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-gray-300"
                            )}></span>
                            <span className={cn(
                                "text-[10px] font-bold uppercase tracking-wider",
                                available ? "text-emerald-500" : "text-gray-400"
                            )}>
                                {available ? "Available" : "Unavailable"}
                            </span>
                        </div>
                    </div>
                    <h3 className="text-lg font-black text-blue-950 group-hover:text-blue-600 transition-colors uppercase truncate">
                        {name}
                    </h3>
                </div>

                <div className="flex items-center gap-4 text-gray-400 text-xs font-bold">
                    <div className="flex items-center gap-1.5">
                        <MapPin size={14} className="text-gray-300" />
                        <span>{location}</span>
                    </div>
                    <div className="w-1 h-1 bg-gray-200 rounded-full"></div>
                    <div className="flex items-center gap-1.5">
                        <Clock size={14} className="text-gray-300" />
                        <span>{duration}</span>
                    </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-gray-50 mt-4">
                    <div className="space-y-0.5">
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Consultation Fee</p>
                        <p className="text-lg font-bold text-blue-900">${fee}</p>
                    </div>
                    <Link
                        href={`/owner/services/${id}`}
                        className="bg-blue-950 text-white px-5 py-2 rounded-md text-xs font-bold hover:bg-blue-900 transition shadow-md active:scale-95 whitespace-nowrap"
                    >
                        Book Now
                    </Link>
                </div>
            </div>
        </div>
    )
}
