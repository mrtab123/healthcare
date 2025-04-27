'use client'
import React from 'react'
import * as XLSX from "xlsx";

const ExcelButton = ({data}:any) => {
    // Export to Excel Function
     const exportToExcel = () => {
      const worksheet = XLSX.utils.json_to_sheet(data); // Convert data to worksheet
      const workbook = XLSX.utils.book_new(); // Create a new workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, "Appointments"); // Append the worksheet
      XLSX.writeFile(workbook, "appointments.xlsx"); // Download the Excel file
    };
  

  return (
    <div className="w-full lg:w-fit flex items-center justify-between lg:justify-start gap-2">
       <button
            onClick={exportToExcel}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Export to Excel
          </button>
    </div>
  )
}

export default ExcelButton
