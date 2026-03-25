"use client"

import React from 'react'
import { AdminPageContainer } from '../../../../components/common/layout/admin/PageContainer'
import { ChatAssistantManagement } from '../../../../components/admin/ChatAssistantManagement'

export default function AdminChatAssistantPage() {
    return (
        <AdminPageContainer title="Ai Assistant" activeItem="chatAssistant">
            <ChatAssistantManagement />
        </AdminPageContainer>
    )
}
