import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Reservation {
  id: string;
  startTime: string;
  endTime: string;
  roomId: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
}

interface ReservationStatusCardProps {
  reservation: Reservation;
}

const ReservationStatusCard: React.FC<ReservationStatusCardProps> = ({ reservation }) => {
  const navigate = useNavigate();
  
  // Función para formatear la fecha y hora
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  // Obtener el estado según el status
  const getStatusText = () => {
    switch (reservation.status) {
      case 'pending':
        return 'Reserva pendiente';
      case 'active':
        return 'Reserva activa';
      case 'completed':
        return 'Reserva completada';
      case 'cancelled':
        return 'Reserva cancelada';
      default:
        return 'Estado desconocido';
    }
  };
  
  // Obtener el color de fondo según el estado
  const getStatusColor = () => {
    switch (reservation.status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="p-4 mb-4">
      <div className={`${getStatusColor()} inline-block px-3 py-1 rounded-full text-sm font-medium mb-3`}>
        {getStatusText()}
      </div>
      
      <h2 className="text-xl font-semibold mb-3">Room #{reservation.roomId}</h2>
      
      <div className="flex items-center mb-4">
        <Clock className="h-5 w-5 text-gray-500 mr-2" />
        <div>
          <div className="text-sm text-gray-600">
            Start: {formatDateTime(reservation.startTime)}
          </div>
          <div className="text-sm text-gray-600">
            End: {formatDateTime(reservation.endTime)}
          </div>
        </div>
      </div>
      
      <Button
        variant="default"
        className="w-full bg-black text-white hover:bg-black/90"
        onClick={() => navigate('/active-reservation')}
      >
        Ver detalles
      </Button>
    </Card>
  );
};

export default ReservationStatusCard;
