import { db } from "@/database/drizzle";
import { appointments, doctors, patients } from "@/database/schema";
import { eq } from "drizzle-orm";




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

const buildQuery = (id?: string, search?: string) => {
  // Base conditions for search if it exists
  const searchConditions: Prisma.AppointmentWhereInput = search
    ? {
        OR: [
          {
            patient: {
              first_name: { contains: search, mode: "insensitive" },
            },
          },
          {
            patient: {
              last_name: { contains: search, mode: "insensitive" },
            },
          },
          {
            doctor: {
              name: { contains: search, mode: "insensitive" },
            },
          },
        ],
      }
    : {};

  // ID filtering conditions if ID exists
  const idConditions: Prisma.AppointmentWhereInput = id
    ? {
        OR: [{ patient_id: id }, { doctor_id: id }],
      }
    : {};

  // Combine both conditions with AND if both exist
  const combinedQuery: Prisma.AppointmentWhereInput =
    id || search
      ? {
          AND: [
            ...(Object.keys(searchConditions).length > 0
              ? [searchConditions]
              : []),
            ...(Object.keys(idConditions).length > 0 ? [idConditions] : []),
          ],
        }
      : {};

  return combinedQuery;
};

export async function getPatientAppointments({
  page,
  limit,
  search,
  id,
}: AllAppointmentsProps) {
  try {
    const PAGE_NUMBER = Number(page) <= 0 ? 1 : Number(page);
    const LIMIT = Number(limit) || 10;

    const SKIP = (PAGE_NUMBER - 1) * LIMIT; //0 -9

    const [data, totalRecord] = await Promise.all([
      db.appointment.findMany({
        where: buildQuery(id, search),
        skip: SKIP,
        take: LIMIT,
        select: {
          id: true,
          patient_id: true,
          doctor_id: true,
          type: true,
          appointment_date: true,
          time: true,
          status: true,
          patient: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              phone: true,
              gender: true,
              img: true,
              date_of_birth: true,
              colorCode: true,
            },
          },
          doctor: {
            select: {
              id: true,
              name: true,
              specialization: true,
              colorCode: true,
              img: true,
            },
          },
        },
        orderBy: { appointment_date: "desc" },
      }),
      db.appointment.count({
        where: buildQuery(id, search),
      }),
    ]);

    if (!data) {
      return {
        success: false,
        message: "Appointment data not found",
        status: 200,
        data: null,
      };
    }

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
