// import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { daysOfWeek } from "..";

import { db } from "@/database/drizzle";
import { appointments, doctors, patients, staff, workingDays } from "@/database/schema";
import { and, count, desc, eq, ilike, lte  } from "drizzle-orm";
import { processAppointments } from "./patient";
import { create } from "domain";

export async function getDoctors() {
  try {

    const data = await db.select().from(doctors);

    return { success: true, data:JSON.parse(JSON.stringify(data)), status: 200 };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Internal Server Error", status: 500 };
  }
}

export async function getDoctorDashboardStats() {
  try {
    const { userId } = await auth();

    const todayDate = new Date().getDay();
    const today = daysOfWeek[todayDate];

    const [[{ total: totalPatient }], [{ total2: totalNurses }], appointment, doctor] =
   
      await Promise.all([

        await db
          .select({ total: count(patients.id) })
          .from(patients),

           await db
  .select({ total2: count() })
  .from(staff)
  .where(eq(staff.role, "nurse")),

 

      await db
  .select({
    id: appointments.id,
    status: appointments.status,
    appointment_date: appointments.appointment_date,
    time: appointments.time,
    doctor: {
      id: doctors.id,
      name: doctors.name,
      specialization: doctors.specialization,
      img: doctors.img,
      colorCode: doctors.colorCode,
    },
    patient: {
      id: patients.id,
      first_name: patients.first_name,
      last_name: patients.last_name,
      gender: patients.gender,
      date_of_birth: patients.date_of_birth,
      colorCode: patients.colorCode,
      img: patients.img,
    },
  })
  .from(appointments)
  .innerJoin(doctors, eq(appointments.doctor_id, doctors.id))
  .innerJoin(patients, eq(appointments.patient_id, patients.id))
 
  .where(
    and(
      eq(appointments.doctor_id, userId!),
      // lte(appointments.appointment_date, new Date())
    )
  )
  .orderBy(desc(appointments.appointment_date)),


     await db.select(
      {
                 id: doctors.id,
                name: doctors.name,
                specialization: doctors.specialization,
                img: doctors.img,
                colorCode: doctors.colorCode, 
                day: workingDays.day,
                start_time: workingDays.start_time,
                close_time: workingDays.close_time
       
    }
    ).from(doctors)
    .innerJoin(workingDays, eq(doctors.id, workingDays.doctor_id))
     .where(ilike(workingDays.day, today)) // case-insensitive match
    .limit(4).orderBy(desc(workingDays.start_time))

       ]);

       console.log("Doctorssssss",totalPatient,totalNurses, appointment, doctor);

    const { appointmentCounts, monthlyData } = await processAppointments(
      appointment
    );

    const last5Records = appointment.slice(0, 5);
    // const availableDoctors = doctors.slice(0, 5);

    return {
      totalNurses,
    totalPatient,
      appointmentCounts,
      last5Records,
      availableDoctors: doctor,
      totalAppointment: appointment?.length,
      monthlyData,
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Internal Server Error", status: 500 };
  }
}

export async function getDoctorById(id: string) {
  try {
    const [doctor, [{ total: totalAppointment }], [{ total2: totalWork }]] = await Promise.all([  

      await db
      .select({
   
        id: doctors.id,
        name: doctors.name,
        specialization: doctors.specialization,
        img: doctors.img,
        colorCode: doctors.colorCode,
        address: doctors.address,
        created_at: doctors.created_at,
        license_number: doctors.license_number,
        type: doctors.type,
        phone: doctors.phone,
        email: doctors.email,

        appointment: {
          id: appointments.id,
          status: appointments.status,
          appointment_date: appointments.appointment_date,
          time: appointments.time,
          reason: appointments.reason,
          note: appointments.note,
          created_at: appointments.created_at,
        },
   
  
        patient: {
          id: patients.id,
          first_name: patients.first_name,
          last_name: patients.last_name,
          gender: patients.gender,
          date_of_birth: patients.date_of_birth,
          colorCode: patients.colorCode,
          img: patients.img,
        },

        working_days: {
          id: workingDays.id,
          day: workingDays.day,
          start_time: workingDays.start_time,
          close_time: workingDays.close_time,
        },

      })
      .from(doctors)
      .leftJoin(appointments, eq(appointments.doctor_id, doctors.id))
      .leftJoin(patients, eq(appointments.patient_id, patients.id))
      .leftJoin(workingDays, eq(workingDays.doctor_id, doctors.id))
     
      .where(eq(doctors.id, id!))
      .limit(10)
      .orderBy(desc(appointments.appointment_date)),



      await db
          .select({ total: count() })
          .from(appointments)
          .where(eq(appointments.doctor_id, id!)),
   

          await db
          .select({ total2: count() })
          .from(workingDays)
          .where(eq(workingDays.doctor_id, id!))
    
        ]);


    return { data:doctor[0], totalAppointment, totalWork };


  } catch (error) {
    console.log(error);
    return { success: false, message: "Internal Server Error", status: 500 };
  }
}



export async function getRatingById(id: string) {
  try {
    const data = await db.rating.findMany({
      where: { staff_id: id },
      include: {
        patient: { select: { last_name: true, first_name: true } },
      },
    });

    const totalRatings = data?.length;
    const sumRatings = data?.reduce((sum, el) => sum + el.rating, 0);

    const averageRating = totalRatings > 0 ? sumRatings / totalRatings : 0;
    const formattedRatings = (Math.round(averageRating * 10) / 10).toFixed(1);

    return {
      totalRatings,
      averageRating: formattedRatings,
      ratings: data,
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Internal Server Error", status: 500 };
  }
}

export async function getAllDoctors({
  page,
  limit,
  search,
}: {
  page: number | string;
  limit?: number | string;
  search?: string;
}) {
  try {
    const PAGE_NUMBER = Number(page) <= 0 ? 1 : Number(page);
    const LIMIT = Number(limit) || 10;

    const SKIP = (PAGE_NUMBER - 1) * LIMIT;

    const [doctors, totalRecords] = await Promise.all([
      db.doctor.findMany({
        where: {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { specialization: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        },
        include: { working_days: true },
        skip: SKIP,
        take: LIMIT,
      }),
      db.doctor.count(),
    ]);

    const totalPages = Math.ceil(totalRecords / LIMIT);

    return {
      success: true,
      data: doctors,
      totalRecords,
      totalPages,
      currentPage: PAGE_NUMBER,
      status: 200,
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Internal Server Error", status: 500 };
  }
}
