import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const Header: React.FC = () => {
  const { t } = useTranslation();
  return (
    <header className="p-4 flex items-center justify-between bg-background border-b border-border">
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full"
        onClick={() => window.location.href = "/home"}
      >
        <ArrowLeft className="h-6 w-6" />
      </Button>
      <h1 className="text-2xl font-normal">{t('confirmation.title')}</h1>
      <div className="w-10" /> {/* Espaciador para alineación */}
    </header>
  );
};