import { Button } from "@/components/ui/button";
import { Room } from "@/types/room";

interface RoomGridProps {
  rooms: Room[];
  selectedRoom: string | null;
  selectedCategory: string;
  handleRoomSelect: (roomId: string) => void;
  loading: boolean;
  error: string | null;
}

export default function RoomGrid({ rooms, selectedRoom, selectedCategory, handleRoomSelect, loading, error }: RoomGridProps) {
  const filteredRooms = selectedCategory === "all" 
    ? rooms 
    : rooms.filter(room => room.category === selectedCategory);

  return (
    <div className="p-6">
      {loading ? (
        <div className="text-center">Cargando habitaciones...</div>
      ) : error ? (
        <div className="text-center text-destructive">{error}</div>
      ) : (
        <div className="grid grid-cols-5 gap-4">
          {filteredRooms.map((room) => (
            <Button
              key={room.id}
              variant="outline"
              className={`
                aspect-square text-lg font-normal flex flex-col gap-1
                ${
                  selectedRoom === room.id
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : ""
                }
                ${
                  room.status !== "available"
                    ? "bg-muted text-muted-foreground hover:bg-muted"
                    : ""
                }
                ${
                  room.status === "available" && selectedRoom !== room.id
                    ? "bg-secondary hover:bg-secondary/80"
                    : ""
                }
              `}
              disabled={room.status !== "available"}
              onClick={() => handleRoomSelect(room.id)}
            >
              <span>{room.id}</span>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};