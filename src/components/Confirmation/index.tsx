import { useTranslation } from "react-i18next";
import BottomNavBar from "@/components/common/BottomNavbar";
import { useLoadReservation } from "@/hooks/useLoadReservation";
import { Header } from "@/components/common/Header";
import { ConfirmationMessage } from "@/components/Confirmation/ConfirmationMessage";
import { ReservationDetails } from "@/components/Confirmation/ReservationDetails";
import { ServicesList } from "@/components/Confirmation/ServicesList";
import { TotalSummary } from "@/components/Confirmation/TotalSummary";
import { BottomActions } from "@/components/Confirmation/BottomActions";
import { Button } from "@/components/ui/button";

export default function Confirmation() {
  const { t } = useTranslation();
  const savedReservation = useLoadReservation();

  // Si no hay reservación guardada, mostrar mensaje de error o redireccionar
  if (!savedReservation) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center">
        <h2 className="text-xl mb-4">{t("confirmation.notFound")}</h2>
        <Button
          variant="default"
          className="rounded-full bg-primary text-primary-foreground"
          onClick={() => (window.location.href = "/reserve")}
        >
          {t("confirmation.newReservation")}
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-background text-foreground pb-16">
        <Header title={t("confirmation.title")} showBackButton={true} />
        <ConfirmationMessage />
        <ReservationDetails reservation={savedReservation} />
        <ServicesList services={savedReservation.services} />
        <TotalSummary reservation={savedReservation} />
        <BottomActions />
      </div>
      <BottomNavBar />
    </>
  );
}
