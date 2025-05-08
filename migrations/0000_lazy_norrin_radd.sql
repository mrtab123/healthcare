CREATE TYPE "public"."appointment" AS ENUM('scheduled', 'completed', 'cancelled', 'pending');--> statement-breakpoint
CREATE TYPE "public"."gender" AS ENUM('MALE', 'FEMALE');--> statement-breakpoint
CREATE TYPE "public"."jobtype" AS ENUM('FULL', 'PART');--> statement-breakpoint
CREATE TYPE "public"."paymentmethod" AS ENUM('CASH', 'CARD');--> statement-breakpoint
CREATE TYPE "public"."paymentstatus" AS ENUM('PAID', 'UNPAID', 'PART');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('USER', 'ADMIN', 'NURSE', 'DOCTOR', 'LAB_TECHNICIAN', 'PATIENT', 'CASHIER');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('PENDING', 'APPROVED', 'REJECTED');--> statement-breakpoint
CREATE TABLE "appointments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"patient_id" varchar,
	"doctor_id" varchar,
	"appointment_date " timestamp with time zone DEFAULT now(),
	"time" varchar,
	"status" "appointment" DEFAULT 'pending' NOT NULL,
	"type" varchar,
	"note" text,
	"reason" text,
	"cancellation_reason" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "appointments_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar,
	"record_id" varchar,
	"action" varchar,
	"details" text,
	"model" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "audit_logs_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "diagnoses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"patient_id" varchar,
	"medical_id" uuid,
	"doctor_id" varchar,
	"symptoms" text,
	"diagnosis" text,
	"notes" text,
	"prescribed_medications" text,
	"follow_up_plan" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "diagnoses_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "doctors" (
	"id" varchar(255) NOT NULL,
	"email" varchar,
	"name" varchar,
	"specialization" varchar,
	"license_number" varchar,
	"phone" varchar,
	"address" varchar,
	"department" varchar,
	"img" varchar,
	"colorCode" varchar,
	"availability_status" varchar,
	"type" "jobtype" DEFAULT 'FULL',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "doctors_id_unique" UNIQUE("id"),
	CONSTRAINT "doctors_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "lab_tests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"record_id" uuid,
	"service_id" uuid,
	"test_date" timestamp,
	"result" text,
	"status" varchar,
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "lab_tests_id_unique" UNIQUE("id"),
	CONSTRAINT "lab_tests_service_id_unique" UNIQUE("service_id")
);
--> statement-breakpoint
CREATE TABLE "medical_records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"patient_id" varchar,
	"appointment_id" uuid,
	"doctor_id" varchar,
	"treatment_plan" text,
	"prescriptions" text,
	"lab_request" text,
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "medical_records_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "patient_bills" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"bill_id" uuid,
	"service_id" uuid,
	"service_date" timestamp,
	"quantity" integer,
	"unit_cost" real,
	"total_cost" real,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "patient_bills_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "patients" (
	"id" varchar(255) NOT NULL,
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"date_of_birth" date NOT NULL,
	"gender" "gender" DEFAULT 'MALE' NOT NULL,
	"phone" varchar(20),
	"email" varchar NOT NULL,
	"address" varchar(500) NOT NULL,
	"marital_status" varchar,
	"emergency_contact_name" varchar,
	"emergency_contact_number" varchar,
	"relation" varchar,
	"blood_group" varchar,
	"allergies" text NOT NULL,
	"medical_condition" text,
	"medical_history" text,
	"insurance_provider" varchar,
	"insurance_number" varchar,
	"privacy_consent" boolean,
	"service_consent" boolean,
	"disclosure_consent" boolean,
	"img" varchar,
	"colorCode" varchar,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "patients_id_unique" UNIQUE("id"),
	CONSTRAINT "patients_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"bill_id" integer,
	"patient_id" varchar,
	"appointment_id" uuid,
	"bill_date" timestamp,
	"payment_date" timestamp,
	"discount" real,
	"total_amount" real,
	"amount_paid" real,
	"role" "role" DEFAULT 'ADMIN',
	"payment_status" "paymentstatus" DEFAULT 'UNPAID',
	"payment_method" "paymentmethod" DEFAULT 'CASH',
	"receipt_number" serial NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "payments_id_unique" UNIQUE("id"),
	CONSTRAINT "payments_appointment_id_unique" UNIQUE("appointment_id")
);
--> statement-breakpoint
CREATE TABLE "ratings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"staff_id" varchar,
	"patient_id" varchar,
	"rating" integer,
	"comment" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "ratings_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"service_name" varchar,
	"description" text,
	"price" real,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "services_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "staff" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar,
	"name" varchar NOT NULL,
	"phone" varchar NOT NULL,
	"address" varchar NOT NULL,
	"department" varchar NOT NULL,
	"img" varchar,
	"license_number" varchar,
	"colorCode" varchar,
	"role" "role" DEFAULT 'ADMIN',
	"status" "status" DEFAULT 'PENDING',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "staff_id_unique" UNIQUE("id"),
	CONSTRAINT "staff_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name " varchar(255) NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"status" "status" DEFAULT 'PENDING',
	"role" "role" DEFAULT 'USER',
	"last_activity_date" date DEFAULT now(),
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "users_id_unique" UNIQUE("id"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "vital_signs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"medical_id" uuid,
	"body_temperature" real,
	"systolic" integer,
	"diastolic" integer,
	"heartRate" varchar,
	"respiratory_rate" integer,
	"oxygen_saturation" integer,
	"weight" real,
	"height" real,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "vital_signs_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "working_days" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"doctor_id" varchar,
	"day" varchar,
	"start_time" varchar,
	"close_time" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "working_days_id_unique" UNIQUE("id")
);
--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_doctor_id_doctors_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "diagnoses" ADD CONSTRAINT "diagnoses_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "diagnoses" ADD CONSTRAINT "diagnoses_medical_id_medical_records_id_fk" FOREIGN KEY ("medical_id") REFERENCES "public"."medical_records"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "diagnoses" ADD CONSTRAINT "diagnoses_doctor_id_doctors_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lab_tests" ADD CONSTRAINT "lab_tests_record_id_medical_records_id_fk" FOREIGN KEY ("record_id") REFERENCES "public"."medical_records"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lab_tests" ADD CONSTRAINT "lab_tests_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medical_records" ADD CONSTRAINT "medical_records_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medical_records" ADD CONSTRAINT "medical_records_appointment_id_appointments_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medical_records" ADD CONSTRAINT "medical_records_doctor_id_doctors_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "patient_bills" ADD CONSTRAINT "patient_bills_bill_id_payments_id_fk" FOREIGN KEY ("bill_id") REFERENCES "public"."payments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "patient_bills" ADD CONSTRAINT "patient_bills_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_appointment_id_appointments_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_staff_id_doctors_id_fk" FOREIGN KEY ("staff_id") REFERENCES "public"."doctors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vital_signs" ADD CONSTRAINT "vital_signs_medical_id_medical_records_id_fk" FOREIGN KEY ("medical_id") REFERENCES "public"."medical_records"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "working_days" ADD CONSTRAINT "working_days_doctor_id_doctors_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("id") ON DELETE cascade ON UPDATE no action;