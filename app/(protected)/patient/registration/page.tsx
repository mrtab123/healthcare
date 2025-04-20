import { NewPatient } from '@/components/new-patient'
import { getPatientById } from '@/utils/services/patient';
import { auth } from '@clerk/nextjs/server';


import React from 'react'

const Registration = async () => {
 const {userId} = await auth();

 const response = await getPatientById(userId!);
 const data = response?.data;

  const isDataValid = data && typeof data === 'object' && Object.keys(data).length > 0;



 return (
   <div className="py-3 px-3 flex justify-center">
 <NewPatient data={data} type={!isDataValid ? "create" : "update"} />
     
   </div>
 );
}


export default Registration;