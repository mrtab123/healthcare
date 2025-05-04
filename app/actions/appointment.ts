"use server";



import { AppointmentStatus } from "@/constants";
import { db } from "@/database/drizzle";
import { appointments } from "@/database/schema";
import { AppointmentSchema } from "@/lib/schema";
import { Appointment } from "@/types";
import { eq } from "drizzle-orm";
// import { auth, currentUser } from "@clerk/nextjs/server";


export async function createNewAppointment(data: Appointment) {
  try {
    const validatedData = AppointmentSchema.safeParse(data);

    if (!validatedData.success) {
      return { success: false, msg: "Invalid data" };
    }

    const validated = validatedData.data;
    
    await db.insert(appointments).values({
      patient_id: data.patient_id, // Ensure this matches the schema
      doctor_id: validated.doctor_id,
      time: validated.time,
      type: validated.type,
      appointment_date: new Date(validated.appointment_date),    
      note: validated.note,
      cancellationReason: "", // Use an empty string instead of null
    });

    // await db.appointment.create({
    //   data: {
    //     patient_id: data.patient_id,
    //     doctor_id: validated.doctor_id,
    //     time: validated.time,
    //     type: validated.type,
    //     appointment_date: new Date(validated.appointment_date),
    //     note: validated.note,
    //   },
    // });

    return {
      success: true,
      message: "Appointment booked successfully",
    };
  } catch (error) {
    console.log(error);
    return { success: false, msg: "Internal Server Error" };
  }
}



export async function appointmentAction(
  id: string | number,

  status: AppointmentStatus,
  reason: string
) {
  try {


    await db
    .update(appointments)
    .set({      
      status: status.toLowerCase() as "scheduled" | "completed" | "cancelled" | "pending",
      reason,
    })
    .where(eq(appointments.id, String(id)));



    // await db.appointment.update({
    //   where: { id: Number(id) },
    //   data: {
    //     status,
    //     reason,
    //   },
    // });

    return {
      success: true,
      error: false,
      msg: `Appointment ${status.toLowerCase()} successfully`,
    };
  } catch (error) {
    console.log(error);
    return { success: false, msg: "Internal Server Error" };
  }
}

// export async function addVitalSigns(
//   data: VitalSignsFormData,
//   appointmentId: string,
//   doctorId: string
// ) {
//   try {
//     const { userId } = await auth();

//     if (!userId) {
//       return { success: false, msg: "Unauthorized" };
//     }

//     const validatedData = VitalSignsSchema.parse(data);

//     let medicalRecord = null;

//     if (!validatedData.medical_id) {
//       medicalRecord = await db.medicalRecords.create({
//         data: {
//           patient_id: validatedData.patient_id,
//           appointment_id: Number(appointmentId),
//           doctor_id: doctorId,
//         },
//       });
//     }

//     const med_id = validatedData.medical_id || medicalRecord?.id;

//     await db.vitalSigns.create({
//       data: {
//         ...validatedData,
//         medical_id: Number(med_id!),
//       },
//     });

//     return {
//       success: true,
//       msg: "Vital signs added successfully",
//     };
//   } catch (error) {
//     console.log(error);
//     return { success: false, msg: "Internal Server Error" };
//   }
// }