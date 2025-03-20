// src/components/AdditionalServicesPage/Header.tsx
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface HeaderProps {
  navigate: (delta: number) => void;
}

export const Header: React.FC<HeaderProps> = ({ navigate }) => {
  const { t } = useTranslation();
  return (
    <header className="p-4 flex items-center justify-between bg-card">
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-6 w-6" />
      </Button>
      <h1 className="text-2xl font-normal">{t('reservation.addServices')}</h1>
      <div className="w-10" /> {/* Spacer for alignment */}
    </header>
  );
};