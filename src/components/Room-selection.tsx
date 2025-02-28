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
import BottomNavBar from "./Bottom-navbar";
import { useReservation } from "../context/ReservationContext";

interface Room {
  id: number;
  status: "available" | "selected" | "disabled";
}

export default function RoomSelection() {
  // Usar el contexto de reserva
  const { updateRoomDetails } = useReservation();
  
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [selectedTime, setSelectedTime] = useState<string>("10:00 pm");
  
  const rooms: Room[] = Array.from({ length: 35 }, (_, i) => ({
    id: i + 1,
    status: [3, 17, 22, 24, 29, 32].includes(i + 1) ? "disabled" : "available",
  }));

  const handleRoomSelect = (roomId: number) => {
    setSelectedRoom(roomId === selectedRoom ? null : roomId);
  };

  // Actualizar el contexto cuando cambia la fecha o la hora
  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      updateRoomDetails({ 
        selectedDate: date.toLocaleDateString() 
      });
    }
  };

  const handleTimeChange = (time: string) => {
    setSelectedTime(time);
    updateRoomDetails({ selectedTime: time });
  };

  return (
    <div className="bg-gray-100 pb-16">
      {/* Header */}
      <header className="p-4 flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={() => window.history.back()}
        >
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
            <TimePicker
              date={selectedDate}
              setDate={(date: Date) => {
                const timeString = date.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                });
                handleTimeChange(timeString);
              }}
            />
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
              disabled={(date) => date < new Date()}
              selected={selectedDate}
              onSelect={handleDateChange}
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
              disabled={room.status === "disabled"}
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
              // Actualizar el contexto con la información seleccionada
              updateRoomDetails({
                roomId: selectedRoom,
                selectedDate: selectedDate?.toLocaleDateString(),
                selectedTime: selectedTime
              });
              
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
      <BottomNavBar />
    </div>
  );
}