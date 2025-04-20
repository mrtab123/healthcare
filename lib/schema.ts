import { z } from "zod";


export const PatientFormSchema = z.object({
  first_name: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(50, "First name can't be more than 50 characters"),
  last_name: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(50, "Last name can't be more than 50 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number can't be more than 15 digits"),
  gender: z.enum(["MALE", "FEMALE"], { message: "Gender is required" }),
  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(500, "Address can't be more than 500 characters"),
  date_of_birth: z.coerce.date(),
  marital_status: z.enum(
    ["Married", "Single", "Divorced", "Widowed", "Separated"],
    { message: "Marital status is required" }
  ),
  emergency_contact_name: z.string(),
  emergency_contact_number: z
    .string()
    .min(10, "Emergency contact number must be at least 10 digits")
    .max(15, "Emergency contact number can't be more than 15 digits"),
  relation: z.enum(["Mother", "Father", "Husband", "Wife", "Other"], {
    message: "Relation is required",
  }),
  blood_group: z.string(),
  allergies: z.string(),
  medical_condition: z.string(),
  medical_history: z.string(),
  insurance_provider: z.string(),
  insurance_number: z.string(),
  privacy_consent: z
    .boolean()
    .refine((val) => val === true, {
      message: "You must agree to the privacy policy",
    }),
  service_consent: z
    .boolean()
    .refine((val) => val === true, {
      message: "You must agree to the terms of service",
    }),
  disclosure_consent: z
    .boolean()
    .refine((val) => val === true, {
      message: "You must agree to the medical treatment terms",
    }),
});




export const AppointmentSchema = z.object({
  doctor_id: z.string().min(1, "Select physician"),
  type: z.string().min(1, "Select type of appointment"),
  appointment_date: z.string().min(1, "Select appointment date"),
  time: z.string().min(1, "Select appointment time"),
  note: z.string().optional(),
});

export const DoctorSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  phone: z.string().min(10, "Enter phone number").max(10, "Enter phone number"),
  email: z.string().email("Invalid email address."),
  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(500, "Address must be at most 500 characters"),
  specialization: z.string().min(2, "Specialization is required."),
  license_number: z.string().min(2, "License number is required"),
  type: z.enum(["FULL", "PART"], { message: "Type is required." }),
  department: z.string().min(2, "Department is required."),
  img: z.string().optional(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long!" })
    .optional()
    .or(z.literal("")),
});

export const workingDaySchema = z.object({
  day: z.enum([
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ]),
  start_time: z.string(),
  close_time: z.string(),
});
export const WorkingDaysSchema = z.array(workingDaySchema).optional();

export const StaffSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  role: z.enum(["NURSE", "LAB_TECHNICIAN"], { message: "Role is required." }),
  phone: z
    .string()
    .min(10, "Contact must be 10-digits")
    .max(10, "Contact must be 10-digits"),
  email: z.string().email("Invalid email address."),
  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(500, "Address must be at most 500 characters"),
  license_number: z.string().optional(),
  department: z.string().optional(),
  img: z.string().optional(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long!" })
    .optional()
    .or(z.literal("")),
});

export const VitalSignsSchema = z.object({
  patient_id: z.string(),
  medical_id: z.string(),
  body_temperature: z.coerce.number({
    message: "Enter recorded body temperature",
  }),
  heartRate: z.string({ message: "Enter recorded heartbeat rate" }),
  systolic: z.coerce.number({
    message: "Enter recorded systolic blood pressure",
  }),
  diastolic: z.coerce.number({
    message: "Enter recorded diastolic blood pressure",
  }),
  respiratory_rate: z.coerce.number().optional(),
  oxygen_saturation: z.coerce.number().optional(),
  weight: z.coerce.number({ message: "Enter recorded weight (Kg)" }),
  height: z.coerce.number({ message: "Enter recorded height (Cm)" }),
});

export const DiagnosisSchema = z.object({
  patient_id: z.string(),
  medical_id: z.string(),
  doctor_id: z.string(),
  symptoms: z.string({ message: "Symptoms required" }),
  diagnosis: z.string({ message: "Diagnosis required" }),
  notes: z.string().optional(),
  prescribed_medications: z.string().optional(),
  follow_up_plan: z.string().optional(),
});

export const PaymentSchema = z.object({
  id: z.string(),
  // patient_id: z.string(),
  // appointment_id: z.string(),
  bill_date: z.coerce.date(),
  // payment_date: z.string(),
  discount: z.string({ message: "discount" }),
  total_amount: z.string(),
  // amount_paid: z.string(),
});

export const PatientBillSchema = z.object({
  bill_id: z.string(),
  service_id: z.string(),
  service_date: z.string(),
  appointment_id: z.string(),
  quantity: z.string({ message: "Quantity is required" }),
  unit_cost: z.string({ message: "Unit cost is required" }),
  total_cost: z.string({ message: "Total cost is required" }),
});

export const ServicesSchema = z.object({
  service_name: z.string({ message: "Service name is required" }),
  price: z.string({ message: "Service price is required" }),
  description: z.string({ message: "Service description is required" }),
});