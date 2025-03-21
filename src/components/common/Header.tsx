import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  translationKey?: string;
  onBackClick?: () => void;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = true,
  translationKey,
  onBackClick,
  className = "bg-background border-b border-border",
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleBack = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate(-1);
    }
  };

  return (
    <header className={`p-4 flex items-center justify-between ${className}`}>
      {showBackButton ? (
        <Button
          onClick={handleBack}
          variant="ghost"
          size="icon"
          className="rounded-full"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
      ) : (
        <div className="w-10" />
      )}
      <h1 className="text-2xl font-normal">
        {translationKey ? t(translationKey) : title}
      </h1>
      <div className="w-10" /> {/* Spacer for alignment */}
    </header>
  );
};
