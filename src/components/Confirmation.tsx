import { useEffect, useState } from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import BottomNavBar from "./Bottom-navbar";
import { useReservation, Service } from "../context/ReservationContext";

interface ReservationDetails {
  roomId?: number;
  hours?: number;
  price?: number;
  totalPrice?: number;
  selectedDate?: string;
  selectedTime?: string;
  selectedServices: string[];
}

export default function Confirmation() {
  const { reservation } = useReservation();
  const [savedReservation, setSavedReservation] = useState<ReservationDetails | null>(null);
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    // Cargar los datos de la reserva guardada en localStorage
    const savedData = localStorage.getItem('lastReservation');
    if (savedData) {
      setSavedReservation(JSON.parse(savedData));
    }

    // Definir los servicios disponibles (igual que en Additional-services)
    setServices([
      { id: "headset", name: "Premium gaming headsets", price: 150 },
      {
        id: "streaming",
        name: "Streaming Setup",
        description: "webcam and microphone for streamers.",
        price: 500,
      },
      {
        id: "refrigerator",
        name: "Small refrigerator",
        description: "For cold drinks and snacks",
        price: 500,
      },
      {
        id: "chair",
        name: "Ergonomic gaming chair",
        description: "Adjustable and comfortable for long sessions.",
        price: 500,
      },
      { id: "ps5", name: "Playstation 5", price: 100 },
      { id: "dreamcast", name: "Sega Dreamcast", price: 250 },
      { id: "n64", name: "Nintengod 64", price: 350 },
    ]);
  }, []);

  // Usar los datos del contexto si no hay datos guardados en localStorage
  const reservationData = savedReservation || {
    roomId: reservation.roomId,
    hours: reservation.hours,
    totalPrice: reservation.totalPrice,
    selectedDate: reservation.selectedDate,
    selectedTime: reservation.selectedTime,
    selectedServices: Array.from(reservation.selectedServices),
  };

  const hourlyRate = 800;

  return (
    <>
      <div className="min-h-screen bg-gray-50 pb-16">
        {/* Header */}
        <header className="p-4 flex items-center justify-between bg-white">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => window.location.href = "/home"}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-normal">Confirmation</h1>
          <div className="w-10" /> {/* Spacer for alignment */}
        </header>

        {/* Confirmation Message */}
        <div className="p-8 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
            <Check className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2">¡Reservation Confirmed!</h2>
          <p className="text-gray-600">
            Your reservation has been successfully completed. Here are the details:
          </p>
        </div>

        {/* Reservation Details */}
        <Card className="m-4 p-4">
          <h3 className="text-xl font-semibold mb-4">Reservation Details</h3>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Room:</span>
              <span className="font-medium">#{reservationData.roomId}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span className="font-medium">{reservationData.selectedDate}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Time:</span>
              <span className="font-medium">{reservationData.selectedTime}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Duration:</span>
              <span className="font-medium">{reservationData.hours} hour(s)</span>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          {/* Services */}
          <h4 className="font-medium mb-2">Additional Services:</h4>
          <div className="space-y-2">
            {reservationData.selectedServices.map((serviceId) => {
              const service = services.find(s => s.id === serviceId);
              if (!service) return null;
              
              return (
                <div key={serviceId} className="flex justify-between">
                  <span>{service.name}</span>
                  <span>¥{service.price}</span>
                </div>
              );
            })}
            
            <div className="flex justify-between">
              <span>Room ({reservationData.hours} hour(s))</span>
              <span>¥{(reservationData.hours || 0) * hourlyRate}</span>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          {/* Total */}
          <div className="flex justify-between font-bold text-lg">
            <span>TOTAL</span>
            <span>¥{reservationData.totalPrice}</span>
          </div>
        </Card>
        
        {/* Actions */}
        <div className="p-4 space-y-4">
          <Button 
            className="w-full rounded-full h-12 bg-black text-white hover:bg-black/90"
            onClick={() => window.location.href = "/home"}
          >
            Back to Home
          </Button>
          
          <Button 
            variant="outline"
            className="w-full rounded-full h-12"
            onClick={() => window.location.href = "/account"}
          >
            View My Reservations
          </Button>
        </div>
      </div>
      <BottomNavBar />
    </>
  );
}