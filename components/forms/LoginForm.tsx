"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Form } from "@/components/ui/form"


import { useState } from "react"
import { toast } from "react-hot-toast"
import { useSignIn } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { UserFormValidation } from "@/lib/validation"



export enum FormFieldType {
  INPUT = "input",
  PASSWORD = 'password',
  TEXTAREA = "textarea",
  PHONE_INPUT = "phoneInput",
  CHECKBOX = "checkbox",
  DATE_PICKER = "datePicker",
  SELECT = "select",
  SKELETON = "skeleton",
}

const  LoginForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { signIn,setActive } = useSignIn();


  // 1. Define your form.
  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      email: "tabadaeater123@gmail.com",
      password: "Mpd12345678@",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit({email,password}: z.infer<typeof UserFormValidation>)  {
    setIsLoading(true); 
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    try {
     
      const result = await signIn?.create({
        identifier: email,
        password,
      });



      if (result?.status === "complete") {
        await setActive!({ session: result.createdSessionId });
        toast.success("Login successful");
  
        router.push("/");;
      } else {
        console.error("Login failed result:", result);
        toast.error("Login failed. Please check your email and password");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }

    
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-12 space-y-4 items-center justify-center">
            <h1>Sign in to My HealtCare</h1>
            <p className="text-dark-700">Welcome Back! Please sign in to continue</p>
        </section>

        

       

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="email"
          label="Email"
          placeholder="Example@gmail.com"
          iconSrc="/assets/icons/email.svg"
          iconAlt="email"
        />

<CustomFormField
          fieldType={FormFieldType.PASSWORD}
          control={form.control}
          name="password"
          label="Password"
          placeholder="Enter your password"
          iconSrc="/assets/icons/lock.svg"
          iconAlt="lock"       
          
        />
      
       
       <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
  )


}

export default LoginForm
