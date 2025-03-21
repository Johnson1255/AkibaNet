// src/components/FoodPage/Header.tsx
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Header: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <header className="p-4 flex items-center justify-between bg-background border-b border-border">
      <Button
        onClick={() => navigate(-1)}
        variant="ghost"
        size="icon"
        className="rounded-full"
      >
        <ArrowLeft className="h-6 w-6" />
      </Button>
      <h1 className="text-2xl font-normal">{t("food.name")}</h1>
      <div className="w-10" /> {/* Spacer for alignment */}
    </header>
  );
};