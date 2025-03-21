import BottomNavBar from "@/components/common/BottomNavbar";
import { Header } from "@/components/common/Header";
import { ServiceGrid } from "./ServiceGrid";
import { RequestForm } from "./RequestForm";
import { useTranslation } from "react-i18next";

export default function HelpServicesPage() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <Header title={t("help.title")} showBackButton={true} />
      <ServiceGrid />
      <RequestForm />
      <BottomNavBar />
    </div>
  );
}
