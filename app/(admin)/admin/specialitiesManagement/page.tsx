// "use client"

import React from 'react'
import { AdminPageContainer } from '../../../../components/common/layout/admin/PageContainer'
import { SpecialitiesManagement } from '../../../../components/admin/SpecialitiesManagement'

const SpecialitiesPage = () => {
  return (
    <AdminPageContainer title="Specialities Management" activeItem="specialities">
      <SpecialitiesManagement />
    </AdminPageContainer>
  )
}

export default SpecialitiesPage
