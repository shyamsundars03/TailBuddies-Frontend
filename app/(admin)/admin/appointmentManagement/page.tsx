"use client"

import React from 'react'
import { AdminPageContainer } from '../../../../components/common/layout/admin/PageContainer'
import { AppointmentManagement } from '../../../../components/admin/AppointmentManagement'

const AppointmentManagementPage = () => {
    return (
        <AdminPageContainer title="Appointment Management" activeItem="appointments">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Appointments</h1>
                <div className="flex items-center gap-2 text-sm text-gray-400 font-medium">
                    <span className="cursor-pointer hover:text-blue-600">Dashboard</span>
                    <span>/</span>
                    <span className="text-gray-400">Appointments</span>
                </div>
            </div>
            <AppointmentManagement />
        </AdminPageContainer>
    )
}

export default AppointmentManagementPage
