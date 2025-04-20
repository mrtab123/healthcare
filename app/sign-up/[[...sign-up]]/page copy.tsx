import PatientForm from "@/components/forms/LoginForm";
import Image from "next/image";
import Link from "next/link";



export default function Home() {
  return (
    <div className="flex h-screen max-h-screen">
      {/* OTP VERIFICATION */}
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[496px]">
        <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="patient"
            className="mb-12 h-10 w-fit"
          />
          <PatientForm />

          <div className="text-14-regular mt-20 flex justify-between">
            <p className="justify-items-end text-dark-600 xl:text-left">
              © 2025 MPD-ITPNCO
            </p>

            <p className="justify-items-end text-dark-600 xl:text-left">

            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="text-green-500">
              Sign up
            </Link>
            </p>

          </div>
          

        </div>

      </section>

      <Image
        src="/assets/images/mpd.png"
        height={1000}
        width={1000}
        alt="patient"
        className="side-img max-w-[50%]"
      />

    </div>
   
  );

}
