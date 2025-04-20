import { checkRole } from '@/utils/roles'
import { redirect } from 'next/navigation'
import React from 'react'

const AdminDashboard = async () => {
     // Protect the page from users who are not admins
  const isAdmin = await checkRole('admin')
  if (!isAdmin) {
    redirect('/')
  }


  return (
    <div>
        This is the protected admin dashboard restricted to users with the `admin` role.
    </div>
  )
}

export default AdminDashboard