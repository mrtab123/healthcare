'use client'


import LoginForm from "@/components/forms/LoginForm";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";



export default function Home() {
    const [isLoading, setIsLoading] = useState(false);
  
    const handleClick = () => {
      setIsLoading(true);
    };
    
  
  return (
    <div className="flex h-screen max-h-screen ">
      
      <section className="remove-scrollbar container my-auto ">
        <div className="sub-container max-w-[496px]">
   
        {/* <div className="flex justify-center">

            <Image
                src="/assets/images/mpd2.png"
                height={150}
                width={150}
                alt="Manila Police District"
                
                
                />
          
                </div> */}

              
                
          <LoginForm />

              
                             
                         

          <div className="text-14-regular mt-20 flex justify-between">
            <p className="justify-items-end  xl:text-left">
              © 2025 My HealthCare
            </p>

          
            <p className="justify-items-end  xl:text-left">
          
            Don&apos;t have an account?{" "}
                      <Link
                href="/sign-up"
                className="text-green-500  items-center gap-2 inline"
                onClick={handleClick}
              >
                {isLoading ? (
                  <span className="spinner-border animate-spin inline-block w-4 h-4 border-2 rounded-full border-green-500 border-t-transparent"></span>
                ) : (
                  "Sign Up"
                )}
              </Link>
                 
                      </p>

          </div>
          

        </div>

      </section>

      <Image
        src="/assets/images/onboarding-img.png"
        height={1000}
        width={1000}
        alt="patient"
        className="side-img max-w-[50%]"
      />

    </div>
   
  );

}
