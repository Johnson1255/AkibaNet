import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import BottomNavBar from "./Bottom-navbar";
import { useTranslation } from "react-i18next";
import { useReservation } from "../context/ReservationContext";
import { useNavigate } from "react-router-dom";

// Interfaces para los datos
interface ServiceSpecifications {
  brand?: string;
  model?: string;
  features?: string[];
  options?: string[];
  contents?: string[];
  details?: string;
  speed?: string;
  resolution?: string;
}

interface ApiService {
  id: string;
  name: string;
  description: string;
  price: number;
  available: boolean;
  stock: number;
  specifications: ServiceSpecifications;
  category: string;
}

interface ServicesByCategory {
  gaming: ApiService[];
  working: ApiService[];
  thinking: ApiService[];
}
        
     

export default function AdditionalServices() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  // Usar el contexto de reserva
  const { reservation, updateSelectedServices, updateRoomDetails } = useReservation();
  
  // Estado para los servicios obtenidos de la API
  const [servicesByCategory, setServicesByCategory] = useState<ServicesByCategory>({
    gaming: [],
    working: [],
    thinking: []
  });
  
  // Estado para controlar la carga
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estado local que se sincroniza con el estado global
  // Cambiado para inicializar correctamente sin causar re-renderizaciones innecesarias
  const [selectedServices, setSelectedServices] = useState<Set<string>>(() => {
    return new Set(Array.from(reservation.selectedServices || []));
  });
  
  // Obtener datos de la habitación desde el contexto de reserva
  const roomId = reservation.roomId;
  const baseHours = reservation.hours || 3;
  const hourlyRate = reservation.hourlyRate || 800;
  const baseRoomPrice = baseHours * hourlyRate;
  
  // Verificar si tenemos la información necesaria
  useEffect(() => {
    if (!roomId || !reservation.selectedDate || !reservation.selectedTime) {
      alert("Se requiere seleccionar una habitación, fecha y hora antes de agregar servicios");
      navigate("/reserve");
    }
  }, [roomId, reservation.selectedDate, reservation.selectedTime, navigate]);

  // Obtener los servicios de la API
  useEffect(() => {
    const fetchServices = async () => {
      setIsLoading(true);
      try {
        const fetchUrl = 'http://localhost:3000/api/services/categories';
        const response = await fetch(fetchUrl);
        if (!response.ok) {
          throw new Error('Error al obtener los servicios');
        }
        const categorized: ServicesByCategory = await response.json();
        setServicesByCategory(categorized);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
        console.error('Error fetching services:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Sincronizar el estado local con el contexto cuando cambia
  // Usamos useCallback para evitar regenerar esta función en cada renderización
  const syncSelectedServices = useCallback(() => {
    const servicesArray = Array.from(selectedServices);
    // Solo actualizar si hay cambios reales para evitar bucles infinitos
    if (!reservation.selectedServices || 
        servicesArray.length !== reservation.selectedServices.size || 
        !servicesArray.every(id => reservation.selectedServices?.has(id))) {
      updateSelectedServices(selectedServices);
    }
  }, [selectedServices, reservation.selectedServices, updateSelectedServices]);

  // Ejecutar la sincronización solo cuando cambian los servicios seleccionados
  useEffect(() => {
    syncSelectedServices();
  }, [syncSelectedServices]);


  const toggleService = (serviceId: string) => {
    const newSelected = new Set(selectedServices);
    if (newSelected.has(serviceId)) {
      newSelected.delete(serviceId);
    } else {
      newSelected.add(serviceId);
    }
    setSelectedServices(newSelected);
  };

  const calculateTotal = () => {
    let servicesTotal = 0;
    
    // Calcular el precio de los servicios seleccionados
    selectedServices.forEach(serviceId => {
      for (const category in servicesByCategory) {
        const service = servicesByCategory[category as keyof ServicesByCategory].find(s => s.id === serviceId);
        if (service) {
          servicesTotal += service.price;
          break;
        }
      }
    });
    
    // Usar el precio base de la habitación del contexto
    const total = servicesTotal + baseRoomPrice;
    return total;
  };

  // Función auxiliar parseDateTime (similar a Room-details.tsx)
  function parseDateTime(dateStr: string, timeStr: string): Date {
    const dateParts = dateStr.split("/");
    if (dateParts.length !== 3) {
      throw new Error(`Formato de fecha inválido: ${dateStr}. Se esperaba DD/MM/YYYY`);
    }
    const day = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1;
    const year = parseInt(dateParts[2]);
    const cleanedTimeStr = timeStr
      .replace("p. m.", "pm")
      .replace("a. m.", "am")
      .replace(/\s+/g, "");
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
    return new Date(year, month, day, hour, minute);
  }

  // Modificar handleConfirmAndPay para utilizar la lógica de reserva de Room-details.tsx
  const handleConfirmAndPay = async () => {
    if (!reservation.selectedDate || !reservation.selectedTime || !roomId) {
      alert("Falta información necesaria para la reserva: habitación, fecha u hora.");
      navigate("/reserve");
      return;
    }
    
    try {
      // Verificación de usuario y token
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");
      
      if (!storedUser) {
        throw new Error("No hay usuario guardado. Inicie sesión nuevamente.");
      }
      
      if (!token) {
        throw new Error("No se encontró un token de autenticación. Inicie sesión nuevamente.");
      }
      
      const parsedUser = JSON.parse(storedUser);
      const userId = parsedUser.id;

      // Cálculo de fechas de inicio y fin
      const startDateTime = parseDateTime(reservation.selectedDate, reservation.selectedTime);
      const endDateTime = new Date(startDateTime.getTime() + baseHours * 60 * 60 * 1000);
      
      console.log("Fecha inicio:", startDateTime.toISOString());
      console.log("Fecha fin:", endDateTime.toISOString());

      // Cálculo de precios 
      let servicesTotal = 0;
      const selectedServicesList: string[] = [];
      const selectedServicesArray = getSelectedServices().map(service => {
        selectedServicesList.push(service.id);
        servicesTotal += service.price;
        return {
          serviceId: service.id,
          serviceName: service.name, // Add service name here
          quantity: 1,
          price: service.price
        };
      });

      const totalPrice = baseRoomPrice + servicesTotal;
      
      // Actualizar el contexto con el precio total
      updateRoomDetails({ 
        totalPrice: totalPrice
      });

      // Creación del payload para la API
      const reservationPayload = {
        userId,
        roomId: roomId,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        duration: baseHours,
        basePrice: baseRoomPrice,
        totalPrice: totalPrice,
        status: 'pending',
        services: selectedServicesArray,
        products: []
      };

      console.log("Payload de reserva:", reservationPayload);

      // Llamada a la API para crear la reserva
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
        status: 'pending',
        services: selectedServicesArray,
        hours: baseHours,
        basePrice: baseRoomPrice
      }));
      
      navigate("/confirmation");
    } catch (error) {
      console.error("Error al confirmar reserva:", error);
      alert(t("reservation.errors.bookingError", "Error al guardar la reserva. Inténtalo de nuevo."));
    }
  };

  const renderServiceCard = (service: ApiService) => (
    <Card
      key={service.id}
      className={`p-4 flex items-center justify-between ${
        selectedServices.has(service.id)
          ? "bg-primary text-primary-foreground"
          : "bg-card text-card-foreground"
      }`}
    >
      <div>
        <h3 className="text-lg font-normal">{service.name}</h3>
        {service.description && (
          <p
            className={`text-sm ${
              selectedServices.has(service.id)
                ? "text-gray-300"
                : "text-gray-500"
            }`}
          >
            {service.description}
          </p>
        )}
      </div>
      <div className="flex items-center gap-4">
        <span className="text-lg whitespace-nowrap">¥ {service.price}</span>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={() => toggleService(service.id)}
        >
          {selectedServices.has(service.id) ? (
            <Minus className="h-6 w-6" />
          ) : (
            <Plus className="h-6 w-6" />
          )}
        </Button>
      </div>
    </Card>
  );

  // Obtener todos los servicios seleccionados
  const getSelectedServices = (): ApiService[] => {
    const selected: ApiService[] = [];
    selectedServices.forEach(serviceId => {
      for (const category in servicesByCategory) {
        const service = servicesByCategory[category as keyof ServicesByCategory].find(s => s.id === serviceId);
        if (service) {
          selected.push(service);
          break;
        }
      }
    });
    return selected;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-xl">{t('reservation.loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <p className="text-xl text-red-500">{t('reservation.errors.error')} {error}</p>
        <Button className="mt-4" onClick={() => window.location.reload()}>
          {t('common.retry')}
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-background pb-16">
        {/* Header */}
        <header className="p-4 flex items-center justify-between bg-card">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-normal">{t('reservation.addServices')}</h1>
          <div className="w-10" /> {/* Spacer for alignment */}
        </header>

        {/* Room information summary */}
        <div className="p-4 bg-muted/30">
          <h2 className="text-lg font-medium">{t('reservation.room')} #{roomId}</h2>
          <div className="text-sm text-muted-foreground">
            <p>{reservation.selectedDate} - {reservation.selectedTime}</p>
            <p>{baseHours} {baseHours === 1 ? t('reservation.hour') : t('reservation.hours')} - ¥{baseRoomPrice}</p>
          </div>
        </div>

        {/* Services List */}
        <div className="p-4 space-y-8">
          {/* Gaming Services */}
          <div>
            <h2 className="text-2xl mb-4">{t('services.categories.gaming')}</h2>
            <div className="space-y-4">
              {servicesByCategory.gaming.map(renderServiceCard)}
            </div>
          </div>

          {/* Thinking Services */}
          <div>
            <h2 className="text-2xl mb-4">{t('services.categories.thinking')}</h2>
            <div className="space-y-4">
              {servicesByCategory.thinking.map(renderServiceCard)}
            </div>
          </div>

          {/* Working Services */}
          <div>
            <h2 className="text-2xl mb-4">{t('services.categories.working')}</h2>
            <div className="space-y-4">
              {servicesByCategory.working.map(renderServiceCard)}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bottom-0 left-0 right-0">
          <div className="bg-secondary p-4 space-y-2">
            <div className="flex justify-between">
              <span>{t('reservation.room')} #{roomId}</span>
              <span className="whitespace-nowrap">¥ {baseRoomPrice}</span>

            </div>
            {getSelectedServices().map((service) => (
              <div key={service.id} className="flex justify-between">
                <span>1 x {service.name}</span>
                <span className="whitespace-nowrap">¥ {service.price}</span>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between font-bold">
              <span>{t('common.total')}</span>
              <span className="whitespace-nowrap">¥ {calculateTotal()}</span>
            </div>
          </div>
          <Button 
            className="w-full rounded-full h-12 bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleConfirmAndPay}
          >
            {t('reservation.confirmAndPay')}
          </Button>
        </div>
      </div>
      <BottomNavBar />
    </>
  );
}