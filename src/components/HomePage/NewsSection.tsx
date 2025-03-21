import { Card } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

export default function NewsSection() {
  const { t } = useTranslation();

  return (
    <div className="px-6">
      <h2 className="text-2xl font-bold mb-4">{t('home.news.title')}</h2>
      <div className="space-y-4">
        <Card className="p-6 rounded-3xl border-2 bg-card text-card-foreground">
          <h3 className="text-xl font-bold italic mb-2">{t('home.news.gaming.title')}</h3>
          <p className="text-lg">{t('home.news.gaming.description')}</p>
        </Card>
        <Card className="p-6 rounded-3xl border-2 bg-card text-card-foreground">
          <h3 className="text-xl font-bold italic mb-2">{t('home.news.art.title')}</h3>
          <p className="text-lg">{t('home.news.art.description')}</p>
        </Card>
        <Card className="p-6 rounded-3xl border-2 bg-card text-card-foreground">
          <h3 className="text-xl font-bold italic mb-2">{t('home.news.lol.title')}</h3>
          <p className="text-lg">{t('home.news.lol.description')}</p>
        </Card>
      </div>
    </div>
  );
}
