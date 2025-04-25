// drizzle/seed.ts
import { db } from './db'; // Make sure this points to your drizzle db setup
import { faker } from '@faker-js/faker';
import {
  users, patients, doctors, appointments, services, payments,
  patientBills, workingDays, diagnoses, vitalSigns, labTests,
  medicalRecords, auditLogs, ratings
} from './schema';

async function seed() {
  // Seed Users
  const userData = Array.from({ length: 5 }).map(() => ({
    id: faker.string.uuid(),
    first: faker.person.firstName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    status: 'APPROVED' as const,
    role: 'USER',
    last_activity_date: new Date(),
    created_at: new Date(),
    updated_at: new Date(), // Add this if required
  }));

  await db.insert(users).values(userData);
  console.log('✅ Seeded users');

  // Seed Patients
  const patientData = Array.from({ length: 5 }).map(() => ({
    id: faker.string.uuid(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    date_of_birth: faker.date.birthdate().toISOString(),
    gender: faker.helpers.arrayElement(['MALE', 'FEMALE']),
    phone: faker.phone.number(),
    email: faker.internet.email(),
    address: faker.location.streetAddress(),
    marital_status: 'single',
    emergency_contact_name: faker.person.fullName(),
    emergency_contact_number: faker.phone.number(),
    relation: 'Sibling',
    blood_group: 'O+',
    allergies: 'None',
    medical_condition: 'Healthy',
    medical_history: 'None',
    insurance_provider: faker.company.name(),
    insurance_number: faker.finance.accountNumber(),
    privacy_consent: true,
    service_consent: true,
    disclosure_consent: true,
    img: faker.image.avatar(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  await db.insert(patients).values(patientData);
  console.log('✅ Seeded patients');

  // Seed Doctors
  const doctorData = Array.from({ length: 5 }).map(() => ({
    id: faker.string.uuid(),
    email: faker.internet.email(),
    name: faker.person.fullName(),
    specialization: 'General',
    license_number: faker.string.alphanumeric(10),
    phone: faker.phone.number(),
    address: faker.location.streetAddress(),
    department: 'General',
    img: faker.image.avatar(),
    colorCode: '#ff5733',
    availability_status: 'Available',
    type: 'FULL' as const,
    created_at: new Date(),
    updated_at: new Date(),
  }));

  await db.insert(doctors).values(doctorData);
  console.log('✅ Seeded doctors');

  // Seed Services
  const serviceData = Array.from({ length: 5 }).map(() => ({
    id: faker.string.uuid(),
    service_name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: parseFloat(faker.commerce.price()),
    created_at: new Date(),
    updated_at: new Date(),
  }));

  await db.insert(services).values(serviceData);
  console.log('✅ Seeded services');

  // Seed Appointments
  const appointmentData = Array.from({ length: 5 }).map((_, i) => ({
    id: faker.string.uuid(),
    patient_id: patientData[i % patientData.length].id,
    doctor_id: doctorData[i % doctorData.length].id,
    appointment_date: faker.date.future(),
    time: '10:00',
    status: 'scheduled' as const,
    type: 'Consultation',
    note: 'Initial consultation',
    reason: 'Routine checkup',
    cancellationReason: '',
    created_at: new Date(),
    updated_at: new Date(),
  }));

  await db.insert(appointments).values(appointmentData);
  console.log('✅ Seeded appointments');

  // Seed Medical Records
  const recordData = appointmentData.map((appt) => ({
    id: faker.string.uuid(),
    patient_id: appt.patient_id,
    appointment_id: appt.id,
    doctor_id: appt.doctor_id,
    treatment_plan: 'Rest and hydration',
    prescriptions: 'Paracetamol',
    lab_request: 'Blood Test',
    notes: 'Monitor vitals',
    created_at: new Date(),
    updated_at: new Date(),
  }));

  await db.insert(medicalRecords).values(recordData);
  console.log('✅ Seeded medical records');

  // Seed Payments
  const paymentData = appointmentData.map((appt) => ({
    id: faker.string.uuid(),
    bill_id: faker.number.int({ min: 1, max: 1000 }), // Ensure this matches the schema
    patient_id: appt.patient_id,
    appointment_id: appt.id,
    bill_date: new Date(),
    payment_date: new Date(),
    discount: 0,
    total_amount: 100,
    amount_paid: 100,
    role: 'ADMIN', // Ensure this matches the database enum or column type
    payment_status: 'PAID', // Ensure this matches the database enum or column type
    payment_method: 'CASH', // Ensure this matches the database enum or column type
    receipt_number: faker.number.int({ min: 1000, max: 9999 }), // Generate unique receipt numbers
    created_at: new Date(),
    updated_at: new Date(),
  }));

  await db.insert(payments).values(paymentData);
  console.log('✅ Seeded payments');

  // Seed Patient Bills
  const billData = serviceData.map((service, i) => ({
    id: faker.string.uuid(),
    bill_id: paymentData[i % paymentData.length].id,
    service_id: service.id,
    service_date: new Date(),
    quantity: 1,
    unit_cost: service.price,
    total_cost: service.price,
    created_at: new Date(),
    updated_at: new Date(),
  }));

  await db.insert(patientBills).values(billData);
  console.log('✅ Seeded patient bills');

  // Seed Working Days
  const workingDaysData = doctorData.map((doc) => ({
    id: faker.string.uuid(),
    doctor_id: doc.id,
    day: 'Monday',
    start_time: '09:00',
    close_time: '17:00',
    created_at: new Date(),
    updated_at: new Date(),
  }));

  await db.insert(workingDays).values(workingDaysData);
  console.log('✅ Seeded working days');

  // Seed Diagnoses
  const diagnosisData = recordData.map((record) => ({
    id: faker.string.uuid(),
    medical_id: record.id,
    doctor_id: record.doctor_id,
    symptoms: 'Cough, Fever',
    diagnosis: 'Flu',
    notes: 'Prescribed meds',
    prescribed_medications: 'Ibuprofen',
    follow_up_plan: 'Next week',
    created_at: new Date(),
    updated_at: new Date(),
  }));

  await db.insert(diagnoses).values(diagnosisData);
  console.log('✅ Seeded diagnoses');

  // Seed Vital Signs
  const vitalsData = recordData.map((record) => ({
    id: faker.string.uuid(),
    medical_id: record.id,
    body_temperature: 37.0,
    systolic: 120,
    diastolic: 80,
    heartRate: '75',
    respiratory_rate: 18,
    oxygen_saturation: 98,
    weight: 70,
    height: 170,
    created_at: new Date(),
    updated_at: new Date(),
  }));

  await db.insert(vitalSigns).values(vitalsData);
  console.log('✅ Seeded vital signs');

  // Seed Lab Tests
  const labTestsData = recordData.map((record, i) => ({
    id: faker.string.uuid(),
    record_id: record.id,
    service_id: serviceData[i % serviceData.length].id,
    test_date: new Date(),
    result: 'Normal',
    status: 'Completed',
    notes: 'No issues',
    created_at: new Date(),
    updated_at: new Date(),
  }));

  await db.insert(labTests).values(labTestsData);
  console.log('✅ Seeded lab tests');

  // Seed Audit Logs
  const auditData = userData.map((user) => ({
    id: faker.string.uuid(),
    user_id: user.id,
    record_id: faker.string.uuid(),
    action: 'CREATE',
    details: 'Created record',
    model: 'patients',
    created_at: new Date(),
    updated_at: new Date(),
  }));

  await db.insert(auditLogs).values(auditData);
  console.log('✅ Seeded audit logs');

  // Seed Ratings
  const ratingsData = Array.from({ length: 5 }).map(() => ({
    id: faker.string.uuid(),
    staff_id: faker.helpers.arrayElement(doctorData).id,
    patient_id: faker.helpers.arrayElement(patientData).id,
    rating: faker.number.int({ min: 1, max: 5 }),
    comment: faker.lorem.sentence(),
    created_at: new Date(),
    updated_at: new Date(),
  }));

  await db.insert(ratings).values(ratingsData);
  console.log('✅ Seeded ratings');

  console.log('🎉 All data seeded successfully!');
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
