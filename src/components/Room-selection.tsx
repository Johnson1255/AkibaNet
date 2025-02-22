import { ArrowLeft, Filter} from "lucide-react"
import { Button } from "@/components/ui/button"

interface Room {
  id: number
  status: "available" | "booked" | "selected" | "disabled"
}

export default function RoomSelection() {
  const rooms: Room[] = Array.from({ length: 35 }, (_, i) => ({
    id: i + 1,
    status: [3, 17, 22, 24, 29, 32].includes(i + 1)
      ? "booked"
      : [19].includes(i + 1)
        ? "disabled"
        : [14].includes(i + 1)
          ? "selected"
          : "available",
  }))

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="p-4 flex items-center justify-between">
        <Button variant="ghost" size="icon" className="rounded-full">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-normal">Select a Room</h1>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Filter className="h-6 w-6" />
        </Button>
      </header>

      {/* Time Selection */}
      <div className="bg-gray-200 p-4 flex gap-3">
        <Button variant="outline" className="rounded-full bg-white">
          10:00 pm
        </Button>
        <Button variant="outline" className="rounded-full bg-white">
          Today
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
                ${room.status === "booked" ? "bg-gray-400 text-gray-500 hover:bg-gray-400" : ""}
                ${room.status === "selected" ? "bg-black text-white hover:bg-black" : ""}
                ${room.status === "disabled" ? "bg-gray-200 text-gray-400 hover:bg-gray-200" : ""}
                ${room.status === "available" ? "bg-gray-100 hover:bg-gray-200" : ""}
              `}
              disabled={room.status === "booked" || room.status === "disabled"}
            >
              {room.id}
            </Button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="px-6 py-4 flex justify-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gray-100 border border-gray-300" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gray-400" />
          <span>Booked</span>
        </div>
      </div>

      {/* Selected Room and Action */}
      <div className="px-6 py-4 flex justify-between gap-4">
        <Button variant="default" className="flex-1 rounded-full bg-black text-white h-12">
          Room 14 - 10:00 pm
        </Button>
        <Button variant="default" className="flex-1 rounded-full bg-black text-white h-12">
          Go to Booking
        </Button>
      </div>
    </div>
  )
}

