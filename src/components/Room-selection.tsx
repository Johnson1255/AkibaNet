import { useState, useEffect, useCallback } from "react";
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
import BottomNavBar from "@/components/common/BottomNavbar";
import { useReservation } from "../context/ReservationContext";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  // Función para obtener la siguiente hora en bloques de 15 minutos
  const getNextQuarterHour = (date: Date) => {
    const minutes = date.getMinutes();
    const nextQuarter = Math.ceil((minutes + 1) / 15) * 15;
    date.setMinutes(nextQuarter);
    
    // Formatear la hora en el formato "hh:mm am/pm"
    let hours = date.getHours();
    const minutes24 = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // las 0 horas deben ser 12 en formato 12h
    
    return `${hours.toString().padStart(2, '0')}:${minutes24.toString().padStart(2, '0')} ${ampm}`;
  };
  
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const [selectedTime, setSelectedTime] = useState<string>(
    getNextQuarterHour(new Date())
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Verificar si hay una reserva activa
  useEffect(() => {
    const checkActiveReservation = () => {
      const savedReservation = localStorage.getItem('lastReservation');
      
      if (savedReservation) {
        const reservation = JSON.parse(savedReservation);
        const now = new Date();
        const endTime = new Date(reservation.endTime);
        
        // Si la reserva aún no ha terminado, redirigir al usuario
        if (now < endTime && reservation.status !== 'cancelled') {
          navigate('/active-reservation');
        }
      }
    };
    
    checkActiveReservation();
  }, [navigate]);

  // Categorías disponibles
  const categories = [
    { id: "all", name: "Todas las salas" },
    { id: "gaming", name: "Gaming Rooms" },
    { id: "thinking", name: "Thinking Rooms" },
    { id: "working", name: "Working Rooms" },
  ];

  // Función para obtener las habitaciones del API
  const fetchRooms = useCallback(async () => {
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
  }, [selectedCategory]);

  // Cargar habitaciones al montar el componente y cuando cambie la categoría
  useEffect(() => {
    fetchRooms();
  }, [selectedCategory, fetchRooms]);

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
    <div className="min-h-screen bg-background text-foreground pb-16">
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
        <h1 className="text-2xl font-normal">{t("room.name")}</h1>
        <div className="w-6" /> {/* Spacer for alignment */}
      </header>

      {/* Time, Date and Category Selection */}
      <div className="bg-secondary p-4 flex gap-3">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[35%] h-[40px] rounded-full bg-background">
            {selectedTime}
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <TimePicker
            date={selectedDate}
            setDate={(date: Date) => {
              let hours = date.getHours();
              const minutes = date.getMinutes();
              const ampm = hours >= 12 ? 'pm' : 'am';
              hours = hours % 12;
              hours = hours ? hours : 12;
              
              const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
              handleTimeChange(timeString);
            }}
          />
        </PopoverContent>
      </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[35%] h-[40px] rounded-full bg-background">
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
          <div className="text-center text-destructive">{error}</div>
        ) : (
          <div className="grid grid-cols-5 gap-4">
            {rooms.map((room) => (
              <Button
                key={room.id}
                variant="outline"
                className={`
                  aspect-square text-lg font-normal flex flex-col gap-1
                  ${selectedRoom === room.id ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}
                  ${room.status !== "available" ? "bg-muted text-muted-foreground hover:bg-muted" : ""}
                  ${room.status === "available" && selectedRoom !== room.id ? "bg-secondary hover:bg-secondary/80" : ""}
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
          className="flex-1 rounded-full bg-primary text-primary-foreground h-12"
          disabled={!selectedRoom}
          onClick={() => {
            if (selectedRoom) {
              goToRoomDetails(selectedRoom);
            }
          }}
        >
          {selectedRoom
            ? `Room ${selectedRoom} - ${selectedTime}, ${selectedDate?.toLocaleDateString()}`
            : t("room.name")}
          <ArrowRight className="w-6 h-6" />
        </Button>
      </div>
      <BottomNavBar />
    </div>
  );
}