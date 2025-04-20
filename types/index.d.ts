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
