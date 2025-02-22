import { useState } from "react";
import { ArrowLeft, Filter, ChevronDown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import TimePicker from "./time-picker";

interface Room {
  id: number;
  status: "available" | "selected" | "disabled";
}

export default function RoomSelection() {
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [selectedTime, setSelectedTime] = useState<string>("10:00 pm");
const rooms: Room[] = Array.from({ length: 35 }, (_, i) => ({
    id: i + 1,
    status: [3, 17, 22, 24, 29, 32].includes(i + 1) ? "disabled" : "available"
}));

  const handleRoomSelect = (roomId: number) => {
    setSelectedRoom(roomId === selectedRoom ? null : roomId);
  };

  return (
    <div className="bg-gray-100">
      {/* Header */}
      <header className="p-4 flex items-center justify-between">
        <Button variant="ghost" size="icon" className="rounded-full">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-normal">Select a Room</h1>
        <div className="w-6" /> {/* Spacer for alignment */}

      </header>

      {/* Time and Date Selection */}
      <div className="bg-gray-200 p-4 flex gap-3">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="rounded-full bg-white">
              {selectedTime} <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            {/* Implement a time picker here */}
            <TimePicker date={selectedDate} setDate={(date: Date) => setSelectedTime(date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }))} />
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="rounded-full bg-white">
              {selectedDate?.toLocaleDateString() || "Select date"}{" "}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              disabled={date => date < new Date()}
              selected={selectedDate}
              onSelect={setSelectedDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Filter className="h-6 w-6" />
        </Button>
      </div>

      {/* Room Grid */}
      <div className="p-6">
        <div className="grid grid-cols-5 gap-4">
          {rooms.map((room) => (
            <Button
              key={room.id}
              variant="outline"
              className={`
                aspect-square text-lg font-normal
                ${
                  room.status === "selected" || selectedRoom === room.id
                    ? "bg-black text-white hover:bg-black"
                    : ""
                }
                ${
                  room.status === "disabled"
                    ? "bg-gray-200 text-gray-400 hover:bg-gray-200"
                    : ""
                }
                ${
                  room.status === "available" && selectedRoom !== room.id
                    ? "bg-gray-100 hover:bg-gray-200"
                    : ""
                }
              `}
              disabled={ room.status === "disabled"}
              onClick={() => handleRoomSelect(room.id)}
            >
              {room.id}
            </Button>
          ))}
        </div>
      </div>

      {/* Selected Room and Action */}
      <div className="px-6 py-4 flex justify-between">
        <Button
          variant="default"
          className="flex-1 rounded-full bg-black text-white h-12"
          disabled={!selectedRoom}
          onClick={() => {
            if (selectedRoom) {
              // Navigate to room details page
              window.location.href = `/room-details?room=${selectedRoom}`;
            }
          }}
        >
          {selectedRoom
            ? `Room ${selectedRoom} - ${selectedTime}, ${selectedDate?.toLocaleDateString()}`
            : "Select a room"}
          <ArrowRight className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}

"use client";

interface TimeSelectorProps {
  date?: Date;
  setDate: (date: Date) => void;
}

export function TimeSelector({ date, setDate }: TimeSelectorProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const calculatePrice = (hours: number): number => {
    const basePricePerHour = 500; // Precio base por hora en yenes
    let totalPrice = 0;
  
    for (let i = 1; i <= hours; i++) {
      totalPrice += basePricePerHour - Math.floor((i - 1) / 3) * 50;
    }
  
    return totalPrice;
  };

  const handleTimeChange = (value: string) => {
    if (date) {
      const newDate = new Date(date);
      newDate.setHours(parseInt(value));
      setDate(newDate);
    }
  };

  return (
    <ScrollArea className="w-64 sm:w-auto">
      <div className="flex sm:flex-col p-2">
        {hours.map((hour) => (
          <Button
            key={hour}
            size="icon"
            variant={date && date.getHours() === hour ? "default" : "ghost"}
            className="sm:w-full shrink-0 aspect-square"
            onClick={() => handleTimeChange(hour.toString())}
          >
            {hour}
          </Button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" className="sm:hidden" />
    </ScrollArea>
  );
}
