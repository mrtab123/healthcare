"use client";

import { AppointmentSchema } from "@/lib/schema";
import { generateTimes } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
// import { Doctor, Patient } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { UserPen } from "lucide-react";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { ProfileImage } from "../profile-image";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { toast } from "sonner";
import { createNewAppointment } from "@/app/actions/appointment";
import { Doctor, Patient } from "@/types";
import { CustomInput } from "../custom-input";
import Image from "next/image";
import SubmitButton from "../SubmitButton";
import CustomFormField from "../CustomFormField";
import { FormFieldType } from "./LoginForm";

const TYPES = [
  { label: "General Consultation", value: "General Consultation" },
  { label: "General Check up", value: "General Check Up" },
  { label: "Antenatal", value: "Antenatal" },
  { label: "Maternity", value: "Maternity" },
  { label: "Lab Test", value: "Lab Test" },
  { label: "ANT", value: "ANT" },
];

export const BookAppointment = ({
  data,
  doctors,
}: {
  data: Patient;
  doctors: Doctor[];
}) => {
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const [physicians, setPhysicians] = useState<Doctor[] | undefined>(doctors);

  const appointmentTimes = generateTimes(8, 17, 30);

  const patientName = `${data?.first_name} ${data?.last_name}`;


  const form = useForm<z.infer<typeof AppointmentSchema>>({
    resolver: zodResolver(AppointmentSchema),
    defaultValues: {
      doctor_id: "",
      appointment_date: "",
      time: "",
      type: "",
      note: "",
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof AppointmentSchema>> = async (
    values
  ) => {
    try {
      setIsSubmitting(true);
      setLoading(true);
      const newData = { ...values, patient_id: data?.id };

      const res = await createNewAppointment(newData);

      if (res.success) {
        form.reset({});
        router.refresh();
        toast.success("Appointment created successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong. Try again later.");
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  return (
    <Sheet >
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="w-full flex items-center gap-2 justify-start text-sm font-light bg-blue-600 hover:bg-blue-700 hover:text-white text-white rounded"
        >
          <UserPen size={16} /> Book Appointment
        </Button>
      </SheetTrigger>

      <SheetContent className="rounded-xl rounded-r-2xl md:h-p[95%] md:top-[2.5%] md:right-[1%] w-full bg-white ">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <span> 
              <Image
            src="/assets/icons/loader.svg"
            alt="loader"
            width={24}
            height={24}
            className="animate-spin"
          />
          Loading...</span>
          </div>




        ) : (
          <div className="h-full overflow-y-auto p-4">
            <SheetHeader>
              <SheetTitle>Book Appointment</SheetTitle>
            </SheetHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 mt-5 2xl:mt-10"
              >
                <div className="w-full rounded-md border border-input bg-background px-3 py-1 flex items-center gap-4">
                  <ProfileImage
                    url={data?.img}
                    name={patientName}
                    className="size-16 border border-input"
                    // bgColor={data?.colorCode!}
                  />

                  <div>
                    <p className="font-semibold text-lg">{patientName}</p>
                    <span className="text-sm text-gray-500 capitalize">
                      {data?.gender}
                    </span>
                  </div>
                </div>

                <CustomInput
                  type="select"
                  selectList={TYPES}
                  control={form.control}
                  name="type"
                  label="Appointment Type"
                  placeholder="Select a appointment type"
                />



      <CustomFormField
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name="doctor_id"                             
          label="Select a Physician"                                
          placeholder="Select a Physician"                              
        > 
         {physicians?.map((doctor, id)  => (
            <SelectItem key={id} value={doctor.id}>
              <div className="flex cursor-pointer items-center gap-2">                
                              <ProfileImage
                                  url={doctor?.img}
                                  name={doctor?.name}
                                 
                                  bgColor={doctor?.colorCode}
                                  textClassName="text-black"
                                />

                    <div>

                        <p className="font-medium text-start ">
                                    {doctor?.name}
                                  </p>
                         <span className="text-sm text-gray-600">
                                    {doctor?.specialization}
                                  </span>
                    </div>
                    
              </div>
            </SelectItem>

         ))}
        
        </CustomFormField>



{/* 
             <FormField
                  control={form.control}
                  name="doctor_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Physician</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isSubmitting}
                      >
                        <FormControl >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a physician" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white">
                          {physicians?.map((i, id) => (
                            <SelectItem key={id} value={i.id} className="p-2">
                              <div className="flex cursor-pointer items-center gap-2">
                                <ProfileImage
                                  url={i?.img}
                                  name={i?.name}
                                 
                                  bgColor={i?.colorCode}
                                  textClassName="text-black"
                                />
                                <div>
                                  <p className="font-medium text-start ">
                                    {i.name}
                                  </p>
                                  <span className="text-sm text-gray-600">
                                    {i?.specialization}
                                  </span>
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />  */}

                <div className="flex items-center gap-2">
                  <CustomInput
                    type="input"
                    control={form.control}
                    name="appointment_date"
                    placeholder=""
                    label="Date"
                    inputType="date"
                  />
                  <CustomInput
                    type="select"
                    control={form.control}
                    name="time"
                    placeholder="Select time"
                    label="Time"
                    selectList={appointmentTimes}
                  />
                </div>

                <CustomInput
                  type="textarea"
                  control={form.control}
                  name="note"
                  placeholder="Additional note"
                  label="Additional Note"
                />

                {/* <Button
                  disabled={isSubmitting}
                  type="submit"
                  className="bg-blue-600 w-full"
                >
                  Submit
                </Button> */}

                <SubmitButton isLoading={loading}>Submit</SubmitButton>
              </form>
            </Form>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};