import { 
  TrendingUp, 
  TrendingDown, 
  Equal, 
  AlertCircle, 
  Circle, 
  Target,
  ArrowUp,
  ArrowDown
} from "lucide-react";

export function getContractDisplay(contractType: string) {
  const type = (contractType || "").toUpperCase();
  
  switch (type) {
    case "CALL":
    case "ASIANU":
      return { label: "Rise", icon: <TrendingUp className="h-3 w-3" />, colorClass: "text-green-700 dark:text-green-400" };
    case "PUT":
    case "ASIAND":
      return { label: "Fall", icon: <TrendingDown className="h-3 w-3" />, colorClass: "text-red-600 dark:text-red-400" };
    case "DIGITEVEN":
      return { label: "Even", icon: <Circle className="h-3 w-3" />, colorClass: "text-blue-500" };
    case "DIGITODD":
      return { label: "Odd", icon: <Circle className="h-3 w-3 border-dashed border-current rounded-full bg-transparent border-[1px]" />, colorClass: "text-orange-500" };
    case "DIGITMATCH":
      return { label: "Matches", icon: <Equal className="h-3 w-3" />, colorClass: "text-green-700 dark:text-green-400" };
    case "DIGITDIFF":
      return { label: "Differs", icon: <AlertCircle className="h-3 w-3" />, colorClass: "text-red-600 dark:text-red-400" };
    case "DIGITOVER":
      return { label: "Over", icon: <ArrowUp className="h-3 w-3" />, colorClass: "text-green-700 dark:text-green-400" };
    case "DIGITUNDER":
      return { label: "Under", icon: <ArrowDown className="h-3 w-3" />, colorClass: "text-red-600 dark:text-red-400" };
    case "ACCU":
      return { label: "Accumulator", icon: <Target className="h-3 w-3" />, colorClass: "text-green-700 dark:text-green-400" };
    default:
      // Capitalize first letter as fallback
      const fallbackLabel = type.length > 0 ? type.charAt(0) + type.slice(1).toLowerCase() : "Unknown";
      return { label: fallbackLabel, icon: <Circle className="h-3 w-3" />, colorClass: "text-zinc-400" };
  }
}
