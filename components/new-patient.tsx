'use client'

 import {  useUser } from '@clerk/nextjs';
// import { useRouter } from 'next/navigation';
import React, {  useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import CustomFormField from './CustomFormField';
import { FormFieldType } from './forms/LoginForm';
import SubmitButton from './SubmitButton';
import { Form, FormControl } from './ui/form';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Doctors, GenderOptions,  MaritalStatus, RELATION } from '@/constants';
import { Label } from './ui/label';
import { SelectItem } from './ui/select';
import Image from 'next/image';
import { FileUploader } from './FileUploader';
import { useRouter } from 'next/navigation';
import {  SubmitHandler, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PatientFormSchema } from '@/lib/schema';
import { createNewPatient, updatePatient } from '@/app/actions/patients';
import toast from 'react-hot-toast';

// import CustomFormField from './CustomFormField';
// import { Form } from './ui/form';
// import SubmitButton from './SubmitButton';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { PatientFormSchema } from '@/lib/schema';
// import { z } from 'zod';



// interface DataProps{
//   data?: PatientsParams;
//   type?: "create" | "update";
// }

export const NewPatient = ({ 
  type, 
  data
 }:  {
   data: PatientsParams
  type: string, 
  
}) => {
  const router = useRouter();
 
  const { user } = useUser();
  //  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);  // const [imgURL, setImgURL] = useState<any>();

  const userData = {
    first_name: user?.firstName || "",
    last_name: user?.lastName || "",
    email: user?.emailAddresses[0].emailAddress || "",
    phone: user?.phoneNumbers?.toString() || "",
  };
   const isDataValid = data && typeof data === 'object' && Object.keys(data).length > 0;
   let  userData2:PatientsParams;

if(isDataValid){

  userData2 = {
      first_name: data[0]!.first_name,
      last_name: data[0]!.last_name,
      email: data[0]!.email,
      phone: data[0]!.phone,
      gender: data[0]!.gender,
      address: data[0]!.address,
      date_of_birth: new Date(data[0]!.date_of_birth),
      marital_status: data[0]!.marital_status,
      emergency_contact_name: data[0]!.emergency_contact_name,
      emergency_contact_number: data[0]!.emergency_contact_number,
      relation: data[0]!.relation,
      blood_group: data[0]!.blood_group,
      allergies: data[0]!.allergies,
      medical_condition: data[0]!.medical_condition,
      medical_history: data[0]!.medical_history,
      insurance_provider: data[0]!.insurance_provider,
      insurance_number: data[0]!.insurance_number,
      privacy_consent: data[0]!.privacy_consent,
      service_consent: data[0]!.service_consent,
      disclosure_consent: data[0]!.disclosure_consent,
    };
  
  
  }

    // 1. Define your form.
    const userId = user?.id;
    const form = useForm<z.infer<typeof PatientFormSchema>>({
      resolver: zodResolver(PatientFormSchema),
      defaultValues: {      
        ...userData,
        gender: "MALE" as Gender,
       address: "",
      date_of_birth: new Date(), // Ensure this is a Date object
      marital_status: "Single",
      emergency_contact_name: "",
      emergency_contact_number: "",
      relation: "Mother",
      blood_group: "",
      allergies: "",
      medical_condition: "",
      medical_history: "",
      insurance_provider: "",
      insurance_number: "",
      privacy_consent: false,
      service_consent: false,
      disclosure_consent: false,      
  },
  
    });

  
    // 2. Define a submit handler.
    // const onSubmit = async (values: z.infer<typeof PatientFormSchema>) => {
  const onSubmit: SubmitHandler<z.infer<typeof PatientFormSchema>> = async (
    values
  ) => {

     setIsLoading(true);
     
    const res =
      type === "create"
        ? await createNewPatient(values, userId!)
        : await updatePatient(values, userId!);

    setIsLoading(false);

    if (res?.success) {
      toast.success(res.msg);
      form.reset();
      router.push("/patient");
    } else {
      console.log(res);
      toast.error("Failed to create patient");
    }
  };
console.log(type);



useEffect(() => {
  if (type === "create" && userData) {
    form.reset({ ...userData });
  } else if (type === "update" && userData2) {      
    form.reset({ 
      ...userData2, 
    });
  }
}, [user, data, type]);
  return (
    <Card className="max-w-5xl w-full p-4 bg-white">
    <CardHeader>
      <CardTitle className="sub-header">Patient Registration</CardTitle>
      <CardDescription>
        Please provide all the information below to help us understand better
        and provide good and quality service to you.
      </CardDescription>
    </CardHeader>


    <CardContent>
      
       <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex-1">
           
              <section className=" space-y-6">
                <div className="mb-9 space-x-1">
                  <h2 className="sub-header">Personal Information</h2>
                </div>
              </section>
              
              <div className="flex flex-col gap-6 xl:flex-row">

               <CustomFormField
                 fieldType={FormFieldType.INPUT}
                 control={form.control}
                 name="first_name"
                 label="First name"
                 placeholder="John"
                 iconSrc="/assets/icons/user.svg"
                 iconAlt="user"
                 />
               <CustomFormField
                 fieldType={FormFieldType.INPUT}
                 control={form.control}
                 name="last_name"
                 label="Last name"
                 placeholder="Doe"
                 iconSrc="/assets/icons/user.svg"
                 iconAlt="user"
                 />
                 </div>
              
             
             <div className="flex flex-col gap-6 xl:flex-row"> 
                                        
              <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="email"
                    label="Email address"
                    placeholder="johndoe@gmail.com"
                    iconSrc="/assets/icons/email.svg"
                    iconAlt="email"
                  />
      
                  <CustomFormField
                    fieldType={FormFieldType.PHONE_INPUT}
                    control={form.control}
                    name="phone"
                    label="Phone Number"
                    placeholder=" (555) 123-4567"
                  />
      
              </div>               
      
             <div className="flex flex-col gap-6 xl:flex-row"> 
      
             <CustomFormField
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name="date_of_birth"
              label="Date of Birth"
              showTimeSelect
              dateFormat="MM/dd/yyy"
            />

                
      
                  <CustomFormField
                    fieldType={FormFieldType.SKELETON}
                    control={form.control}
                    name="gender"
                    label="Gender"
                    renderSkeleton={(field) => (
                      <FormControl>
                          <RadioGroup className="flex h-11 gap-6 xl:justify-between"
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                             {GenderOptions.map((option) => (
                              <div key={option} className="radio-group">
                                  <RadioGroupItem value={option} id={option} />
                                  <Label htmlFor={option} className="cursor-pointer">
                                    {option}
                                  </Label>
                              </div>
                             ))}
                          </RadioGroup>
                      </FormControl>
                    )}
                  />
      
             </div>
      
      
             <div className="flex flex-col gap-6 xl:flex-row"> 
      
              <CustomFormField
                 fieldType={FormFieldType.INPUT}
                 control={form.control}
                 name="address"
                 label="Address"
                 placeholder="14th Street, Metro Manila"
                
                 />
      
           



              
                  
      
             </div>
      
      
             <div className="flex flex-col gap-6 xl:flex-row"> 
             <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="emergency_contact_name"                               
                label="Emergency Contact Name"                                
                placeholder="Guardian's name"                              
                                              
              />                            
                                
              <CustomFormField
                fieldType={FormFieldType.PHONE_INPUT}
                control={form.control}
                name="emergency_contact_number"                               
                label="Emergency Contact Number"                                
                  placeholder="(555) 123-4567"
              />
                                
              </div> 

              
             <div className="flex flex-col gap-6 xl:flex-row"> 
              < CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="relation"                               
                label="Relation"                                
                placeholder="Select relation with contact person"                              
              > 
               {RELATION.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
      
               ))}
              
              </CustomFormField>                          
                                
             
              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="marital_status"                               
                label="Marital Status"                                
                placeholder="Select marital status"                              
              > 
               {MaritalStatus.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
      
               ))}
              
              </CustomFormField>   

                                
              </div> 
                                        
                                         
      
      
             <section className=" space-y-6">
                <div className="mb-9 space-x-1">
                  <h2 className="sub-header">Medical Information</h2>
                </div>
              </section>


              <div className="flex flex-col gap-6 xl:flex-row"> 
               <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="blood_group"                               
                placeholder="A+"
                label="Blood group"                            
                                              
              />                            
                                
                <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="allergies"                               
                label="Allergies (if any)"                                
                placeholder="Peanuts, Penicillin"                              
                                              
              /> 
                                
              </div> 
      
              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="primaryPhysician"                               
                label="Primary Physician"                                
                placeholder="Select a physician"   
                                        
              > 
               {Doctors.map((doctor) => (
                  <SelectItem key={doctor.name} value={doctor.name}>
                    <div className="flex cursor-pointer items-center gap-2 ">
                        <Image 
                          src={doctor.image}
                          width={32}
                          height={32}
                          alt="doctor"
                          className="rounded-full border border-dark-500"
                          />
                          <p>{doctor.name}</p>
                    </div>
                  </SelectItem>
      
               ))}
              
              </CustomFormField>
      
      
      
              <div className="flex flex-col gap-6 xl:flex-row"> 
               <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="medical_condition"
                placeholder="Medical conditions"
                label="Medical conditions"                              
                                              
              />                            
                                
               <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="medical_history"
                placeholder="Medical history"
                label="Medical history"                              
                                              
              /> 
                                
              </div> 
      
      
      
              <div className="flex flex-col gap-6 xl:flex-row"> 
                                         
                                
                                <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="insurance_provider"
                  placeholder="Insurance provider"
                  label="Insurance provider"                              
                                              
              />     


<CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="insurance_number"
                  placeholder="Insurance number"
                  label="Insurance number"                             
                                              
              />  
                                
              </div> 
      
      
              <div className="flex flex-col gap-6 xl:flex-row"> 
                                      
                                
                                {/* <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="pastMedicalHistory"                               
                label="Past Medical History"                                
                placeholder="Appendectomy, Tonsillectomy"                              
                                              
              />      */}
                                
              </div> 
      
              <section className=" space-y-6">
                <div className="mb-9 space-x-1">
                  <h2 className="sub-header">Identification and Verification</h2>
                </div>
              </section>
      
      
      
              
              {/* <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="identificationType"                               
                label="Identification Type"                                
                placeholder="Select an identification type"                              
              > 
               {IdentificationTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
      
               ))}
              
              </CustomFormField> */}
      
      
              
            
            <CustomFormField
                    fieldType={FormFieldType.SKELETON}
                    control={form.control}
                    name="identificationDocument"
                    label="Scanned copy of identification document"
                    renderSkeleton={(field) => (
                      <FormControl>
                          <FileUploader files={field.value} onChange={field.onChange} />
                      </FormControl>
                    )}
                  />
            
      
            <section className=" space-y-6">
                <div className="mb-9 space-x-1">
                  <h2 className="sub-header">Consent and Privacy</h2>
                </div>
              </section>
      
      
              <CustomFormField
                  fieldType={FormFieldType.CHECKBOX}
                  control={form.control}
                  name="privacy_consent"
                    label=" Privacy Policy Agreement"
                    placeholder=" I consent to the collection, storage, and use of my
                    personal and health information as outlined in the Privacy
                    Policy. I understand how my data will be used, who it may
                    be shared with, and my rights regarding access,
                    correction, and deletion of my data."
              />
      
             <CustomFormField
                  fieldType={FormFieldType.CHECKBOX}
                  control={form.control}
                  name="service_consent"
                    label=" Terms of Service Agreement"
                    placeholder=" I agree to the Terms of Service, including my
                    responsibilities as a user of this healthcare management
                    system, the limitations of liability, and the dispute
                    resolution process. I understand that continued use of
                    this service is contingent upon my adherence to these
                    terms."
                />
      
            <CustomFormField
                  fieldType={FormFieldType.CHECKBOX}
                  control={form.control}
                  name="disclosure_consent"
                  label="Informed Consent for Medical Treatment"
                  placeholder="I provide informed consent to receive medical treatment
                  and services through this healthcare management system. I
                  acknowledge that I have been informed of the nature,
                  risks, benefits, and alternatives to the proposed
                  treatments and that I have the right to ask questions and
                  receive further information before proceeding."
              />
      
             <SubmitButton isLoading={isLoading} > {type === "create" ? "Submit" : "Update"}</SubmitButton>
            </form>
          </Form>


      </CardContent>
    </Card>
  )
}

