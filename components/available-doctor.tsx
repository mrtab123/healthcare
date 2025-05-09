
import { checkRole } from "@/utils/roles";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Card } from "./ui/card";
import { ProfileImage } from "./profile-image";
import { daysOfWeek } from "@/utils";
import { cn } from "@/lib/utils";
import { AvailableDoctorProps, AvailableDoctorProps2 } from "@/types";
import { db } from "@/database/drizzle";
import { doctors, workingDays } from "@/database/schema";
import { and, desc, eq, ilike } from "drizzle-orm";

const getToday = () => {
  const today = new Date().getDay();
  return daysOfWeek[today].toLowerCase();
};

const todayDay = getToday();

interface Days {
  day: string;
  start_time: string;
  close_time: string;
}

// interface DataProps {
//   data: AvailableDoctorProps2;
// }

export const availableDays = async(id: string) => {
  const todayDay = getToday();

  const data =  await db.select(
        {  
           start_time: workingDays.start_time,
           close_time: workingDays.close_time         
      }
      ).from(workingDays)
      .innerJoin(doctors, eq(doctors.id, workingDays.doctor_id))
       
        .where(
          and(
            eq(workingDays.doctor_id, id!),
            ilike(workingDays.day, todayDay))
          )    
         .limit(4).orderBy(desc(workingDays.start_time))
       


        
        return (
          <div>
           {data.map((dayObj, index) => (
            <p  key={index}>
               {dayObj.start_time} - {dayObj.close_time}
            </p>
            ))}
            </div>


        )
        
        
       
    };

  // const todaySchedule = data.find(
  //   (item) => item.day.toLowerCase() === todayDay
  // );

//   if (!data) return "Not Available";

//   return data.day.toLowerCase() === todayDay
//   ? `${data.start_time} - ${data.close_time}`
//   : "Not Available";
// };




export const AvailableDoctors = async ({ data }: AvailableDoctorProps2) => {
  return (
    <div className="bg-white rounded-xl p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-lg font-semibold">Available Doctors</h1>

        {(await checkRole("admin")) && (
          <Button
            asChild
            variant={"outline"}
            disabled={data.length === 0}
            className="disabled:cursor-not-allowed disabled:text-gray-200"
          >
            <Link href="/record/doctors">View all</Link>
          </Button>
        )}
      </div>

      <div className="w-full space-y-5 md:space-y-0 md:gap-6 flex flex-col md:flex-row md:flex-wrap">

        
        {data?.map((doc, id) => (
          <Card
            key={id}
            className=" border-none  w-full md:w-[300px] min-h-28 xl:w-full p-4 flex  gap-4 odd:bg-emerald-600/5 even:bg-yellow-600/5"
          >
            <ProfileImage
              url={doc?.img}
              name={doc?.name}
              className={`md:flex min-w-14 min-h-14 md:min-w-16 md:min-h-16 bg-blue-500`}
              textClassName="text-2xl font-semibold text-black"
              bgColor={doc?.colorCode}
            />
            {/* <p>{doc.colorCode}</p> */}
            <div>
              <h2 className="font-semibold text-lg md:text-xl">{doc?.name}</h2>
              <p className="text-base capitalize text-gray-600">
                {doc?.specialization}
              </p>
              <p className="text-sm flex items-center">
                <span className="hidden lg:flex">Available Time: </span> {" "}
                {/* {availableDays({ data: doc?.working_days })} */}
                {" "}{ doc?.start_time} - { doc?.close_time}
           
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};