'use client'
import RegisterForm from "@/components/forms/RegisterForm";

import Image from "next/image";

import Link from "next/link";
import { useState } from "react";

const Register =  () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
  };
  
  return (
    <div className="flex h-screen max-h-screen  ">
   
    <section className="remove-scrollbar container">
      <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
        <div className="items-center justify-center">

      {/* <Image
           src="/assets/images/mpd2.png"
          height={1000}
          width={1000}
          alt="patient"
          className="mb-12 h-70 w-auto"
          /> */}
          </div>

        
              <RegisterForm  />
        

               


  
          <div className="text-14-regular mt-10 pb-5 flex justify-between">
                      <p className="justify-items-end  xl:text-left">
                        © 2025 MPD-ITPNCO
                      </p>
          
                      <p className="justify-items-end  xl:text-left">
          
                      Already have an account?{" "}
                      <Link
                href="/sign-in"
                className="text-green-500  items-center gap-2 inline"
                onClick={handleClick}
              >
                {isLoading ? (
                  <span className="spinner-border animate-spin inline-block w-4 h-4 border-2 rounded-full border-green-500 border-t-transparent"></span>
                ) : (
                  "Sign in"
                )}
              </Link>
                 
                      </p>
          
                    </div>

         
          
                      
        
      </div>

    </section>

    <Image
      src="/assets/images/register-img.png"
      height={1000}
      width={1000}
      alt="patient"
      className="side-img max-w-[390px]"
    />

  </div>
  );
};

export default Register;
