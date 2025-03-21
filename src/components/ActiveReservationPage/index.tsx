import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import BottomNavBar from "@/components/common/BottomNavbar";
import { useActiveReservation } from "@/hooks/useActiveReservation";
import { Header } from "@/components/common/Header";
import { ReservationInfoCard } from "./ReservationInfoCard";
import { ServicesCard } from "./ServicesCard";
import { ProductsCard } from "./ProductsCard";
import { HomeButton } from "./HomeButton";
import PolicyNotice from "@/components/ActiveReservationPage/PolicyNotice";

export default function ActiveReservationPage() {
  const { t } = useTranslation();
  const [showPolicyNotice, setShowPolicyNotice] = useState(true);
  const { activeReservation, handleReservationAction, getActionButtonText } =
    useActiveReservation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPolicyNotice(false)
    }, 5000)
    return () => clearTimeout(timer)
  }, [])

  const title = t("activeReservation.title");
  
  if (!activeReservation) {
    return <div>{t("activeReservation.notFound")}</div>;
  }
  
  const isReservationEnded = new Date() > new Date(activeReservation.endTime);

  return (
    <div className="min-h-screen bg-background text-foreground pb-16">
      <Header title={title} showBackButton={true} />
      <div className="p-4">
        {!isReservationEnded && showPolicyNotice && (
          <PolicyNotice />
        )}
        <ReservationInfoCard
          reservation={activeReservation}
          onAction={handleReservationAction}
          actionButtonText={getActionButtonText(t)}
        />
        <ServicesCard services={activeReservation.services ?? []} />
        <ProductsCard products={activeReservation.products ?? []} />
        <HomeButton />
      </div>
      <BottomNavBar />
    </div>
  );
}
