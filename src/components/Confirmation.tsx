import { useEffect, useState } from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import BottomNavBar from "./Bottom-navbar";

// Tipo de datos para la reserva recibida del API
interface ReservationDetails {
  id?: string;
  roomId?: string;
  hours?: number;
  basePrice?: number;
  totalPrice?: number;
  startTime?: string;
  endTime?: string;
  status?: string;
  selectedDate?: string; 
  selectedTime?: string;
  services?: Array<{serviceId: string, quantity: number, price: number}>;
}

export default function Confirmation() {
  const [savedReservation, setSavedReservation] = useState<ReservationDetails | null>(null);

  useEffect(() => {
    // Cargar los datos de la reserva guardada en localStorage
    const savedData = localStorage.getItem('lastReservation');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      
      // Convertir la fecha y hora ISO a formatos legibles
      if (parsedData.startTime) {
        const startDate = new Date(parsedData.startTime);
        parsedData.selectedDate = startDate.toLocaleDateString();
        parsedData.selectedTime = startDate.toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        });
      }
      
      setSavedReservation(parsedData);
      
      // Guardar la reserva como activa
      if (parsedData.startTime && parsedData.endTime) {
        const activeReservation = {
          id: parsedData.id || `res-${Date.now()}`,
          startTime: parsedData.startTime,
          endTime: parsedData.endTime,
          roomId: parsedData.roomId || '',
          userId: 'current-user', // Esto debería venir de tu sistema de autenticación
          status: 'pending'
        };
        
        // Almacenar la reserva activa en localStorage
        localStorage.setItem('lastReservation', JSON.stringify(activeReservation));
      }
    }
  }, []);

  // Si no hay reservación guardada, mostrar mensaje de error o redireccionar
  if (!savedReservation) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center">
        <h2 className="text-xl mb-4">No se encontró información de la reserva</h2>
        <Button 
          variant="default"
          className="rounded-full bg-primary text-primary-foreground"
          onClick={() => window.location.href = "/reserve"}
        >
          Realizar una nueva reserva
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-background text-foreground pb-16">
        {/* Header */}
        <header className="p-4 flex items-center justify-between bg-background border-b border-border">
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
          <p className="text-muted-foreground">
            Your reservation has been successfully completed. Here are the details:
          </p>
        </div>

        {/* Reservation Details */}
        <Card className="m-4 p-4 bg-card text-card-foreground">
          <h3 className="text-xl font-semibold mb-4">Reservation Details</h3>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Room:</span>
              <span className="font-medium">#{savedReservation.roomId}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date:</span>
              <span className="font-medium">{savedReservation.selectedDate}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Time:</span>
              <span className="font-medium">{savedReservation.selectedTime}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Duration:</span>
              <span className="font-medium">{savedReservation.hours} hour(s)</span>
            </div>

            {savedReservation?.id && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Booking ID:</span>
                <span className="font-medium">{savedReservation.id}</span>
              </div>
            )}
          </div>
          
          <Separator className="my-4" />
          
          {/* Services */}
          <h4 className="font-medium mb-2">Services:</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Room ({savedReservation.hours} hour(s))</span>
              <span>¥{savedReservation.basePrice}</span>
            </div>
            
            {/* Si hay servicios adicionales, mostrarlos aquí */}
            {savedReservation.services && savedReservation.services.length > 0 && 
              savedReservation.services.map((service, index) => (
                <div key={index} className="flex justify-between">
                  <span>{service.quantity}x Service #{service.serviceId}</span>
                  <span>¥{service.price}</span>
                </div>
              )
            )}
          </div>
          
          <Separator className="my-4" />
          
          {/* Total */}
          <div className="flex justify-between font-bold text-lg">
            <span>TOTAL</span>
            <span>¥{savedReservation.totalPrice || savedReservation.basePrice}</span>
          </div>
        </Card>
        
        {/* Actions */}
        <div className="p-4 space-y-4">
          <Button 
            className="w-full rounded-full h-12 bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => window.location.href = "/home"}
          >
            Back to Home
          </Button>
          
          <Button 
            variant="outline"
            className="w-full rounded-full h-12 border border-border"
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