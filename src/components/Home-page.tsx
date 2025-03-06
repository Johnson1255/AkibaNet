import { HelpCircle, Coffee, Pizza } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Link } from "react-router-dom"
import BottomNavBar from "./Bottom-navbar"
import { useAuth } from "@/context/AuthContext"
import { useTranslation } from "react-i18next"

export default function CafeHome() {
  const { user } = useAuth();
  const { t } = useTranslation();
  
  // Nombre del usuario o valor predeterminado
  const userName = user?.name || t('account.profile.defaultUser');
  
  return (
    <div className="min-h-screen bg-white pb-16">
      {/* Main Content */}
      <main className="pb-16">
        {/* Welcome Section */}
        <div className="px-6 py-8">
          <h1 className="text-2xl font-normal text-center leading-tight">
            {t('home.welcome', { name: userName })}<br />
            {t('home.whatToDo')}
          </h1>
        </div>
        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-4 px-6 mb-8">
          <Link to="/help-services" className="flex flex-col items-center p-4 bg-gray-100 rounded-2xl">
            <HelpCircle className="w-8 h-8 mb-2" />
            <span>{t('home.actionButtons.help')}</span>
          </Link>
          <Link to="/reserve" className="flex flex-col items-center p-4 bg-gray-100 rounded-2xl">
            <Coffee className="w-8 h-8 mb-2" />
            <span>{t('home.actionButtons.reserve')}</span>
          </Link>
          <Link to="/food" className="flex flex-col items-center p-4 bg-gray-100 rounded-2xl">
            <Pizza className="h-8 w-8 mb-2" />
            <span>{t('home.actionButtons.food')}</span>
          </Link>
        </div>
        {/* News Section */}
        <div className="px-6">
          <h2 className="text-2xl font-bold mb-4">{t('home.news.title')}</h2>
          <div className="space-y-4">
            <Card className="p-6 rounded-3xl border-2">
              <h3 className="text-xl font-bold italic mb-2">{t('home.news.gaming.title')}</h3>
              <p className="text-lg">{t('home.news.gaming.description')}</p>
            </Card>

            <Card className="p-6 rounded-3xl border-2">
              <h3 className="text-xl font-bold italic mb-2">{t('home.news.art.title')}</h3>
              <p className="text-lg">{t('home.news.art.description')}</p>
            </Card>

            <Card className="p-6 rounded-3xl border-2">
              <h3 className="text-xl font-bold italic mb-2">{t('home.news.lol.title')}</h3>
              <p className="text-lg">{t('home.news.lol.description')}</p>
            </Card>
          </div>
        </div>
      </main>
      <BottomNavBar />
    </div>
  )
}