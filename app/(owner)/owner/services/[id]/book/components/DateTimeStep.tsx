import { useEffect, useState } from "react"
import { Clock, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils/utils"
// import { doctorApi } from "@/lib/api/doctor/doctor.api"
import { appointmentApi } from "@/lib/api/appointment.api"
import { useParams } from "next/navigation"

export function DateTimeStep({ data, setData }: { data: any, setData: any }) {
    const params = useParams()
    const [days, setDays] = useState<any[]>([])
    const [slots, setSlots] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)


        useEffect(() => {
        const fetchAvailableSlots = async () => {
            if (!data.rawDate || !params.id) return
            setIsLoading(true)
            const response = await appointmentApi.getAvailableSlots(params.id as string, data.rawDate)
            if (response.success) {
                setSlots(response.data || [])
            } else {
                setSlots([])
            }
            setIsLoading(false)
        }
        fetchAvailableSlots()
    }, [data.rawDate, params.id])

    
    useEffect(() => {
        const generateDays = () => {
            const result: any[] = []
            const now = new Date()
            now.setHours(0, 0, 0, 0)
            
            for (let i = 0; i < 7; i++) {
                const date = new Date(now)
                date.setDate(now.getDate() + i)
                result.push({
                    id: date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
                    label: date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
                    fullDate: date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                    rawDate: date.toISOString().split('T')[0]
                })
            }
            setDays(result)
            // Default select today if not set
            if (!data.date && result.length > 0) {
                setData((prev: any) => ({ ...prev, date: result[0].fullDate, rawDate: result[0].rawDate }))
            }
        }
        generateDays()
    }, [])



    const handleDateSelect = (day: any) => {
        setData({ ...data, date: day.fullDate, rawDate: day.rawDate, time: "", slotId: "" })
    }

    const selectedDay = days.find(d => d.rawDate === data.rawDate)

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h2 className="text-xl font-bold text-blue-950">{data.date || "Select Date"}</h2>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        {selectedDay?.id || "—"}
                    </p>
                </div>
            </div>

            {/* Schedule Grid */}
            <div className="bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm">
                <div className="grid grid-cols-7 border-b border-gray-50 bg-gray-50/30">
                    {days.map((day) => (
                        <button
                            key={day.rawDate}
                            onClick={() => handleDateSelect(day)}
                            className={cn(
                                "p-4 text-center space-y-1 border-r border-gray-50 last:border-r-0 transition-all",
                                data.rawDate === day.rawDate ? "bg-blue-50/50" : "hover:bg-gray-100/50"
                            )}
                        >
                            <p className={cn(
                                "text-[10px] font-black uppercase tracking-widest",
                                data.rawDate === day.rawDate ? "text-blue-600" : "text-blue-950"
                            )}>{day.label}</p>
                            <p className="text-[9px] font-bold text-gray-400 uppercase whitespace-nowrap">{day.fullDate}</p>
                        </button>
                    ))}
                </div>

                <div className="p-6">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-10 space-y-4">
                            <Loader2 className="animate-spin text-blue-600" size={24} />
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Loading Slots...</p>
                        </div>
                    ) : slots.length > 0 ? (
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                            {slots.map((slot) => {
                                const isSelected = data.slotId === slot._id
                                return (
                                    <button
                                        key={slot._id}
                                        onClick={() => setData({ ...data, time: `${slot.startTime} - ${slot.endTime}`, slotId: slot._id })}
                                        className={cn(
                                            "py-2.5 rounded text-[10px] font-bold transition-all duration-300 border",
                                            isSelected
                                                ? "bg-blue-600 text-white border-blue-600 shadow-md scale-105"
                                                : "bg-gray-50 text-gray-500 border-gray-100 hover:border-blue-200"
                                        )}
                                    >
                                        {slot.startTime} - {slot.endTime}
                                    </button>
                                )
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-10">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest italic">No slots available for this day</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Mode Selection */}
            <div className="space-y-6 pt-4">
                <h3 className="text-center text-[10px] font-black text-blue-950 uppercase tracking-[0.2em]">Consultation Mode</h3>
                <div className="flex justify-center gap-6">
                    <button
                        disabled
                        title="Currently unavailable"
                        className="flex items-center gap-2 bg-gray-50 text-gray-300 border border-gray-100 px-8 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest cursor-not-allowed opacity-60"
                    >
                        <div className="w-2.5 h-2.5 rounded-full border border-gray-200 bg-white"></div>
                        Online
                    </button>
                    <button className="flex items-center gap-2 bg-yellow-400 text-blue-950 px-8 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-md shadow-yellow-100 border border-yellow-500">
                        <div className="w-2.5 h-2.5 rounded-full border-2 border-blue-950 bg-white shadow-inner"></div>
                        Offline
                    </button>
                </div>
            </div>
        </div>
    )
}

