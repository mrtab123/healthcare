
import React from "react";
import { MedicalHistory } from "./medical-history";
import { diagnoses, labTests, medicalRecords, patients } from "@/database/schema";
import { desc, eq } from "drizzle-orm";

import { db } from "@/database/drizzle";

interface DataProps {
  id?: number | string;
  patientId: string;
}

export const MedicalHistoryContainer = async ({ id, patientId }: DataProps) => {

   const data = await db.select({
          doctor_id: diagnoses.doctor_id,
          test_date: labTests.test_date,
          result: labTests.result,
          status: labTests.status,
          notes: labTests.notes,
          diagnosis: {
            doctor_id: diagnoses.doctor_id,
          }
        })
        .from(medicalRecords)
        .innerJoin(diagnoses, eq(diagnoses.medical_id, medicalRecords.patient_id ))
        .innerJoin(labTests, eq(labTests.record_id, medicalRecords.id ))
        .where(eq(medicalRecords.patient_id, patientId)).orderBy(desc(medicalRecords.created_at));


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