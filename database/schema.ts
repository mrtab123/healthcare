
import {   
  varchar,
  uuid,
  serial, 
  text,
  pgTable,
  date,
  pgEnum,
  timestamp,
  integer, 
  real,
boolean } from "drizzle-orm/pg-core";

  export const STATUS_ENUM = pgEnum("status", [
    "PENDING",
    "APPROVED",
    "REJECTED",
  ]);
  export const JOBTYPE_ENUM = pgEnum("jobtype", [
    "FULL",
    "PART",
  ]);

  export const ROLE_ENUM = pgEnum("role",
     [
      "USER", 
      "ADMIN",
      "NURSE", 
      "DOCTOR",
      "LAB_TECHNICIAN", 
      "PATIENT",
      "CASHIER",         
    ]
    );
  export const GENDER_ENUM = pgEnum("gender", ["MALE", "FEMALE"]);
  
  export const APPOINTMENT_ENUM = pgEnum("appointment", [
    "scheduled",
    "completed",
    "cancelled",   
    "pending",
   
  ]);

  export const PAYMENTMETHOD_ENUM = pgEnum("paymentmethod", ["CASH", "CARD"]);
  export const PAYMENTSTATUS_ENUM = pgEnum("paymentstatus", ["PAID", "UNPAID","PART"]);



  export const appointments = pgTable("appointments", {
    id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
    patient_id: varchar('patient_id').references(() => patients.id, { onDelete: "cascade" }),
    doctor_id: varchar('doctor_id').references(() => doctors.id, { onDelete: "cascade" }),    
    appointment_date : timestamp("appointment_date ", { withTimezone: true }).defaultNow(),
    time: varchar('time'),
    status: APPOINTMENT_ENUM("status").default("pending").notNull(),
    type: varchar('type'),
    note: text("note"),   
    reason: text("reason"),
    cancellationReason: text("cancellation_reason").notNull(),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow(),


  });

    export const users = pgTable("users", {
      id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
      first: varchar("first_name ", { length: 255 }).notNull(),
      email: text("email").notNull().unique(),      
      password: text("password").notNull(),    
      status: STATUS_ENUM("status").default("PENDING"),
      role: ROLE_ENUM("role").default("USER"),
      lastActivityDate: date("last_activity_date").defaultNow(),
      createdAt: timestamp("created_at", {
        withTimezone: true,
      }).defaultNow(),
    });
  
  
  
    export const patients = pgTable("patients", {        
     id: varchar("id", { length: 255 }).notNull().unique(),
      first_name: varchar("first_name", { length: 255 }).notNull(),
      last_name: varchar("last_name", { length: 255 }).notNull(),
      date_of_birth: date("date_of_birth").notNull(),
      gender: GENDER_ENUM("gender").default("MALE").notNull(),
      phone: varchar("phone", { length: 20 }),
       email: varchar("email").notNull().unique(),
      address: varchar("address", { length: 500 }).notNull(),
      marital_status: varchar('marital_status'),
      emergency_contact_name: varchar('emergency_contact_name'),
      emergency_contact_number: varchar('emergency_contact_number'),

      relation: varchar('relation'),
      blood_group: varchar('blood_group'),
   
      allergies: text("allergies").notNull(),
      medical_condition: text("medical_condition"),
      medical_history: text("medical_history"),
      insurance_provider: varchar("insurance_provider"),
      insurance_number: varchar("insurance_number"),

      privacy_consent: boolean("privacy_consent"),    
      service_consent: boolean("service_consent"),
      disclosure_consent: boolean("disclosure_consent"),
      img: varchar("img"),

      
      
      
      createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
      updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
   
  
    });
    
  // Doctors Table
  export const doctors = pgTable('doctors', {
    id: varchar("id", { length: 255 }).notNull().unique(),    
    email: varchar('email').unique(),
    name: varchar('name'),
    specialization: varchar('specialization'),
    license_number: varchar('license_number'),
    phone: varchar('phone'),
    address: varchar('address'),
    department: varchar('department'),
    img: varchar('img'),
    colorCode: varchar('colorCode'),
    availability_status: varchar('availability_status'),
    type: JOBTYPE_ENUM("type").default("FULL"),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow(),
  });
  
  export const staff = pgTable('staff', {
    id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  email: varchar('email').unique(),
  name: varchar('name').notNull(),
  phone: varchar('phone').notNull(),
  address: varchar('address').notNull(),
  department: varchar('department').notNull(),
  img: varchar('img'),
  license_number: varchar('license_number'),
  colorCode: varchar('colorCode'),
  
  role: ROLE_ENUM("role").default("ADMIN"),
  status: STATUS_ENUM("status").default("PENDING"),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

// Payments Table
export const payments = pgTable('payments', {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  bill_id: integer('bill_id'),
  patient_id: varchar('patient_id').references(() => patients.id, { onDelete: 'cascade' }),
  appointment_id: uuid('appointment_id').unique().references(() => appointments.id, { onDelete: 'cascade' }),
  bill_date: timestamp('bill_date'),
  payment_date: timestamp('payment_date'),
  discount: real('discount'),
  total_amount: real('total_amount'),
  amount_paid: real('amount_paid'),
  role: ROLE_ENUM("role").default("ADMIN"),
  payment_status: PAYMENTSTATUS_ENUM("payment_status").default("UNPAID"),
  payment_method: PAYMENTMETHOD_ENUM("payment_method").default("CASH"),  
  receipt_number: serial('receipt_number'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});


// Patient Bills Table
export const patientBills = pgTable('patient_bills', {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  bill_id: uuid('bill_id').references(() => payments.id, { onDelete: 'cascade' }),
  service_id: uuid('service_id').references(() => services.id, { onDelete: 'cascade' }),
  service_date: timestamp('service_date'),
  quantity: integer('quantity'),
  unit_cost: real('unit_cost'),
  total_cost: real('total_cost'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});


// Services Table
export const services = pgTable('services', {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  service_name: varchar('service_name'),
  description: text('description'),
  price: real('price'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});


// Additional Models like Medical Records, Lab Tests, etc. follow similar pattern...

// Create Relations Between Tables

// Working Days Table
export const workingDays = pgTable('working_days', {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  doctor_id: varchar('doctor_id').references(() => doctors.id, { onDelete: 'cascade' }),
  day: varchar('day'),
  start_time: varchar('start_time'),
  close_time: varchar('close_time'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});


// Diagnosis Table
export const diagnoses = pgTable('diagnoses', {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  // patient_id: varchar('patient_id').references(() => patients.id, { onDelete: 'cascade' }),
  medical_id: uuid('medical_id').references(() => medicalRecords.id, { onDelete: 'cascade' }), 
  doctor_id: varchar('doctor_id').references(() => doctors.id, { onDelete: 'cascade' }),
  symptoms: text('symptoms'),
  diagnosis: text('diagnosis'),
  notes: text('notes'),
  prescribed_medications: text('prescribed_medications'),
  follow_up_plan: text('follow_up_plan'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});




// Vital Signs Table
export const vitalSigns = pgTable('vital_signs', {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  // patient_id: varchar('patient_id').references(() => patients.id),
  medical_id: uuid('medical_id').references(() => medicalRecords.id, { onDelete: 'cascade' }),
  body_temperature: real('body_temperature'),
  systolic: integer('systolic'),
  diastolic: integer('diastolic'),
  heartRate: varchar('heartRate'),
  respiratory_rate: integer('respiratory_rate'),
  oxygen_saturation: integer('oxygen_saturation'),
  weight: real('weight'),
  height: real('height'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});


export const labTests = pgTable('lab_tests', {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  record_id: uuid('record_id').references(() => medicalRecords.id, { onDelete: 'cascade' }),
  service_id: uuid('service_id').unique().references(() => services.id),
  test_date: timestamp('test_date'),
  result: text('result'),
  status: varchar('status'),
  notes: text('notes'),

  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

export const medicalRecords = pgTable('medical_records', {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
   patient_id: varchar('patient_id').references(() => patients.id, { onDelete: 'cascade' }),
  appointment_id: uuid('appointment_id').references(() => appointments.id, { onDelete: 'cascade' }),
  doctor_id: varchar('doctor_id').references(() => doctors.id),
  treatment_plan: text('treatment_plan'),
  prescriptions: text('prescriptions'),
  lab_request: text('lab_request'),
  notes: text('notes'),

  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

export const auditLogs = pgTable('audit_logs', {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  user_id: varchar('user_id'),
  record_id: varchar('record_id'),
  action: varchar('action'),
  details: text('details'),
  model: varchar('model'),

  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

export const ratings = pgTable('ratings', {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  staff_id: varchar('staff_id').references(() => doctors.id, { onDelete: 'cascade' }), // assuming `staff_id` is doctor ID
  patient_id: varchar('patient_id').references(() => patients.id, { onDelete: 'cascade' }),
  rating: integer('rating'),
  comment: text('comment'),

  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});