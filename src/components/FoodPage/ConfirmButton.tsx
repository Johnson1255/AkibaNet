// src/components/FoodPage/ConfirmButton.tsx
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

interface ConfirmButtonProps {
  confirmProducts: () => void;
}

export const ConfirmButton: React.FC<ConfirmButtonProps> = ({ confirmProducts }) => {
  const { t } = useTranslation();
  return (
    <div className="px-6 py-4 flex flex-col items-center text-center">
      <Button
        variant="default"
        className="w-full bg-primary text-primary-foreground rounded-xl h-12"
        onClick={confirmProducts}
      >
        {t("food.confirmButton")}
      </Button>
    </div>
  );
};