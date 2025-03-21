import { useTranslation } from "react-i18next";

interface WelcomeSectionProps {
  userName: string;
}

export default function WelcomeSection({ userName }: WelcomeSectionProps) {
  const { t } = useTranslation();

  return (
    <div className="px-6 py-8">
      <h1 className="text-2xl font-normal text-center leading-tight">
        {t('home.welcome', { name: userName })}<br />
        {t('home.whatToDo')}
      </h1>
    </div>
  );
}
