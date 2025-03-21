import { HelpCircle, Coffee, Pizza } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function ActionButtons() {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-3 gap-4 px-6 mb-8">
      <Link to="/help-services" className="flex flex-col items-center p-4 bg-secondary hover:bg-secondary/80 rounded-2xl transition-colors">
        <HelpCircle className="w-8 h-8 mb-2" />
        <span>{t('home.actionButtons.help')}</span>
      </Link>
      <Link to="/reserve" className="flex flex-col items-center p-4 bg-secondary hover:bg-secondary/80 rounded-2xl transition-colors">
        <Coffee className="w-8 h-8 mb-2" />
        <span>{t('home.actionButtons.reserve')}</span>
      </Link>
      <Link to="/food" className="flex flex-col items-center p-4 bg-secondary hover:bg-secondary/80 rounded-2xl transition-colors">
        <Pizza className="h-8 w-8 mb-2" />
        <span>{t('home.actionButtons.food')}</span>
      </Link>
    </div>
  );
}
