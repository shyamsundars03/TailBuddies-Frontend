"use client"

import React from 'react'
import { AdminPageContainer } from '../../../../components/common/layout/admin/PageContainer'
import { DoctorVerifications } from '../../../../components/admin/DoctorVerifications'

const DoctorVerificationsPage = () => {
    return (
        <AdminPageContainer title="Doctor Verifications" activeItem="doctors">
            <DoctorVerifications />
        </AdminPageContainer>
    )
}

export default DoctorVerificationsPage
