import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useReservation } from "@/context/ReservationContext";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/common/Header";
import { RoomSummary } from "@/components/AdditionalServicesPage/RoomSummary";
import { ServiceCategory } from "@/components/AdditionalServicesPage/ServiceCategory";
import { OrderSummary } from "@/components/AdditionalServicesPage/OrderSummary";
import { BottomActions } from "@/components/AdditionalServicesPage/BottomActions";
import type { ServicesByCategory, ApiService } from "@/types/services";
import { useFetchServices } from "@/hooks/useFetchServices";
import { useSyncSelectedServices } from "@/hooks/useSyncSelectedServices";
import { handleConfirmAndPay } from "@/utils/handleConfirmAndPay";
import { Button } from "@/components/ui/button";
import type { Reservation } from "@/types/reservation";

export default function AdditionalServicesPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { reservation, updateSelectedServices, updateRoomDetails } =
    useReservation();

  const [servicesByCategory, setServicesByCategory] =
    useState<ServicesByCategory>({
      gaming: [],
      working: [],
      thinking: [],
    });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedServices, setSelectedServices] = useState<Set<string>>(() => {
    return new Set(Array.from(reservation.selectedServices || []));
  });

  const roomId = reservation.roomId?.toString() || "";
  const baseHours = reservation.hours || 3;
  const hourlyRate = reservation.hourlyRate || 800;
  const baseRoomPrice = baseHours * hourlyRate;

  useFetchServices(setServicesByCategory, setIsLoading, setError);
  useSyncSelectedServices(
    selectedServices,
    reservation.selectedServices,
    updateSelectedServices
  );

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
    selectedServices.forEach((serviceId) => {
      for (const category in servicesByCategory) {
        const service = servicesByCategory[
          category as keyof ServicesByCategory
        ].find((s) => s.id === serviceId);
        if (service) {
          servicesTotal += service.price;
          break;
        }
      }
    });
    const total = servicesTotal + baseRoomPrice;
    return total;
  };

  const getSelectedServices = (): ApiService[] => {
    const selected: ApiService[] = [];
    selectedServices.forEach((serviceId) => {
      for (const category in servicesByCategory) {
        const service = servicesByCategory[
          category as keyof ServicesByCategory
        ].find((s) => s.id === serviceId);
        if (service) {
          selected.push(service);
          break;
        }
      }
    });
    return selected;
  };

  // Create an enhanced reservation object with all required properties for handleConfirmAndPay
  const enhancedReservation: Reservation = {
    ...reservation,
    id: reservation.id || "temp-id",
    roomName: reservation.roomName || "Selected Room",
    date: reservation.selectedDate || new Date().toISOString().split("T")[0],
    baseRoomPrice: baseRoomPrice,
    servicesByCategory: servicesByCategory,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-xl">{t("reservation.loading")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <p className="text-xl text-red-500">
          {t("reservation.errors.error")} {error}
        </p>
        <Button className="mt-4" onClick={() => window.location.reload()}>
          {t("common.retry")}
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-background">
        <Header title={t("services.title")} showBackButton={true} />
        <RoomSummary
          reservation={enhancedReservation}
          roomId={roomId}
          baseRoomPrice={baseRoomPrice}
        />
        <div className="p-4 space-y-8">
          <ServiceCategory
            title={t("services.categories.gaming")}
            services={servicesByCategory.gaming}
            selectedServices={selectedServices}
            toggleService={toggleService}
          />
          <ServiceCategory
            title={t("services.categories.thinking")}
            services={servicesByCategory.thinking}
            selectedServices={selectedServices}
            toggleService={toggleService}
          />
          <ServiceCategory
            title={t("services.categories.working")}
            services={servicesByCategory.working}
            selectedServices={selectedServices}
            toggleService={toggleService}
          />
        </div>
        <OrderSummary
          roomId={roomId}
          baseRoomPrice={baseRoomPrice}
          selectedServices={getSelectedServices()}
          calculateTotal={calculateTotal}
        />
        <BottomActions
          handleConfirmAndPay={() =>
            handleConfirmAndPay({
              reservation: enhancedReservation,
              selectedServices,
              roomId,
              navigate,
              updateRoomDetails,
              t,
            })
          }
        />
      </div>
    </>
  );
}
