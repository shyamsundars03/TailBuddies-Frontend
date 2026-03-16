"use client"

import React, { useState } from 'react'
import { DataTable, Column } from '../common/ui/DataTable'
import { SearchInput } from '../common/ui/SearchInput'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils/utils'

interface Appointment {
    id: string
    doctorName: string
    doctorImage: string
    speciality: string
    patientName: string
    patientImage: string
    appointmentDate: string
    appointmentTime: string
    status: 'active' | 'inactive'
    amount: string
}

const DUMMY_APPOINTMENTS: Appointment[] = [
    {
        id: '1',
        doctorName: 'Dr. Darren Elder',
        doctorImage: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b1f8?auto=format&fit=crop&q=80&w=150&h=150',
        speciality: 'Dental',
        patientName: 'Travis Trimble',
        patientImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150',
        appointmentDate: '5 Nov 2019',
        appointmentTime: '11:00 AM - 11:35 AM',
        status: 'active',
        amount: '$300.00'
    },
    {
        id: '2',
        doctorName: 'Dr. Deborah Angel',
        doctorImage: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=150&h=150',
        speciality: 'Cardiology',
        patientName: 'Carl Kelly',
        patientImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150',
        appointmentDate: '11 Nov 2019',
        appointmentTime: '12:00 PM - 12:15 PM',
        status: 'active',
        amount: '$150.00'
    },
    {
        id: '3',
        doctorName: 'Dr. John Gibbs',
        doctorImage: 'https://images.unsplash.com/photo-1537368910025-72675b3963d5?auto=format&fit=crop&q=80&w=150&h=150',
        speciality: 'Dental',
        patientName: 'Walter Roberson',
        patientImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150',
        appointmentDate: '21 Nov 2019',
        appointmentTime: '12:10 PM - 12:25 PM',
        status: 'active',
        amount: '$300.00'
    }
]

export function AppointmentManagement() {
    const [searchTerm, setSearchTerm] = useState('')
    const router = useRouter()

    const columns: Column<Appointment>[] = [
        {
            header: "Doctor Name",
            accessor: (apt) => (
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-100">
                        <img src={apt.doctorImage} alt={apt.doctorName} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-blue-600 font-semibold text-xs hover:underline cursor-pointer">
                        {apt.doctorName}
                    </span>
                </div>
            )
        },
        { header: "Speciality", accessor: "speciality", className: "text-xs" },
        {
            header: "Patient Name",
            accessor: (apt) => (
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-100">
                        <img src={apt.patientImage} alt={apt.patientName} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-blue-600 font-semibold text-xs hover:underline cursor-pointer">
                        {apt.patientName}
                    </span>
                </div>
            )
        },
        {
            header: "Apointment Time",
            accessor: (apt) => (
                <div className="flex flex-col">
                    <span className="text-gray-700 font-bold text-xs">{apt.appointmentDate}</span>
                    <span className="text-blue-500 text-[10px] font-bold">{apt.appointmentTime}</span>
                </div>
            )
        },
        {
            header: "Status",
            accessor: (apt) => (
                <button
                    className={cn(
                        "relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 outline-none",
                        apt.status === 'active' ? "bg-red-500" : "bg-gray-200"
                    )}
                >
                    <span
                        className={cn(
                            "inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform duration-200 shadow-sm",
                            apt.status === 'active' ? "translate-x-5" : "translate-x-0.5"
                        )}
                    />
                </button>
            )
        },
        { header: "Amount", accessor: "amount", className: "text-xs font-bold text-gray-700" }
    ]

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-end">
                <SearchInput
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    containerClassName="w-48"
                />
            </div>

            <DataTable
                columns={columns}
                data={DUMMY_APPOINTMENTS.filter(a =>
                    a.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    a.patientName.toLowerCase().includes(searchTerm.toLowerCase())
                )}
                keyExtractor={(apt) => apt.id}
                onRowClick={(apt) => router.push(`/admin/appointmentManagement/${apt.id}`)}
                className="border-0 shadow-none rounded-none"
            />

            <div className="p-4 flex items-center justify-between border-t border-gray-100 bg-gray-50/30">
                <span className="text-[11px] text-gray-500 font-medium">Showing 1 to 10 of 12 entries</span>
                <div className="flex gap-1.5">
                    <button className="px-3 py-1.5 border border-gray-200 rounded text-[11px] font-bold text-gray-400 disabled:opacity-50" disabled>Previous</button>
                    <button className="px-3 py-1.5 bg-yellow-400 text-gray-900 rounded text-[11px] font-black">1</button>
                    <button className="px-3 py-1.5 border border-gray-200 rounded text-[11px] font-bold text-gray-600 hover:bg-white transition">2</button>
                    <button className="px-3 py-1.5 border border-gray-200 rounded text-[11px] font-bold text-gray-600 hover:bg-white transition">3</button>
                    <button className="px-3 py-1.5 border border-gray-200 rounded text-[11px] font-bold text-gray-600 hover:bg-white transition">Next</button>
                </div>
            </div>
        </div>
    )
}
