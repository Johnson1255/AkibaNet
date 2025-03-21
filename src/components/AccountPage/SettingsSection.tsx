import { ChevronRight, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useTranslation } from "react-i18next";

interface SettingsSectionProps {
  theme: string;
  language: string;
  onLanguageChange: () => void;
  onThemeChange: () => void;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  theme,
  language,
  onLanguageChange,
  onThemeChange
}) => {
  const { t } = useTranslation();
  
  return (
    <div className="px-6 py-4">
      <h2 className="text-2xl font-bold mb-4">{t('settings.title')}</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between py-2 border-b">
          <span className="text-lg">{t('settings.language')}</span>
          <Button variant="ghost" className="text-gray-500" onClick={onLanguageChange}>
            {language === 'en' ? 'English' : 'Español'} <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center justify-between py-2 border-b">
          <span className="text-lg">{t('settings.theme')}</span>
          <div className="flex items-center gap-2">
            {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={onThemeChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};