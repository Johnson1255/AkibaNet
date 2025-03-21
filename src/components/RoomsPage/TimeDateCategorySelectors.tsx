import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { ChevronDown, Filter } from "lucide-react";
import TimePicker from "@/components/RoomsPage/TimePicker";
import { getNextQuarterHour } from "@/utils/roomUtils";
import { useTranslation } from "react-i18next";

interface TimeDateCategorySelectorsProps {
  selectedTime: string;
  selectedDate: Date | undefined;
  selectedCategory: string;
  handleTimeChange: (time: string) => void;
  handleDateChange: (date: Date | undefined) => void;
  handleCategoryChange: (category: string) => void;
}

export default function TimeDateCategorySelectors({
  selectedTime,
  selectedDate,
  selectedCategory,
  handleTimeChange,
  handleDateChange,
  handleCategoryChange
}: TimeDateCategorySelectorsProps) {
  const { t } = useTranslation();

  const categories = [
    { id: "all", name: t("room.categories.all") },
    { id: "gaming", name: t("room.categories.gaming") },
    { id: "thinking", name: t("room.categories.thinking") },
    { id: "working", name: t("room.categories.working") },
  ];

  return (
    <div className="px-6 flex gap-3">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-[35%] h-[40px] rounded-full bg-secondary"
          >
            {selectedTime}
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <TimePicker
            date={selectedDate}
            setDate={(date: Date) => {
              const timeString = getNextQuarterHour(date);
              handleTimeChange(timeString);
            }}
          />
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-[35%] h-[40px] rounded-full bg-secondary"
          >
            {selectedDate?.toLocaleDateString() || t("room.selectors.selectDate")}{" "}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            disabled={(date) => date < new Date()}
            selected={selectedDate}
            onSelect={handleDateChange}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <Filter className="h-6 w-6" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger className="rounded-full bg-secondary">
              <SelectValue placeholder={t("room.selectors.selectCategory")} />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </PopoverContent>
      </Popover>
    </div>
  );
};