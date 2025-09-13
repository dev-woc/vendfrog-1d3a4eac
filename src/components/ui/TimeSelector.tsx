import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface TimeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const TimeSelector = ({ value, onChange, placeholder = "Select time" }: TimeSelectorProps) => {
  // Parse existing value to extract hour, minute, and period
  const parseTime = (timeString: string) => {
    if (!timeString) return { hour: "", minute: "", period: "AM" };
    
    const match = timeString.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (match) {
      return {
        hour: match[1],
        minute: match[2],
        period: match[3].toUpperCase()
      };
    }
    return { hour: "", minute: "", period: "AM" };
  };

  const { hour, minute, period } = parseTime(value);

  const updateTime = (newHour?: string, newMinute?: string, newPeriod?: string) => {
    const h = newHour ?? hour;
    const m = newMinute ?? minute;
    const p = newPeriod ?? period;
    
    if (h && m && p) {
      onChange(`${h}:${m} ${p}`);
    }
  };

  // Generate hour options (1-12)
  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  
  // Generate minute options (00, 15, 30, 45)
  const minutes = ["00", "15", "30", "45"];

  return (
    <div className="flex gap-1">
      <Select value={hour} onValueChange={(value) => updateTime(value, undefined, undefined)}>
        <SelectTrigger className="w-16">
          <SelectValue placeholder="Hr" />
        </SelectTrigger>
        <SelectContent className="bg-background border shadow-md z-50">
          {hours.map((h) => (
            <SelectItem key={h} value={h}>{h}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <span className="flex items-center text-sm">:</span>
      
      <Select value={minute} onValueChange={(value) => updateTime(undefined, value, undefined)}>
        <SelectTrigger className="w-16">
          <SelectValue placeholder="Min" />
        </SelectTrigger>
        <SelectContent className="bg-background border shadow-md z-50">
          {minutes.map((m) => (
            <SelectItem key={m} value={m}>{m}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <div className="flex">
        <Button
          type="button"
          variant={period === "AM" ? "default" : "outline"}
          size="sm"
          className="h-9 px-2 text-xs rounded-r-none border-r-0"
          onClick={() => updateTime(undefined, undefined, "AM")}
        >
          AM
        </Button>
        <Button
          type="button"
          variant={period === "PM" ? "default" : "outline"}
          size="sm"
          className="h-9 px-2 text-xs rounded-l-none"
          onClick={() => updateTime(undefined, undefined, "PM")}
        >
          PM
        </Button>
      </div>
    </div>
  );
};