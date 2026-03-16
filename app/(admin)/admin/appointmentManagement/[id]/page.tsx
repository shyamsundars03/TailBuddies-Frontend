"use client"

import React from 'react'
import { useParams } from 'next/navigation'
import { AdminPageContainer } from '../../../../../components/common/layout/admin/PageContainer'
import { SingleAppointmentView } from '../../../../../components/admin/SingleAppointmentView'

const AppointmentDetailPage = () => {
    const params = useParams()
    const id = params.id as string

    return (
        <AdminPageContainer title="Appointment Details" activeItem="appointments">
            <SingleAppointmentView id={id} />
        </AdminPageContainer>
    )
}

export default AppointmentDetailPage
