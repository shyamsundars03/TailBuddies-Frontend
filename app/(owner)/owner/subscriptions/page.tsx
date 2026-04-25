"use client"

import { 
    Search, 
    ChevronDown, 
    Star, 
    MapPin, 
    Clock, 
    Calendar,
    FileText,
    Activity,
    XCircle,
    Eye,
    ChevronLeft,
    ChevronRight
} from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils/utils"

export default function SubscriptionsPage() {
    return (
        <div className="space-y-12 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-blue-950 mb-1">Subscription Details</h1>
                <p className="text-blue-900/40 font-bold text-[10px] uppercase tracking-widest">Manage your health plans and discover new specialized care</p>
            </div>

            {/* Ongoing Plans Section */}
            <section className="space-y-6">
                <h2 className="text-sm font-black text-blue-900 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                    Ongoing Plans <span className="text-blue-200">:</span>
                </h2>
                
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 flex flex-col lg:flex-row items-center gap-8">
                    <div className="flex items-center gap-4 min-w-[200px]">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-md border-2 border-white ring-4 ring-blue-50">
                            <Image 
                                src="https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=150&h=150" 
                                alt="Doctor" width={64} height={64} className="w-full h-full object-cover" 
                            />
                        </div>
                        <div>
                            <p className="text-blue-500 font-black text-[10px] uppercase tracking-widest mb-1">#Apt0001</p>
                            <h3 className="text-sm font-black text-gray-900">Dr. Arun</h3>
                        </div>
                    </div>

                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 px-8 border-l border-r border-gray-50">
                        <div>
                            <p className="text-blue-900/40 font-black text-[9px] uppercase tracking-widest mb-2">Plan:</p>
                            <p className="text-xs font-black text-gray-700 uppercase">1 Month Online Care ₹999</p>
                        </div>
                        <div>
                            <p className="text-blue-900/40 font-black text-[9px] uppercase tracking-widest mb-2">Valid Till</p>
                            <p className="text-xs font-black text-gray-700">20 Sep 2025</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3 justify-center">
                        <ActionButton icon={<Calendar size={12} />} label="Book Follow-up" color="amber" />
                        <ActionButton icon={<Activity size={12} />} label="View Tasks" color="amber" />
                        <ActionButton icon={<FileText size={12} />} label="View Reports" color="amber" />
                        <ActionButton icon={<XCircle size={12} />} label="Cancel" color="white" border />
                        <ActionButton icon={<Eye size={12} />} label="View" color="blue" />
                    </div>
                </div>
            </section>

            {/* Need More Plans Section */}
            <section className="space-y-8">
                <div className="flex flex-wrap items-center justify-between gap-6">
                    <h2 className="text-sm font-black text-blue-900 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                        Need More Plans <span className="text-blue-200">:</span>
                    </h2>
                    
                    <div className="relative w-full md:w-80">
                        <select className="w-full h-11 bg-white rounded-xl border border-gray-100 px-6 pr-10 text-xs font-black text-gray-400 uppercase tracking-widest shadow-sm outline-none appearance-none focus:ring-4 focus:ring-blue-50 transition-all cursor-pointer">
                            <option>Select Your Specialization</option>
                            <option>Cardiology</option>
                            <option>Dermatology</option>
                            <option>Neurology</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <DoctorSubscriptionCard 
                        image="https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=300&h=400"
                        name="Dr. Daisy Malcolm"
                        specialty="Gastroenterology"
                        rating="5.0"
                        location="Lexington, KY"
                        duration="60 Min"
                        fee="520"
                    />
                    <DoctorSubscriptionCard 
                        image="https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=300&h=400"
                        name="Dr. Daisy Malcolm"
                        specialty="Gastroenterology"
                        rating="5.0"
                        location="Lexington, KY"
                        duration="60 Min"
                        fee="520"
                    />
                    <DoctorSubscriptionCard 
                        image="https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=300&h=400"
                        name="Dr. Daisy Malcolm"
                        specialty="Gastroenterology"
                        rating="5.0"
                        location="Lexington, KY"
                        duration="60 Min"
                        fee="520"
                    />
                </div>

                {/* Pagination */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-gray-50">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Showing 1 to 3 of 12 entries</p>
                    <div className="flex items-center gap-2">
                        <PaginationButton icon={<ChevronLeft size={16} />} label="Previous" />
                        <PaginationButton label="1" />
                        <PaginationButton label="2" active />
                        <PaginationButton label="3" />
                        <PaginationButton icon={<ChevronRight size={16} />} label="Next" />
                    </div>
                </div>
            </section>
        </div>
    )
}

function ActionButton({ icon, label, color, border }: any) {
    const colorClasses: any = {
        amber: "bg-amber-400 hover:bg-amber-500 text-white shadow-amber-100",
        blue: "bg-linear-to-br from-blue-700 to-blue-900 hover:from-blue-800 hover:to-blue-950 text-white shadow-blue-100",
        white: "bg-white hover:bg-gray-50 text-gray-600 shadow-sm"
    }

    return (
        <button className={cn(
            "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg flex items-center gap-2",
            colorClasses[color],
            border && "border border-gray-100"
        )}>
            {label}
        </button>
    )
}

function DoctorSubscriptionCard({ image, name, specialty, rating, location, duration, fee }: any) {
    return (
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-500">
            <div className="relative aspect-[4/3] overflow-hidden">
                <Image src={image} alt={name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 left-4 bg-orange-500 text-white text-[10px] font-black px-3 py-1 rounded-lg shadow-lg flex items-center gap-1">
                    <Star size={10} className="fill-white" /> {rating}
                </div>
                <div className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full border border-white/30 flex items-center justify-center text-white">
                    <Activity size={20} />
                </div>
            </div>
            
            <div className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest border-l-2 border-rose-500 pl-2">{specialty}</span>
                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em] bg-emerald-50 px-2 py-0.5 rounded-full">Available</span>
                </div>

                <div>
                    <h3 className="text-lg font-black text-gray-900 mb-2">{name}</h3>
                    <div className="flex items-center gap-4 text-gray-400">
                        <div className="flex items-center gap-1.5">
                            <MapPin size={14} className="text-blue-900/40" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">{location}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Clock size={14} className="text-blue-900/40" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">{duration}</span>
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                    <div className="space-y-1">
                        <p className="text-blue-900/40 font-black text-[9px] uppercase tracking-widest">Subscription Fees</p>
                        <p className="text-xl font-black text-gray-900">${fee}</p>
                    </div>
                    <button className="h-12 px-8 bg-[#002B49] hover:bg-blue-950 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-blue-900/20 active:scale-95 flex items-center gap-2">
                        <Calendar size={14} /> Subscribe
                    </button>
                </div>
            </div>
        </div>
    )
}

function PaginationButton({ icon, label, active }: any) {
    return (
        <button className={cn(
            "h-10 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2 border",
            active 
                ? "bg-red-600 text-white border-red-600 shadow-lg shadow-red-100" 
                : "bg-white text-gray-400 border-gray-100 hover:border-gray-200"
        )}>
            {icon} {label}
        </button>
    )
}
