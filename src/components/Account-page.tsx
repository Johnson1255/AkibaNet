import { ArrowLeft, User as UserIcon, ChevronRight, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import BottomNavBar from "./Bottom-navbar"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { getUserProfile } from "../services/authService"
import { useTranslation } from "react-i18next"

export default function AccountPage() {
  const { t, i18n } = useTranslation();
  const { user, token, login, logout } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      // Solo hacer la petición si tenemos token pero no tenemos los datos completos del usuario
      if (token && (!user?.name || !user?.email)) {
        try {
          const profileData = await getUserProfile(token);
          
          // Actualizar los datos del usuario con la información completa
          if (profileData) {
            login(token, profileData);
          }
        } catch (error) {
          console.error("Error al obtener perfil del usuario:", error);
          // Si hay un error, usamos los datos que ya tenemos en localStorage
        }
      }
    };
    
    fetchUserProfile();
  }, [token, user, login]);
  
  const handleLogout = () => {
    logout();
    navigate("/login");
  }

  // Generar URL del avatar usando robohash con el nombre del usuario o un valor predeterminado
  const generateAvatarUrl = () => {
    const seed = user?.name || t('account.profile.defaultUser');
    return `https://robohash.org/${encodeURIComponent(seed)}.png?set=set3`;
  };

  // Función para cambiar el idioma
  const handleLanguageChange = () => {
    const newLang = i18n.language === 'en' ? 'es' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <div className="min-h-screen bg-white pb-16">
      {/* Header */}
      <header className="p-4 flex items-center justify-between">
        <Button variant="ghost" size="icon" className="rounded-full">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-normal">{t('account.title')}</h1>
        <div className="w-10" /> {/* Spacer for alignment */}
      </header>

      {/* Profile Section */}
      <div className="px-6 py-4 flex items-center gap-4">
        <div className="w-16 h-16 bg-gray-100 rounded-full overflow-hidden">
          <img 
            src={generateAvatarUrl()} 
            alt="Avatar de perfil" 
            className="w-full h-full object-cover"
            onError={(e) => {
              // Si hay error al cargar la imagen, mostrar icono predeterminado
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center"><svg class="w-8 h-8 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg></div>';
            }}
          />
        </div>
        <div>
          <h2 className="text-xl font-normal">{user?.name || t('account.profile.defaultUser')}</h2>
          <p className="text-gray-500">{user?.email || t('errors.emailNotAvailable')}</p>
        </div>
      </div>

      <Separator className="my-4" />

      {/* Reservation History */}
      <div className="px-6 py-4">
        <h2 className="text-2xl font-bold mb-4">{t('reservation.history')}</h2>
        <div className="space-y-3">
          <div className="border rounded-xl p-4 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-normal">Gaming Room #24</h3>
              <p className="text-gray-500">2025-01-15 | 2 {t('reservation.hours')}</p>
            </div>
            <span className="text-lg">¥ 1700</span>
          </div>
          <div className="border rounded-xl p-4 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-normal">Gaming Room #5</h3>
              <p className="text-gray-500">2025-01-18 | 2 {t('reservation.hours')}</p>
            </div>
            <span className="text-lg">¥ 1700</span>
          </div>
        </div>
        <Button variant="ghost" className="w-full mt-2 text-gray-500">
          {t('reservation.viewAll')} <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* Settings */}
      <div className="px-6 py-4">
        <h2 className="text-2xl font-bold mb-4">{t('settings.title')}</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b">
            <span className="text-lg">{t('settings.language')}</span>
            <Button variant="ghost" className="text-gray-500" onClick={handleLanguageChange}>
              {i18n.language === 'en' ? 'English' : 'Español'} <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center justify-between py-2 border-b">
            <span className="text-lg">{t('settings.notifications')}</span>
            <Switch />
          </div>
          {/* <div className="flex items-center justify-between py-2 border-b">
            <span className="text-lg">{t('settings.paymentMethods')}</span>
            <Button variant="ghost" className="text-gray-500">
              ****5831 <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div> */}
        </div>
      </div>

      {/* Log Out Button */}
      <div className="px-6 py-4">
        <Button 
          variant="default" 
          className="w-full bg-black text-white rounded-xl h-12"
          onClick={handleLogout}
        >
          {t('buttons.logout')} <LogOut className="ml-2 h-4 w-4" />
        </Button>
      </div>
      <BottomNavBar />
    </div>
  )
}