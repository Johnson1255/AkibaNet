import type { Reservation } from "@/types/reservation";
import type { ApiService, ServicesByCategory } from "@/types/services";
import { parseDateTime } from "@/utils/parseDateTime";

interface RoomDetails {
  roomId?: number;
  selectedDate?: string;
  selectedTime?: string;
  hourlyRate?: number;
  hours?: number;
  price?: number;
  totalPrice?: number;
}
interface HandleDirectConfirmProps {
  reservation: {
    selectedDate?: string;
    selectedTime?: string;
  };
  roomId: string;
  hours: number;
  price: number;
  navigate: (to: string) => void;
  updateRoomDetails: (details: Partial<RoomDetails>) => void;
  t: any;
}
interface HandleWithServicesConfirmProps {
  reservation: Reservation;
  selectedServices: Set<string>;
  roomId: string;
  navigate: (to: string) => void;
  updateRoomDetails: (details: Partial<RoomDetails>) => void;
  t: any;
}

export const handleWithServicesConfirm = async ({
  reservation,
  selectedServices,
  roomId,
  navigate,
  updateRoomDetails,
  t,
}: HandleWithServicesConfirmProps) => {
  if (!reservation.selectedDate || !reservation.selectedTime || !roomId) {
    alert(
      "Falta información necesaria para la reserva: habitación, fecha u hora."
    );
    navigate("/reserve");
    return;
  }
  try {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (!storedUser) {
      throw new Error("No hay usuario guardado. Inicie sesión nuevamente.");
    }
    if (!token) {
      throw new Error(
        "No se encontró un token de autenticación. Inicie sesión nuevamente."
      );
    }
    const parsedUser = JSON.parse(storedUser);
    const userId = parsedUser.id;

    const startDateTime = parseDateTime(
      reservation.selectedDate,
      reservation.selectedTime
    );
    const endDateTime = new Date(
      startDateTime.getTime() + reservation.hours * 60 * 60 * 1000
    );

    let servicesTotal = 0;
    const selectedServicesList: string[] = [];

    // Fix the type conversion issue by creating proper ApiService objects
    const selectedServicesArray = Array.from(selectedServices)
      .map((serviceId) => {
        if (!reservation.servicesByCategory) return null;

        for (const category in reservation.servicesByCategory) {
          const service = reservation.servicesByCategory[
            category as keyof ServicesByCategory
          ]?.find((s) => s.id === serviceId);
          if (service) {
            selectedServicesList.push(service.id);
            servicesTotal += service.price;
            return {
              id: service.id,
              name: service.name,
              description: service.description,
              price: service.price,
              available: service.available,
              stock: service.stock,
              specifications: service.specifications,
              category: service.category,
            } as ApiService;
          }
        }
        return null;
      })
      .filter((service): service is ApiService => service !== null);

    // Use nullish coalescing to handle potentially undefined baseRoomPrice
    const basePrice = reservation.baseRoomPrice ?? 0;
    const totalPrice = basePrice + servicesTotal;

    // Update the reservation with the total price
    updateRoomDetails({
      totalPrice: totalPrice,
    });

    const reservationPayload = {
      userId,
      roomId: roomId,
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      duration: reservation.hours,
      basePrice: basePrice,
      totalPrice: totalPrice,
      status: "pending",
      services: selectedServicesArray,
      products: [],
    };

    const response = await fetch("http://localhost:3000/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(reservationPayload),
    });
    const responseData = await response.json();
    if (!response.ok) {
      throw new Error(
        `Error al crear la reserva: ${
          responseData.error || "Error desconocido"
        }`
      );
    }

    localStorage.setItem(
      "lastReservation",
      JSON.stringify({
        ...responseData,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        status: "pending",
        services: selectedServicesArray,
        hours: reservation.hours,
        basePrice: basePrice,
      })
    );
    navigate("/confirmation");
  } catch (error) {
    console.error("Error al confirmar reserva:", error);
    alert(
      t(
        "reservation.errors.bookingError",
        "Error al guardar la reserva. Inténtalo de nuevo."
      )
    );
  }
};

export const handleDirectConfirm = async ({
  reservation,
  roomId,
  hours,
  price,
  navigate,
  updateRoomDetails,
  t,
}: HandleDirectConfirmProps) => {
  if (!reservation.selectedDate || !reservation.selectedTime || !roomId) {
    alert(
      t(
        "reservation.errors.missingInfo",
        "Falta información necesaria para la reserva"
      )
    );
    navigate("/reserve");
    return;
  }

  try {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!storedUser || !token) {
      throw new Error(
        t(
          "auth.errors.sessionExpired",
          "Sesión expirada. Inicie sesión nuevamente."
        )
      );
    }

    const parsedUser = JSON.parse(storedUser);
    const userId = parsedUser.id;

    const startDateTime = parseDateTime(
      reservation.selectedDate,
      reservation.selectedTime
    );
    const endDateTime = new Date(
      startDateTime.getTime() + hours * 60 * 60 * 1000
    );

    // Actualizar los detalles de la reserva
    updateRoomDetails({
      hours,
      price,
      totalPrice: price,
      selectedDate: reservation.selectedDate,
      selectedTime: reservation.selectedTime,
    });

    const reservationPayload = {
      userId,
      roomId: roomId,
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      duration: hours,
      basePrice: price,
      totalPrice: price,
      status: "pending",
      services: [],
      products: [],
    };

    const response = await fetch("http://localhost:3000/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(reservationPayload),
    });

    const responseData = await response.json();
    if (!response.ok) {
      throw new Error(
        t(
          "reservation.errors.createError",
          `Error al crear la reserva: ${
            responseData.error || "Error desconocido"
          }`
        )
      );
    }

    localStorage.setItem(
      "lastReservation",
      JSON.stringify({
        ...responseData,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        status: "pending",
        hours,
        basePrice: price,
        totalPrice: price,
      })
    );

    navigate("/confirmation");
  } catch (error) {
    console.error("Error al confirmar reserva:", error);
    alert(
      t(
        "reservation.errors.bookingError",
        "Error al guardar la reserva. Inténtalo de nuevo."
      )
    );
  }
};
