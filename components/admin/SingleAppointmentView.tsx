"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Appointment } from '@/lib/types/admin/admin.types'
import { PrescriptionMedication } from '@/lib/types/api.types'
import { 
    Clock,
    Stethoscope, Activity,
    AlertCircle, FileText
} from 'lucide-react'
import { appointmentApi } from '@/lib/api/appointment.api'
import { toast } from 'sonner'
import Image from 'next/image'

export function SingleAppointmentView({ id }: { id: string }) {
    const router = useRouter()
    const [appointment, setAppointment] = useState<Appointment | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchAppointment = async () => {
            if (!id) return
            setIsLoading(true)
            try {
                const response = await appointmentApi.getAppointmentById(id)
                if (response.success && response.data) {
                    setAppointment(response.data ?? null)
                } else {
                    toast.error(response.message || "Failed to fetch appointment details")
                }
            } catch (error) {
                console.error("Error fetching appointment:", error)
                toast.error("An error occurred while fetching appointment details")
            } finally {
                setIsLoading(false)
            }
        }
        fetchAppointment()
    }, [id])

    if (isLoading) {
        return <div className="p-12 text-center text-gray-500 font-medium">Loading appointment details...</div>
    }

    if (!appointment) {
        return (
            <div className="p-12 text-center text-red-500 font-medium flex flex-col items-center gap-4">
                <AlertCircle size={48} className="text-red-300" />
                <p>Appointment not found</p>
                <button onClick={() => router.back()} className="text-blue-600 hover:underline">Go back</button>
            </div>
        )
    }

    const doctorUser = appointment.doctorId?.userId;
    const pet = appointment.petId;
    const owner = appointment.ownerId;

console.log(appointment)


    return (
        <div className="font-inter">
            <div className="mx-auto">
                {/* Header Section */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Appointment Registry</h1>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <span className="cursor-pointer hover:text-blue-600" onClick={() => router.push('/admin/dashboard')}>Dashboard</span>
                            <span>/</span>
                            <span className="cursor-pointer hover:text-blue-600" onClick={() => router.push('/admin/appointmentManagement')}>List of Appointment</span>
                            <span>/</span>
                            <span className="text-gray-400">Entry #{appointment.appointmentId || appointment._id.slice(-8).toUpperCase()}</span>
                        </div>
                    </div>
                    <button
                        onClick={() => router.back()}
                        className="px-6 py-2 bg-gray-600 text-white rounded-lg text-xs font-bold hover:bg-gray-700 transition shadow-sm"
                    >
                        Back
                    </button>
                </div>

                {/* Main Content Card */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8">
                    {/* Status Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 pb-8 border-b border-gray-100">
                        <InfoBox label="Status" value={appointment.status} />
                        <InfoBox label="Payment" value={appointment.paymentStatus || "Pending"} />
                        <InfoBox label="Mode" value={appointment.mode} />
                        <InfoBox label="Total Amount" value={`₹${appointment.totalAmount || 0}`} />
                    </div>

                    {/* Practitioner & Patient Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                        <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                            <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                                <Stethoscope size={18} className="text-blue-600" />
                                Practitioner
                            </h2>
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-200 bg-white">
                                    <Image src={doctorUser?.profilePic || "https://images.unsplash.com/photo-1612349317150-e413f6a5b1f8?auto=format&fit=crop&q=80&w=150&h=150"} alt="Doctor" width={64} height={64} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900">Dr. {doctorUser?.username}</p>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{appointment.doctorId?.profile?.designation}</p>
                                    <p className="text-[10px] text-blue-600 font-medium">{doctorUser?.email}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                            <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                                <Activity size={18} className="text-rose-600" />
                                Patient Details
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Pet Name</p>
                                    <p className="text-sm font-bold text-gray-900">{pet?.name}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Owner</p>
                                    <p className="text-sm font-bold text-gray-900">{owner?.username}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Species/Breed</p>
                                    <p className="text-sm font-bold text-gray-900">{pet?.species || "N/A"} / {pet?.breed || "N/A"}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Contact</p>
                                    <p className="text-sm font-bold text-gray-900">{owner?.phone || "N/A"}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Schedule & Clinical Data */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Clock size={14} className="text-blue-500" />
                                Temporal Slot
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-[9px] text-gray-400 font-bold uppercase">Date</p>
                                    <p className="text-sm font-bold text-gray-900">{new Date(appointment.appointmentDate).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] text-gray-400 font-bold uppercase">Time</p>
                                    <p className="text-sm font-bold text-gray-900">{appointment.appointmentStartTime} - {appointment.appointmentEndTime}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm md:col-span-2">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <AlertCircle size={14} className="text-amber-500" />
                                Primary Complaint & Symptoms
                            </h3>
                            <div className="space-y-4">
                                <div className="bg-gray-50/50 p-3 rounded-lg border border-gray-100">
                                    <p className="text-xs text-gray-700 italic">&quot;{appointment.problemDescription || "No description provided."}&quot;</p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {appointment.symptoms?.map((s, i) => (
                                        <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold uppercase rounded border border-blue-100">
                                            {s}
                                        </span>
                                    )) || <span className="text-xs text-gray-400 italic">No symptoms recorded.</span>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Medical Findings (If Completed) */}
                    {appointment.status?.toLowerCase() === 'completed' && (
                        <div className="mt-8 pt-8 border-t border-gray-100">
                            <h2 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                                <FileText size={20} className="text-emerald-600" />
                                Medical Record Findings
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-2">Clinical Findings</p>
                                    <p className="text-sm font-bold text-gray-900 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        {appointment.prescriptionId?.clinicalFindings || appointment.clinicalFindings || "N/A"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-2">Diagnosis</p>
                                    <p className="text-sm font-bold text-gray-900 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        {appointment.prescriptionId?.diagnosis || appointment.diagnosis || "N/A"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-2">Practitioner Notes</p>
                                    <p className="text-sm font-bold text-gray-900 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        {appointment.prescriptionId?.vetNotes || appointment.notes || "N/A"}
                                    </p>
                                </div>
                            </div>

                            {((appointment.prescriptionId?.medications && appointment.prescriptionId.medications.length > 0) || (appointment.prescription && appointment.prescription.length > 0)) && (
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-4">Prescribed Medications</p>
                                    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                                        <table className="w-full text-left">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="py-3 px-4 text-[10px] font-black text-gray-500 uppercase">Medicine</th>
                                                    <th className="py-3 px-4 text-[10px] font-black text-gray-500 uppercase">Dosage</th>
                                                    <th className="py-3 px-4 text-[10px] font-black text-gray-500 uppercase">Frequency</th>
                                                    <th className="py-3 px-4 text-[10px] font-black text-gray-500 uppercase">Duration</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {(appointment.prescriptionId?.medications || appointment.prescription || []).map((item: PrescriptionMedication, idx: number) => (
                                                    <tr key={idx}>
                                                        <td className="py-3 px-4 text-xs font-bold text-gray-900">{item.name || item.medicineName || item.medicine || 'N/A'}</td>
                                                        <td className="py-3 px-4 text-xs text-gray-600 font-medium">{item.dosage}</td>
                                                        <td className="py-3 px-4 text-xs text-gray-600 font-medium">{item.frequency}</td>
                                                        <td className="py-3 px-4 text-xs font-bold text-blue-600">{item.duration}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

function InfoBox({ label, value }: { label: string; value: string }) {
    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <p className="text-[10px] font-medium text-gray-400 uppercase mb-1">{label}</p>
            <p className="text-blue-900 font-bold text-sm uppercase">{value}</p>
        </div>
    )
}
