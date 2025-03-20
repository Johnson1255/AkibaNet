import { useTranslation } from "react-i18next";

export const PageHeader: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <header className="p-4 bg-background border-b border-border">
      <h1 className="text-2xl font-medium text-center">
        {t("activeReservation.title")}
      </h1>
    </header>
  );
};