import type React from "react"
import { createContext, useContext, useState, type ReactNode, useCallback } from "react"
import type { Reservation } from "@/types/reservation"

// Definimos los tipos de datos para nuestro contexto
export interface Service {
  id: string
  name: string
  price: number
  description?: string
  isConsole?: boolean
}

interface RoomDetails {
  roomId?: number
  selectedDate?: string
  selectedTime?: string
  hourlyRate?: number
  hours?: number
  price?: number
  totalPrice?: number
}

interface ReservationContextProps {
  reservation: Reservation
  updateRoomDetails: (details: Partial<RoomDetails>) => void
  updateSelectedServices: (services: Set<string>) => void
  saveReservation: () => Promise<boolean>
}

// Creamos el contexto
const ReservationContext = createContext<ReservationContextProps | undefined>(undefined)

// Hook personalizado para usar el contexto
export const useReservation = () => {
  const context = useContext(ReservationContext)
  if (!context) {
    throw new Error("useReservation must be used within a ReservationProvider")
  }
  return context
}

// Componente proveedor del contexto
interface ReservationProviderProps {
  children: ReactNode
}

export const ReservationProvider: React.FC<ReservationProviderProps> = ({ children }) => {
  // Estado inicial con valores por defecto
  const [reservation, setReservation] = useState<Reservation>({
    roomId: undefined,
    hours: 1, // Valor por defecto: 1 hora
    price: 800, // Precio base
    totalPrice: 800,
    hourlyRate: 800, // Valor por defecto para hourlyRate
    selectedDate: new Date().toLocaleDateString(),
    selectedTime: "10:00 pm",
    selectedServices: new Set(["refrigerator"]), // Por defecto incluye refrigerador
  })

  // Función para actualizar detalles de la habitación
  const updateRoomDetails = (details: Partial<RoomDetails>) => {
    setReservation((prev) => ({
      ...prev,
      ...details,
    }))
  }

  // Función para actualizar servicios seleccionados
  const updateSelectedServices = useCallback(
    (services: Set<string>) => {
      setReservation((prevState) => {
        // Solo actualizar si los servicios son diferentes
        if (
          !prevState.selectedServices ||
          Array.from(services).length !== Array.from(prevState.selectedServices).length ||
          !Array.from(services).every((id) => prevState.selectedServices?.has(id))
        ) {
          return {
            ...prevState,
            selectedServices: services,
          }
        }
        // Devolver el estado anterior si no hay cambios
        return prevState
      })
    },
    [setReservation],
  )

  // Función para guardar la reserva en la base de datos o API
  const saveReservation = async (): Promise<boolean> => {
    try {
      // Aquí iría la lógica para guardar en la base de datos o API
      console.log("Guardando reserva:", reservation)

      // Simulando una petición exitosa
      // En un caso real, aquí harías un fetch o axios.post a tu API
      localStorage.setItem(
        "lastReservation",
        JSON.stringify({
          ...reservation,
          selectedServices: Array.from(reservation.selectedServices || []),
        }),
      )

      return true
    } catch (error) {
      console.error("Error al guardar la reserva:", error)
      return false
    }
  }

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
  )
}

