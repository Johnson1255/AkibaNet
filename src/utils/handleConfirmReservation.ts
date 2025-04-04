// src/utils/handleConfirmReservation.ts

import type { Reservation } from "@/types/reservation";
import type { ServicesByCategory } from "@/types/services";
import { parseDateTime } from "@/utils/parseDateTime";

// Define the structure expected by the backend for items (services/products)
interface BookingItem {
  itemId: string; // Assuming ApiService 'id' is the correct ObjectId string
  itemType: "Service" | "Product";
  name: string;
  price: number;
  quantity: number; // Assuming quantity is 1 for now
}

interface RoomDetails {
  roomId: string; // Cambiado a string | number para unificar tipos
  roomDisplayId?: string;
  selectedDate?: string;
  selectedTime?: string;
  hourlyRate?: number;
  hours?: number;
  price?: number; // Base price for the room duration
  totalPrice?: number; // Total price including services/products
  bookingId?: string; // Add bookingId from response
  services?: BookingItem[]; // Store services in the correct format
  products?: BookingItem[]; // Store products in the correct format
}

interface HandleDirectConfirmProps {
  reservation: {
    selectedDate?: string;
    selectedTime?: string;
  };
  roomId: string; // Keep as string, likely from URL params
  roomDisplayId: string; // Display ID for the room
  hours: number;
  price: number; // This is the basePrice for the room duration
  navigate: (to: string) => void;
  updateRoomDetails: (details: Partial<RoomDetails>) => void;
  t: (key: string, defaultText: string) => string; // Add type for t function
}

interface HandleWithServicesConfirmProps {
  reservation: Reservation;
  selectedServices: Set<string>;
  roomId: string; // MongoDB _id
  roomDisplayId: string; // <-- AÑADIDO: ID legible
  navigate: (to: string) => void;
  updateRoomDetails: (roomDetails: Partial<RoomDetails>) => void;
  t: any;
}

