import { checkRole } from "@/utils/roles";
import { auth } from "@clerk/nextjs/server";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { EllipsisVertical, User } from "lucide-react";
import Link from "next/link";
import { AppointmentActionDialog } from "./appointment-action-dialog";

interface ActionsProps {
  userId: string;
  status: string;
  patientId: string;
  doctorId: string;
  appointmentId: string;
}

export const AppointmentActionOptions = async ({
  userId,
  patientId,
  doctorId,
  status,
  appointmentId,
}: ActionsProps) => {
  const user = await auth();
  const isAdmin = await checkRole("admin");

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
        
          className="flex items-center justify-center rounded p-1 bg-green-500  hover:bg-green-300 hover:text-black "
        >
          <EllipsisVertical size={16} className="text-sm text-white hover:text-black  rounded  " />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-56 p-3 bg-white rounded">
        <div className="space-y-3 flex flex-col items-start">
          <span className="text-gray-400 text-xs">Perform Actions</span>
          <Button
            size="sm"
            variant="ghost"
            className="w-full justify-start"
            asChild
          >
            <Link href={`appointments/${appointmentId}`}>
              <User size={16} /> View Full Details
            </Link>
          </Button>

          {status !== "scheduled" && (
            <AppointmentActionDialog
              type="approve"
              id={appointmentId}
              disabled={isAdmin || user.userId === doctorId}
            />
          )}
          <AppointmentActionDialog
            type="cancel"
            id={appointmentId}
            disabled={
              status === "pending" &&
              (isAdmin || user.userId === doctorId || user.userId === patientId)
            }
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};