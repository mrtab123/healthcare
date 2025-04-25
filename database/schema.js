"use strict";
exports.__esModule = true;
exports.ratings = exports.auditLogs = exports.medicalRecords = exports.labTests = exports.vitalSigns = exports.diagnoses = exports.workingDays = exports.services = exports.patientBills = exports.payments = exports.staff = exports.doctors = exports.patients = exports.users = exports.appointments = exports.PAYMENTSTATUS_ENUM = exports.PAYMENTMETHOD_ENUM = exports.APPOINTMENT_ENUM = exports.GENDER_ENUM = exports.ROLE_ENUM = exports.JOBTYPE_ENUM = exports.STATUS_ENUM = void 0;
var pg_core_1 = require("drizzle-orm/pg-core");
exports.STATUS_ENUM = (0, pg_core_1.pgEnum)("status", [
    "PENDING",
    "APPROVED",
    "REJECTED",
]);
exports.JOBTYPE_ENUM = (0, pg_core_1.pgEnum)("jobtype", [
    "FULL",
    "PART",
]);
exports.ROLE_ENUM = (0, pg_core_1.pgEnum)("role", [
    "USER",
    "ADMIN",
    "NURSE",
    "DOCTOR",
    "LAB_TECHNICIAN",
    "PATIENT",
    "CASHIER",
]);
exports.GENDER_ENUM = (0, pg_core_1.pgEnum)("gender", ["MALE", "FEMALE"]);
exports.APPOINTMENT_ENUM = (0, pg_core_1.pgEnum)("appointment", [
    "scheduled",
    "completed",
    "cancelled",
    "pending",
]);
exports.PAYMENTMETHOD_ENUM = (0, pg_core_1.pgEnum)("paymentmethod", ["CASH", "CARD"]);
exports.PAYMENTSTATUS_ENUM = (0, pg_core_1.pgEnum)("paymentstatus", ["PAID", "UNPAID", "PART"]);
exports.appointments = (0, pg_core_1.pgTable)("appointments", {
    id: (0, pg_core_1.uuid)("id").notNull().primaryKey().defaultRandom().unique(),
    patient_id: (0, pg_core_1.varchar)('patient_id').references(function () { return exports.patients.id; }, { onDelete: "cascade" }),
    doctor_id: (0, pg_core_1.varchar)('doctor_id').references(function () { return exports.doctors.id; }, { onDelete: "cascade" }),
    appointment_date: (0, pg_core_1.timestamp)("appointment_date ", { withTimezone: true }).defaultNow(),
    time: (0, pg_core_1.varchar)('time'),
    status: (0, exports.APPOINTMENT_ENUM)("status")["default"]("pending").notNull(),
    type: (0, pg_core_1.varchar)('type'),
    note: (0, pg_core_1.text)("note"),
    reason: (0, pg_core_1.text)("reason"),
    cancellationReason: (0, pg_core_1.text)("cancellation_reason").notNull(),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
exports.users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.uuid)("id").notNull().primaryKey().defaultRandom().unique(),
    first: (0, pg_core_1.varchar)("first_name ", { length: 255 }).notNull(),
    email: (0, pg_core_1.text)("email").notNull().unique(),
    password: (0, pg_core_1.text)("password").notNull(),
    status: (0, exports.STATUS_ENUM)("status")["default"]("PENDING"),
    role: (0, exports.ROLE_ENUM)("role")["default"]("USER"),
    lastActivityDate: (0, pg_core_1.date)("last_activity_date").defaultNow(),
    createdAt: (0, pg_core_1.timestamp)("created_at", {
        withTimezone: true
    }).defaultNow()
});
exports.patients = (0, pg_core_1.pgTable)("patients", {
    id: (0, pg_core_1.varchar)("id", { length: 255 }).notNull().unique(),
    first_name: (0, pg_core_1.varchar)("first_name", { length: 255 }).notNull(),
    last_name: (0, pg_core_1.varchar)("last_name", { length: 255 }).notNull(),
    date_of_birth: (0, pg_core_1.date)("date_of_birth").notNull(),
    gender: (0, exports.GENDER_ENUM)("gender")["default"]("MALE").notNull(),
    phone: (0, pg_core_1.varchar)("phone", { length: 20 }),
    email: (0, pg_core_1.varchar)("email").notNull().unique(),
    address: (0, pg_core_1.varchar)("address", { length: 500 }).notNull(),
    marital_status: (0, pg_core_1.varchar)('marital_status'),
    emergency_contact_name: (0, pg_core_1.varchar)('emergency_contact_name'),
    emergency_contact_number: (0, pg_core_1.varchar)('emergency_contact_number'),
    relation: (0, pg_core_1.varchar)('relation'),
    blood_group: (0, pg_core_1.varchar)('blood_group'),
    allergies: (0, pg_core_1.text)("allergies").notNull(),
    medical_condition: (0, pg_core_1.text)("medical_condition"),
    medical_history: (0, pg_core_1.text)("medical_history"),
    insurance_provider: (0, pg_core_1.varchar)("insurance_provider"),
    insurance_number: (0, pg_core_1.varchar)("insurance_number"),
    privacy_consent: (0, pg_core_1.boolean)("privacy_consent"),
    service_consent: (0, pg_core_1.boolean)("service_consent"),
    disclosure_consent: (0, pg_core_1.boolean)("disclosure_consent"),
    img: (0, pg_core_1.varchar)("img"),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", { withTimezone: true }).defaultNow()
});
// Doctors Table
exports.doctors = (0, pg_core_1.pgTable)('doctors', {
    id: (0, pg_core_1.varchar)("id", { length: 255 }).notNull().unique(),
    email: (0, pg_core_1.varchar)('email').unique(),
    name: (0, pg_core_1.varchar)('name'),
    specialization: (0, pg_core_1.varchar)('specialization'),
    license_number: (0, pg_core_1.varchar)('license_number'),
    phone: (0, pg_core_1.varchar)('phone'),
    address: (0, pg_core_1.varchar)('address'),
    department: (0, pg_core_1.varchar)('department'),
    img: (0, pg_core_1.varchar)('img'),
    colorCode: (0, pg_core_1.varchar)('colorCode'),
    availability_status: (0, pg_core_1.varchar)('availability_status'),
    type: (0, exports.JOBTYPE_ENUM)("type")["default"]("FULL"),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
exports.staff = (0, pg_core_1.pgTable)('staff', {
    id: (0, pg_core_1.uuid)("id").notNull().primaryKey().defaultRandom().unique(),
    email: (0, pg_core_1.varchar)('email').unique(),
    name: (0, pg_core_1.varchar)('name').notNull(),
    phone: (0, pg_core_1.varchar)('phone').notNull(),
    address: (0, pg_core_1.varchar)('address').notNull(),
    department: (0, pg_core_1.varchar)('department').notNull(),
    img: (0, pg_core_1.varchar)('img'),
    license_number: (0, pg_core_1.varchar)('license_number'),
    colorCode: (0, pg_core_1.varchar)('colorCode'),
    role: (0, exports.ROLE_ENUM)("role")["default"]("ADMIN"),
    status: (0, exports.STATUS_ENUM)("status")["default"]("PENDING"),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
// Payments Table
exports.payments = (0, pg_core_1.pgTable)('payments', {
    id: (0, pg_core_1.uuid)("id").notNull().primaryKey().defaultRandom().unique(),
    bill_id: (0, pg_core_1.integer)('bill_id'),
    patient_id: (0, pg_core_1.varchar)('patient_id').references(function () { return exports.patients.id; }, { onDelete: 'cascade' }),
    appointment_id: (0, pg_core_1.uuid)('appointment_id').unique().references(function () { return exports.appointments.id; }, { onDelete: 'cascade' }),
    bill_date: (0, pg_core_1.timestamp)('bill_date'),
    payment_date: (0, pg_core_1.timestamp)('payment_date'),
    discount: (0, pg_core_1.real)('discount'),
    total_amount: (0, pg_core_1.real)('total_amount'),
    amount_paid: (0, pg_core_1.real)('amount_paid'),
    role: (0, exports.ROLE_ENUM)("role")["default"]("ADMIN"),
    payment_status: (0, exports.PAYMENTSTATUS_ENUM)("payment_status")["default"]("UNPAID"),
    payment_method: (0, exports.PAYMENTMETHOD_ENUM)("payment_method")["default"]("CASH"),
    receipt_number: (0, pg_core_1.serial)('receipt_number'),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
// Patient Bills Table
exports.patientBills = (0, pg_core_1.pgTable)('patient_bills', {
    id: (0, pg_core_1.uuid)("id").notNull().primaryKey().defaultRandom().unique(),
    bill_id: (0, pg_core_1.uuid)('bill_id').references(function () { return exports.payments.id; }, { onDelete: 'cascade' }),
    service_id: (0, pg_core_1.uuid)('service_id').references(function () { return exports.services.id; }, { onDelete: 'cascade' }),
    service_date: (0, pg_core_1.timestamp)('service_date'),
    quantity: (0, pg_core_1.integer)('quantity'),
    unit_cost: (0, pg_core_1.real)('unit_cost'),
    total_cost: (0, pg_core_1.real)('total_cost'),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
// Services Table
exports.services = (0, pg_core_1.pgTable)('services', {
    id: (0, pg_core_1.uuid)("id").notNull().primaryKey().defaultRandom().unique(),
    service_name: (0, pg_core_1.varchar)('service_name'),
    description: (0, pg_core_1.text)('description'),
    price: (0, pg_core_1.real)('price'),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
// Additional Models like Medical Records, Lab Tests, etc. follow similar pattern...
// Create Relations Between Tables
// Working Days Table
exports.workingDays = (0, pg_core_1.pgTable)('working_days', {
    id: (0, pg_core_1.uuid)("id").notNull().primaryKey().defaultRandom().unique(),
    doctor_id: (0, pg_core_1.varchar)('doctor_id').references(function () { return exports.doctors.id; }, { onDelete: 'cascade' }),
    day: (0, pg_core_1.varchar)('day'),
    start_time: (0, pg_core_1.varchar)('start_time'),
    close_time: (0, pg_core_1.varchar)('close_time'),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
// Diagnosis Table
exports.diagnoses = (0, pg_core_1.pgTable)('diagnoses', {
    id: (0, pg_core_1.uuid)("id").notNull().primaryKey().defaultRandom().unique(),
    // patient_id: varchar('patient_id').references(() => patients.id, { onDelete: 'cascade' }),
    medical_id: (0, pg_core_1.uuid)('medical_id').references(function () { return exports.medicalRecords.id; }, { onDelete: 'cascade' }),
    doctor_id: (0, pg_core_1.varchar)('doctor_id').references(function () { return exports.doctors.id; }, { onDelete: 'cascade' }),
    symptoms: (0, pg_core_1.text)('symptoms'),
    diagnosis: (0, pg_core_1.text)('diagnosis'),
    notes: (0, pg_core_1.text)('notes'),
    prescribed_medications: (0, pg_core_1.text)('prescribed_medications'),
    follow_up_plan: (0, pg_core_1.text)('follow_up_plan'),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
// Vital Signs Table
exports.vitalSigns = (0, pg_core_1.pgTable)('vital_signs', {
    id: (0, pg_core_1.uuid)("id").notNull().primaryKey().defaultRandom().unique(),
    // patient_id: varchar('patient_id').references(() => patients.id),
    medical_id: (0, pg_core_1.uuid)('medical_id').references(function () { return exports.medicalRecords.id; }, { onDelete: 'cascade' }),
    body_temperature: (0, pg_core_1.real)('body_temperature'),
    systolic: (0, pg_core_1.integer)('systolic'),
    diastolic: (0, pg_core_1.integer)('diastolic'),
    heartRate: (0, pg_core_1.varchar)('heartRate'),
    respiratory_rate: (0, pg_core_1.integer)('respiratory_rate'),
    oxygen_saturation: (0, pg_core_1.integer)('oxygen_saturation'),
    weight: (0, pg_core_1.real)('weight'),
    height: (0, pg_core_1.real)('height'),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
exports.labTests = (0, pg_core_1.pgTable)('lab_tests', {
    id: (0, pg_core_1.uuid)("id").notNull().primaryKey().defaultRandom().unique(),
    record_id: (0, pg_core_1.uuid)('record_id').references(function () { return exports.medicalRecords.id; }, { onDelete: 'cascade' }),
    service_id: (0, pg_core_1.uuid)('service_id').unique().references(function () { return exports.services.id; }),
    test_date: (0, pg_core_1.timestamp)('test_date'),
    result: (0, pg_core_1.text)('result'),
    status: (0, pg_core_1.varchar)('status'),
    notes: (0, pg_core_1.text)('notes'),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
exports.medicalRecords = (0, pg_core_1.pgTable)('medical_records', {
    id: (0, pg_core_1.uuid)("id").notNull().primaryKey().defaultRandom().unique(),
    patient_id: (0, pg_core_1.varchar)('patient_id').references(function () { return exports.patients.id; }, { onDelete: 'cascade' }),
    appointment_id: (0, pg_core_1.uuid)('appointment_id').references(function () { return exports.appointments.id; }, { onDelete: 'cascade' }),
    doctor_id: (0, pg_core_1.varchar)('doctor_id').references(function () { return exports.doctors.id; }),
    treatment_plan: (0, pg_core_1.text)('treatment_plan'),
    prescriptions: (0, pg_core_1.text)('prescriptions'),
    lab_request: (0, pg_core_1.text)('lab_request'),
    notes: (0, pg_core_1.text)('notes'),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
exports.auditLogs = (0, pg_core_1.pgTable)('audit_logs', {
    id: (0, pg_core_1.uuid)("id").notNull().primaryKey().defaultRandom().unique(),
    user_id: (0, pg_core_1.varchar)('user_id'),
    record_id: (0, pg_core_1.varchar)('record_id'),
    action: (0, pg_core_1.varchar)('action'),
    details: (0, pg_core_1.text)('details'),
    model: (0, pg_core_1.varchar)('model'),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
exports.ratings = (0, pg_core_1.pgTable)('ratings', {
    id: (0, pg_core_1.uuid)("id").notNull().primaryKey().defaultRandom().unique(),
    staff_id: (0, pg_core_1.varchar)('staff_id').references(function () { return exports.doctors.id; }, { onDelete: 'cascade' }),
    patient_id: (0, pg_core_1.varchar)('patient_id').references(function () { return exports.patients.id; }, { onDelete: 'cascade' }),
    rating: (0, pg_core_1.integer)('rating'),
    comment: (0, pg_core_1.text)('comment'),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
