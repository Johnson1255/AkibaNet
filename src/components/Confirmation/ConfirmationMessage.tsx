import { useTranslation } from "react-i18next";
import { Check } from "lucide-react";

export const ConfirmationMessage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="p-8 flex flex-col items-center text-center">
      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
        <Check className="h-8 w-8 text-white" />
      </div>
      <h2 className="text-2xl font-bold mb-2">{t('confirmation.success')}</h2>
      <p className="text-muted-foreground">
        {t('confirmation.successMessage')}
      </p>
    </div>
  );
};