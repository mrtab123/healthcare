/* eslint-disable no-unused-vars */

declare type SearchParamProps = {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

declare type Gender = "MALE" | "FEMALE" ;
declare type Status = "pending" | "scheduled" | "cancelled";

declare interface CreateUserParams {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

declare interface User extends CreateUserParams {
  $id: string;
}

declare interface PatientsParams extends CreateUserParams {
  date_of_birth: Date;
  gender: Gender;
  address: string; 
  marital_status: string;
  emergency_contact_name: string;
  emergency_contact_number: string;  
  relation: string; 
  blood_group: string;
  allergies: string;
  medical_condition: string;
  medical_history: string;

  insurance_provider: string;
  insurance_number: string;
  privacy_consent: boolean;
  service_consent: boolean;
  disclosure_consent: boolean;
}

declare interface AppointmentParams {
      patient_id: string;
      doctor_id: string;   
      appointment_date: Date;
      time: string;
      status: string;
      type: string;
      note: string;   
      reason: string;
      cancellationReason: string;
}

declare type UpdateAppointmentParams = {
  appointmentId: string;
  userId: string;
  timeZone: string;
  appointment: Appointment;
  type: string;
};


//fullstack-healthcare/types/data-types.ts

export type AppointmentsChartProps = {
  name: string;
  appointment: number;
  completed: number;
}[];


export type Appointment = {
  id: string;
  patient_id: string;
  doctor_id: string;
  type: string;
  appointment_date: Date;
  time: string;
  status: AppointmentStatus;

  patient: Patient;
  doctor: Doctor;
};


export type Patient = {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: Date;
  gender:string;
  phone: string;
  email: string;
  address: string;
  marital_status: string;
  emergency_contact_name: string;
  emergency_contact_number: string;
  relation: string;
  blood_group: string;
  allergies: string;
  medical_condition: string;
  medical_history: string;
  insurance_provider: string;
  insurance_number: string;
  privacy_consent: boolean;
  service_consent: boolean;
  disclosure_consent: boolean;
  img: string;
  createdAt: Date;
  updatedAt: Date;
}

export type Doctor = {
  id: string;
  email: string;
  name: string;
  specialization: string;
  license_number: string;
  phone: string;
  address: string;
  department: string;
  img: string;
  colorCode: string;
  avalability: string;
  type: string;
}

export type AvailableDoctorProps = {
  id: string;
  name: string;
  specialization: string;
  img?: string;
  colorCode?: string;
  working_days: {
    day: string;
    start_time: string;
    close_time: string;
  }[];
}[];

// export type AvailableDoctorProps = {
//   id: string;
//   name: string;
//   specialization: string;
//   img?: string;
//   colorCode?: string;
//   working_days: {
//     id: string;
//     day: string;
//     start_time: string;
//     close_time: string;
//   };
// };


// export interface AvailableDoctorProps {
//   data: {
//     img: string;
//     name: string;
//     specialization: string;
//     colorCode?: string;
//     working_days: {
//       start_time: string;
//       close_time: string;
//     };
//   }[];
// }



// interface WorkingDay {
//   day: string; 
//   start_time: string;
//   close_time: string;
// }

interface AvailableDoctorProps2 {
  data: {
    id: string;
    name: string;
    specialization: string;
    img?: string;
    colorCode?: string;  
      day: string;
      start_time: string;
      close_time: string;
   
  }[];
}
interface Doctor {
  data: {
      id: string;
      email: string;
      name: string;
      specialization: string
      license_number:string;
      phone: string;
      address: string,
      department: string;
      img: string;
      colorCode: string;
      availablity_status: string;
      type: string;
      created_at: Date;
      updated_at: Date;

   
  }[];
}
