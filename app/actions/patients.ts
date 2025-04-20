"use server";


import { db } from "@/database/drizzle";
import { patients } from "@/database/schema";
import { PatientFormSchema } from "@/lib/schema";

import { clerkClient } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function updatePatient(data: PatientsParams, pid: string) {
  try {
    const validateData = PatientFormSchema.safeParse(data);

    if (!validateData.success) {
      return {
        success: false,
        error: true,
        msg: "Provide all required fields",
      };
    }

    const patientData = validateData.data;

    const client = await clerkClient();
    await client.users.updateUser(pid, {
      firstName: patientData.first_name,
      lastName: patientData.last_name,
    });

      await db.update(patients).set({
        ...patientData,
        date_of_birth: patientData.date_of_birth.toISOString(), // Convert Date to string
      }).where(eq(patients.id, pid));

    

    return {
      success: true,
      error: false,
      msg: "Patient information updated successfully",
    };
  } catch (error: any) {
    console.error(error);
    return { success: false, error: true, msg: error?.message };
  }
}



export async function createNewPatient(data: PatientsParams, pid: string) {

  try {
    const validateData = PatientFormSchema.safeParse(data);

    if (!validateData.success) {
      return {
        success: false,
        error: true,
        msg: "Provide all required fields",
      };
    }

    const patientData = validateData.data;
    const client = await clerkClient();
    let patient_id = pid;

  

    if (pid === "new-patient") {
      const user = await client.users.createUser({
        emailAddress: [patientData.email],        
        password: "Mpd@12345678",
        firstName: patientData.first_name,
        lastName: patientData.last_name,
        publicMetadata: { role: "patient" },
      });

        patient_id = user?.id;

    } else {
      await client.users.updateUser(pid, {
        publicMetadata: { role: "patient" },
      });
    }
    
    await db.insert(patients).values({
     ...patientData,       
      id: patient_id,
      
    });

    return { success: true, error: false, msg: "Patient created successfully" };
  } catch (error: any) {
    console.error(error);
    return { success: false, error: true, msg: error?.message };
  }
}