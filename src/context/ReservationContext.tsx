import React, { createContext, useContext, useState, ReactNode } from 'react';

// Definimos los tipos de datos para nuestro contexto
export interface Service {
  id: string;
  name: string;
  price: number;
  description?: string;
  isConsole?: boolean;
}

interface RoomDetails {
  roomId?: number;
  hours?: number;
  price?: number;
  totalPrice?: number;
  selectedDate?: string;
  selectedTime?: string;
}

interface Reservation {
  roomId?: number;
  hours?: number;
  price?: number;
  totalPrice?: number;
  selectedDate?: string;
  selectedTime?: string;
  selectedServices: Set<string>;
}

interface ReservationContextProps {
  reservation: Reservation;
  updateRoomDetails: (details: Partial<RoomDetails>) => void;
  updateSelectedServices: (services: Set<string>) => void;
  saveReservation: () => Promise<boolean>;
}

// Creamos el contexto
const ReservationContext = createContext<ReservationContextProps | undefined>(undefined);

// Hook personalizado para usar el contexto
export const useReservation = () => {
  const context = useContext(ReservationContext);
  if (!context) {
    throw new Error('useReservation must be used within a ReservationProvider');
  }
  return context;
};

// Componente proveedor del contexto
interface ReservationProviderProps {
  children: ReactNode;
}

export const ReservationProvider: React.FC<ReservationProviderProps> = ({ children }) => {
  // Estado inicial con valores por defecto
  const [reservation, setReservation] = useState<Reservation>({
    roomId: undefined,
    hours: 1, // Valor por defecto: 1 hora
    price: 800, // Precio base
    totalPrice: 800,
    selectedDate: new Date().toLocaleDateString(),
    selectedTime: '10:00 pm',
    selectedServices: new Set(['refrigerator']), // Por defecto incluye refrigerador
  });

  // Función para actualizar detalles de la habitación
  const updateRoomDetails = (details: Partial<RoomDetails>) => {
    setReservation(prev => ({
      ...prev,
      ...details,
    }));
  };

  // Función para actualizar servicios seleccionados
  const updateSelectedServices = (services: Set<string>) => {
    setReservation(prev => ({
      ...prev,
      selectedServices: services,
    }));
  };

  // Función para guardar la reserva en la base de datos o API
  const saveReservation = async (): Promise<boolean> => {
    try {
      // Aquí iría la lógica para guardar en la base de datos o API
      console.log('Guardando reserva:', reservation);
      
      // Simulando una petición exitosa
      // En un caso real, aquí harías un fetch o axios.post a tu API
      localStorage.setItem('lastReservation', JSON.stringify({
        ...reservation,
        selectedServices: Array.from(reservation.selectedServices)
      }));
      
      return true;
    } catch (error) {
      console.error('Error al guardar la reserva:', error);
      return false;
    }
  };

  return (
    <ReservationContext.Provider
      value={{
        reservation,
        updateRoomDetails,
        updateSelectedServices,
        saveReservation,
      }}
    >
      {children}
    </ReservationContext.Provider>
  );
};