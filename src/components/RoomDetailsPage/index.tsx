import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useRoomDetails } from "../../hooks/useRoomDetails";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/common/Header";
import ImageCarousel from "./ImageCarousel";
import BottomNavBar from "@/components/common/BottomNavbar";
import { DetailsCard } from "@/components/RoomDetailsPage/DetailsCard";
import { BookingSection } from "@/components/RoomDetailsPage/BookingSection";

export default function RoomDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const { t } = useTranslation();

  // Get roomId from URL parameters
  let roomId: string | null =
    params.roomId || new URLSearchParams(location.search).get("room");

  const { room, loading, error } = useRoomDetails(roomId);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center">
        <h2 className="text-xl mb-4">
          {t("reservation.loading", "Cargando detalles de la habitación...")}
        </h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center">
        <h2 className="text-xl text-destructive mb-4">
          {t("reservation.errors.error", "Error:")} {error}
        </h2>
        <Button
          variant="default"
          className="rounded-full bg-primary text-primary-foreground"
          onClick={() => navigate("/reserve")}
        >
          {t(
            "reservation.backToRooms",
            "Volver a la selección de habitaciones"
          )}
        </Button>
      </div>
    );
  }

  if (!roomId || !room) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center">
        <h1 className="text-2xl mb-4">
          {t("reservation.roomNotFound", "No se encontró la habitación")}
        </h1>
        <Button
          variant="default"
          className="rounded-full bg-primary text-primary-foreground"
          onClick={() => navigate("/reserve")}
        >
          {t("reservation.goToRoomSelection", "Ir a selección de habitaciones")}
        </Button>
      </div>
    );
  }

  const roomCategory =
    room.category ||
    (room.id.startsWith("1")
      ? t("reservation.roomTypes.gaming", "Gaming")
      : room.id.startsWith("2")
      ? t("reservation.roomTypes.thinking", "Thinking")
      : t("reservation.roomTypes.working", "Working"));

  return (
    <div className="min-h-screen bg-background text-foreground pb-16">
      <div>
        <Header title={`${t("reservation.room")} ${room.id}`} showBackButton={true}/>
      </div>

      <div className="px-4 mb-4">
        <ImageCarousel
          images={room.images}
          alt={`${roomCategory} ${t("reservation.room", "Room")} ${room.id}`}
        />
      </div>
      <div className="px-4 mb-6">
        <DetailsCard
          capacity={room.capacity}
          hourlyRate={room.hourlyRate}
          equipment={room.equipment}
        />
      </div>
      <div className="px-4 mb-6">
        <BookingSection
          room={room}
          price={room.hourlyRate}
          hours={1}
          sliderValue={[1]}
          reservation={{ selectedDate: "", selectedTime: "" }}
          onSliderChange={() => {}}
          onUpdateRoomDetails={() => {}}
          getHourText={() => ""}
        />
      </div>
      <BottomNavBar />
    </div>
  );
}
