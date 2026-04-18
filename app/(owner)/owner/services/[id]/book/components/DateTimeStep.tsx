import { useEffect, useState } from "react"
import { Clock, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils/utils"
// import { doctorApi } from "@/lib/api/doctor/doctor.api"
import { appointmentApi } from "@/lib/api/appointment.api"
import { useParams } from "next/navigation"

export function DateTimeStep({ data, setData, doctor }: { data: any, setData: any, doctor: any }) {
    const params = useParams()
    const [days, setDays] = useState<any[]>([])
    const [slots, setSlots] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)


        useEffect(() => {
        const fetchAvailableSlots = async () => {
            if (!data.rawDate || !params.id) return
            setIsLoading(true)
            const response = await appointmentApi.getAvailableSlots(params.id as string, data.rawDate)
            console.log("frontend :", response)
            if (response.success) {
                const slotsData = response.data || []
                console.log(`[DateTimeStep] Received ${slotsData.length} slots from API. Selection: ${data.slotId}`)
                setSlots(slotsData)
            } else {
                setSlots([])
            }
            setIsLoading(false)
        }
        fetchAvailableSlots()
    }, [data.rawDate, params.id])

    
    useEffect(() => {
        const generateDays = () => {
            if (!doctor) return
            const result: any[] = []
            const now = new Date()
            now.setHours(0, 0, 0, 0)
            
            // Get boundaries from doctor profile
            const schedule = doctor.recurringSchedules?.[0]
            
            // Parse dtstart local-safely if it's a string from API
            let dtstart = now
            if (schedule?.dtstart) {
                const sDate = new Date(schedule.dtstart)
                // If it's UTC, we need to treat it as local or adjust
                // For now, let's just use the date parts
                dtstart = new Date(sDate.getFullYear(), sDate.getMonth(), sDate.getDate(), 0, 0, 0, 0)
            }
            
            let dtend = null
            if (schedule?.dtend) {
                const eDate = new Date(schedule.dtend)
                dtend = new Date(eDate.getFullYear(), eDate.getMonth(), eDate.getDate(), 23, 59, 59, 999)
            }

            // Start from either 'now' or 'dtstart', whichever is later
            const startDate = now > dtstart ? now : dtstart
            
            let daysGenerated = 0
            let offset = 0
            
            // Attempt to find up to 14 working days within a 60-day window
            while (daysGenerated < 14 && offset < 60) {
                const date = new Date(startDate)
                date.setDate(startDate.getDate() + offset)
                offset++

                // 1. Respect End Date (Local compare)
                if (dtend && date > dtend) break

                // 2. Respect Working Days
                const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' })
                const businessDay = doctor.businessHours?.find((bh: any) => bh.day === dayOfWeek)
                
                if (businessDay?.isWorking) {
                    const y = date.getFullYear()
                    const m = String(date.getMonth() + 1).padStart(2, '0')
                    const d = String(date.getDate()).padStart(2, '0')
                    const localRawDate = `${y}-${m}-${d}`

                    result.push({
                        id: date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
                        label: date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
                        fullDate: date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                        rawDate: localRawDate
                    })
                    daysGenerated++
                }
            }
            
            setDays(result)
            // Default select first available if not set or if current selection is now invalid
            if (result.length > 0) {
                const isCurrentValid = result.find(d => d.rawDate === data.rawDate)
                if (!data.date || !isCurrentValid) {
                    setData((prev: any) => ({ ...prev, date: result[0].fullDate, rawDate: result[0].rawDate, time: "", slotId: "" }))
                }
            }
        }
        generateDays()
    }, [doctor])



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
                <div className="flex overflow-x-auto p-1 bg-gray-50/30 border-b border-gray-50 no-scrollbar">
                    {days.map((day) => (
                        <button
                            key={day.rawDate}
                            onClick={() => handleDateSelect(day)}
                            className={cn(
                                "flex-shrink-0 w-24 p-4 text-center space-y-1 transition-all",
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
                                
                                // Past slot validation
                                const isToday = data.rawDate === new Date().toISOString().split('T')[0]
                                let isPast = false
                                if (isToday) {
                                    const [hour, min] = slot.startTime.split(':').map(Number)
                                    const now = new Date()
                                    const slotTime = new Date()
                                    slotTime.setHours(hour, min, 0, 0)
                                    if (slotTime < now) isPast = true
                                }

                                return (
                                    <button
                                        key={slot._id}
                                        disabled={isPast}
                                        onClick={() => setData({ ...data, time: `${slot.startTime} - ${slot.endTime}`, slotId: slot._id })}
                                        className={cn(
                                            "py-2.5 rounded text-[10px] font-bold transition-all duration-300 border",
                                            isSelected
                                                ? "bg-blue-600 text-white border-blue-600 shadow-md scale-105"
                                                : isPast
                                                    ? "bg-gray-100 text-gray-300 border-gray-100 cursor-not-allowed opacity-50"
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