// --- Function to handle confirmation WITH services ---
export const handleWithServicesConfirm = async ({
  reservation,
  selectedServices,
  roomId, // MongoDB _id
  roomDisplayId, // <-- AÑADIDO: ID legible
  navigate,
  updateRoomDetails,
  t,
}: HandleWithServicesConfirmProps) => {
  // <-- MODIFICADA la firma
  // --- 1. Input Validation ---
  if (
    !reservation.selectedDate ||
    !reservation.selectedTime ||
    !roomId ||
    !reservation.hours ||
    reservation.hours <= 0
  ) {
    alert(
      t(
        "reservation.errors.missingInfo",
        "Falta información necesaria o inválida (habitación, fecha, hora, duración)."
      )
    );
    navigate("/reserve");
    return;
  }
  // Validar que roomId sea un ObjectId válido (puede ser redundante si ya lo validaste antes de llamar)
  // if (!mongoose.Types.ObjectId.isValid(roomId)) { ... } // Opcional: añadir validación si es necesario aquí

  try {
    // --- 2. Authentication Check ---
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (!storedUser || !token) {
      alert(
        t(
          "auth.errors.sessionExpired",
          "Sesión expirada. Inicie sesión nuevamente."
        )
      );
      navigate("/login");
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    const userId = parsedUser.id;

    // --- 3. Prepare Data ---
    const startDateTime = parseDateTime(
      reservation.selectedDate,
      reservation.selectedTime
    );
    const basePrice = reservation.baseRoomPrice ?? 0;

    const servicesForPayload: BookingItem[] = Array.from(selectedServices)
      .map((serviceId): BookingItem | null => {
        // ... (lógica de mapeo de servicios sin cambios) ...
        if (!reservation.servicesByCategory) return null;
        for (const category in reservation.servicesByCategory) {
          const service = reservation.servicesByCategory[
            category as keyof ServicesByCategory
          ]?.find((s) => s.id === serviceId);
          if (service) {
            return {
              itemId: service.id,
              itemType: "Service",
              name: service.name,
              price: service.price,
              quantity: 1, // Asumiendo cantidad 1
            };
          }
        }
        console.warn(
          `Service with ID ${serviceId} not found in reservation data.`
        );
        return null;
      })
      .filter((item): item is BookingItem => item !== null);

    const servicesTotal = servicesForPayload.reduce(
      (sum, s) => sum + s.price * s.quantity,
      0
    );
    const totalPrice = basePrice + servicesTotal;

    // --- 4. Construct Payload for Backend ---
    const reservationPayload = {
      userId,
      roomId, // <-- Sigue siendo el _id de MongoDB para el backend
      startTime: startDateTime.toISOString(),
      duration: reservation.hours,
      basePrice: basePrice,
      services: servicesForPayload,
      products: [],
    };

    console.log("Sending Booking Payload (with services):", reservationPayload);

    // --- 5. API Call ---
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/bookings/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reservationPayload),
      }
    );
    const responseData = await response.json();

    // --- 6. Response Handling ---
    if (!response.ok) {
      // ... (manejo de errores de respuesta sin cambios) ...
      const errorMessage =
        responseData.error || `HTTP error ${response.status}`;
      const errorCode = responseData.code || "UNKNOWN_ERROR";
      console.error(
        `Error creating booking: ${errorMessage} (Code: ${errorCode})`,
        responseData
      );
      let userMessage = t(
        "reservation.errors.bookingError",
        "Error al guardar la reserva. Inténtalo de nuevo."
      );
      if (errorCode === "NO_AVAILABILITY") {
        userMessage = t(
          "reservation.errors.noAvailability",
          "El cuarto no está disponible en el horario seleccionado."
        );
      } else if (errorCode === "MISSING_FIELDS") {
        userMessage = t(
          "reservation.errors.missingInfoBackend",
          "Faltan datos requeridos para crear la reserva en el servidor."
        );
      } else if (errorCode === "INVALID_ROOM_ID") {
        // Si el backend devuelve este error específico
        userMessage = t(
          "reservation.errors.invalidRoomId",
          "El identificador de la habitación es inválido."
        );
      }
      alert(userMessage);
      return;
    }

    // --- 7. Success Handling ---
    const bookingId = responseData.data?.bookingId;
    if (!bookingId) {
      console.error("Booking created but no bookingId received:", responseData);
      alert(
        t(
          "reservation.errors.bookingIdMissing",
          "Reserva creada, pero hubo un problema al obtener el ID. Contacta soporte."
        )
      );
      return;
    }
    console.log("Booking successful (with services):", responseData);

    // --- 8. Update Local State/Storage & Navigate ---
    // --- MODIFICACIÓN AQUÍ ---
    const userIdForStorage = parsedUser?.id || "unknown-user"; // Obtener userId real

    // Crear objeto para localStorage con AMBOS IDs y datos correctos
    const reservationDetailsForStorage = {
      roomId: roomId, // <-- _id de MongoDB
      roomDisplayId: roomDisplayId, // <-- ID legible (ej: "108")
      selectedDate: reservation.selectedDate,
      selectedTime: reservation.selectedTime,
      hours: reservation.hours,
      price: basePrice, // Precio base
      totalPrice: totalPrice, // Precio total (con servicios)
      bookingId: bookingId, // _id de la reserva creada
      services: servicesForPayload, // Servicios seleccionados
      products: [], // Productos (vacío por ahora)
      userId: userIdForStorage, // ID del usuario real
      startTime: startDateTime.toISOString(),
      status: "pending", // Estado inicial
      endTime: new Date(
        startDateTime.getTime() + reservation.hours * 3600000
      ).toISOString(),
    };

    // Actualizar estado local (opcional)
    updateRoomDetails({
      roomId: roomId,
      bookingId: bookingId,
      totalPrice: totalPrice,
      // ... otros detalles relevantes ...
    });

    // Guardar en localStorage
    localStorage.setItem(
      "lastReservation",
      JSON.stringify(reservationDetailsForStorage) // Guardar el objeto completo
    );

    navigate("/confirmation");
  } catch (error) {
    // --- 9. Catch Unexpected Errors ---
    // ... (manejo de errores catch sin cambios) ...
    console.error(
      "Unexpected error during booking confirmation (with services):",
      error
    );
    let message = t(
      "reservation.errors.generic",
      "Ocurrió un error inesperado."
    );
    if (error instanceof Error) {
      message = error.message;
    }
    alert(message);
  }
};

