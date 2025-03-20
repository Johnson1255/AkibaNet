/**
 * @module CafeHome
 * @description Página principal del café, donde los usuarios pueden acceder a diferentes opciones como
 * pedir ayuda, hacer reservas o pedir comida. También incluye una sección de noticias.
 */

import { HelpCircle, Coffee, Pizza } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import BottomNavBar from "@/components/BottomNavbar";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";

/**
 * Componente principal de la página de inicio del café.
 * 
 * @returns {JSX.Element} Página principal con opciones de navegación y noticias.
 */
export default function CafeHome() {
  /** Obtiene el usuario autenticado del contexto de autenticación */
  const { user } = useAuth();

  /** Hook para manejar traducciones */
  const { t } = useTranslation();
  
  /** Nombre del usuario autenticado o un valor predeterminado */
  const userName = user?.name || t('account.profile.defaultUser');
  
  return (
    <div className="min-h-screen bg-background text-foreground pb-16">
      {/* Contenido principal */}
      <main className="pb-16">
        
        {/* Sección de bienvenida */}
        <div className="px-6 py-8">
          <h1 className="text-2xl font-normal text-center leading-tight">
            {t('home.welcome', { name: userName })}<br />
            {t('home.whatToDo')}
          </h1>
        </div>

        {/* Botones de acción */}
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

        {/* Sección de noticias */}
        <div className="px-6">
          <h2 className="text-2xl font-bold mb-4">{t('home.news.title')}</h2>
          <div className="space-y-4">
            
            {/* Tarjeta de noticias - Gaming */}
            <Card className="p-6 rounded-3xl border-2 bg-card text-card-foreground">
              <h3 className="text-xl font-bold italic mb-2">{t('home.news.gaming.title')}</h3>
              <p className="text-lg">{t('home.news.gaming.description')}</p>
            </Card>

            {/* Tarjeta de noticias - Arte */}
            <Card className="p-6 rounded-3xl border-2 bg-card text-card-foreground">
              <h3 className="text-xl font-bold italic mb-2">{t('home.news.art.title')}</h3>
              <p className="text-lg">{t('home.news.art.description')}</p>
            </Card>

            {/* Tarjeta de noticias - League of Legends */}
            <Card className="p-6 rounded-3xl border-2 bg-card text-card-foreground">
              <h3 className="text-xl font-bold italic mb-2">{t('home.news.lol.title')}</h3>
              <p className="text-lg">{t('home.news.lol.description')}</p>
            </Card>
          </div>
        </div>
      </main>
      
      {/* Barra de navegación inferior */}
      <BottomNavBar />
    </div>
  );
}
