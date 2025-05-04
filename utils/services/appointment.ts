import { db } from "@/database/drizzle";
import { appointments, doctors, patients } from "@/database/schema";
import { and, count, desc, eq, ilike, or, sql } from "drizzle-orm";




export async function getAppointmentById(id: string) {
  try {
    if (!id) {
      return {
        success: false,
        message: "Appointment id does not exist.",
        status: 404,
      };
    }

     const data = await db.select(
      
      {
        id: appointments.id,
        status: appointments.status,
        appointment_date: appointments.appointment_date,
        time: appointments.time,
        reason: appointments.reason,
        note: appointments.note,
        created_at: appointments.created_at,
        doctor_id: appointments.doctor_id,
         patient_id: appointments.patient_id,
        doctor: {
          id: doctors.id,
          name: doctors.name,
          specialization: doctors.specialization,
          img: doctors.img,            
        },
        patient: {
          id: patients.id,
          first_name: patients.first_name,
          last_name: patients.last_name,
          gender: patients.gender,
          date_of_birth: patients.date_of_birth,
          img: patients.img,
          address: patients.address,
          phone: patients.phone,
          
      },
    }
    ).from(appointments)
    .innerJoin(doctors, eq(appointments.doctor_id, doctors.id))
    .innerJoin(patients, eq(appointments.patient_id, patients.id))     
        .where(eq(appointments.id, id))
        .limit(1);
      
        
      

    if (!data) {
      return {
        success: false,
        message: "Appointment data not found",
        status: 404,
        data: null,
        
      };
    
    }

    return { success: true, data:data[0], status: 200, message: "Appointment data found" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Internal Server Error", status: 500 };
  }
}

interface AllAppointmentsProps {
  page: number | string;
  limit?: number | string;
  search?: string;
  id?: string;
}




export function buildQuery(id?: string, search?: string) {
  const conditions = [];

  // Search conditions (first_name, last_name, doctor name)
  if (search) {
    const searchPattern = `%${search}%`;
    conditions.push(
      or(
        ilike(patients.first_name, searchPattern),
        ilike(patients.last_name, searchPattern),
        ilike(doctors.name, searchPattern)
      )
    );
  }

  // ID filtering (match either patient_id or doctor_id)
  if (id) {
    conditions.push(
      or(
      eq(appointments.patient_id, id),
      eq(sql`${appointments.doctor_id}::text`, id)
      )
    );
  }
  console.log("conditions", conditions);
  // Return combined condition or undefined if no filters
  if (conditions.length === 0) return undefined;
  if (conditions.length === 1) return conditions[0];
  return and(...conditions);
}










export async function getPatientAppointments({
  page,
  limit,
  search,
  id,
}: AllAppointmentsProps) {
  try {
  
    const PAGE_NUMBER = Number(page) <= 0 ? 1 : Number(page);
    const LIMIT = Number(limit) || 10;
    const SKIP = (PAGE_NUMBER - 1) * LIMIT;
    
    const query = buildQuery(id, search); // should return Drizzle-compatible conditions
    
    const [data, totalRecord] = await Promise.all([
      db
        .select({
          id: appointments.id,
          patient_id: appointments.patient_id,
          doctor_id: appointments.doctor_id,
          type: appointments.type,
          appointment_date: appointments.appointment_date,
          time: appointments.time,
          status: appointments.status,
          patient: {
            id: patients.id,
            first_name: patients.first_name,
            last_name: patients.last_name,
            phone: patients.phone,
            gender: patients.gender,
            img: patients.img,
            date_of_birth: patients.date_of_birth,
            
          },
          doctor: {
            id: doctors.id,
            name: doctors.name,
            specialization: doctors.specialization,
            colorCode: doctors.colorCode,
            img: doctors.img,
          },
        })
        .from(appointments)
        .leftJoin(patients, eq(appointments.patient_id, patients.id))
        .leftJoin(doctors, eq(appointments.doctor_id, doctors.id))
         .where(query)
        .orderBy(desc(appointments.appointment_date))
        .limit(LIMIT)
        .offset(SKIP),
    
      db
        .select({ count: count() })
        .from(appointments)
        .leftJoin(patients, eq(appointments.patient_id, patients.id))
        .leftJoin(doctors, eq(appointments.doctor_id, doctors.id))
        .where(query)
        .then(res => res[0]?.count ?? 0),
    ]);
    if (!data) {
      return {
        success: false,
        message: "Appointment data not found",
        status: 200,
      };
    }
    console.log("data", data);

    const totalPages = Math.ceil(totalRecord / LIMIT);

    return {
      success: true,
      data,
      totalPages,
      currentPage: PAGE_NUMBER,
      totalRecord,
      status: 200,
    };
    
  } catch (error) {
    console.log(error);
    return { success: false, message: "Internal Server Error", status: 500 };
  }
}










export async function getAppointmentWithMedicalRecordsById(id: number) {
  try {
    if (!id) {
      return {
        success: false,
        message: "Appointment id does not exist.",
        status: 404,
      };
    }

    const data = await db.appointment.findUnique({
      where: { id },
      include: {
        patient: true,
        doctor: true,
        bills: true,
        medical: {
          include: {
            diagnosis: true,
            lab_test: true,
            vital_signs: true,
          },
        },
      },
    });

    if (!data) {
      return {
        success: false,
        message: "Appointment data not found",
        status: 200,
      };
    }

    return { success: true, data, status: 200 };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Internal Server Error", status: 500 };
  }
}
