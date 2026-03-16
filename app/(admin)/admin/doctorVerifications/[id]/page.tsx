"use client"

import React from 'react'
import { useParams } from 'next/navigation'
import { AdminPageContainer } from '../../../../../components/common/layout/admin/PageContainer'
import { SingleDoctorView } from '../../../../../components/admin/SingleDoctorView'

const DoctorDetailPage = () => {
    const params = useParams()
    const id = params.id as string

    return (
        <AdminPageContainer title="Doctor Details" activeItem="doctors">
            <SingleDoctorView id={id} />
        </AdminPageContainer>
    )
}

export default DoctorDetailPage
