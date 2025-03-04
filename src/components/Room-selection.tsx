import { useState, useEffect } from "react";
import { ArrowLeft, Filter, ChevronDown, ArrowRight } from "lucide-react";
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
import { useNavigate } from "react-router-dom";
import TimePicker from "./time-picker";
import BottomNavBar from "./Bottom-navbar";
import { useReservation } from "../context/ReservationContext";

// Nuevos tipos para las habitaciones
interface Equipment {
  type: string;
  name: string;
  quantity: number;
}

interface Room {
  id: string;
  capacity: number;
  hourlyRate: number;
  status: string;
  minHours: number;
  maxHours: number;
  equipment: Equipment[];
  images: string[];
  category?: string;
}

export default function RoomSelection() {
  const { updateRoomDetails } = useReservation();
  const navigate = useNavigate();
  // Función para obtener la siguiente hora en bloques de 15 minutos
  const getNextQuarterHour = (date: Date) => {
    const minutes = date.getMinutes();
    const nextQuarter = Math.ceil((minutes + 1) / 15) * 15;
    date.setMinutes(nextQuarter);
    return date;
  };
  
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const [selectedTime, setSelectedTime] = useState<string>(
    getNextQuarterHour(new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Categorías disponibles
  const categories = [
    { id: "all", name: "Todas las salas" },
    { id: "gaming", name: "Gaming Rooms" },
    { id: "thinking", name: "Thinking Rooms" },
    { id: "working", name: "Working Rooms" },
  ];

  // Función para obtener las habitaciones del API
  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/rooms' + 
        (selectedCategory !== 'all' ? `?category=${selectedCategory}` : ''));
      
      if (!response.ok) {
        throw new Error('Error al cargar las habitaciones');
      }

      const data = await response.json();
      
      // La respuesta del API debería ser un array de rooms directamente
      if (Array.isArray(data)) {
        setRooms(data);
      } else {
        // Si no es un array, probablemente es un objeto con una estructura diferente
        console.error("Formato de respuesta inesperado:", data);
        setError("Formato de respuesta inesperado del servidor");
        setRooms([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error("Error fetching rooms:", err);
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  // Cargar habitaciones al montar el componente y cuando cambie la categoría
  useEffect(() => {
    fetchRooms();
  }, [selectedCategory]);

  const handleRoomSelect = (roomId: string) => {
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

  // Función para navegar a la página de detalles de la sala
  const goToRoomDetails = (roomId: string) => {
    if (roomId) {
      const selectedRoom = rooms.find(r => r.id === roomId);
      updateRoomDetails({
        roomId: Number(roomId),
        selectedDate: selectedDate?.toLocaleDateString(),
        selectedTime: selectedTime,
        hourlyRate: selectedRoom?.hourlyRate
      });
      
      console.log("Navigating to room details with roomId:", roomId);
      
      navigate(`/room-details/${roomId}`);
    }
  };

  return (
    <div className="bg-gray-100 pb-16">
      {/* Header */}
      <header className="p-4 flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-normal">Select a Room</h1>
        <div className="w-6" /> {/* Spacer for alignment */}
      </header>

      {/* Time, Date and Category Selection */}
      <div className="bg-gray-200 p-4 flex gap-3">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="rounded-full bg-white">
              {selectedTime} <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
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
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Filter className="h-6 w-6" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="rounded-full bg-white">
          <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
          {categories.map(category => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
              </SelectContent>
            </Select>
          </PopoverContent>
        </Popover>
      </div>

      {/* Room Grid */}
      <div className="p-6">
        {loading ? (
          <div className="text-center">Cargando habitaciones...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-5 gap-4">
            {rooms.map((room) => (
              <Button
                key={room.id}
                variant="outline"
                className={`
                  aspect-square text-lg font-normal flex flex-col gap-1
                  ${selectedRoom === room.id ? "bg-black text-white hover:bg-black" : ""}
                  ${room.status !== "available" ? "bg-gray-200 text-gray-400 hover:bg-gray-200" : ""}
                  ${room.status === "available" && selectedRoom !== room.id ? "bg-gray-100 hover:bg-gray-200" : ""}
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

      {/* Selected Room and Action */}
      <div className="px-6 py-4 flex justify-between">
        <Button
          variant="default"
          className="flex-1 rounded-full bg-black text-white h-12"
          disabled={!selectedRoom}
          onClick={() => {
            if (selectedRoom) {
              goToRoomDetails(selectedRoom);
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