// --- Function to handle confirmation WITHOUT services (Direct) ---
export const handleDirectConfirm = async ({
  reservation,
  roomId,
  roomDisplayId,
  hours,
  price, // This is the basePrice for the duration
  navigate,
  updateRoomDetails,
  t,
}: HandleDirectConfirmProps) => {
  // --- 1. Input Validation ---
  if (
    !reservation.selectedDate ||
    !reservation.selectedTime ||
    !roomId ||
    hours <= 0
  ) {
    alert(
      t(
        "reservation.errors.missingInfo",
        "Falta información necesaria o inválida (habitación, fecha, hora, duración)."
      )
    );
    navigate("/reserve");
    return;
  }

  try {
    // --- 2. Authentication Check ---
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (!storedUser || !token) {
      alert(
        t(
          "auth.errors.sessionExpired",
          "Sesión expirada. Inicie sesión nuevamente."
        )
      );
      navigate("/login");
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    const userId = parsedUser.id;

    // --- 3. Prepare Data ---
    const startDateTime = parseDateTime(
      reservation.selectedDate,
      reservation.selectedTime
    );

    // --- 4. Construct Payload for Backend ---
    const reservationPayload = {
      userId,
      roomId,
      startTime: startDateTime.toISOString(),
      duration: hours,
      basePrice: price, // This 'price' prop is the basePrice
      services: [], // No services in direct booking
      products: [], // No products in direct booking
    };

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/bookings/create`,
      {
        // <-- Correct Endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reservationPayload),
      }
    );

    const responseData = await response.json(); // Parse JSON

    // --- 6. Response Handling ---
    if (!response.ok) {
      const errorMessage =
        responseData.error || `HTTP error ${response.status}`;
      const errorCode = responseData.code || "UNKNOWN_ERROR";
      console.error(
        `Error creating booking: ${errorMessage} (Code: ${errorCode})`,
        responseData
      );
      let userMessage = t(
        "reservation.errors.bookingError",
        "Error al guardar la reserva. Inténtalo de nuevo."
      );
      if (errorCode === "NO_AVAILABILITY") {
        userMessage = t(
          "reservation.errors.noAvailability",
          "El cuarto no está disponible en el horario seleccionado."
        );
      } else if (errorCode === "MISSING_FIELDS") {
        userMessage = t(
          "reservation.errors.missingInfoBackend",
          "Faltan datos requeridos para crear la reserva en el servidor."
        );
      }
      alert(userMessage);
      return;
    }

    // --- 7. Success Handling ---
    const bookingId = responseData.data?.bookingId;
    if (!bookingId) {
      console.error("Booking created but no bookingId received:", responseData);
      alert(
        t(
          "reservation.errors.bookingIdMissing",
          "Reserva creada, pero hubo un problema al obtener el ID. Contacta soporte."
        )
      );
      return;
    }

    console.log("Booking successful:", responseData);

    // --- 8. Update Local State/Storage & Navigate ---
    const finalRoomDetails: RoomDetails = {
      roomId: roomId,
      roomDisplayId: roomDisplayId,
      selectedDate: reservation.selectedDate,
      selectedTime: reservation.selectedTime,
      hours: hours,
      price: price, // Base price
      totalPrice: price, // Total price is same as base price (no services/products)
      bookingId: bookingId,
      services: [],
      products: [],
    };
    updateRoomDetails(finalRoomDetails);

    localStorage.setItem(
      "lastReservation",
      JSON.stringify({
        ...finalRoomDetails,
        startTime: startDateTime.toISOString(),
        status: "pending",
        endTime: new Date(
          startDateTime.getTime() + hours * 3600000
        ).toISOString(),
      })
    );

    navigate("/confirmation");
  } catch (error) {
    // --- 9. Catch Unexpected Errors ---
    console.error(
      "Unexpected error during direct booking confirmation:",
      error
    );
    let message = t(
      "reservation.errors.generic",
      "Ocurrió un error inesperado."
    );
    if (error instanceof Error) {
      message = error.message;
    }
    alert(message);
  }
};
