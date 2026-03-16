"use client"

import React from 'react'
import { useParams } from 'next/navigation'
import { AdminPageContainer } from '../../../../../components/common/layout/admin/PageContainer'
import { SingleTransactionView } from '../../../../../components/admin/SingleTransactionView'

const TransactionDetailPage = () => {
    const params = useParams()
    const id = params.id as string

    return (
        <AdminPageContainer title="Transaction Details" activeItem="transactions">
            <SingleTransactionView id={id} />
        </AdminPageContainer>
    )
}

export default TransactionDetailPage
