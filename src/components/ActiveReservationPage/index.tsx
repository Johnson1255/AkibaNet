import { useTranslation } from "react-i18next";
import BottomNavBar from "@/components/BottomNavbar";
import { useActiveReservation } from "@/hooks/useActiveReservation";
import { PageHeader } from "./PageHeader";
import { ReservationInfoCard } from "./ReservationInfoCard";
import { ServicesCard } from "./ServicesCard";
import { ProductsCard } from "./ProductsCard";
import { HomeButton } from "./HomeButton";

function ActiveReservationPage() {
  const { t } = useTranslation();
  const { activeReservation, handleReservationAction, getActionButtonText } = useActiveReservation();

  if (!activeReservation) {
    return <div>{t("activeReservation.notFound")}</div>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-16">
      <PageHeader />
      
      <div className="p-4">
        <ReservationInfoCard 
          reservation={activeReservation} 
          onAction={handleReservationAction}
          actionButtonText={getActionButtonText(t)}
        />
        
        <ServicesCard services={activeReservation.services} />
        
        <ProductsCard products={activeReservation.products} />
        
        <HomeButton />
      </div>
      
      <BottomNavBar />
    </div>
  );
}

export default ActiveReservationPage;