// "use client"

import React from 'react'
import { AdminPageContainer } from '../../../../components/common/layout/admin/PageContainer'
import { UsersManagement } from '../../../../components/admin/UsersManagement'

const UsersPage = () => {
  return (
    <AdminPageContainer title="Users Management" activeItem="users">
      <UsersManagement />
    </AdminPageContainer>
  )
}

export default UsersPage
