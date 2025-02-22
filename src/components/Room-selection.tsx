import { useState } from "react";
import { ArrowLeft, Filter, ChevronDown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

interface Room {
  id: number;
  status: "available" | "booked" | "selected" | "disabled";
}

export default function RoomSelection() {
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [selectedTime, setSelectedTime] = useState<string>("10:00 pm");
  const rooms: Room[] = Array.from({ length: 35 }, (_, i) => ({
    id: i + 1,
    status: [3, 17, 22, 24, 29, 32].includes(i + 1)
      ? "booked"
      : [19].includes(i + 1)
      ? "disabled"
      : [14].includes(i + 1)
      ? "selected"
      : "available",
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
            <div className="p-4">
              <Button onClick={() => setSelectedTime("10:00 pm")}>
                10:00 pm
              </Button>
              <Button onClick={() => setSelectedTime("11:00 pm")}>
                11:00 pm
              </Button>
              {/* Add more time options as needed */}
            </div>
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
              room.status === "booked"
                ? "bg-gray-400 text-gray-500 hover:bg-gray-400"
                : ""
            }
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
              disabled={room.status === "booked" || room.status === "disabled"}
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
