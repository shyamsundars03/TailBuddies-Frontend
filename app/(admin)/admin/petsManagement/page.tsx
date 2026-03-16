"use client"

import React from 'react'
import { AdminPageContainer } from '../../../../components/common/layout/admin/PageContainer'
import { PetsManagement } from '../../../../components/admin/PetsManagement'

const PetsPage = () => {
    return (
        <AdminPageContainer title="Pets Management" activeItem="pets">
            <PetsManagement />
        </AdminPageContainer>
    )
}

export default PetsPage
