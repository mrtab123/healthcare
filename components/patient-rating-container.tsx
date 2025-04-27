
import { auth } from "@clerk/nextjs/server";
import React from "react";
import { RatingList } from "./rating-list";
import { db } from "@/database/drizzle";
import { patients, ratings } from "@/database/schema";
import { desc, eq } from "drizzle-orm";


export const PatientRatingContainer = async ({ id }: { id?: string }) => {
  const { userId } = await auth();


      const data = await db.select({
        id: ratings.id,
        rating: ratings.rating,
        comment: ratings.comment,
        created_at: ratings.created_at,
        patient:{
          first_name: patients.first_name,
          last_name: patients.last_name,
        }
        
      })
      .from(ratings)
      .innerJoin(patients, eq(patients.id, ratings.patient_id ))
      .where(eq(patients.id, id ? id: userId!))
      .limit(10).orderBy(desc(ratings.created_at));   

  // const data = await db.rating.findMany({
  //   take: 10,

  //   where: { patient_id: id ? id : userId! },
  //   include: { patient: { select: { last_name: true, first_name: true } } },
  //   orderBy: { created_at: "desc" },
  // });
console.log("PATIENT RATING", data);
  if (!data) return null;

  return (
    <div>
      <RatingList data={data} />
    </div>
  );
};