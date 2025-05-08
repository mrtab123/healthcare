
import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import React from "react";

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full h-screen flex " >
      {/* <div className="w-[10%] md:w-[8%] lg:w-[16%] xl:w-[14%]"> */}
      <div className="fixed top-0 left-0 h-full w-[12%] md:w-[8%] lg:w-[16%] xl:w-[14%] bg-white shadow-md z-10">
       
       
        <Sidebar />
      </div>

      {/* <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%]  flex flex-col "> */}
      <div className=" ml-[10%] md:ml-[8%] lg:ml-[16%] xl:ml-[14%] w-[90%] md:w-[92%] lg:w-[84%] xl:w-[86%] flex flex-col">
      
        <Navbar />

        <div className="h-full p-2 overflow-y-scroll bg-gray-50 ">{children}</div>
      </div>
    </div>
  );
};

export default ProtectedLayout;