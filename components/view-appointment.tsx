
import React from "react";
import { getAppointmentById } from "@/utils/services/appointment";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
 import { calculateAge } from "@/utils";
import { Calendar, Phone } from "lucide-react";
 import { format } from "date-fns";
import { AppointmentStatusIndicator } from "./appointment-status-indicator";
import { checkRole } from "@/utils/roles";
import { auth } from "@clerk/nextjs/server";
import { AppointmentAction } from "./appointment-action";
import { formatDateTime } from "@/lib/utils";
import { console } from "inspector";
import { ProfileImage } from "./profile-image";
import { MdPreview } from "react-icons/md";



export const ViewAppointment = async ({ id }: { id: string | undefined }) => {
  const {data}  = await getAppointmentById((id!));

  const { userId } = await auth();



  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          
          className="flex items-center justify-center rounded bg-blue-600 hover:bg-blue-700 text-white px-1.5 py-1 text-xs md:text-sm"
        >
           <MdPreview size={16} className="text-white" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[425px] max-h-[95%] md:max-w-2xl 2xl:max-w-3xl p-8 overflow-y-auto bg-white">
        <>
          <DialogHeader>
            <DialogTitle>Patient Appointment</DialogTitle>
            <DialogDescription>
              This appointment was booked on the{" "}
              {data?.created_at ? formatDateTime(data.created_at).dateTime : "N/A"} 
              {/* {formatDateTime(data.created_at.toString())} */}
            </DialogDescription>
          </DialogHeader>

          {data?.status === "cancelled" && (
            <div className="bg-yellow-100 p-4 mt-4 rounded-md">
              <span className="font-semibold text-sm">
                This appointment has been cancelled
              </span>
              <p className="text-sm">
                <strong>Reason</strong>: {data?.reason}
              </p>
            </div>
          )}

          <div className="grid gap-4 py-2">
            <p className="w-fit bg-blue-100 text-blue-600 py-1 rounded text-xs md:text-sm">
              Personal Information
            </p>

            <div className="flex flex-col md:flex-row gap-6 mb-5">
              <div className="flex gap-1 w-full md:w-1/2">
                <ProfileImage
                  url={data?.patient.img ? data?.patient.img : ""}
                  name={
                    data?.patient?.first_name + " " + data?.patient?.last_name
                  }
                  className="size-20 bg-blue-500"
                  textClassName="text-2xl"
                />

                <div className="space-y-0.5">
                  <h2 className="text-lg md:text-xl font-semibold uppercase">
                    {data?.patient?.first_name + " " + data?.patient?.last_name}
                  </h2>

                  <p className="flex items-center gap-2 text-gray-600">
                    <Calendar size={20} className="text-gray-500" />
                     {data?.patient?.date_of_birth ? calculateAge(new Date(data.patient.date_of_birth)) : "N/A"}
                  </p>

                  <span className="flex items-center text-sm gap-2">
                    <Phone size={16} className="text-gray-500" />
                    {data?.patient?.phone}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-sm text-gray-500">Address</span>
                <p className="text-gray-600 capitalize">
                  {data?.patient?.address}
                </p>
              </div>
            </div>

            <p className="w-fit bg-blue-100 text-blue-600 py-1 rounded text-xs md:text-sm">
              Appointment Information
            </p>

            <div className="grid grid-cols-3 gap-10">
              <div>
                <span className="text-sm text-gray-500">Date</span>
                <p className="text-sm text-gray-600">
                  {/* {format(data?.appointment_date, "MMM dd, yyyy")} */}
                  {data?.created_at ? formatDateTime(data?.created_at).dateTime : "N/A"} 
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Time</span>
                <p>{data?.time}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Status</span>
                <AppointmentStatusIndicator status={data?.status ?? "pending"} />
              </div>
            </div>

            {data?.note && (
              <div>
                <span className="text-sm text-gray-500">Note from Patient</span>
                <p>{data?.note}</p>
              </div>
            )}

            <p className="w-fit bg-blue-100 text-blue-600 py-1 px-2 rounded text-xs md:text-sm mt-8">
              Physician Information
            </p>
            <div className="w-full flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex gap-3">
                <ProfileImage
                  url={data?.doctor?.img ? data?.doctor?.img : ""}
                  name={data?.doctor?.name ?? ""}
                  className="xl:size-20 bg-emerald-600"
                  textClassName="xl:text-2xl"
                />
                <div className="">
                  <h2 className="text-lg uppercase font-medium">
                    {data?.doctor?.name}
                  </h2>
                  <p className="flex items-center gap-2 text-gray-600 capitalize">
                    {data?.doctor?.specialization}
                  </p>
                </div>
              </div>
            </div>

            {((await checkRole("patient")) || data?.doctor_id === userId) && (
              <>
                <p className="w-fit bg-blue-100 text-blue-600 py-1 px-2 rounded text-xs md:text-sm mt-2">
                  Perform Action
                </p>
                <AppointmentAction id={data!.id!} status={data!.status!} />
              </>
            )}
          </div>
        </>
      </DialogContent>
    </Dialog>
  );
};