import { useState, useEffect } from "react";
import { ArrowLeft, Plus, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import BottomNavBar from "./Bottom-navbar";
import ImageCarousel from "./ImageCarousel";
import { useReservation } from "../context/ReservationContext";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Definir interfaces para los datos recibidos de la API
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

export default function RoomDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const { t } = useTranslation(); // Hook para traducciones
  
  // Obtener el roomId de los parámetros de URL
  let roomId: string | null = null;
  
  // Intentar obtener el roomId de los parámetros de ruta primero
  if (params.roomId) {
    roomId = params.roomId;
  } else {
    // Si no está en los parámetros de ruta, buscar en query params
    const searchParams = new URLSearchParams(location.search);
    const roomIdParam = searchParams.get('room');
    if (roomIdParam) {
      roomId = roomIdParam;
    }
  }
  
  // Usar el contexto de reserva
  const { reservation, updateRoomDetails } = useReservation();
  
  // Estado para la habitación seleccionada
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estado para el slider con valores por defecto
  const [sliderValue, setSliderValue] = useState<number[]>([1]); // Valor inicial por defecto

  // Cargar los detalles de la habitación desde la API
  useEffect(() => {
    const fetchRoomDetails = async () => {
      if (!roomId) return;
      
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3000/api/rooms/${roomId}`);
        
        if (!response.ok) {
          throw new Error(t('reservation.errors.roomLoadError', 'Error al cargar los detalles de la habitación: {{statusText}}', { statusText: response.statusText }));
        }
        
        const roomData = await response.json();
        setRoom(roomData);
        
        // Inicializar el slider con los valores minHours de la habitación
        if (roomData.minHours) {
          setSliderValue([roomData.minHours]); // Usar valores enteros
          
          // Actualizar el contexto con los valores iniciales
          const initialHours = roomData.minHours;
          const initialPrice = calculatePrice(initialHours, roomData.hourlyRate);
          updateRoomDetails({ 
            roomId: Number(roomId), 
            hours: initialHours,
            price: initialPrice,
            hourlyRate: roomData.hourlyRate
          });
        }
      } catch (err) {
        console.error("Error fetching room details:", err);
        setError(err instanceof Error ? err.message : t('reservation.errors.unknownError', 'Error desconocido'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchRoomDetails();
  }, [roomId, t]);

  // Función para calcular el precio
  const calculatePrice = (hours: number, hourlyRate: number) => {
    return hours * hourlyRate;
  };

  // Manejar cambios en el slider
  const handleSliderChange = (value: number[]) => {
    setSliderValue(value);
    if (room) {
      const hours = value[0]; // Usar valores enteros
      const price = calculatePrice(hours, room.hourlyRate);
      updateRoomDetails({ hours, price });
    }
  };

  // Calcular horas y precio actuales basados en el valor del slider
  const hours = room ? sliderValue[0] : 0;
  const price = room ? calculatePrice(hours, room.hourlyRate) : 0;

  // Función auxiliar para parsear "DD/MM/YYYY" y "hh:mm am/pm"
  function parseDateTime(dateStr: string, timeStr: string) {
    // Formato esperado: "DD/MM/YYYY"
    const dateParts = dateStr.split("/");
    if (dateParts.length !== 3) {
      throw new Error(`Formato de fecha inválido: ${dateStr}. Se esperaba DD/MM/YYYY`);
    }
    
    const day = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1; // Los meses en JS son 0-11
    const year = parseInt(dateParts[2]);
    
    // Validar día y mes
    if (day < 1 || day > 31 || month < 0 || month > 11) {
      throw new Error('Fecha inválida: día o mes fuera de rango');
    }

    // Limpiamos el formato de hora para manejar "p. m." y "a. m."
    const cleanedTimeStr = timeStr
      .replace("p. m.", "pm")
      .replace("a. m.", "am")
      .replace(/\s+/g, "");

    // Ahora buscamos el formato limpio hh:mmam/pm
    const timeMatch = cleanedTimeStr.match(/(\d+):(\d+)(am|pm)/i);
    if (!timeMatch) {
      throw new Error(`Formato de hora inválido: ${timeStr}. Se esperaba hh:mm am/pm`);
    }
    
    let hour = parseInt(timeMatch[1]);
    const minute = parseInt(timeMatch[2]);
    const amPm = timeMatch[3].toLowerCase();
    
    if (amPm === "pm" && hour !== 12) {
      hour += 12;
    } else if (amPm === "am" && hour === 12) {
      hour = 0;
    }
    
    const dateObj = new Date(year, month, day, hour, minute);
    console.log(`Fecha parseada: ${dateObj.toLocaleString('es-ES')}`);
    return dateObj;
  }

  // Manejar el botón "Confirm and Pay"
  const handleConfirmAndPay = async () => {
    if (!room) return;
  
    try {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");
  
      if (!storedUser) {
        throw new Error("No hay usuario guardado en localStorage.");
      }
  
      if (!token) {
        throw new Error("No se encontró un token de autenticación. Inicia sesión nuevamente.");
      }
  
      const parsedUser = JSON.parse(storedUser);
      const userId = parsedUser.id;
  
      if (!reservation.selectedDate || !reservation.selectedTime) {
        throw new Error("Falta seleccionar fecha y hora para la reserva.");
      }
  
      console.log("Fecha seleccionada:", reservation.selectedDate);
      console.log("Hora seleccionada:", reservation.selectedTime);
      
      const startDateTime = parseDateTime(reservation.selectedDate, reservation.selectedTime);
      const endDateTime = new Date(startDateTime.getTime() + hours * 60 * 60 * 1000);
  
      console.log("Fecha inicio:", startDateTime.toISOString());
      console.log("Fecha fin:", endDateTime.toISOString());
      
      const basePrice = room.hourlyRate * hours;
  
      const reservationPayload = {
        userId, 
        roomId: Number(room.id),
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        duration: hours,
        basePrice,
        status: 'pending',
        services: Array.from(reservation.selectedServices || []),
        products: []
      };
  
      const response = await fetch("http://localhost:3000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(reservationPayload),
      });
  
      const responseData = await response.json();
  
      if (!response.ok) {
        throw new Error(`Error al crear la reserva: ${responseData.error || "Error desconocido"}`);
      }
  
      // Guardar la reserva en localStorage con formato consistente
      localStorage.setItem("lastReservation", JSON.stringify({
        ...responseData,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        status: 'pending'
      }));
      
      navigate("/confirmation");
    } catch (error) {
      console.error("Error al confirmar reserva:", error);
    }
  };

  // Si está cargando, mostrar indicador
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <h2 className="text-xl mb-4">{t('reservation.loading', 'Cargando detalles de la habitación...')}</h2>
      </div>
    );
  }

  // Si hay un error, mostrarlo
  if (error) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <h2 className="text-xl text-red-500 mb-4">{t('reservation.errors.error', 'Error:')} {error}</h2>
        <Button
          variant="default"
          className="rounded-full bg-black text-white"
          onClick={() => navigate("/reserve")}
        >
          {t('reservation.backToRooms', 'Volver a la selección de habitaciones')}
        </Button>
      </div>
    );
  }

  // Si no hay roomId o no se encontró la habitación, mostrar un mensaje
  if (!roomId || !room) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <h1 className="text-2xl mb-4">{t('reservation.roomNotFound', 'No se encontró la habitación')}</h1>
        <p className="mb-4">{t('reservation.selectPrompt', 'Por favor, seleccione una habitación desde la página de selección.')}</p>
        <Button
          variant="default"
          className="rounded-full bg-black text-white"
          onClick={() => navigate("/reserve")}
        >
          {t('reservation.goToRoomSelection', 'Ir a selección de habitaciones')}
        </Button>
      </div>
    );
  }

  // Determinar el tipo de habitación a mostrar
  const roomCategory = room.category || 
    (room.id.startsWith("1") ? t('reservation.roomTypes.gaming', 'Gaming') : 
    (room.id.startsWith("2") ? t('reservation.roomTypes.thinking', 'Thinking') : t('reservation.roomTypes.working', 'Working')));

  // Función para pluralizar "hora" basada en el número
  const getHourText = (num: number) => {
    return num === 1 ? t('reservation.hour', 'hora') : t('reservation.hours', 'horas');
  };

  return (
    <div className="min-h-screen bg-white pb-16">
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
        <h1 className="text-2xl font-normal">{roomCategory} {t('reservation.room', 'Room')} #{room.id}</h1>
        <div className="w-6" /> {/* Spacer for alignment */}
      </header>

      {/* Room Preview - Ahora usando ImageCarousel */}
      <div className="px-4 mb-4">
        <ImageCarousel 
          images={room.images} 
          alt={`${roomCategory} ${t('reservation.room', 'Room')} ${room.id}`} 
        />
      </div>

      {/* Details */}
      <div className="px-4 mb-6">
        <Card className="p-6 rounded-2xl">
          <h2 className="text-xl font-bold mb-4">{t('reservation.details', 'Details')}</h2>
          <ul className="space-y-4">
            <li>{t('reservation.capacity', 'Capacidad')}: {room.capacity} {t('reservation.people', 'personas')}</li>
            <li>{t('reservation.hourlyRate', 'Tarifa por hora')}: ¥{room.hourlyRate.toFixed(2)}</li>
            <li>
              {t('reservation.equipment', 'Equipamiento')}:
              <ul className="ml-6 space-y-2 mt-2">
                {room.equipment.map((item, index) => (
                  <li key={index}>
                    {item.name}: {item.quantity} {item.quantity > 1 ? 
                      t('reservation.units', 'unidades') : 
                      t('reservation.unit', 'unidad')}
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </Card>
      </div>

      {/* Booking Section */}
      <div className="px-4 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <Button
              variant="outline"
              className="w-full rounded-full bg-gray-100 border-0"
              onClick={() => {
                // Aquí podrías abrir un selector de hora
                updateRoomDetails({ selectedTime: reservation.selectedTime });
              }}
            >
              <span>{reservation.selectedTime || t('reservation.selectTime', 'Select time')}</span>
            </Button>
          </div>

          <Clock className="w-8 h-8" />

          <div className="flex-1">
            <Button
              variant="outline"
              className="w-full rounded-full bg-gray-100 border-0"
              onClick={() => {
                // Aquí podrías abrir un selector de fecha
                updateRoomDetails({ selectedDate: reservation.selectedDate });
              }}
            >
              <span>{reservation.selectedDate || t('reservation.today', 'Today')}</span>
            </Button>
          </div>
        </div>

        <div>
          <div className="text-right mb-2">¥{price.toFixed(2)}</div>
          <Slider
            defaultValue={sliderValue}
            value={sliderValue}
            min={room.minHours} // Usar valores enteros
            max={room.maxHours}
            step={1} // Paso de 1 hora
            className="mb-2"
            onValueChange={handleSliderChange}
          />
          <div className="text-sm text-gray-500 flex justify-between">
            <span>{room.minHours} {getHourText(room.minHours)} {t('reservation.minimum', 'mínimo')}</span>
            <span>{room.maxHours} {getHourText(room.maxHours)} {t('reservation.maximum', 'máximo')}</span>
          </div>
          <div className="text-sm text-gray-500 text-center mt-2">
            ¥{price.toFixed(2)} {t('reservation.for', 'por')} {hours} {getHourText(hours)}.
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          <Button
            variant="outline"
            className="w-full rounded-full h-12 bg-gray-100 border-0"
            onClick={() => {
              // Guardar los datos antes de navegar
              updateRoomDetails({ hours, price });
              navigate("/additional-services");
            }}
          >
            {t('reservation.addServices', 'Add services')}
            <Plus className="ml-2 h-5 w-5" />
          </Button>

          <Button
            variant="default"
            className="w-full rounded-full h-12 bg-black text-white hover:bg-black/90"
            onClick={handleConfirmAndPay}
          >
            {t('reservation.confirmAndPay', 'Confirm and Pay')}
          </Button>
        </div>
      </div>
      <BottomNavBar />
    </div>
  );
}