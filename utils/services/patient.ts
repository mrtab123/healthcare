
import { db } from "@/database/drizzle";
import { appointments, doctors, patients, workingDays } from "@/database/schema";
import { eq, desc, ilike, count, or } from "drizzle-orm";
import { getMonth, format, startOfYear, endOfMonth, isToday } from "date-fns";
import { daysOfWeek } from "..";
import { time } from "console";
import { da } from "@faker-js/faker";
import { AvailableDoctorProps, AvailableDoctorProps2, WorkingDay } from "@/types";

type  AppointmentStatus = "pending" | "scheduled" | "completed" | "cancelled";

function isValidStatus(status: string): status is AppointmentStatus {
  return ["pending", "scheduled", "completed", "cancelled"].includes(status);
}


interface Appointment {
  status: string;
  appointment_date: Date;
}

const initializeMonthlyData = () => {
  const this_year = new Date().getFullYear();

  const months = Array.from(
    { length: getMonth(new Date()) + 1 },
    (_, index) => ({
      name: format(new Date(this_year, index), "MMM"),
      appointment: 0,
      completed: 0,
    })
  );
  return months;
};




export async function getPatientById(id: string) {
  try {
    const patient = await db.select().from(patients).where(eq(patients.id, id)).limit(1);
    // const patient = await db.patients.findUnique({
    //   where: { id },
    // });

    if (!patient) {
      return {
        success: false,
        message: "Patient data not found",
        status: 200,
        data: null,
      };
    }

    // const formattedPatient = {
    //   ...patient[0],
    //   date_of_birth: patient[0].date_of_birth ? new Date(patient[0].date_of_birth) : null, // Ensure valid Date
    // };

    return { success: true, data: JSON.parse(JSON.stringify(patient[0])), status: 200 };
    // return { success: true, data: patient[0], status: 200 };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Internal Server Error", status: 500 };
  }
}


export const processAppointments = async (appointments: Appointment[]) => {
  const monthlyData = initializeMonthlyData();

  const appointmentCounts = appointments.reduce<
    Record<AppointmentStatus, number>
  >(
    (acc, appointment) => {
      const status = appointment.status;

      const appointmentDate = appointment?.appointment_date;

      const monthIndex = getMonth(appointmentDate);

      if (
        appointmentDate >= startOfYear(new Date()) &&
        appointmentDate <= endOfMonth(new Date())
      ) {
        monthlyData[monthIndex].appointment += 1;

        if (status === "completed") {
          monthlyData[monthIndex].completed += 1;
         
        }
      }

      // Grouping by status
      if (isValidStatus(status)) {
        acc[status] = (acc[status] || 0) + 1;
      }

      return acc;
    },
    {
      pending: 0,
      scheduled: 0,
      completed: 0,
      cancelled: 0,
    }
  );

  return { appointmentCounts, monthlyData };
};


export async function getPatientDashboardStatistics(id: string) {
  try {
    if (!id) {
      return {
        success: false,
        message: "No data found",
        data: null,
        
      };
    }
    
    const data = await db.select().from(patients).where(eq(patients.id, id)).limit(1);

    
    if (!data) {
      return {
        success: false,
        message: "Patient data not found",
        status: 200,
        data: null,
      };
    }





    const appointment = await db.select(
      {
        id: appointments.id,
        status: appointments.status,
        appointment_date: appointments.appointment_date,
        time: appointments.time,
        // doctor_id: appointments.doctor_id,
        // patient_id: appointments.patient_id,
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
      },
    }
    ).from(appointments)
    .innerJoin(doctors, eq(appointments.doctor_id, doctors.id))
    .innerJoin(patients, eq(appointments.patient_id, patients.id))
    .where(eq(appointments.patient_id, id)).orderBy(desc(appointments.appointment_date));          

  


  ;

    const { appointmentCounts, monthlyData } = await processAppointments(appointment);
    
   

    const last5Records = appointment.slice(0, 5);

    // 
    const today = daysOfWeek[new Date().getDay()];
   



    
    const availableDoctors = await db.select(
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
    .limit(4).orderBy(desc(workingDays.start_time)); 
                
              
            
            // const availableDoctors: AvailableDoctorProps2[] = rawDoctors.map(doctor => ({
            //   id: doctor.id,
            //   name: doctor.name || "",
            //   specialization: doctor.specialization || "",
            //   img: doctor.img || undefined,
            //   colorCode: doctor.colorCode || undefined,
            //   working_days: [
            //     {
            //       day: doctor.working_days.day || "",
            //       start_time: doctor.working_days.start_time || "",
            //       close_time: doctor.working_days.close_time || "",
            //     },
            //   ],
            // })) as AvailableDoctorProps2[];

    


    return {
      success: true,
      data,
      appointmentCounts,     
      totalAppointments: appointment.length,
      last5Records,
      monthlyData,
      availableDoctors,
      status: 200,
    };

  } catch (error) {
    console.log(error);
    return { success: false, message: "Internal Server Error", status: 500 };
  }
}



export async function getPatientFullDataById(id: string) {
  try {

    const patient = await db
  .select()
  .from(patients)
  .where(or(eq(patients.id, id), eq(patients.email, id)))
  .limit(1);


    //Get Latest Appointment
    const latestAppointment = await db
    .select({
      appointment_date: appointments.appointment_date,
    })
    .from(appointments)
    .where(eq(appointments.patient_id,  patient[0].id))
    .orderBy(desc(appointments.appointment_date))
    .limit(1);


//Count Appointments
    const [{ total }] = await db
  .select({ total: count() })
  .from(appointments)
  .where(eq(appointments.patient_id, patient[0].id));





    // const patientData = await db
    // .select({
    //   patient: patients,
    //   appointmentsCount: db.count(appointments.id).as("appointmentsCount"),
    //   latestAppointment: {
    //     appointment_date: appointments.appointment_date
    //   }
    // })
    // .from(patients)
    // .leftJoin(appointments, eq(patients.id, appointments.patient_id))
    // .where(
    //   or(
    //     eq(patients.id, id),
    //     eq(patients.email, id)
    //   )
    // )
    // .groupBy(patients.id)
    // .orderBy(appointments.appointment_date)
    // .limit(1);



    // const patient = await db.patient.findFirst({
    //   where: {
    //     OR: [
    //       {
    //         id,
    //       },
    //       { email: id },
    //     ],
    //   },
    //   include: {
    //     _count: {     
    //       select: {
    //         appointments: true,
    //       },
    //     },
    //     appointments: {
    //       select: {
    //         appointment_date: true,
    //       },
    //       orderBy: {
    //         appointment_date: "desc",
    //       },
    //       take: 1,
    //     },
    //   },
    // });




    if (!patient) {
      return {
        success: false,
        message: "Patient data not found",
        status: 404,
      };
    }
    const lastVisit =latestAppointment[0]?.appointment_date || null;

   // console.log("Patient Data", patient[0]);
    return {
      success: true,
      data: {
         ...patient[0],
        totalAppointments: total,
        lastVisit,
      },
      
      status: 200,
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Internal Server Error", status: 500 };
  }
}