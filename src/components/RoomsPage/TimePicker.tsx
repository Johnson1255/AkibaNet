import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface TimePickerProps {
  date?: Date;
  setDate: (date: Date) => void;
}

export default function TimePicker({ date, setDate }: TimePickerProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = [0, 15, 30, 45];

  const handleTimeChange = (hour: number, minute: number) => {
    if (date) {
      const newDate = new Date(date);
      newDate.setHours(hour);
      newDate.setMinutes(minute);
      setDate(newDate);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
      <ScrollArea className="w-64 sm:w-auto">
        <div className="flex sm:flex-col p-2">
          {hours.map((hour) => (
            <Button
              key={hour}
              size="icon"
              variant={date && date.getHours() === hour ? "default" : "ghost"}
              className="sm:w-full shrink-0 aspect-square"
              onClick={() => handleTimeChange(hour, date?.getMinutes() ?? 0)}
            >
              {hour.toString().padStart(2, '0')}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="sm:hidden" />
      </ScrollArea>
      <ScrollArea className="w-64 sm:w-auto">
        <div className="flex sm:flex-col p-2">
          {minutes.map((minute) => (
            <Button
              key={minute}
              size="icon"
              variant={date && date.getMinutes() === minute ? "default" : "ghost"}
              className="sm:w-full shrink-0 aspect-square"
              onClick={() => handleTimeChange(date?.getHours() ?? 0, minute)}
            >
              {minute.toString().padStart(2, '0')}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="sm:hidden" />
      </ScrollArea>
    </div>
  );
}