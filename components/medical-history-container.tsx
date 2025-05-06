
import React from "react";
import { MedicalHistory } from "./medical-history";
import { diagnoses, doctors, labTests, medicalRecords, patients } from "@/database/schema";
import { desc, eq } from "drizzle-orm";

import { db } from "@/database/drizzle";

interface DataProps {
  id?: number | string;
  patientId: string;
}

export const MedicalHistoryContainer = async ({ id, patientId }: DataProps) => {

  const data = await db
  .select({
    id: medicalRecords.id,
    created_at: medicalRecords.created_at,
    diagnosis: {
      id: diagnoses.id,
      doctor_id: diagnoses.doctor_id,
      // description: diagnoses.description,
   
    },
    doctor: {
      id: doctors.id,
      name: doctors.name,
      specialization: doctors.specialization,
   },
    labTest: {
      id: labTests.id,
      test_date: labTests.test_date,
      result: labTests.result,
      status: labTests.status,
      notes: labTests.notes,
    },
    patient:{
      id: patients.id,
      first_name: patients.first_name,
      last_name: patients.last_name,
      gender: patients.gender,
      date_of_birth: patients.date_of_birth,
      img: patients.img,
      colorCode: patients.colorCode,
      email: patients.email,
      phone: patients.phone,
      address: patients.address,
    }
  })
  .from(medicalRecords)
  .leftJoin(diagnoses, eq(diagnoses.medical_id, medicalRecords.id))
  .leftJoin(patients, eq(patients.id, medicalRecords.patient_id))
  .innerJoin(doctors, eq(diagnoses.doctor_id, doctors.id))
  .leftJoin(labTests, eq(labTests.record_id, medicalRecords.id))
  .where(eq(medicalRecords.patient_id, patientId))
  .orderBy(desc(medicalRecords.created_at));


console.log("medical history datasssss", data);

  // const data = await db.medicalRecords.findMany({
  //   where: { patient_id: patientId },
  //   include: {
  //     diagnosis: { 
  //       include: { doctor: true }
  //      },
  //     lab_test: true,
  //   },

  //   orderBy: { created_at: "desc" },
  // });


  return (
    <>
      <MedicalHistory data={data} isShowProfile={false} />
    </>
  );
};