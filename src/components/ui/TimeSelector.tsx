import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface TimeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const TimeSelector = ({ value, onChange, placeholder = "Select time" }: TimeSelectorProps) => {
  const isTBA = value === "TBA";
  
  // Parse existing value to extract time and period
  const parseTime = (timeString: string) => {
    if (!timeString || timeString === "TBA") return { time: "", period: "AM" };
    
    const match = timeString.match(/(\d{1,2}:\d{2})\s*(AM|PM)/i);
    if (match) {
      return {
        time: match[1],
        period: match[2].toUpperCase()
      };
    }
    return { time: "", period: "AM" };
  };

  const { time, period } = parseTime(value);

  const updateTime = (newTime?: string, newPeriod?: string) => {
    const t = newTime ?? time;
    const p = newPeriod ?? period;
    
    if (t && p) {
      onChange(`${t} ${p}`);
    }
  };

  const handleTBAToggle = (checked: boolean) => {
    if (checked) {
      onChange("TBA");
    } else {
      onChange("");
    }
  };

  // Generate time options (12:00, 12:15, 12:30, 12:45, 1:00, etc.)
  const timeOptions = [];
  for (let hour = 1; hour <= 12; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const timeString = `${hour}:${minute.toString().padStart(2, '0')}`;
      timeOptions.push(timeString);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <Switch
          id="tba-toggle"
          checked={isTBA}
          onCheckedChange={handleTBAToggle}
        />
        <Label htmlFor="tba-toggle" className="text-sm">
          TBA (To Be Announced)
        </Label>
      </div>
      
      {!isTBA && (
        <div className="flex gap-2">
          <Select value={time} onValueChange={(value) => updateTime(value, undefined)}>
            <SelectTrigger className="w-20">
              <SelectValue placeholder="Time" />
            </SelectTrigger>
            <SelectContent className="bg-background border shadow-md z-50 max-h-60">
              {timeOptions.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="flex">
            <Button
              type="button"
              variant={period === "AM" ? "default" : "outline"}
              size="sm"
              className="h-9 px-3 text-xs rounded-r-none border-r-0"
              onClick={() => updateTime(undefined, "AM")}
            >
              AM
            </Button>
            <Button
              type="button"
              variant={period === "PM" ? "default" : "outline"}
              size="sm"
              className="h-9 px-3 text-xs rounded-l-none"
              onClick={() => updateTime(undefined, "PM")}
            >
              PM
            </Button>
          </div>
        </div>
      )}
      
      {isTBA && (
        <div className="text-sm text-muted-foreground p-2 bg-muted/30 rounded">
          Time to be announced
        </div>
      )}
    </div>
  );
};