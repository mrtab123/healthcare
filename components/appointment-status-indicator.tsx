import { AppointmentStatus } from "@/constants";
import { cn } from "@/lib/utils";


const status_color = {
  pending: "bg-yellow-600/15 text-yellow-600",
  scheduled: "bg-emerald-600/15 text-emerald-600",
  cancelled: "bg-red-600/15 text-red-600",
  completed: "bg-blue-600/15 text-blue-600",
};



export const AppointmentStatusIndicator = ({
  status,
}: {
  status: AppointmentStatus;
}) => {
  return (
    <p
      className={cn(
        "w-fit px-2 py-1 rounded uppercase text-xs lg:text-sm",
        status_color[status]
      )}
    >
      {status}
    </p>
  );
};