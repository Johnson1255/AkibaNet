import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useReservation } from "@/context/ReservationContext";
import { Room } from "@/types/room";

const useRoomSelection = () => {
  const { updateRoomDetails } = useReservation();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [selectedTime, setSelectedTime] = useState<string>(
    getNextQuarterHour(new Date())
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkActiveReservation = () => {
      const savedReservation = localStorage.getItem("lastReservation");
      if (savedReservation) {
        const reservation = JSON.parse(savedReservation);
        const now = new Date();
        const endTime = new Date(reservation.endTime);
        if (now < endTime && reservation.status !== "cancelled") {
          navigate("/active-reservation");
        }
      }
    };
    checkActiveReservation();
  }, [navigate]);

  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:3000/api/rooms${
          selectedCategory !== "all" ? `?category=${selectedCategory}` : ""
        }`
      );
      if (!response.ok) {
        throw new Error("Error al cargar las habitaciones");
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        setRooms(data);
      } else {
        console.error("Formato de respuesta inesperado:", data);
        setError("Formato de respuesta inesperado del servidor");
        setRooms([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      console.error("Error fetching rooms:", err);
      setRooms([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchRooms();
  }, [selectedCategory, fetchRooms]);

  const handleRoomSelect = (roomId: string) => {
    setSelectedRoom(roomId === selectedRoom ? null : roomId);
  };

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      updateRoomDetails({ selectedDate: date.toLocaleDateString() });
    }
  };

  const handleTimeChange = (time: string) => {
    setSelectedTime(time);
    updateRoomDetails({ selectedTime: time });
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const goToRoomDetails = (roomId: string) => {
    if (roomId) {
      const selectedRoom = rooms.find((r) => r.id === roomId);
      updateRoomDetails({
        roomId: Number(roomId),
        selectedDate: selectedDate?.toLocaleDateString(),
        selectedTime: selectedTime,
        hourlyRate: selectedRoom?.hourlyRate,
      });
      console.log("Navigating to room details with roomId:", roomId);
      navigate(`/room-details/${roomId}`);
    }
  };

  return {
    rooms,
    selectedRoom,
    selectedDate,
    selectedTime,
    selectedCategory,
    loading,
    error,
    handleRoomSelect,
    handleDateChange,
    handleTimeChange,
    handleCategoryChange,
    goToRoomDetails,
  };
};

const getNextQuarterHour = (date: Date) => {
  const minutes = date.getMinutes();
  const nextQuarter = Math.ceil((minutes + 1) / 15) * 15;
  date.setMinutes(nextQuarter);
  let hours = date.getHours();
  const minutes24 = date.getMinutes();
  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${hours.toString().padStart(2, "0")}:${minutes24
    .toString()
    .padStart(2, "0")} ${ampm}`;
};

export default useRoomSelection;
