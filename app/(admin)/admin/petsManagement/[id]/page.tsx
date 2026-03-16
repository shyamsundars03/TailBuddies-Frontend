"use client"

import React from 'react'
import { useParams } from 'next/navigation'
import { AdminPageContainer } from '../../../../../components/common/layout/admin/PageContainer'
import { SinglePetView } from '../../../../../components/admin/SinglePetView'

const PetDetailPage = () => {
    const params = useParams()
    const id = params.id as string

    return (
        <AdminPageContainer title="Pet Details" activeItem="pets">
            <SinglePetView id={id} />
        </AdminPageContainer>
    )
}

export default PetDetailPage
