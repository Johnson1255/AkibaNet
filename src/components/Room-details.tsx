import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Image, Clock, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import BottomNavBar from "./Bottom-navbar";
import { useReservation } from "../context/ReservationContext";
import { useNavigate, useLocation, useParams } from "react-router-dom";

export default function RoomDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  
  // Obtener el roomId de los parámetros de URL
  let roomId: number | null = null;
  
  // Intentar obtener el roomId de los parámetros de ruta primero
  if (params.roomId) {
    roomId = parseInt(params.roomId);
  } else {
    // Si no está en los parámetros de ruta, buscar en query params
    const searchParams = new URLSearchParams(location.search);
    const roomIdParam = searchParams.get('room');
    if (roomIdParam) {
      roomId = parseInt(roomIdParam);
    }
  }
  
  // Usar el contexto de reserva
  const { reservation, updateRoomDetails } = useReservation();
  
  // Usar un estado local para el slider
  const [sliderValue, setSliderValue] = useState([2]); // 2 representa 1 hora

  // Al cargar el componente, actualizar el contexto con el roomId
  useEffect(() => {
    if (roomId) {
      console.log("Room ID from URL:", roomId); // Debugging
      updateRoomDetails({ roomId });
    } else {
      console.log("No Room ID found in URL"); // Debugging
    }
  }, [roomId]);

  // Debugging para ver si los cambios son aplicados
  useEffect(() => {
    console.log("Current reservation state:", reservation);
  }, [reservation]);

  const handleSliderChange = (value: number[]) => {
    setSliderValue(value);
    const hours = value[0] * 0.5;
    const price = calculatePrice(hours);
    updateRoomDetails({ hours, price });
  };

  const calculatePrice = (hours: number) => {
    const basePricePerHour = 800;
    const discountPerThreeHours = 50;
    const discount = Math.floor(hours / 3) * discountPerThreeHours;
    return hours * (basePricePerHour - discount);
  };

  const hours = sliderValue[0] * 0.5;
  const price = calculatePrice(hours);

  // Manejar el botón "Confirm and Pay"
  const handleConfirmAndPay = () => {
    // Actualizar el precio final en el contexto
    updateRoomDetails({ 
      hours, 
      price,
      totalPrice: price 
    });
    
    // Navegar a la página de confirmación usando React Router
    navigate("/confirmation");
  };

  // Si no hay roomId, mostrar un mensaje o redireccionar
  if (!roomId) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <h1 className="text-2xl mb-4">No Room Selected</h1>
        <p className="mb-4">Please select a room from the room selection page.</p>
        <Button
          variant="default"
          className="rounded-full bg-black text-white"
          onClick={() => navigate("/reserve")}
        >
          Go to Room Selection
        </Button>
      </div>
    );
  }

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
        <h1 className="text-2xl font-normal">Gaming Room #{roomId}</h1>
        <div className="w-6" /> {/* Spacer for alignment */}
      </header>

      {/* Room Preview */}
      <div className="px-4 mb-4 relative">
        <Card className="bg-gray-100 p-8 flex items-center justify-between rounded-2xl min-h-40">
          <Image className="w-12 h-12 mx-auto" />
          <Button
            variant="outline"
            className="rounded-full bg-gray-100 border-0 absolute right-8 top-1/2 transform -translate-y-1/2"
          >
            <ArrowRight className="w-6 h-6" />
          </Button>
        </Card>
      </div>

      {/* Details */}
      <div className="px-4 mb-6">
        <Card className="p-6 rounded-2xl">
          <h2 className="text-xl font-bold mb-4">Details</h2>
          <ul className="space-y-4">
            <li>Size: 4m² (private and comfortable space).</li>
            <li>
              Included:
              <ul className="ml-6 space-y-2 mt-2">
                <li>
                  High-speed Wi-Fi: Ultra-fast connection for gaming and
                  streaming.
                </li>
                <li>
                  Gaming PC: High-performance setup (technical specs available).
                </li>
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
              <span>{reservation.selectedTime}</span>
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
              <span>{reservation.selectedDate || "Today"}</span>
            </Button>
          </div>
        </div>

        <div>
          <div className="text-right mb-2">¥{price}</div>
          <Slider
            defaultValue={sliderValue}
            min={2} // 1 hora
            max={24} // 12 horas
            step={1} // 30 minutos
            className="mb-2"
            onValueChange={handleSliderChange}
          />
          <div className="text-sm text-gray-500">
            ¥{price} for {hours} hour(s). Max. 12 hours
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
            Add services
            <Plus className="ml-2 h-5 w-5" />
          </Button>

          <Button
            variant="default"
            className="w-full rounded-full h-12 bg-black text-white hover:bg-black/90"
            onClick={handleConfirmAndPay}
          >
            Confirm and Pay
          </Button>
        </div>
      </div>
      <BottomNavBar />
    </div>
  );
}