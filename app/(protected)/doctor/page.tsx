import { checkRole, getRole } from '@/utils/roles';
import { redirect } from 'next/navigation';
import React from 'react'

const DoctorDashboard = async () => {
     const isDoctor = await checkRole('doctor');
    const role = await getRole();

if (!isDoctor) {
    redirect(`/${role}`);
  }

  return (
    <div>Doctor Dashboard</div>
  )
}

export default DoctorDashboard