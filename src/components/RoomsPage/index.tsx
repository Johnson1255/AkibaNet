import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import BottomNavBar from "@/components/common/BottomNavbar";
import TimeDateCategorySelectors from "@/components/RoomsPage/TimeDateCategorySelectors";
import RoomGrid from "@/components/RoomsPage/RoomGrid";
import useRoomSelection from "@/hooks/useRoomSelection";
import { Header } from "../common/Header";

export default function RoomSelection() {
  const { t } = useTranslation();
  const {
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
  } = useRoomSelection();

  return (
    <div className="min-h-screen bg-background text-foreground pb-16">
      <Header title={t("room.title")} showBackButton={true} />
      <TimeDateCategorySelectors
        selectedTime={selectedTime}
        selectedDate={selectedDate}
        selectedCategory={selectedCategory}
        handleTimeChange={handleTimeChange}
        handleDateChange={handleDateChange}
        handleCategoryChange={handleCategoryChange}
      />
      <RoomGrid
        rooms={rooms}
        selectedRoom={selectedRoom}
        selectedCategory={selectedCategory}
        handleRoomSelect={handleRoomSelect}
        loading={loading}
        error={error}
      />
      <div className="px-6 py-4 flex justify-between">
        <Button
          variant="default"
          className="flex-1 rounded-full bg-primary text-primary-foreground h-12"
          disabled={!selectedRoom}
          onClick={() => {
            if (selectedRoom) {
              goToRoomDetails(selectedRoom);
            }
          }}
        >
          {selectedRoom
            ? `Room ${selectedRoom} - ${selectedTime}, ${selectedDate?.toLocaleDateString()}`
            : t("room.name")}
          <ArrowRight className="w-6 h-6" />
        </Button>
      </div>
      <BottomNavBar />
    </div>
  );
}
