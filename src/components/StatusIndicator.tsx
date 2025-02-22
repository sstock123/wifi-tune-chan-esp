
import { cn } from "@/lib/utils";

interface StatusIndicatorProps {
  status: "connected" | "disconnected" | "connecting";
  className?: string;
}

const StatusIndicator = ({ status, className }: StatusIndicatorProps) => {
  const statusColors = {
    connected: "bg-green-500",
    disconnected: "bg-red-500",
    connecting: "bg-yellow-500 animate-pulse",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn("h-2 w-2 rounded-full", statusColors[status])} />
      <span className="text-sm capitalize">{status}</span>
    </div>
  );
};

export default StatusIndicator;
