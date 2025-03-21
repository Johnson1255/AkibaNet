import { Info } from "lucide-react";
import { useTranslation } from "react-i18next";
export default function PolicyNotice() {
  const { t } = useTranslation();

  return (
    <div className="bg-secondary p-3 rounded-lg mb-4 flex items-start">
      <Info className="h-5 w-5 primary mr-2 mt-0.5" />
      <p className="primary text-sm">{t("activeReservation.policyNotice")}</p>
    </div>
  );
}
