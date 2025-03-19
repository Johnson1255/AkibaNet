import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ReservationCountdown from './ReservationCountdown';
import BottomNavBar from './Bottom-navbar';
import { Clock, Info } from 'lucide-react';

interface Reservation {
  id: string;
  startTime: string;
  endTime: string;
  roomId: string;
  userId: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  services: { serviceId: string; name: string; price: number }[];
  products: { productId: string; name: string; price: number; quantity: number }[];
}

function ActiveReservationPage() {
  const navigate = useNavigate();
  const [activeReservation, setActiveReservation] = useState<Reservation | null>(null);

  useEffect(() => {
    const savedReservation = localStorage.getItem('lastReservation');
    if (savedReservation) {
      setActiveReservation(JSON.parse(savedReservation));
    } else {
      navigate('/reserve');
    }
  }, [navigate]);

  const handleReservationAction = () => {
    if (activeReservation) {
      const now = new Date();
      const startTime = new Date(activeReservation.startTime);
      let updatedReservation;

      if (now < startTime) {
        updatedReservation = { ...activeReservation, status: 'cancelled' };
      } else {
        updatedReservation = { ...activeReservation, status: 'completed' };
      }

      localStorage.setItem('lastReservation', JSON.stringify(updatedReservation));
      localStorage.removeItem('lastReservation');
      navigate('/reserve');
    }
  };

  const getActionButtonText = () => {
    const now = new Date();
    const startTime = new Date(activeReservation!.startTime);
    return now < startTime ? 'Cancelar Reserva' : 'Terminar Reserva';
  };

  if (!activeReservation) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-16">
      <header className="p-4 bg-background border-b border-border">
        <h1 className="text-2xl font-medium text-center">Active Reservation</h1>
      </header>

      <div className="p-4">
        <Card className="p-4 mb-4 bg-card text-card-foreground">
          <div className="bg-yellow-100 p-3 rounded-lg mb-4 flex items-start">
            <Info className="h-5 w-5 text-yellow-700 mr-2 mt-0.5" />
            <p className="text-yellow-700 text-sm">You already have an active reservation. You cannot make a new reservation until the current one ends.</p>
          </div>

          <h2 className="text-xl font-semibold mb-3">Room #{activeReservation.roomId}</h2>

          <div className="flex items-center mb-4">
            <Clock className="h-5 w-5 text-muted-foreground mr-2" />
            <div>
              <div className="text-sm text-muted-foreground">Start: {new Date(activeReservation.startTime).toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">End: {new Date(activeReservation.endTime).toLocaleString()}</div>
            </div>
          </div>

          <ReservationCountdown reservation={activeReservation} />

          <Button variant="outline" className="w-full mt-4 border border-border" onClick={handleReservationAction}>
            {getActionButtonText()}
          </Button>
        </Card>

        {activeReservation.services.length > 0 && (
          <Card className="p-4 mb-4 bg-card text-card-foreground">
            <CardHeader>
              <CardTitle className="text-lg font-semibold mb-2">Servicios</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {activeReservation.services.map((service, index) => (
                <Badge key={index} variant="outline" className="px-3 py-1">
                  {service.name} - ${service.price}
                </Badge>
              ))}
            </CardContent>
          </Card>
        )}

        <Card className="p-4 mb-4 bg-card text-card-foreground">
          <CardHeader>
            <CardTitle className="text-lg font-semibold mb-2">Productos</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {activeReservation.products.map((product, index) => (
              <Badge key={index} variant="secondary" className="px-3 py-1">
                {product.name} - ${product.price} x {product.quantity}
              </Badge>
            ))}
          </CardContent>
        </Card>

        <Button className="w-full rounded-full h-12 bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => navigate('/home')}>Back to Home</Button>
      </div>

      <BottomNavBar />
    </div>
  );
}

export default ActiveReservationPage;