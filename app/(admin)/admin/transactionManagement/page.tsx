"use client"

import React from 'react'
import { AdminPageContainer } from '../../../../components/common/layout/admin/PageContainer'
import { TransactionManagement } from '../../../../components/admin/TransactionManagement'

export default function AdminTransactionListingPage() {
    return (
        <AdminPageContainer title="Transactions" activeItem="transactions">
            <TransactionManagement />
        </AdminPageContainer>
    )
}
