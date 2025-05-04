"use client";


import { useState } from "react";

import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useRouter } from "next/navigation";
import { AppointmentStatus } from "@/constants";
import { appointmentAction } from "@/app/actions/appointment";
import toast from "react-hot-toast";


interface ActionProps {
  id: string | number;
  status: string;
}


export const AppointmentAction = ({ id, status }: ActionProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState("");
  const [reason, setReason] = useState("");
  const router = useRouter();

  const handleAction = async () => {
    try {
      setIsLoading(true);
      const newReason =
        reason ||
        `Appointment has ben ${selected.toLowerCase()} on ${new Date()}`;

      const resp = await appointmentAction(
        id,
        selected as AppointmentStatus,
        newReason
      );

      if (resp.success) {
        toast.success(resp.msg);

        router.refresh();
      } else if (resp.error) {
        toast.error(resp.msg);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong. Try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center space-x-3">
        <Button
          variant="outline"
          disabled={status === "pending" || isLoading || status === "completed"}
          className="bg-yellow-200 text-black"
          onClick={() => setSelected("pending")}
        >
          Pending
        </Button>
        <Button
          variant="outline"
          disabled={
            status === "scheduled" || isLoading || status === "completed"
          }
          className="bg-blue-200 text-black"
          onClick={() => setSelected("SCHEDULED")}
        >
          Approve
        </Button>
        <Button
          variant="outline"
          disabled={
            status === "completed" || isLoading || status === "completed"
          }
          className="bg-emerald-200 text-black"
          onClick={() => setSelected("completed")}
        >
          Completed
        </Button>
        <Button
          variant="outline"
          disabled={
            status === "cancelled" || isLoading || status === "completed"
          }
          className="bg-red-200 text-black"
          onClick={() => setSelected("cancelled")}
        >
          Cancel
        </Button>
      </div>
      {selected === "cancelled" && (
        <>
          <Textarea
            disabled={isLoading}
            className="mt-4"
            placeholder="Enter reason...."
            onChange={(e) => setReason(e.target.value)}
          ></Textarea>
        </>
      )}

      {selected && (
        <div className="flex items-center justify-between mt-6 bg-red-100 p-4 rounded">
          <p className="">Are you sure you want to perform this action?</p>
          <Button disabled={isLoading} type="button" onClick={handleAction}>
            Yes
          </Button>
        </div>
      )}
    </div>
  );
};